import { NextResponse } from 'next/server';
import db from '@/lib/db';
import Groq from 'groq-sdk';
import { v4 as uuidv4 } from 'uuid';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function analyzeText(text: string) {
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
  return JSON.parse(completion.choices[0]?.message?.content || '{}');
}

export async function POST(req: Request) {
  try {
    const { userId, ambience, text } = await req.json();

    if (!userId || !ambience || !text) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Auto-analyze
    const analysis = await analyzeText(text);

    const id = uuidv4();
    const stmt = db.prepare(`
      INSERT INTO journal_entries (id, userId, ambience, text, emotion, keywords, summary)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      userId,
      ambience,
      text,
      analysis.emotion || 'neutral',
      JSON.stringify(analysis.keywords || []),
      analysis.summary || ''
    );

    const entry = db.prepare('SELECT * FROM journal_entries WHERE id = ?').get(id);

    return NextResponse.json(entry);
  } catch (error: any) {
    console.error('Journal entry creation error:', error);
    return NextResponse.json({ error: 'Failed to create journal entry', details: error.message }, { status: 500 });
  }
}
