
'use server';
/**
 * @fileOverview AI flow for generating or enhancing brochure content sections.
 * This flow is responsible for taking existing brochure data and either enhancing
 * the entire brochure's textual content or generating content for a specific section
 * and its fields based on user input and hints.
 *
 * - generateBrochureContent - The main function to call this flow.
 * - GenerateBrochureInput - The Zod schema defining the input for the flow.
 * - GenerateBrochureOutput - The Zod schema defining the output of the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import {
    BrochureDataSchema,
    type BrochureData,
    SpecificFieldGeneratingSectionsEnum
} from '@/components/brochure/data-schema';


const GenerateBrochureInputSchema = z.object({
    promptHint: z.string().optional().describe("Optional user hint to guide the generation (e.g., 'focus on luxury', 'keep it concise')."),
    existingData: BrochureDataSchema.describe("The current brochure data entered by the user."),
    sectionToGenerate: SpecificFieldGeneratingSectionsEnum.optional().describe("The specific section to generate/enhance content for. If omitted, enhance the full brochure."),
    fieldsToGenerate: z.array(z.string()).optional().describe("Specific fields within the section to generate. Used only when sectionToGenerate is provided and the section supports field-level generation. If empty for such a section, or for sections that don't support field-level, AI should enhance all relevant text fields in that section."),
});

export type GenerateBrochureInput = z.infer<typeof GenerateBrochureInputSchema>;
export type GenerateBrochureOutput = BrochureData; // Output is the complete, updated brochure data

// Public function to call the flow
export async function generateBrochureContent(input: GenerateBrochureInput): Promise<GenerateBrochureOutput> {
    console.log("Calling generateBrochureFlow with input. Section:", input.sectionToGenerate, "Fields:", input.fieldsToGenerate);
    // Validate input strictly before calling the AI flow
    try {
        GenerateBrochureInputSchema.parse(input);
    } catch (error) {
        console.error("Invalid input to generateBrochureContent:", error);
        if (error instanceof z.ZodError) {
            throw new Error(`Invalid input data: ${JSON.stringify(error.flatten().fieldErrors)}`);
        }
        throw new Error("Invalid input data for AI generation.");
    }
    return generateBrochureFlow(input);
}


// Define the prompt for content generation
const generateContentPrompt = ai.definePrompt({
    name: 'generateBrochureContentPrompt',
    input: { schema: GenerateBrochureInputSchema },
    output: { schema: BrochureDataSchema }, // Expect the full, updated data structure back
    model: 'googleai/gemini-2.0-flash',
    prompt: `
    You are a sophisticated AI assistant specialized in creating compelling real estate brochure content.
    Your task is to enhance or generate content for a property brochure based on the provided data and user instructions.
    Adhere STRICTLY to the following rules:
    1.  **Use ONLY Existing Data:** Base all generated text SOLELY on the information present in the 'existingData' section. Do NOT invent features, amenities, locations, developer details, specifications, or any other information not explicitly provided. If a field in 'existingData' is empty or sparse, generate content that is plausible and relevant to the project based on other filled-in fields (e.g., if project name suggests luxury, amenities are high-end, then generated text for an empty description should reflect luxury).
    2.  **Targeted Generation:**
        *   If 'sectionToGenerate' IS provided:
            *   Focus ONLY on enhancing or generating content for that specific section.
            *   If 'fieldsToGenerate' IS provided and NOT EMPTY, update ONLY those specified fields within the section.
            *   If 'fieldsToGenerate' is NOT provided or IS EMPTY for a section that supports field-level generation (like 'introduction', 'developer', 'location', 'connectivity', 'amenitiesIntro', 'masterPlan'), enhance all relevant primary textual fields within that 'sectionToGenerate'.
            *   For sections primarily representing titles (like 'amenitiesListTitle', 'amenitiesGridTitle', 'specificationsTitle', 'floorPlansTitle'), if 'sectionToGenerate' points to one of these, and 'fieldsToGenerate' is empty or not provided, generate ONLY the title field for that section (e.g., for 'amenitiesListTitle', generate 'existingData.amenitiesListTitle').
        *   Do NOT modify any other sections or fields outside the specified target.
    3.  **Full Brochure Enhancement:** If 'sectionToGenerate' is NOT provided, review the entire 'existingData' and enhance all textual content (titles, descriptions, paragraphs, notes, disclaimers) to be more professional, engaging, and consistent in tone. Improve wording, flow, and impact. Again, base this on information available in 'existingData'.
    4.  **Conciseness and Professionalism:** Generate clear, concise, and professional real estate marketing copy. Avoid excessive jargon. Ensure the tone matches a luxury or relevant property type as suggested by existingData.
    5.  **Respect User Input:** Incorporate the 'promptHint' if provided, guiding the tone or focus (e.g., focus on family-friendly aspects, emphasize investment potential).
    6.  **Return Full Structure:** ALWAYS return the *complete* BrochureData structure, merging your generated/enhanced content with the original 'existingData'. Untouched fields must be returned exactly as they were provided.
    7.  **Image URLs and Array Data:**
        *   NEVER generate new image URLs. Return existing image URLs as they are. If an image field is empty in 'existingData', keep it empty in the output. These fields include: coverImage, projectLogo, introWatermark, developerImage, developerLogo, locationMapImage, locationWatermark, connectivityImage, connectivityWatermark, amenitiesIntroWatermark, amenitiesListImage, amenitiesGridImage1, amenitiesGridImage2, amenitiesGridImage3, amenitiesGridImage4, specsImage, specsWatermark, masterPlanImage, floorPlans.*.image, backCoverImage, backCoverLogo.
        *   For fields that are arrays of strings (like keyDistances, amenitiesWellness, amenitiesRecreation, specsInterior, specsBuilding, floorPlans.*.features, connectivityPoints*):
            *   Do NOT add or remove items from these lists.
            *   You MAY refine the wording *within* existing string items if the section/field is targeted for generation.
            *   Otherwise, return these lists exactly as provided in 'existingData'.
    8.  **Floor Plan Data (floorPlans array of objects):**
        *   Only modify the 'name' (string), 'area' (string), or 'features' (array of strings, refining existing items only) *if* 'sectionToGenerate' is 'floorPlans' (the general section, not 'floorPlansTitle') and those specific fields (or the whole 'floorPlans' section) are targeted for generation.
        *   Do NOT add new floor plan objects or remove existing ones.
        *   Do NOT modify the 'image' field (string) within floor plans.
    9.  **No External Knowledge:** Do not use any external knowledge or make assumptions beyond what is strictly provided in 'existingData', unless it's for general stylistic enhancement or plausible expansion of directly related, sparse existing data.
    10. **Structure Preservation:** Strictly maintain the JSON structure of 'existingData'. All original keys must be present in the output. Ensure all fields from the schema are present.
    11. **Default Content Handling**: If a text field in \`existingData\` contains only default placeholder content (e.g., "Default text...") and is targeted for generation, treat it as empty and generate fresh content based on other \`existingData\` context and the \`promptHint\`.

    **User Input:**
    Hint: {{#if promptHint}}"{{promptHint}}"{{else}}None{{/if}}
    Section to Generate: {{#if sectionToGenerate}}"{{sectionToGenerate}}"{{else}}Full Brochure Enhancement{{/if}}
    Fields to Generate (if section specified and supports field-level targeting): {{#if fieldsToGenerate}}{{#if fieldsToGenerate.length}}{{jsonStringify fieldsToGenerate}}{{else}}All relevant text fields in the section (or just the title if it's a title-only section like amenitiesListTitle).{{/if}}{{else}}All relevant text fields in the section (or just the title if it's a title-only section).{{/if}}

    **Existing Brochure Data (Use this as source, expand where appropriate based on context but do NOT invent unrelated information):**
    \`\`\`json
    {{{jsonStringify existingData}}}
    \`\`\`

    **Instructions for Generation:**
    {{#if sectionToGenerate}}
    Generate or enhance content ONLY for the '{{sectionToGenerate}}' section.
        {{#if fieldsToGenerate}}
            {{#if fieldsToGenerate.length}}
    Specifically for the fields: {{jsonStringify fieldsToGenerate}}.
            {{else}}
    For all relevant text fields within '{{sectionToGenerate}}' (or just the title field if '{{sectionToGenerate}}' refers to a title like 'amenitiesListTitle', 'floorPlansTitle', etc.).
            {{/if}}
        {{else}}
    For all relevant text fields within '{{sectionToGenerate}}' (or just the title field if '{{sectionToGenerate}}' refers to a title).
        {{/if}}
    Return the full data structure with these modifications integrated. Ensure ALL fields from the original 'existingData' are present in your output, either modified or untouched.
    {{else}}
    Enhance the textual content across the entire brochure for better flow, professionalism, and engagement, based *only* on the provided 'existingData'. Return the full, enhanced data structure. Ensure ALL fields from the original 'existingData' are present.
    {{/if}}

    Output the result as a valid JSON object matching the BrochureData schema.
`,
    helpers: {
        jsonStringify: (value: any) => JSON.stringify(value, null, 0), // Compact JSON for prompt
    },
    config: {
        responseSchema: BrochureDataSchema, // Ensure the model knows the expected output schema
        safetySettings: [
            { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
            { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_ONLY_HIGH' },
            { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        ],
         temperature: 0.4, // Slightly more creative but still factual
    },
});


// Define the flow
const generateBrochureFlow = ai.defineFlow(
    {
        name: 'generateBrochureFlow',
        inputSchema: GenerateBrochureInputSchema,
        outputSchema: BrochureDataSchema,
    },
    async (input) => {
        console.log("Executing generateBrochureFlow prompt with sectionToGenerate:", input.sectionToGenerate);
        const {output} = await generateContentPrompt(input);
        if (!output) {
          throw new Error("AI failed to generate brochure content.");
        }
    
        // Validate the output against the schema before returning
        try {
            // Ensure all keys from input.existingData are present in output, even if AI omits some.
            // This is a fallback, ideally the AI returns the complete structure.
            const mergedOutput = { ...input.existingData, ...output }; // Merge AI output with existing
            const validatedOutput = BrochureDataSchema.parse(mergedOutput);
            console.log("AI Generation Successful for:", input.sectionToGenerate || "Full Brochure");
            return validatedOutput;
        } catch (error) {
            console.error("AI output validation failed. Input to AI:", JSON.stringify(input, null, 2));
            console.error("Raw AI output:", JSON.stringify(output, null, 2));
            
            if (error instanceof z.ZodError) {
                 const fieldErrors = error.flatten().fieldErrors;
                 console.error("Validation Errors:", JSON.stringify(fieldErrors, null, 2));

                 // Fallback to original data if AI output is critically flawed
                 console.warn("Returning existing data due to AI output validation failure.");
                 // Ensure the original data is valid before returning it as a fallback
                 return BrochureDataSchema.parse(input.existingData);
            }
            console.error("Unknown validation error:", error);
            // For unknown errors, it's safer to throw than to return potentially corrupted data
            throw new Error("AI output validation failed and could not be automatically corrected.");
        }
    }
);
    

