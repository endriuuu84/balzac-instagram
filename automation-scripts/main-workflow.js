// Balzac Bistrot Instagram Automation - Main Workflow
// Integrates all 7 platforms for complete automation

require('dotenv').config();
const schedule = require('node-schedule');

// Platform integrations
const InstagramAPI = require('./platforms/instagram-api');
const OpenAIGenerator = require('./platforms/openai-generator');
const LeonardoVisuals = require('./platforms/leonardo-visuals');
const HootsuiteAnalytics = require('./platforms/hootsuite-analytics');
const ApifyScraper = require('./platforms/apify-scraper');
const Brand24Monitor = require('./platforms/brand24-monitor');
const MakeAutomation = require('./platforms/make-automation');

// Main automation class
class BalzacInstagramAutomation {
  constructor() {
    this.config = {
      restaurant: 'Balzac Bistrot',
      location: 'Modena, Italy',
      style: 'Elegant Italian Bistrot with Modern Twist',
      hashtags: {
        core: ['#BalzacBistrot', '#ModenaFood', '#BistrotItaliano'],
        location: ['#Modena', '#EmiliaRomagna', '#ItalianCuisine']
      }
    };
    
    // Initialize all platforms
    this.instagram = new InstagramAPI(process.env.INSTAGRAM_ACCESS_TOKEN);
    this.openai = new OpenAIGenerator(process.env.OPENAI_API_KEY);
    this.leonardo = new LeonardoVisuals(process.env.LEONARDO_API_KEY);
    this.hootsuite = new HootsuiteAnalytics(process.env.HOOTSUITE_API_KEY);
    this.apify = new ApifyScraper(process.env.APIFY_TOKEN);
    this.brand24 = new Brand24Monitor(process.env.BRAND24_API_KEY);
    this.make = new MakeAutomation(process.env.MAKE_API_KEY);
  }
  
  // Schedule daily posts
  initializeSchedule() {
    // Breakfast post - 7:30 AM
    schedule.scheduleJob('30 7 * * *', () => {
      this.createAndPublishPost('breakfast', this.getBreakfastMenu());
    });
    
    // Lunch post - 12:00 PM
    schedule.scheduleJob('0 12 * * *', () => {
      this.createAndPublishPost('lunch', this.getLunchMenu());
    });
    
    // Aperitivo post - 6:00 PM
    schedule.scheduleJob('0 18 * * *', () => {
      this.createAndPublishPost('aperitivo', this.getAperitivoMenu());
    });
    
    // Daily analytics - 8:00 PM
    schedule.scheduleJob('0 20 * * *', () => {
      this.runDailyAnalytics();
    });
  }
  
  // Main workflow for creating and publishing posts
  async createAndPublishPost(mealType, menuItem) {
    try {
      console.log(`🚀 Starting ${mealType} post creation for ${menuItem}`);
      
      // Step 1: Get trending hashtags
      const trendingHashtags = await this.apify.getTrendingHashtags(mealType);
      console.log('📱 Trending hashtags:', trendingHashtags);
      
      // Step 2: Check competitor activity
      const competitorInsights = await this.apify.analyzeCompetitors(mealType);
      console.log('🔍 Competitor insights:', competitorInsights);
      
      // Step 3: Generate caption with GPT-4
      const caption = await this.openai.generateCaption({
        mealType,
        dish: menuItem,
        style: this.config.style,
        insights: competitorInsights,
        hashtags: [...this.config.hashtags.core, ...trendingHashtags]
      });
      console.log('✍️ Generated caption:', caption);
      
      // Step 4: Generate image with Leonardo.ai
      const imageUrl = await this.leonardo.generateFoodImage({
        dish: menuItem,
        mealType,
        ambiance: 'elegant bistrot italiano',
        lighting: this.getLightingForTime(mealType)
      });
      console.log('🎨 Generated image:', imageUrl);
      
      // Step 5: Get optimal posting time from Hootsuite
      const optimalTime = await this.hootsuite.getOptimalPostingTime(mealType);
      console.log('⏰ Optimal posting time:', optimalTime);
      
      // Step 6: Publish to Instagram
      const post = await this.instagram.publishPost({
        imageUrl,
        caption,
        scheduledTime: optimalTime
      });
      console.log('✅ Post published:', post.id);
      
      // Step 7: Monitor initial performance
      setTimeout(async () => {
        const performance = await this.hootsuite.getPostPerformance(post.id);
        console.log('📊 Initial performance:', performance);
        
        // If performing well, boost it
        if (performance.engagementRate > 5) {
          await this.handleViralContent(post.id);
        }
      }, 3600000); // Check after 1 hour
      
      // Step 8: Set up monitoring
      await this.brand24.monitorPost(post.id);
      
      return post;
      
    } catch (error) {
      console.error('❌ Error in workflow:', error);
      await this.handleError(error, mealType, menuItem);
    }
  }
  
  // Daily analytics and reporting
  async runDailyAnalytics() {
    console.log('📊 Running daily analytics...');
    
    const analytics = {
      posts: await this.instagram.getDailyPosts(),
      performance: await this.hootsuite.getDailyPerformance(),
      mentions: await this.brand24.getDailyMentions(),
      competitors: await this.apify.getCompetitorSummary(),
      sentiment: await this.brand24.getSentimentAnalysis()
    };
    
    // Generate insights
    const insights = await this.openai.generateDailyInsights(analytics);
    
    // Send report
    await this.sendDailyReport(analytics, insights);
    
    // Plan tomorrow's content
    await this.planTomorrowContent(insights);
  }
  
  // Helper methods
  getBreakfastMenu() {
    const items = [
      'Cappuccino e Cornetto alla Crema',
      'French Toast con Frutti di Bosco',
      'Uova Benedict alla Modenese',
      'Pancakes con Sciroppo d\'Acero',
      'Croissant Salato con Prosciutto di Modena'
    ];
    return items[Math.floor(Math.random() * items.length)];
  }
  
  getLunchMenu() {
    const items = [
      'Tortellini in Brodo della Tradizione',
      'Tagliatelle al Ragù Bolognese',
      'Risotto all\'Aceto Balsamico',
      'Gnocco Fritto con Salumi DOP',
      'Lasagne Verdi alla Bolognese'
    ];
    return items[Math.floor(Math.random() * items.length)];
  }
  
  getAperitivoMenu() {
    const items = [
      'Spritz Balzac con Vista su Piazza Grande',
      'Lambrusco Selection con Parmigiano 36 Mesi',
      'Cocktail della Casa con Finger Food',
      'Tigelle con Salumi e Formaggi Locali',
      'Aperitivo Gourmet con Specialità Emiliane'
    ];
    return items[Math.floor(Math.random() * items.length)];
  }
  
  getLightingForTime(mealType) {
    const lighting = {
      breakfast: 'warm morning sunlight through window',
      lunch: 'bright natural daylight',
      aperitivo: 'golden hour warm ambiance'
    };
    return lighting[mealType] || 'professional studio lighting';
  }
  
  async handleViralContent(postId) {
    console.log('🚀 Post going viral! Boosting engagement...');
    
    // Create story
    const story = await this.instagram.createStory({
      postId,
      text: 'Il nostro post sta spopolando! 🔥'
    });
    
    // Alert team
    await this.sendAlert('Viral Content Alert', {
      postId,
      message: 'Post exceeding expectations - consider paid promotion'
    });
  }
  
  async handleError(error, mealType, menuItem) {
    // Log error
    console.error('Error details:', error);
    
    // Use backup content
    const backupCaption = this.getBackupCaption(mealType, menuItem);
    const backupImage = this.getBackupImage(mealType);
    
    // Try to post backup content
    try {
      await this.instagram.publishPost({
        imageUrl: backupImage,
        caption: backupCaption
      });
      console.log('✅ Backup content posted successfully');
    } catch (backupError) {
      console.error('❌ Backup post also failed:', backupError);
      await this.sendAlert('Critical Error', {
        error: error.message,
        mealType,
        menuItem
      });
    }
  }
  
  getBackupCaption(mealType, menuItem) {
    const backups = {
      breakfast: `Buongiorno da Balzac! ☕ Inizia la giornata con ${menuItem} #BalzacBistrot #ModenaBreakfast`,
      lunch: `Pranzo della tradizione al Balzac 🍝 Oggi: ${menuItem} #ModenaFood #ItalianLunch`,
      aperitivo: `È l'ora dell'aperitivo! 🥂 ${menuItem} vi aspetta #AperitivoModena #BalzacMoment`
    };
    return backups[mealType];
  }
  
  getBackupImage(mealType) {
    // Return pre-uploaded backup images
    const backupImages = {
      breakfast: 'https://balzac-cdn.com/backup/breakfast-generic.jpg',
      lunch: 'https://balzac-cdn.com/backup/lunch-generic.jpg',
      aperitivo: 'https://balzac-cdn.com/backup/aperitivo-generic.jpg'
    };
    return backupImages[mealType];
  }
  
  async sendDailyReport(analytics, insights) {
    const report = {
      date: new Date().toLocaleDateString('it-IT'),
      summary: {
        postsPublished: analytics.posts.length,
        totalEngagement: analytics.performance.totalEngagement,
        followerGrowth: analytics.performance.followerGrowth,
        sentiment: analytics.sentiment.overall
      },
      insights: insights,
      recommendations: await this.generateRecommendations(analytics)
    };
    
    // Send via email or Slack
    console.log('📧 Daily Report:', report);
  }
  
  async planTomorrowContent(insights) {
    const tomorrowPlan = await this.openai.planContent({
      insights,
      dayOfWeek: new Date().getDay() + 1,
      season: this.getCurrentSeason(),
      upcomingEvents: await this.getUpcomingEvents()
    });
    
    console.log('📅 Tomorrow\'s content plan:', tomorrowPlan);
    
    // Store plan for tomorrow's execution
    await this.savePlan(tomorrowPlan);
  }
  
  async generateRecommendations(analytics) {
    const recommendations = [];
    
    // Check engagement rates
    if (analytics.performance.engagementRate < 3) {
      recommendations.push('Consider more interactive content (polls, questions)');
    }
    
    // Check posting times
    if (analytics.performance.bestTime !== this.currentPostingTime) {
      recommendations.push(`Shift posting time to ${analytics.performance.bestTime}`);
    }
    
    // Check competitor performance
    if (analytics.competitors.averageEngagement > analytics.performance.totalEngagement) {
      recommendations.push('Analyze competitor top posts for inspiration');
    }
    
    return recommendations;
  }
  
  getCurrentSeason() {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    if (month >= 8 && month <= 10) return 'autumn';
    return 'winter';
  }
  
  async getUpcomingEvents() {
    // Check local Modena events
    return [
      'Modena Food Festival',
      'Piazza Grande Evening Market',
      'Wine Tasting Week'
    ];
  }
  
  async sendAlert(title, data) {
    // Send to configured notification channels
    console.log(`🚨 ALERT: ${title}`, data);
  }
  
  async savePlan(plan) {
    // Save to database or file system
    console.log('💾 Saving plan for tomorrow:', plan);
  }
}

// Initialize and start the automation
const automation = new BalzacInstagramAutomation();
automation.initializeSchedule();

console.log('🚀 Balzac Instagram Automation Started!');
console.log('📅 Scheduled posts:');
console.log('  - Breakfast: 7:30 AM');
console.log('  - Lunch: 12:00 PM');
console.log('  - Aperitivo: 6:00 PM');
console.log('  - Analytics: 8:00 PM');

// Export for testing
module.exports = BalzacInstagramAutomation;