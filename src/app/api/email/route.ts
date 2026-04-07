import { NextResponse } from 'next/server';
import { getEmailTests } from '@/lib/sheets';

export const revalidate = 60;

export async function GET() {
  try {
    const tests = await getEmailTests();
    return NextResponse.json(tests);
  } catch (error) {
    console.error('Failed to fetch Email tests:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
