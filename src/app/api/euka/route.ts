import { NextRequest, NextResponse } from 'next/server';
import { getEukaTests, appendRow, updateRow, deleteRow, findRowIndex } from '@/lib/sheets';
import { serializeEukaRow } from '@/lib/parse';
import type { EukaTest } from '@/lib/types';

export const revalidate = 0;

export async function GET() {
  try {
    const tests = await getEukaTests();
    return NextResponse.json(tests);
  } catch (error) {
    console.error('Failed to fetch Euka tests:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: EukaTest = await request.json();
    const row = serializeEukaRow(body);
    await appendRow('euka_tests', row);
    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('Failed to create Euka test:', error);
    return NextResponse.json({ error: 'Failed to create test' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body: EukaTest = await request.json();
    const { testId } = body;
    const rowIndex = await findRowIndex('euka_tests', 0, testId);
    if (!rowIndex) {
      return NextResponse.json({ error: 'Test not found' }, { status: 404 });
    }
    const row = serializeEukaRow(body);
    await updateRow('euka_tests', rowIndex, row);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update Euka test:', error);
    return NextResponse.json({ error: 'Failed to update test' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { testId } = body;
    const rowIndex = await findRowIndex('euka_tests', 0, testId);
    if (!rowIndex) {
      return NextResponse.json({ error: 'Test not found' }, { status: 404 });
    }
    await deleteRow('euka_tests', rowIndex);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete Euka test:', error);
    return NextResponse.json({ error: 'Failed to delete test' }, { status: 500 });
  }
}
