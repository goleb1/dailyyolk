export default async function handler(req, res) {
  try {
    // Check which environment variables are set
    const envVars = {
      GOOGLE_PROJECT_ID: process.env.GOOGLE_PROJECT_ID ? '✅ Set' : '❌ Missing',
      GOOGLE_PRIVATE_KEY_ID: process.env.GOOGLE_PRIVATE_KEY_ID ? '✅ Set' : '❌ Missing',
      GOOGLE_PRIVATE_KEY: process.env.GOOGLE_PRIVATE_KEY ? '✅ Set' : '❌ Missing',
      GOOGLE_CLIENT_EMAIL: process.env.GOOGLE_CLIENT_EMAIL ? '✅ Set' : '❌ Missing',
      GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? '✅ Set' : '❌ Missing',
      GOOGLE_CLIENT_CERT_URL: process.env.GOOGLE_CLIENT_CERT_URL ? '✅ Set' : '❌ Missing',
      GOOGLE_SHEET_ID: process.env.GOOGLE_SHEET_ID ? '✅ Set' : '❌ Missing'
    };

    // Check private key format
    const privateKey = process.env.GOOGLE_PRIVATE_KEY;
    const keyFormat = privateKey ? 
      (privateKey.includes('-----BEGIN PRIVATE KEY-----') ? '✅ Correct format' : '❌ Wrong format') : 
      '❌ Missing';

    res.status(200).json({
      message: 'Environment Variables Check',
      environmentVariables: envVars,
      privateKeyFormat: keyFormat,
      sheetId: process.env.GOOGLE_SHEET_ID ? 'Set' : 'Missing'
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
} 