// Exchange Instagram Authorization Code for Access Token
const https = require('https');
const querystring = require('querystring');
require('dotenv').config();

const APP_ID = process.env.INSTAGRAM_APP_ID || '690017453674670';
const APP_SECRET = process.env.INSTAGRAM_APP_SECRET || 'dfedcc19f2157e3c5047dba4d570441f';
const REDIRECT_URI = 'https://localhost:3000/auth/callback';

async function exchangeCodeForToken(code) {
    console.log('🔄 Exchanging authorization code for access token...\n');
    
    const data = querystring.stringify({
        client_id: APP_ID,
        client_secret: APP_SECRET,
        grant_type: 'authorization_code',
        redirect_uri: REDIRECT_URI,
        code: code
    });
    
    const options = {
        hostname: 'api.instagram.com',
        path: '/oauth/access_token',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': data.length
        }
    };
    
    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let responseData = '';
            
            res.on('data', (chunk) => {
                responseData += chunk;
            });
            
            res.on('end', () => {
                try {
                    const result = JSON.parse(responseData);
                    
                    if (result.access_token) {
                        console.log('✅ Short-lived token obtained!');
                        console.log('User ID:', result.user_id);
                        resolve(result);
                    } else {
                        console.error('❌ Error:', result);
                        reject(result);
                    }
                } catch (error) {
                    console.error('❌ Parse error:', error);
                    reject(error);
                }
            });
        });
        
        req.on('error', reject);
        req.write(data);
        req.end();
    });
}

async function getLongLivedToken(shortToken) {
    console.log('\n🔄 Converting to long-lived token...\n');
    
    const url = `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${APP_SECRET}&access_token=${shortToken}`;
    
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                try {
                    const result = JSON.parse(data);
                    
                    if (result.access_token) {
                        console.log('✅ Long-lived token obtained!');
                        console.log(`Expires in: ${Math.floor(result.expires_in / 86400)} days`);
                        resolve(result);
                    } else {
                        reject(result);
                    }
                } catch (error) {
                    reject(error);
                }
            });
        }).on('error', reject);
    });
}

async function getInstagramBusinessAccount(accessToken) {
    // This requires Facebook Page token
    console.log('\n📱 To get Instagram Business Account ID:');
    console.log('1. Go to: https://developers.facebook.com/tools/explorer');
    console.log('2. Select your app and get Page Access Token');
    console.log('3. Run this query: /me/accounts');
    console.log('4. Find your page and get the instagram_business_account ID\n');
}

// Main execution
async function main() {
    console.log('🚀 INSTAGRAM TOKEN EXCHANGE\n');
    
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
        console.log('Usage: node exchange-token.js [authorization_code]');
        console.log('\nTo get authorization code:');
        console.log('1. Open generate-token.html in browser');
        console.log('2. Click "Autorizza Balzac App"');
        console.log('3. Login and authorize');
        console.log('4. Copy the code from redirect URL');
        console.log('\nExample: node exchange-token.js AQD...\n');
        return;
    }
    
    const authCode = args[0];
    
    try {
        // Step 1: Exchange code for short-lived token
        const shortTokenResult = await exchangeCodeForToken(authCode);
        
        // Step 2: Convert to long-lived token
        const longTokenResult = await getLongLivedToken(shortTokenResult.access_token);
        
        // Step 3: Display configuration
        console.log('\n✅ SUCCESS! Add these to your .env file:\n');
        console.log('# Instagram API Configuration');
        console.log(`INSTAGRAM_USER_ID=${shortTokenResult.user_id}`);
        console.log(`INSTAGRAM_ACCESS_TOKEN=${longTokenResult.access_token}`);
        console.log(`# Token expires: ${new Date(Date.now() + longTokenResult.expires_in * 1000).toLocaleDateString()}`);
        
        await getInstagramBusinessAccount(longTokenResult.access_token);
        
    } catch (error) {
        console.error('\n❌ Error:', error);
        console.log('\nCommon issues:');
        console.log('- Code already used (codes are single-use)');
        console.log('- Code expired (valid for 1 hour)');
        console.log('- Invalid redirect URI');
    }
}

main();