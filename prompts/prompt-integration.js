// Integrazione Prompt OpenAI con Analytics ROI in tempo reale
// Sistema completo per generazione contenuti ottimizzati

const { BalzacAdvancedPrompts } = require('./advanced-prompts.js');
const fs = require('fs');
const path = require('path');

class PromptIntegrationSystem {
  constructor() {
    this.promptGenerator = new BalzacAdvancedPrompts();
    this.menuData = this.loadMenuData();
  }

  loadMenuData() {
    try {
      const menuPath = path.join(process.cwd(), 'menu.json');
      return JSON.parse(fs.readFileSync(menuPath, 'utf8'));
    } catch (error) {
      console.error('Error loading menu data:', error);
      return this.getDefaultMenu();
    }
  }

  // ========================================
  // MAIN INTEGRATION FUNCTION
  // ========================================
  
  async generateOptimizedContent(mealType, additionalContext = {}) {
    try {
      console.log(`🎯 Generating optimized content for ${mealType}...`);
      
      // 1. Get real-time hashtag analytics
      const hashtagAnalytics = await this.getHashtagAnalytics(mealType);
      
      // 2. Get menu items for the meal type
      const menuItems = this.getMenuItems(mealType);
      
      // 3. Get time context
      const timeContext = this.getTimeContext();
      
      // 4. Generate optimized prompt based on meal type
      let result;
      switch (mealType) {
        case 'colazione':
          result = await this.promptGenerator.generateColazionePrompt(
            menuItems, 
            hashtagAnalytics, 
            timeContext
          );
          break;
        case 'pranzo':
          result = await this.promptGenerator.generatePranzoPrompt(
            menuItems, 
            hashtagAnalytics, 
            timeContext
          );
          break;
        case 'aperitivo':
          result = await this.promptGenerator.generateAperitivoPrompt(
            menuItems, 
            hashtagAnalytics, 
            timeContext
          );
          break;
        default:
          throw new Error(`Unsupported meal type: ${mealType}`);
      }
      
      // 5. Add analytics metadata
      result.analytics_data = {
        hashtag_strategy: hashtagAnalytics?.performance_summary?.best_performing_strategy,
        roi_score: hashtagAnalytics?.performance_summary?.best_roi_score,
        optimal_time: this.getOptimalPostingTime(hashtagAnalytics, mealType),
        engagement_prediction: this.predictEngagement(hashtagAnalytics),
        menu_items_used: menuItems,
        time_context: timeContext
      };
      
      console.log(`✅ Content generated successfully for ${mealType}`);
      return result;
      
    } catch (error) {
      console.error(`❌ Error generating content for ${mealType}:`, error);
      return this.getFallbackContent(mealType);
    }
  }

  // ========================================
  // ANALYTICS INTEGRATION
  // ========================================
  
  async getHashtagAnalytics(mealType) {
    try {
      // Call our advanced analytics endpoint
      const response = await fetch('http://localhost:3000/api/advanced-analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          meal_type: mealType,
          analysis_type: 'hashtag_roi',
          timeframe: 7
        })
      });
      
      if (!response.ok) {
        throw new Error(`Analytics API failed: ${response.status}`);
      }
      
      const data = await response.json();
      return data.results;
      
    } catch (error) {
      console.log(`⚠️ Analytics fallback for ${mealType}:`, error.message);
      return this.getFallbackAnalytics(mealType);
    }
  }

  // ========================================
  // MENU INTEGRATION
  // ========================================
  
  getMenuItems(mealType) {
    const menuItems = this.menuData[mealType] || {};
    
    // Add variety by rotating items
    if (menuItems.items && Array.isArray(menuItems.items)) {
      menuItems.items = this.shuffleArray(menuItems.items).slice(0, 3);
    }
    
    if (menuItems.beverages && Array.isArray(menuItems.beverages)) {
      menuItems.beverages = this.shuffleArray(menuItems.beverages).slice(0, 2);
    }
    
    if (menuItems.cocktails && Array.isArray(menuItems.cocktails)) {
      menuItems.cocktails = this.shuffleArray(menuItems.cocktails).slice(0, 3);
    }
    
    return menuItems;
  }

  // ========================================
  // TIME CONTEXT
  // ========================================
  
  getTimeContext() {
    const now = new Date();
    const hour = now.getHours();
    const day = now.getDay();
    const month = now.getMonth();
    
    return {
      current_hour: hour,
      day_of_week: this.getDayName(day),
      is_weekend: day === 0 || day === 6,
      season: this.getSeason(month),
      month_name: this.getMonthName(month),
      optimal_posting_time: this.getOptimalTimeForMealType(hour)
    };
  }

  getOptimalPostingTime(analytics, mealType) {
    if (analytics?.performance_summary?.optimal_posting_times) {
      return analytics.performance_summary.optimal_posting_times;
    }
    
    const defaultTimes = {
      colazione: '08:00',
      pranzo: '13:00', 
      aperitivo: '19:00'
    };
    
    return defaultTimes[mealType] || '12:00';
  }

  // ========================================
  // ENGAGEMENT PREDICTION
  // ========================================
  
  predictEngagement(analytics) {
    if (!analytics?.performance_summary) {
      return { level: 'medium', score: 50 };
    }
    
    const roiScore = analytics.performance_summary.best_roi_score || 50;
    
    if (roiScore > 70) {
      return { level: 'high', score: roiScore, prediction: 'Strong engagement expected' };
    } else if (roiScore > 40) {
      return { level: 'medium', score: roiScore, prediction: 'Moderate engagement expected' };
    } else {
      return { level: 'low', score: roiScore, prediction: 'Focus on content quality' };
    }
  }

  // ========================================
  // BATCH GENERATION FOR ALL MEAL TYPES
  // ========================================
  
  async generateAllMealTypes() {
    console.log('🚀 Generating optimized content for all meal types...');
    
    const results = {};
    const mealTypes = ['colazione', 'pranzo', 'aperitivo'];
    
    for (const mealType of mealTypes) {
      try {
        results[mealType] = await this.generateOptimizedContent(mealType);
        console.log(`✅ ${mealType} content generated`);
      } catch (error) {
        console.error(`❌ Failed to generate ${mealType} content:`, error);
        results[mealType] = { error: error.message };
      }
    }
    
    return {
      generated_at: new Date().toISOString(),
      results,
      summary: {
        successful: Object.keys(results).filter(key => !results[key].error).length,
        failed: Object.keys(results).filter(key => results[key].error).length
      }
    };
  }

  // ========================================
  // UTILITY METHODS
  // ========================================
  
  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  getDayName(day) {
    const days = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
    return days[day];
  }

  getSeason(month) {
    if (month >= 2 && month <= 4) return 'primavera';
    if (month >= 5 && month <= 7) return 'estate';
    if (month >= 8 && month <= 10) return 'autunno';
    return 'inverno';
  }

  getMonthName(month) {
    const months = [
      'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
      'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
    ];
    return months[month];
  }

  getOptimalTimeForMealType(currentHour) {
    if (currentHour >= 7 && currentHour <= 10) return 'colazione';
    if (currentHour >= 11 && currentHour <= 15) return 'pranzo';
    if (currentHour >= 17 && currentHour <= 21) return 'aperitivo';
    return 'general';
  }

  // ========================================
  // FALLBACK DATA
  // ========================================
  
  getFallbackContent(mealType) {
    const fallbackCaptions = {
      colazione: "Inizia la giornata con i nostri cornetti francesi appena sfornati ☕ #balzacbistrot #modenacaffe #colazione",
      pranzo: "Tortellini fatti a mano nella tradizione emiliana 🍝 #balzacbistrot #tortellinimodena #cucinaemiliana", 
      aperitivo: "L'aperitivo perfetto con vista su Piazza Grande 🍸 #balzacbistrot #aperitivomodena #piazzagrande"
    };
    
    return {
      caption: fallbackCaptions[mealType] || fallbackCaptions.aperitivo,
      meal_type: mealType,
      generated_at: new Date().toISOString(),
      is_fallback: true,
      analytics_data: {
        hashtag_strategy: 'fallback',
        roi_score: 0,
        optimal_time: this.getOptimalPostingTime(null, mealType)
      }
    };
  }

  getFallbackAnalytics(mealType) {
    return {
      performance_summary: {
        best_performing_strategy: 'local_niche',
        best_roi_score: 60,
        overall_recommendation: `Fallback recommendation for ${mealType}`
      },
      recommended_strategy: {
        ultra_niche: ['balzacbistrot', `${mealType}modena`],
        local_niche: ['modena', 'modenafood'],
        medium_engagement: [mealType, 'italianfood'],
        high_reach: ['food', 'restaurant']
      }
    };
  }

  getDefaultMenu() {
    return {
      colazione: {
        items: [
          { name: 'Cornetti Francesi', description: 'Sfornati al momento' },
          { name: 'Pain au Chocolat', description: 'Con cioccolato fondente' }
        ],
        beverages: [
          { name: 'Cappuccino' },
          { name: 'Caffè Americano' }
        ]
      },
      pranzo: {
        items: [
          { name: 'Tortellini in Brodo', description: 'Ricetta della tradizione' },
          { name: 'Tagliatelle al Ragù', description: 'Con ragù di mora romagnola' }
        ]
      },
      aperitivo: {
        items: [
          { name: 'Tagliere Opus Nera', description: 'Salumi di suino nero casertano' }
        ],
        cocktails: [
          { name: 'Spritz Balzac' },
          { name: 'Negroni' }
        ]
      }
    };
  }
}

module.exports = { PromptIntegrationSystem };