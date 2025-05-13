
'use server';
/**
 * @fileOverview AI flow for generating or enhancing brochure content sections.
 *
 * - generateBrochureSection - Function to generate content for a specific section or enhance the whole brochure.
 * - GenerateBrochureSectionInput - Input type for the flow.
 * - GenerateBrochureSectionOutput - Output type for the flow (which is the full BrochureData).
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import {
    BrochureDataSchema,
    type BrochureData,
} from '@/components/brochure/data-schema';

// Define valid section names for targeted generation
const SectionNameEnum = z.enum([
    "introduction",
    "developer",
    "location",
    "connectivity",
    "amenitiesIntro",
    "amenitiesListTitle", // Target only the title
    "amenitiesGridTitle", // Target only the title
    "specificationsTitle", // Target only the title
    "masterPlan",
    "floorPlansTitle", // Target only the title
    // Add more specific sections if needed
]);

export const GenerateBrochureSectionInputSchema = z.object({
    promptHint: z.string().optional().describe("Optional user hint to guide the generation (e.g., 'focus on luxury', 'keep it concise')."),
    existingData: BrochureDataSchema.describe("The current brochure data entered by the user."),
    sectionToGenerate: SectionNameEnum.optional().describe("The specific section to generate/enhance content for. If omitted, enhance the full brochure."),
    fieldsToGenerate: z.array(z.string()).optional().describe("Specific fields within the section to generate. Used only when sectionToGenerate is provided."),
});

export type GenerateBrochureSectionInput = z.infer<typeof GenerateBrochureSectionInputSchema>;
export type GenerateBrochureSectionOutput = BrochureData; // Output is the complete, updated brochure data

// Public function to call the flow
export async function generateBrochureSection(input: GenerateBrochureSectionInput): Promise<GenerateBrochureSectionOutput> {
    console.log("Calling generateBrochureFlow with input:", input.sectionToGenerate, input.fieldsToGenerate);
    return generateBrochureFlow(input);
}


// Define the prompt for content generation
const generateContentPrompt = ai.definePrompt({
    name: 'generateBrochureContentPrompt',
    input: { schema: GenerateBrochureSectionInputSchema },
    output: { schema: BrochureDataSchema }, // Expect the full, updated data structure back
    model: 'googleai/gemini-2.0-flash', // Using flash for speed, ensure it handles complexity
    prompt: `
    You are a sophisticated AI assistant specialized in creating compelling real estate brochure content.
    Your task is to enhance or generate content for a property brochure based on the provided data and user instructions.
    Adhere STRICTLY to the following rules:
    1.  **Use ONLY Existing Data:** Base all generated text SOLELY on the information present in the 'existingData' section. Do NOT invent features, amenities, locations, developer details, or any other information not explicitly provided.
    2.  **Targeted Generation:** If 'sectionToGenerate' is provided, focus ONLY on enhancing or generating content for that specific section and ONLY for the fields listed in 'fieldsToGenerate' (if provided). Do NOT modify other sections. If 'fieldsToGenerate' is empty or not provided for a specific section, enhance all relevant text fields within that section based on existing data.
    3.  **Full Brochure Enhancement:** If 'sectionToGenerate' is NOT provided, review the entire 'existingData' and enhance the textual content (titles, descriptions, paragraphs, notes, disclaimers) to be more professional, engaging, and consistent in tone. Again, DO NOT add information not present in 'existingData'. Focus on improving wording, flow, and impact.
    4.  **Conciseness and Professionalism:** Generate clear, concise, and professional real estate marketing copy. Avoid excessive jargon. Ensure the tone matches a luxury or relevant property type.
    5.  **Respect User Input:** Incorporate the 'promptHint' if provided, guiding the tone or focus (e.g., focus on family-friendly aspects, emphasize investment potential).
    6.  **Return Full Structure:** ALWAYS return the *complete* BrochureData structure, merging your generated/enhanced content with the original 'existingData'. Untouched fields must be returned exactly as they were provided.
    7.  **Image URLs:** NEVER generate image URLs. Return existing image URLs as they are. If an image field is empty in the input, keep it empty in the output.
    8.  **Array Data (Lists):** For fields that are arrays of strings (like keyDistances, amenities, specs, floor plan features), do NOT add or remove items from the lists unless specifically asked to refine wording within existing items. Return the lists as provided in 'existingData'.
    9.  **Floor Plan Data:** For the 'floorPlans' array, only modify the 'name', 'area', or 'features' text *if* 'sectionToGenerate' is 'floorPlans' and relevant fields are requested. Do NOT add new floor plans or modify the 'image' field.

    **User Input:**
    Hint: {{#if promptHint}}"{{promptHint}}"{{else}}None{{/if}}
    Section to Generate: {{#if sectionToGenerate}}{{sectionToGenerate}}{{else}}Full Brochure Enhancement{{/if}}
    Fields to Generate (if section specified): {{#if fieldsToGenerate}}{{#each fieldsToGenerate}}{{this}}{{#unless @last}}, {{/unless}}{{/each}}{{else}}All relevant text fields in the section{{/if}}

    **Existing Brochure Data (Use ONLY this as source):**
    \`\`\`json
    {{{jsonStringify existingData}}}
    \`\`\`

    **Instructions:**
    {{#if sectionToGenerate}}
    Generate or enhance ONLY the content for the '{{sectionToGenerate}}' section{{#if fieldsToGenerate}} specifically for the fields: {{#each fieldsToGenerate}}'{{this}}'{{#unless @last}}, {{/unless}}{{/each}}{{else}} for all relevant text fields within it{{/if}}. Return the full data structure with these modifications integrated.
    {{else}}
    Enhance the textual content across the entire brochure for better flow, professionalism, and engagement, based *only* on the provided 'existingData'. Return the full, enhanced data structure.
    {{/if}}

    Output the result as a valid JSON object matching the BrochureData schema.
`,
    helpers: {
        jsonStringify: (value: any) => JSON.stringify(value, null, 2),
    },
    // Add safety settings if needed
    // config: {
    //   safetySettings: [{ category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' }],
    // },
});


// Define the flow
const generateBrochureFlow = ai.defineFlow(
    {
        name: 'generateBrochureFlow',
        inputSchema: GenerateBrochureSectionInputSchema,
        outputSchema: BrochureDataSchema, // Output is the full schema
    },
    async (input) => {
        console.log("Executing generateBrochureFlow prompt with sectionToGenerate:", input.sectionToGenerate);
        // The prompt now expects the full BrochureDataSchema as output.
        const { output } = await generateContentPrompt(input);

        if (!output) {
            throw new Error("AI failed to generate brochure content.");
        }

        // Validate the output against the schema before returning
        try {
            const validatedOutput = BrochureDataSchema.parse(output);
             console.log("AI Generation Successful for:", input.sectionToGenerate || "Full Brochure");
            return validatedOutput;
        } catch (error) {
            console.error("AI output validation failed:", error);
            // Consider returning the original input data or throwing a more specific error
            // For now, throw the validation error
            if (error instanceof z.ZodError) {
                 console.error("Validation Errors:", JSON.stringify(error.flatten().fieldErrors, null, 2));
                 throw new Error(`AI returned invalid data format. Details: ${JSON.stringify(error.flatten().fieldErrors)}`);
            }
             throw new Error("AI output validation failed.");
        }
    }
);
 
    