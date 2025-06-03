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

app.listen(PORT, () => {
    console.log(`🚀 Balzac Instagram server running on port ${PORT}`);
    console.log(`📊 API endpoints:`);
    console.log(`   - POST /api/analyze`);
    console.log(`   - POST /api/analyze-real`);
    console.log(`🌐 Dashboard: http://localhost:${PORT}/config`);
});