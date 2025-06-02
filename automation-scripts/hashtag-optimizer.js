// Hashtag Optimizer per Balzac Instagram
// Analizza e ottimizza hashtag basandosi su performance e trending

class HashtagOptimizer {
    constructor() {
        this.categories = {
            // Hashtag MOLTO POPOLARI (>500k post) - 30%
            veryPopular: {
                food: ['#foodporn', '#foodstagram', '#instafood', '#foodie', '#foodlover'],
                italian: ['#italianfood', '#pasta', '#italiancuisine', '#madeinitaly'],
                general: ['#delicious', '#yummy', '#foodphotography', '#tasty']
            },
            
            // Hashtag MEDI (50k-500k post) - 40%
            medium: {
                regional: ['#emiliaromagna', '#cucinaemiliana', '#modenatoday', '#igersmodena'],
                restaurant: ['#ristoranteitaliano', '#ristorantemodena', '#bistrot', '#osteria'],
                specific: ['#aperitivoitaliano', '#pranzodomenica', '#colazioneitaliana'],
                experience: ['#wheretoeat', '#foodexperience', '#localfood', '#authenticitalian']
            },
            
            // Hashtag DI NICCHIA (<50k post) - 30%
            niche: {
                local: ['#balzacmodena', '#balzacbistrot', '#modenafood', '#modenarestaurants'],
                unique: ['#modenacultura', '#modenafoodie', '#visitmodena', '#modenacentro'],
                specific: ['#tortellinimodena', '#lambruscowine', '#acetobalsamico']
            }
        };

        // Orari ottimali basati su dati italiani
        this.optimalTimes = {
            colazione: {
                weekday: '07:30',
                weekend: '09:00'
            },
            pranzo: {
                weekday: '12:30',
                weekend: '13:00'
            },
            aperitivo: {
                weekday: '19:00',
                weekend: '19:30'
            }
        };

        // Hashtag performance tracking
        this.hashtagPerformance = {};
    }

    // Genera mix ottimale di hashtag per tipo di pasto
    generateOptimalHashtags(mealType, dayOfWeek) {
        const hashtags = [];
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

        // Hashtag specifici per tipo di pasto
        const mealSpecific = {
            colazione: {
                popular: ['#breakfast', '#colazione', '#cappuccino', '#buongiorno'],
                medium: ['#italianbreakfast', '#cornetto', '#colazioneitaliana', '#morningvibes'],
                niche: ['#colazionemodena', '#balzacbreakfast', '#modenacaffe']
            },
            pranzo: {
                popular: ['#lunch', '#pranzo', '#pasta', '#italianfood'],
                medium: ['#pranzoitaliano', '#tortellini', '#cucinatradizionale', '#sundaylunch'],
                niche: ['#pranzomodena', '#balzaclunch', '#tortelliniinbrodo']
            },
            aperitivo: {
                popular: ['#aperitivo', '#aperitif', '#cocktails', '#happyhour'],
                medium: ['#aperitivotime', '#spritz', '#aperolspritz', '#italianapero'],
                niche: ['#aperitivomodena', '#balzacaperitivo', '#modenaapertime']
            }
        };

        // Mix 30% molto popolari
        const veryPopularCount = 5;
        hashtags.push(...this.selectRandom(this.categories.veryPopular.food, 2));
        hashtags.push(...this.selectRandom(this.categories.veryPopular.italian, 2));
        hashtags.push(...this.selectRandom(mealSpecific[mealType].popular, 1));

        // Mix 40% medi
        const mediumCount = 7;
        hashtags.push(...this.selectRandom(this.categories.medium.regional, 2));
        hashtags.push(...this.selectRandom(this.categories.medium.restaurant, 2));
        hashtags.push(...this.selectRandom(mealSpecific[mealType].medium, 3));

        // Mix 30% nicchia
        const nicheCount = 5;
        hashtags.push(...this.selectRandom(this.categories.niche.local, 3));
        hashtags.push(...this.selectRandom(mealSpecific[mealType].niche, 2));

        // Aggiungi hashtag stagionali/eventi
        const seasonal = this.getSeasonalHashtags();
        if (seasonal.length > 0) {
            hashtags.push(...this.selectRandom(seasonal, 2));
        }

        // Weekend speciali
        if (isWeekend) {
            hashtags.push('#weekendvibes', '#sabatomodena');
        }

        // Sempre includi brand hashtag
        hashtags.push('#balzacmodena', '#balzacbistrot');

        // Rimuovi duplicati e limita a 25
        return [...new Set(hashtags)].slice(0, 25);
    }

    // Hashtag stagionali e per eventi
    getSeasonalHashtags() {
        const month = new Date().getMonth();
        const seasonal = {
            // Inverno (dic-feb)
            winter: ['#comfortfood', '#wintervibes', '#cibodellinverno'],
            // Primavera (mar-mag)
            spring: ['#springfood', '#primavera', '#freshingredients'],
            // Estate (giu-ago)
            summer: ['#summervibes', '#estate', '#aperitivoestivo', '#cenaallaperto'],
            // Autunno (set-nov)
            autumn: ['#autumnfood', '#autunno', '#saporiautunnali', '#tartufo']
        };

        if (month >= 11 || month <= 1) return seasonal.winter;
        if (month >= 2 && month <= 4) return seasonal.spring;
        if (month >= 5 && month <= 7) return seasonal.summer;
        if (month >= 8 && month <= 10) return seasonal.autumn;
    }

    // Seleziona hashtag random da array
    selectRandom(array, count) {
        const shuffled = [...array].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    // Ottieni orario ottimale per pubblicazione
    getOptimalPostTime(mealType) {
        const now = new Date();
        const dayOfWeek = now.getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        
        return isWeekend 
            ? this.optimalTimes[mealType].weekend
            : this.optimalTimes[mealType].weekday;
    }

    // Analizza performance hashtag (simulato)
    analyzeHashtagPerformance(hashtag) {
        // In produzione, questo dovrebbe connettersi all'API Instagram Insights
        return {
            reach: Math.floor(Math.random() * 10000) + 1000,
            engagement: Math.floor(Math.random() * 500) + 50,
            saves: Math.floor(Math.random() * 100) + 10
        };
    }

    // Genera report hashtag
    generateHashtagReport() {
        const report = {
            timestamp: new Date().toISOString(),
            recommendations: [],
            topPerformers: [],
            toAvoid: []
        };

        // Simula analisi (in produzione userebbe dati reali)
        report.recommendations = [
            '#modenafood sta trending questa settimana',
            '#aperitivomodena ha 40% più engagement il venerdì',
            'Evita #restaurant (troppo generico)',
            'Usa #tortellinimodena per pranzi del weekend'
        ];

        return report;
    }

    // Integrazione con Make.com
    formatForMake(mealType) {
        const now = new Date();
        const dayOfWeek = now.getDay();
        const hashtags = this.generateOptimalHashtags(mealType, dayOfWeek);
        const optimalTime = this.getOptimalPostTime(mealType);

        return {
            hashtags: hashtags.join(' '),
            hashtagCount: hashtags.length,
            optimalTime: optimalTime,
            isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
            seasonalContext: this.getSeasonalContext(),
            performance: {
                expectedReach: this.estimateReach(hashtags),
                competitionLevel: this.analyzeCompetition(hashtags)
            }
        };
    }

    // Stima reach basato su mix hashtag
    estimateReach(hashtags) {
        // Calcolo semplificato basato su mix
        const popularCount = hashtags.filter(h => 
            this.categories.veryPopular.food.includes(h) ||
            this.categories.veryPopular.italian.includes(h)
        ).length;

        if (popularCount > 5) return 'Very High (10k+)';
        if (popularCount > 3) return 'High (5k-10k)';
        if (popularCount > 1) return 'Medium (2k-5k)';
        return 'Targeted (1k-2k)';
    }

    // Analizza livello competizione
    analyzeCompetition(hashtags) {
        const now = new Date();
        const hour = now.getHours();
        
        // Alta competizione durante ore pasto
        if ((hour >= 12 && hour <= 14) || (hour >= 19 && hour <= 21)) {
            return 'High';
        }
        return 'Medium';
    }

    // Contesto stagionale per contenuti
    getSeasonalContext() {
        const month = new Date().getMonth();
        const contexts = {
            0: 'Nuovo anno, comfort food',
            1: 'San Valentino approaching',
            2: 'Primavera in arrivo',
            3: 'Pasqua e pranzi famiglia',
            4: 'Maggio, tavoli all\'aperto',
            5: 'Estate, aperitivi lunghi',
            6: 'Piena estate, piatti freschi',
            7: 'Agosto, vacanze e relax',
            8: 'Ritorno alla routine',
            9: 'Autunno, sapori ricchi',
            10: 'Tartufi e vino novello',
            11: 'Natale, menu speciali'
        };
        
        return contexts[month];
    }
}

// Export per uso in Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HashtagOptimizer;
}

// Esempio di utilizzo
const optimizer = new HashtagOptimizer();

// Test per diversi tipi di pasto
console.log('\n🏷️  HASHTAG OPTIMIZER - TEST\n');

['colazione', 'pranzo', 'aperitivo'].forEach(mealType => {
    const result = optimizer.formatForMake(mealType);
    console.log(`\n📱 ${mealType.toUpperCase()}`);
    console.log(`⏰ Orario ottimale: ${result.optimalTime}`);
    console.log(`#️⃣  Hashtag (${result.hashtagCount}): ${result.hashtags}`);
    console.log(`📊 Reach stimato: ${result.performance.expectedReach}`);
    console.log(`🎯 Competizione: ${result.performance.competitionLevel}`);
    console.log(`🗓️  Contesto: ${result.seasonalContext}`);
});

// Genera report
const report = optimizer.generateHashtagReport();
console.log('\n📈 PERFORMANCE REPORT');
console.log(report.recommendations.join('\n'));