# 🥚 The Daily Yolk

A mobile-first web application for quickly logging egg consumption with minimal friction. Designed to integrate with Google Sheets for data storage and tracking.

## Features

- **Mobile-first design** optimized for phone usage
- **Single-page application** with no navigation needed
- **Date selection** with calendar modal for retroactive logging
- **Preparation style selection** (Scrambled, Fried, Boiled, Other)
- **Quantity selector** with +/- buttons (1-12 eggs)
- **Google Sheets integration** for data persistence
- **Responsive design** that works on both mobile and desktop
- **Orange/yellow color scheme** to match egg theme

## Quick Start

1. **Download the app**: Save `index.html` to your device
2. **Set up Google Sheets API** (see instructions below)
3. **Open the app** in your mobile browser
4. **Click the settings gear** (⚙️) to enter your Google Sheets credentials
5. **Start logging your egg consumption!**

## Google Sheets API Setup

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select an existing one
3. Enable the Google Sheets API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Sheets API"
   - Click "Enable"

### Step 2: Create Credentials

**Option A: Service Account (Recommended for personal use)**

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "Service Account"
3. Fill in the service account details
4. Click "Create and Continue"
5. Skip the optional steps and click "Done"
6. Click on the created service account
7. Go to the "Keys" tab
8. Click "Add Key" > "Create new key" > "JSON"
9. Download the JSON file

**Option B: OAuth 2.0 (For public deployment)**

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Configure the OAuth consent screen if prompted
4. Select "Web application" as the application type
5. Add your domain to authorized origins
6. Note the Client ID and Client Secret

### Step 3: Set Up Your Google Sheet

1. Create a new Google Sheet or use an existing one
2. Set up columns (or use existing format):
   - Column A: Timestamp (MM/DD/YYYY HH:MM:SS)
   - Column B: Date Eaten (MM/DD/YYYY)
   - Column C: Preparation Style (text)
   - Column D: Quantity Eaten (number)
   - Column E: Location Eaten (optional/legacy)

3. **For Service Account**: Share the sheet with your service account email (found in the JSON file)
4. **For OAuth**: Make sure you have edit access to the sheet
5. Copy the Sheet ID from the URL (the long string between `/d/` and `/edit`)

### Step 4: Get Access Token

**For Service Account:**
You'll need to generate an access token. This can be done using various tools or by implementing JWT signing. For testing, you can use the [Google OAuth 2.0 Playground](https://developers.google.com/oauthplayground/).

**For OAuth 2.0:**
Use the OAuth flow to get an access token for the user.

### Step 5: Configure the App

1. Open The Daily Yolk in your browser
2. Click the settings gear (⚙️) in the top right
3. Enter your:
   - **Google Sheets ID**: The ID from your sheet URL
   - **Access Token**: Your generated access token
4. Click "Save"

## Deployment to Vercel

1. **Create a Vercel account** at [vercel.com](https://vercel.com)
2. **Install Vercel CLI** (optional):
   ```bash
   npm i -g vercel
   ```
3. **Deploy**:
   - Drag and drop `index.html` to Vercel dashboard, or
   - Use CLI: `vercel --prod`
4. **Add as home screen bookmark** on your mobile device

## Usage

1. **Select date**: Click the date at the top to choose when you ate the eggs (defaults to today)
2. **Choose preparation**: Tap one of the four preparation style buttons
3. **Set quantity**: Use +/- buttons to select how many eggs (1-12)
4. **Submit**: Tap the green Submit button
5. **Success**: You'll see a success message and the form will reset for the next entry

## Browser Compatibility

- **Primary target**: Firefox on Android
- **Supported**: Chrome, Safari, Firefox on mobile and desktop
- **Optimized for**: Home screen bookmark functionality
- **Compatible with**: Hermit Lite app wrapper

## Data Format

The app appends data to your Google Sheet in this format:

| Column A (Timestamp) | Column B (Date Eaten) | Column C (Preparation) | Column D (Quantity) | Column E (Location) |
|---------------------|----------------------|----------------------|-------------------|-------------------|
| 07/25/2025 08:30:15 | 07/25/2025          | Scrambled            | 3                 | (empty)           |

## Security Notes

- Credentials are stored in browser localStorage
- Access tokens should be scoped to only Google Sheets
- Consider token refresh for long-term use
- For production use, implement proper server-side authentication

## Troubleshooting

### "Google Sheets not configured" error
- Make sure you've clicked the settings gear and entered your credentials
- Verify your Google Sheets ID is correct
- Check that your access token is valid

### "Google Sheets API error" messages
- Verify the sheet is shared with your service account (if using service account)
- Check that your access token has the correct scopes
- Ensure the Google Sheets API is enabled in your Google Cloud project

### App not working on mobile
- Make sure you're using a modern mobile browser
- Try adding the app to your home screen as a bookmark
- Check that JavaScript is enabled

### Data not appearing in sheet
- Verify you're looking at the correct sheet tab (usually "Sheet1")
- Check that the sheet has the expected column structure
- Look for any error messages in the browser console

## PWA Features (Future Enhancement)

To make this a full Progressive Web App:

1. Add a `manifest.json` file
2. Implement a service worker for offline functionality
3. Add appropriate meta tags and icons
4. Enable "Add to Home Screen" prompts

## Contributing

This is a personal-use MVP, but improvements are welcome:

- Better authentication flow
- Offline capability with sync
- Export functionality
- Analytics dashboard
- Customizable preparation styles

## License

MIT License - feel free to use and modify for your own egg tracking needs!