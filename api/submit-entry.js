import { GoogleAuth } from 'google-auth-library';

export default async function handler(req, res) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  console.log('API Request received:', {
    method: req.method,
    body: req.body,
    headers: req.headers
  });

  try {
    const { dateEaten, preparation, quantity } = req.body;

    // Validate input
    if (!dateEaten || !preparation || !quantity) {
      console.error('Missing required fields:', { dateEaten, preparation, quantity });
      return res.status(400).json({ 
        error: 'Missing required fields',
        received: { dateEaten, preparation, quantity }
      });
    }

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

    console.log('Environment variables present:', {
      GOOGLE_PROJECT_ID: !!process.env.GOOGLE_PROJECT_ID,
      GOOGLE_PRIVATE_KEY_ID: !!process.env.GOOGLE_PRIVATE_KEY_ID,
      GOOGLE_PRIVATE_KEY: !!process.env.GOOGLE_PRIVATE_KEY,
      GOOGLE_CLIENT_EMAIL: !!process.env.GOOGLE_CLIENT_EMAIL,
      GOOGLE_CLIENT_ID: !!process.env.GOOGLE_CLIENT_ID,
      GOOGLE_SHEET_ID: !!process.env.GOOGLE_SHEET_ID
    });

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
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });

    console.log('Attempting to get Google Auth client...');
    const client = await auth.getClient();
    console.log('Successfully got Google Auth client');
    
    // Prepare the data
    const now = new Date();
    const timestamp = `${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')}/${now.getFullYear()} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    
    const rowData = [timestamp, dateEaten, preparation, quantity, ''];
    console.log('Prepared row data:', rowData);

    // Get access token
    console.log('Getting access token...');
    const accessToken = await client.getAccessToken();
    console.log('Access token obtained:', !!accessToken.token);

    // Submit to Google Sheets
    const sheetsUrl = `https://sheets.googleapis.com/v4/spreadsheets/${process.env.GOOGLE_SHEET_ID}/values/Sheet1:append?valueInputOption=RAW`;
    console.log('Submitting to Google Sheets URL:', sheetsUrl);

    const response = await fetch(sheetsUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: [rowData]
      })
    });

    console.log('Google Sheets response status:', response.status);
    console.log('Google Sheets response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Google Sheets API error response:', errorText);
      
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch (parseError) {
        console.error('Failed to parse error response:', parseError);
        throw new Error(`Google Sheets API error (${response.status}): ${errorText}`);
      }
      
      throw new Error(`Google Sheets API error: ${errorData.error?.message || errorData.error || 'Unknown error'}`);
    }

    const result = await response.json();
    console.log('Successfully submitted to Google Sheets:', result);

    res.status(200).json({ 
      success: true, 
      message: 'Entry submitted successfully',
      data: rowData
    });

  } catch (error) {
    console.error('API Error Details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    
    res.status(500).json({ 
      error: `Failed to submit entry: ${error.message}`,
      type: error.name
    });
  }
} 