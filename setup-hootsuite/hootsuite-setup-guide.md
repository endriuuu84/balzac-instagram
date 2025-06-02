# 📊 HOOTSUITE ANALYTICS - SETUP BALZAC

## PERCHÉ HOOTSUITE?
- **Analytics avanzati** Instagram
- **Best posting times** basati sui tuoi follower
- **Competitor tracking** ristoranti Modena
- **Report automatici** settimanali/mensili
- **ROI tracking** post → prenotazioni

## STEP 1: REGISTRAZIONE

1. Vai su [hootsuite.com](https://hootsuite.com)
2. Scegli piano **Professional** (€49/mese)
   - 1 utente
   - 10 social accounts
   - Analytics illimitati
   - Best time to post
   - Competitor analysis

## STEP 2: COLLEGA INSTAGRAM BALZAC

1. **Dashboard** → **My Profile** → **Social Networks**
2. Click **"+ Add Network"** → **Instagram Business**
3. Login con Facebook (stesso account del Balzac)
4. Autorizza Hootsuite
5. Seleziona **Balzac Modena** Instagram Business Account

## STEP 3: CONFIGURA ANALYTICS

### A. Best Time to Post
1. **Analytics** → **Best Time to Publish**
2. Hootsuite analizza quando i tuoi follower sono online
3. Risultati tipici Modena:
   - Breakfast: 7:45-8:30
   - Lunch: 12:15-13:00
   - Aperitivo: 18:30-19:15

### B. Post Performance
1. **Analytics** → **Post Performance**
2. Metriche chiave:
   - Engagement rate per tipo di contenuto
   - Reach vs impressions
   - Saves (importante per ristoranti!)
   - Link clicks → prenotazioni

### C. Audience Insights
1. **Analytics** → **Audience**
2. Scopri:
   - Demografia (età, genere, città)
   - Interessi (food, wine, lifestyle)
   - Comportamenti online
   - Device usage (mobile vs desktop)

## STEP 4: COMPETITOR ANALYSIS

### Aggiungi Competitor Modena:
1. **Streams** → **Add Stream** → **Search**
2. Cerca e aggiungi:
   - @osteriafrancescana
   - @trattoriaaldina
   - @mercatoalbinelli
   - @acetaiagiusti
   - Altri bistrot Modena

### Monitora:
- Posting frequency
- Engagement rates
- Content types che funzionano
- Hashtag strategy
- Orari pubblicazione

## STEP 5: CUSTOM REPORTS

### Report Settimanale Balzac:
```
Nome: "Balzac Weekly Performance"
Metriche:
- Top 3 posts by engagement
- Follower growth
- Best performing hashtags
- Competitor comparison
- ROI indicators (saves, link clicks)
Schedule: Ogni lunedì alle 9:00
```

### Report Mensile Executive:
```
Nome: "Balzac Monthly Executive Summary"
Include:
- Growth trends
- Content performance by type
- Audience demographics changes
- Competitive positioning
- Recommendations
```

## STEP 6: HOOTSUITE API (Per Automazione)

### Ottieni API Credentials:
1. **My Profile** → **Manage** → **Apps**
2. **Create New App**
   - Name: "Balzac Analytics Integration"
   - Callback URL: http://localhost:3000/callback
3. Copia:
   - Client ID
   - Client Secret

### Endpoints Utili:
```javascript
// Get scheduled posts
GET https://platform.hootsuite.com/v1/messages

// Get analytics
GET https://platform.hootsuite.com/v1/analytics/posts

// Get best times
GET https://platform.hootsuite.com/v1/analytics/bestTimeToPublish
```

## STEP 7: INTEGRAZIONE CON MAKE.COM

### Workflow:
1. **Make.com** genera contenuto
2. **Hootsuite API** check best time
3. **Adjust** posting schedule
4. **Track** performance
5. **Optimize** next posts

## INSIGHTS TIPICI RISTORANTI MODENA

### Best Performing Content:
1. **Behind the scenes** cucina (engagement +40%)
2. **Chef in action** videos (reach +60%)
3. **Ingredient stories** (saves +80%)
4. **Customer testimonials** (trust +50%)

### Hashtag Performance:
- Location: #Modena #ModenaCity #ModenaFood
- Category: #BistrotItaliano #CucinaEmiliana
- Branded: #BalzacBistrot #BalzacModena
- Trending: Check weekly in Hootsuite

### Timing Insights:
- **Lunedì**: Low engagement (skip o content leggero)
- **Martedì-Giovedì**: Peak lunch planning
- **Venerdì**: Aperitivo planning boom
- **Weekend**: Brunch e pranzi famiglia

## KPI DA MONITORARE

### Engagement KPIs:
- Average engagement rate: Target 5-7%
- Saves per post: Target 10+
- Comments quality: Domande su prenotazioni
- DM inquiries: Track → conversions

### Growth KPIs:
- Follower growth rate: 5-10%/mese
- Reach growth: 20%/mese
- Impressions from hashtags: 40%+
- Discovery percentage: 60%+ non-followers

### Business KPIs:
- Link clicks → sito
- Saves → future visits
- Story views → interest
- DM → bookings

## ALERT SETUP

### Configura Alert per:
1. **Engagement drop** >20%
2. **Negative sentiment** spike
3. **Competitor** viral post
4. **Mention** del Balzac
5. **Trending hashtag** opportunity

## COSTO-BENEFICIO

### Hootsuite Professional (€49/mese):
- Risparmio: 5h/settimana analytics manuali
- Valore: €500/mese (5h × €25 × 4)
- Insights: Impossibili manualmente
- ROI: 10x in decisioni migliori

## ALTERNATIVE ECONOMICHE

Se €49/mese è troppo:
1. **Later** (€15/mese) - Basic analytics
2. **Buffer** (€15/mese) - Simple scheduling
3. **Instagram Insights** (Gratis) - Limited data
4. **Iconosquare** (€49/mese) - Similar features

## LINK UTILI

- [Hootsuite Academy](https://academy.hootsuite.com) - Training gratis
- [API Documentation](https://developer.hootsuite.com)
- [Best Practices Guide](https://blog.hootsuite.com/instagram-analytics/)