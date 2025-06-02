// API Server per Data Analysis - Integrazione con Make.com
const express = require('express');
const cors = require('cors');
const RealDataAnalyzer = require('./real-data-analyzer');
require('dotenv').config({ path: '../.env' });

const app = express();
app.use(cors());
app.use(express.json());

// Inizializza analyzer con credenziali
const analyzer = new RealDataAnalyzer({
    instagramToken: process.env.INSTAGRAM_ACCESS_TOKEN,
    instagramUserId: process.env.INSTAGRAM_USER_ID,
    apifyToken: process.env.APIFY_API_TOKEN
});

// Cache per ridurre chiamate API
const cache = {
    data: null,
    timestamp: null,
    ttl: 3600000 // 1 ora
};

// Endpoint principale per Make.com
app.post('/api/analyze', async (req, res) => {
    try {
        const { meal_type, force_refresh = false } = req.body;
        
        console.log(`📊 Richiesta analisi per: ${meal_type}`);
        
        // Usa cache se disponibile e non scaduta
        if (!force_refresh && cache.data && cache.timestamp && 
            (Date.now() - cache.timestamp < cache.ttl)) {
            console.log('📦 Usando dati dalla cache');
            return res.json({
                ...cache.data,
                cached: true,
                meal_type: meal_type
            });
        }

        // Analisi real-time
        console.log('🔄 Eseguendo analisi real-time...');
        
        // 1. Ottieni insights Instagram
        const instagramInsights = await analyzer.getInstagramInsights();
        
        // 2. Analizza hashtag performance
        const hashtagRecommendations = await analyzer.getHashtagRecommendations(meal_type);
        
        // 3. Ottieni orari ottimali
        const optimalTimes = await analyzer.getOptimalPostingTimes();
        
        // 4. Analizza competitor (limitato per velocità)
        const competitorData = await analyzer.analyzeCompetitors(['osteriafrancescana']);

        // Prepara risposta ottimizzata per Make.com
        const response = {
            timestamp: new Date().toISOString(),
            meal_type: meal_type,
            
            // Hashtag ottimizzati
            hashtags: generateOptimalHashtagMix(hashtagRecommendations, meal_type),
            
            // Orario consigliato
            optimal_time: getOptimalTimeForMealType(optimalTimes, meal_type),
            
            // Suggerimenti contenuto
            content_suggestions: generateContentSuggestions(
                instagramInsights, 
                competitorData, 
                meal_type
            ),
            
            // Metriche performance
            performance_metrics: {
                expected_reach: estimateReach(hashtagRecommendations),
                best_performing_hashtags: getBestHashtags(instagramInsights),
                avoid_hashtags: hashtagRecommendations.avoid || [],
                trending_now: getTrendingHashtags(hashtagRecommendations)
            },
            
            // Context per OpenAI
            ai_context: {
                season: getCurrentSeason(),
                day_type: getDayType(),
                local_events: getLocalEvents(),
                weather_mood: getWeatherMood(),
                competitor_insights: formatCompetitorInsights(competitorData)
            }
        };

        // Aggiorna cache
        cache.data = response;
        cache.timestamp = Date.now();

        res.json(response);

    } catch (error) {
        console.error('❌ Errore analisi:', error);
        
        // Fallback con dati statici se API falliscono
        res.json(getFallbackData(req.body.meal_type));
    }
});

// Endpoint semplificato per test rapidi
app.get('/api/quick-hashtags/:meal_type', async (req, res) => {
    const { meal_type } = req.params;
    
    // Ritorna hashtag pre-ottimizzati per velocità
    const quickHashtags = {
        colazione: '#cappuccino #colazione #breakfast #modena #italianbreakfast #cornetto #buongiorno #modenafood #balzacmodena #breakfasttime #coffee #barista #colazionetime #italia #foodporn #instafood #morningvibes #cappuccinoart #brioches #balzacbistrot',
        
        pranzo: '#pranzo #lunch #pasta #modena #italianfood #tortellini #cucinaemiliana #pranzoitaliano #modenafood #balzacmodena #foodie #italianrestaurant #tagliatelle #tradizione #mangiarbene #tortellinimodena #emiliaromagna #balzacbistrot #buonappetito #foodstagram',
        
        aperitivo: '#aperitivo #spritz #happyhour #modena #aperitif #cocktails #aperitivotime #modenaapertime #balzacmodena #aperol #drinks #aperitivoitaliano #socialdrinks #afterwork #spritztime #modenabynight #cocktailbar #balzacaperitivo #cheers #balzacbistrot'
    };

    res.json({
        meal_type: meal_type,
        hashtags: quickHashtags[meal_type] || quickHashtags.aperitivo,
        count: 20
    });
});

// Endpoint per statistiche dashboard
app.get('/api/stats', async (req, res) => {
    try {
        const insights = await analyzer.getInstagramInsights();
        
        res.json({
            last_update: new Date().toISOString(),
            account_stats: {
                avg_engagement: insights?.averageEngagement || 0,
                best_posting_times: insights?.optimalPostTimes || [],
                top_hashtags: insights?.bestPerformingHashtags?.slice(0, 10) || []
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Stats unavailable' });
    }
});

// Helper Functions
function generateOptimalHashtagMix(recommendations, mealType) {
    const mix = [];
    
    // 30% High performance (5-6 hashtags)
    if (recommendations.highPerformance) {
        mix.push(...recommendations.highPerformance.slice(0, 6).map(h => h.tag));
    }
    
    // 40% Medium performance (8 hashtags)
    if (recommendations.mediumPerformance) {
        mix.push(...recommendations.mediumPerformance.slice(0, 8).map(h => h.tag));
    }
    
    // 20% Niche (4 hashtags)
    if (recommendations.niche) {
        mix.push(...recommendations.niche.slice(0, 4).map(h => h.tag));
    }
    
    // 10% Trending (2 hashtags)
    if (recommendations.trending) {
        mix.push(...recommendations.trending.slice(0, 2).map(h => h.tag || h));
    }
    
    // Always include brand hashtags
    mix.push('#balzacmodena', '#balzacbistrot');
    
    // Add meal-specific if missing
    const mealHashtags = {
        colazione: '#colazione',
        pranzo: '#pranzo',
        aperitivo: '#aperitivo'
    };
    
    if (!mix.includes(mealHashtags[mealType])) {
        mix.push(mealHashtags[mealType]);
    }
    
    // Remove duplicates and limit to 25
    return [...new Set(mix)].slice(0, 25).join(' ');
}

function getOptimalTimeForMealType(optimalTimes, mealType) {
    const defaults = {
        colazione: '07:30',
        pranzo: '12:30',
        aperitivo: '19:00'
    };
    
    if (optimalTimes && optimalTimes[mealType] && optimalTimes[mealType].bestHour) {
        const hour = Math.floor(optimalTimes[mealType].bestHour);
        const minutes = (optimalTimes[mealType].bestHour % 1) * 60;
        return `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }
    
    return defaults[mealType];
}

function generateContentSuggestions(insights, competitors, mealType) {
    const suggestions = [];
    
    // Suggerimenti basati su performance
    if (insights && insights.bestPerformingHashtags.length > 0) {
        const topHashtag = insights.bestPerformingHashtags[0];
        suggestions.push(`I post con ${topHashtag.tag} ricevono più engagement`);
    }
    
    // Suggerimenti basati su competitor
    if (competitors && competitors[0] && competitors[0].topHashtags) {
        suggestions.push(`I competitor usano spesso: ${competitors[0].topHashtags.slice(0, 3).join(', ')}`);
    }
    
    // Suggerimenti stagionali
    const seasonal = getSeasonalSuggestions(mealType);
    suggestions.push(seasonal);
    
    return suggestions;
}

function getBestHashtags(insights) {
    if (!insights || !insights.bestPerformingHashtags) return [];
    
    return insights.bestPerformingHashtags
        .slice(0, 5)
        .map(h => ({
            tag: h.tag,
            avg_engagement: Math.round(h.totalEngagement / h.count)
        }));
}

function getTrendingHashtags(recommendations) {
    if (!recommendations || !recommendations.trending) return [];
    
    return recommendations.trending
        .slice(0, 5)
        .map(h => typeof h === 'string' ? h : h.tag);
}

function estimateReach(recommendations) {
    let totalEngagement = 0;
    let count = 0;
    
    ['highPerformance', 'mediumPerformance'].forEach(category => {
        if (recommendations[category]) {
            recommendations[category].forEach(h => {
                totalEngagement += h.avgEngagement || 0;
                count++;
            });
        }
    });
    
    const avgEngagement = count > 0 ? totalEngagement / count : 0;
    
    if (avgEngagement > 5000) return 'Very High (10k+ reach)';
    if (avgEngagement > 2000) return 'High (5-10k reach)';
    if (avgEngagement > 1000) return 'Medium (2-5k reach)';
    return 'Standard (1-2k reach)';
}

function getCurrentSeason() {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return 'primavera';
    if (month >= 5 && month <= 7) return 'estate';
    if (month >= 8 && month <= 10) return 'autunno';
    return 'inverno';
}

function getDayType() {
    const day = new Date().getDay();
    return (day === 0 || day === 6) ? 'weekend' : 'feriale';
}

function getLocalEvents() {
    // Placeholder - potrebbe connettersi a API eventi locali
    const events = {
        'Motor Valley Fest': 'maggio',
        'Modena Park': 'estate',
        'Festival Filosofia': 'settembre',
        'Mercatino di Natale': 'dicembre'
    };
    
    const currentMonth = new Date().toLocaleString('it-IT', { month: 'long' });
    
    for (const [event, period] of Object.entries(events)) {
        if (period.includes(currentMonth)) {
            return event;
        }
    }
    
    return null;
}

function getWeatherMood() {
    // Placeholder - potrebbe connettersi a API meteo
    const season = getCurrentSeason();
    const moods = {
        primavera: 'fresco e soleggiato',
        estate: 'caldo e luminoso',
        autunno: 'tiepido e accogliente',
        inverno: 'freddo ma confortevole'
    };
    
    return moods[season];
}

function formatCompetitorInsights(competitorData) {
    if (!competitorData || competitorData.length === 0) return null;
    
    const competitor = competitorData[0];
    return {
        name: competitor.username,
        avg_engagement: competitor.avgLikes + competitor.avgComments,
        posting_frequency: `${competitor.postFrequency.toFixed(1)} posts/day`,
        top_strategies: competitor.topHashtags?.slice(0, 3) || []
    };
}

function getFallbackData(mealType) {
    // Dati di fallback se le API non funzionano
    return {
        timestamp: new Date().toISOString(),
        meal_type: mealType,
        hashtags: getQuickHashtags(mealType),
        optimal_time: getDefaultTime(mealType),
        content_suggestions: [
            'Usa foto con luce naturale',
            'Includi persone nei tuoi scatti',
            'Racconta una storia nel caption'
        ],
        performance_metrics: {
            expected_reach: 'Medium (2-5k reach)',
            best_performing_hashtags: [],
            avoid_hashtags: [],
            trending_now: ['#modena', '#italianfood', '#foodie']
        },
        ai_context: {
            season: getCurrentSeason(),
            day_type: getDayType(),
            local_events: null,
            weather_mood: getWeatherMood(),
            competitor_insights: null
        },
        fallback: true
    };
}

function getQuickHashtags(mealType) {
    const hashtags = {
        colazione: '#cappuccino #colazione #breakfast #modena #italianbreakfast',
        pranzo: '#pranzo #lunch #pasta #modena #italianfood',
        aperitivo: '#aperitivo #spritz #happyhour #modena #cocktails'
    };
    
    return hashtags[mealType] + ' #balzacmodena #balzacbistrot';
}

function getDefaultTime(mealType) {
    const times = {
        colazione: '07:30',
        pranzo: '12:30',
        aperitivo: '19:00'
    };
    
    return times[mealType];
}

// Health check
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        cache_active: cache.data !== null
    });
});

// Start server
const PORT = process.env.DATA_API_PORT || 3001;
app.listen(PORT, () => {
    console.log(`
🚀 Data Analysis API Server
==========================
✅ Server attivo su porta: ${PORT}
📊 Endpoints disponibili:

  POST /api/analyze
    - Analisi completa con dati reali
    - Body: { "meal_type": "colazione|pranzo|aperitivo" }
  
  GET /api/quick-hashtags/:meal_type
    - Hashtag pre-ottimizzati (veloce)
  
  GET /api/stats
    - Statistiche account
  
  GET /health
    - Health check

🔗 Per Make.com usa: http://localhost:${PORT}/api/analyze
==========================
    `);
});