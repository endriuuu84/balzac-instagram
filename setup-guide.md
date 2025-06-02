# 🚀 GUIDA SETUP COMPLETO BALZAC INSTAGRAM AUTOMATION

## STEP 1: INSTAGRAM GRAPH API (Gratuito) ✅

### 1.1 Prerequisiti
- Account Instagram Business del Balzac Bistrot
- Pagina Facebook collegata
- Account Facebook Developer

### 1.2 Setup Instagram Graph API
1. **Vai su [developers.facebook.com](https://developers.facebook.com)**
2. **Crea una nuova app:**
   - Click "My Apps" → "Create App"
   - Scegli "Business" type
   - Nome app: "Balzac Instagram Automation"
   
3. **Aggiungi Instagram Basic Display:**
   - Dashboard → Add Products → Instagram Basic Display → Set Up
   - Instagram App ID: (verrà generato)
   - Instagram App Secret: (verrà generato)

4. **Configura OAuth Redirect:**
   - Valid OAuth Redirect URIs: `https://balzacbistrot.com/auth/`
   - Deauthorize URL: `https://balzacbistrot.com/deauth/`

5. **Ottieni Access Token:**
   ```bash
   curl -X GET \
     "https://graph.instagram.com/me?fields=id,username&access_token={access-token}"
   ```

6. **Permessi necessari:**
   - `instagram_basic`
   - `instagram_content_publish`
   - `instagram_manage_comments`
   - `instagram_manage_insights`

### 1.3 Test pubblicazione
```javascript
// Test post
const postToInstagram = async () => {
  const pageId = 'YOUR_PAGE_ID';
  const accessToken = 'YOUR_ACCESS_TOKEN';
  const imageUrl = 'https://example.com/tortellini.jpg';
  const caption = 'Tortellini in brodo della tradizione modenese 🍝 #BalzacBistrot';
  
  // Step 1: Create media object
  const createMedia = await fetch(
    `https://graph.facebook.com/v18.0/${pageId}/media?image_url=${imageUrl}&caption=${caption}&access_token=${accessToken}`,
    { method: 'POST' }
  );
  
  const media = await createMedia.json();
  
  // Step 2: Publish media
  const publish = await fetch(
    `https://graph.facebook.com/v18.0/${pageId}/media_publish?creation_id=${media.id}&access_token=${accessToken}`,
    { method: 'POST' }
  );
};
```

---

## STEP 2: GPT-4 + DALL-E 3 (€150/mese) 🤖

### 2.1 Setup OpenAI Account
1. **Registrati su [platform.openai.com](https://platform.openai.com)**
2. **Crea API Key:**
   - Settings → API Keys → Create new secret key
   - Salva: `sk-xxxxxxxxxxxxxxxxxxxxxx`

### 2.2 Configurazione per Balzac
```javascript
// balzac-content-generator.js
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Genera caption Balzac style
async function generateBalzacCaption(mealType, dish) {
  const prompt = `Genera una caption Instagram per Balzac Bistrot Modena.
  Piatto: ${dish}
  Momento: ${mealType}
  Stile: elegante ma friendly, tradizione modenese con twist moderno
  Include: emoji, 3-5 hashtag locali Modena
  Max 150 caratteri`;
  
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.8
  });
  
  return response.choices[0].message.content;
}

// Genera immagine con DALL-E 3
async function generateFoodImage(dish, style) {
  const imagePrompt = `${dish}, professional food photography, 
    bistrot italiano elegante, luce naturale calda, 
    stile Balzac Modena, shallow depth of field, 
    appetizing, instagram worthy, square format`;
  
  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt: imagePrompt,
    n: 1,
    size: "1024x1024",
    quality: "hd"
  });
  
  return response.data[0].url;
}
```

### 2.3 Template prompts Balzac
```javascript
const balzacTemplates = {
  colazione: [
    "Buongiorno Modena! ☕ {piatto} per iniziare alla grande",
    "La colazione del campione al Balzac 🥐 {piatto}",
    "Risveglio modenese con {piatto} ☀️"
  ],
  pranzo: [
    "Tradizione modenese nel piatto 🍝 {piatto}",
    "Pausa pranzo gourmet da Balzac 🍴 {piatto}",
    "L'Emilia a tavola: {piatto} 🇮🇹"
  ],
  aperitivo: [
    "Golden hour in Piazza Grande 🥂 {piatto}",
    "Aperitivo time al Balzac 🍷 {piatto}",
    "Cin cin Modena! 🥂 {piatto}"
  ]
};
```

---

## STEP 3: LEONARDO.AI (€24/mese) 🎨

### 3.1 Setup Account
1. **Registrati su [leonardo.ai](https://leonardo.ai)**
2. **Scegli piano:** Creator ($24/mese)
3. **Ottieni API Key:** Settings → API → Generate Key

### 3.2 Configurazione Food Photography
```javascript
// leonardo-food-visuals.js
const axios = require('axios');

const leonardoConfig = {
  apiKey: process.env.LEONARDO_API_KEY,
  modelId: 'food-photography-v2',
  presets: {
    bistrot: {
      style: "elegant italian bistrot ambiance",
      lighting: "warm natural light, golden hour",
      composition: "rule of thirds, shallow DOF",
      mood: "inviting, appetizing, premium"
    }
  }
};

async function generateBistrotVisual(dish, mealTime) {
  const preset = leonardoConfig.presets.bistrot;
  
  const prompt = `${dish}, ${preset.style}, ${preset.lighting}, 
    ${preset.composition}, ${preset.mood}, ${mealTime} setting,
    Modena Italy backdrop, instagram square format, food photography`;
  
  const response = await axios.post('https://api.leonardo.ai/v1/generations', {
    prompt: prompt,
    modelId: leonardoConfig.modelId,
    num_images: 3,
    width: 1024,
    height: 1024,
    guidance_scale: 7,
    preset_style: "FOOD_PHOTOGRAPHY"
  }, {
    headers: {
      'Authorization': `Bearer ${leonardoConfig.apiKey}`
    }
  });
  
  return response.data.generations[0].url;
}
```

---

## STEP 4: HOOTSUITE ANALYTICS (€49/mese) 📊

### 4.1 Setup Hootsuite
1. **Registrati su [hootsuite.com](https://hootsuite.com)**
2. **Piano Professional** ($49/mese)
3. **Collega Instagram Balzac:**
   - My Profile → Social Networks → Add Network → Instagram Business

### 4.2 Configurazione Analytics API
```javascript
// hootsuite-analytics.js
const HootsuiteAPI = {
  apiKey: process.env.HOOTSUITE_API_KEY,
  organizationId: 'balzac-bistrot-modena',
  
  async getBestPostingTimes() {
    const response = await fetch('https://platform.hootsuite.com/v1/analytics/best-times', {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Organization-Id': this.organizationId
      }
    });
    
    return response.json();
    // Returns: { breakfast: "08:15", lunch: "12:30", aperitivo: "18:45" }
  },
  
  async getEngagementRate(postId) {
    const metrics = await fetch(`https://platform.hootsuite.com/v1/analytics/posts/${postId}`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`
      }
    });
    
    return metrics.json();
    // Returns: { likes: 245, comments: 32, saves: 18, reach: 1580, engagementRate: 6.8 }
  }
};
```

### 4.3 Report automatici
```javascript
// Genera report settimanale
async function weeklyPerformanceReport() {
  const report = {
    topPosts: await HootsuiteAPI.getTopPosts('week'),
    avgEngagement: await HootsuiteAPI.getAverageEngagement('week'),
    followerGrowth: await HootsuiteAPI.getFollowerGrowth('week'),
    bestTimes: await HootsuiteAPI.getBestPostingTimes()
  };
  
  return report;
}
```

---

## STEP 5: APIFY SCRAPER (€49/mese) 🔍

### 5.1 Setup Apify
1. **Registrati su [apify.com](https://apify.com)**
2. **Piano Starter** ($49/mese)
3. **Crea Actor per Instagram:**
   - Console → Actors → Create new Actor

### 5.2 Scraper Competitor Modena
```javascript
// apify-competitor-monitor.js
const Apify = require('apify');

const competitorScraper = {
  apiToken: process.env.APIFY_TOKEN,
  
  async scrapeModenaRestaurants() {
    const input = {
      hashtags: ['#ModenaFood', '#RistorantiModena', '#ModenaCucina'],
      profiles: [
        'osteria_francescana',
        'tavernetta_modena',
        'hosteria_giusti',
        'mercato_albinelli'
      ],
      limit: 50
    };
    
    const run = await Apify.call('instagram-hashtag-scraper', input);
    return run.output.body;
  },
  
  async getTrendingHashtags() {
    const trends = await Apify.call('instagram-trends-analyzer', {
      location: 'Modena, Italy',
      category: 'Food & Restaurants'
    });
    
    return trends.output.body.hashtags;
    // Returns: ['#TortelliniModena', '#AperitivoModena', '#ModenaGourmet']
  }
};
```

### 5.3 Monitoring automation
```javascript
// Monitor competitor posting patterns
async function analyzeCompetitorStrategy() {
  const competitors = await competitorScraper.scrapeModenaRestaurants();
  
  const analysis = {
    postingTimes: analyzeBestTimes(competitors),
    popularContent: analyzeTopPerforming(competitors),
    hashtagStrategy: extractHashtagPatterns(competitors),
    engagementBenchmark: calculateAvgEngagement(competitors)
  };
  
  return analysis;
}
```

---

## STEP 6: BRAND24 MONITORING (€59/mese) 🔔

### 6.1 Setup Brand24
1. **Registrati su [brand24.com](https://brand24.com)**
2. **Piano Plus** ($59/mese)
3. **Crea progetto:**
   - Project name: "Balzac Bistrot Modena"
   - Keywords: "Balzac Bistrot", "Balzac Modena", "@balzacbistrot"

### 6.2 Alert configuration
```javascript
// brand24-monitoring.js
const Brand24API = {
  apiKey: process.env.BRAND24_API_KEY,
  projectId: 'balzac-bistrot-modena',
  
  async getMentions() {
    const response = await fetch(`https://api.brand24.com/v3/projects/${this.projectId}/mentions`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`
      }
    });
    
    const mentions = await response.json();
    return this.analyzeSentiment(mentions);
  },
  
  analyzeSentiment(mentions) {
    return mentions.map(mention => ({
      platform: mention.source,
      sentiment: mention.sentiment, // positive, neutral, negative
      reach: mention.reach,
      influence: mention.authorInfluence,
      alert: mention.sentiment === 'negative' ? 'HIGH' : 'LOW'
    }));
  }
};
```

### 6.3 Crisis management
```javascript
// Alert system
async function setupAlerts() {
  const alerts = {
    negative_review: {
      condition: 'sentiment == negative AND influence > 1000',
      action: 'email_immediate'
    },
    competitor_mention: {
      condition: 'text contains competitor_names',
      action: 'slack_notification'
    },
    viral_potential: {
      condition: 'engagement_rate > 10% in first_hour',
      action: 'boost_post'
    }
  };
  
  return Brand24API.createAlerts(alerts);
}
```

---

## STEP 7: MAKE.COM ORCHESTRATION (€16/mese) 🔧

### 7.1 Setup Make.com
1. **Registrati su [make.com](https://make.com)**
2. **Piano Core** ($16/mese)
3. **Crea nuovo scenario:** "Balzac Instagram Automation"

### 7.2 Workflow completo
```javascript
// Make.com Scenario Configuration
{
  "name": "Balzac Daily Instagram Automation",
  "triggers": [
    {
      "type": "schedule",
      "times": ["07:30", "12:00", "18:00", "20:00"]
    }
  ],
  "workflow": [
    {
      "id": 1,
      "module": "GPT-4",
      "action": "generateCaption",
      "input": {
        "mealType": "{{trigger.mealType}}",
        "menuItem": "{{getDailySpecial()}}"
      }
    },
    {
      "id": 2,
      "module": "Leonardo.ai",
      "action": "generateImage",
      "input": {
        "dish": "{{step1.dishName}}",
        "style": "bistrot-premium"
      }
    },
    {
      "id": 3,
      "module": "Apify",
      "action": "getTrendingHashtags",
      "input": {
        "location": "Modena",
        "category": "food"
      }
    },
    {
      "id": 4,
      "module": "Instagram",
      "action": "publishPost",
      "input": {
        "image": "{{step2.imageUrl}}",
        "caption": "{{step1.caption}} {{step3.hashtags}}"
      }
    },
    {
      "id": 5,
      "module": "Hootsuite",
      "action": "trackPerformance",
      "input": {
        "postId": "{{step4.postId}}"
      }
    },
    {
      "id": 6,
      "module": "Brand24",
      "action": "monitorMentions",
      "input": {
        "postId": "{{step4.postId}}",
        "timeframe": "24h"
      }
    }
  ]
}
```

### 7.3 Error handling
```javascript
// Gestione errori e retry
const errorHandling = {
  "onError": {
    "retry": {
      "attempts": 3,
      "interval": "5m"
    },
    "fallback": {
      "useBackupContent": true,
      "notifyAdmin": true
    }
  },
  "monitoring": {
    "slack": "balzac-alerts",
    "email": "social@balzacbistrot.com"
  }
};
```

---

## 🚀 LANCIO COMPLETO

### Week 1: Foundation
```bash
Day 1-2: Setup Instagram Graph API + Make.com base
Day 3-4: Configure GPT-4 + DALL-E templates
Day 5-7: Test automated posting workflow
```

### Week 2: Enhancement
```bash
Day 8-9: Add Leonardo.ai for premium visuals
Day 10-11: Integrate Hootsuite analytics
Day 12-14: Fine-tune posting times and content
```

### Week 3: Intelligence
```bash
Day 15-16: Setup Apify competitor monitoring
Day 17-18: Configure Brand24 alerts
Day 19-21: Complete automation testing
```

### Daily Monitoring Dashboard
```javascript
// dashboard-metrics.js
const getDailyMetrics = async () => {
  return {
    posts: {
      scheduled: await Make.getScheduledPosts(),
      published: await Instagram.getTodayPosts(),
      performance: await Hootsuite.getDailyStats()
    },
    engagement: {
      likes: await Instagram.getTotalLikes(),
      comments: await Instagram.getComments(),
      saves: await Instagram.getSaves(),
      reach: await Instagram.getReach()
    },
    monitoring: {
      mentions: await Brand24.getMentions(),
      sentiment: await Brand24.getSentiment(),
      competitors: await Apify.getCompetitorActivity()
    },
    alerts: {
      negative: await Brand24.getNegativeAlerts(),
      opportunities: await Apify.getTrendingOpportunities()
    }
  };
};
```

---

## 📱 CONTATTI SUPPORTO

- **Instagram API**: developers.facebook.com/support
- **OpenAI**: help.openai.com
- **Leonardo.ai**: support@leonardo.ai
- **Hootsuite**: help.hootsuite.com
- **Apify**: support@apify.com
- **Brand24**: support@brand24.com
- **Make.com**: support@make.com

## 🎯 SUCCESS METRICS

Dopo 30 giorni dovresti vedere:
- ✅ 90+ posts pubblicati (3/giorno)
- ✅ 0 ore spese su social management
- ✅ +300% engagement rate
- ✅ +200-400 followers organici
- ✅ +30-50 prenotazioni da Instagram
- ✅ ROI 894% verificato