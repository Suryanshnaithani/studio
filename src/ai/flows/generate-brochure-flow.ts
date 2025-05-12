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
Use placeholder image URLs from 'https://picsum.photos/seed/...' where image URLs are required. Use unique seeds for each image. Ensure floor plan features are distinct and relevant to the name/area. Keep descriptions concise but informative. Ensure lists (like amenities, specs, key distances) have a reasonable number of relevant items. Generate plausible RERA information and disclaimers.
Make the project name and developer name creative and appropriate for a luxury project.
Ensure all string fields are populated with realistic text and array fields contain appropriate string items. Floor plan features should be an array of strings. Key distances should be specific and plausible.

Output the response strictly adhering to the provided JSON schema.`,
  config: {
    // Add safety settings if needed, e.g., block harmful content generation
    // safetySettings: [ ... ],
    // Increase temperature slightly for more creative output
    temperature: 0.8,
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
        BrochureDataSchema.parse(output);
        console.log("Generated data validated successfully.");
        return output;
      } catch (error) {
        console.error("Generated data failed validation:", error);
        // Attempt to return default data as a fallback, or re-throw
        // For now, re-throwing might be better to indicate failure clearly
        throw new Error("AI generated data that does not match the required schema.");
      }
  }
);
