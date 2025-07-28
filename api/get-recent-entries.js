import { GoogleAuth } from 'google-auth-library';

export default async function handler(req, res) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  console.log('Get recent entries API request received');

  try {
    // Check environment variables
    const requiredEnvVars = [
      'GOOGLE_PROJECT_ID',
      'GOOGLE_PRIVATE_KEY_ID', 
      'GOOGLE_PRIVATE_KEY',
      'GOOGLE_CLIENT_EMAIL',
      'GOOGLE_CLIENT_ID',
      'GOOGLE_SHEET_ID'
    ];

    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    if (missingVars.length > 0) {
      console.error('Missing environment variables:', missingVars);
      return res.status(500).json({ 
        error: 'Server configuration error: Missing environment variables',
        missing: missingVars
      });
    }

    // Initialize Google Auth with service account
    const auth = new GoogleAuth({
      credentials: {
        type: 'service_account',
        project_id: process.env.GOOGLE_PROJECT_ID,
        private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        client_id: process.env.GOOGLE_CLIENT_ID,
        auth_uri: 'https://accounts.google.com/o/oauth2/auth',
        token_uri: 'https://oauth2.googleapis.com/token',
        auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
        client_x509_cert_url: process.env.GOOGLE_CLIENT_CERT_URL
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly']
    });

    console.log('Attempting to get Google Auth client...');
    const client = await auth.getClient();
    console.log('Successfully got Google Auth client');
    
    // Get access token
    console.log('Getting access token...');
    const accessToken = await client.getAccessToken();
    console.log('Access token obtained:', !!accessToken.token);

    // Get sheet name (default to 'Sheet1' if not specified)
    const sheetName = process.env.GOOGLE_SHEET_NAME || 'Sheet1';
    console.log('Using sheet name:', sheetName);

    // Get data from Column B (Date Eaten) - we need to query a larger range to get all dates
    const range = `${sheetName}!B:B`;
    const sheetsUrl = `https://sheets.googleapis.com/v4/spreadsheets/${process.env.GOOGLE_SHEET_ID}/values/${encodeURIComponent(range)}`;
    console.log('Fetching data from Google Sheets URL:', sheetsUrl);

    const response = await fetch(sheetsUrl, {
      headers: {
        'Authorization': `Bearer ${accessToken.token}`,
      }
    });

    console.log('Google Sheets response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Google Sheets API error response:', errorText);
      throw new Error(`Google Sheets API error (${response.status}): ${errorText}`);
    }

    const result = await response.json();
    const values = result.values || [];
    console.log('Retrieved', values.length, 'rows from Google Sheets');

    // Calculate date range for the past 7 days (6 previous days + today)
    const today = new Date();
    const weekData = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      
      const dateString = `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}/${date.getFullYear()}`;
      const isoDateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      
      // Check if this date exists in the sheet data
      // Skip the header row (index 0) if it exists
      const hasEntries = values.slice(1).some(row => {
        if (!row[0]) return false;
        
        // Handle different date formats that might be in the sheet
        const cellValue = row[0].toString().trim();
        
        // Try to match MM/DD/YYYY format
        if (cellValue === dateString) return true;
        
        // Try to parse the date and compare
        try {
          const parsedDate = new Date(cellValue);
          if (!isNaN(parsedDate.getTime())) {
            const parsedDateString = `${String(parsedDate.getMonth() + 1).padStart(2, '0')}/${String(parsedDate.getDate()).padStart(2, '0')}/${parsedDate.getFullYear()}`;
            return parsedDateString === dateString;
          }
        } catch (error) {
          // Ignore parsing errors
        }
        
        return false;
      });
      
      weekData.push({
        date: isoDateString,
        hasEntries: hasEntries,
        dayNumber: date.getDate()
      });
    }

    console.log('Generated week data:', weekData);

    res.status(200).json({ 
      success: true,
      weekData: weekData
    });

  } catch (error) {
    console.error('API Error Details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch recent entries'
    });
  }
}