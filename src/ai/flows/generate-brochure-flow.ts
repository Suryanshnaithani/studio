'use server';
/**
 * @fileOverview Generates content for a real estate brochure using AI.
 *
 * - generateBrochureContent - A function that triggers the brochure content generation flow.
 * - GenerateBrochureInput - The input type (currently minimal).
 * - GenerateBrochureOutput - The output type (matches BrochureDataSchema).
 */

import {ai} from '@/ai/genkit';
import {BrochureDataSchema, type BrochureData} from '@/components/brochure/data-schema';
import {z} from 'genkit';

// Input schema (can be expanded later, e.g., with project type, location hints)
const GenerateBrochureInputSchema = z.object({
  promptHint: z.string().optional().describe('Optional hint to guide the generation, e.g., "Luxury apartments in downtown Metropolis"'),
});
export type GenerateBrochureInput = z.infer<typeof GenerateBrochureInputSchema>;

// Output schema is the existing BrochureDataSchema
export type GenerateBrochureOutput = BrochureData;

// Exported wrapper function to call the flow
export async function generateBrochureContent(input: GenerateBrochureInput): Promise<GenerateBrochureOutput> {
  console.log("Calling generateBrochureFlow with input:", input);
  const result = await generateBrochureFlow(input);
  console.log("generateBrochureFlow result:", result);
  return result;
}

// Define the prompt
const generateContentPrompt = ai.definePrompt({
  name: 'generateBrochureContentPrompt',
  input: {schema: GenerateBrochureInputSchema},
  output: {schema: BrochureDataSchema},
  prompt: `You are a creative copywriter and marketing expert specializing in real estate brochures.
Generate compelling and realistic content for a real estate project brochure.

{{#if promptHint}}
Use the following hint to guide the project details: {{{promptHint}}}
{{else}}
Invent plausible details for a fictional high-end residential project (e.g., apartment complex, villas).
{{/if}}

Fill in all the fields defined in the output schema. Ensure the content is professional, engaging, and suitable for a luxury real estate brochure.
For optional image URL fields (like 'coverImage', 'projectLogo', etc.), provide a placeholder URL from 'https://picsum.photos/seed/...' using a unique descriptive seed (e.g., 'https://picsum.photos/seed/coverBuilding/800/600') IF an image is appropriate for that field. If no image is suitable or needed for an optional field, omit the field entirely (do not provide an empty string).
Ensure floor plan features are distinct and relevant to the name/area. Keep descriptions concise but informative. Ensure lists (like amenities, specs, key distances) have a reasonable number of relevant items. Generate plausible RERA information and disclaimers.
Make the project name and developer name creative and appropriate for a luxury project.
Ensure all required string fields are populated with realistic text and array fields contain appropriate string items. Floor plan features should be an array of strings. Key distances should be specific and plausible.

Output the response strictly adhering to the provided JSON schema. Do not include fields that are not defined in the schema.`,
  config: {
    // Add safety settings if needed, e.g., block harmful content generation
    // safetySettings: [ ... ],
    // Increase temperature slightly for more creative output
    temperature: 0.8,
    // Ensure JSON output mode is enabled if available/needed by the model
    // response_mime_type: "application/json", // This might depend on the specific model/provider integration
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
    console.log("Executing generateBrochureFlow prompt...");
    const {output} = await generateContentPrompt(input);
    if (!output) {
      throw new Error("AI failed to generate brochure content.");
    }
    console.log("Prompt generation successful.");

    // Optional: Add post-processing logic here if needed
    // e.g., ensure specific URL formats, default values if AI misses something critical

     // Validate the output against the schema again before returning
     try {
        // Use safeParse to handle potential errors gracefully
        const parsedOutput = BrochureDataSchema.safeParse(output);
        if (!parsedOutput.success) {
             console.error("Generated data failed validation:", parsedOutput.error);
             throw new Error("AI generated data that does not match the required schema.");
        }
        console.log("Generated data validated successfully.");
        return parsedOutput.data; // Return the validated data
      } catch (error: any) {
        console.error("Error during output validation or processing:", error);
        // Re-throw the error to indicate failure clearly
        throw new Error(error.message || "An unexpected error occurred during AI response validation.");
      }
  }
);