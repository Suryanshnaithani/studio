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
    BrochureAIDataSectionsEnum,
    type BrochureAIDataSection,
} from '@/components/brochure/data-schema';


const GenerateBrochureInputSchema = z.object({
    promptHint: z.string().optional().describe("Optional user hint to guide the generation (e.g., 'focus on luxury', 'keep it concise')."),
    existingData: BrochureDataSchema.describe("The current brochure data entered by the user."),
    sectionToGenerate: BrochureAIDataSectionsEnum.optional().describe("The specific section to generate/enhance content for. If omitted, enhance the full brochure."),
    // fieldsToGenerate is now implicitly handled by sectionToGenerate's definition (e.g. amenitiesListTitle implies title + lists)
});

export type GenerateBrochureInput = z.infer<typeof GenerateBrochureInputSchema>;
export type GenerateBrochureOutput = BrochureData;


// Public function to call the flow
export async function generateBrochureContent(input: GenerateBrochureInput): Promise<GenerateBrochureOutput> {
    console.log("Calling generateBrochureFlow with input. Section:", input.sectionToGenerate);
    try {
        GenerateBrochureInputSchema.parse(input); // Validate external input
    } catch (error) {
        console.error("Invalid input to generateBrochureContent:", error);
        if (error instanceof z.ZodError) {
            throw new Error(`Invalid input data: ${JSON.stringify(error.flatten().fieldErrors)}`);
        }
        throw new Error("Invalid input data for AI generation.");
    }
    return generateBrochureFlow(input);
}


const generateContentPrompt = ai.definePrompt({
    name: 'generateBrochureContentPrompt',
    input: { schema: GenerateBrochureInputSchema },
    output: { schema: BrochureDataSchema },
    model: 'googleai/gemini-2.0-flash',
    template: {
        helpers: {
            jsonStringify: (value: any) => JSON.stringify(value === undefined ? null : value, null, 0),
        },
        knownHelpersOnly: false, // Allow jsonStringify
    },
    prompt: `
    You are a sophisticated AI assistant specialized in creating compelling real estate brochure content.
    Your task is to enhance or generate content for a property brochure based on the provided data and user instructions.
    Adhere STRICTLY to the following rules:
    1.  **Use ONLY Existing Data:** Base all generated text SOLELY on the information present in the 'existingData'. Do NOT invent features, amenities, locations, developer details, specifications, or any other information not explicitly provided. If a field in 'existingData' is empty or sparse, generate content that is plausible and relevant to the project based on other filled-in fields (e.g., if project name suggests luxury, amenities are high-end, then generated text for an empty description should reflect luxury).
    2.  **Targeted Generation:**
        *   If 'sectionToGenerate' IS provided:
            *   Focus ONLY on enhancing or generating content for that specific section.
            *   Refer to the section's typical fields:
                *   'cover': projectName, projectTagline
                *   'introduction': introTitle, introParagraph1, introParagraph2, introParagraph3
                *   'developer': developerName, developerDesc1, developerDesc2
                *   'location': locationTitle, locationDesc1, locationDesc2, keyDistances (refine existing items), locationNote
                *   'connectivity': connectivityTitle, connectivityPointsBusiness/Healthcare/Education/Leisure (refine existing items in lists), connectivityNote
                *   'amenitiesIntro': amenitiesIntroTitle, amenitiesIntroP1, amenitiesIntroP2, amenitiesIntroP3
                *   'amenitiesListTitle': amenitiesListTitle, amenitiesWellness (refine existing), amenitiesRecreation (refine existing)
                *   'amenitiesGridTitle': amenitiesGridTitle, amenitiesGridItems.*.label (refine existing labels)
                *   'specificationsTitle': specsTitle, specsInterior (refine existing), specsBuilding (refine existing)
                *   'masterPlan': masterPlanTitle, masterPlanDesc1, masterPlanDesc2
                *   'floorPlansTitle': floorPlansTitle, floorPlans.*.name, floorPlans.*.area, floorPlans.*.features (refine existing features)
                *   'backCover': callToAction, contactTitle, fullDisclaimer
            *   Do NOT modify any other sections or fields outside the specified target.
    3.  **Full Brochure Enhancement:** If 'sectionToGenerate' is NOT provided, review the entire 'existingData' and enhance all textual content (titles, descriptions, paragraphs, notes, disclaimers) to be more professional, engaging, and consistent in tone. Improve wording, flow, and impact. Base this on information available in 'existingData'.
    4.  **Conciseness and Professionalism:** Generate clear, concise, and professional real estate marketing copy. Avoid excessive jargon. Ensure the tone matches a luxury or relevant property type as suggested by existingData.
    5.  **Respect User Input:** Incorporate the 'promptHint' if provided, guiding the tone or focus.
    6.  **Return Full Structure:** ALWAYS return the *complete* BrochureData structure, merging your generated/enhanced content with the original 'existingData'. Untouched fields must be returned exactly as they were provided.
    7.  **Image URLs and Array Data:**
        *   NEVER generate new image URLs. Return existing image URLs as they are. If an image field is empty in 'existingData', keep it empty in the output. These include all fields ending with 'Image', 'Logo', or 'Watermark', and 'image' fields within array items (e.g., floorPlans.*.image, amenitiesGridItems.*.image).
        *   For fields that are arrays of strings (like keyDistances, amenitiesWellness, specsInterior, etc.) or arrays of objects (like floorPlans, amenitiesGridItems):
            *   Do NOT add or remove items from these lists.
            *   You MAY refine the wording *within* existing string items or relevant string properties of objects (e.g., floorPlans.*.features, amenitiesGridItems.*.label) if the section/field is targeted for generation.
            *   Otherwise, return these arrays and their items exactly as provided in 'existingData'.
    8.  **Floor Plan Data (floorPlans array of objects):**
        *   Only modify 'name' (string), 'area' (string), or 'features' (array of strings, refining existing items only) *if* 'sectionToGenerate' is 'floorPlansTitle'.
        *   Do NOT add new floor plan objects or remove existing ones. Do NOT modify 'id' or 'image'.
    9.  **Amenity Grid Items (amenitiesGridItems array of objects):**
        *   Only modify 'label' (string) *if* 'sectionToGenerate' is 'amenitiesGridTitle'.
        *   Do NOT add new grid items or remove existing ones. Do NOT modify 'id' or 'image'.
    10. **No External Knowledge:** Do not use any external knowledge or make assumptions beyond what is strictly provided in 'existingData'.
    11. **Structure Preservation:** Strictly maintain the JSON structure of 'existingData'. All original keys must be present in the output. Ensure all fields from the schema are present.
    12. **Default Content Handling**: If a text field in \`existingData\` contains only default placeholder content (e.g., "Default text...") and is targeted for generation, treat it as empty and generate fresh content based on other \`existingData\` context and the \`promptHint\`.
    13. **CRITICAL - Handling Nulls and Empties**: For any field in the schema that is not explicitly defined as nullable, YOU MUST NOT return \`null\` as its value. If a string field is intended to be empty, return an empty string \`""\`. Retain original values from 'existingData' if not targeted for change.

    **User Input:**
    Hint: {{#if promptHint}}"{{promptHint}}"{{else}}None{{/if}}
    Section to Generate: {{#if sectionToGenerate}}"{{sectionToGenerate}}"{{else}}Full Brochure Enhancement{{/if}}

    **Existing Brochure Data (Use this as source, expand where appropriate based on context but do NOT invent unrelated information):**
    \`\`\`json
    {{{jsonStringify existingData}}}
    \`\`\`

    **Instructions for Generation:**
    {{#if sectionToGenerate}}
    Generate or enhance content ONLY for the '{{sectionToGenerate}}' section's relevant text fields as detailed in Rule 2.
    Return the full data structure with these modifications integrated. Ensure ALL fields from the original 'existingData' (as provided in the JSON block above) are present in your output, either modified or untouched.
    {{else}}
    Enhance the textual content across the entire brochure for better flow, professionalism, and engagement, based *only* on the provided 'existingData' (as provided in the JSON block above). Return the full, enhanced data structure. Ensure ALL fields from the original 'existingData' are present.
    {{/if}}

    Output the result as a valid JSON object matching the BrochureData schema.
`,
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


const generateBrochureFlow = ai.defineFlow(
    {
        name: 'generateBrochureFlow',
        inputSchema: GenerateBrochureInputSchema,
        outputSchema: BrochureDataSchema,
    },
    async (input) => {
        console.log("Executing generateBrochureFlow prompt with sectionToGenerate:", input.sectionToGenerate);

        const promptInputPayload: GenerateBrochureInput = {
            promptHint: input.promptHint,
            existingData: input.existingData,
            sectionToGenerate: input.sectionToGenerate,
        };
        
        const {output: rawAiOutput} = await generateContentPrompt(promptInputPayload);
        
        if (!rawAiOutput) {
          console.error("AI failed to generate brochure content. No output received. Input to AI:", JSON.stringify(promptInputPayload, null, 2));
          throw new Error("AI failed to generate brochure content. No output received.");
        }

        // Create a deep copy to avoid mutating the raw AI output
        const processedAiOutput = JSON.parse(JSON.stringify(rawAiOutput));

        // Safeguard: Ensure all optional URL/email fields that are null become empty strings
        // This should align with how optionalUrlSchema/optionalEmailSchema defaults work if Zod handled this on output,
        // but AI might still output null for fields it didn't touch or decided were empty.
        Object.keys(BrochureDataSchema.shape).forEach(keyStr => {
            const key = keyStr as keyof BrochureData;
            const fieldSchemaDef = (BrochureDataSchema.shape[key] as z.ZodTypeAny)._def;
            
            let isOptionalStringFieldWithEmptyDefault = false;
            if (fieldSchemaDef.typeName === z.ZodFirstPartyTypeKind.ZodOptional) {
                const innerType = fieldSchemaDef.innerType._def;
                if (innerType.typeName === z.ZodFirstPartyTypeKind.ZodDefault) {
                    if (innerType.innerType._def.typeName === z.ZodFirstPartyTypeKind.ZodString && innerType.defaultValue === '') {
                        isOptionalStringFieldWithEmptyDefault = true;
                    }
                }
            } else if (fieldSchemaDef.typeName === z.ZodFirstPartyTypeKind.ZodDefault) {
                 if (fieldSchemaDef.innerType._def.typeName === z.ZodFirstPartyTypeKind.ZodString && fieldSchemaDef.defaultValue === '') {
                    isOptionalStringFieldWithEmptyDefault = true;
                }
            }

            if (isOptionalStringFieldWithEmptyDefault && processedAiOutput[key] === null) {
                (processedAiOutput as any)[key] = '';
            }

            // For arrays of objects (floorPlans, amenitiesGridItems)
            if (key === 'floorPlans' && Array.isArray(processedAiOutput.floorPlans)) {
                processedAiOutput.floorPlans.forEach((plan: any) => {
                    if (plan.image === null) plan.image = '';
                });
            }
            if (key === 'amenitiesGridItems' && Array.isArray(processedAiOutput.amenitiesGridItems)) {
                processedAiOutput.amenitiesGridItems.forEach((item: any) => {
                    if (item.image === null) item.image = '';
                });
            }
        });
    
        try {
            // Merge AI's output over the existing data.
            const mergedOutput = { ...input.existingData, ...processedAiOutput };
            const validatedOutput = BrochureDataSchema.parse(mergedOutput);
            console.log("AI Generation Successful for:", input.sectionToGenerate || "Full Brochure");
            return validatedOutput;
        } catch (validationError) {
            console.error("AI output (merged with existing) failed validation. Input to AI (promptInputPayload):", JSON.stringify(promptInputPayload, null, 2));
            console.error("Original input.existingData (before AI call):", JSON.stringify(input.existingData, null, 2));
            console.error("Raw AI output (before sanitization):", JSON.stringify(rawAiOutput, null, 2));
            console.error("Processed AI output (after sanitization):", JSON.stringify(processedAiOutput, null, 2));
            
            if (validationError instanceof z.ZodError) {
                 const fieldErrors = validationError.flatten().fieldErrors;
                 console.error("Validation Errors from mergedOutput:", JSON.stringify(fieldErrors, null, 2));
                 console.warn("AI output was problematic. Attempting to return original data if it's valid.");
                 try {
                    const validatedOriginalData = BrochureDataSchema.parse(input.existingData);
                    console.log("Successfully validated original data. Returning original data as fallback.");
                    return validatedOriginalData;
                 } catch (originalDataValidationError) {
                    console.error("CRITICAL: Original input.existingData also failed validation.", originalDataValidationError);
                    if (originalDataValidationError instanceof z.ZodError) {
                        console.error("Original Data Validation Errors (during fallback parse):", JSON.stringify(originalDataValidationError.flatten().fieldErrors, null, 2));
                    }
                     throw new Error(`AI output validation failed. Errors: ${JSON.stringify(fieldErrors)}. Original data also invalid.`);
                 }
            } else {
                console.error("Validation error on mergedOutput was not a ZodError:", validationError);
            }
            throw new Error("AI output validation failed and could not be automatically corrected. Check logs for details on AI output and original data validation.");
        }
    }
);