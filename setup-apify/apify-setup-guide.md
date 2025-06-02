# 🔍 APIFY - COMPETITOR & TREND MONITORING

## PERCHÉ APIFY PER BALZAC?
- **Monitora competitor** Modena in real-time
- **Scopre hashtag trending** locali
- **Analizza menu e prezzi** competitor
- **Identifica influencer** food Modena
- **Traccia recensioni** su più piattaforme

## STEP 1: REGISTRAZIONE

1. Vai su [apify.com](https://apify.com)
2. Registrati con email
3. Scegli piano **Starter** ($49/mese)
   - 100 actor runs/giorno
   - 30GB storage
   - API access completo

## STEP 2: ACTORS UTILI PER RISTORANTI

### 1. INSTAGRAM SCRAPER
- **Actor**: `apify/instagram-scraper`
- **Cosa fa**: Estrae post, hashtag, profili
- **Per Balzac**: Monitor competitor + hashtag trending

### 2. INSTAGRAM HASHTAG SCRAPER  
- **Actor**: `apify/instagram-hashtag-scraper`
- **Cosa fa**: Analizza hashtag performance
- **Per Balzac**: #ModenaFood #RistorantiModena trends

### 3. INSTAGRAM PROFILE SCRAPER
- **Actor**: `apify/instagram-profile-scraper`
- **Cosa fa**: Dati dettagliati profili
- **Per Balzac**: Analisi competitor growth

### 4. GOOGLE MAPS SCRAPER
- **Actor**: `apify/google-maps-scraper`
- **Cosa fa**: Recensioni, rating, info
- **Per Balzac**: Monitor recensioni area

### 5. TRIPADVISOR SCRAPER
- **Actor**: `apify/tripadvisor-scraper`
- **Cosa fa**: Recensioni e ranking
- **Per Balzac**: Posizione vs competitor

## STEP 3: SETUP COMPETITOR MONITORING

### Competitor da Monitorare:
```javascript
const modenaBistros = [
  // Fine Dining
  '@osteriafrancescana',     // 3 Michelin stars
  '@franceschetta58',        // Bottura casual
  
  // Traditional
  '@trattoriaaldina',        // Traditional cuisine
  '@hosteriaguisti',         // Historic
  '@anticatrattoriacervetta',// Local favorite
  
  // Contemporary
  '@labrasseriemo',          // Modern bistrot
  '@viaseimodena',           // Trendy spot
  
  // Markets & Food Halls
  '@mercatoalbinelli',       // Food market
  '@casadelgusto_modena',    // Gourmet shop
  
  // Wine Bars
  '@enotecamodenese',        // Wine focused
  '@acetaiagiusti'           // Balsamic experience
];
```

### Metriche da Tracciare:
- Posting frequency
- Engagement rates
- Hashtag strategy
- Content types
- Posting times
- Growth rate

## STEP 4: OTTIENI API TOKEN

1. Dashboard → **Settings** → **Integrations**
2. Click **API tokens** → **Create new token**
3. Nome: "Balzac Monitoring"
4. Copia token: `apify_api_xxxxx`

## STEP 5: CONFIGURAZIONE ACTORS

### Instagram Hashtag Monitor
```javascript
{
  "hashtags": [
    "#modenaFood",
    "#ristorantimodena", 
    "#modenarestaurants",
    "#modenaeats",
    "#cucinamodenese",
    "#foodmodena",
    "#aperitivomodena",
    "#brunchmodena"
  ],
  "resultsLimit": 100,
  "timeframe": "LAST_24_HOURS"
}
```

### Competitor Profile Monitor
```javascript
{
  "usernames": [
    "osteriafrancescana",
    "franceschetta58",
    "trattoriaaldina",
    "labrasseriemo"
  ],
  "resultsType": "posts",
  "resultsLimit": 10,
  "timeframe": "LAST_7_DAYS"
}
```

### Google Maps Reviews
```javascript
{
  "searchString": "ristoranti modena centro",
  "maxPlaces": 20,
  "includeReviews": true,
  "maxReviews": 10,
  "language": "it"
}
```

## STEP 6: AUTOMAZIONE CON WEBHOOKS

### Schedule Runs:
- **Hashtag trends**: Ogni 6 ore
- **Competitor posts**: Daily alle 9:00
- **Reviews check**: Weekly lunedì
- **Influencer discovery**: Weekly

### Webhook Integration:
```javascript
{
  "webhookUrl": "https://your-server.com/apify-webhook",
  "webhookEvents": ["ACTOR.RUN.SUCCEEDED"],
  "webhookData": {
    "restaurant": "balzac",
    "type": "competitor_analysis"
  }
}
```

## STEP 7: INSIGHTS ACTIONABLE

### Hashtag Opportunities:
```javascript
// Trending but underused by competitors
if (hashtagEngagement > 1000 && competitorUsage < 3) {
  return "OPPORTUNITY: Use #" + hashtag;
}
```

### Content Gaps:
```javascript
// What competitors post vs what performs
const gaps = findContentGaps(competitorPosts, topPerformers);
// Example: "Behind scenes chef" high engagement, low frequency
```

### Timing Advantages:
```javascript
// When competitors don't post
const quietHours = findLowCompetitionTimes(postingSchedule);
// Example: Sunday 14:00-16:00 low competition
```

## COSTI DETTAGLIATI

### Piano Starter ($49/mese):
- 100 runs/giorno = 3000/mese
- Per Balzac needs:
  - 4 hashtag checks/giorno = 120/mese
  - 1 competitor check/giorno = 30/mese  
  - 1 review check/settimana = 4/mese
  - TOTALE: ~154 runs/mese ✅

### Compute Units:
- Instagram scraping: ~0.5 CU/run
- Google Maps: ~1 CU/run
- Sufficient for monitoring needs

## ALERT SYSTEM

### Configura Alert per:
1. **Competitor viral post** (>500 likes)
2. **New negative review** (< 3 stars)
3. **Trending hashtag** spike
4. **New competitor** opening
5. **Influencer mention** opportunity

## ROI APIFY

### Valore Generato:
- **Competitive intelligence**: €200/mese value
- **Trend discovery**: €150/mese value
- **Review management**: €100/mese value
- **Time saved**: 10h/settimana = €1000/mese

### ROI: €1450 value / $49 cost = 30x ROI

## INTEGRATION PLAN

### Week 1: Setup base monitoring
- Competitor profiles
- Main hashtags
- Review tracking

### Week 2: Automation
- Webhooks to server
- Alert system
- Daily reports

### Week 3: Advanced
- Influencer discovery
- Content gap analysis
- Predictive trends