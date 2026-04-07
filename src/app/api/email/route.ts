import { NextRequest, NextResponse } from 'next/server';
import { getEmailTests, appendRow, updateRow, deleteRow, findRowIndex } from '@/lib/sheets';
import { serializeEmailRow } from '@/lib/parse';
import type { EmailTest } from '@/lib/types';

export const revalidate = 0;

export async function GET() {
  try {
    const tests = await getEmailTests();
    return NextResponse.json(tests);
  } catch (error) {
    console.error('Failed to fetch Email tests:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: EmailTest = await request.json();
    const row = serializeEmailRow(body);
    await appendRow('email_tests', row);
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('Failed to create Email test:', error);
    return NextResponse.json({ error: 'Failed to create test' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body: EmailTest = await request.json();
    const { testId } = body;
    const rowIndex = await findRowIndex('email_tests', 0, testId);
    if (!rowIndex) {
      return NextResponse.json({ error: 'Test not found' }, { status: 404 });
    }
    const row = serializeEmailRow(body);
    await updateRow('email_tests', rowIndex, row);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update Email test:', error);
    return NextResponse.json({ error: 'Failed to update test' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { testId } = body;
    const rowIndex = await findRowIndex('email_tests', 0, testId);
    if (!rowIndex) {
      return NextResponse.json({ error: 'Test not found' }, { status: 404 });
    }
    await deleteRow('email_tests', rowIndex);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete Email test:', error);
    return NextResponse.json({ error: 'Failed to delete test' }, { status: 500 });
  }
}
