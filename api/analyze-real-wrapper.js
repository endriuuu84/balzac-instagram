const fs = require('fs');
const path = require('path');

// Load menu data
const menuData = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'menu.json'), 'utf8'));

// API Keys from environment
const APIFY_TOKEN = process.env.APIFY_API_TOKEN;
const INSTAGRAM_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;
const INSTAGRAM_ACCOUNT_ID = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;

async function handler(req, res) {
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
        const [hashtagData, instagramInsights, competitorData] = await Promise.all([
            getApifyHashtagData(meal_type),
            getInstagramInsights(),
            getCompetitorAnalysis(meal_type)
        ]);

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
        // Use broader Italian food hashtags to get more relevant data
        const searchHashtags = ['italianfood', 'foodie', 'restaurant'];
        const mainHashtag = searchHashtags[Math.floor(Math.random() * searchHashtags.length)];
        
        console.log(`🔍 Scraping hashtag: ${mainHashtag}`);
        
        const runResponse = await fetch(`https://api.apify.com/v2/acts/shu8hvrXbJbY3Eb9W/run-sync-get-dataset-items?token=${APIFY_TOKEN}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                directUrls: [`https://www.instagram.com/explore/tags/${mainHashtag}/`],
                resultsLimit: 8,
                resultsType: 'posts',
                addParentData: false,
                scrapeComments: false,
                scrapeLocationData: false
            })
        });

        if (!runResponse.ok) {
            const errorText = await runResponse.text();
            console.log(`Apify request failed: ${runResponse.status} - ${errorText}`);
            throw new Error(`Apify request failed: ${errorText}`);
        }
        
        const results = await runResponse.json();
        console.log(`✅ Apify returned ${results.length} posts for ${mainHashtag}`);
        
        if (results && results.length > 0) {
            const processedData = processApifyData(results, mealType);
            return {
                ...processedData,
                source: 'apify_live',
                search_term: mainHashtag
            };
        }
        
        throw new Error('No data from Apify');
        
    } catch (error) {
        console.log('Apify fallback to local optimized hashtags:', error.message);
        return { 
            optimized_hashtags: generateLocalOptimizedHashtags(mealType),
            source: 'local_optimized'
        };
    }
}

// Instagram Graph API - Real insights
async function getInstagramInsights() {
    try {
        console.log('📈 Fetching Instagram insights...');
        
        const response = await fetch(
            `https://graph.facebook.com/v18.0/${INSTAGRAM_ACCOUNT_ID}/media?fields=id,caption,comments_count,like_count,timestamp,insights.metric(engagement,impressions,reach)&limit=10&access_token=${INSTAGRAM_TOKEN}`
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.log(`Instagram API failed: ${response.status} - ${errorText}`);
            throw new Error('Instagram API failed');
        }
        
        const data = await response.json();
        console.log(`✅ Instagram returned ${data.data?.length || 0} posts`);
        return processInstagramData(data);
        
    } catch (error) {
        console.log('Instagram API fallback:', error.message);
        return { data: null, avg_engagement: 1500 };
    }
}

// Competitor Analysis
async function getCompetitorAnalysis(mealType) {
    try {
        const competitors = getCompetitorHandles();
        const randomCompetitor = competitors[Math.floor(Math.random() * competitors.length)];
        
        console.log(`🏪 Analyzing competitor: ${randomCompetitor.name}`);
        
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
    
    console.log('📊 Processing Apify data...');
    
    if (Array.isArray(data)) {
        data.forEach(post => {
            if (post.caption) {
                const hashtags = post.caption.match(/#[a-zA-Z0-9_]+/g) || [];
                // Filter for relevant hashtags (Italian food, local terms, meal-specific)
                const relevantHashtags = hashtags.filter(tag => {
                    const lowerTag = tag.toLowerCase();
                    return (
                        lowerTag.includes('modena') ||
                        lowerTag.includes('emilia') ||
                        lowerTag.includes('italian') ||
                        lowerTag.includes('food') ||
                        lowerTag.includes('restaurant') ||
                        lowerTag.includes('bistrot') ||
                        lowerTag.includes('cafe') ||
                        lowerTag.includes('bar') ||
                        lowerTag.includes(mealType) ||
                        (mealType === 'colazione' && (lowerTag.includes('breakfast') || lowerTag.includes('cappuccino') || lowerTag.includes('coffee') || lowerTag.includes('croissant'))) ||
                        (mealType === 'pranzo' && (lowerTag.includes('lunch') || lowerTag.includes('pasta') || lowerTag.includes('tortellini') || lowerTag.includes('primi'))) ||
                        (mealType === 'aperitivo' && (lowerTag.includes('spritz') || lowerTag.includes('cocktail') || lowerTag.includes('happy') || lowerTag.includes('drink')))
                    );
                });
                
                relevantHashtags.forEach(tag => {
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
            
            // Lower threshold for trending to capture more data
            if ((post.likesCount || 0) > 100) {
                const postHashtags = post.caption?.match(/#[a-zA-Z0-9_]+/g) || [];
                const relevantTrending = postHashtags.filter(tag => {
                    const lowerTag = tag.toLowerCase();
                    return lowerTag.includes('modena') || lowerTag.includes('italian') || lowerTag.includes('food');
                });
                relevantTrending.slice(0, 2).forEach(tag => {
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
    
    topHashtags.sort((a, b) => b.avg_engagement - a.avg_engagement);
    
    // Always prioritize local hashtags, then add relevant ones from Apify
    const niche = getLocalHashtags(mealType);
    const relevant = topHashtags.slice(0, 8).map(h => h.tag); // Use top 8 relevant hashtags
    const defaultForMealType = getDefaultHashtagsForMealType(mealType);
    
    const optimizedHashtags = [
        ...niche, // Always include local Modena hashtags first
        ...relevant, // Add relevant hashtags from Apify
        ...defaultForMealType // Fill remaining with meal-specific defaults
    ].slice(0, 20).join(' '); // Limit to 20 hashtags total
    
    console.log(`✅ Generated optimized hashtags: ${optimizedHashtags.split(' ').length} hashtags`);
    
    return {
        optimized_hashtags: optimizedHashtags,
        top_hashtags: topHashtags.slice(0, 5),
        trending: trending.slice(0, 3),
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
        
        const hour = new Date(post.timestamp).getHours();
        postTimes[hour] = (postTimes[hour] || 0) + engagement;
        
        if (post.insights && post.insights.data) {
            const reachMetric = post.insights.data.find(m => m.name === 'reach');
            if (reachMetric) totalReach += reachMetric.values[0].value;
        }
    });
    
    const avgEngagement = Math.round(totalEngagement / data.data.length);
    const avgReach = Math.round(totalReach / data.data.length);
    
    const bestHour = Object.entries(postTimes)
        .sort(([,a], [,b]) => b - a)[0];
    
    return {
        data: data.data,
        avg_engagement: avgEngagement,
        avg_reach: avgReach || avgEngagement * 5,
        best_time: bestHour ? parseInt(bestHour[0]) : null
    };
}

// Helper functions
function getSearchHashtags(mealType) {
    const searchTerms = {
        colazione: ['modenafood', 'modena', 'emiliaromagna', 'colazione', 'cappuccino'],
        pranzo: ['modenafood', 'modena', 'emiliaromagna', 'tortellini', 'pranzo'],
        aperitivo: ['modenafood', 'modena', 'emiliaromagna', 'aperitivo', 'spritz']
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

function calculateOptimalTime(mealType, insights) {
    const defaultTimes = {
        colazione: '08:00',
        pranzo: '13:00',
        aperitivo: '19:00'
    };
    
    if (insights.best_time) {
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

function calculateExpectedReach(insights, hashtagData) {
    const baseReach = insights.avg_reach || 5000;
    const hashtagBoost = hashtagData.top_hashtags && hashtagData.top_hashtags.length > 0 ? 1.2 : 1;
    
    const expectedReach = Math.round(baseReach * hashtagBoost);
    
    if (expectedReach > 10000) return 'Very High (10k+)';
    if (expectedReach > 5000) return 'High (5k-10k)';
    if (expectedReach > 2500) return 'Medium (2.5k-5k)';
    return 'Building (1k-2.5k)';
}

// Reuse menu functions
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

function getDefaultHashtags(mealType) {
    const baseHashtags = {
        colazione: '#cappuccino #colazione #breakfast #modena #italianbreakfast #cornetto #buongiorno #modenafood #balzacmodena #breakfasttime #coffee #barista #colazionetime #italia #foodporn #instafood #morningvibes #cappuccinoart #brioches #balzacbistrot',
        pranzo: '#pranzo #lunch #pasta #modena #italianfood #tortellini #cucinaemiliana #pranzoitaliano #modenafood #balzacmodena #foodie #italianrestaurant #tagliatelle #tradizione #mangiarbene #tortellinimodena #emiliaromagna #balzacbistrot #buonappetito #foodstagram',
        aperitivo: '#aperitivo #spritz #happyhour #modena #aperitif #cocktails #aperitivotime #modenaapertime #balzacmodena #aperol #drinks #aperitivoitaliano #socialdrinks #afterwork #spritztime #modenabynight #cocktailbar #balzacaperitivo #cheers #balzacbistrot'
    };
    return baseHashtags[mealType] || baseHashtags.aperitivo;
}

function getDefaultHashtagsForMealType(mealType) {
    const mealSpecific = {
        colazione: ['#cappuccino', '#breakfast', '#coffee', '#croissant', '#cornetto', '#buongiorno', '#morningvibes'],
        pranzo: ['#pasta', '#tortellini', '#lunch', '#italianfood', '#cucinaemiliana', '#primi', '#buonappetito'],
        aperitivo: ['#spritz', '#cocktails', '#happyhour', '#aperol', '#drinks', '#afterwork', '#cheers']
    };
    return mealSpecific[mealType] || mealSpecific.aperitivo;
}

function generateLocalOptimizedHashtags(mealType) {
    // Always start with local Modena hashtags
    const local = getLocalHashtags(mealType);
    const mealSpecific = getDefaultHashtagsForMealType(mealType);
    const seasonal = getCurrentSeasonalHashtags();
    const dayType = getDayType() === 'weekend' ? ['#weekend', '#weekendvibes'] : ['#workday', '#pranzolavoro'];
    
    const allHashtags = [
        ...local,
        ...mealSpecific,
        ...seasonal,
        ...dayType,
        '#foodie', '#instafood', '#italianstyle', '#wheretoeat'
    ];
    
    return allHashtags.slice(0, 18).join(' '); // Limit to 18 hashtags
}

function getCurrentSeasonalHashtags() {
    const season = getCurrentSeason();
    const seasonalTags = {
        estate: ['#summer', '#estate2025', '#summervibes', '#terrazza'],
        autunno: ['#autumn', '#autunno2025', '#comfortfood', '#cozy'],
        inverno: ['#winter', '#inverno2025', '#warmfood', '#comfort'],
        primavera: ['#spring', '#primavera2025', '#fresh', '#seasonal']
    };
    return seasonalTags[season] || seasonalTags.estate;
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

module.exports = handler;