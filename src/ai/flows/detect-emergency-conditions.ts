'use server';

/**
 * @fileOverview This file defines a Genkit flow for detecting emergency conditions based on patient data and alerting relevant parties.
 *
 * - detectEmergencyConditions - A function that handles the detection of emergency conditions and alerting process.
 * - DetectEmergencyConditionsInput - The input type for the detectEmergencyConditions function.
 * - DetectEmergencyConditionsOutput - The return type for the detectEmergencyConditions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectEmergencyConditionsInputSchema = z.object({
  symptoms: z.string().describe('The symptoms reported by the patient.'),
  vitalSigns: z.string().describe('The vital signs of the patient.'),
  medicalHistory: z.string().describe('The medical history of the patient.'),
  patientLocation: z.string().describe('The current location of the patient.'),
});
export type DetectEmergencyConditionsInput = z.infer<typeof DetectEmergencyConditionsInputSchema>;

const DetectEmergencyConditionsOutputSchema = z.object({
  isEmergency: z.boolean().describe('Whether or not the patient is experiencing a medical emergency.'),
  emergencyDescription: z.string().describe('A description of the emergency situation.'),
  recommendedActions: z.string().describe('Recommended actions to take in response to the emergency.'),
  alertContacts: z.array(z.string()).describe('List of contacts to alert in case of emergency.'),
});
export type DetectEmergencyConditionsOutput = z.infer<typeof DetectEmergencyConditionsOutputSchema>;

export async function detectEmergencyConditions(
  input: DetectEmergencyConditionsInput
): Promise<DetectEmergencyConditionsOutput> {
  return detectEmergencyConditionsFlow(input);
}

const detectEmergencyConditionsPrompt = ai.definePrompt({
  name: 'detectEmergencyConditionsPrompt',
  input: {schema: DetectEmergencyConditionsInputSchema},
  output: {schema: DetectEmergencyConditionsOutputSchema},
  prompt: `You are an AI assistant designed to detect medical emergencies based on patient data.

  Analyze the following information to determine if the patient is experiencing a medical emergency. Provide a detailed description of the emergency, recommended actions, and a list of contacts to alert.

  Symptoms: {{{symptoms}}}
  Vital Signs: {{{vitalSigns}}}
  Medical History: {{{medicalHistory}}}
  Patient Location: {{{patientLocation}}}

  Consider the following:
  - Severity of symptoms
  - Abnormal vital signs
  - Relevant medical history
  - Proximity to medical facilities

  Output should be structured in JSON format.`,
});

const detectEmergencyConditionsFlow = ai.defineFlow(
  {
    name: 'detectEmergencyConditionsFlow',
    inputSchema: DetectEmergencyConditionsInputSchema,
    outputSchema: DetectEmergencyConditionsOutputSchema,
  },
  async input => {
    const {output} = await detectEmergencyConditionsPrompt(input);
    return output!;
  }
);
