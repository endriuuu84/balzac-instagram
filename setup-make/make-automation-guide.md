# 🔧 MAKE.COM - AUTOMAZIONE COMPLETA BALZAC

## SETUP MAKE.COM (€16/mese)

### STEP 1: CREA ACCOUNT
1. Vai su [make.com](https://make.com)
2. Registrati con email
3. Scegli piano **Core** (€16/mese)
   - 10,000 operazioni/mese
   - Più che sufficienti per 3 post/giorno

### STEP 2: CREA NUOVO SCENARIO
Nome: "Balzac Instagram Daily Automation"

### STEP 3: CONFIGURA I MODULI

## SCENARIO COMPLETO

```
[Schedule Trigger] → [HTTP Request to Your Server] → [Instagram Publish]
     ↓
[Time Router]
  ├── 07:30 → Breakfast Post
  ├── 12:00 → Lunch Post
  └── 18:00 → Aperitivo Post
```

## MODULI DA CONFIGURARE

### 1. SCHEDULE TRIGGER
- **Tipo**: Schedule
- **Interval**: Every Day
- **Times**: 
  - 07:30 (Breakfast)
  - 12:00 (Lunch)  
  - 18:00 (Aperitivo)
- **Timezone**: Europe/Rome

### 2. HTTP MODULE - CALL YOUR API
- **URL**: `https://your-server.com/api/generate-content`
- **Method**: POST
- **Headers**:
  ```json
  {
    "Content-Type": "application/json",
    "Authorization": "Bearer YOUR_API_KEY"
  }
  ```
- **Body**:
  ```json
  {
    "mealType": "{{formatDate(now; 'HH') < 11 ? 'breakfast' : formatDate(now; 'HH') < 17 ? 'lunch' : 'aperitivo'}}",
    "restaurant": "Balzac Bistrot"
  }
  ```

### 3. INSTAGRAM BUSINESS MODULE
- **Connection**: Create new with your Facebook Page Token
- **Action**: Create a Photo Post
- **Page**: Balzac Modena
- **Image URL**: `{{2.imageUrl}}`
- **Caption**: `{{2.caption}}`

## WEBHOOK ENDPOINT NECESSARIO

Dobbiamo creare un endpoint che Make possa chiamare:

```javascript
// server.js - Da hostare su Vercel/Heroku/Railway
const express = require('express');
const BalzacAIPublisher = require('./balzac-ai-publisher');

const app = express();
app.use(express.json());

app.post('/api/generate-content', async (req, res) => {
  try {
    const { mealType } = req.body;
    const publisher = new BalzacAIPublisher();
    
    // Generate content with GPT + DALL-E
    const content = await publisher.generateAIContent(mealType);
    
    res.json({
      success: true,
      imageUrl: content.imageUrl,
      caption: content.caption,
      dish: content.dish
    });
    
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Balzac API running on port ${PORT}`);
});
```

## ALTERNATIVA: MAKE.COM DIRETTO

Se non vuoi hostare un server, puoi usare Make.com modules direttamente:

### Scenario Semplificato:
1. **Schedule** → 
2. **OpenAI Module** (genera caption) → 
3. **OpenAI Images** (genera immagine) → 
4. **Instagram Business** (pubblica)

### Configurazione OpenAI Module in Make:
- **Connection**: Crea con tua API Key OpenAI
- **Model**: gpt-3.5-turbo
- **Messages**:
  ```
  System: Sei il social media manager del Balzac Bistrot Modena
  User: Genera caption Instagram per {{mealType}} con piatto del giorno. Max 150 char, include emoji e hashtag #BalzacBistrot #ModenaFood
  ```

### Configurazione DALL-E Module:
- **Prompt**: `Professional food photography of {{dish}}, Italian bistrot, {{mealType}} setting, Instagram format`
- **Size**: 1024x1024
- **Quality**: HD

## ERROR HANDLING

### Aggiungi Error Handler:
1. **On Error**: Resume
2. **Fallback Content**:
   - Breakfast: "Buongiorno da Balzac! ☕ #BalzacBistrot"
   - Lunch: "Pranzo della tradizione 🍝 #ModenaFood"
   - Aperitivo: "Aperitivo time! 🥂 #BalzacModena"

## MONITORING

### Aggiungi Notifications:
- **Success**: Log to Google Sheets
- **Error**: Email notification
- **Weekly Report**: Slack message

## TEST SCENARIO

1. Crea scenario di test con trigger manuale
2. Testa ogni meal type
3. Verifica pubblicazione Instagram
4. Attiva scenario definitivo

## COSTI OPERAZIONI

Per 3 post/giorno:
- 90 post/mese
- ~4 operazioni per post (trigger, GPT, DALL-E, Instagram)
- Totale: ~360 operazioni/mese
- Ben sotto il limite di 10,000!

## LINK UTILI

- [Make.com Instagram Module](https://www.make.com/en/integrations/instagram-business)
- [Make.com OpenAI Module](https://www.make.com/en/integrations/openai-chatgpt)
- [Make.com Documentation](https://www.make.com/en/help)