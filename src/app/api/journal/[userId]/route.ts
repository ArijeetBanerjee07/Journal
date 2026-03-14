import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    
    const entries = db.prepare('SELECT * FROM journal_entries WHERE userId = ? ORDER BY createdAt DESC').all(userId);
    
    const parsedEntries = entries.map((entry: any) => ({
      ...entry,
      keywords: JSON.parse(entry.keywords || '[]')
    }));

    return NextResponse.json(parsedEntries);
  } catch (error: any) {
    console.error('Fetch entries error:', error);
    return NextResponse.json({ error: 'Failed to fetch entries' }, { status: 500 });
  }
}
