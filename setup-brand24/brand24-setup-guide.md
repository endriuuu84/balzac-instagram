# 🔔 BRAND24 - MENTION & SENTIMENT MONITORING

## PERCHÉ BRAND24 PER BALZAC?
- **Monitora menzioni** Balzac su TUTTI i social
- **Sentiment analysis** recensioni in real-time
- **Alert immediati** per recensioni negative
- **Traccia influencer** che parlano di te
- **Crisis management** preventivo

## STEP 1: REGISTRAZIONE

1. Vai su [brand24.com](https://brand24.com)
2. Start free trial (14 giorni)
3. Scegli piano **Plus** ($59/mese)
   - 3 keywords/progetti
   - 5k mentions/mese
   - Sentiment analysis
   - Influencer scoring

## STEP 2: CREA PROGETTO BALZAC

### Keywords da Monitorare:
```
Primary Keywords:
1. "Balzac Bistrot"
2. "Balzac Modena"
3. "@balzacmodena"

Additional (if budget allows):
4. "Balzac ristorante Modena"
5. "Bistrot Balzac"
```

### Excluded Keywords:
```
- "Balzac Paris" (altro ristorante)
- "Honoré de Balzac" (scrittore)
- "Balzac coffee" (catena)
```

### Languages:
- Italian (primary)
- English (secondary)

## STEP 3: CONFIGURA SOURCES

### Social Media:
- ✅ Instagram
- ✅ Facebook  
- ✅ Twitter/X
- ✅ TikTok
- ✅ YouTube

### Review Sites:
- ✅ Google Reviews
- ✅ TripAdvisor
- ✅ Yelp
- ✅ TheFork

### News & Blogs:
- ✅ Local Modena news
- ✅ Food blogs
- ✅ Travel sites

### Forums:
- ✅ Reddit
- ✅ Food forums

## STEP 4: OTTIENI API ACCESS

1. **Settings** → **Integrations** → **API Access**
2. Click **Generate API Key**
3. Copy key: `brand24_api_xxxxx`

### API Endpoints:
```javascript
// Base URL
https://api.brand24.com/v3/

// Key endpoints
GET /projects/{projectId}/mentions
GET /projects/{projectId}/metrics
GET /projects/{projectId}/influencers
GET /projects/{projectId}/sentiment
```

## STEP 5: ALERT CONFIGURATION

### Critical Alerts (Immediate):
```javascript
{
  name: "Negative Review Alert",
  conditions: {
    sentiment: "negative",
    influenceScore: "> 5",
    source: ["Google", "TripAdvisor", "Instagram"]
  },
  actions: ["email", "sms", "slack"]
}
```

### Opportunity Alerts:
```javascript
{
  name: "Influencer Mention",
  conditions: {
    influenceScore: "> 20",
    sentiment: ["positive", "neutral"]
  },
  actions: ["email", "dashboard"]
}
```

### Competitor Mentions:
```javascript
{
  name: "Competitor Comparison",
  conditions: {
    text: ["Francescana", "Osteria", "better than", "worse than"]
  },
  actions: ["email"]
}
```

## STEP 6: SENTIMENT RULES

### Custom Sentiment for Restaurant:
```
POSITIVE:
- "delizioso", "eccellente", "fantastico"
- "best meal", "amazing food", "perfetto"
- "tornerò", "consiglio", "imperdibile"
- "5 stelle", "top", "sublime"

NEGATIVE:
- "delusione", "caro", "lento"
- "freddo", "scadente", "peggio"
- "mai più", "evitate", "terribile"
- "1 stella", "pessimo", "immangiabile"

NEUTRAL:
- "normale", "nella media", "ok"
- "buono ma", "carino", "discreto"
```

## STEP 7: INTEGRATIONS

### Slack Integration:
1. **Settings** → **Integrations** → **Slack**
2. Add webhook URL
3. Configure channels:
   - #balzac-mentions (all)
   - #balzac-alerts (negative only)
   - #balzac-opportunities (influencers)

### Google Sheets:
1. Connect Google account
2. Auto-export daily mentions
3. Track sentiment trends

### Email Reports:
- Daily summary: 9:00 AM
- Weekly analysis: Monday 10:00 AM
- Monthly report: 1st of month

## KPI TRACKING

### Response Time Goals:
- Negative review: < 1 hour
- Influencer mention: < 2 hours
- General mention: < 24 hours

### Sentiment Goals:
- Positive: > 70%
- Neutral: 20-25%
- Negative: < 10%

### Engagement Metrics:
- Thank positive reviews
- Address negative feedback
- Engage with influencers
- Share UGC content

## USE CASES BALZAC

### 1. Crisis Prevention:
```javascript
if (sentiment === 'negative' && reach > 1000) {
  // Immediate response protocol
  1. Alert owner/manager
  2. Craft thoughtful response
  3. Address privately if needed
  4. Follow up publicly
}
```

### 2. Influencer Engagement:
```javascript
if (influenceScore > 50 && sentiment === 'positive') {
  // Opportunity protocol
  1. Thank for visit
  2. Invite for special tasting
  3. Offer collaboration
  4. Track ROI
}
```

### 3. Competitor Intelligence:
```javascript
if (mention.includes('Francescana') && sentiment === 'comparison') {
  // Positioning protocol
  1. Analyze comparison points
  2. Highlight differentiators
  3. Adjust messaging
}
```

## COST-BENEFIT ANALYSIS

### Brand24 Plus ($59/mese):
- 5,000 mentions tracked
- Real-time alerts
- Sentiment analysis
- Influencer identification

### Value Generated:
- Crisis prevented: €500+ saved/incident
- Influencer partnerships: €200+ value/each
- Reputation management: Priceless
- Time saved: 10h/week monitoring

### ROI: 10x minimum

## REPORTING TEMPLATES

### Weekly Sentiment Report:
```
Week of [DATE]
Total Mentions: XXX
Sentiment Breakdown:
- Positive: XX% (target: 70%)
- Neutral: XX% (target: 25%)  
- Negative: XX% (target: 5%)

Top Positive Mention: [LINK]
Issues Addressed: X/X
Response Time Avg: XX minutes
```

### Monthly Influence Report:
```
Influencers Engaged: XX
Total Reach: XXX,XXX
Top Influencer: @username (XX.XK followers)
UGC Generated: XX posts
Estimated Value: €X,XXX
```

## BEST PRACTICES

### Response Templates:

**Positive Review Response:**
```
Grazie mille per le belle parole! 🙏 
Siamo felici che abbiate apprezzato [specific dish/experience].
Vi aspettiamo presto al Balzac!
```

**Negative Review Response:**
```
Ci dispiace per l'esperienza non ottimale.
Vorremmo capire meglio cosa è successo.
Può contattarci privatamente a [email]?
Vogliamo assicurarci che questo non si ripeta.
```

**Influencer Response:**
```
Che piacere avervi al Balzac! 🌟
Le vostre foto sono meravigliose.
Ci piacerebbe invitarvi per [special experience].
Vi contattiamo in DM?
```

## QUICK START CHECKLIST

- [ ] Sign up Brand24
- [ ] Create Balzac project  
- [ ] Set keywords
- [ ] Configure alerts
- [ ] Connect Slack/Email
- [ ] Set response protocols
- [ ] Train team on alerts
- [ ] Create response templates
- [ ] Schedule weekly reviews
- [ ] Track KPIs monthly