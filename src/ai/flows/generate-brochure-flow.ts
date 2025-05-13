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
    SpecificFieldGeneratingSectionsEnum,
    SafeStringSchema
} from '@/components/brochure/data-schema';


// External input schema for the flow
const ExternalGenerateBrochureInputSchema = z.object({
    promptHint: z.string().optional().describe("Optional user hint to guide the generation (e.g., 'focus on luxury', 'keep it concise')."),
    existingData: BrochureDataSchema.describe("The current brochure data entered by the user."),
    sectionToGenerate: SpecificFieldGeneratingSectionsEnum.optional().describe("The specific section to generate/enhance content for. If omitted, enhance the full brochure."),
    fieldsToGenerate: z.array(z.string()).optional().describe("Specific fields within the section to generate. Used only when sectionToGenerate is provided and the section supports field-level generation. If empty for such a section, or for sections that don't support field-level, AI should enhance all relevant text fields in that section."),
});

export type GenerateBrochureInput = z.infer<typeof ExternalGenerateBrochureInputSchema>;
export type GenerateBrochureOutput = BrochureData; // Output is the complete, updated brochure data


// Internal input schema for the prompt, with stringified data
const PromptInternalInputSchema = z.object({
    promptHint: z.string().optional(),
    existingDataString: SafeStringSchema.describe("The current brochure data entered by the user, as a JSON string."),
    sectionToGenerate: SpecificFieldGeneratingSectionsEnum.optional(),
    fieldsToGenerateString: SafeStringSchema.optional().describe("Specific fields within the section to generate, as a JSON string array. Undefined if no specific fields are targeted."),
});


// Public function to call the flow
export async function generateBrochureContent(input: GenerateBrochureInput): Promise<GenerateBrochureOutput> {
    console.log("Calling generateBrochureFlow with input. Section:", input.sectionToGenerate, "Fields:", input.fieldsToGenerate);
    try {
        ExternalGenerateBrochureInputSchema.parse(input);
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
    input: { schema: PromptInternalInputSchema },
    output: { schema: BrochureDataSchema }, 
    model: 'googleai/gemini-2.0-flash',
    prompt: `
    You are a sophisticated AI assistant specialized in creating compelling real estate brochure content.
    Your task is to enhance or generate content for a property brochure based on the provided data and user instructions.
    Adhere STRICTLY to the following rules:
    1.  **Use ONLY Existing Data:** Base all generated text SOLELY on the information present in the 'existingDataString' (which is a JSON string of the brochure data). Do NOT invent features, amenities, locations, developer details, specifications, or any other information not explicitly provided. If a field in 'existingDataString' is empty or sparse, generate content that is plausible and relevant to the project based on other filled-in fields (e.g., if project name suggests luxury, amenities are high-end, then generated text for an empty description should reflect luxury).
    2.  **Targeted Generation:**
        *   If 'sectionToGenerate' IS provided:
            *   Focus ONLY on enhancing or generating content for that specific section.
            *   If 'fieldsToGenerateString' IS provided (and is a non-empty JSON array string), update ONLY those specified fields within the section.
            *   If 'fieldsToGenerateString' is NOT provided (or represents no specific fields), enhance all relevant primary textual fields within that 'sectionToGenerate'.
            *   For sections primarily representing titles (like 'amenitiesListTitle', 'amenitiesGridTitle', 'specificationsTitle', 'floorPlansTitle'), if 'sectionToGenerate' points to one of these, and 'fieldsToGenerateString' is not provided or is empty, generate ONLY the title field for that section (e.g., for 'amenitiesListTitle', generate 'existingData.amenitiesListTitle').
        *   Do NOT modify any other sections or fields outside the specified target.
    3.  **Full Brochure Enhancement:** If 'sectionToGenerate' is NOT provided, review the entire 'existingDataString' and enhance all textual content (titles, descriptions, paragraphs, notes, disclaimers) to be more professional, engaging, and consistent in tone. Improve wording, flow, and impact. Again, base this on information available in 'existingDataString'.
    4.  **Conciseness and Professionalism:** Generate clear, concise, and professional real estate marketing copy. Avoid excessive jargon. Ensure the tone matches a luxury or relevant property type as suggested by existingDataString.
    5.  **Respect User Input:** Incorporate the 'promptHint' if provided, guiding the tone or focus (e.g., focus on family-friendly aspects, emphasize investment potential).
    6.  **Return Full Structure:** ALWAYS return the *complete* BrochureData structure, merging your generated/enhanced content with the original 'existingDataString'. Untouched fields must be returned exactly as they were provided.
    7.  **Image URLs and Array Data:**
        *   NEVER generate new image URLs. Return existing image URLs as they are. If an image field is empty in 'existingDataString', keep it empty in the output. These fields include: coverImage, projectLogo, introWatermark, developerImage, developerLogo, locationMapImage, locationWatermark, connectivityImage, connectivityWatermark, amenitiesIntroWatermark, amenitiesListImage, amenitiesGridImage1, amenitiesGridImage2, amenitiesGridImage3, amenitiesGridImage4, specsImage, specsWatermark, masterPlanImage, floorPlans.*.image, backCoverImage, backCoverLogo.
        *   For fields that are arrays of strings (like keyDistances, amenitiesWellness, amenitiesRecreation, specsInterior, specsBuilding, floorPlans.*.features, connectivityPoints*):
            *   Do NOT add or remove items from these lists.
            *   You MAY refine the wording *within* existing string items if the section/field is targeted for generation.
            *   Otherwise, return these lists exactly as provided in 'existingDataString'.
    8.  **Floor Plan Data (floorPlans array of objects):**
        *   Only modify the 'name' (string), 'area' (string), or 'features' (array of strings, refining existing items only) *if* 'sectionToGenerate' is 'floorPlans' (the general section, not 'floorPlansTitle') and those specific fields (or the whole 'floorPlans' section) are targeted for generation.
        *   Do NOT add new floor plan objects or remove existing ones.
        *   Do NOT modify the 'image' field (string) within floor plans.
    9.  **No External Knowledge:** Do not use any external knowledge or make assumptions beyond what is strictly provided in 'existingDataString', unless it's for general stylistic enhancement or plausible expansion of directly related, sparse existing data.
    10. **Structure Preservation:** Strictly maintain the JSON structure of 'existingDataString'. All original keys must be present in the output. Ensure all fields from the schema are present.
    11. **Default Content Handling**: If a text field in \`existingDataString\` contains only default placeholder content (e.g., "Default text...") and is targeted for generation, treat it as empty and generate fresh content based on other \`existingDataString\` context and the \`promptHint\`.
    12. **CRITICAL - Handling Nulls and Empties**: For any field in the schema that is not explicitly defined as nullable, YOU MUST NOT return \`null\` as its value. If a string field is intended to be empty, return an empty string \`""\`. If an optional field is not being set or has no content, either omit it from your response (if the schema allows and it was omitted in the input) or ensure its value conforms to its type (e.g., an empty string \`""\` for optional string fields if they are to be empty, or retain the original value from 'existingDataString' if not targeted for change). Adherence to this rule is paramount for successful data parsing.

    **User Input:**
    Hint: {{#if promptHint}}"{{promptHint}}"{{else}}None{{/if}}
    Section to Generate: {{#if sectionToGenerate}}"{{sectionToGenerate}}"{{else}}Full Brochure Enhancement{{/if}}
    Fields to Generate (if section specified and supports field-level targeting): {{#if fieldsToGenerateString}}{{{fieldsToGenerateString}}}{{else}}All relevant text fields in the section (or just the title if it's a title-only section like amenitiesListTitle).{{/if}}

    **Existing Brochure Data (Use this as source, expand where appropriate based on context but do NOT invent unrelated information):**
    \`\`\`json
    {{{existingDataString}}}
    \`\`\`

    **Instructions for Generation:**
    {{#if sectionToGenerate}}
    Generate or enhance content ONLY for the '{{sectionToGenerate}}' section.
        {{#if fieldsToGenerateString}}
    Specifically for the fields: {{{fieldsToGenerateString}}}.
        {{else}}
    For all relevant text fields within '{{sectionToGenerate}}' (or just the title field if '{{sectionToGenerate}}' refers to a title like 'amenitiesListTitle', 'floorPlansTitle', etc.).
        {{/if}}
    Return the full data structure with these modifications integrated. Ensure ALL fields from the original 'existingDataString' (representing the original data) are present in your output, either modified or untouched.
    {{else}}
    Enhance the textual content across the entire brochure for better flow, professionalism, and engagement, based *only* on the provided 'existingDataString'. Return the full, enhanced data structure. Ensure ALL fields from the original 'existingDataString' are present.
    {{/if}}

    Output the result as a valid JSON object matching the BrochureData schema.
`,
    helpers: {
        jsonStringify: (value: any) => JSON.stringify(value, null, 0), 
    },
    config: {
        responseSchema: BrochureDataSchema, 
        safetySettings: [
            { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
            { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_ONLY_HIGH' },
            { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        ],
         temperature: 0.4, 
    },
});


// Define the flow
const generateBrochureFlow = ai.defineFlow(
    {
        name: 'generateBrochureFlow',
        inputSchema: ExternalGenerateBrochureInputSchema,
        outputSchema: BrochureDataSchema,
    },
    async (input) => {
        console.log("Executing generateBrochureFlow prompt with sectionToGenerate:", input.sectionToGenerate);

        const promptInputPayload = {
            promptHint: input.promptHint,
            existingDataString: JSON.stringify(input.existingData, null, 0),
            sectionToGenerate: input.sectionToGenerate,
            fieldsToGenerateString: (input.fieldsToGenerate && input.fieldsToGenerate.length > 0)
                                      ? JSON.stringify(input.fieldsToGenerate)
                                      : undefined,
        };
        
        const {output} = await generateContentPrompt(promptInputPayload);
        
        if (!output) {
          console.error("AI failed to generate brochure content. No output received. Input to AI:", JSON.stringify(promptInputPayload, null, 2));
          throw new Error("AI failed to generate brochure content. No output received.");
        }
    
        try {
            const mergedOutput = { ...input.existingData, ...output };
            const validatedOutput = BrochureDataSchema.parse(mergedOutput);
            console.log("AI Generation Successful for:", input.sectionToGenerate || "Full Brochure");
            return validatedOutput;
        } catch (validationError) {
            console.error("AI output (merged with existing) failed validation. Input to AI (promptInputPayload):", JSON.stringify(promptInputPayload, null, 2));
            console.error("Original input.existingData (before AI call):", JSON.stringify(input.existingData, null, 2));
            console.error("Raw AI output:", JSON.stringify(output, null, 2));
            
            if (validationError instanceof z.ZodError) {
                 const fieldErrors = validationError.flatten().fieldErrors;
                 console.error("Validation Errors from mergedOutput:", JSON.stringify(fieldErrors, null, 2));
                 console.warn("AI output was problematic. Attempting to return original data if it's valid.");
                 try {
                    const validatedOriginalData = BrochureDataSchema.parse(input.existingData);
                    console.log("Successfully validated original data. Returning original data as fallback.");
                    return validatedOriginalData;
                 } catch (originalDataValidationError) {
                    console.error("CRITICAL: Original input.existingData also failed validation. This indicates an issue with data integrity before AI call or a schema mismatch during fallback.", originalDataValidationError);
                    if (originalDataValidationError instanceof z.ZodError) {
                        console.error("Original Data Validation Errors (during fallback parse):", JSON.stringify(originalDataValidationError.flatten().fieldErrors, null, 2));
                    }
                 }
            } else {
                console.error("Validation error on mergedOutput was not a ZodError:", validationError);
            }
            throw new Error("AI output validation failed and could not be automatically corrected. Check logs for details on AI output and original data validation.");
        }
    }
);
    