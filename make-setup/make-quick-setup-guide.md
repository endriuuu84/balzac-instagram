    # 🚀 MAKE.COM QUICK SETUP GUIDE

## PANORAMICA COMPLETA
Make.com è il cervello che orchestrerà TUTTO il tuo sistema di automazione Instagram per Balzac!

### COSA FA MAKE.COM:
- 🤖 **Automatizza 3 post giornalieri** (colazione, pranzo, aperitivo)
- 🔍 **Monitora competitor** ogni giorno
- ⭐ **Risponde alle recensioni** automaticamente
- 📊 **Genera report** settimanali
- 🚨 **Alert immediati** per crisi reputazione

---

## STEP 1: REGISTRAZIONE MAKE.COM

### 1.1 Vai su Make.com
```
🌐 https://make.com
```

### 1.2 Scegli Piano
- **FREE**: 1000 operazioni/mese (per iniziare)
- **CORE**: $9/mese - 10.000 operazioni (consigliato)
- **PRO**: $16/mese - 100.000 operazioni (se espandi)

### 1.3 Per Balzac:
```
✅ Scegli CORE ($9/mese)
- 10.000 operazioni/mese
- Scheduling avanzato
- Webhook illimitati
- Perfetto per ristorante
```

---

## STEP 2: CREA PRIMO SCENARIO

### 2.1 Daily Instagram Publisher

1. **Click "Create a new scenario"**
2. **Add modules in questo ordine:**

```
┌─────────────────────┐
│  1. SCHEDULE        │ → Trigger 3x/giorno
│     8:00, 13:00,    │   (colazione, pranzo,
│     18:00           │    aperitivo)
└─────────────────────┘
           ↓
┌─────────────────────┐
│  2. WEBHOOK         │ → Riceve dati pasto
│     /balzac-post    │   (tipo, piatto, etc)
└─────────────────────┘
           ↓
┌─────────────────────┐
│  3. OPENAI GPT      │ → Genera caption
│     GPT-3.5-turbo   │   personalizzata
└─────────────────────┘
           ↓
┌─────────────────────┐
│  4. LEONARDO.AI     │ → Genera immagine
│     (HTTP Request)  │   food photography
└─────────────────────┘
           ↓
┌─────────────────────┐
│  5. INSTAGRAM       │ → Pubblica post
│     for Business    │   completo
└─────────────────────┘
```

### 2.2 Configurazione Moduli:

**SCHEDULE Module:**
```javascript
Times: 08:00, 13:00, 18:00
Timezone: Europe/Rome
Days: Monday to Sunday
Advanced: Yes
```

**OPENAI Module:**
```javascript
API Key: [dal tuo .env]
Model: gpt-3.5-turbo
Max Tokens: 150
Temperature: 0.8

Prompt Template:
"Scrivi una caption Instagram per Balzac Bistrot Modena. 
Meal type: {meal_type}
Dish: {dish_name}
Style: Italiano, friendly, con emoji. Max 100 parole."
```

**LEONARDO Module (HTTP):**
```javascript
URL: https://cloud.leonardo.ai/api/rest/v1/generations
Method: POST
Headers:
  Authorization: Bearer {leonardo_api_key}
  Content-Type: application/json

Body:
{
  "prompt": "Professional food photography {dish_name}, Italian bistrot style, natural lighting",
  "modelId": "6bef9f1b-29cb-40c7-b9df-32b51c1f67d3",
  "width": 1024,
  "height": 1024,
  "num_images": 1
}
```

**INSTAGRAM Module:**
```javascript
Connection: [Autorizza con Facebook]
Page: Balzac Bistrot
Account: [Instagram Business Account]

Action: Create a Post
Media: {leonardo_image_url}
Caption: {openai_caption}
```

---

## STEP 3: SCENARIO COMPETITOR MONITORING

### 3.1 Crea Secondo Scenario

```
┌─────────────────────┐
│  1. SCHEDULE        │ → Ogni giorno 9:00
│     Daily 09:00     │
└─────────────────────┘
           ↓
┌─────────────────────┐
│  2. APIFY           │ → Scraping Instagram
│     Instagram       │   competitor
│     Scraper         │
└─────────────────────┘
           ↓
┌─────────────────────┐
│  3. DATA TRANSFORMER│ → Analizza patterns
│     JavaScript      │   e engagement
└─────────────────────┘
           ↓
┌─────────────────────┐
│  4. EMAIL           │ → Invia report
│     Gmail/Outlook   │   giornaliero
└─────────────────────┘
```

### 3.2 Configurazione Apify:
```javascript
Actor: apify/instagram-scraper
Input:
{
  "directUrls": [
    "https://instagram.com/osteriafrancescana",
    "https://instagram.com/franceschetta58"
  ],
  "resultsType": "posts",
  "resultsLimit": 5
}
```

---

## STEP 4: WEBHOOK SETUP

### 4.1 Crea Webhooks
1. Nel primo scenario, click su **Webhook**
2. **Copy webhook URL** (es: https://hook.make.com/abc123)
3. **Aggiungi al .env:**

```bash
# Aggiungi queste righe al tuo .env
MAKE_WEBHOOK_URL=https://hook.make.com/abc123
MAKE_API_KEY=tuo-api-key-make
```

### 4.2 Test Webhook
```bash
# Test da terminale
curl -X POST https://hook.make.com/abc123 \
  -H "Content-Type: application/json" \
  -d '{
    "meal_type": "aperitivo",
    "dish_name": "Spritz e Tortellini",
    "time": "18:00"
  }'
```

---

## STEP 5: CONNESSIONI API

### 5.1 Connetti Instagram
1. **Add Instagram for Business**
2. **Login con Facebook account**
3. **Autorizza Make.com**
4. **Seleziona Balzac page**
5. **Test connessione**

### 5.2 Connetti OpenAI
1. **Add OpenAI module**
2. **Crea nuova connessione**
3. **Inserisci API key:** `sk-proj-MNymI04Y...`
4. **Test con prompt semplice**

### 5.3 Connetti Leonardo
1. **Add HTTP module**
2. **Configure POST request**
3. **Headers con Bearer token**
4. **Test image generation**

---

## STEP 6: TESTING & DEBUGGING

### 6.1 Test Scenario
1. **Click "Run once"** nel scenario
2. **Verifica ogni step**
3. **Check output di ogni modulo**
4. **Fix errori uno per uno**

### 6.2 Common Issues:
```
❌ Instagram API Error
→ Check access token expiry
→ Renew token se necessario

❌ OpenAI Rate Limit
→ Reduce frequency temporaneamente
→ Check quota utilizzata

❌ Leonardo Credits
→ Monitor usage dashboard
→ Upgrade plan se necessario
```

---

## STEP 7: SCHEDULING & ACTIVATION

### 7.1 Attiva Scheduling
1. **Toggle "Scheduling" ON**
2. **Verifica orari:** 8:00, 13:00, 18:00
3. **Set timezone:** Europe/Rome
4. **Save scenario**

### 7.2 Monitor Operations
```
Dashboard Make.com:
- Operations used/month
- Scenario run history
- Error logs
- Success rate
```

---

## COSTI & ROI MAKE.COM

### Costo Mensile:
```
Make.com Core: $9/mese
Operazioni stimate:
- Daily posts: 3 × 30 = 90/mese
- Competitor monitoring: 30/mese  
- Review responses: 20/mese
- Webhooks & data: 50/mese
Total: ~190 operazioni/mese

Costo effettivo: $9/mese
```

### Valore Generato:
```
Time saved: 15 ore/settimana
Rate freelancer: €25/ora
Monthly savings: €1,500
ROI: 16,600% !!!
```

---

## QUICK START CHECKLIST

- [ ] Registrati su make.com
- [ ] Scegli piano Core ($9/mese)
- [ ] Crea scenario "Daily Instagram Publisher"
- [ ] Aggiungi moduli: Schedule → OpenAI → Leonardo → Instagram
- [ ] Configura webhook per trigger
- [ ] Connetti tutte le API (Instagram, OpenAI, Leonardo)
- [ ] Test scenario con "Run once"
- [ ] Attiva scheduling per orari pasti
- [ ] Crea scenario competitor monitoring
- [ ] Set up email notifications
- [ ] Monitor dashboard per errors

---

## PROSSIMI PASSI

1. **Registra account Make.com** (oggi)
2. **Setup primo scenario** (domani)
3. **Test automazione** (dopodomani)
4. **Go live con scheduling** (settimana prossima)
5. **Monitor & optimize** (ongoing)

**🎯 Obiettivo: Automazione completa entro 1 settimana!**

**💫 Il futuro del social media di Balzac inizia ora!**
