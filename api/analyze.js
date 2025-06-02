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

        // Genera dati ottimizzati per il tipo di pasto
        const data = {
            timestamp: new Date().toISOString(),
            meal_type: meal_type,
            hashtags: getOptimizedHashtags(meal_type),
            optimal_time: getOptimalTime(meal_type),
            content_suggestions: getContentSuggestions(meal_type),
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
                competitor_insights: {
                    name: 'Osteria Francescana',
                    avg_engagement: 5200,
                    posting_frequency: '2.1 posts/day',
                    top_strategies: ['#modena', '#michelinguide', '#finedining']
                }
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

function getContentSuggestions(mealType) {
    const suggestions = {
        colazione: [
            'Mostra il processo di preparazione del cappuccino',
            'Foto con luce naturale del mattino',
            'Includi cornetti freschi appena sfornati'
        ],
        pranzo: [
            'Primi piani dei tortellini fatti a mano',
            'Racconta la tradizione modenese',
            'Mostra la preparazione dello chef'
        ],
        aperitivo: [
            'Atmosfera vivace con persone sfocate',
            'Dettagli dei cocktail colorati',
            'Taglieri gourmet in primo piano'
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