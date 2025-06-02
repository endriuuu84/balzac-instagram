// Test Balzac Webhook + Setup Cron-job.org
require('dotenv').config();
const axios = require('axios');

class BalzacWebhookTester {
  constructor() {
    this.webhookUrl = 'https://hook.eu2.make.com/ouiitebpjbbqlhn5xpfxzvsivfx5i0l9';
    
    this.mealSchedule = {
      colazione: {
        time: '08:00',
        cron: '0 8 * * *',
        dishes: ['Cornetto e cappuccino', 'Maritozzo', 'Bombolone alla crema'],
        hashtags: '#colazionemodena #cappuccino #cornetto #buongiorno',
        mood: 'energetic_morning'
      },
      pranzo: {
        time: '13:00', 
        cron: '0 13 * * *',
        dishes: ['Tortellini in brodo', 'Tagliatelle al ragù', 'Cotoletta milanese'],
        hashtags: '#pranzomodena #tortellini #cucinaitaliana #tagliatelle',
        mood: 'traditional_lunch'
      },
      aperitivo: {
        time: '18:00',
        cron: '0 18 * * *', 
        dishes: ['Spritz', 'Aperol', 'Negroni', 'Tagliere salumi'],
        hashtags: '#aperitivomodena #spritz #aperol #socialdrinks',
        mood: 'social_evening'
      }
    };
  }

  // Test webhook connection
  async testWebhook() {
    console.log('🔗 Testing Balzac webhook...');
    console.log(`URL: ${this.webhookUrl}\n`);

    try {
      const testPayload = {
        test: true,
        restaurant: 'Balzac Bistrot',
        location: 'Modena, Italy',
        timestamp: new Date().toISOString(),
        message: 'Webhook connection test'
      };

      const response = await axios.post(this.webhookUrl, testPayload, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 15000
      });

      console.log('✅ Webhook connection SUCCESSFUL!');
      console.log(`Status: ${response.status}`);
      console.log(`Response:`, response.data);
      
      return true;

    } catch (error) {
      console.error('❌ Webhook connection FAILED:', error.message);
      
      if (error.response) {
        console.error(`Status: ${error.response.status}`);
        console.error(`Data:`, error.response.data);
      }
      
      return false;
    }
  }

  // Test meal-specific triggers
  async testMealTriggers() {
    console.log('🍽️ Testing meal-specific triggers...\n');

    for (const [mealType, config] of Object.entries(this.mealSchedule)) {
      console.log(`⏰ Testing ${mealType} trigger (${config.time})...`);
      
      try {
        const payload = {
          trigger: 'scheduled_post',
          meal_type: mealType,
          time: config.time,
          dish: this.getRandomDish(config.dishes),
          hashtags: config.hashtags,
          mood: config.mood,
          restaurant: {
            name: 'Balzac Bistrot',
            location: 'Modena, Italy',
            instagram: '@balzacmodena'
          },
          timestamp: new Date().toISOString()
        };

        const response = await axios.post(this.webhookUrl, payload, {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 15000
        });

        console.log(`✅ ${mealType} trigger successful!`);
        console.log(`   Dish: ${payload.dish}`);
        console.log(`   Status: ${response.status}`);
        
      } catch (error) {
        console.error(`❌ ${mealType} trigger failed:`, error.message);
      }
      
      // Delay between tests
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  // Generate cron-job.org configuration
  generateCronJobs() {
    const jobs = [];
    
    Object.entries(this.mealSchedule).forEach(([mealType, config]) => {
      jobs.push({
        title: `Balzac ${mealType.charAt(0).toUpperCase() + mealType.slice(1)} Post`,
        url: this.webhookUrl,
        schedule: config.cron,
        timezone: 'Europe/Rome',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: {
          trigger: 'scheduled_post',
          meal_type: mealType,
          time: config.time,
          hashtags: config.hashtags,
          mood: config.mood,
          restaurant: {
            name: 'Balzac Bistrot',
            location: 'Modena, Italy',
            instagram: '@balzacmodena'
          }
        }
      });
    });

    return jobs;
  }

  // Generate setup instructions for cron-job.org
  generateCronSetupInstructions() {
    const jobs = this.generateCronJobs();
    
    return {
      service: 'cron-job.org',
      url: 'https://cron-job.org',
      cost: 'FREE forever',
      steps: [
        '1. 🌐 Vai su https://cron-job.org',
        '2. 📝 Registrati (account gratuito)',
        '3. ✅ Verifica email',
        '4. 🔗 Login al dashboard',
        '5. ➕ Click "Create cronjob"',
        '',
        '📋 CREA 3 CRONJOB:',
        '',
        '🌅 JOB 1 - COLAZIONE:',
        `   Title: ${jobs[0].title}`,
        `   URL: ${jobs[0].url}`,
        `   Schedule: ${jobs[0].schedule} (Every day at 08:00)`,
        `   Timezone: ${jobs[0].timezone}`,
        `   Method: ${jobs[0].method}`,
        `   Headers: Content-Type: application/json`,
        `   Body: ${JSON.stringify(jobs[0].body, null, 2)}`,
        '',
        '🍝 JOB 2 - PRANZO:',
        `   Title: ${jobs[1].title}`,
        `   URL: ${jobs[1].url}`,
        `   Schedule: ${jobs[1].schedule} (Every day at 13:00)`,
        `   Timezone: ${jobs[1].timezone}`,
        `   Method: ${jobs[1].method}`,
        `   Headers: Content-Type: application/json`,
        `   Body: ${JSON.stringify(jobs[1].body, null, 2)}`,
        '',
        '🍸 JOB 3 - APERITIVO:',
        `   Title: ${jobs[2].title}`,
        `   URL: ${jobs[2].url}`,
        `   Schedule: ${jobs[2].schedule} (Every day at 18:00)`,
        `   Timezone: ${jobs[2].timezone}`,
        `   Method: ${jobs[2].method}`,
        `   Headers: Content-Type: application/json`,
        `   Body: ${JSON.stringify(jobs[2].body, null, 2)}`,
        '',
        '6. 💾 Save tutti e tre i job',
        '7. ✅ Enable tutti i job',
        '8. 🧪 Test manuale di ogni job',
        '9. 📊 Monitor execution logs',
        '10. 🚀 Enjoy automation!'
      ]
    };
  }

  // Get random dish
  getRandomDish(dishes) {
    return dishes[Math.floor(Math.random() * dishes.length)];
  }

  // Run comprehensive test
  async runFullTest() {
    console.log('🚀 BALZAC WEBHOOK TESTING SUITE');
    console.log('='.repeat(60));
    console.log(`📅 ${new Date().toLocaleDateString('it-IT')}`);
    console.log(`🕐 ${new Date().toLocaleTimeString('it-IT')}\n`);

    // Test 1: Basic connection
    console.log('TEST 1: Basic Webhook Connection');
    console.log('-'.repeat(40));
    const connectionTest = await this.testWebhook();
    
    console.log('\n');

    // Test 2: Meal triggers  
    if (connectionTest) {
      console.log('TEST 2: Meal-Specific Triggers');
      console.log('-'.repeat(40));
      await this.testMealTriggers();
    } else {
      console.log('⚠️ Skipping meal tests - connection failed');
    }

    // Generate setup instructions
    console.log('\n');
    console.log('📋 CRON-JOB.ORG SETUP INSTRUCTIONS');
    console.log('='.repeat(60));
    
    const instructions = this.generateCronSetupInstructions();
    instructions.steps.forEach(step => {
      console.log(step);
    });

    console.log('\n💡 BENEFITS:');
    console.log('✅ 100% FREE forever');
    console.log('✅ More reliable than Make.com schedule');
    console.log('✅ Easy monitoring and debugging');
    console.log('✅ No Make.com operations used for timing');
    console.log('✅ Perfect timing accuracy');

    console.log('\n🎯 NEXT STEPS:');
    console.log('1. Complete Make.com workflow (OpenAI + Leonardo + Instagram)');
    console.log('2. Setup cron-job.org with instructions above');
    console.log('3. Test one job manually on cron-job.org');
    console.log('4. Enable all 3 jobs');
    console.log('5. Monitor first automated run tomorrow!');

    console.log('\n🚀 READY TO AUTOMATE BALZAC INSTAGRAM!');
    
    return {
      connectionTest,
      instructions,
      webhookUrl: this.webhookUrl
    };
  }
}

// Run test
async function testBalzacWebhook() {
  const tester = new BalzacWebhookTester();
  return await tester.runFullTest();
}

module.exports = BalzacWebhookTester;

// Run if called directly
if (require.main === module) {
  testBalzacWebhook();
}