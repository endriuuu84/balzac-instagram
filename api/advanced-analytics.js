// Advanced Analytics Module for Balzac Instagram Automation
// Comprehensive analysis of hashtags, competitors, content, and trends

const fs = require('fs');
const path = require('path');

// Load menu data
const menuData = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'menu.json'), 'utf8'));

// API Keys from environment
const APIFY_TOKEN = process.env.APIFY_API_TOKEN;
let INSTAGRAM_TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;
const INSTAGRAM_ACCOUNT_ID = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;
const INSTAGRAM_APP_ID = process.env.INSTAGRAM_APP_ID;
const INSTAGRAM_APP_SECRET = process.env.INSTAGRAM_APP_SECRET;

// =============================================================================
// 1. ADVANCED HASHTAG ROI ANALYSIS
// =============================================================================

class HashtagAnalyzer {
    constructor() {
        this.hashtagCache = new Map();
        this.performanceHistory = [];
    }

    async analyzeHashtagROI(mealType, timeframe = 7) {
        console.log(`🔍 Analyzing hashtag ROI for ${mealType} over ${timeframe} days`);
        
        const hashtagStrategies = this.getHashtagStrategies(mealType);
        
        // Parallel processing with timeout
        const analysisPromises = hashtagStrategies.map(async (strategy) => {
            try {
                const performancePromise = this.getHashtagPerformance(strategy.hashtags, timeframe);
                const performance = await Promise.race([
                    performancePromise,
                    new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 25000)) // 25s timeout per strategy
                ]);
                
                return {
                    name: strategy.name,
                    data: {
                        ...strategy,
                        performance,
                        roi_score: this.calculateROIScore(performance),
                        recommendation: this.generateRecommendation(performance)
                    }
                };
            } catch (error) {
                console.log(`⚠️ Failed to analyze ${strategy.name}:`, error.message);
                return {
                    name: strategy.name,
                    data: {
                        ...strategy,
                        performance: this.getFallbackPerformance(strategy),
                        roi_score: this.getFallbackROIScore(strategy),
                        recommendation: 'Using estimated data due to timeout'
                    }
                };
            }
        });
        
        const results = await Promise.allSettled(analysisPromises);
        const roiAnalysis = {};
        
        results.forEach((result) => {
            if (result.status === 'fulfilled') {
                roiAnalysis[result.value.name] = result.value.data;
            }
        });
        
        return this.optimizeHashtagMix(roiAnalysis, mealType);
    }

    getHashtagStrategies(mealType) {
        const baseStrategies = {
            colazione: [
                {
                    name: 'high_reach',
                    hashtags: ['breakfast', 'coffee', 'cappuccino', 'morning', 'foodie'],
                    target_reach: 50000,
                    competition_level: 'high'
                },
                {
                    name: 'medium_engagement', 
                    hashtags: ['italianbreakfast', 'breakfasttime', 'morningvibes', 'coffeetime', 'brunch'],
                    target_reach: 10000,
                    competition_level: 'medium'
                },
                {
                    name: 'local_niche',
                    hashtags: ['modena', 'modenafood', 'colazionemodena', 'balzacmodena', 'emiliaromagna'],
                    target_reach: 2000,
                    competition_level: 'low'
                },
                {
                    name: 'ultra_niche',
                    hashtags: ['balzacbistrot', 'modenacaffe', 'bistrotmodena', 'croissantfrancesi', 'colazioneitalia'],
                    target_reach: 500,
                    competition_level: 'very_low'
                }
            ],
            pranzo: [
                {
                    name: 'high_reach',
                    hashtags: ['pasta', 'italianfood', 'lunch', 'foodporn', 'instafood'],
                    target_reach: 100000,
                    competition_level: 'high'
                },
                {
                    name: 'medium_engagement',
                    hashtags: ['tortellini', 'cucinaemiliana', 'pranzoitaliano', 'handmadepasta', 'traditionalfood'],
                    target_reach: 15000,
                    competition_level: 'medium'
                },
                {
                    name: 'local_niche',
                    hashtags: ['modena', 'tortellinimodena', 'emiliaromagna', 'modenafood', 'tradizione'],
                    target_reach: 3000,
                    competition_level: 'low'
                },
                {
                    name: 'ultra_niche',
                    hashtags: ['balzacbistrot', 'pranzomodena', 'tortellinifattiamano', 'parmigiano24mesi', 'balzacmodena'],
                    target_reach: 800,
                    competition_level: 'very_low'
                }
            ],
            aperitivo: [
                {
                    name: 'high_reach',
                    hashtags: ['spritz', 'aperitivo', 'cocktails', 'happyhour', 'drinks'],
                    target_reach: 80000,
                    competition_level: 'high'
                },
                {
                    name: 'medium_engagement',
                    hashtags: ['aperitivoitaliano', 'aperol', 'socialdrinks', 'afterwork', 'cocktailbar'],
                    target_reach: 12000,
                    competition_level: 'medium'
                },
                {
                    name: 'local_niche',
                    hashtags: ['modena', 'aperitivomodena', 'modenabynight', 'modenaapertime', 'emiliaromagna'],
                    target_reach: 2500,
                    competition_level: 'low'
                },
                {
                    name: 'ultra_niche',
                    hashtags: ['balzacbistrot', 'balzacaperitivo', 'aperitivobistrot', 'modenaaperitivo', 'spritzmodena'],
                    target_reach: 600,
                    competition_level: 'very_low'
                }
            ]
        };
        
        return baseStrategies[mealType] || baseStrategies.aperitivo;
    }

    async getHashtagPerformance(hashtags, timeframe) {
        // Reduce to 2 hashtags and parallel processing
        const selectedHashtags = hashtags.slice(0, 2);
        
        const performancePromises = selectedHashtags.map(hashtag => 
            this.scrapeHashtagData(hashtag, timeframe).catch(error => {
                console.log(`⚠️ Failed to get data for #${hashtag}:`, error.message);
                return null;
            })
        );
        
        const performances = (await Promise.all(performancePromises)).filter(p => p !== null);
        
        if (performances.length === 0) {
            return this.getFallbackHashtagPerformance(hashtags[0]);
        }
        
        return this.aggregatePerformance(performances);
    }

    async scrapeHashtagData(hashtag, timeframe) {
        // Check cache first
        const cacheKey = `${hashtag}_${timeframe}`;
        if (this.hashtagCache.has(cacheKey)) {
            console.log(`📋 Using cached data for #${hashtag}`);
            return this.hashtagCache.get(cacheKey);
        }
        
        try {
            // Add timeout to individual request
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout
            
            const runResponse = await fetch(`https://api.apify.com/v2/acts/shu8hvrXbJbY3Eb9W/run-sync-get-dataset-items?token=${APIFY_TOKEN}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                signal: controller.signal,
                body: JSON.stringify({
                    directUrls: [`https://www.instagram.com/explore/tags/${hashtag}/`],
                    resultsLimit: 8, // Reduced for speed
                    resultsType: 'posts',
                    addParentData: false,
                    scrapeComments: false,
                    scrapeLocationData: false
                })
            });
            
            clearTimeout(timeoutId);

            if (!runResponse.ok) {
                throw new Error(`Apify request failed: ${runResponse.status}`);
            }
            
            const results = await runResponse.json();
            
            if (results && results.length > 0) {
                const analysis = this.analyzeHashtagData(results, hashtag);
                
                // Cache for 1 hour
                setTimeout(() => this.hashtagCache.delete(cacheKey), 60 * 60 * 1000);
                this.hashtagCache.set(cacheKey, analysis);
                
                console.log(`✅ Analyzed #${hashtag}: ${results.length} posts`);
                return analysis;
            }
            
            return null;
            
        } catch (error) {
            if (error.name === 'AbortError') {
                console.log(`⏱️ Timeout scraping #${hashtag}`);
            } else {
                console.log(`❌ Error scraping #${hashtag}:`, error.message);
            }
            return null;
        }
    }

    analyzeHashtagData(posts, hashtag) {
        const metrics = {
            hashtag,
            total_posts: posts.length,
            avg_likes: 0,
            avg_comments: 0,
            engagement_rate: 0,
            top_performing_post: null,
            content_types: { image: 0, video: 0, carousel: 0 },
            posting_times: {},
            caption_lengths: [],
            related_hashtags: {},
            estimated_reach: 0
        };

        let totalLikes = 0;
        let totalComments = 0;
        let maxEngagement = 0;

        posts.forEach(post => {
            const likes = post.likesCount || 0;
            const comments = post.commentsCount || 0;
            const engagement = likes + comments;
            
            totalLikes += likes;
            totalComments += comments;
            
            // Track top performing post
            if (engagement > maxEngagement) {
                maxEngagement = engagement;
                metrics.top_performing_post = {
                    id: post.id,
                    likes,
                    comments,
                    engagement,
                    caption: post.caption ? post.caption.substring(0, 100) + '...' : '',
                    timestamp: post.timestamp
                };
            }
            
            // Content type analysis
            if (post.type) {
                const type = post.type.toLowerCase();
                if (type.includes('video')) metrics.content_types.video++;
                else if (type.includes('sidecar')) metrics.content_types.carousel++;
                else metrics.content_types.image++;
            }
            
            // Posting time analysis
            if (post.timestamp) {
                const hour = new Date(post.timestamp).getHours();
                metrics.posting_times[hour] = (metrics.posting_times[hour] || 0) + 1;
            }
            
            // Caption analysis
            if (post.caption) {
                metrics.caption_lengths.push(post.caption.length);
                
                // Extract related hashtags
                const hashtags = post.caption.match(/#[a-zA-Z0-9_]+/g) || [];
                hashtags.forEach(tag => {
                    if (tag.toLowerCase() !== `#${hashtag.toLowerCase()}`) {
                        metrics.related_hashtags[tag] = (metrics.related_hashtags[tag] || 0) + 1;
                    }
                });
            }
        });

        metrics.avg_likes = Math.round(totalLikes / posts.length);
        metrics.avg_comments = Math.round(totalComments / posts.length);
        metrics.engagement_rate = Math.round((totalLikes + totalComments) / posts.length);
        metrics.estimated_reach = Math.round(metrics.engagement_rate * 10); // Rough estimation
        
        // Get top related hashtags
        metrics.related_hashtags = Object.entries(metrics.related_hashtags)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10)
            .reduce((obj, [hashtag, count]) => {
                obj[hashtag] = count;
                return obj;
            }, {});
            
        return metrics;
    }

    aggregatePerformance(performances) {
        if (!performances.length) return null;
        
        const aggregated = {
            hashtags_analyzed: performances.length,
            avg_engagement_rate: 0,
            avg_likes: 0,
            avg_comments: 0,
            best_performing_hashtag: null,
            content_type_insights: { image: 0, video: 0, carousel: 0 },
            optimal_posting_times: {},
            related_hashtags: {},
            estimated_total_reach: 0
        };

        let maxEngagement = 0;
        
        performances.forEach(perf => {
            aggregated.avg_engagement_rate += perf.engagement_rate;
            aggregated.avg_likes += perf.avg_likes;
            aggregated.avg_comments += perf.avg_comments;
            aggregated.estimated_total_reach += perf.estimated_reach;
            
            if (perf.engagement_rate > maxEngagement) {
                maxEngagement = perf.engagement_rate;
                aggregated.best_performing_hashtag = perf.hashtag;
            }
            
            // Aggregate content types
            Object.keys(perf.content_types).forEach(type => {
                aggregated.content_type_insights[type] += perf.content_types[type];
            });
            
            // Aggregate posting times
            Object.entries(perf.posting_times).forEach(([hour, count]) => {
                aggregated.optimal_posting_times[hour] = (aggregated.optimal_posting_times[hour] || 0) + count;
            });
            
            // Aggregate related hashtags
            Object.entries(perf.related_hashtags).forEach(([hashtag, count]) => {
                aggregated.related_hashtags[hashtag] = (aggregated.related_hashtags[hashtag] || 0) + count;
            });
        });

        // Calculate averages
        aggregated.avg_engagement_rate = Math.round(aggregated.avg_engagement_rate / performances.length);
        aggregated.avg_likes = Math.round(aggregated.avg_likes / performances.length);
        aggregated.avg_comments = Math.round(aggregated.avg_comments / performances.length);
        
        return aggregated;
    }

    calculateROIScore(performance) {
        if (!performance) return 0;
        
        // ROI Score based on multiple factors
        const engagementWeight = 0.4;
        const reachWeight = 0.3;
        const contentDiversityWeight = 0.2;
        const timingWeight = 0.1;
        
        const engagementScore = Math.min(performance.avg_engagement_rate / 100, 1); // Normalize to 0-1
        const reachScore = Math.min(performance.estimated_total_reach / 10000, 1); // Normalize to 0-1
        
        const contentTypes = Object.values(performance.content_type_insights);
        const contentDiversityScore = contentTypes.length > 1 ? 0.8 : 0.4;
        
        const timingScore = Object.keys(performance.optimal_posting_times).length > 3 ? 0.8 : 0.5;
        
        const roiScore = (
            engagementScore * engagementWeight +
            reachScore * reachWeight +
            contentDiversityScore * contentDiversityWeight +
            timingScore * timingWeight
        ) * 100;
        
        return Math.round(roiScore);
    }

    generateRecommendation(performance) {
        if (!performance) return 'Insufficient data for recommendation';
        
        const recommendations = [];
        
        if (performance.avg_engagement_rate > 50) {
            recommendations.push('High-performing hashtag group - increase usage');
        } else if (performance.avg_engagement_rate < 20) {
            recommendations.push('Low engagement - consider alternative hashtags');
        } else {
            recommendations.push('Moderate performance - test with different content types');
        }
        
        // Content type recommendations
        const { image, video, carousel } = performance.content_type_insights;
        if (video > image && video > carousel) {
            recommendations.push('Video content performs best with these hashtags');
        } else if (carousel > image && carousel > video) {
            recommendations.push('Carousel posts show higher engagement');
        } else {
            recommendations.push('Single images work well with these hashtags');
        }
        
        // Timing recommendations
        const bestHours = Object.entries(performance.optimal_posting_times)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 2)
            .map(([hour]) => hour);
        
        if (bestHours.length > 0) {
            recommendations.push(`Best posting times: ${bestHours.join('h, ')}h`);
        }
        
        return recommendations.join('. ');
    }

    optimizeHashtagMix(roiAnalysis, mealType) {
        const strategies = Object.values(roiAnalysis);
        strategies.sort((a, b) => b.roi_score - a.roi_score);
        
        const optimizedMix = {
            recommended_strategy: {
                high_reach: strategies[0]?.hashtags?.slice(0, 3) || [],
                medium_engagement: strategies[1]?.hashtags?.slice(0, 5) || [],
                local_niche: strategies[2]?.hashtags?.slice(0, 4) || [],
                ultra_niche: strategies[3]?.hashtags || []
            },
            performance_summary: {
                best_performing_strategy: strategies[0]?.name || 'unknown',
                best_roi_score: strategies[0]?.roi_score || 0,
                overall_recommendation: this.generateOverallRecommendation(strategies, mealType)
            },
            detailed_analysis: roiAnalysis
        };
        
        return optimizedMix;
    }

    generateOverallRecommendation(strategies, mealType) {
        const topStrategy = strategies[0];
        if (!topStrategy) return 'Insufficient data for recommendations';
        
        const mealSpecificAdvice = {
            colazione: 'Focus on morning energy and coffee culture hashtags',
            pranzo: 'Emphasize traditional Italian cuisine and quality ingredients',
            aperitivo: 'Highlight social atmosphere and Italian aperitivo culture'
        };
        
        return `${mealSpecificAdvice[mealType] || 'Optimize for meal-specific content'}. Best performing strategy: ${topStrategy.name} (ROI: ${topStrategy.roi_score}). ${topStrategy.recommendation}`;
    }
    
    // Fallback methods for when real data is unavailable
    getFallbackPerformance(strategy) {
        const baseEngagement = {
            high_reach: 150,
            medium_engagement: 80,
            local_niche: 45,
            ultra_niche: 25
        };
        
        return {
            hashtags_analyzed: strategy.hashtags.length,
            avg_engagement_rate: baseEngagement[strategy.name] || 50,
            avg_likes: Math.round((baseEngagement[strategy.name] || 50) * 0.8),
            avg_comments: Math.round((baseEngagement[strategy.name] || 50) * 0.2),
            best_performing_hashtag: strategy.hashtags[0],
            content_type_insights: { image: 60, video: 30, carousel: 10 },
            optimal_posting_times: { 12: 3, 13: 5, 19: 4 },
            related_hashtags: {},
            estimated_total_reach: strategy.target_reach || 1000,
            is_fallback: true
        };
    }
    
    getFallbackHashtagPerformance(hashtag) {
        return {
            hashtag: hashtag,
            total_posts: 5,
            avg_likes: 150,
            avg_comments: 10,
            engagement_rate: 160,
            top_performing_post: null,
            content_types: { image: 3, video: 1, carousel: 1 },
            posting_times: { 12: 2, 13: 2, 19: 1 },
            caption_lengths: [120, 150, 180, 90, 200],
            related_hashtags: {},
            estimated_reach: 1600,
            is_fallback: true
        };
    }
    
    getFallbackROIScore(strategy) {
        const scores = {
            high_reach: 65,
            medium_engagement: 58,
            local_niche: 72,
            ultra_niche: 68
        };
        return scores[strategy.name] || 60;
    }
}

// Export for use in other modules
module.exports = {
    HashtagAnalyzer
};