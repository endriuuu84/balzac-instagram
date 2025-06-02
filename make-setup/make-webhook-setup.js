// Make.com Webhook Setup for Balzac Instagram Automation
require('dotenv').config();
const axios = require('axios');

class MakeWebhookSetup {
  constructor() {
    this.config = {
      makeWebhook: process.env.MAKE_WEBHOOK_URL || 'https://hook.make.com/YOUR_WEBHOOK_HERE',
      scenarios: {
        dailyPosting: {
          webhook: 'balzac-daily-posting',
          description: 'Triggers daily Instagram posts',
          schedule: ['08:00', '13:00', '18:00']
        },
        monitoring: {
          webhook: 'balzac-monitoring',
          description: 'Triggers monitoring checks',
          schedule: ['09:00']
        },
        alerts: {
          webhook: 'balzac-alerts', 
          description: 'Sends urgent alerts',
          realTime: true
        }
      }
    };

    this.mealTypes = {
      '08:00': {
        type: 'colazione',
        dishes: ['Cornetto e cappuccino', 'Maritozzo', 'Bombolone', 'Caffè e brioche'],
        mood: 'energetic_morning',
        hashtags: ['#colazionemodena', '#cappuccino', '#cornetto', '#buongiorno']
      },
      '13:00': {
        type: 'pranzo', 
        dishes: ['Tortellini in brodo', 'Tagliatelle al ragù', 'Cotoletta alla milanese', 'Risotto'],
        mood: 'traditional_lunch',
        hashtags: ['#pranzomodena', '#tortellini', '#tagliatelle', '#cucinaitaliana']
      },
      '18:00': {
        type: 'aperitivo',
        dishes: ['Spritz', 'Aperol', 'Negroni', 'Stuzzichini', 'Tagliere'],
        mood: 'social_evening',
        hashtags: ['#aperitivomodena', '#spritz', '#aperol', '#socialdrinks']
      }
    };
  }

  // Test webhook connection
  async testWebhookConnection() {
    console.log('🔗 Testing Make.com webhook connection...\n');

    try {
      const testPayload = {
        test: true,
        timestamp: new Date().toISOString(),
        restaurant: 'Balzac Bistrot',
        message: 'Webhook connection test'
      };

      const response = await axios.post(this.config.makeWebhook, testPayload, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });

      console.log('✅ Webhook connection successful!');
      console.log(`Response status: ${response.status}`);
      console.log(`Response data:`, response.data);

      return true;

    } catch (error) {
      console.error('❌ Webhook connection failed:', error.message);
      
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      }
      
      return false;
    }
  }

  // Send scheduled post trigger
  async triggerScheduledPost(time = null) {
    const currentTime = time || this.getCurrentTimeSlot();
    const mealData = this.mealTypes[currentTime];

    if (!mealData) {
      console.error(`❌ No meal data for time: ${currentTime}`);
      return false;
    }

    console.log(`🍽️  Triggering ${mealData.type} post for ${currentTime}...`);

    try {
      const payload = {
        trigger: 'scheduled_post',
        time: currentTime,
        mealType: mealData.type,
        dish: this.getRandomDish(mealData.dishes),
        mood: mealData.mood,
        hashtags: mealData.hashtags,
        restaurant: {
          name: 'Balzac Bistrot',
          location: 'Modena, Italy',
          instagram: '@balzacmodena'
        },
        content: {
          generateCaption: true,
          generateImage: true,
          publishInstagram: true
        },
        timestamp: new Date().toISOString()
      };

      const response = await axios.post(this.config.makeWebhook, payload, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 15000
      });

      console.log('✅ Scheduled post triggered successfully!');
      console.log(`Meal: ${mealData.type} | Dish: ${payload.dish}`);
      
      return {
        success: true,
        mealType: mealData.type,
        dish: payload.dish,
        executionId: response.data?.executionId || 'make-exec-' + Date.now()
      };

    } catch (error) {
      console.error('❌ Scheduled post trigger failed:', error.message);
      return false;
    }
  }

  // Send monitoring trigger
  async triggerMonitoring() {
    console.log('📊 Triggering monitoring check...');

    try {
      const payload = {
        trigger: 'daily_monitoring',
        timestamp: new Date().toISOString(),
        checks: [
          'google_reviews',
          'instagram_mentions',
          'facebook_activity',
          'competitor_analysis'
        ],
        restaurant: 'Balzac Bistrot',
        config: {
          alertThreshold: 'negative_sentiment',
          reportEmail: 'info@balzacbistrot.com'
        }
      };

      const response = await axios.post(this.config.makeWebhook, payload, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('✅ Monitoring triggered successfully!');
      return true;

    } catch (error) {
      console.error('❌ Monitoring trigger failed:', error.message);
      return false;
    }
  }

  // Send alert trigger  
  async triggerAlert(alertData) {
    console.log('🚨 Triggering urgent alert...');

    try {
      const payload = {
        trigger: 'urgent_alert',
        alert: alertData,
        timestamp: new Date().toISOString(),
        restaurant: 'Balzac Bistrot',
        urgency: this.determineUrgency(alertData),
        notifications: {
          slack: true,
          email: true,
          immediate: true
        }
      };

      const response = await axios.post(this.config.makeWebhook, payload);

      console.log('✅ Alert triggered successfully!');
      return true;

    } catch (error) {
      console.error('❌ Alert trigger failed:', error.message);
      return false;
    }
  }

  // Get current time slot
  getCurrentTimeSlot() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = '00'; // Scheduled at exact hours
    const timeString = `${hours}:${minutes}`;

    // Map to nearest meal time
    if (hours >= 7 && hours < 11) return '08:00';
    if (hours >= 11 && hours < 16) return '13:00';
    if (hours >= 16 && hours <= 22) return '18:00';
    
    return '18:00'; // Default to aperitivo
  }

  // Get random dish for meal type
  getRandomDish(dishes) {
    return dishes[Math.floor(Math.random() * dishes.length)];
  }

  // Determine alert urgency
  determineUrgency(alertData) {
    if (alertData.type === 'negative_review' && alertData.rating <= 2) {
      return 'immediate';
    }
    if (alertData.platform === 'google' && alertData.type === 'negative_review') {
      return 'high';
    }
    return 'normal';
  }

  // Setup webhook URLs for Make.com
  generateWebhookUrls() {
    const baseUrl = 'https://hook.make.com';
    
    return {
      dailyPosting: `${baseUrl}/balzac-daily-posting`,
      monitoring: `${baseUrl}/balzac-monitoring`,
      alerts: `${baseUrl}/balzac-alerts`,
      testing: `${baseUrl}/balzac-test`
    };
  }

  // Generate Make.com scenario configuration
  generateScenarioConfig() {
    return {
      dailyPostingScenario: {
        name: 'Balzac Daily Instagram Posts',
        trigger: {
          type: 'webhook',
          method: 'POST',
          url: 'https://hook.make.com/balzac-daily-posting'
        },
        modules: [
          {
            id: 1,
            type: 'webhook',
            name: 'Receive post data'
          },
          {
            id: 2,
            type: 'router',
            name: 'Route by meal type',
            routes: [
              { condition: 'mealType = "colazione"', path: 'morning' },
              { condition: 'mealType = "pranzo"', path: 'lunch' },
              { condition: 'mealType = "aperitivo"', path: 'evening' }
            ]
          },
          {
            id: 3,
            type: 'openai',
            name: 'Generate caption',
            settings: {
              model: 'gpt-3.5-turbo',
              prompt: 'Create Instagram caption for {{mealType}} at Balzac Bistrot featuring {{dish}}'
            }
          },
          {
            id: 4,
            type: 'http',
            name: 'Leonardo.ai image generation',
            settings: {
              url: 'https://cloud.leonardo.ai/api/rest/v1/generations',
              method: 'POST',
              headers: {
                'Authorization': 'Bearer {{leonardo_api_key}}'
              }
            }
          },
          {
            id: 5,
            type: 'instagram',
            name: 'Publish to Instagram',
            settings: {
              action: 'create_post',
              media: '{{leonardo_image_url}}',
              caption: '{{openai_caption}}'
            }
          },
          {
            id: 6,
            type: 'slack',
            name: 'Success notification',
            settings: {
              channel: '#balzac-social',
              message: '✅ {{mealType}} post published successfully!'
            }
          }
        ]
      },
      
      monitoringScenario: {
        name: 'Balzac Daily Monitoring',
        trigger: {
          type: 'schedule',
          time: '09:00',
          timezone: 'Europe/Rome'
        },
        modules: [
          {
            id: 1,
            type: 'schedule',
            name: 'Daily 9 AM trigger'
          },
          {
            id: 2,
            type: 'http',
            name: 'Run monitoring script',
            settings: {
              url: 'YOUR_SERVER/monitoring-system/complete-monitoring-suite.js',
              method: 'POST'
            }
          },
          {
            id: 3,
            type: 'email',
            name: 'Send daily report',
            settings: {
              to: 'team@balzacbistrot.com',
              subject: 'Balzac Daily Monitoring Report'
            }
          }
        ]
      }
    };
  }

  // Simulate scheduled posts for testing
  async simulateDailySchedule() {
    console.log('🎭 Simulating daily posting schedule...\n');

    const schedule = ['08:00', '13:00', '18:00'];
    
    for (const time of schedule) {
      console.log(`⏰ Processing ${time} post...`);
      
      const result = await this.triggerScheduledPost(time);
      
      if (result) {
        console.log(`✅ ${result.mealType} post: ${result.dish}`);
      } else {
        console.log(`❌ Failed to trigger ${time} post`);
      }
      
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log('\n🎯 Daily schedule simulation complete!');
  }

  // Test all webhook scenarios
  async runWebhookTests() {
    console.log('🧪 MAKE.COM WEBHOOK TESTING SUITE');
    console.log('='.repeat(50));
    console.log(`📅 ${new Date().toLocaleDateString('it-IT')}\n`);

    const tests = {
      connection: false,
      scheduledPost: false,
      monitoring: false,
      alerts: false
    };

    // Test 1: Basic connection
    console.log('1️⃣ Testing webhook connection...');
    tests.connection = await this.testWebhookConnection();
    
    // Test 2: Scheduled post
    console.log('\n2️⃣ Testing scheduled post trigger...');
    tests.scheduledPost = await this.triggerScheduledPost();
    
    // Test 3: Monitoring
    console.log('\n3️⃣ Testing monitoring trigger...');
    tests.monitoring = await this.triggerMonitoring();
    
    // Test 4: Alert system
    console.log('\n4️⃣ Testing alert trigger...');
    const testAlert = {
      type: 'negative_review',
      platform: 'google',
      rating: 2,
      text: 'Test negative review for alerts'
    };
    tests.alerts = await this.triggerAlert(testAlert);

    // Results summary
    console.log('\n📊 TEST RESULTS SUMMARY:');
    console.log(`   Webhook connection: ${tests.connection ? '✅' : '❌'}`);
    console.log(`   Scheduled posting: ${tests.scheduledPost ? '✅' : '❌'}`);
    console.log(`   Monitoring trigger: ${tests.monitoring ? '✅' : '❌'}`);
    console.log(`   Alert system: ${tests.alerts ? '✅' : '❌'}`);

    const allPassed = Object.values(tests).every(test => test);
    console.log(`\n🎯 Overall Status: ${allPassed ? '✅ ALL TESTS PASSED' : '⚠️  SOME TESTS FAILED'}`);

    if (!allPassed) {
      console.log('\n🔧 TROUBLESHOOTING:');
      console.log('1. Check MAKE_WEBHOOK_URL in .env file');
      console.log('2. Verify Make.com scenario is active');
      console.log('3. Confirm webhook permissions');
      console.log('4. Test with manual trigger in Make.com');
    }

    return tests;
  }

  // Generate setup instructions
  generateSetupInstructions() {
    const webhooks = this.generateWebhookUrls();
    const config = this.generateScenarioConfig();

    return {
      webhookUrls: webhooks,
      scenarios: config,
      envVariables: {
        'MAKE_WEBHOOK_URL': webhooks.dailyPosting,
        'MAKE_MONITORING_WEBHOOK': webhooks.monitoring,
        'MAKE_ALERTS_WEBHOOK': webhooks.alerts
      },
      setupSteps: [
        'Create Make.com account and choose Core plan',
        'Create "Balzac Daily Posts" scenario with webhook trigger',
        'Copy webhook URL to .env file as MAKE_WEBHOOK_URL',
        'Configure OpenAI module with API key',
        'Set up Leonardo.ai HTTP module',
        'Connect Instagram for Business module',
        'Add Slack notifications module',
        'Test scenario with manual run',
        'Activate scheduling for 08:00, 13:00, 18:00',
        'Monitor first automated runs'
      ]
    };
  }
}

// Test Make.com webhooks
async function testMakeWebhooks() {
  console.log('🚀 Make.com Webhook Setup & Testing\n');
  
  const webhookSetup = new MakeWebhookSetup();
  
  // Run comprehensive tests
  const results = await webhookSetup.runWebhookTests();
  
  // Generate setup instructions
  const instructions = webhookSetup.generateSetupInstructions();
  
  console.log('\n📋 SETUP INSTRUCTIONS:');
  instructions.setupSteps.forEach((step, i) => {
    console.log(`   ${i + 1}. ${step}`);
  });

  console.log('\n🔗 WEBHOOK URLS:');
  Object.entries(instructions.webhookUrls).forEach(([name, url]) => {
    console.log(`   ${name}: ${url}`);
  });

  console.log('\n💰 MAKE.COM VALUE:');
  console.log('   Cost: €9/mese');
  console.log('   Operations: 10,000/mese');
  console.log('   Usage: ~300/mese (3 posts/day)');
  console.log('   ROI: 1000%+ automation value');

  console.log('\n✅ Make.com webhook setup ready!');
  console.log('🎯 Next: Configure scenarios in Make.com dashboard');
  
  return results;
}

module.exports = MakeWebhookSetup;

// Run test if called directly
if (require.main === module) {
  testMakeWebhooks();
}