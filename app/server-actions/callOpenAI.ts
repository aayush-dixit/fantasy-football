'use server';

import OpenAI from 'openai';

export async function callOpenAI(prompt: string) {
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY!,
    });

    const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
            {
                role: 'user',
                content: prompt
            }
        ],
        response_format: { type: 'json_object' }
    });

    return response.choices[0].message.content as string

}