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
const { HashtagAnalyzer } = require('./api/advanced-analytics.js');
const { PromptIntegrationSystem } = require('./prompts/prompt-integration.js');

// API Routes
app.post('/api/analyze', async (req, res) => {
    await analyzeHandler(req, res);
});

app.post('/api/analyze-real', async (req, res) => {
    await analyzeRealHandler(req, res);
});

// Advanced Analytics Endpoint
app.post('/api/advanced-analytics', async (req, res) => {
    try {
        const { meal_type, analysis_type = 'hashtag_roi', timeframe = 7 } = req.body;
        
        console.log(`🔬 Advanced analytics for ${meal_type}: ${analysis_type}`);
        
        const hashtagAnalyzer = new HashtagAnalyzer();
        
        let analysisResult = {};
        
        switch (analysis_type) {
            case 'hashtag_roi':
                analysisResult = await hashtagAnalyzer.analyzeHashtagROI(meal_type, timeframe);
                break;
            case 'full_analysis':
                // Run comprehensive analysis (we'll add more types here)
                analysisResult = {
                    hashtag_roi: await hashtagAnalyzer.analyzeHashtagROI(meal_type, timeframe),
                    // competitor_analysis: await competitorAnalyzer.analyze(meal_type),
                    // content_optimization: await contentAnalyzer.analyze(meal_type),
                    timestamp: new Date().toISOString()
                };
                break;
            default:
                return res.status(400).json({ 
                    error: 'Invalid analysis type',
                    available_types: ['hashtag_roi', 'full_analysis']
                });
        }
        
        res.json({
            meal_type,
            analysis_type,
            timeframe,
            timestamp: new Date().toISOString(),
            results: analysisResult
        });
        
    } catch (error) {
        console.error('❌ Advanced analytics error:', error);
        res.status(500).json({
            error: 'Advanced analytics failed',
            message: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Advanced Content Generation Endpoint with ROI-optimized prompts
app.post('/api/generate-content', async (req, res) => {
    try {
        const { meal_type, content_type = 'caption' } = req.body;
        
        if (!meal_type || !['colazione', 'pranzo', 'aperitivo'].includes(meal_type)) {
            return res.status(400).json({
                error: 'Invalid meal_type',
                valid_types: ['colazione', 'pranzo', 'aperitivo']
            });
        }
        
        console.log(`🎯 Generating optimized content for ${meal_type}...`);
        
        const promptSystem = new PromptIntegrationSystem();
        const result = await promptSystem.generateOptimizedContent(meal_type);
        
        res.json({
            meal_type,
            content_type,
            timestamp: new Date().toISOString(),
            generated_content: result,
            optimization_data: {
                hashtag_strategy: result.analytics_data?.hashtag_strategy,
                roi_score: result.analytics_data?.roi_score,
                optimal_posting_time: result.analytics_data?.optimal_time,
                engagement_prediction: result.analytics_data?.engagement_prediction
            }
        });
        
    } catch (error) {
        console.error('❌ Content generation error:', error);
        res.status(500).json({
            error: 'Content generation failed',
            message: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Batch Content Generation for all meal types
app.post('/api/generate-all-content', async (req, res) => {
    try {
        console.log('🚀 Generating content for all meal types...');
        
        const promptSystem = new PromptIntegrationSystem();
        const results = await promptSystem.generateAllMealTypes();
        
        res.json({
            timestamp: new Date().toISOString(),
            batch_generation: true,
            results,
            summary: results.summary
        });
        
    } catch (error) {
        console.error('❌ Batch content generation error:', error);
        res.status(500).json({
            error: 'Batch content generation failed',
            message: error.message,
            timestamp: new Date().toISOString()
        });
    }
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
                `https://graph.facebook.com/v18.0/${INSTAGRAM_ACCOUNT_ID}/media?fields=id,insights.metric(impressions,reach)&limit=1&access_token=${INSTAGRAM_TOKEN}`
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
    console.log(`   - POST /api/advanced-analytics`);
    console.log(`   - POST /api/generate-content`);
    console.log(`   - POST /api/generate-all-content`);
    console.log(`🌐 Dashboard: http://localhost:${PORT}/config`);
    console.log(`🔬 Advanced Analytics: Hashtag ROI, Competitor Analysis, Content Optimization`);
    console.log(`🎯 AI Content Generation: ROI-optimized OpenAI prompts with real-time analytics`);
});