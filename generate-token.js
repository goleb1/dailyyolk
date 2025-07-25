const { GoogleAuth } = require('google-auth-library');

async function generateAccessToken() {
    try {
        // Initialize the Google Auth client with your service account
        const auth = new GoogleAuth({
            keyFile: './service-account-key.json', // Path to your downloaded JSON file
            scopes: ['https://www.googleapis.com/auth/spreadsheets']
        });

        // Get the authenticated client
        const client = await auth.getClient();
        
        // Get the access token
        const accessToken = await client.getAccessToken();
        
        console.log('✅ Access Token Generated Successfully!');
        console.log('🔑 Access Token:', accessToken.token);
        console.log('\n📝 Instructions:');
        console.log('1. Copy the access token above');
        console.log('2. Open your Daily Yolk app');
        console.log('3. Click the settings gear (⚙️)');
        console.log('4. Paste the token in the "Access Token" field');
        console.log('5. Enter your Google Sheets ID');
        console.log('6. Click Save');
        console.log('\n⚠️  Note: This token will expire in 1 hour. For production use, you\'ll need to implement token refresh.');
        
    } catch (error) {
        console.error('❌ Error generating access token:', error.message);
        console.log('\n🔧 Troubleshooting:');
        console.log('1. Make sure you have the service account JSON file in the same directory');
        console.log('2. Rename it to "service-account-key.json"');
        console.log('3. Make sure you have Node.js installed');
        console.log('4. Run: npm install google-auth-library');
    }
}

generateAccessToken(); 