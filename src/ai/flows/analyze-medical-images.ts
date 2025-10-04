'use server';

/**
 * @fileOverview Analyzes medical images to provide diagnostic insights.
 *
 * - analyzeMedicalImage - A function that analyzes a medical image and returns diagnostic insights.
 * - AnalyzeMedicalImageInput - The input type for the analyzeMedicalImage function.
 * - AnalyzeMedicalImageOutput - The return type for the analyzeMedicalImage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeMedicalImageInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A medical image, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  description: z.string().describe('A description of the medical image.'),
});
export type AnalyzeMedicalImageInput = z.infer<typeof AnalyzeMedicalImageInputSchema>;

const AnalyzeMedicalImageOutputSchema = z.object({
  diagnosis: z.string().describe('The AI-powered diagnostic insights from the medical image.'),
  confidenceScore: z.number().describe('The confidence score of the diagnosis, ranging from 0 to 1.'),
});
export type AnalyzeMedicalImageOutput = z.infer<typeof AnalyzeMedicalImageOutputSchema>;

export async function analyzeMedicalImage(
  input: AnalyzeMedicalImageInput
): Promise<AnalyzeMedicalImageOutput> {
  return analyzeMedicalImageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeMedicalImagePrompt',
  input: {schema: AnalyzeMedicalImageInputSchema},
  output: {schema: AnalyzeMedicalImageOutputSchema},
  prompt: `You are an AI assistant specialized in analyzing medical images and providing diagnostic insights.

  Analyze the provided medical image and its description to provide a diagnosis and a confidence score for the diagnosis.

  Description: {{{description}}}
  Image: {{media url=photoDataUri}}

  Diagnosis: {diagnosis}
  Confidence Score: {confidenceScore} (between 0 and 1)`,
});

const analyzeMedicalImageFlow = ai.defineFlow(
  {
    name: 'analyzeMedicalImageFlow',
    inputSchema: AnalyzeMedicalImageInputSchema,
    outputSchema: AnalyzeMedicalImageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
