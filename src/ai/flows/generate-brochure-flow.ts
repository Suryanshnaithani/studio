
'use server';
/**
 * @fileOverview Generates or enhances content for a real estate brochure using AI,
 * leveraging existing user input. Can target the entire brochure or specific sections.
 *
 * - generateBrochureContent - A function that triggers the brochure content generation/enhancement flow.
 * - GenerateBrochureInput - The input type, including an optional hint, existing data, and an optional section target.
 * - GenerateBrochureOutput - The output type (matches BrochureDataSchema).
 */

import {ai} from '@/ai/genkit';
import {BrochureDataSchema, type BrochureData} from '@/components/brochure/data-schema';
import {z} from 'genkit';

// Input schema: Optional hint + optional existing partial data + optional section target
const GenerateBrochureInputSchema = z.object({
  promptHint: z.string().optional().describe('Optional high-level hint for the AI (e.g., "Focus on eco-friendly features", "Luxury downtown apartments").'),
  existingData: BrochureDataSchema.partial().optional().describe('Partial brochure data provided by the user to be completed or enhanced.'),
  sectionToGenerate: z.enum([
    'introduction',
    'developer',
    'location',
    'connectivity',
    'amenitiesIntro',
    'amenitiesListTitle', // Specific for titles if lists are data-driven
    'amenitiesGridTitle', // Specific for titles
    'specificationsTitle',  // Specific for titles
    'masterPlan',
    'floorPlansTitle'     // Specific for titles
  ]).optional().describe('Specifies which section of the brochure to focus on for AI generation. If not provided, AI may enhance the whole document or based on promptHint.')
});
export type GenerateBrochureInput = z.infer<typeof GenerateBrochureInputSchema>;

// Output schema is the existing BrochureDataSchema
export type GenerateBrochureOutput = BrochureData;

// Exported wrapper function to call the flow
export async function generateBrochureContent(input: GenerateBrochureInput): Promise<GenerateBrochureOutput> {
  console.log("Calling generateBrochureFlow with input:", input);
  const result = await generateBrochureFlow(input);
  console.log("generateBrochureFlow result:", result);
  // Ensure the output conforms to the schema, applying defaults for missing fields
  const validatedResult = BrochureDataSchema.parse(result);
  console.log("Validated generateBrochureFlow result:", validatedResult);
  return validatedResult;
}

// Define the prompt
const generateContentPrompt = ai.definePrompt({
  name: 'generateBrochureContentPrompt',
  input: {schema: GenerateBrochureInputSchema},
  output: {schema: BrochureDataSchema},
  prompt: `You are an expert real estate copywriter and marketing assistant.
Your primary goal is to generate or refine content for a real estate brochure based *strictly* on the provided 'existingData'.
You will be given 'existingData', which might be sparse or partially filled.

{{#if sectionToGenerate}}
You are focusing *only* on generating or refining the content for the '{{sectionToGenerate}}' section.
Use *only* the data relevant to this section from 'existingData' to write compelling copy for the specified fields within this section.
YOU MUST PRESERVE ALL OTHER DATA from 'existingData' as is. DO NOT MODIFY ANY OTHER SECTIONS OR FIELDS.
Return the complete brochure data object, with changes *only* in the '{{sectionToGenerate}}' section's target text fields.

  {{#eq sectionToGenerate "introduction"}}
    **Instruction:** Generate 'introTitle', 'introParagraph1', 'introParagraph2', and 'introParagraph3'.
    Base these *solely* on 'existingData.projectName', 'existingData.projectTagline', and potentially relevant context from 'existingData.locationDesc1', 'existingData.locationDesc2', and 'existingData.developerName' if provided in 'existingData'.
    DO NOT HALLUCINATE or invent details, features, themes, or descriptions not *directly specified* or strongly implied by these fields in 'existingData'.
    If 'existingData' lacks information for these fields or related source fields, the introduction should remain generic and reflect only what *is* known.
    **Fields to update:** introTitle, introParagraph1, introParagraph2, introParagraph3.
    **Source fields from existingData:** projectName, projectTagline, locationDesc1, locationDesc2, developerName.
  {{/eq}}

  {{#eq sectionToGenerate "developer"}}
    **Instruction:** Generate compelling descriptions for 'developerDesc1' and 'developerDesc2'.
    Base these *strictly* on 'existingData.developerName'.
    The descriptions should be professional. If the developer's name implies a focus (e.g., "Green Living Developers"), you can use general phrasing related to that focus (e.g., "commitment to sustainability") but DO NOT invent specific facts, projects, or awards.
    **Fields to update:** developerDesc1, developerDesc2.
    **Source fields from existingData:** developerName.
  {{/eq}}

  {{#eq sectionToGenerate "location"}}
    **Instruction:** Generate engaging descriptions for 'locationDesc1' and 'locationDesc2'.
    Base these *strictly* on 'existingData.locationTitle' and the list of 'existingData.keyDistances'.
    Summarize the key advantages of the location as highlighted by the title and distances. Do not invent landmarks or features not listed.
    **Fields to update:** locationDesc1, locationDesc2.
    **Source fields from existingData:** locationTitle, keyDistances.
  {{/eq}}

  {{#eq sectionToGenerate "connectivity"}}
    **Instruction:** Generate a concise 'connectivityNote'.
    Base this *strictly* on the provided 'existingData.connectivityPointsBusiness', 'existingData.connectivityPointsHealthcare', 'existingData.connectivityPointsEducation', and 'existingData.connectivityPointsLeisure'.
    The note should be a general summary statement about the project's connectivity based on these points.
    **Fields to update:** connectivityNote.
    **Source fields from existingData:** connectivityPointsBusiness, connectivityPointsHealthcare, connectivityPointsEducation, connectivityPointsLeisure.
  {{/eq}}

  {{#eq sectionToGenerate "amenitiesIntro"}}
    **Instruction:** Generate engaging introductory paragraphs: 'amenitiesIntroP1', 'amenitiesIntroP2', and 'amenitiesIntroP3'.
    Base these *strictly* on the items listed in 'existingData.amenitiesWellness' and 'existingData.amenitiesRecreation'.
    Summarize the types of amenities offered and their general benefits. Do not invent amenities not listed.
    **Fields to update:** amenitiesIntroP1, amenitiesIntroP2, amenitiesIntroP3.
    **Source fields from existingData:** amenitiesWellness, amenitiesRecreation.
  {{/eq}}

  {{#eq sectionToGenerate "amenitiesListTitle"}}
    **Instruction:** Refine 'amenitiesListTitle'.
    If 'existingData.amenitiesListTitle' is generic (e.g., "Amenities"), create a more descriptive title based *strictly* on the general theme implied by 'existingData.amenitiesWellness' and 'existingData.amenitiesRecreation' lists. For example, if lists contain "Pool", "Gym", "Spa", a title could be "Wellness and Recreation Hub". Do not invent specific themes if not clearly implied.
    **Field to update:** amenitiesListTitle.
    **Source fields from existingData:** amenitiesWellness, amenitiesRecreation.
  {{/eq}}

  {{#eq sectionToGenerate "amenitiesGridTitle"}}
    **Instruction:** Refine 'amenitiesGridTitle'.
    If 'existingData.amenitiesGridTitle' is generic, create a more descriptive title based *strictly* on 'existingData.amenitiesGridLabel1' through 'existingData.amenitiesGridLabel4'. For example, if labels are "Gym", "Lounge", "Garden", "Play Area", a title could be "Signature Lifestyle Spaces".
    **Field to update:** amenitiesGridTitle.
    **Source fields from existingData:** amenitiesGridLabel1, amenitiesGridLabel2, amenitiesGridLabel3, amenitiesGridLabel4.
  {{/eq}}

  {{#eq sectionToGenerate "specificationsTitle"}}
    **Instruction:** Refine 'specsTitle'.
    If 'existingData.specsTitle' is generic, create a more descriptive title based *strictly* on the general nature of items in 'existingData.specsInterior' and 'existingData.specsBuilding'. For example, if specs mention "Marble Flooring", "Smart Home", title could be "Premium Finishes and Modern Features".
    **Field to update:** specsTitle.
    **Source fields from existingData:** specsInterior, specsBuilding.
  {{/eq}}

  {{#eq sectionToGenerate "masterPlan"}}
    **Instruction:** Generate descriptions for 'masterPlanDesc1' and 'masterPlanDesc2'.
    Base these *strictly* on 'existingData.masterPlanTitle' and the general context of 'existingData.projectName'. If 'masterPlanTitle' is "Site Master Plan", describe general benefits of a well-thought-out master plan for a project like the one implied by 'projectName' (e.g., "optimizing space and greenery").
    Do not invent specific features of the master plan not described in 'existingData'.
    **Fields to update:** masterPlanDesc1, masterPlanDesc2.
    **Source fields from existingData:** masterPlanTitle, projectName.
  {{/eq}}

  {{#eq sectionToGenerate "floorPlansTitle"}}
    **Instruction:** Refine 'floorPlansTitle'.
    If 'existingData.floorPlansTitle' is generic, create a more descriptive title based *strictly* on the types of floor plans present in 'existingData.floorPlans' (e.g., by summarizing the range of 'name' or 'area' like "Spacious 2, 3 & 4 Bedroom Residences").
    **Field to update:** floorPlansTitle.
    **Source fields from existingData (array):** floorPlans (inspect .name, .area properties of items).
  {{/eq}}

{{else}}
  You are enhancing the entire brochure. Review all text fields in 'existingData' and refine them for clarity, engagement, and professionalism, adhering strictly to the facts provided.
  For the introduction (introTitle, introParagraph1, introParagraph2, introParagraph3), base it *solely* on 'existingData.projectName', 'existingData.projectTagline', and any relevant location or developer details from 'existingData'. DO NOT HALLUCINATE.
{{/if}}

**Overall Rules (apply always):**
1.  **Strict Adherence to Provided Facts:** YOU MUST use the exact information present in 'existingData' as the source of truth. DO NOT invent features, amenities, characteristics, or locations not explicitly mentioned or strongly implied by 'existingData'.
2.  **Expand and Elaborate ONLY on Provided Information for the targeted fields.**
3.  **Professional Quality & Tone:** Ensure all text is grammatically correct, well-structured, engaging, and uses professional real estate marketing language.
4.  **Image Handling (CRITICAL):** All image fields (e.g., 'coverImage', 'floorPlans.image') are user-provided. If an image URL is present in 'existingData', YOU MUST use that exact URL. If an image URL is *missing* or an empty string, YOU MUST ensure that field is also an empty string in your output. DO NOT invent or generate any placeholder image URLs.
5.  **Schema Adherence:** Strictly adhere to the JSON output schema. Ensure all REQUIRED fields are populated. If not generating for a specific section, derive content from 'existingData' or use plausible generic content if 'existingData' is sparse.
6.  **Preservation of Other Data:** When 'sectionToGenerate' is specified, all fields in 'existingData' NOT explicitly targeted for update by the '{{sectionToGenerate}}' instruction MUST be returned UNCHANGED.

**Input Context:**

{{#if promptHint}}
User Hint (Use ONLY if it clarifies provided data for the '{{sectionToGenerate}}' section, or globally if no section specified. Do NOT treat as new information): {{{promptHint}}}
{{/if}}

**Existing Brochure Data (Strictly base all generated content on this. If 'sectionToGenerate' is specified, primarily update that section's text fields as per instructions above and preserve all other fields. For image fields, use the provided URL or ensure an empty string if no URL is given in existingData. DO NOT GENERATE IMAGE URLs.):**
Project Name: {{existingData.projectName}}
Tagline: {{existingData.projectTagline}}
RERA Info: {{existingData.reraInfo}}
Intro Title: {{existingData.introTitle}}
Intro P1: {{existingData.introParagraph1}}
Intro P2: {{existingData.introParagraph2}}
Intro P3: {{existingData.introParagraph3}}
Developer Name: {{existingData.developerName}}
Developer Desc1: {{existingData.developerDesc1}}
Developer Desc2: {{existingData.developerDesc2}}
Developer Disclaimer: {{existingData.developerDisclaimer}}
Location Title: {{existingData.locationTitle}}
Location Desc1: {{existingData.locationDesc1}}
Location Desc2: {{existingData.locationDesc2}}
Key Distances: {{#if existingData.keyDistances}}{{#each existingData.keyDistances}} - {{this}} {{/each}}{{else}} (not specified) {{/if}}
Map Disclaimer: {{existingData.mapDisclaimer}}
Location Note: {{existingData.locationNote}}
Connectivity Title: {{existingData.connectivityTitle}}
Connectivity Points (Business): {{#if existingData.connectivityPointsBusiness}}{{#each existingData.connectivityPointsBusiness}} - {{this}} {{/each}}{{else}} (not specified) {{/if}}
Connectivity Points (Healthcare): {{#if existingData.connectivityPointsHealthcare}}{{#each existingData.connectivityPointsHealthcare}} - {{this}} {{/each}}{{else}} (not specified) {{/if}}
Connectivity Points (Education): {{#if existingData.connectivityPointsEducation}}{{#each existingData.connectivityPointsEducation}} - {{this}} {{/each}}{{else}} (not specified) {{/if}}
Connectivity Points (Leisure): {{#if existingData.connectivityPointsLeisure}}{{#each existingData.connectivityPointsLeisure}} - {{this}} {{/each}}{{else}} (not specified) {{/if}}
Connectivity Note: {{existingData.connectivityNote}}
Connectivity District Label: {{existingData.connectivityDistrictLabel}}
Amenities Intro Title: {{existingData.amenitiesIntroTitle}}
Amenities Intro P1: {{existingData.amenitiesIntroP1}}
Amenities Intro P2: {{existingData.amenitiesIntroP2}}
Amenities Intro P3: {{existingData.amenitiesIntroP3}}
Amenities List Title: {{existingData.amenitiesListTitle}}
Amenities List Img Disclaimer: {{existingData.amenitiesListImageDisclaimer}}
Amenities Wellness: {{#if existingData.amenitiesWellness}}{{#each existingData.amenitiesWellness}} - {{this}} {{/each}}{{else}} (not specified) {{/if}}
Amenities Recreation: {{#if existingData.amenitiesRecreation}}{{#each existingData.amenitiesRecreation}} - {{this}} {{/each}}{{else}} (not specified) {{/if}}
Amenities Grid Title: {{existingData.amenitiesGridTitle}}
Amenities Grid Labels: {{existingData.amenitiesGridLabel1}}, {{existingData.amenitiesGridLabel2}}, {{existingData.amenitiesGridLabel3}}, {{existingData.amenitiesGridLabel4}}
Amenities Grid Disclaimer: {{existingData.amenitiesGridDisclaimer}}
Specs Title: {{existingData.specsTitle}}
Specs Img Disclaimer: {{existingData.specsImageDisclaimer}}
Specs Interior: {{#if existingData.specsInterior}}{{#each existingData.specsInterior}} - {{this}} {{/each}}{{else}} (not specified) {{/if}}
Specs Building: {{#if existingData.specsBuilding}}{{#each existingData.specsBuilding}} - {{this}} {{/each}}{{else}} (not specified) {{/if}}
Master Plan Title: {{existingData.masterPlanTitle}}
Master Plan Img Disclaimer: {{existingData.masterPlanImageDisclaimer}}
Master Plan Desc1: {{existingData.masterPlanDesc1}}
Master Plan Desc2: {{existingData.masterPlanDesc2}}
Floor Plans Title: {{existingData.floorPlansTitle}}
{{#each existingData.floorPlans}}
Floor Plan: {{this.name}} (Area: {{this.area}}) - Features: {{#if this.features}}{{#each this.features}} {{this}}; {{/each}}{{else}} (features not specified) {{/if}} Image URL: {{#if this.image}} {{this.image}} {{else}} (image not specified/empty) {{/if}}
{{/each}}
Floor Plans Disclaimer: {{existingData.floorPlansDisclaimer}}
Back Cover CTA: {{existingData.callToAction}}
Contact Title: {{existingData.contactTitle}}
Contact Phone: {{existingData.contactPhone}}
Contact Email: {{existingData.contactEmail}}
Contact Website: {{existingData.contactWebsite}}
Contact Address: {{existingData.contactAddress}}
Full Disclaimer: {{existingData.fullDisclaimer}}
RERA Disclaimer (Back): {{existingData.reraDisclaimer}}

**Image fields from existing data (use these if provided, otherwise ensure the field is an empty string. DO NOT GENERATE IMAGE URLS.):**
Cover Image URL: {{existingData.coverImage}}
Project Logo URL: {{existingData.projectLogo}}
Intro Watermark URL: {{existingData.introWatermark}}
Developer Image URL: {{existingData.developerImage}}
Developer Logo URL (main): {{existingData.developerLogo}}
Location Map Image URL: {{existingData.locationMapImage}}
Location Watermark URL: {{existingData.locationWatermark}}
Connectivity Image URL: {{existingData.connectivityImage}}
Connectivity Watermark URL: {{existingData.connectivityWatermark}}
Amenities Intro Watermark URL: {{existingData.amenitiesIntroWatermark}}
Amenities List Image URL: {{existingData.amenitiesListImage}}
Amenities Grid Image 1 URL: {{existingData.amenitiesGridImage1}}
Amenities Grid Image 2 URL: {{existingData.amenitiesGridImage2}}
Amenities Grid Image 3 URL: {{existingData.amenitiesGridImage3}}
Amenities Grid Image 4 URL: {{existingData.amenitiesGridImage4}}
Specs Image URL: {{existingData.specsImage}}
Specs Watermark URL: {{existingData.specsWatermark}}
Master Plan Image URL: {{existingData.masterPlanImage}}
Back Cover Image URL: {{existingData.backCoverImage}}
Back Cover Logo URL: {{existingData.backCoverLogo}}
{{else}}
**No existing data provided. Generate minimal, generic brochure content filling required text fields with placeholders like 'Project Name Placeholder', 'Location details to be confirmed'. Do not invent details. Ensure all image URL fields are empty strings. Use schema defaults where possible.**
{{/if}}

Now, generate the complete brochure data based *strictly* on these instructions and the provided context, adhering to the output JSON schema.
If 'sectionToGenerate' was specified, ensure ONLY that section's text fields (as detailed in the specific instruction for '{{sectionToGenerate}}') are updated, and all other fields from 'existingData' are returned UNCHANGED.
If no 'sectionToGenerate' was specified, enhance the whole document.
Ensure image URL fields are handled as specified in Rule 4.
`,
  config: {
    temperature: 0.2, // Lower temperature for more factual, less creative output
  },
});

// Define the flow
const generateBrochureFlow = ai.defineFlow(
  {
    name: 'generateBrochureFlow',
    inputSchema: GenerateBrochureInputSchema,
    // The AI is instructed to return the full object, but with targeted changes.
    // The prompt output schema remains BrochureDataSchema.
    outputSchema: BrochureDataSchema.partial(),
  },
  async (input) => {
    console.log("Executing generateBrochureFlow prompt with sectionToGenerate:", input.sectionToGenerate);
    const {output} = await generateContentPrompt(input);
    if (!output) {
      throw new Error("AI failed to generate brochure content.");
    }
    console.log("Prompt generation successful. Raw output for section '"+input.sectionToGenerate+"':", output);

    // If a specific section was targeted, we expect the AI to return the full data object
    // with only that section modified. The wrapper function `generateBrochureContent`
    // will perform final validation using BrochureDataSchema.parse().
    return output;
  }
);

    
