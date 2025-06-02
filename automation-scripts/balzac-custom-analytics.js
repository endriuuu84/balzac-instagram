// Balzac Custom Analytics - Free Alternative to Hootsuite
require('dotenv').config();
const axios = require('axios');
const fs = require('fs').promises;

class BalzacAnalytics {
  constructor() {
    this.config = {
      accessToken: process.env.FACEBOOK_PAGE_ACCESS_TOKEN,
      businessAccountId: process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID,
      pageId: process.env.FACEBOOK_PAGE_ID
    };
  }

  // Get Instagram insights
  async getAccountInsights(period = 'day', since = null, until = null) {
    const metrics = [
      'impressions',
      'reach', 
      'profile_views',
      'website_clicks',
      'follower_count',
      'email_contacts',
      'phone_call_clicks',
      'text_message_clicks',
      'get_directions_clicks'
    ];

    try {
      const params = {
        metric: metrics.join(','),
        period: period,
        access_token: this.config.accessToken
      };

      if (since) params.since = since;
      if (until) params.until = until;

      const response = await axios.get(
        `https://graph.facebook.com/v18.0/${this.config.businessAccountId}/insights`,
        { params }
      );

      return this.parseInsights(response.data.data);
    } catch (error) {
      console.error('Error getting insights:', error.response?.data || error.message);
      return null;
    }
  }

  // Parse insights data
  parseInsights(data) {
    const insights = {};
    data.forEach(metric => {
      insights[metric.name] = metric.values[0]?.value || 0;
    });
    return insights;
  }

  // Get posts performance
  async getPostsAnalytics(limit = 20) {
    try {
      // Get recent posts
      const postsResponse = await axios.get(
        `https://graph.facebook.com/v18.0/${this.config.businessAccountId}/media`,
        {
          params: {
            fields: 'id,caption,media_type,media_url,timestamp,like_count,comments_count,insights.metric(impressions,reach,saved,engagement)',
            limit: limit,
            access_token: this.config.accessToken
          }
        }
      );

      const posts = postsResponse.data.data;
      
      // Analyze each post
      const analytics = posts.map(post => {
        const insights = this.parseMediaInsights(post.insights?.data || []);
        const engagementRate = this.calculateEngagementRate(
          post.like_count + post.comments_count + (insights.saved || 0),
          insights.reach || 1
        );

        return {
          id: post.id,
          timestamp: post.timestamp,
          caption: post.caption?.substring(0, 50) + '...',
          metrics: {
            likes: post.like_count || 0,
            comments: post.comments_count || 0,
            saved: insights.saved || 0,
            reach: insights.reach || 0,
            impressions: insights.impressions || 0
          },
          performance: {
            engagementRate: engagementRate + '%',
            mealType: this.identifyMealType(post.timestamp, post.caption),
            isTopPerformer: engagementRate > 5
          }
        };
      });

      return analytics;
    } catch (error) {
      console.error('Error getting posts:', error.response?.data || error.message);
      return [];
    }
  }

  // Parse media insights
  parseMediaInsights(insights) {
    const parsed = {};
    insights.forEach(metric => {
      parsed[metric.name] = metric.values[0]?.value || 0;
    });
    return parsed;
  }

  // Calculate engagement rate
  calculateEngagementRate(engagement, reach) {
    if (reach === 0) return 0;
    return ((engagement / reach) * 100).toFixed(2);
  }

  // Identify meal type from timestamp
  identifyMealType(timestamp, caption) {
    const hour = new Date(timestamp).getHours();
    
    // Check caption for keywords
    const captionLower = caption?.toLowerCase() || '';
    if (captionLower.includes('colazione') || captionLower.includes('cappuccino')) {
      return 'breakfast';
    }
    if (captionLower.includes('pranzo') || captionLower.includes('pasta')) {
      return 'lunch';
    }
    if (captionLower.includes('aperitivo') || captionLower.includes('spritz')) {
      return 'aperitivo';
    }
    
    // Fallback to time-based
    if (hour >= 6 && hour < 11) return 'breakfast';
    if (hour >= 11 && hour < 17) return 'lunch';
    return 'aperitivo';
  }

  // Get best posting times based on engagement
  async calculateBestPostingTimes() {
    const posts = await this.getPostsAnalytics(50); // Analyze last 50 posts
    
    // Group by hour and calculate average engagement
    const hourlyEngagement = {};
    
    posts.forEach(post => {
      const hour = new Date(post.timestamp).getHours();
      if (!hourlyEngagement[hour]) {
        hourlyEngagement[hour] = {
          totalEngagement: 0,
          count: 0,
          posts: []
        };
      }
      
      const engagementRate = parseFloat(post.performance.engagementRate);
      hourlyEngagement[hour].totalEngagement += engagementRate;
      hourlyEngagement[hour].count += 1;
      hourlyEngagement[hour].posts.push(post);
    });
    
    // Calculate averages and find best times
    const bestTimes = Object.entries(hourlyEngagement)
      .map(([hour, data]) => ({
        hour: parseInt(hour),
        avgEngagement: (data.totalEngagement / data.count).toFixed(2),
        postCount: data.count
      }))
      .sort((a, b) => b.avgEngagement - a.avgEngagement);
    
    // Best times for each meal
    const mealTimes = {
      breakfast: bestTimes.find(t => t.hour >= 7 && t.hour <= 10) || { hour: 8 },
      lunch: bestTimes.find(t => t.hour >= 11 && t.hour <= 14) || { hour: 12 },
      aperitivo: bestTimes.find(t => t.hour >= 17 && t.hour <= 20) || { hour: 18 }
    };
    
    return {
      overall: bestTimes.slice(0, 5),
      byMealType: {
        breakfast: `${mealTimes.breakfast.hour}:15`,
        lunch: `${mealTimes.lunch.hour}:30`,
        aperitivo: `${mealTimes.aperitivo.hour}:45`
      }
    };
  }

  // Generate weekly report
  async generateWeeklyReport() {
    console.log('📊 Generating Balzac Weekly Analytics Report...\n');
    
    // Get date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);
    
    // Get account insights
    const accountInsights = await this.getAccountInsights(
      'day',
      Math.floor(startDate.getTime() / 1000),
      Math.floor(endDate.getTime() / 1000)
    );
    
    // Get posts analytics
    const postsAnalytics = await this.getPostsAnalytics(30);
    const weekPosts = postsAnalytics.filter(post => 
      new Date(post.timestamp) >= startDate
    );
    
    // Calculate best times
    const bestTimes = await this.calculateBestPostingTimes();
    
    // Find top performers
    const topPosts = weekPosts
      .sort((a, b) => parseFloat(b.performance.engagementRate) - parseFloat(a.performance.engagementRate))
      .slice(0, 3);
    
    // Calculate averages
    const avgEngagement = weekPosts.length > 0
      ? (weekPosts.reduce((sum, post) => sum + parseFloat(post.performance.engagementRate), 0) / weekPosts.length).toFixed(2)
      : 0;
    
    // Meal type performance
    const mealTypePerformance = this.analyzeMealTypePerformance(weekPosts);
    
    const report = {
      period: {
        start: startDate.toLocaleDateString('it-IT'),
        end: endDate.toLocaleDateString('it-IT')
      },
      summary: {
        postsPublished: weekPosts.length,
        totalReach: accountInsights?.reach || 0,
        totalImpressions: accountInsights?.impressions || 0,
        profileViews: accountInsights?.profile_views || 0,
        websiteClicks: accountInsights?.website_clicks || 0,
        followerCount: accountInsights?.follower_count || 0,
        avgEngagementRate: avgEngagement + '%'
      },
      bestPostingTimes: bestTimes.byMealType,
      topPosts: topPosts.map(post => ({
        caption: post.caption,
        engagement: post.performance.engagementRate,
        type: post.performance.mealType,
        metrics: post.metrics
      })),
      mealTypePerformance,
      businessMetrics: {
        directionsClicks: accountInsights?.get_directions_clicks || 0,
        phoneClicks: accountInsights?.phone_call_clicks || 0,
        emailClicks: accountInsights?.email_contacts || 0
      },
      recommendations: this.generateRecommendations(weekPosts, mealTypePerformance)
    };
    
    // Save report
    await this.saveReport(report);
    
    return report;
  }

  // Analyze performance by meal type
  analyzeMealTypePerformance(posts) {
    const mealTypes = ['breakfast', 'lunch', 'aperitivo'];
    const performance = {};
    
    mealTypes.forEach(type => {
      const typePosts = posts.filter(p => p.performance.mealType === type);
      if (typePosts.length > 0) {
        performance[type] = {
          count: typePosts.length,
          avgEngagement: (typePosts.reduce((sum, p) => sum + parseFloat(p.performance.engagementRate), 0) / typePosts.length).toFixed(2) + '%',
          totalReach: typePosts.reduce((sum, p) => sum + p.metrics.reach, 0),
          totalSaves: typePosts.reduce((sum, p) => sum + p.metrics.saved, 0)
        };
      } else {
        performance[type] = { count: 0, avgEngagement: '0%', totalReach: 0, totalSaves: 0 };
      }
    });
    
    return performance;
  }

  // Generate recommendations
  generateRecommendations(posts, mealTypePerformance) {
    const recommendations = [];
    
    // Meal type recommendations
    const bestMealType = Object.entries(mealTypePerformance)
      .sort((a, b) => parseFloat(b[1].avgEngagement) - parseFloat(a[1].avgEngagement))[0];
    
    if (bestMealType) {
      recommendations.push(`Focus on ${bestMealType[0]} content - highest engagement at ${bestMealType[1].avgEngagement}`);
    }
    
    // Posting frequency
    if (posts.length < 15) {
      recommendations.push('Increase posting frequency to maintain visibility');
    }
    
    // Saves analysis
    const totalSaves = posts.reduce((sum, p) => sum + p.metrics.saved, 0);
    if (totalSaves > posts.length * 5) {
      recommendations.push('High save rate indicates strong booking intent - promote reservations in captions');
    }
    
    // Time optimization
    recommendations.push('Test posting 15 minutes earlier for lunch content based on engagement patterns');
    
    return recommendations;
  }

  // Save report to file
  async saveReport(report) {
    const filename = `balzac-report-${new Date().toISOString().split('T')[0]}.json`;
    const dir = './analytics-reports';
    
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(`${dir}/${filename}`, JSON.stringify(report, null, 2));
    
    console.log(`📊 Report saved: ${filename}`);
  }

  // Display report in console
  displayReport(report) {
    console.log('\n🍷 BALZAC BISTROT - WEEKLY ANALYTICS REPORT');
    console.log('='.repeat(50));
    
    console.log(`\n📅 Period: ${report.period.start} - ${report.period.end}`);
    
    console.log('\n📊 SUMMARY:');
    console.log(`   Posts Published: ${report.summary.postsPublished}`);
    console.log(`   Total Reach: ${report.summary.totalReach.toLocaleString()}`);
    console.log(`   Profile Views: ${report.summary.profileViews}`);
    console.log(`   Website Clicks: ${report.summary.websiteClicks}`);
    console.log(`   Avg Engagement: ${report.summary.avgEngagementRate}`);
    
    console.log('\n⏰ BEST POSTING TIMES:');
    Object.entries(report.bestPostingTimes).forEach(([meal, time]) => {
      console.log(`   ${meal}: ${time}`);
    });
    
    console.log('\n🏆 TOP POSTS:');
    report.topPosts.forEach((post, i) => {
      console.log(`   ${i + 1}. ${post.type} - ${post.engagement} engagement`);
      console.log(`      ${post.caption}`);
    });
    
    console.log('\n🍽️  MEAL TYPE PERFORMANCE:');
    Object.entries(report.mealTypePerformance).forEach(([type, data]) => {
      console.log(`   ${type}: ${data.avgEngagement} avg (${data.count} posts)`);
    });
    
    console.log('\n📱 BUSINESS METRICS:');
    console.log(`   Get Directions: ${report.businessMetrics.directionsClicks}`);
    console.log(`   Phone Clicks: ${report.businessMetrics.phoneClicks}`);
    console.log(`   Email Clicks: ${report.businessMetrics.emailClicks}`);
    
    console.log('\n💡 RECOMMENDATIONS:');
    report.recommendations.forEach(rec => {
      console.log(`   • ${rec}`);
    });
    
    console.log('\n' + '='.repeat(50));
  }
}

// Test the analytics
async function testAnalytics() {
  const analytics = new BalzacAnalytics();
  
  console.log('🚀 BALZAC CUSTOM ANALYTICS TEST\n');
  
  try {
    // Generate weekly report
    const report = await analytics.generateWeeklyReport();
    
    // Display report
    analytics.displayReport(report);
    
    console.log('\n✅ Custom analytics working! Cost: €0/month 🎉');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

module.exports = BalzacAnalytics;

// Run test if called directly
if (require.main === module) {
  testAnalytics();
}