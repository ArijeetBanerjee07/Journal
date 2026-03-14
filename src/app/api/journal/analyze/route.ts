import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are an emotional analysis assistant for a nature journaling app. Analyze the text and return JSON: { "emotion": string, "keywords": string[], "summary": string }. Be concise.',
        },
        {
          role: 'user',
          content: text,
        },
      ],
      model: 'llama-3.3-70b-versatile',
      response_format: { type: 'json_object' },
    });

    const response = JSON.parse(completion.choices[0]?.message?.content || '{}');

    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Analysis error:', error);
    return NextResponse.json({ error: 'Failed to analyze text', details: error.message }, { status: 500 });
  }
}
