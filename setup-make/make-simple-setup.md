# 🚀 MAKE.COM - SETUP SEMPLICE IN 5 MINUTI

## SCENARIO DA COPIARE

### 1️⃣ SCHEDULE MODULE
- **Schedule**: Every Day
- **Time**: 07:30
- **Timezone**: Europe/Rome
- **Note**: Duplica per 12:00 e 18:00

### 2️⃣ ROUTER MODULE  
Aggiungi router con 3 route basate sull'ora:
- Route 1: Hour < 11 → Breakfast
- Route 2: Hour < 17 → Lunch  
- Route 3: Hour >= 17 → Aperitivo

### 3️⃣ OPENAI CHATGPT MODULE
**Connection**: Nuova connessione con tua API Key

**Per Route BREAKFAST:**
```
Model: gpt-3.5-turbo
System Message: Sei il social media manager del Balzac Bistrot Modena
User Message: Genera caption Instagram per colazione con cappuccino e cornetto. Max 120 caratteri, emoji, hashtag #BalzacBistrot #ModenaBreakfast
```

**Per Route LUNCH:**
```
User Message: Genera caption per pranzo con tortellini in brodo. Max 120 caratteri, emoji, hashtag #BalzacBistrot #ModenaFood #Tortellini
```

**Per Route APERITIVO:**
```
User Message: Genera caption per aperitivo con Spritz. Max 120 caratteri, emoji, hashtag #BalzacBistrot #AperitivoModena
```

### 4️⃣ DALL-E MODULE
**Connection**: Stessa API Key OpenAI

**Prompt Examples:**
- Breakfast: "Cappuccino and croissant, Italian breakfast, elegant bistrot, morning light, professional food photography"
- Lunch: "Tortellini in brodo, traditional Italian pasta, elegant presentation, natural light"  
- Aperitivo: "Spritz cocktail, Italian aperitivo, golden hour, Modena view, elegant bar setup"

**Settings:**
- Model: dall-e-3
- Size: 1024x1024
- Quality: HD

### 5️⃣ INSTAGRAM BUSINESS MODULE
**Connection**: 
1. Click "Add connection"
2. Login with Facebook
3. Select "Balzac Modena" page
4. Authorize permissions

**Configuration:**
- Action: Create a Photo Post
- Instagram Business Account: Balzac Modena
- Image URL: {{4.url}} (from DALL-E)
- Caption: {{3.choices[0].message.content}} (from ChatGPT)

## VARIABILI DA SALVARE IN MAKE

1. Click su "Data Stores" → New Data Store
2. Nome: "Balzac Dishes"
3. Structure:
   - breakfast_dishes (array)
   - lunch_dishes (array)
   - aperitivo_dishes (array)

## ERROR HANDLING

Aggiungi "Error Handler" dopo Instagram module:
- Type: Resume
- Fallback: Invia email di notifica

## COSTO MENSILE MAKE.COM

Piano Core (€16/mese):
- 3 post/giorno = 90 post/mese
- 5 operazioni per post = 450 operazioni
- Limite piano: 10,000 operazioni ✅

## TEST PRIMA DI ATTIVARE

1. Imposta scenario in modalità "Test"
2. Esegui manualmente
3. Verifica post su Instagram
4. Attiva scheduling automatico

## TEMPLATE PRONTO

Vuoi che ti invii un Blueprint Make.com già configurato? 
Puoi importarlo direttamente!