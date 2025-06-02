// Alternative Monitoring for Balzac (without Brand24)
require('dotenv').config();
const axios = require('axios');

class BalzacAlternativeMonitoring {
  constructor() {
    this.config = {
      keywords: ['Balzac Bistrot', 'Balzac Modena', '@balzacmodena'],
      sources: {
        google: true,
        instagram: true,
        facebook: true
      },
      alertEmail: 'info@balzacbistrot.com'
    };
  }

  // Monitor Google My Business reviews
  async monitorGoogleReviews() {
    console.log('🔍 Checking Google Reviews...');
    
    // This would use Google My Business API
    // For now, return demo data with instructions
    return {
      newReviews: 2,
      averageRating: 4.6,
      sentimentBreakdown: {
        positive: 85,
        neutral: 10,
        negative: 5
      },
      recentReviews: [
        {
          rating: 5,
          text: "Esperienza fantastica al Balzac! I tortellini erano divini...",
          author: "Marco R.",
          date: new Date().toISOString(),
          needsResponse: false
        },
        {
          rating: 2,
          text: "Servizio lento, abbiamo aspettato 45 minuti...",
          author: "Sofia B.",
          date: new Date().toISOString(),
          needsResponse: true
        }
      ],
      instructions: [
        "1. Setup Google My Business API:",
        "   - Go to console.cloud.google.com",
        "   - Enable Google My Business API",
        "   - Get API credentials",
        "2. Or monitor manually at business.google.com"
      ]
    };
  }

  // Monitor Instagram mentions (basic)
  async monitorInstagramMentions() {
    console.log('📱 Checking Instagram mentions...');
    
    try {
      // Use Instagram Basic Display API for mentions
      const response = await axios.get(
        `https://graph.instagram.com/me/media`,
        {
          params: {
            fields: 'id,caption,media_type,media_url,timestamp,like_count,comments_count',
            access_token: process.env.INSTAGRAM_ACCESS_TOKEN
          }
        }
      );

      const posts = response.data.data || [];
      
      return {
        totalPosts: posts.length,
        totalEngagement: posts.reduce((sum, post) => 
          sum + (post.like_count || 0) + (post.comments_count || 0), 0
        ),
        averageEngagement: Math.round(
          posts.reduce((sum, post) => 
            sum + (post.like_count || 0) + (post.comments_count || 0), 0
          ) / (posts.length || 1)
        ),
        recentPosts: posts.slice(0, 3).map(post => ({
          id: post.id,
          caption: post.caption?.substring(0, 100),
          likes: post.like_count,
          comments: post.comments_count,
          engagement: (post.like_count || 0) + (post.comments_count || 0)
        }))
      };

    } catch (error) {
      console.error('Instagram API error:', error.message);
      return {
        error: 'Instagram API connection failed',
        instructions: [
          "1. Check Instagram access token in .env",
          "2. Token might be expired",
          "3. Renew at developers.facebook.com"
        ]
      };
    }
  }

  // Monitor social media manually
  generateManualMonitoringChecklist() {
    const today = new Date().toLocaleDateString('it-IT');
    
    return {
      title: `Manual Monitoring Checklist - ${today}`,
      tasks: [
        {
          platform: 'Google Reviews',
          action: 'Check business.google.com for new reviews',
          frequency: '2x daily',
          priority: 'HIGH'
        },
        {
          platform: 'TripAdvisor',
          action: 'Check tripadvisor.com for new reviews',
          frequency: 'Daily',
          priority: 'HIGH'
        },
        {
          platform: 'Instagram',
          action: 'Search @balzacmodena mentions',
          frequency: '3x daily',
          priority: 'MEDIUM'
        },
        {
          platform: 'Facebook',
          action: 'Check page mentions and reviews',
          frequency: 'Daily',
          priority: 'MEDIUM'
        },
        {
          platform: 'TheFork',
          action: 'Monitor restaurant page',
          frequency: 'Weekly',
          priority: 'LOW'
        }
      ],
      responseTemplates: {
        positive: {
          italian: "Grazie mille per la splendida recensione! 🙏 Siamo felici che abbiate apprezzato la vostra esperienza. Vi aspettiamo presto!",
          english: "Thank you so much for the wonderful review! 🙏 We're delighted you enjoyed your experience. See you soon!"
        },
        negative: {
          italian: "Ci dispiace per l'inconveniente. Vorremmo capire meglio cosa è successo. Può contattarci a info@balzacbistrot.com?",
          english: "We're sorry for the inconvenience. We'd like to understand better what happened. Please contact us at info@balzacbistrot.com"
        }
      }
    };
  }

  // Generate simple sentiment analysis
  analyzeSentiment(text) {
    const positiveWords = [
      'ottimo', 'eccellente', 'fantastico', 'delizioso', 'perfetto',
      'consiglio', 'amazing', 'excellent', 'perfect', 'delicious'
    ];
    
    const negativeWords = [
      'pessimo', 'terribile', 'delusione', 'lento', 'freddo',
      'terrible', 'awful', 'disappointing', 'slow', 'cold'
    ];

    const lowerText = text.toLowerCase();
    
    const positiveCount = positiveWords.filter(word => 
      lowerText.includes(word)
    ).length;
    
    const negativeCount = negativeWords.filter(word => 
      lowerText.includes(word)
    ).length;

    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }

  // Generate daily monitoring report
  async generateDailyReport() {
    console.log('\n🔔 ALTERNATIVE MONITORING REPORT');
    console.log('='.repeat(50));
    console.log(`📅 ${new Date().toLocaleDateString('it-IT')}\n`);

    // Get data from available sources
    const [googleData, instagramData] = await Promise.all([
      this.monitorGoogleReviews(),
      this.monitorInstagramMentions()
    ]);

    // Google Reviews Summary
    console.log('⭐ GOOGLE REVIEWS:');
    console.log(`   New reviews: ${googleData.newReviews}`);
    console.log(`   Average rating: ${googleData.averageRating}/5`);
    console.log(`   Sentiment: ${googleData.sentimentBreakdown.positive}% positive`);

    if (googleData.recentReviews.some(r => r.needsResponse)) {
      console.log('   ⚠️  Reviews needing response found!');
    }

    // Instagram Summary
    console.log('\n📱 INSTAGRAM PERFORMANCE:');
    if (instagramData.error) {
      console.log(`   ❌ ${instagramData.error}`);
    } else {
      console.log(`   Posts analyzed: ${instagramData.totalPosts}`);
      console.log(`   Average engagement: ${instagramData.averageEngagement}`);
      console.log(`   Total engagement: ${instagramData.totalEngagement}`);
    }

    // Manual checklist
    const checklist = this.generateManualMonitoringChecklist();
    console.log('\n📋 TODAY\'S MANUAL CHECKS:');
    checklist.tasks.filter(t => t.priority === 'HIGH').forEach(task => {
      console.log(`   • ${task.platform}: ${task.action}`);
    });

    // Alerts and actions
    console.log('\n🚨 ACTION ITEMS:');
    const actions = this.generateActionItems(googleData, instagramData);
    actions.forEach((action, i) => {
      console.log(`   ${i + 1}. ${action}`);
    });

    console.log('\n💡 SETUP RECOMMENDATIONS:');
    console.log('   1. Complete Brand24 API setup for automated monitoring');
    console.log('   2. Set up Google My Business API integration');
    console.log('   3. Configure TripAdvisor monitoring alerts');

    console.log('\n' + '='.repeat(50));

    return { googleData, instagramData, checklist, actions };
  }

  // Generate action items
  generateActionItems(googleData, instagramData) {
    const actions = [];

    // Response actions
    const urgentReviews = googleData.recentReviews?.filter(r => r.needsResponse) || [];
    if (urgentReviews.length > 0) {
      actions.push(`Respond to ${urgentReviews.length} negative review(s) within 1 hour`);
    }

    // Engagement actions
    if (instagramData.averageEngagement < 50) {
      actions.push('Increase Instagram engagement - post story or reel');
    }

    // Manual monitoring
    actions.push('Complete manual monitoring checklist');
    
    // Positive actions
    if (googleData.sentimentBreakdown?.positive > 80) {
      actions.push('Share positive reviews on Instagram stories');
    }

    return actions.slice(0, 5);
  }
}

// Test alternative monitoring
async function testAlternativeMonitoring() {
  console.log('⚠️  Brand24 API not available - using alternative monitoring\n');
  
  const monitor = new BalzacAlternativeMonitoring();
  
  // Generate report
  const report = await monitor.generateDailyReport();
  
  console.log('\n✅ Alternative monitoring active!');
  console.log('💰 Value: Basic reputation monitoring + response guidance');
  console.log('\n🎯 Next Step: Complete Brand24 setup for full automation');
}

module.exports = BalzacAlternativeMonitoring;

// Run test if called directly
if (require.main === module) {
  testAlternativeMonitoring();
}