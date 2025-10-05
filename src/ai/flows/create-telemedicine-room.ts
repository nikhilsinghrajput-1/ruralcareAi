
'use server';

/**
 * @fileoverview Defines a Genkit flow for creating a new Daily.co video call room.
 * This flow is called when a new telemedicine session is scheduled.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const CreateRoomInputSchema = z.object({
  // Name can be used to identify the room in Daily dashboard.
  // We can use the firestore session ID here.
  name: z.string().optional(),
  privacy: z.enum(['public', 'private']).default('private'),
});
type CreateRoomInput = z.infer<typeof CreateRoomInputSchema>;

const CreateRoomOutputSchema = z.object({
  id: z.string(),
  name: z.string(),
  url: z.string(),
  privacy: z.string(),
});
type CreateRoomOutput = z.infer<typeof CreateRoomOutputSchema>;


export async function createTelemedicineRoom(input: CreateRoomInput): Promise<CreateRoomOutput> {
    return createRoomFlow(input);
}


const createRoomFlow = ai.defineFlow(
  {
    name: 'createRoomFlow',
    inputSchema: CreateRoomInputSchema,
    outputSchema: CreateRoomOutputSchema,
  },
  async (input) => {

    const apiKey = process.env.NEXT_PUBLIC_DAILY_API_KEY;
    if (!apiKey) {
      throw new Error('NEXT_PUBLIC_DAILY_API_KEY environment variable is not set.');
    }

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        name: input.name,
        privacy: input.privacy,
        properties: {
          // Expire the room 1 hour after the session is scheduled to start
          exp: Math.floor(Date.now() / 1000) + 3600, 
          // Enable features useful for telemedicine
          enable_chat: true,
          enable_screenshare: true,
          enable_prejoin_ui: true,
        },
      }),
    };

    const response = await fetch('https://api.daily.co/v1/rooms', options);

    if (!response.ok) {
        const errorBody = await response.text();
        console.error("Failed to create Daily room:", response.status, errorBody);
        throw new Error(`Failed to create Daily room. Status: ${response.status}`);
    }

    const room = await response.json();
    
    return {
        id: room.id,
        name: room.name,
        url: room.url,
        privacy: room.privacy
    };
  }
);
