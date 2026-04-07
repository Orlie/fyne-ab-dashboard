import { NextRequest, NextResponse } from 'next/server';
import { getMessages, appendRow, updateRow, deleteRow, findRowIndex } from '@/lib/sheets';
import { serializeMessageRow } from '@/lib/parse';
import type { Message } from '@/lib/types';

export const revalidate = 0;

export async function GET() {
  try {
    const messages = await getMessages();
    return NextResponse.json(messages);
  } catch (error) {
    console.error('Failed to fetch messages:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: Message = await request.json();
    const row = serializeMessageRow(body);
    await appendRow('messages', row);
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('Failed to create message:', error);
    return NextResponse.json({ error: 'Failed to create message' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body: Message = await request.json();
    const { messageId } = body;
    const rowIndex = await findRowIndex('messages', 0, messageId);
    if (!rowIndex) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    }
    const row = serializeMessageRow(body);
    await updateRow('messages', rowIndex, row);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update message:', error);
    return NextResponse.json({ error: 'Failed to update message' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { messageId } = body;
    const rowIndex = await findRowIndex('messages', 0, messageId);
    if (!rowIndex) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    }
    await deleteRow('messages', rowIndex);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete message:', error);
    return NextResponse.json({ error: 'Failed to delete message' }, { status: 500 });
  }
}
