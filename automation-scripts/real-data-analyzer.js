// Real Data Analyzer per Balzac Instagram
// Utilizza API reali per analisi data-driven

const axios = require('axios');

class RealDataAnalyzer {
    constructor(config) {
        this.config = {
            instagram: {
                accessToken: config.instagramToken,
                userId: config.instagramUserId
            },
            apify: {
                token: config.apifyToken
            }
        };
    }

    // 1. INSTAGRAM INSIGHTS - Analizza performance dei tuoi post
    async getInstagramInsights() {
        try {
            // Ottieni ultimi 25 post
            const mediaResponse = await axios.get(
                `https://graph.instagram.com/v17.0/${this.config.instagram.userId}/media`,
                {
                    params: {
                        fields: 'id,caption,timestamp,media_type,like_count,comments_count',
                        limit: 25,
                        access_token: this.config.instagram.accessToken
                    }
                }
            );

            const posts = mediaResponse.data.data;
            const insights = {
                bestPerformingHashtags: [],
                optimalPostTimes: [],
                averageEngagement: 0,
                contentAnalysis: {}
            };

            // Analizza ogni post
            for (const post of posts) {
                // Estrai hashtags dalla caption
                const hashtags = this.extractHashtags(post.caption);
                const engagement = (post.like_count + post.comments_count);
                
                // Trova orari migliori
                const postHour = new Date(post.timestamp).getHours();
                insights.optimalPostTimes.push({
                    hour: postHour,
                    engagement: engagement
                });

                // Analizza hashtag performance
                hashtags.forEach(tag => {
                    const existing = insights.bestPerformingHashtags.find(h => h.tag === tag);
                    if (existing) {
                        existing.totalEngagement += engagement;
                        existing.count++;
                    } else {
                        insights.bestPerformingHashtags.push({
                            tag: tag,
                            totalEngagement: engagement,
                            count: 1
                        });
                    }
                });
            }

            // Calcola medie e ordina
            insights.bestPerformingHashtags.sort((a, b) => 
                (b.totalEngagement / b.count) - (a.totalEngagement / a.count)
            );

            return insights;

        } catch (error) {
            console.error('Instagram API Error:', error.message);
            return null;
        }
    }

    // 2. APIFY - Analizza hashtag trending e competitor
    async analyzeHashtagTrends(hashtag) {
        try {
            // Avvia Instagram Hashtag Scraper
            const runResponse = await axios.post(
                `https://api.apify.com/v2/acts/zuzka~instagram-hashtag-scraper/runs`,
                {
                    hashtags: [hashtag],
                    resultsLimit: 100
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.config.apify.token}`
                    }
                }
            );

            const runId = runResponse.data.data.id;

            // Attendi risultati (con timeout)
            await this.waitForApifyRun(runId);

            // Ottieni risultati
            const results = await axios.get(
                `https://api.apify.com/v2/actor-runs/${runId}/dataset/items`,
                {
                    headers: {
                        'Authorization': `Bearer ${this.config.apify.token}`
                    }
                }
            );

            const posts = results.data;
            
            // Analizza trending
            const analysis = {
                hashtag: hashtag,
                totalPosts: posts.length,
                averageLikes: posts.reduce((sum, p) => sum + p.likesCount, 0) / posts.length,
                averageComments: posts.reduce((sum, p) => sum + p.commentsCount, 0) / posts.length,
                topRelatedHashtags: this.extractTopHashtags(posts),
                bestPostingTimes: this.analyzeBestTimes(posts),
                contentThemes: this.analyzeContent(posts)
            };

            return analysis;

        } catch (error) {
            console.error('Apify API Error:', error.message);
            return null;
        }
    }

    // 3. COMPETITOR ANALYSIS - Monitora altri ristoranti Modena
    async analyzeCompetitors(competitorUsernames) {
        const competitorInsights = [];

        for (const username of competitorUsernames) {
            try {
                // Usa Apify Instagram Profile Scraper
                const runResponse = await axios.post(
                    `https://api.apify.com/v2/acts/apify~instagram-profile-scraper/runs`,
                    {
                        usernames: [username],
                        resultsLimit: 20
                    },
                    {
                        headers: {
                            'Authorization': `Bearer ${this.config.apify.token}`
                        }
                    }
                );

                const runId = runResponse.data.data.id;
                await this.waitForApifyRun(runId);

                const results = await axios.get(
                    `https://api.apify.com/v2/actor-runs/${runId}/dataset/items`,
                    {
                        headers: {
                            'Authorization': `Bearer ${this.config.apify.token}`
                        }
                    }
                );

                const profileData = results.data[0];
                
                competitorInsights.push({
                    username: username,
                    followers: profileData.followersCount,
                    avgLikes: profileData.avgLikes,
                    avgComments: profileData.avgComments,
                    postFrequency: profileData.postsCount / 30, // posts per day
                    topHashtags: this.extractTopHashtagsFromProfile(profileData),
                    contentStrategy: this.analyzeContentStrategy(profileData)
                });

            } catch (error) {
                console.error(`Error analyzing ${username}:`, error.message);
            }
        }

        return competitorInsights;
    }

    // 4. OPTIMAL POSTING TIMES - Basato su dati reali
    async getOptimalPostingTimes() {
        // Combina dati da Instagram Insights e Apify
        const insights = await this.getInstagramInsights();
        const competitorData = await this.analyzeCompetitors([
            'osteriafrancescana', // Esempio competitor
            'trattoriaaldina',
            'ristoranteeuropa'
        ]);

        // Analizza quando i post ottengono più engagement
        const timeAnalysis = {
            colazione: { bestHour: 7.5, avgEngagement: 0 },
            pranzo: { bestHour: 12.5, avgEngagement: 0 },
            aperitivo: { bestHour: 19, avgEngagement: 0 }
        };

        // Aggrega dati per trovare orari ottimali
        if (insights && insights.optimalPostTimes) {
            insights.optimalPostTimes.forEach(timeData => {
                if (timeData.hour >= 6 && timeData.hour <= 10) {
                    timeAnalysis.colazione.avgEngagement += timeData.engagement;
                } else if (timeData.hour >= 11 && timeData.hour <= 15) {
                    timeAnalysis.pranzo.avgEngagement += timeData.engagement;
                } else if (timeData.hour >= 17 && timeData.hour <= 21) {
                    timeAnalysis.aperitivo.avgEngagement += timeData.engagement;
                }
            });
        }

        return timeAnalysis;
    }

    // 5. HASHTAG RECOMMENDATIONS - Basato su performance reale
    async getHashtagRecommendations(mealType) {
        const recommendations = {
            highPerformance: [],
            mediumPerformance: [],
            niche: [],
            trending: [],
            avoid: []
        };

        // Analizza hashtag specifici per tipo pasto
        const hashtagsToAnalyze = {
            colazione: ['#colazioneitaliana', '#breakfastmodena', '#cappuccino'],
            pranzo: ['#pranzomodena', '#tortellini', '#cucinaemiliana'],
            aperitivo: ['#aperitivomodena', '#spritztime', '#happyhourmodena']
        };

        for (const hashtag of hashtagsToAnalyze[mealType]) {
            const analysis = await this.analyzeHashtagTrends(hashtag);
            
            if (analysis) {
                if (analysis.averageLikes > 1000) {
                    recommendations.highPerformance.push({
                        tag: hashtag,
                        avgEngagement: analysis.averageLikes + analysis.averageComments
                    });
                } else if (analysis.averageLikes > 500) {
                    recommendations.mediumPerformance.push({
                        tag: hashtag,
                        avgEngagement: analysis.averageLikes + analysis.averageComments
                    });
                } else {
                    recommendations.niche.push({
                        tag: hashtag,
                        avgEngagement: analysis.averageLikes + analysis.averageComments
                    });
                }

                // Aggiungi related hashtags come trending
                recommendations.trending.push(...analysis.topRelatedHashtags);
            }
        }

        // Identifica hashtag da evitare (basso engagement)
        const ownInsights = await this.getInstagramInsights();
        if (ownInsights) {
            const poorPerformers = ownInsights.bestPerformingHashtags
                .filter(h => (h.totalEngagement / h.count) < 100)
                .map(h => h.tag);
            
            recommendations.avoid = poorPerformers;
        }

        return recommendations;
    }

    // Helper Functions
    extractHashtags(caption) {
        if (!caption) return [];
        const hashtagRegex = /#[a-zA-Z0-9_]+/g;
        return caption.match(hashtagRegex) || [];
    }

    async waitForApifyRun(runId, maxWaitTime = 60000) {
        const startTime = Date.now();
        
        while (Date.now() - startTime < maxWaitTime) {
            const statusResponse = await axios.get(
                `https://api.apify.com/v2/actor-runs/${runId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${this.config.apify.token}`
                    }
                }
            );

            if (statusResponse.data.data.status === 'SUCCEEDED') {
                return true;
            } else if (statusResponse.data.data.status === 'FAILED') {
                throw new Error('Apify run failed');
            }

            // Wait 2 seconds before next check
            await new Promise(resolve => setTimeout(resolve, 2000));
        }

        throw new Error('Apify run timeout');
    }

    extractTopHashtags(posts) {
        const hashtagCount = {};
        
        posts.forEach(post => {
            const hashtags = this.extractHashtags(post.caption);
            hashtags.forEach(tag => {
                hashtagCount[tag] = (hashtagCount[tag] || 0) + 1;
            });
        });

        return Object.entries(hashtagCount)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([tag, count]) => ({ tag, count }));
    }

    analyzeBestTimes(posts) {
        const timeSlots = {};
        
        posts.forEach(post => {
            const hour = new Date(post.timestamp).getHours();
            const engagement = post.likesCount + post.commentsCount;
            
            if (!timeSlots[hour]) {
                timeSlots[hour] = { totalEngagement: 0, count: 0 };
            }
            
            timeSlots[hour].totalEngagement += engagement;
            timeSlots[hour].count++;
        });

        return Object.entries(timeSlots)
            .map(([hour, data]) => ({
                hour: parseInt(hour),
                avgEngagement: data.totalEngagement / data.count
            }))
            .sort((a, b) => b.avgEngagement - a.avgEngagement)
            .slice(0, 5);
    }

    analyzeContent(posts) {
        // Analizza temi ricorrenti nei post di successo
        const themes = {
            traditional: 0,
            modern: 0,
            seasonal: 0,
            events: 0
        };

        posts.forEach(post => {
            const caption = (post.caption || '').toLowerCase();
            
            if (caption.includes('tradizione') || caption.includes('nonna')) themes.traditional++;
            if (caption.includes('nuovo') || caption.includes('innovativo')) themes.modern++;
            if (caption.includes('stagione') || caption.includes('fresco')) themes.seasonal++;
            if (caption.includes('evento') || caption.includes('festa')) themes.events++;
        });

        return themes;
    }

    extractTopHashtagsFromProfile(profileData) {
        // Estrai hashtag più usati dal profilo
        const allHashtags = [];
        
        if (profileData.posts) {
            profileData.posts.forEach(post => {
                const hashtags = this.extractHashtags(post.caption);
                allHashtags.push(...hashtags);
            });
        }

        const hashtagCount = {};
        allHashtags.forEach(tag => {
            hashtagCount[tag] = (hashtagCount[tag] || 0) + 1;
        });

        return Object.entries(hashtagCount)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([tag]) => tag);
    }

    analyzeContentStrategy(profileData) {
        // Analizza strategia di contenuto del competitor
        return {
            postingFrequency: profileData.postsCount / 30,
            avgHashtagsPerPost: 15, // Placeholder
            contentTypes: {
                photos: profileData.posts?.filter(p => p.type === 'GraphImage').length || 0,
                videos: profileData.posts?.filter(p => p.type === 'GraphVideo').length || 0,
                carousels: profileData.posts?.filter(p => p.type === 'GraphSidecar').length || 0
            }
        };
    }

    // INTEGRAZIONE CON MAKE.COM
    async generateDataDrivenRecommendations(mealType) {
        console.log('🔄 Analizzando dati reali...');

        const [
            instagramInsights,
            hashtagRecommendations,
            optimalTimes,
            competitorAnalysis
        ] = await Promise.all([
            this.getInstagramInsights(),
            this.getHashtagRecommendations(mealType),
            this.getOptimalPostingTimes(),
            this.analyzeCompetitors(['osteriafrancescana'])
        ]);

        return {
            timestamp: new Date().toISOString(),
            mealType: mealType,
            recommendations: {
                hashtags: hashtagRecommendations,
                optimalPostTime: optimalTimes[mealType],
                contentSuggestions: this.generateContentSuggestions(instagramInsights, competitorAnalysis),
                performanceMetrics: {
                    expectedReach: this.estimateReach(hashtagRecommendations),
                    competitionLevel: this.assessCompetition(competitorAnalysis)
                }
            },
            insights: {
                yourAccount: instagramInsights,
                competitors: competitorAnalysis,
                marketTrends: this.identifyTrends(hashtagRecommendations)
            }
        };
    }

    generateContentSuggestions(insights, competitors) {
        // Genera suggerimenti basati su dati reali
        const suggestions = [];

        if (insights && insights.bestPerformingHashtags.length > 0) {
            suggestions.push(`Usa più spesso: ${insights.bestPerformingHashtags[0].tag}`);
        }

        if (competitors && competitors[0]) {
            const topCompetitor = competitors[0];
            if (topCompetitor.avgLikes > 1000) {
                suggestions.push(`Studia la strategia di ${topCompetitor.username}`);
            }
        }

        return suggestions;
    }

    estimateReach(hashtagData) {
        // Stima reach basato su dati reali
        const avgEngagement = hashtagData.highPerformance.reduce((sum, h) => 
            sum + h.avgEngagement, 0) / hashtagData.highPerformance.length;

        if (avgEngagement > 5000) return 'Very High (10k+)';
        if (avgEngagement > 2000) return 'High (5k-10k)';
        if (avgEngagement > 1000) return 'Medium (2k-5k)';
        return 'Standard (1k-2k)';
    }

    assessCompetition(competitors) {
        // Valuta livello di competizione
        const avgFollowers = competitors.reduce((sum, c) => 
            sum + c.followers, 0) / competitors.length;

        if (avgFollowers > 10000) return 'High';
        if (avgFollowers > 5000) return 'Medium';
        return 'Low';
    }

    identifyTrends(hashtagData) {
        // Identifica trend emergenti
        return {
            rising: hashtagData.trending.slice(0, 5),
            declining: hashtagData.avoid,
            seasonal: this.getSeasonalTrends()
        };
    }

    getSeasonalTrends() {
        const month = new Date().getMonth();
        const seasonalTrends = {
            0: ['#detox', '#healthystart'],
            1: ['#sanvalentino', '#cennaromantica'],
            2: ['#primavera', '#menulight'],
            3: ['#pasqua', '#brunchtradizione'],
            4: ['#aperitivoallaperto', '#terrazza'],
            5: ['#estate', '#cocktailtime'],
            6: ['#summervibes', '#cenasullaperto'],
            7: ['#ferragosto', '#menuspeciale'],
            8: ['#backtowork', '#pausalunch'],
            9: ['#autunno', '#tartufo'],
            10: ['#thanksgiving', '#comfort'],
            11: ['#natale', '#cenaaziendali']
        };

        return seasonalTrends[month] || [];
    }
}

// Export
module.exports = RealDataAnalyzer;

// Esempio di utilizzo
async function testRealAnalysis() {
    const analyzer = new RealDataAnalyzer({
        instagramToken: process.env.INSTAGRAM_ACCESS_TOKEN,
        instagramUserId: process.env.INSTAGRAM_USER_ID,
        apifyToken: process.env.APIFY_API_TOKEN
    });

    console.log('📊 ANALISI DATI REALI IN CORSO...\n');

    try {
        const recommendations = await analyzer.generateDataDrivenRecommendations('aperitivo');
        console.log(JSON.stringify(recommendations, null, 2));
    } catch (error) {
        console.error('Errore:', error.message);
    }
}

// Decommentare per test
// testRealAnalysis();