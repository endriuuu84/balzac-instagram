# 🔧 COMPLETARE SCENARIO MAKE.COM - GUIDA STEP-BY-STEP

## ⚠️ PROBLEMA RISOLTO: "No scenario listening for this webhook"

Il webhook funziona, ma dobbiamo **completare il scenario** su Make.com!

---

## 🎯 STEP 1: COMPLETARE SCENARIO SU MAKE.COM

### 1.1 Torna su Make.com:
```
🌐 make.com → Il tuo scenario con webhook
📝 Scenario name: "Balzac Instagram Automation"
```

### 1.2 Dopo il webhook, aggiungi questi moduli:

#### Modulo 2: ROUTER
```
🔍 Search: "router"
🔄 Add: Built-in Router
Funzione: Divide per meal_type (colazione/pranzo/aperitivo)
```

#### Modulo 3: OPENAI
```
🔍 Search: "openai"
🤖 Add: OpenAI Chat Completions
API Key: Il tuo OpenAI key
```

#### Modulo 4: LEONARDO.AI (HTTP)
```
🔍 Search: "http"
📡 Add: HTTP Request
URL: Leonardo.ai API
```

#### Modulo 5: INSTAGRAM
```
🔍 Search: "instagram"
📱 Add: Instagram for Business
Connection: Il tuo account Instagram
```

---

## 🔧 CONFIGURAZIONE DETTAGLIATA

### WEBHOOK (già fatto ✅):
```
URL: https://hook.eu2.make.com/ouiitebpjbbqlhn5xpfxzvsivfx5i0l9
Method: POST
Status: Active
```

### ROUTER Configuration:
```
Route 1: Colazione
├── Filter: {{1.meal_type}} = "colazione"
└── Label: "Morning Route"

Route 2: Pranzo  
├── Filter: {{1.meal_type}} = "pranzo"
└── Label: "Lunch Route"

Route 3: Aperitivo
├── Filter: {{1.meal_type}} = "aperitivo"  
└── Label: "Evening Route"
```

### OPENAI Module:
```
Model: gpt-3.5-turbo
System Message: "Sei il social media manager di Balzac Bistrot a Modena"

User Message Template:
"Crea una caption Instagram per {{1.meal_type}} al Balzac Bistrot. 
Mood: {{1.mood}}
Hashtags: {{1.hashtags}}
Stile: Italiano, friendly, max 100 parole"

Max Tokens: 150
Temperature: 0.8
```

### HTTP MODULE (Leonardo.ai):
```
URL: https://cloud.leonardo.ai/api/rest/v1/generations
Method: POST

Headers:
├── Authorization: Bearer {{your_leonardo_api_key}}
└── Content-Type: application/json

Body (JSON):
{
  "prompt": "Professional food photography, {{1.meal_type}} italiana, Balzac Bistrot Modena, natural lighting, appetizing, high quality",
  "modelId": "6bef9f1b-29cb-40c7-b9df-32b51c1f67d3",
  "width": 1024,
  "height": 1024,
  "num_images": 1
}
```

### INSTAGRAM MODULE:
```
Action: Create a Post
Account: {{your_instagram_business_account}}
Caption: {{3.choices.0.message.content}}
Media URL: {{4.data.generations.0.url}}
```

---

## 📱 CONFIGURAZIONE VISUALE

### Workflow completo:
```
🔗 Webhook 
   ↓
🔄 Router (3 routes)
   ↓
🤖 OpenAI (caption generation)
   ↓  
🎨 HTTP Leonardo (image generation)
   ↓
📱 Instagram (publish post)
   ↓
📧 Slack Notification (optional)
```

### Interface Make.com:
```
┌─────────────────────────────────────┐
│ Balzac Instagram Automation         │
│                                     │
│ 🔗 Webhook → 🔄 Router → 🤖 OpenAI  │
│                    ↓                │
│ 📱 Instagram ← 🎨 HTTP Leonardo     │
│                                     │
│ Status: ⚠️ Draft (needs completion) │
│ [Save] [Test] [Activate]            │
└─────────────────────────────────────┘
```

---

## 🔑 API KEYS DA INSERIRE

### Environment Variables Make.com:
```
OPENAI_API_KEY=sk-proj-MNymI04Yypte0iQRJk...
LEONARDO_API_KEY=cd55bcfa-0741-406f-9b8d...
INSTAGRAM_ACCESS_TOKEN=EAAJzkTU3EK4BOzRYk...
INSTAGRAM_BUSINESS_ACCOUNT_ID=17841444312434434
```

### Dove inserirle:
```
Make.com Settings → Environment Variables
O direttamente nei moduli durante configurazione
```

---

## 🧪 TEST SCENARIO

### Test Manual:
```
1. Complete tutto il workflow
2. Click "Run once" 
3. Insert test data manualmente:
   {
     "meal_type": "aperitivo",
     "mood": "social_evening", 
     "hashtags": "#aperitivomodena #spritz"
   }
4. Verify ogni step funziona
5. Fix eventuali errori
```

### Test Webhook:
```
1. Save scenario completo
2. Activate scenario  
3. Test webhook con curl:

curl -X POST https://hook.eu2.make.com/ouiitebpjbbqlhn5xpfxzvsivfx5i0l9 \
  -H "Content-Type: application/json" \
  -d '{
    "meal_type": "aperitivo",
    "mood": "social_evening",
    "hashtags": "#aperitivomodena #spritz #socialdrinks"
  }'
```

---

## ⚡ QUICK ACTION PLAN

### Adesso (15 minuti):
```
1. ✅ Webhook created (DONE!)
2. 🔄 Add Router module  
3. 🤖 Add OpenAI module
4. 🎨 Add HTTP Leonardo module
5. 📱 Add Instagram module
6. 💾 Save scenario
```

### Dopo (10 minuti):
```
7. 🧪 Test manual run
8. 🔧 Fix any errors
9. ✅ Activate scenario
10. 🕐 Setup cron-job.org (tomorrow morning)
```

---

## 🎯 RESULT TIMELINE

### Oggi:
- ✅ Webhook URL ready
- 🔧 Complete Make.com scenario
- 🧪 Test manual posting

### Domani:
- 🌅 **08:00** → Setup cron-job.org
- 🍝 **13:00** → First automated post TEST!
- 🍸 **18:00** → Full automation LIVE!

---

## 💡 PRO TIPS

### Module Connection:
```
Ogni modulo si connette al precedente:
Webhook (1) → Router (2) → OpenAI (3) → Leonardo (4) → Instagram (5)

Usa {{1.campo}} per webhook data
Usa {{3.choices.0.message.content}} per OpenAI output  
Usa {{4.data.generations.0.url}} per Leonardo image
```

### Error Handling:
```
Add filters per each route:
- Check if meal_type exists
- Verify API responses
- Add fallback values
```

**Ora completa il scenario su Make.com e poi testiamo il webhook!** 🚀

**Domani alle 13:00 il primo post automatico andrà LIVE!** ⏰✨

---

## 🆘 SE HAI PROBLEMI

### Scenario non si salva:
- Verifica che tutti i moduli siano connessi
- Check che API keys siano inserite
- Save step by step ogni modulo

### Test fallisce:
- Check API keys valide
- Verify Instagram permissions
- Test ogni modulo singolarmente

**Una volta completato, il webhook funzionerà perfettamente!** 🎯