/**
 * One-time setup script: Creates the Google Sheet with 4 tabs, headers, and seed data.
 * Run: node scripts/setup-sheet.js
 */
const { google } = require('googleapis');
const fs = require('fs');
const path = require('path');

const KEY_PATH = path.join(__dirname, '..', 'sa-key.json');
const ENV_PATH = path.join(__dirname, '..', '.env.local');
const key = JSON.parse(fs.readFileSync(KEY_PATH, 'utf8'));

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: key.client_email,
    private_key: key.private_key,
  },
  scopes: [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive',
  ],
});

const sheets = google.sheets({ version: 'v4', auth });
const drive = google.drive({ version: 'v3', auth });

async function main() {
  console.log('Creating Google Sheet...');

  // 1. Create spreadsheet with 4 tabs
  const spreadsheet = await sheets.spreadsheets.create({
    requestBody: {
      properties: { title: 'Fyne A/B Testing Dashboard' },
      sheets: [
        { properties: { title: 'euka_tests' } },
        { properties: { title: 'email_tests' } },
        { properties: { title: 'messages' } },
        { properties: { title: 'config' } },
      ],
    },
  });

  const sheetId = spreadsheet.data.spreadsheetId;
  console.log(`Sheet created: https://docs.google.com/spreadsheets/d/${sheetId}`);

  // 2. Add headers and seed data to euka_tests
  console.log('Adding euka_tests headers and seed data...');
  await sheets.spreadsheets.values.update({
    spreadsheetId: sheetId,
    range: 'euka_tests!A1:Z3',
    valueInputOption: 'RAW',
    requestBody: {
      values: [
        // Headers
        [
          'test_id', 'test_name', 'message_type', 'status', 'start_date', 'end_date',
          'a_name', 'a_agent', 'a_reached', 'a_requests', 'a_shipped', 'a_request_rate', 'a_videos', 'a_post_rate', 'a_revenue',
          'b_name', 'b_agent', 'b_reached', 'b_requests', 'b_shipped', 'b_request_rate', 'b_videos', 'b_post_rate', 'b_revenue',
          'winner', 'notes',
        ],
        // Seed row 1: VIP vs Standard (from real Euka data)
        [
          'euka-tc-001', 'VIP vs Standard TC', 'target_collab', 'completed', '2026-03-03', '2026-04-01',
          'VIP 40% Commission', '$1k+ Beauty - 3/19/2026', '16377', '289', '31', '1.8%', '3', '16.1%', '$0',
          'Standard TC', 'TC - 3/3/2026', '7128', '22', '20', '0.3%', '38', '75.0%', '$3,740.24',
          'variant_b', 'B has much higher post rate and revenue despite lower request rate',
        ],
        // Seed row 2: A running test
        [
          'euka-tc-002', 'Personal vs Template Welcome', 'welcome', 'running', '2026-04-07', '',
          'Personal Welcome', 'Agent Orlie', '500', '45', '40', '9.0%', '8', '20.0%', '$420.00',
          'Template Welcome', 'Agent Orlie', '500', '30', '25', '6.0%', '5', '16.7%', '$280.00',
          '', 'Testing personalized welcome messages',
        ],
      ],
    },
  });

  // 3. Add headers and seed data to email_tests
  console.log('Adding email_tests headers and seed data...');
  await sheets.spreadsheets.values.update({
    spreadsheetId: sheetId,
    range: 'email_tests!A1:V3',
    valueInputOption: 'RAW',
    requestBody: {
      values: [
        // Headers
        [
          'test_id', 'test_name', 'test_type', 'status', 'start_date', 'end_date',
          'a_name', 'a_sent', 'a_opens', 'a_open_rate', 'a_clicks', 'a_ctr', 'a_replies',
          'b_name', 'b_sent', 'b_opens', 'b_open_rate', 'b_clicks', 'b_ctr', 'b_replies',
          'winner', 'notes',
        ],
        // Seed row 1: Completed test
        [
          'email-subj-001', 'Urgency vs Curiosity Subject', 'subject_line', 'completed', '2026-04-01', '2026-04-14',
          'Urgency CTA', '500', '145', '29%', '32', '6.4%', '8',
          'Curiosity Hook', '500', '120', '24%', '25', '5%', '5',
          'variant_a', 'A wins on open rate and CTR',
        ],
        // Seed row 2: Running test
        [
          'email-body-001', 'Long-form vs Short-form Body', 'email_body', 'running', '2026-04-05', '',
          'Long-form Story', '300', '90', '30%', '22', '7.3%', '6',
          'Short-form Punchy', '300', '105', '35%', '28', '9.3%', '9',
          '', 'Testing email body length impact on engagement',
        ],
      ],
    },
  });

  // 4. Add headers and seed data to messages
  console.log('Adding messages headers and seed data...');
  await sheets.spreadsheets.values.update({
    spreadsheetId: sheetId,
    range: 'messages!A1:G8',
    valueInputOption: 'RAW',
    requestBody: {
      values: [
        // Headers
        ['message_id', 'funnel_stage', 'channel', 'variant_label', 'full_copy', 'used_in_tests', 'is_current'],
        // Seed messages
        [
          'msg-001', 'outreach', 'euka', 'VIP 40% Commission Pitch',
          'Hey {name}! We hand-picked you for our VIP creator program at Fyne Skincare! We absolutely love your content and think you would be the PERFECT fit for our brand. We are offering an exclusive 40% commission rate (our highest tier!) plus free products shipped directly to you. Would you be interested in collaborating?',
          'euka-tc-001', 'TRUE',
        ],
        [
          'msg-002', 'outreach', 'euka', 'Standard TC Message',
          'Hi {name}! We are Fyne Skincare, a fast-growing skincare brand on TikTok Shop. We would love to send you some of our best-selling products to try and create content with. If you are interested, just let us know and we will get a package shipped out to you!',
          'euka-tc-001', 'FALSE',
        ],
        [
          'msg-003', 'spark_code', 'euka', 'Spark Code Request',
          'Hey {name}! Your video is doing amazing! Would you be open to letting us run it as a Spark Ad? We would just need your authorization code from TikTok - it takes about 30 seconds. This helps both of us earn more from the video!',
          '', 'TRUE',
        ],
        [
          'msg-004', 'creative_brief', 'euka', 'ASMR Roller Brief',
          'Hey {name}! For your next video, we would love an ASMR-style unboxing featuring our Ice Roller! The angle: show the satisfying cold therapy experience - the sound of the roller on skin, the de-puffing effect. 30-60 seconds works great. Just be yourself and have fun with it!',
          '', 'TRUE',
        ],
        [
          'msg-005', 'welcome', 'euka', 'Welcome + Shipping',
          'Welcome to the Fyne Skincare family, {name}! We are so excited to have you on board. Your product package is being prepared and will ship within 2-3 business days. You will receive a tracking number once it is on the way. In the meantime, feel free to check out our TikTok Shop to see what is trending!',
          'euka-tc-002', 'TRUE',
        ],
        [
          'msg-006', 'nudge', 'euka', 'Content Nudge',
          'Hey {name}! Just checking in - have you had a chance to try the products? We would love to see your honest review! No rush at all, but when you are ready, even a quick 15-30 second video goes a long way. Let us know if you need any content ideas!',
          '', 'TRUE',
        ],
        [
          'msg-007', 'celebration', 'euka', 'First Sale Celebration',
          'OMG {name}! You just made your first sale through your Fyne Skincare video! Congrats!! Your content is clearly resonating with your audience. Keep up the amazing work - your commission is on the way. Would you like some tips on how to boost your sales even further?',
          '', 'TRUE',
        ],
      ],
    },
  });

  // 5. Add config data
  console.log('Adding config data...');
  await sheets.spreadsheets.values.update({
    spreadsheetId: sheetId,
    range: 'config!A1:B6',
    valueInputOption: 'RAW',
    requestBody: {
      values: [
        ['key', 'value'],
        ['dashboard_title', 'Fyne Skincare A/B Testing'],
        ['brand_name', 'Fyne Skincare'],
        ['commission_rate', '20%'],
        ['breakeven_roas', '2.43'],
        ['margin', '41%'],
      ],
    },
  });

  // 6. Share the sheet with Orlie's email (so he can see/edit it)
  console.log('Sharing sheet with orliejohndeferia@gmail.com...');
  await drive.permissions.create({
    fileId: sheetId,
    requestBody: {
      type: 'user',
      role: 'writer',
      emailAddress: 'orliejohndeferia@gmail.com',
    },
    sendNotificationEmail: false,
  });

  // Also share with orlie@fyneskincare.com
  console.log('Sharing sheet with orlie@fyneskincare.com...');
  try {
    await drive.permissions.create({
      fileId: sheetId,
      requestBody: {
        type: 'user',
        role: 'writer',
        emailAddress: 'orlie@fyneskincare.com',
      },
      sendNotificationEmail: false,
    });
  } catch (e) {
    console.log('  (skipped - email may not exist as Google account)');
  }

  // 7. Write .env.local
  console.log('Writing .env.local...');
  const envContent = `GOOGLE_SERVICE_ACCOUNT_EMAIL=${key.client_email}
GOOGLE_PRIVATE_KEY="${key.private_key.replace(/\n/g, '\\n')}"
GOOGLE_SHEET_ID=${sheetId}
`;
  fs.writeFileSync(ENV_PATH, envContent);

  console.log('\n=== SETUP COMPLETE ===');
  console.log(`Sheet ID: ${sheetId}`);
  console.log(`Sheet URL: https://docs.google.com/spreadsheets/d/${sheetId}`);
  console.log('.env.local has been updated with credentials.');
  console.log('\nRun "npm run dev" to test locally!');
}

main().catch((err) => {
  console.error('Setup failed:', err.message);
  process.exit(1);
});
