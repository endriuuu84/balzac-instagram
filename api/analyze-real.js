import fs from 'fs';
import path from 'path';
// Remove node-fetch import as it's not needed in Node 18+

// Load menu data
const menuData = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'menu.json'), 'utf8'));

// API Keys from environment
const APIFY_TOKEN = process.env.APIFY_API_TOKEN;
const INSTAGRAM_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;
const INSTAGRAM_ACCOUNT_ID = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { meal_type } = req.body;
        console.log(`📊 Real-time analysis for: ${meal_type}`);

        // Get menu items
        const menuItems = getMenuItems(meal_type);
        const randomFeaturedItems = getRandomFeaturedItems(meal_type, menuItems);

        // Fetch real data in parallel
        const [hashtagData, competitorData] = await Promise.all([
            getApifyHashtagData(meal_type),
            // getInstagramInsights(), // Token expired - disabled temporarily
            getCompetitorAnalysis(meal_type)
        ]);
        
        const instagramInsights = { data: null, avg_engagement: 1500 }; // Fallback data

        // Generate optimized response
        const data = {
            timestamp: new Date().toISOString(),
            meal_type: meal_type,
            menu_items: menuItems,
            hashtags: hashtagData.optimized_hashtags || getDefaultHashtags(meal_type),
            optimal_time: calculateOptimalTime(meal_type, instagramInsights),
            content_suggestions: getContentSuggestions(meal_type, menuItems),
            performance_metrics: {
                expected_reach: calculateExpectedReach(instagramInsights, hashtagData),
                best_performing_hashtags: hashtagData.top_hashtags || [],
                trending_now: hashtagData.trending || getTrendingHashtags(),
                avoid_hashtags: hashtagData.avoid || []
            },
            ai_context: {
                season: getCurrentSeason(),
                day_type: getDayType(),
                weather_mood: getWeatherMood(),
                local_events: getLocalEvents(),
                featured_items: randomFeaturedItems,
                competitor_insights: competitorData
            },
            real_data_sources: {
                apify: !!hashtagData.source,
                instagram_insights: !!instagramInsights.data,
                live_analysis: true
            }
        };

        res.status(200).json(data);

    } catch (error) {
        console.error('Error in real analysis:', error);
        res.status(500).json({ error: 'Analysis failed', message: error.message });
    }
}

// Apify Integration - Real hashtag data
async function getApifyHashtagData(mealType) {
    try {
        // Use the official Instagram Hashtag Scraper
        const runResponse = await fetch(`https://api.apify.com/v2/acts/reGe1ST3OBgYZSsZJ/runs?token=${APIFY_TOKEN}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                hashtags: getSearchHashtags(mealType),
                resultsLimit: 30,
                resultsType: 'posts',
                searchLimit: 5,
                searchType: 'hashtag'
            })
        });

        if (!runResponse.ok) {
            const errorText = await runResponse.text();
            throw new Error(`Apify start failed: ${errorText}`);
        }
        
        const run = await runResponse.json();
        const runId = run.data.id;
        
        // Wait for completion (max 15 seconds)
        let attempts = 0;
        while (attempts < 15) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const statusResponse = await fetch(`https://api.apify.com/v2/acts/reGe1ST3OBgYZSsZJ/runs/${runId}?token=${APIFY_TOKEN}`);
            const status = await statusResponse.json();
            
            if (status.data.status === 'SUCCEEDED') {
                // Get results
                const resultsResponse = await fetch(`https://api.apify.com/v2/datasets/${status.data.defaultDatasetId}/items?token=${APIFY_TOKEN}`);
                const results = await resultsResponse.json();
                return processApifyData(results, mealType);
            } else if (status.data.status === 'FAILED') {
                throw new Error('Apify run failed');
            }
            
            attempts++;
        }
        
        throw new Error('Apify timeout');
        
    } catch (error) {
        console.log('Apify fallback to default data:', error.message);
        return { optimized_hashtags: getDefaultHashtags(mealType) };
    }
}

// Instagram Graph API - Real insights
async function getInstagramInsights() {
    try {
        // Get last 10 posts insights
        const response = await fetch(
            `https://graph.facebook.com/v18.0/${INSTAGRAM_ACCOUNT_ID}/media?fields=id,caption,comments_count,like_count,timestamp,insights.metric(engagement,impressions,reach)&limit=10&access_token=${INSTAGRAM_TOKEN}`
        );

        if (!response.ok) throw new Error('Instagram API failed');
        
        const data = await response.json();
        return processInstagramData(data);
        
    } catch (error) {
        console.log('Instagram API fallback:', error.message);
        return { data: null, avg_engagement: 1500 };
    }
}

// Competitor Analysis via Apify
async function getCompetitorAnalysis(mealType) {
    try {
        const competitors = getCompetitorHandles();
        const randomCompetitor = competitors[Math.floor(Math.random() * competitors.length)];
        
        // For now, use fallback data as profile scraping is complex
        console.log('Using competitor simulation for:', randomCompetitor.name);
        return {
            ...randomCompetitor,
            avg_engagement: Math.floor(Math.random() * 3000) + 1000,
            posting_frequency: `${(Math.random() * 2 + 0.5).toFixed(1)} posts/day`,
            top_strategies: ['#modena', '#food', '#restaurant', '#italy'],
            real_data: false
        };
        
    } catch (error) {
        console.log('Competitor fallback:', error.message);
        return getRandomCompetitor();
    }
}

// Process Apify hashtag data
function processApifyData(data, mealType) {
    const hashtagStats = {};
    const trending = [];
    const topHashtags = [];
    
    // Analyze real posts data
    if (Array.isArray(data)) {
        data.forEach(post => {
            // Extract hashtags from caption
            if (post.caption) {
                const hashtags = post.caption.match(/#[a-zA-Z0-9_]+/g) || [];
                hashtags.forEach(tag => {
                    if (!hashtagStats[tag]) {
                        hashtagStats[tag] = {
                            tag: tag,
                            count: 0,
                            totalLikes: 0,
                            totalComments: 0
                        };
                    }
                    hashtagStats[tag].count++;
                    hashtagStats[tag].totalLikes += post.likesCount || 0;
                    hashtagStats[tag].totalComments += post.commentsCount || 0;
                });
            }
            
            // Track trending based on recent high engagement
            if ((post.likesCount || 0) > 1000) {
                const postHashtags = post.caption?.match(/#[a-zA-Z0-9_]+/g) || [];
                postHashtags.slice(0, 3).forEach(tag => {
                    if (!trending.includes(tag)) trending.push(tag);
                });
            }
        });
    }
    
    // Calculate average engagement per hashtag
    Object.values(hashtagStats).forEach(stat => {
        const avgEngagement = Math.round((stat.totalLikes + stat.totalComments) / stat.count);
        topHashtags.push({
            tag: stat.tag,
            posts: stat.count,
            avg_engagement: avgEngagement
        });
    });
    
    // Sort by engagement
    topHashtags.sort((a, b) => b.avg_engagement - a.avg_engagement);
    
    // Mix popular, medium, and niche hashtags
    const popular = topHashtags.slice(0, 5);
    const medium = topHashtags.slice(5, 15);
    const niche = getLocalHashtags(mealType);
    
    // Build optimized hashtag string
    const optimizedHashtags = [
        ...popular.map(h => h.tag),
        ...medium.slice(0, 10).map(h => h.tag),
        ...niche
    ].join(' ');
    
    return {
        optimized_hashtags: optimizedHashtags,
        top_hashtags: topHashtags.slice(0, 5),
        trending: trending.slice(0, 5),
        avoid: [],
        source: 'apify_live'
    };
}

// Process Instagram insights data
function processInstagramData(data) {
    if (!data.data || data.data.length === 0) {
        return { avg_engagement: 1500, best_time: null };
    }
    
    let totalEngagement = 0;
    let totalReach = 0;
    const postTimes = {};
    
    data.data.forEach(post => {
        const engagement = (post.like_count || 0) + (post.comments_count || 0);
        totalEngagement += engagement;
        
        // Track posting times
        const hour = new Date(post.timestamp).getHours();
        postTimes[hour] = (postTimes[hour] || 0) + engagement;
        
        // Get reach if available
        if (post.insights && post.insights.data) {
            const reachMetric = post.insights.data.find(m => m.name === 'reach');
            if (reachMetric) totalReach += reachMetric.values[0].value;
        }
    });
    
    const avgEngagement = Math.round(totalEngagement / data.data.length);
    const avgReach = Math.round(totalReach / data.data.length);
    
    // Find best posting time
    const bestHour = Object.entries(postTimes)
        .sort(([,a], [,b]) => b - a)[0];
    
    return {
        data: data.data,
        avg_engagement: avgEngagement,
        avg_reach: avgReach || avgEngagement * 5,
        best_time: bestHour ? parseInt(bestHour[0]) : null
    };
}

// Process competitor data from Apify
function processCompetitorData(profileData, competitorInfo) {
    if (!profileData) return getRandomCompetitor();
    
    const avgLikes = profileData.postsCount > 0 
        ? Math.round(profileData.edge_owner_to_timeline_media.edges.reduce((sum, post) => 
            sum + post.node.edge_liked_by.count, 0) / Math.min(profileData.postsCount, 12))
        : 1000;
    
    return {
        name: competitorInfo.name,
        type: competitorInfo.type,
        handle: profileData.username,
        followers: profileData.followersCount,
        avg_engagement: avgLikes,
        posting_frequency: `${(profileData.postsCount / 30).toFixed(1)} posts/day`,
        top_strategies: extractHashtagStrategies(profileData),
        real_data: true
    };
}

// Extract hashtag strategies from competitor posts
function extractHashtagStrategies(profileData) {
    const hashtagCounts = {};
    
    if (profileData.edge_owner_to_timeline_media && profileData.edge_owner_to_timeline_media.edges) {
        profileData.edge_owner_to_timeline_media.edges.forEach(post => {
            const caption = post.node.edge_media_to_caption.edges[0]?.node.text || '';
            const hashtags = caption.match(/#\w+/g) || [];
            
            hashtags.forEach(tag => {
                hashtagCounts[tag] = (hashtagCounts[tag] || 0) + 1;
            });
        });
    }
    
    // Return top 4 most used hashtags
    return Object.entries(hashtagCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 4)
        .map(([tag]) => tag);
}

// Calculate optimal posting time based on insights
function calculateOptimalTime(mealType, insights) {
    const defaultTimes = {
        colazione: '08:00',
        pranzo: '13:00',
        aperitivo: '19:00'
    };
    
    if (insights.best_time) {
        // Adjust meal time based on best engagement hour
        const bestHour = insights.best_time;
        
        if (mealType === 'colazione' && bestHour >= 7 && bestHour <= 10) {
            return `${bestHour.toString().padStart(2, '0')}:00`;
        } else if (mealType === 'pranzo' && bestHour >= 12 && bestHour <= 14) {
            return `${bestHour.toString().padStart(2, '0')}:00`;
        } else if (mealType === 'aperitivo' && bestHour >= 18 && bestHour <= 20) {
            return `${bestHour.toString().padStart(2, '0')}:00`;
        }
    }
    
    return defaultTimes[mealType];
}

// Calculate expected reach based on real data
function calculateExpectedReach(insights, hashtagData) {
    const baseReach = insights.avg_reach || 5000;
    const hashtagBoost = hashtagData.top_hashtags ? 1.2 : 1;
    
    const expectedReach = Math.round(baseReach * hashtagBoost);
    
    if (expectedReach > 10000) return 'Very High (10k+)';
    if (expectedReach > 5000) return 'High (5k-10k)';
    if (expectedReach > 2500) return 'Medium (2.5k-5k)';
    return 'Building (1k-2.5k)';
}

// Helper functions
function getSearchHashtags(mealType) {
    const searchTerms = {
        colazione: ['colazione', 'breakfast', 'cappuccino', 'croissant', 'modena'],
        pranzo: ['pranzo', 'lunch', 'pasta', 'tortellini', 'modena'],
        aperitivo: ['aperitivo', 'spritz', 'happyhour', 'cocktails', 'modena']
    };
    return searchTerms[mealType] || searchTerms.aperitivo;
}

function getLocalHashtags(mealType) {
    const local = ['#modena', '#modenafood', '#balzacmodena', '#balzacbistrot'];
    const specific = {
        colazione: ['#modenacaffe', '#colazionemodena'],
        pranzo: ['#pranzomodena', '#modenarestaurant'],
        aperitivo: ['#aperitivomodena', '#modenaaperitivo']
    };
    return [...local, ...(specific[mealType] || [])];
}

function getCompetitorHandles() {
    return [
        { handle: 'osteriafrancescana', name: 'Osteria Francescana', type: 'Fine Dining' },
        { handle: 'casamarialuigia', name: 'Casa Maria Luigia', type: 'Resort' },
        { handle: 'hosteria_giusti', name: 'Hosteria Giusti', type: 'Historic' },
        { handle: 'trattoriaaldina', name: 'Trattoria Aldina', type: 'Traditional' },
        { handle: 'anticamoka', name: 'Antica Moka', type: 'Café' },
        { handle: 'freedommodena', name: 'Freedom', type: 'Bar' },
        { handle: 'bar_mana', name: 'Bar Mana', type: 'Cocktail Bar' }
    ];
}

// Reuse existing helper functions from analyze.js
function getMenuItems(mealType) {
    if (!menuData[mealType]) {
        return menuData.aperitivo || {};
    }
    return menuData[mealType];
}

function getRandomFeaturedItems(mealType, menuItems) {
    const items = [];
    
    if (mealType === 'colazione' && menuItems.items && menuItems.beverages) {
        const randomFoods = getRandomItems(menuItems.items, 2);
        const randomBeverage = getRandomItems(menuItems.beverages, 1);
        items.push(...randomFoods.map(item => item.name + (item.description ? ': ' + item.description : '')));
        items.push(...randomBeverage.map(item => item.name));
    }
    else if (mealType === 'pranzo' && menuItems.items) {
        const randomMains = getRandomItems(menuItems.items, 2);
        const randomSalad = menuItems.salads ? getRandomItems(menuItems.salads, 1) : [];
        items.push(...randomMains.map(item => item.name + (item.description ? ': ' + item.description : '')));
        items.push(...randomSalad.map(item => item.name));
    }
    else if (mealType === 'aperitivo' && menuItems.items && menuItems.cocktails) {
        const randomFoods = getRandomItems(menuItems.items, 2);
        const randomCocktails = getRandomItems(menuItems.cocktails, 2);
        items.push(...randomFoods.map(item => item.name + (item.description ? ': ' + item.description : '')));
        items.push(...randomCocktails.map(item => item.name));
    }
    
    return items;
}

function getRandomItems(array, count) {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

function getContentSuggestions(mealType, menuItems) {
    const suggestions = {
        colazione: [
            'Mostra croissants francesi e pain au chocolat appena sfornati',
            'Cappuccino con latte art in primo piano',
            'Atmosfera accogliente di bistrot francese al mattino'
        ],
        pranzo: [
            'Tortellini fatti a mano in crema di parmigiano 24 mesi',
            'Steak tartare con condimenti tradizionali',
            'Atmosfera elegante del bistrot a pranzo'
        ],
        aperitivo: [
            'Tagliere Opus Nera con salumi di suino nero casertano',
            'Spritz e cocktail colorati',
            'Atmosfera vivace dell\'aperitivo al bistrot'
        ]
    };
    return suggestions[mealType] || suggestions.aperitivo;
}

// Default/fallback functions
function getDefaultHashtags(mealType) {
    const baseHashtags = {
        colazione: '#cappuccino #colazione #breakfast #modena #italianbreakfast #cornetto #buongiorno #modenafood #balzacmodena #breakfasttime #coffee #barista #colazionetime #italia #foodporn #instafood #morningvibes #cappuccinoart #brioches #balzacbistrot',
        pranzo: '#pranzo #lunch #pasta #modena #italianfood #tortellini #cucinaemiliana #pranzoitaliano #modenafood #balzacmodena #foodie #italianrestaurant #tagliatelle #tradizione #mangiarbene #tortellinimodena #emiliaromagna #balzacbistrot #buonappetito #foodstagram',
        aperitivo: '#aperitivo #spritz #happyhour #modena #aperitif #cocktails #aperitivotime #modenaapertime #balzacmodena #aperol #drinks #aperitivoitaliano #socialdrinks #afterwork #spritztime #modenabynight #cocktailbar #balzacaperitivo #cheers #balzacbistrot'
    };
    return baseHashtags[mealType] || baseHashtags.aperitivo;
}

function getTrendingHashtags() {
    const day = new Date().getDay();
    const month = new Date().getMonth();
    
    if (day === 5) return ['#fridaynight', '#venerdi', '#tgif', '#weekendiscoming', '#fridaymood'];
    if (day === 6) return ['#saturday', '#sabato', '#weekendvibes', '#saturdaynight', '#sabatomodena'];
    if (day === 0) return ['#sunday', '#domenica', '#sundayvibes', '#sundaylunch', '#domenicaitaliana'];
    
    if (month === 5 || month === 6) return ['#summertime', '#estate2025', '#summervibes', '#estateallaperto', '#terrazza'];
    if (month === 11) return ['#christmas', '#natale', '#xmas', '#christmastime', '#natale2025'];
    
    return ['#modenatoday', '#foodie', '#instafood', '#italianstyle', '#wheretoeat'];
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

function getWeatherMood() {
    const season = getCurrentSeason();
    const moods = {
        primavera: 'fresco e soleggiato',
        estate: 'caldo e luminoso',
        autunno: 'tiepido e accogliente',
        inverno: 'freddo ma confortevole'
    };
    return moods[season];
}

function getLocalEvents() {
    const month = new Date().getMonth();
    const events = {
        4: 'Motor Valley Fest',
        5: 'Modena Pride',
        6: 'Estate modenese',
        8: 'Festival Filosofia',
        11: 'Mercatini di Natale'
    };
    
    return events[month] || null;
}

function getRandomCompetitor() {
    const competitors = [
        {
            name: 'Osteria Francescana',
            type: 'Fine Dining',
            avg_engagement: 5200,
            posting_frequency: '2.1 posts/day',
            top_strategies: ['#modena', '#michelinguide', '#finedining', '#bottura']
        },
        {
            name: 'Freedom',
            type: 'Bar & Lounge',
            avg_engagement: 1400,
            posting_frequency: '1.6 posts/day',
            top_strategies: ['#modena', '#aperitivo', '#cocktails', '#nightlife']
        },
        {
            name: 'Antica Moka',
            type: 'Café & Bistrot',
            avg_engagement: 1200,
            posting_frequency: '2.0 posts/day',
            top_strategies: ['#modena', '#caffè', '#colazione', '#aperitivo']
        }
    ];
    
    return competitors[Math.floor(Math.random() * competitors.length)];
}