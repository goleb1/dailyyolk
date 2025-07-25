# 🔒 Secure Setup Guide for The Daily Yolk

This guide shows you how to set up The Daily Yolk with proper security using environment variables and serverless functions.

## Why This Approach is Better

✅ **No credentials in public repos**  
✅ **No client-side credential storage**  
✅ **Automatic token refresh**  
✅ **Proper server-side authentication**  
✅ **Environment variable security**  

## Step 1: Set Up Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google Sheets API:
   - Go to "APIs & Services" → "Library"
   - Search for "Google Sheets API"
   - Click "Enable"

## Step 2: Create Service Account

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "Service Account"
3. Fill in details:
   - **Name**: `dailyyolk-sheets`
   - **Description**: "Service account for Daily Yolk app"
4. Click "Create and Continue"
5. Skip optional steps, click "Done"

## Step 3: Download Service Account Key

1. Click on your service account
2. Go to "Keys" tab
3. Click "Add Key" → "Create new key" → "JSON"
4. Download the JSON file
5. **Keep this file secure** - never commit it to Git!

## Step 4: Create Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Create new spreadsheet named "Daily Yolk Tracker"
3. Set up headers in row 1:
   - A1: `Timestamp`
   - B1: `Date Eaten`
   - C1: `Preparation Style`
   - D1: `Quantity`
   - E1: `Location`
4. Copy the Sheet ID from the URL (between `/d/` and `/edit`)

## Step 5: Share Sheet with Service Account

1. In your Google Sheet, click "Share"
2. Add your service account email (from the JSON file)
3. Give it "Editor" permissions
4. Click "Send"

## Step 6: Configure Vercel Environment Variables

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your `dailyyolk` project
3. Go to "Settings" → "Environment Variables"
4. Add these variables (copy values from your JSON file):

```
GOOGLE_PROJECT_ID=your-project-id
GOOGLE_PRIVATE_KEY_ID=your-private-key-id
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Private-Key-Here\n-----END PRIVATE KEY-----\n"
GOOGLE_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/your-service-account%40project.iam.gserviceaccount.com
GOOGLE_SHEET_ID=your-sheet-id-from-url
```

### How to Get These Values:

From your downloaded JSON file:
- `GOOGLE_PROJECT_ID`: `project_id` field
- `GOOGLE_PRIVATE_KEY_ID`: `private_key_id` field
- `GOOGLE_PRIVATE_KEY`: `private_key` field (keep the quotes and \n characters)
- `GOOGLE_CLIENT_EMAIL`: `client_email` field
- `GOOGLE_CLIENT_ID`: `client_id` field
- `GOOGLE_CLIENT_CERT_URL`: `client_x509_cert_url` field
- `GOOGLE_SHEET_ID`: The ID you copied from your Google Sheet URL

## Step 7: Deploy

1. Commit and push your changes:
   ```bash
   git add .
   git commit -m "Add secure serverless API"
   git push
   ```

2. Vercel will automatically deploy with the new environment variables

## Step 8: Test

1. Open your deployed app
2. Try submitting an egg entry
3. Check your Google Sheet to see the data
4. You should see a success message

## Security Benefits

### What's Now Secure:
- ✅ Service account credentials are in environment variables (not in code)
- ✅ No client-side credential storage
- ✅ API calls happen server-side
- ✅ Automatic token refresh
- ✅ No sensitive data in public repos

### What's Removed:
- ❌ Client-side credential management
- ❌ localStorage credential storage
- ❌ Manual token generation
- ❌ Public credential exposure

## Troubleshooting

### "Failed to submit entry" error
- Check that all environment variables are set correctly
- Verify the Google Sheet is shared with your service account
- Check Vercel function logs for detailed error messages

### Environment variables not working
- Make sure you're in the correct Vercel project
- Verify all variables are set (no missing values)
- Redeploy after adding environment variables

### Google Sheets API errors
- Ensure Google Sheets API is enabled in your Google Cloud project
- Check that your service account has the correct permissions
- Verify the sheet ID is correct

## Local Development

To test locally:

1. Install Vercel CLI: `npm i -g vercel`
2. Create `.env.local` file with your environment variables
3. Run: `vercel dev`
4. Test at `http://localhost:3000`

## Production Notes

- Environment variables are encrypted in Vercel
- Service account credentials are never exposed to the client
- API calls are rate-limited and secure
- No manual token management required

## Support

If you need help:
1. Check Vercel function logs in your dashboard
2. Verify all environment variables are set
3. Test the Google Sheets API directly
4. Check browser console for client-side errors 