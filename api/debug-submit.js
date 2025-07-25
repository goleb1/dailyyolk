import { GoogleAuth } from 'google-auth-library';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { dateEaten, preparation, quantity } = req.body;

    // Step 1: Validate input
    console.log('Step 1: Input validation');
    if (!dateEaten || !preparation || !quantity) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Step 2: Check environment variables
    console.log('Step 2: Environment variables check');
    if (!process.env.GOOGLE_SHEET_ID) {
      return res.status(500).json({ error: 'GOOGLE_SHEET_ID not set' });
    }

    // Step 3: Initialize Google Auth
    console.log('Step 3: Initializing Google Auth');
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

    // Step 4: Get client
    console.log('Step 4: Getting client');
    const client = await auth.getClient();
    
    // Step 5: Get access token
    console.log('Step 5: Getting access token');
    const accessToken = await client.getAccessToken();
    console.log('Access token obtained:', !!accessToken.token);
    
    // Step 6: Prepare data
    console.log('Step 6: Preparing data');
    const now = new Date();
    const timestamp = `${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')}/${now.getFullYear()} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    
    const rowData = [timestamp, dateEaten, preparation, quantity, ''];

    // Step 7: Submit to Google Sheets
    console.log('Step 7: Submitting to Google Sheets');
    const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${process.env.GOOGLE_SHEET_ID}/values/Sheet1:append?valueInputOption=RAW`, {
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

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Google Sheets error:', errorData);
      throw new Error(`Google Sheets API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const result = await response.json();
    console.log('Google Sheets success:', result);

    res.status(200).json({ 
      success: true, 
      message: 'Entry submitted successfully',
      debug: {
        steps: 'All steps completed successfully',
        sheetId: process.env.GOOGLE_SHEET_ID,
        dataSubmitted: rowData
      }
    });

  } catch (error) {
    console.error('Debug API Error:', error);
    res.status(500).json({ 
      error: 'Failed to submit entry',
      debug: {
        message: error.message,
        stack: error.stack
      }
    });
  }
} 