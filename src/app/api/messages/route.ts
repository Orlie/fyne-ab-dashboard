import { NextResponse } from 'next/server';
import { getMessages } from '@/lib/sheets';

export const revalidate = 60;

export async function GET() {
  try {
    const messages = await getMessages();
    return NextResponse.json(messages);
  } catch (error) {
    console.error('Failed to fetch messages:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
