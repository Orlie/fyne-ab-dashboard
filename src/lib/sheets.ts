import { google } from 'googleapis';
import { parseEukaRow, parseEmailRow, parseMessageRow } from './parse';
import { EukaTest, EmailTest, Message, Config } from './types';

function getAuth() {
  return new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
}

function getSheets() {
  return google.sheets({ version: 'v4', auth: getAuth() });
}

const SHEET_ID = process.env.GOOGLE_SHEET_ID!;

async function fetchTab(tabName: string): Promise<string[][]> {
  const sheets = getSheets();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${tabName}!A2:ZZ`,
  });
  return (res.data.values as string[][]) || [];
}

export async function getEukaTests(): Promise<EukaTest[]> {
  const rows = await fetchTab('euka_tests');
  return rows.map(parseEukaRow);
}

export async function getEmailTests(): Promise<EmailTest[]> {
  const rows = await fetchTab('email_tests');
  return rows.map(parseEmailRow);
}

export async function getMessages(): Promise<Message[]> {
  const rows = await fetchTab('messages');
  return rows.map(parseMessageRow);
}

export async function getConfig(): Promise<Config> {
  const rows = await fetchTab('config');
  const config: Config = {};
  for (const row of rows) {
    if (row[0]) config[row[0]] = row[1] || '';
  }
  return config;
}

// ── Write operations ──────────────────────────────────────────────────

export async function appendRow(tabName: string, values: string[]): Promise<void> {
  const sheets = getSheets();
  await sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range: `${tabName}!A:ZZ`,
    valueInputOption: 'RAW',
    requestBody: {
      values: [values],
    },
  });
}

export async function updateRow(tabName: string, rowIndex: number, values: string[]): Promise<void> {
  const sheets = getSheets();
  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: `${tabName}!A${rowIndex}:ZZ${rowIndex}`,
    valueInputOption: 'RAW',
    requestBody: {
      values: [values],
    },
  });
}

export async function deleteRow(tabName: string, rowIndex: number): Promise<void> {
  const sheets = getSheets();

  // Look up the numeric sheetId for this tab name
  const spreadsheet = await sheets.spreadsheets.get({
    spreadsheetId: SHEET_ID,
  });

  const sheet = spreadsheet.data.sheets?.find(
    (s) => s.properties?.title === tabName,
  );

  if (!sheet?.properties?.sheetId && sheet?.properties?.sheetId !== 0) {
    throw new Error(`Tab "${tabName}" not found in spreadsheet`);
  }

  const sheetId = sheet.properties.sheetId;

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: SHEET_ID,
    requestBody: {
      requests: [
        {
          deleteDimension: {
            range: {
              sheetId,
              dimension: 'ROWS',
              startIndex: rowIndex - 1, // API is 0-indexed
              endIndex: rowIndex,
            },
          },
        },
      ],
    },
  });
}

export async function findRowIndex(
  tabName: string,
  columnIndex: number,
  value: string,
): Promise<number | null> {
  const rows = await fetchTab(tabName);
  for (let i = 0; i < rows.length; i++) {
    if (rows[i][columnIndex] === value) {
      // fetchTab starts at A2 (skipping header row 1), so data index 0 = row 2
      return i + 2;
    }
  }
  return null;
}
