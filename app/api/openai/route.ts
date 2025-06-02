import { NextRequest, NextResponse } from 'next/server';
import { callOpenAI } from '../../server-actions/callOpenAI';

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();
  const response = await callOpenAI(prompt);
  return NextResponse.json({ result: response });
}
