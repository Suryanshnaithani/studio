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
  promptHint: z.string().optional().describe('Optional high-level hint for the AI (e.g., "Focus on eco-friendly features").'),
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
Your task is to complete and enhance the provided real estate brochure data.
Use the 'existingData' as the primary source of truth. Do NOT invent details that contradict the provided information.
If 'existingData' is provided, complete any missing fields based *only* on the context of the provided data and the optional 'promptHint'.
If a field exists in 'existingData', refine its content for clarity, professionalism, and marketing appeal, but MAINTAIN the original core information.
If 'existingData' is missing or empty, generate plausible content for a fictional high-end residential project based on the 'promptHint' if available, otherwise create a generic luxury project.

**Instructions:**

1.  **Prioritize Existing Data:** Base your response primarily on the content within the 'existingData' object.
2.  **Complete Missing Fields:** Fill in any fields that are missing in 'existingData' by inferring reasonable values from the provided context (other fields in 'existingData' and the 'promptHint'). For example, if the project name suggests luxury apartments, generate amenities and specifications suitable for that type.
3.  **Refine Existing Content:** Where content exists, improve its quality, grammar, and marketing effectiveness. Ensure descriptions are engaging and professional. Keep the core facts unchanged.
4.  **Placeholder Images:** For *missing* optional image URL fields (like 'coverImage', 'projectLogo', etc.), provide a placeholder URL from 'https://picsum.photos/seed/...' using a unique descriptive seed (e.g., 'https://picsum.photos/seed/coverBuilding/800/600') ONLY IF an image is appropriate for that field. If an image URL is already provided in 'existingData', use it. If no image is suitable or needed for a missing optional field, omit the field or leave it as an empty string.
5.  **Structure and Formatting:** Ensure lists (amenities, specs, key distances, floor plan features) contain relevant items. Keep descriptions concise but informative. Ensure floor plan features are distinct and relevant to the name/area.
6.  **Consistency:** Maintain consistency in tone and style throughout the brochure content. If 'existingData' suggests a specific project type (e.g., villas, apartments), ensure all generated/refined content aligns with it.
7.  **Schema Adherence:** Strictly adhere to the JSON output schema. Ensure all REQUIRED fields in the schema are populated, using defaults from the schema definition if no other information can be derived. Do not add fields not present in the schema.

**Input Context:**

{{#if promptHint}}
User Hint: {{{promptHint}}}
{{/if}}

{{#if existingData}}
**Existing Brochure Data (Use this as the base):**
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
Floor Plan: {{this.name}} ({{this.area}}) - Features: {{#each this.features}} {{this}}; {{/each}}
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
{{else}}
**No existing data provided. Generate content based on the hint or a generic luxury project.**
{{/if}}

Now, generate the complete brochure data based on these instructions and the provided context, adhering strictly to the output JSON schema.
`,
  config: {
    temperature: 0.6, // Slightly lower temperature to encourage adherence to existing data
    // Ensure JSON output mode if the model supports it explicitly
    // responseFormat: 'json_object', // Or similar depending on model/API
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
