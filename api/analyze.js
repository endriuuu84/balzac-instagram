import fs from 'fs';
import path from 'path';

// Load menu data
const menuData = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'menu.json'), 'utf8'));

// Vercel Serverless Function per analisi dati
export default async function handler(req, res) {
    // Abilita CORS
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
        
        console.log(`📊 Analisi per: ${meal_type}`);

        // Get menu items for this meal type
        const menuItems = getMenuItems(meal_type);

        // Genera dati ottimizzati per il tipo di pasto
        const data = {
            timestamp: new Date().toISOString(),
            meal_type: meal_type,
            menu_items: menuItems,
            hashtags: getOptimizedHashtags(meal_type),
            optimal_time: getOptimalTime(meal_type),
            content_suggestions: getContentSuggestions(meal_type, menuItems),
            performance_metrics: {
                expected_reach: 'High (5k-10k)',
                best_performing_hashtags: getBestHashtags(meal_type),
                trending_now: getTrendingHashtags(),
                avoid_hashtags: []
            },
            ai_context: {
                season: getCurrentSeason(),
                day_type: getDayType(),
                weather_mood: getWeatherMood(),
                local_events: getLocalEvents(),
                featured_items: getFeaturedItems(meal_type, menuItems),
                competitor_insights: getCompetitorInsights()
            }
        };

        res.status(200).json(data);

    } catch (error) {
        console.error('Errore:', error);
        res.status(500).json({ error: 'Errore analisi', message: error.message });
    }
}

// Helper functions
function getOptimizedHashtags(mealType) {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    const baseHashtags = {
        colazione: '#cappuccino #colazione #breakfast #modena #italianbreakfast #cornetto #buongiorno #modenafood #balzacmodena #breakfasttime #coffee #barista #colazionetime #italia #foodporn #instafood #morningvibes #cappuccinoart #brioches #balzacbistrot',
        
        pranzo: '#pranzo #lunch #pasta #modena #italianfood #tortellini #cucinaemiliana #pranzoitaliano #modenafood #balzacmodena #foodie #italianrestaurant #tagliatelle #tradizione #mangiarbene #tortellinimodena #emiliaromagna #balzacbistrot #buonappetito #foodstagram',
        
        aperitivo: '#aperitivo #spritz #happyhour #modena #aperitif #cocktails #aperitivotime #modenaapertime #balzacmodena #aperol #drinks #aperitivoitaliano #socialdrinks #afterwork #spritztime #modenabynight #cocktailbar #balzacaperitivo #cheers #balzacbistrot'
    };

    let hashtags = baseHashtags[mealType] || baseHashtags.aperitivo;

    // Aggiungi hashtag weekend
    if (isWeekend) {
        hashtags += ' #weekendvibes #sabato #domenica';
    }

    // Aggiungi hashtag stagionali
    const season = getCurrentSeason();
    const seasonalTags = {
        estate: ' #summervibes #estate2025 #aperitivoestivo',
        autunno: ' #autumnvibes #autunno2025 #comfort',
        inverno: ' #wintermood #inverno2025 #cozy',
        primavera: ' #springtime #primavera2025 #fresh'
    };
    
    hashtags += seasonalTags[season] || '';

    return hashtags.trim();
}

function getOptimalTime(mealType) {
    const day = new Date().getDay();
    const isWeekend = day === 0 || day === 6;

    const times = {
        colazione: isWeekend ? '09:00' : '07:30',
        pranzo: isWeekend ? '13:00' : '12:30',
        aperitivo: isWeekend ? '19:30' : '19:00'
    };
    
    return times[mealType];
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

function getBestHashtags(mealType) {
    const best = {
        colazione: [
            { tag: '#cappuccino', avg_engagement: 3200 },
            { tag: '#breakfast', avg_engagement: 2800 },
            { tag: '#modena', avg_engagement: 2500 }
        ],
        pranzo: [
            { tag: '#tortellini', avg_engagement: 4100 },
            { tag: '#pasta', avg_engagement: 3800 },
            { tag: '#italianfood', avg_engagement: 3500 }
        ],
        aperitivo: [
            { tag: '#spritz', avg_engagement: 3900 },
            { tag: '#aperitivo', avg_engagement: 3600 },
            { tag: '#happyhour', avg_engagement: 3200 }
        ]
    };
    return best[mealType] || best.aperitivo;
}

function getTrendingHashtags() {
    const day = new Date().getDay();
    const month = new Date().getMonth();
    
    // Trending per giorno
    if (day === 5) return ['#fridaynight', '#venerdi', '#tgif', '#weekendiscoming', '#fridaymood'];
    if (day === 6) return ['#saturday', '#sabato', '#weekendvibes', '#saturdaynight', '#sabatomodena'];
    if (day === 0) return ['#sunday', '#domenica', '#sundayvibes', '#sundaylunch', '#domenicaitaliana'];
    
    // Trending per stagione/mese
    if (month === 5 || month === 6) return ['#summertime', '#estate2025', '#summervibes', '#estateallaperto', '#terrazza'];
    if (month === 11) return ['#christmas', '#natale', '#xmas', '#christmastime', '#natale2025'];
    
    // Default trending
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

// New functions for menu integration
function getMenuItems(mealType) {
    if (!menuData[mealType]) {
        return menuData.aperitivo || {};
    }
    return menuData[mealType];
}

function getFeaturedItems(mealType, menuItems) {
    const featured = {
        colazione: [
            'Croissants francesi',
            'Pain au chocolat', 
            'Cappuccino',
            'Omelette parisienne'
        ],
        pranzo: [
            'Tortellini fatti a mano in crema di parmigiano 24 mesi',
            'Steak Tartare',
            'Balzac Burger',
            'Caesar Balzac'
        ],
        aperitivo: [
            'Tagliere Opus Nera con Suino nero casertano',
            'Assiete de Fromage francesi',
            'Acciughe del Cantabrico con burro di Normandia',
            'Spritz'
        ]
    };
    
    return featured[mealType] || featured.aperitivo;
}

function getCompetitorInsights() {
    const competitors = [
        {
            name: 'Osteria Francescana',
            type: 'Fine Dining',
            avg_engagement: 5200,
            posting_frequency: '2.1 posts/day',
            top_strategies: ['#modena', '#michelinguide', '#finedining', '#bottura']
        },
        {
            name: 'Casa Maria Luigia',
            type: 'Resort & Restaurant',
            avg_engagement: 3800,
            posting_frequency: '1.8 posts/day',
            top_strategies: ['#casapasquale', '#modena', '#luxury', '#countryside']
        },
        {
            name: 'Il Fantino',
            type: 'Traditional',
            avg_engagement: 2100,
            posting_frequency: '1.3 posts/day',
            top_strategies: ['#tradizione', '#modena', '#cucinaemiliana', '#tortellini']
        },
        {
            name: 'Trattoria Aldina',
            type: 'Traditional',
            avg_engagement: 1800,
            posting_frequency: '1.0 posts/day', 
            top_strategies: ['#modena', '#trattoria', '#casalingo', '#lambrusco']
        },
        {
            name: 'Hosteria Giusti',
            type: 'Historic Deli',
            avg_engagement: 2800,
            posting_frequency: '1.5 posts/day',
            top_strategies: ['#giusti', '#modena', '#salumeria', '#storico', '#aceto']
        },
        {
            name: 'Ristorante Zelmira',
            type: 'Modern Italian',
            avg_engagement: 1600,
            posting_frequency: '1.2 posts/day',
            top_strategies: ['#modena', '#moderna', '#innovative', '#wine']
        },
        {
            name: 'Antica Moka',
            type: 'Café & Bistrot',
            avg_engagement: 1200,
            posting_frequency: '2.0 posts/day',
            top_strategies: ['#modena', '#caffè', '#colazione', '#aperitivo']
        },
        {
            name: 'Caffè Concerto',
            type: 'Historic Café',
            avg_engagement: 900,
            posting_frequency: '1.4 posts/day',
            top_strategies: ['#modena', '#storico', '#caffè', '#centro']
        },
        {
            name: 'Freedom',
            type: 'Bar & Lounge',
            avg_engagement: 1400,
            posting_frequency: '1.6 posts/day',
            top_strategies: ['#modena', '#aperitivo', '#cocktails', '#nightlife']
        },
        {
            name: 'Bar Mana',
            type: 'Cocktail Bar',
            avg_engagement: 1100,
            posting_frequency: '1.3 posts/day',
            top_strategies: ['#modena', '#cocktails', '#craft', '#mixology']
        },
        {
            name: "L'Archivio",
            type: 'Wine Bar & Restaurant',
            avg_engagement: 1300,
            posting_frequency: '1.2 posts/day',
            top_strategies: ['#modena', '#wine', '#aperitivo', '#gourmet']
        },
        {
            name: "Benny's Bar",
            type: 'American Bar',
            avg_engagement: 1000,
            posting_frequency: '1.4 posts/day',
            top_strategies: ['#modena', '#americanbar', '#burgers', '#beers']
        },
        {
            name: 'Cattedrali',
            type: 'Restaurant & Bar',
            avg_engagement: 1600,
            posting_frequency: '1.5 posts/day',
            top_strategies: ['#modena', '#restaurant', '#aperitivo', '#elegante']
        },
        {
            name: 'Cibo',
            type: 'Modern Restaurant',
            avg_engagement: 1800,
            posting_frequency: '1.7 posts/day',
            top_strategies: ['#modena', '#modernfood', '#innovative', '#design']
        }
    ];
    
    // Return random competitor for variety
    return competitors[Math.floor(Math.random() * competitors.length)];
}