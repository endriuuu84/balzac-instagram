const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('dashboard-control'));

// Import API handlers - we'll create wrapper functions
const analyzeHandler = require('./api/analyze-wrapper.js');
const analyzeRealHandler = require('./api/analyze-real-wrapper.js');

// API Routes
app.post('/api/analyze', async (req, res) => {
    await analyzeHandler(req, res);
});

app.post('/api/analyze-real', async (req, res) => {
    await analyzeRealHandler(req, res);
});

// Serve dashboard
app.get('/config', (req, res) => {
    res.sendFile(path.join(__dirname, 'dashboard-control', 'config-dashboard.html'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'dashboard-control', 'index.html'));
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Debug endpoint to check environment variables
app.get('/debug/env', (req, res) => {
    res.json({
        hasApifyToken: !!process.env.APIFY_API_TOKEN,
        hasInstagramToken: !!process.env.INSTAGRAM_ACCESS_TOKEN,
        hasInstagramAppId: !!process.env.INSTAGRAM_APP_ID,
        hasInstagramAppSecret: !!process.env.INSTAGRAM_APP_SECRET,
        hasInstagramAccountId: !!process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID,
        tokenLength: process.env.INSTAGRAM_ACCESS_TOKEN ? process.env.INSTAGRAM_ACCESS_TOKEN.length : 0,
        timestamp: new Date().toISOString()
    });
});

// Debug Instagram Graph API
app.get('/debug/instagram', async (req, res) => {
    try {
        const INSTAGRAM_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;
        const INSTAGRAM_ACCOUNT_ID = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;
        
        console.log('🔍 Testing Instagram Graph API...');
        console.log('Account ID:', INSTAGRAM_ACCOUNT_ID);
        console.log('Token length:', INSTAGRAM_TOKEN ? INSTAGRAM_TOKEN.length : 0);
        
        // Test 1: Basic account info
        const accountResponse = await fetch(
            `https://graph.facebook.com/v18.0/${INSTAGRAM_ACCOUNT_ID}?fields=followers_count,media_count&access_token=${INSTAGRAM_TOKEN}`
        );
        
        let accountData = null;
        if (accountResponse.ok) {
            accountData = await accountResponse.json();
            console.log('✅ Account data:', accountData);
        } else {
            const accountError = await accountResponse.text();
            console.log('❌ Account error:', accountError);
        }
        
        // Test 2: Media list
        const mediaResponse = await fetch(
            `https://graph.facebook.com/v18.0/${INSTAGRAM_ACCOUNT_ID}/media?fields=id,caption,comments_count,like_count,timestamp&limit=3&access_token=${INSTAGRAM_TOKEN}`
        );
        
        let mediaData = null;
        let mediaError = null;
        if (mediaResponse.ok) {
            mediaData = await mediaResponse.json();
            console.log('✅ Media data:', mediaData.data?.length || 0, 'posts');
        } else {
            mediaError = await mediaResponse.text();
            console.log('❌ Media error:', mediaError);
        }
        
        // Test 3: Insights (this might be the issue)
        let insightsData = null;
        let insightsError = null;
        try {
            const insightsResponse = await fetch(
                `https://graph.facebook.com/v18.0/${INSTAGRAM_ACCOUNT_ID}/media?fields=id,insights.metric(engagement,impressions,reach)&limit=1&access_token=${INSTAGRAM_TOKEN}`
            );
            
            if (insightsResponse.ok) {
                insightsData = await insightsResponse.json();
                console.log('✅ Insights test passed');
            } else {
                insightsError = await insightsResponse.text();
                console.log('❌ Insights error:', insightsError);
            }
        } catch (error) {
            insightsError = error.message;
            console.log('❌ Insights exception:', error.message);
        }
        
        res.json({
            timestamp: new Date().toISOString(),
            account_test: {
                success: !!accountData,
                data: accountData,
                error: accountResponse.ok ? null : 'See server logs'
            },
            media_test: {
                success: !!mediaData,
                posts_count: mediaData?.data?.length || 0,
                error: mediaError
            },
            insights_test: {
                success: !!insightsData,
                error: insightsError
            },
            config: {
                account_id: INSTAGRAM_ACCOUNT_ID,
                token_length: INSTAGRAM_TOKEN ? INSTAGRAM_TOKEN.length : 0
            }
        });
        
    } catch (error) {
        console.error('❌ Debug error:', error);
        res.status(500).json({
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Balzac Instagram server running on port ${PORT}`);
    console.log(`📊 API endpoints:`);
    console.log(`   - POST /api/analyze`);
    console.log(`   - POST /api/analyze-real`);
    console.log(`🌐 Dashboard: http://localhost:${PORT}/config`);
});