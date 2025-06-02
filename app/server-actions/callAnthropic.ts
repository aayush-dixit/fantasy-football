'use server';

import Anthropic from '@anthropic-ai/sdk';

import AnthropicClient from '../utils/getAnthropicClient';

export async function callAnthropic(prompt: string) {
  const client = AnthropicClient.getInstance();

  try {
    const response = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 8192,
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