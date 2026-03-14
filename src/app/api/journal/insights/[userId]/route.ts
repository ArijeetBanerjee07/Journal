import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = await (params as any);

    const entries = db.prepare('SELECT * FROM journal_entries WHERE userId = ?').all(userId) as any[];

    if (entries.length === 0) {
      return NextResponse.json({
        totalEntries: 0,
        topEmotion: 'N/A',
        mostUsedAmbience: 'N/A',
        recentKeywords: []
      });
    }

    const totalEntries = entries.length;

    // Top Emotion
    const emotionCounts: Record<string, number> = {};
    entries.forEach(e => {
      if (e.emotion) {
        emotionCounts[e.emotion] = (emotionCounts[e.emotion] || 0) + 1;
      }
    });
    const topEmotion = Object.keys(emotionCounts).length > 0 
      ? Object.keys(emotionCounts).reduce((a, b) => (emotionCounts[a] > emotionCounts[b] ? a : b))
      : 'neutral';

    // Most Used Ambience
    const ambienceCounts: Record<string, number> = {};
    entries.forEach(e => {
      if (e.ambience) {
        ambienceCounts[e.ambience] = (ambienceCounts[e.ambience] || 0) + 1;
      }
    });
    const mostUsedAmbience = Object.keys(ambienceCounts).length > 0
      ? Object.keys(ambienceCounts).reduce((a, b) => (ambienceCounts[a] > ambienceCounts[b] ? a : b))
      : 'none';

    // Recent Keywords
    const allKeywords: string[] = [];
    // Sort by date to get truly "recent"
    const sortedEntries = [...entries].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    sortedEntries.forEach(e => {
      try {
        const k = JSON.parse(e.keywords || '[]');
        allKeywords.push(...k);
      } catch (e) {}
    });
    const recentKeywords = Array.from(new Set(allKeywords)).slice(0, 5);

    return NextResponse.json({
      totalEntries,
      topEmotion,
      mostUsedAmbience,
      recentKeywords
    });
  } catch (error: any) {
    console.error('Fetch insights error:', error);
    return NextResponse.json({ error: 'Failed to fetch insights' }, { status: 500 });
  }
}
