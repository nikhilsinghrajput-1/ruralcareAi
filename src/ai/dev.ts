'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/analyze-medical-images.ts';
import '@/ai/flows/analyze-symptoms.ts';
import '@/ai/flows/detect-emergency-conditions.ts';
import '@/ai/flows/create-telemedicine-room.ts';
