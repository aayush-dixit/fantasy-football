'use server';

import Anthropic from '@anthropic-ai/sdk';

export async function callAnthropic(prompt: string) {
  const client = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY!,
  });

  try {
    const response = await client.messages.create({
      model: 'claude-3-5-sonnet-20240620',
      max_tokens: 4096,
      messages: [
        { role: 'user', content: prompt },
        { role: 'assistant', content: 'Here is the suggestion:' },
      ],
    });
    const res = (response.content[0] as Anthropic.TextBlock).text;
    return res;
  } catch (error) {
    console.error('Error with Claude:', error);
    return 'Error with Claude API';
  }
}
