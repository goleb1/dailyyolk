# 🥚 Google Sheets Setup Guide for The Daily Yolk

This guide will walk you through setting up Google Sheets integration for your egg tracking app.

## Prerequisites

- A Google account
- Node.js installed on your computer (for the token generator)
- Your Daily Yolk app deployed on Vercel

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Click "Select a project" → "New Project"
3. Name your project (e.g., "Daily Yolk Tracker")
4. Click "Create"

## Step 2: Enable Google Sheets API

1. In your project, go to "APIs & Services" → "Library"
2. Search for "Google Sheets API"
3. Click on it and press "Enable"

## Step 3: Create Service Account

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "Service Account"
3. Fill in the details:
   - **Service account name**: `dailyyolk-sheets`
   - **Service account ID**: Will auto-generate
   - **Description**: "Service account for Daily Yolk app"
4. Click "Create and Continue"
5. Skip the optional steps (click "Continue" and "Done")

## Step 4: Download Service Account Key

1. Click on your newly created service account
2. Go to the "Keys" tab
3. Click "Add Key" → "Create new key"
4. Select "JSON" format
5. Click "Create"
6. The JSON file will download automatically
7. **Rename the file** to `service-account-key.json`
8. **Move it** to your Daily Yolk project directory

## Step 5: Create Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it "Daily Yolk Tracker" (or whatever you prefer)
4. Set up the headers in row 1:
   - A1: `Timestamp`
   - B1: `Date Eaten`
   - C1: `Preparation Style`
   - D1: `Quantity`
   - E1: `Location` (optional)
5. **Copy the Sheet ID** from the URL:
   - The URL looks like: `https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID_HERE/edit`
   - Copy the part between `/d/` and `/edit`

## Step 6: Share Sheet with Service Account

1. In your Google Sheet, click "Share" (top right)
2. Add your service account email (found in the JSON file under `client_email`)
3. Give it "Editor" permissions
4. Click "Send" (you can uncheck "Notify people")

## Step 7: Generate Access Token

### Option A: Using the Node.js Script (Recommended)

1. Make sure you have the `service-account-key.json` file in your project directory
2. Open terminal in your project directory
3. Run the token generator:
   ```bash
   npm run generate-token
   ```
4. Copy the access token that appears

### Option B: Using Google OAuth Playground

1. Go to [Google OAuth 2.0 Playground](https://developers.google.com/oauthplayground/)
2. Click the settings gear (⚙️) in the top right
3. Check "Use your own OAuth credentials" (optional)
4. Close settings
5. In the left panel, find "Google Sheets API v4"
6. Select "https://www.googleapis.com/auth/spreadsheets"
7. Click "Authorize APIs"
8. Sign in with your Google account
9. Click "Exchange authorization code for tokens"
10. Copy the "Access token"

## Step 8: Configure Your App

1. Open your Daily Yolk app (the Vercel URL)
2. Click the settings gear (⚙️) in the top right
3. Enter your credentials:
   - **Google Sheets ID**: The ID you copied in Step 5
   - **Access Token**: The token you generated in Step 7
4. Click "Save"

## Step 9: Test Your Setup

1. Try submitting an egg entry
2. Check your Google Sheet to see if the data appears
3. If successful, you'll see a green success message

## Troubleshooting

### "Google Sheets not configured" error
- Make sure you clicked the settings gear and entered credentials
- Verify your Google Sheets ID is correct
- Check that your access token is valid

### "Google Sheets API error" messages
- Verify the sheet is shared with your service account
- Check that your access token has the correct scopes
- Ensure the Google Sheets API is enabled

### Token expires
- Access tokens expire after 1 hour
- For production use, you'll need to implement token refresh
- For testing, just generate a new token using the script

### Data not appearing in sheet
- Verify you're looking at the correct sheet tab (usually "Sheet1")
- Check that the sheet has the expected column structure
- Look for any error messages in the browser console

## Security Notes

- Keep your `service-account-key.json` file secure and never commit it to Git
- Access tokens should be scoped to only Google Sheets
- Consider implementing proper server-side authentication for production use
- The current setup stores credentials in browser localStorage (fine for personal use)

## Next Steps

Once everything is working:
1. Your app will automatically log egg consumption to your Google Sheet
2. You can view your data in the sheet or export it for analysis
3. Consider setting up automatic backups of your data
4. For production use, implement proper token refresh and server-side authentication

## Support

If you run into issues:
1. Check the browser console for error messages
2. Verify all the setup steps were completed correctly
3. Make sure your Google Cloud project has billing enabled (if required)
4. Check that your service account has the necessary permissions 