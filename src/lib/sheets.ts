import { google } from 'googleapis';
import { parseEukaRow, parseEmailRow, parseMessageRow } from './parse';
import { EukaTest, EmailTest, Message, Config } from './types';

function getAuth() {
  return new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
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
