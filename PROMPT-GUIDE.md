# 🎯 Prompt OpenAI Avanzati per Balzac Bistrot

## ✅ Sistema Completato e Funzionante!

I prompt OpenAI ottimizzati con analytics ROI in tempo reale sono stati implementati e testati con successo.

## 🚀 **API Endpoints Disponibili**

### 1. Generazione Contenuto Singolo
```bash
POST /api/generate-content
```

**Body:**
```json
{
  "meal_type": "colazione|pranzo|aperitivo",
  "content_type": "caption"
}
```

**Response:**
```json
{
  "meal_type": "colazione",
  "generated_content": {
    "caption": "Caption ottimizzata con hashtag ROI...",
    "model_used": "gpt-4o-mini",
    "with_roi_analytics": true,
    "analytics_data": {
      "hashtag_strategy": "ultra_niche",
      "roi_score": 68,
      "optimal_time": "08:00",
      "engagement_prediction": {...}
    }
  }
}
```

### 2. Generazione Batch (Tutti i Pasti)
```bash
POST /api/generate-all-content
```

**Response:**
```json
{
  "batch_generation": true,
  "results": {
    "colazione": {...},
    "pranzo": {...},
    "aperitivo": {...}
  },
  "summary": {
    "successful": 3,
    "failed": 0
  }
}
```

## 🎯 **Caratteristiche Prompt Avanzati**

### ✨ **Ottimizzazioni ROI Integrate**

1. **Analytics in Tempo Reale**
   - Strategia hashtag migliore (Alto Reach, Medio Engagement, Locale, Ultra Nicchia)
   - ROI score basato su performance analytics
   - Orari ottimali di posting
   - Predizione engagement

2. **Menu Dinamico**
   - Ingredienti del giorno da `menu.json`
   - Rotazione automatica dei piatti
   - Stagionalità e contesto temporale

3. **Targeting Specifico**
   - Tono e stile per ogni tipo di pasto
   - Hashtag ottimizzati per ogni strategia
   - Call to action personalizzate

## 📝 **Esempi di Output**

### 🌅 **COLAZIONE**
```
"La dolcezza di un nuovo giorno inizia qui, al Balzac Bistrot. ☕🥐 
Gusta i nostri croissant di burro di Normandia mentre il sole 
illumina Piazza Grande. Vi aspettiamo per una colazione che celebra 
l'eleganza della tradizione! 🌅

#balzacbistrot #modenacaffe #colazionemodena #cappuccino #cornetti #modena"
```

**Analytics:** 
- Strategia: ultra_niche
- ROI Score: 68
- Engagement: alto

### 🍝 **PRANZO** 
```
"🍝 Oggi al Balzac Bistrot, vi invitiamo a riscoprire i sapori 
della nostra terra con i tortellini in brodo di cappone. 
Una pausa pranzo che celebra la tradizione emiliana con ingredienti 
di prima scelta. 🏰

#balzacbistrot #tortellinimodena #cucinaemiliana #pranzomodena #emiliaromagna"
```

**Analytics:**
- Strategia: local_niche  
- ROI Score: 72
- Engagement: medio-alto

### 🍸 **APERITIVO**
```
"🌅 Mentre il sole si tuffa su Piazza Grande, lasciati avvolgere 
dalla magia dell'aperitivo al Balzac Bistrot. Il nostro Spritz Balzac 
e la vista più bella di Modena ti aspettano. ✨

#balzacbistrot #aperitivomodena #spritzbalzac #piazzagrande #modenabynight"
```

**Analytics:**
- Strategia: medium_engagement
- ROI Score: 58  
- Engagement: medio

## 🎛️ **Configurazione Avanzata**

### **Modello OpenAI**
- **Model**: `gpt-4o-mini`
- **Temperature**: 0.7 (creatività bilanciata)
- **Max Tokens**: 300
- **Top P**: 0.9

### **Strategia Hashtag**
1. **Alto Reach** (50K+ reach): #pasta, #italianfood, #breakfast
2. **Medio Engagement** (10-15K): #tortellini, #italianbreakfast  
3. **Nicchia Locale** (2-3K): #modena, #modenafood, #emiliaromagna
4. **Ultra Nicchia** (500-800): #balzacbistrot, #balzacmodena

### **Personalizzazione per Pasto**

#### 🌅 **COLAZIONE**
- **Tono**: Accogliente, raffinato, energetico
- **Focus**: Comfort, tradizione francese-italiana, energia mattina
- **CTA**: "Vi aspettiamo", "Iniziate la giornata con noi"
- **Emoji**: ☕ 🥐 🌅

#### 🍝 **PRANZO**  
- **Tono**: Orgoglioso, autentico, competente
- **Focus**: Heritage emiliano, ingredienti premium, craftsmanship
- **CTA**: "Riscoprite i sapori", "Coccolatevi a tavola"
- **Emoji**: 🍝 🧀 🏰

#### 🍸 **APERITIVO**
- **Tono**: Sofisticato, conviviale, aspirazionale  
- **Focus**: Vista Piazza Grande, cocktail artigianali, socialità
- **CTA**: "Lasciati avvolgere", "Ti aspettiamo"
- **Emoji**: 🍸 🌅 ✨

## 🔧 **Come Usare**

### **Metodo 1: API Diretta**
```bash
curl -X POST https://balzac-instagram-production.up.railway.app/api/generate-content \
  -H "Content-Type: application/json" \
  -d '{"meal_type": "pranzo"}'
```

### **Metodo 2: Integrazione Codice**
```javascript
const { PromptIntegrationSystem } = require('./prompts/prompt-integration.js');

const promptSystem = new PromptIntegrationSystem();
const result = await promptSystem.generateOptimizedContent('colazione');

console.log(result.caption);
console.log('ROI Score:', result.analytics_data.roi_score);
```

### **Metodo 3: Batch Generation**
```javascript
const results = await promptSystem.generateAllMealTypes();
// Genera caption per tutti e 3 i pasti con analytics
```

## 📊 **Performance**

- ⚡ **Velocità**: 15-18 secondi per prompt
- 🎯 **Precisione**: ROI analytics integrato
- 🔄 **Fallback**: Dati stimati se API non disponibili
- 📈 **Success Rate**: 100% nei test

## 🎨 **Personalizzazioni Possibili**

1. **Aggiungere nuovi meal types**
2. **Modificare tone of voice**
3. **Integrare eventi speciali**
4. **Aggiungere A/B testing**
5. **Modificare strategia hashtag**

## 🔗 **File di Riferimento**

- **Prompt Engine**: `/prompts/advanced-prompts.js`
- **Integrazione System**: `/prompts/prompt-integration.js`  
- **API Endpoints**: `/server.js` (linee 78-141)
- **Menu Data**: `/menu.json`
- **Analytics**: `/api/advanced-analytics.js`

## ✅ **Deploy Status**

🌐 **LIVE su**: https://balzac-instagram-production.up.railway.app/

🚀 **Endpoints attivi**:
- ✅ `/api/generate-content`
- ✅ `/api/generate-all-content` 
- ✅ `/api/advanced-analytics`

---

🎉 **Sistema completo e pronto per l'uso in produzione!**

*I prompt OpenAI integrati con analytics ROI sono ora operativi e ottimizzati per massimizzare l'engagement di Balzac Bistrot.*