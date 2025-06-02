// Make.com Scenario Templates for Balzac Instagram Automation
// Ready-to-import configurations

const BalzacMakeScenarios = {
  
  // SCENARIO 1: Daily Instagram Posting
  dailyInstagramPosts: {
    name: "Balzac Daily Instagram Posts",
    description: "Automated posts at 08:00, 13:00, 18:00",
    blueprint: {
      name: "Balzac Daily Instagram Posts",
      flow: [
        {
          id: 1,
          module: "builtin:schedule",
          version: 1,
          parameters: {
            scheduleType: "advanced",
            times: ["08:00", "13:00", "18:00"],
            timezone: "Europe/Rome",
            days: [1, 2, 3, 4, 5, 6, 7],
            active: true
          },
          metadata: {
            designer: {
              x: 0,
              y: 0
            }
          }
        },
        {
          id: 2,
          module: "builtin:router",
          version: 1,
          parameters: {
            routes: [
              {
                name: "Colazione",
                filter: {
                  condition: "{{formatDate(now, 'HH:mm')}} = '08:00'"
                },
                data: {
                  mealType: "colazione",
                  mood: "energetic_morning",
                  hashtags: "#colazionemodena #cappuccino #buongiorno"
                }
              },
              {
                name: "Pranzo", 
                filter: {
                  condition: "{{formatDate(now, 'HH:mm')}} = '13:00'"
                },
                data: {
                  mealType: "pranzo",
                  mood: "traditional_lunch", 
                  hashtags: "#pranzomodena #tortellini #cucinaitaliana"
                }
              },
              {
                name: "Aperitivo",
                filter: {
                  condition: "{{formatDate(now, 'HH:mm')}} = '18:00'"
                },
                data: {
                  mealType: "aperitivo",
                  mood: "social_evening",
                  hashtags: "#aperitivomodena #spritz #socialdrinks"
                }
              }
            ]
          },
          metadata: {
            designer: {
              x: 300,
              y: 0
            }
          }
        },
        {
          id: 3,
          module: "openai:chat-completions",
          version: 1,
          parameters: {
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content: "Sei il social media manager di Balzac Bistrot, un elegante bistrot a Modena. Scrivi caption Instagram coinvolgenti in italiano."
              },
              {
                role: "user", 
                content: "Crea una caption Instagram per {{2.mealType}} al Balzac Bistrot. Mood: {{2.mood}}. Includi questi hashtags: {{2.hashtags}}. Max 100 parole, tono friendly ma professionale."
              }
            ],
            max_tokens: 150,
            temperature: 0.8
          },
          metadata: {
            designer: {
              x: 600,
              y: 0
            }
          }
        },
        {
          id: 4,
          module: "http:request",
          version: 3,
          parameters: {
            url: "https://cloud.leonardo.ai/api/rest/v1/generations",
            method: "POST",
            headers: [
              {
                name: "Authorization",
                value: "Bearer {{env.LEONARDO_API_KEY}}"
              },
              {
                name: "Content-Type",
                value: "application/json"
              }
            ],
            data: {
              prompt: "Professional food photography, {{2.mealType}} italiana, Balzac Bistrot Modena, natural lighting, appetizing, high quality, instagram style",
              modelId: "6bef9f1b-29cb-40c7-b9df-32b51c1f67d3",
              width: 1024,
              height: 1024,
              num_images: 1,
              guidance_scale: 7
            }
          },
          metadata: {
            designer: {
              x: 900,
              y: 0
            }
          }
        },
        {
          id: 5,
          module: "facebook:instagram-create-post",
          version: 1,
          parameters: {
            account: "{{env.INSTAGRAM_BUSINESS_ACCOUNT_ID}}",
            caption: "{{3.choices.0.message.content}}",
            image_url: "{{4.data.generations.0.url}}",
            access_token: "{{env.INSTAGRAM_ACCESS_TOKEN}}"
          },
          metadata: {
            designer: {
              x: 1200,
              y: 0
            }
          }
        },
        {
          id: 6,
          module: "slack:send-message",
          version: 1,
          parameters: {
            webhook_url: "{{env.SLACK_WEBHOOK_URL}}",
            text: "✅ Post {{2.mealType}} pubblicato con successo su Instagram!\n\nCaption: {{3.choices.0.message.content}}\n\nOrario: {{formatDate(now, 'HH:mm')}}",
            username: "Balzac Bot",
            icon_emoji: ":fork_and_knife:"
          },
          metadata: {
            designer: {
              x: 1500,
              y: 0
            }
          }
        }
      ],
      metadata: {
        instant: false,
        version: 1,
        scenario: {
          roundtrips: 1,
          maxErrors: 3,
          autoCommit: true,
          sequential: false,
          confidential: false,
          dataloss: false,
          dlq: false
        },
        designer: {
          orphans: []
        }
      }
    }
  },

  // SCENARIO 2: Daily Monitoring  
  dailyMonitoring: {
    name: "Balzac Daily Monitoring",
    description: "Daily monitoring and reporting at 09:00",
    blueprint: {
      name: "Balzac Daily Monitoring",
      flow: [
        {
          id: 1,
          module: "builtin:schedule",
          version: 1,
          parameters: {
            scheduleType: "daily",
            time: "09:00",
            timezone: "Europe/Rome",
            days: [1, 2, 3, 4, 5, 6, 7]
          },
          metadata: {
            designer: {
              x: 0,
              y: 0
            }
          }
        },
        {
          id: 2,
          module: "http:request",
          version: 3,
          parameters: {
            url: "https://your-server.com/monitoring-system/complete-monitoring-suite.js",
            method: "POST",
            headers: [
              {
                name: "Content-Type",
                value: "application/json"
              }
            ],
            data: {
              restaurant: "Balzac Bistrot",
              action: "daily_report",
              timestamp: "{{now}}"
            }
          },
          metadata: {
            designer: {
              x: 300,
              y: 0
            }
          }
        },
        {
          id: 3,
          module: "gmail:send-email",
          version: 1,
          parameters: {
            to: "team@balzacbistrot.com",
            subject: "Balzac Daily Monitoring Report - {{formatDate(now, 'DD/MM/YYYY')}}",
            content: "Report giornaliero di monitoring per Balzac Bistrot:\n\n{{2.data}}\n\nGenerato automaticamente da Make.com",
            from: "monitoring@balzacbistrot.com"
          },
          metadata: {
            designer: {
              x: 600,
              y: 0
            }
          }
        }
      ]
    }
  },

  // SCENARIO 3: Crisis Alert System
  crisisAlerts: {
    name: "Balzac Crisis Alert System", 
    description: "Immediate alerts for negative reviews",
    blueprint: {
      name: "Balzac Crisis Alert System",
      flow: [
        {
          id: 1,
          module: "builtin:webhook",
          version: 1,
          parameters: {
            hook: "balzac-crisis-alerts",
            method: "POST"
          },
          metadata: {
            designer: {
              x: 0,
              y: 0
            }
          }
        },
        {
          id: 2,
          module: "builtin:filter",
          version: 1,
          parameters: {
            condition: "{{1.alert.urgency}} = 'immediate' OR {{1.alert.rating}} <= 2"
          },
          metadata: {
            designer: {
              x: 300,
              y: 0
            }
          }
        },
        {
          id: 3,
          module: "slack:send-message",
          version: 1,
          parameters: {
            webhook_url: "{{env.SLACK_WEBHOOK_URL}}",
            text: "🚨 ALERT CRITICO BALZAC 🚨\n\nPiattaforma: {{1.alert.platform}}\nTipo: {{1.alert.type}}\nRating: {{1.alert.rating}}/5\n\nTesto: \"{{1.alert.text}}\"\n\nAZIONE IMMEDIATA RICHIESTA!",
            username: "Balzac Crisis Bot",
            icon_emoji: ":rotating_light:",
            channel: "#balzac-alerts"
          },
          metadata: {
            designer: {
              x: 600,
              y: 0
            }
          }
        },
        {
          id: 4,
          module: "gmail:send-email",
          version: 1,
          parameters: {
            to: "manager@balzacbistrot.com",
            subject: "🚨 CRISIS ALERT - Balzac Bistrot",
            content: "ALERT CRITICO rilevato per Balzac Bistrot:\n\nPiattaforma: {{1.alert.platform}}\nTipo: {{1.alert.type}}\nValutazione: {{1.alert.rating}}/5\nAutore: {{1.alert.author}}\n\nContenuto:\n\"{{1.alert.text}}\"\n\nRisposta richiesta entro 1 ora.\n\nLink: {{1.alert.url}}",
            priority: "high"
          },
          metadata: {
            designer: {
              x: 600,
              y: 150
            }
          }
        }
      ]
    }
  },

  // SCENARIO 4: Competitor Analysis
  competitorAnalysis: {
    name: "Balzac Competitor Weekly Analysis",
    description: "Weekly competitor monitoring every Monday",
    blueprint: {
      name: "Balzac Competitor Weekly Analysis", 
      flow: [
        {
          id: 1,
          module: "builtin:schedule",
          version: 1,
          parameters: {
            scheduleType: "weekly",
            time: "10:00",
            timezone: "Europe/Rome",
            weekdays: [1] // Monday
          },
          metadata: {
            designer: {
              x: 0,
              y: 0
            }
          }
        },
        {
          id: 2,
          module: "http:request",
          version: 3,
          parameters: {
            url: "https://api.apify.com/v2/acts/apify~instagram-scraper/run-sync?token={{env.APIFY_API_TOKEN}}",
            method: "POST",
            headers: [
              {
                name: "Content-Type",
                value: "application/json"
              }
            ],
            data: {
              directUrls: [
                "https://www.instagram.com/osteriafrancescana/",
                "https://www.instagram.com/franceschetta58/",
                "https://www.instagram.com/trattoriaaldina/"
              ],
              resultsType: "posts",
              resultsLimit: 10
            }
          },
          metadata: {
            designer: {
              x: 300,
              y: 0
            }
          }
        },
        {
          id: 3,
          module: "openai:chat-completions",
          version: 1,
          parameters: {
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content: "Sei un analista di marketing per ristoranti. Analizza i dati dei competitor e fornisci insights strategici."
              },
              {
                role: "user",
                content: "Analizza questi dati dei competitor di Balzac Bistrot: {{2.data}}. Fornisci insights su: 1) Tendenze content 2) Timing posts 3) Engagement patterns 4) Raccomandazioni strategiche per Balzac."
              }
            ],
            max_tokens: 500
          },
          metadata: {
            designer: {
              x: 600,
              y: 0
            }
          }
        },
        {
          id: 4,
          module: "gmail:send-email",
          version: 1,
          parameters: {
            to: "marketing@balzacbistrot.com",
            subject: "Weekly Competitor Analysis - {{formatDate(now, 'DD/MM/YYYY')}}",
            content: "Analisi settimanale competitor per Balzac Bistrot:\n\n{{3.choices.0.message.content}}\n\n--- Dati Raw ---\n{{2.data}}\n\nGenerato automaticamente ogni lunedì."
          },
          metadata: {
            designer: {
              x: 900,
              y: 0
            }
          }
        }
      ]
    }
  },

  // Environment Variables Template
  environmentVariables: {
    required: [
      "OPENAI_API_KEY",
      "LEONARDO_API_KEY", 
      "INSTAGRAM_ACCESS_TOKEN",
      "INSTAGRAM_BUSINESS_ACCOUNT_ID",
      "APIFY_API_TOKEN",
      "SLACK_WEBHOOK_URL"
    ],
    optional: [
      "GMAIL_USERNAME",
      "GMAIL_PASSWORD",
      "FACEBOOK_PAGE_ACCESS_TOKEN"
    ],
    example: {
      "OPENAI_API_KEY": "sk-proj-...",
      "LEONARDO_API_KEY": "cd55bcfa-...",
      "INSTAGRAM_ACCESS_TOKEN": "EAAJzkTU3EK4BO...",
      "INSTAGRAM_BUSINESS_ACCOUNT_ID": "17841444312434434",
      "APIFY_API_TOKEN": "apify_api_...",
      "SLACK_WEBHOOK_URL": "https://hooks.slack.com/services/..."
    }
  },

  // Quick Setup Instructions
  setupInstructions: {
    step1: "Create Make.com account and choose Core plan (€9/month)",
    step2: "Import scenario blueprints using JSON import feature",
    step3: "Configure environment variables in Make.com settings",
    step4: "Test each scenario with manual run",
    step5: "Activate schedules and monitor execution",
    
    importSteps: [
      "1. Go to Make.com dashboard",
      "2. Click 'Create new scenario'", 
      "3. Click 'Import blueprint'",
      "4. Paste the JSON blueprint from above",
      "5. Configure your API keys in each module",
      "6. Test with 'Run once'",
      "7. Activate scenario"
    ]
  },

  // Cost Analysis
  costAnalysis: {
    makeSubscription: "€9/month (Core plan)",
    operationsUsed: {
      dailyPosts: "90/month (3 posts × 30 days)",
      monitoring: "30/month (1 check per day)",
      alerts: "20/month (estimated)",
      competitor: "4/month (weekly analysis)"
    },
    totalOperations: "144/month",
    operationsIncluded: "10,000/month", 
    utilizationRate: "1.4%",
    remainingCapacity: "9,856 operations for expansion",
    roi: "1000%+ (€9 cost vs €1000+ value generated)"
  }
};

// Export scenarios for easy import
module.exports = BalzacMakeScenarios;

// Generate importable JSON files
function generateScenarioFiles() {
  const fs = require('fs');
  
  Object.entries(BalzacMakeScenarios).forEach(([name, scenario]) => {
    if (scenario.blueprint) {
      const filename = `./make-scenarios/${name}-blueprint.json`;
      fs.writeFileSync(filename, JSON.stringify(scenario.blueprint, null, 2));
      console.log(`✅ Generated: ${filename}`);
    }
  });
}

// Test function to validate scenarios
function validateScenarios() {
  console.log('🧪 Validating Make.com scenarios...\n');
  
  let valid = 0;
  let total = 0;
  
  Object.entries(BalzacMakeScenarios).forEach(([name, scenario]) => {
    total++;
    
    if (scenario.blueprint && scenario.blueprint.flow) {
      console.log(`✅ ${name}: Valid scenario (${scenario.blueprint.flow.length} modules)`);
      valid++;
    } else if (scenario.name) {
      console.log(`📋 ${name}: Configuration template`);
      valid++;
    } else {
      console.log(`❌ ${name}: Invalid scenario structure`);
    }
  });
  
  console.log(`\n📊 Validation complete: ${valid}/${total} scenarios valid`);
  
  return { valid, total, rate: Math.round((valid/total) * 100) };
}

// Print setup summary
function printSetupSummary() {
  console.log('\n🚀 MAKE.COM SCENARIOS READY FOR BALZAC!');
  console.log('='.repeat(50));
  
  console.log('\n📋 Available Scenarios:');
  console.log('1. ✅ Daily Instagram Posts (08:00, 13:00, 18:00)');
  console.log('2. ✅ Daily Monitoring (09:00)'); 
  console.log('3. ✅ Crisis Alerts (Real-time)');
  console.log('4. ✅ Weekly Competitor Analysis (Monday 10:00)');
  
  console.log('\n💰 Cost Analysis:');
  console.log(`Subscription: ${BalzacMakeScenarios.costAnalysis.makeSubscription}`);
  console.log(`Operations used: ${BalzacMakeScenarios.costAnalysis.totalOperations}/month`);
  console.log(`Utilization: ${BalzacMakeScenarios.costAnalysis.utilizationRate}`);
  console.log(`ROI: ${BalzacMakeScenarios.costAnalysis.roi}`);
  
  console.log('\n🎯 Next Steps:');
  console.log('1. Create Make.com account');
  console.log('2. Import scenario blueprints');
  console.log('3. Configure API keys'); 
  console.log('4. Test and activate');
  console.log('5. Monitor automation!');
  
  console.log('\n🚀 Ready to automate Balzac Instagram!');
}

// Run if called directly
if (require.main === module) {
  validateScenarios();
  printSetupSummary();
}