'use server';
/**
 * @fileOverview Generates or enhances content for a real estate brochure using AI,
 * leveraging existing user input.
 *
 * - generateBrochureContent - A function that triggers the brochure content generation/enhancement flow.
 * - GenerateBrochureInput - The input type, including an optional hint and existing data.
 * - GenerateBrochureOutput - The output type (matches BrochureDataSchema).
 */

import {ai} from '@/ai/genkit';
import {BrochureDataSchema, type BrochureData} from '@/components/brochure/data-schema';
import {z} from 'genkit';

// Input schema: Optional hint + optional existing partial data
const GenerateBrochureInputSchema = z.object({
  promptHint: z.string().optional().describe('Optional high-level hint for the AI (e.g., "Focus on eco-friendly features", "Luxury downtown apartments").'),
  existingData: BrochureDataSchema.partial().optional().describe('Partial brochure data provided by the user to be completed or enhanced.'),
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
  // This guarantees the frontend receives a complete BrochureData object
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
Your primary goal is to generate a complete, professional, and appealing real estate brochure based *strictly* on the provided 'existingData'.
You will be given 'existingData', which might be sparse, partially filled, or entirely empty.
Your task is to:

1.  **Strictly Adhere to Provided Facts:**
    *   YOU MUST use the exact information (e.g., project name, RERA number, specific amenities, developer name, location details, image URLs) present in 'existingData' as the absolute source of truth.
    *   DO NOT invent features, amenities, characteristics, or locations not explicitly mentioned or strongly implied by the provided 'existingData'.

2.  **Expand and Elaborate ONLY on Provided Information:**
    *   If 'existingData' is partially filled (e.g., only project name, location, and a few amenities are provided), use *only* these details as a foundation.
    *   Your main job is to REPHRASE, STRUCTURE, and WRITE COMPELLING COPY based *solely* on the given information.
    *   If fields are missing (excluding image fields, see rule 4), you must still generate content for them, but ensure it's generic and plausible *based on the context derived STRICTLY from the provided fields*. For example, if only the project name "Green Valley Homes" is given, infer a residential, possibly nature-oriented theme, but don't invent specific eco-features unless they are listed in amenities or specs.
    *   **Introduction Generation (introTitle, introParagraph1, introParagraph2, introParagraph3):**
        *   **This is a CRITICAL instruction for the introduction:** You must be *extremely strict* with the information used. Base the introduction *solely* on the project name and other relevant information explicitly provided in 'existingData'.
        *   DO NOT HALLUCINATE or invent any details, features, themes, or descriptions for the introduction that are not *directly specified* in the 'existingData'.
        *   Generate a suitable 'introTitle' based *only* on 'existingData.projectName' and 'existingData.projectTagline' (if available from 'existingData').
        *   Write 'introParagraph1', 'introParagraph2', and 'introParagraph3' by weaving together information *exclusively* from the following fields in 'existingData' (if they are provided): 'projectName', 'projectTagline', 'locationDesc1', 'locationDesc2', 'developerName', and a general, factual summary of listed 'amenities' or 'specs'.
        *   If 'existingData' lacks information for these introduction fields or related source fields, the introduction should remain generic and reflect only what *is* known from 'existingData'. Do not invent.
        *   **Example:** If 'existingData.projectName' is "Urban Living Apartments" and 'existingData.locationDesc1' mentions "city center", the intro should reflect this. If 'existingData' does *not* mention "luxury" or "panoramic views", then these terms MUST NOT appear in the introduction.
    *   For lists (amenities, specs, key distances, floor plan features), if 'existingData' provides items, use them. If the lists are empty or missing, generate a small number (2-4) of *generic but plausible* items consistent with the project type implied *only* by other provided data (like project name or location description). For floor plan features, keep them very generic (e.g., "Living Area", "Bedroom", "Kitchen") if no specific features are provided.

3.  **Professional Quality & Tone:**
    *   Ensure all text is grammatically correct, well-structured, engaging, and uses professional real estate marketing language appropriate for the *implied* project type based on the limited data.

4.  **Image Handling (CRITICAL):**
    *   All image fields in the brochure (e.g., 'coverImage', 'projectLogo', 'floorPlans.image', etc.) are user-provided.
    *   If an image URL is present in 'existingData' for any image field (e.g., 'existingData.coverImage'), YOU MUST use that exact URL in your output for the corresponding field (e.g., 'coverImage'). DO NOT MODIFY IT.
    *   If an image URL is *missing* or an empty string in 'existingData' for an optional image field, YOU MUST ensure that field is also an empty string in your output.
    *   DO NOT invent or generate any placeholder image URLs (e.g., from picsum.photos or any other source).
    *   DO NOT UNDER ANY CIRCUMSTANCES GENERATE NEW IMAGE URLS. Your role is to use provided image URLs or ensure the field is an empty string if no URL is provided in 'existingData'.

5.  **Schema Adherence:**
    *   Strictly adhere to the JSON output schema.
    *   Ensure all REQUIRED fields in the schema are populated, deriving content *only* from 'existingData' or using plausible generic content if 'existingData' is sparse. Use schema defaults only as a last resort if no plausible content can be generated based on input.
    *   Do not add fields not present in the schema. Ensure values match expected types (e.g., strings for image URLs, even if empty).

**Input Context:**

{{#if promptHint}}
User Hint (Use ONLY if it clarifies provided data, do NOT treat as new information): {{{promptHint}}}
{{/if}}

{{#if existingData}}
**Existing Brochure Data (Strictly base all generated content on this information. Expand and refine text, but DO NOT ADD NEW, UNFOUNDED DETAILS. For image fields, use the provided URL or ensure an empty string if no URL is given in existingData. DO NOT GENERATE IMAGE URLs.):**
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
Connectivity Title: {{existingData.connectivityTitle}}
Connectivity Points (Business): {{#if existingData.connectivityPointsBusiness}}{{#each existingData.connectivityPointsBusiness}} - {{this}} {{/each}}{{else}} (not specified) {{/if}}
Connectivity Points (Healthcare): {{#if existingData.connectivityPointsHealthcare}}{{#each existingData.connectivityPointsHealthcare}} - {{this}} {{/each}}{{else}} (not specified) {{/if}}
Connectivity Points (Education): {{#if existingData.connectivityPointsEducation}}{{#each existingData.connectivityPointsEducation}} - {{this}} {{/each}}{{else}} (not specified) {{/if}}
Connectivity Points (Leisure): {{#if existingData.connectivityPointsLeisure}}{{#each existingData.connectivityPointsLeisure}} - {{this}} {{/each}}{{else}} (not specified) {{/if}}
Connectivity Note: {{existingData.connectivityNote}}
Connectivity District Label: {{existingData.connectivityDistrictLabel}}
Amenities Intro Title: {{existingData.amenitiesIntroTitle}}
Amenities Intro P1: {{existingData.amenitiesIntroP2}}
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

**Image fields from existing data (use these if provided, otherwise ensure the field is an empty string. DO NOT GENERATE IMAGE URLS):**
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

Now, generate the complete brochure data based *strictly* on these instructions and the provided context, adhering to the output JSON schema. Do not add information not present in the input. Ensure image URL fields are handled as specified in Rule 4.
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
    outputSchema: BrochureDataSchema.partial(), // Allow partial output initially from AI
  },
  async (input) => {
    console.log("Executing generateBrochureFlow prompt...");
    const {output} = await generateContentPrompt(input);
    if (!output) {
      throw new Error("AI failed to generate brochure content.");
    }
    console.log("Prompt generation successful. Raw output:", output);

    // The raw output might be partial. The final validation and defaulting
    // happens in the exported wrapper function `generateBrochureContent`
    // before returning to the frontend.
    return output;
  }
);

