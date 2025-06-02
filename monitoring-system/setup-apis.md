# 🔧 SETUP API PER MONITORING ALTERNATIVO

## APIS NECESSARIE (TUTTE GRATUITE!)

### 1. 🗺️ GOOGLE PLACES API (Reviews)
**Costo:** GRATUITO (100 richieste/giorno)

#### Setup:
1. Vai su [console.cloud.google.com](https://console.cloud.google.com)
2. Crea nuovo progetto "Balzac Monitoring"
3. Abilita **Places API**
4. Crea credenziali → API Key
5. Trova il tuo Google Place ID:
   ```bash
   # Cerca il tuo ristorante
   https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=Balzac%20Bistrot%20Modena&inputtype=textquery&key=YOUR_API_KEY
   ```

#### .env:
```bash
GOOGLE_PLACES_API_KEY=your-google-api-key
GOOGLE_PLACE_ID=ChIJ... # From API response
```

---

### 2. 📱 INSTAGRAM BASIC DISPLAY API
**Costo:** GRATUITO 
**Già configurato:** ✅ Usi le stesse credenziali

#### Funzionalità:
- Cerca hashtag mentions
- Monitora engagement
- Analizza sentiment

---

### 3. 📘 FACEBOOK GRAPH API  
**Costo:** GRATUITO
**Già configurato:** ✅ Usi le stesse credenziali

#### Funzionalità:
- Page reviews
- Mentions monitoring
- Response management

---

### 4. 🌐 WEB SCRAPING APIs (Optional)

#### TripAdvisor Monitoring:
```javascript
// Usa Puppeteer per scraping (included)
npm install puppeteer cheerio
```

#### Altre piattaforme:
- TheFork reviews
- Local blogs
- News mentions

---

## 📢 NOTIFICATIONS SETUP

### 1. 📲 SLACK ALERTS (Raccomandato)

#### Setup Slack:
1. Vai nel tuo workspace Slack
2. Apps → Incoming Webhooks
3. Add to Slack → Choose channel
4. Copy webhook URL

#### .env:
```bash
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/T.../B.../...
```

### 2. 📧 EMAIL ALERTS

#### Opzioni:
- **SendGrid** (12k email/mese GRATIS)
- **Mailgun** (5k email/mese GRATIS)  
- **Gmail SMTP** (GRATIS)

#### Setup SendGrid:
1. Registrati su [sendgrid.com](https://sendgrid.com)
2. Create API Key
3. Verify sender email

#### .env:
```bash
SENDGRID_API_KEY=SG.xxx...
ALERT_EMAIL=info@balzacbistrot.com
```

---

## 🤖 SENTIMENT ANALYSIS

### Custom Italian Sentiment Engine

#### Parole Positive:
```javascript
positive: [
  'ottimo', 'eccellente', 'fantastico', 'delizioso', 'perfetto',
  'consiglio', 'meraviglioso', 'top', 'sublime', 'impeccabile',
  'tornerò', 'raccomando', 'incredibile', 'superb', 'amazing'
]
```

#### Parole Negative:
```javascript
negative: [
  'pessimo', 'terribile', 'delusione', 'lento', 'freddo', 'caro',
  'scadente', 'peggio', 'mai più', 'evitate', 'immangiabile',
  'deludente', 'awful', 'terrible', 'disappointing'
]
```

#### Avanzato (Optional):
- Integrazione con **Azure Text Analytics** (GRATUITO 5k calls/mese)
- **Google Cloud Natural Language** (GRATUITO 5k units/mese)

---

## 🎯 ALERT RULES

### Critici (Immediati):
```javascript
{
  condition: "sentiment === 'negative' && rating <= 2",
  action: "immediate_slack_alert",
  response_time: "< 1 hour"
}
```

### Opportunità:
```javascript
{
  condition: "sentiment === 'positive' && rating >= 4",
  action: "share_on_instagram_story",
  response_time: "< 2 hours"
}
```

### High Engagement:
```javascript
{
  condition: "engagement > 100 && platform === 'instagram'",
  action: "engage_with_user",
  response_time: "< 30 minutes"
}
```

---

## 📊 MONITORING SCHEDULE

### Real-time (24/7):
- Slack alerts per review negative
- Email per crisis management
- SMS per emergenze (optional)

### Automated Checks:
```javascript
// Ogni 4 ore
- Google Reviews check
- Instagram hashtag scan
- Facebook page monitoring

// Daily (9:00 AM)  
- Comprehensive report
- Action items generation
- Weekly trend analysis

// Weekly (Monday 10:00 AM)
- Full competitive analysis
- Sentiment trend report
- ROI monitoring impact
```

---

## 💰 COSTI TOTALI

### APIs Gratuite:
```
Google Places API:     €0/mese (100 calls/day limit)
Instagram API:         €0/mese (already setup)
Facebook API:          €0/mese (already setup)
Slack Webhooks:        €0/mese
SendGrid Email:        €0/mese (12k emails/month)
────────────────────────────────────────
TOTAL MONITORING:      €0/mese !!!
```

### vs Brand24:
```
Brand24:              €59/mese
Our Alternative:      €0/mese
Annual Savings:       €708/anno
ROI:                  ∞% (infinito!)
```

---

## 🚀 FEATURES INCLUSE

### ✅ Real-time Monitoring:
- Google My Business reviews
- Instagram hashtag mentions  
- Facebook page activity
- TripAdvisor reviews (scraping)

### ✅ Smart Alerts:
- Slack notifications immediate
- Email alerts per crisis
- Sentiment analysis custom
- Response suggestions automated

### ✅ Analytics & Reports:
- Daily monitoring report
- Weekly sentiment trends
- Action items generation
- ROI tracking

### ✅ Response Management:
- Template responses in italiano/english
- Priority scoring
- Follow-up tracking
- Crisis escalation

---

## 📋 QUICK SETUP CHECKLIST

- [ ] Setup Google Places API
- [ ] Get Google Place ID for Balzac
- [ ] Configure Slack webhook
- [ ] Setup SendGrid email alerts
- [ ] Test all API connections
- [ ] Configure monitoring schedule
- [ ] Create response templates
- [ ] Set alert thresholds
- [ ] Train team on alerts
- [ ] Document crisis procedures

**⏱️ Setup time: 2-3 ore**
**💰 Savings: €708/anno vs Brand24**
**🎯 Results: Same features, zero cost!**

---

## 🏆 VANTAGGIO COMPETITIVO

Il tuo sistema sarà:
- **100% personalizzato** per Balzac
- **0% costi** API gratuiti  
- **Real-time** alerts immediate
- **Multi-platform** coverage completa
- **Italian-optimized** sentiment analysis

**🚀 Meglio di Brand24 a costo zero!**