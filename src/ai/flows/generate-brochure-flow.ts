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
Your primary goal is to generate a complete, professional, and appealing real estate brochure.
You will be given 'existingData', which might be sparse, partially filled, or entirely empty.
Your task is to:

1.  **Strictly Adhere to Provided Facts:**
    *   If specific information (e.g., project name, RERA number, a particular amenity, developer name, image URL) is present in 'existingData', YOU MUST use that exact information as the core.
    *   You can rephrase, elaborate, or improve the presentation of provided text, but DO NOT change the fundamental facts or invent details that contradict what's given.
    *   If an image URL is provided in 'existingData' for any field, use that URL. Do not replace it with a placeholder.

2.  **Expand on Limited Information & Complete Missing Fields:**
    *   If 'existingData' is partially filled (e.g., only a project name and location are provided), use these details as a foundation.
    *   Your main job is to EXPAND upon this limited data. Write compelling copy, taglines, detailed descriptions, and relevant lists (e.g., amenities, specifications, key distances, floor plan features).
    *   All generated content must be *logically consistent* with and *plausible* for the type of project suggested by the provided data and any 'promptHint'. For example, if 'projectName' is "EcoGreen Villas," all generated content should reflect an eco-friendly, villa-style development.
    *   If 'existingData' is completely empty or key sections are missing, generate all necessary content. Infer the project style from 'promptHint' if available; otherwise, create content for a generic, high-quality residential project (e.g., luxury apartments or modern townhouses).
    *   For lists (amenities, specs, key distances, floor plan features), aim for a reasonable number of relevant items (typically 3-7 items per list, unless the context suggests otherwise). Ensure floor plan features are distinct and relevant to the plan's name/area.

3.  **Professional Quality & Tone:**
    *   Ensure all text is grammatically correct, well-structured, engaging, and uses professional real estate marketing language.
    *   Maintain a consistent tone and style throughout the brochure.

4.  **Placeholder Images (Only for Missing Optional Image Fields):**
    *   For *optional* image URL fields in the schema (like 'coverImage', 'projectLogo', 'developerImage', 'locationMapImage', 'floorPlans.image', etc.) that are *missing* in 'existingData' (i.e., not provided by the user):
        *   Provide a placeholder URL from 'https://picsum.photos/seed/...'
        *   Use a unique, descriptive seed for each image (e.g., 'https://picsum.photos/seed/luxuryLivingRoom/800/600' for an interior shot, 'https://picsum.photos/seed/projectAerialView/1200/800' for a master plan context).
        *   Only provide a placeholder if an image is appropriate and typically expected for that field. Ensure dimensions are reasonable (e.g., 800x600, 1000x700).
    *   For optional *watermark* image fields (e.g., 'introWatermark', 'specsWatermark'), if the field is missing, you MAY provide a subtle picsum.photos URL (e.g., 'https://picsum.photos/seed/subtlePattern/200/200'). Prioritize main content and main images over watermarks. If a main image for that section is user-provided, it's often better to omit the AI-generated watermark or ensure it's a very generic pattern.

5.  **Schema Adherence:**
    *   Strictly adhere to the JSON output schema.
    *   Ensure all REQUIRED fields in the schema are populated. If no information can be derived from 'existingData' or 'promptHint' for a required field, use the default values specified in the schema's Zod definition (as a last resort, if you cannot generate plausible content).
    *   Do not add fields not present in the schema.
    *   Ensure all generated values match their expected types (e.g., strings, arrays of strings, nested objects).

**Input Context:**

{{#if promptHint}}
User Hint: {{{promptHint}}}
{{/if}}

{{#if existingData}}
**Existing Brochure Data (Use this as the base for expansion and completion. Refine and expand on this information, do not contradict it):**
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
Key Distances: {{#each existingData.keyDistances}} - {{this}} {{/each}}
Map Disclaimer: {{existingData.mapDisclaimer}}
Connectivity Title: {{existingData.connectivityTitle}}
Connectivity Points (Business): {{#each existingData.connectivityPointsBusiness}} - {{this}} {{/each}}
Connectivity Points (Healthcare): {{#each existingData.connectivityPointsHealthcare}} - {{this}} {{/each}}
Connectivity Points (Education): {{#each existingData.connectivityPointsEducation}} - {{this}} {{/each}}
Connectivity Points (Leisure): {{#each existingData.connectivityPointsLeisure}} - {{this}} {{/each}}
Connectivity Note: {{existingData.connectivityNote}}
Connectivity District Label: {{existingData.connectivityDistrictLabel}}
Amenities Intro Title: {{existingData.amenitiesIntroTitle}}
Amenities Intro P1: {{existingData.amenitiesIntroP1}}
Amenities Intro P2: {{existingData.amenitiesIntroP2}}
Amenities Intro P3: {{existingData.amenitiesIntroP3}}
Amenities List Title: {{existingData.amenitiesListTitle}}
Amenities List Img Disclaimer: {{existingData.amenitiesListImageDisclaimer}}
Amenities Wellness: {{#each existingData.amenitiesWellness}} - {{this}} {{/each}}
Amenities Recreation: {{#each existingData.amenitiesRecreation}} - {{this}} {{/each}}
Amenities Grid Title: {{existingData.amenitiesGridTitle}}
Amenities Grid Labels: {{existingData.amenitiesGridLabel1}}, {{existingData.amenitiesGridLabel2}}, {{existingData.amenitiesGridLabel3}}, {{existingData.amenitiesGridLabel4}}
Amenities Grid Disclaimer: {{existingData.amenitiesGridDisclaimer}}
Specs Title: {{existingData.specsTitle}}
Specs Img Disclaimer: {{existingData.specsImageDisclaimer}}
Specs Interior: {{#each existingData.specsInterior}} - {{this}} {{/each}}
Specs Building: {{#each existingData.specsBuilding}} - {{this}} {{/each}}
Master Plan Title: {{existingData.masterPlanTitle}}
Master Plan Img Disclaimer: {{existingData.masterPlanImageDisclaimer}}
Master Plan Desc1: {{existingData.masterPlanDesc1}}
Master Plan Desc2: {{existingData.masterPlanDesc2}}
Floor Plans Title: {{existingData.floorPlansTitle}}
{{#each existingData.floorPlans}}
Floor Plan: {{this.name}} (Area: {{this.area}}) - Features: {{#if this.features}}{{#each this.features}} {{this}}; {{/each}}{{else}} (features not specified) {{/if}} Image: {{#if this.image}} {{this.image}} {{else}} (image not specified) {{/if}}
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

Image fields from existing data (use these if provided, otherwise generate placeholders if appropriate and field is optional):
Cover Image: {{existingData.coverImage}}
Project Logo: {{existingData.projectLogo}}
Intro Watermark: {{existingData.introWatermark}}
Developer Image: {{existingData.developerImage}}
Developer Logo (main): {{existingData.developerLogo}}
Location Map Image: {{existingData.locationMapImage}}
Location Watermark: {{existingData.locationWatermark}}
Connectivity Image: {{existingData.connectivityImage}}
Connectivity Watermark: {{existingData.connectivityWatermark}}
Amenities Intro Watermark: {{existingData.amenitiesIntroWatermark}}
Amenities List Image: {{existingData.amenitiesListImage}}
Amenities Grid Image 1: {{existingData.amenitiesGridImage1}}
Amenities Grid Image 2: {{existingData.amenitiesGridImage2}}
Amenities Grid Image 3: {{existingData.amenitiesGridImage3}}
Amenities Grid Image 4: {{existingData.amenitiesGridImage4}}
Specs Image: {{existingData.specsImage}}
Specs Watermark: {{existingData.specsWatermark}}
Master Plan Image: {{existingData.masterPlanImage}}
Back Cover Image: {{existingData.backCoverImage}}
Back Cover Logo: {{existingData.backCoverLogo}}
{{else}}
**No existing data provided. Generate comprehensive brochure content for a generic luxury residential project based on the 'promptHint' if available. Ensure all required fields are populated and optional image fields get appropriate picsum.photos placeholders.**
{{/if}}

Now, generate the complete brochure data based on these instructions and the provided context, adhering strictly to the output JSON schema.
`,
  config: {
    temperature: 0.5, // Adjusted temperature for more controlled expansion
    // Ensure JSON output mode if the model supports it explicitly via response_mime_type
    // For Gemini, structured output is requested by providing outputSchema.
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
