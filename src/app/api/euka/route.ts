import { NextResponse } from 'next/server';
import { getEukaTests } from '@/lib/sheets';

export const revalidate = 60; // Cache for 60 seconds

export async function GET() {
  try {
    const tests = await getEukaTests();
    return NextResponse.json(tests);
  } catch (error) {
    console.error('Failed to fetch Euka tests:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
