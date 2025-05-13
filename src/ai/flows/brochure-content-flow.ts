'use server';
/**
 * @fileOverview AI flow for generating or enhancing brochure content sections.
 *
 * - generateBrochureSection - Function to generate content for a specific section or enhance the whole brochure.
 * - GenerateBrochureSectionInput - Input type for the flow.
 * - BrochureData - Output type for the flow (which is the full BrochureData).
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
    "amenitiesListTitle",
    "amenitiesGridTitle",
    "specificationsTitle",
    "masterPlan",
    "floorPlansTitle",
    // Cover, BackCover are typically more static or involve specific data points not suited for broad text generation in this flow.
]);

const BrochureContentInputSchema = z.object({
    promptHint: z.string().optional().describe("Optional user hint to guide the generation (e.g., 'focus on luxury', 'keep it concise')."),
    existingData: BrochureDataSchema.describe("The current brochure data entered by the user."),
    sectionToGenerate: SectionNameEnum.optional().describe("The specific section to generate/enhance content for. If omitted, enhance the full brochure."),
    fieldsToGenerate: z.array(z.string()).optional().describe("Specific fields within the section to generate. Used only when sectionToGenerate is provided. If empty for a section, AI should enhance all relevant text fields in that section."),
});

export type BrochureContentInput = z.infer<typeof BrochureContentInputSchema>;
// Alias for external use, matching the function name
export type GenerateBrochureSectionInput = BrochureContentInput;
// Output is the full BrochureData schema
export type BrochureContentOutput = BrochureData;


// Public function to call the flow
export async function generateBrochureSection(input: GenerateBrochureSectionInput): Promise<BrochureContentOutput> {
    console.log("Calling brochureContentFlow with input:", input.sectionToGenerate, input.fieldsToGenerate);
    return brochureContentFlow(input);
}


// Define the prompt for content generation
const generateContentPrompt = ai.definePrompt({
    name: 'generateBrochureContentPrompt',
    input: { schema: BrochureContentInputSchema },
    output: { schema: BrochureDataSchema }, // Expect the full, updated data structure back
    model: 'googleai/gemini-2.0-flash',
    prompt: `
    You are a sophisticated AI assistant specialized in creating compelling real estate brochure content.
    Your task is to enhance or generate content for a property brochure based on the provided data and user instructions.
    Adhere STRICTLY to the following rules:
    1.  **Use ONLY Existing Data:** Base all generated text SOLELY on the information present in the 'existingData' section. Do NOT invent features, amenities, locations, developer details, specifications, or any other information not explicitly provided.
    2.  **Targeted Generation:**
        *   If 'sectionToGenerate' IS provided:
            *   Focus ONLY on enhancing or generating content for that specific section.
            *   If 'fieldsToGenerate' IS provided and NOT EMPTY, update ONLY those specified fields within the section.
            *   If 'fieldsToGenerate' is NOT provided or IS EMPTY, enhance all relevant textual fields within the specified 'sectionToGenerate' based on existing data.
        *   Do NOT modify any other sections or fields outside the specified target.
    3.  **Full Brochure Enhancement:** If 'sectionToGenerate' is NOT provided, review the entire 'existingData' and enhance the textual content (titles, descriptions, paragraphs, notes, disclaimers) to be more professional, engaging, and consistent in tone. Again, DO NOT add information not present in 'existingData'. Focus on improving wording, flow, and impact.
    4.  **Conciseness and Professionalism:** Generate clear, concise, and professional real estate marketing copy. Avoid excessive jargon. Ensure the tone matches a luxury or relevant property type as suggested by existingData.
    5.  **Respect User Input:** Incorporate the 'promptHint' if provided, guiding the tone or focus (e.g., focus on family-friendly aspects, emphasize investment potential).
    6.  **Return Full Structure:** ALWAYS return the *complete* BrochureData structure, merging your generated/enhanced content with the original 'existingData'. Untouched fields must be returned exactly as they were provided.
    7.  **Image URLs and Array Data:**
        *   NEVER generate new image URLs. Return existing image URLs as they are. If an image field is empty in 'existingData', keep it empty in the output.
        *   For fields that are arrays of strings (like keyDistances, amenities lists, specifications lists, floor plan features), do NOT add or remove items from the lists. You MAY refine the wording *within* existing items if the section/field is targeted for generation. Otherwise, return these lists exactly as provided in 'existingData'.
    8.  **Floor Plan Data:** For the 'floorPlans' array (which contains objects):
        *   Only modify the 'name', 'area', or 'features' (array of strings) text *if* 'sectionToGenerate' is 'floorPlans' and those specific fields (or the whole 'floorPlans' section) are targeted for generation.
        *   Do NOT add new floor plan objects or remove existing ones.
        *   Do NOT modify the 'image' field within floor plans.
    9.  **No External Knowledge:** Do not use any external knowledge or make assumptions beyond what is strictly provided in 'existingData'. Your role is to refine and expand upon the GIVEN information, not to invent new details.
    10. **Structure Preservation:** Strictly maintain the JSON structure of 'existingData'. All original keys must be present in the output.

    **User Input:**
    Hint: {{#if promptHint}}"{{promptHint}}"{{else}}None{{/if}}
    Section to Generate: {{#if sectionToGenerate}}"{{sectionToGenerate}}"{{else}}Full Brochure Enhancement{{/if}}
    Fields to Generate (if section specified): {{#if fieldsToGenerate}}{{#if fieldsToGenerate.length}}{{jsonStringify fieldsToGenerate}}{{else}}All relevant text fields in the section{{/if}}{{else}}All relevant text fields in the section{{/if}}

    **Existing Brochure Data (Use ONLY this as source):**
    \`\`\`json
    {{{jsonStringify existingData}}}
    \`\`\`

    **Instructions:**
    {{#if sectionToGenerate}}
    Generate or enhance content ONLY for the '{{sectionToGenerate}}' section.
        {{#if fieldsToGenerate}}
            {{#if fieldsToGenerate.length}}
    Specifically for the fields: {{jsonStringify fieldsToGenerate}}.
            {{else}}
    For all relevant text fields within the '{{sectionToGenerate}}' section.
            {{/if}}
        {{else}}
    For all relevant text fields within the '{{sectionToGenerate}}' section.
        {{/if}}
    Return the full data structure with these modifications integrated.
    {{else}}
    Enhance the textual content across the entire brochure for better flow, professionalism, and engagement, based *only* on the provided 'existingData'. Return the full, enhanced data structure.
    {{/if}}

    Output the result as a valid JSON object matching the BrochureData schema. Ensure all original fields from 'existingData' are present in your output, modified or untouched.
`,
    helpers: {
        jsonStringify: (value: any) => JSON.stringify(value), // Use compact JSON for prompt
    },
    config: {
        // Stricter safety settings can be useful for real estate, but adjust as needed.
        safetySettings: [
            { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
            { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' },
            { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_ONLY_HIGH' },
            { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        ],
        // Consider adjusting temperature for more creative vs. factual output.
        // temperature: 0.3, // Lower temperature for more factual, less "creative" output.
    },
});


// Define the flow
const brochureContentFlow = ai.defineFlow(
    {
        name: 'brochureContentFlow',
        inputSchema: BrochureContentInputSchema,
        outputSchema: BrochureDataSchema, // Output is the full schema
    },
    async (input) => {
        console.log("Executing brochureContentFlow prompt with sectionToGenerate:", input.sectionToGenerate, "Fields:", input.fieldsToGenerate);

        // The prompt now expects the full BrochureDataSchema as output.
        const { output } = await generateContentPrompt(input);

        if (!output) {
            console.error("AI failed to generate brochure content. Input was:", JSON.stringify(input, null, 2));
            throw new Error("AI failed to generate brochure content. No output received.");
        }

        // Validate the output against the schema before returning
        try {
            // Ensure all keys from input.existingData are present in output, even if AI omits some.
            // This is a fallback, ideally the AI returns the complete structure.
            const validatedOutput = BrochureDataSchema.parse(output);
             console.log("AI Generation Successful for:", input.sectionToGenerate || "Full Brochure");
            return validatedOutput;
        } catch (error) {
            console.error("AI output validation failed. Input to AI:", JSON.stringify(input, null, 2));
            console.error("Raw AI output:", JSON.stringify(output, null, 2));
            
            if (error instanceof z.ZodError) {
                 const fieldErrors = error.flatten().fieldErrors;
                 console.error("Validation Errors:", JSON.stringify(fieldErrors, null, 2));
                 // Attempt to merge AI output with existing data to preserve structure, then re-validate
                 // This is a complex recovery attempt and might not always be perfect.
                 // A simpler approach might be to return input.existingData or throw.
                 try {
                    const mergedData = BrochureDataSchema.parse({ ...input.existingData, ...output });
                    console.warn("AI output was partial, but successfully merged and validated with existing data.");
                    return mergedData;
                 } catch (mergeError) {
                    console.error("Merging partial AI output with existing data also failed validation:", mergeError instanceof z.ZodError ? JSON.stringify(mergeError.flatten().fieldErrors, null, 2) : mergeError);
                    throw new Error(`AI returned invalid data format which could not be auto-corrected. Details: ${JSON.stringify(fieldErrors)}`);
                 }
            }
            throw new Error("AI output validation failed and could not be automatically corrected.");
        }
    }
);
