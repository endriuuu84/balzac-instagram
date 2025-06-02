# 📱 INSTAGRAM BUSINESS API - SETUP CORRETTO

## ❌ IL PROBLEMA
Stai usando Instagram Basic Display API, ma per pubblicare automaticamente serve **Instagram Business API** attraverso Facebook.

## ✅ SOLUZIONE: USA FACEBOOK GRAPH API

### METODO 1: FACEBOOK CREATOR STUDIO (PIÙ SEMPLICE)

1. **Vai su [Creator Studio](https://business.facebook.com/creatorstudio)**
2. **Collega Instagram**:
   - Click sull'icona Instagram in alto
   - "Collega il tuo account"
   - Login con Instagram del Balzac

3. **Ottieni Token da Business Manager**:
   - Vai su [Business Settings](https://business.facebook.com/settings)
   - Sistema → Utenti → Token di accesso agli utenti
   - Genera nuovo token

### METODO 2: GRAPH API EXPLORER (RACCOMANDATO)

1. **Vai su [Graph API Explorer](https://developers.facebook.com/tools/explorer/)**

2. **Seleziona la tua app**: "Balzac Instagram Automation"

3. **Ottieni User Access Token**:
   - Click "Generate Access Token"
   - Permessi necessari:
     - `pages_show_list`
     - `pages_read_engagement`
     - `instagram_basic`
     - `instagram_content_publish`
     - `business_management`

4. **Trova la tua Pagina Facebook**:
   ```
   GET /me/accounts
   ```
   Trova l'ID della pagina Facebook del Balzac

5. **Ottieni Instagram Business Account ID**:
   ```
   GET /{page-id}?fields=instagram_business_account
   ```

6. **Ottieni Page Access Token**:
   ```
   GET /{page-id}?fields=access_token
   ```

### METODO 3: SETUP MANUALE COMPLETO

```bash
# 1. Ottieni User Token (dal Graph Explorer)
USER_TOKEN="EAA..."

# 2. Ottieni le tue pagine
curl -X GET "https://graph.facebook.com/v18.0/me/accounts?access_token=$USER_TOKEN"

# 3. Trova Instagram Business Account
PAGE_ID="your_page_id"
curl -X GET "https://graph.facebook.com/v18.0/$PAGE_ID?fields=instagram_business_account&access_token=$USER_TOKEN"

# 4. Ottieni Page Access Token permanente
curl -X GET "https://graph.facebook.com/v18.0/$PAGE_ID?fields=access_token&access_token=$USER_TOKEN"
```

## 📝 CONFIGURAZIONE CORRETTA .env

```env
# Facebook & Instagram Business
FACEBOOK_APP_ID=690017453674670
FACEBOOK_APP_SECRET=dfedcc19f2157e3c5047dba4d570441f
FACEBOOK_PAGE_ID=your_page_id_here
FACEBOOK_PAGE_ACCESS_TOKEN=your_page_token_here
INSTAGRAM_BUSINESS_ACCOUNT_ID=your_instagram_business_id_here
```

## 🔧 TEST RAPIDO

```javascript
// quick-test.js
const axios = require('axios');

async function testSetup() {
    const pageToken = 'YOUR_PAGE_ACCESS_TOKEN';
    const pageId = 'YOUR_PAGE_ID';
    
    try {
        // Get Instagram Business Account
        const response = await axios.get(
            `https://graph.facebook.com/v18.0/${pageId}`,
            {
                params: {
                    fields: 'instagram_business_account',
                    access_token: pageToken
                }
            }
        );
        
        console.log('✅ Instagram Business Account:', response.data.instagram_business_account);
        
    } catch (error) {
        console.error('❌ Error:', error.response?.data || error.message);
    }
}

testSetup();
```

## ⚠️ REQUISITI IMPORTANTI

1. **Account Instagram** deve essere:
   - ✅ Business o Creator (non Personal)
   - ✅ Collegato a una Pagina Facebook
   - ✅ Admin della Pagina Facebook

2. **Pagina Facebook** deve avere:
   - ✅ Categoria business corretta
   - ✅ Informazioni complete
   - ✅ Instagram collegato nelle impostazioni

3. **App Facebook** deve avere:
   - ✅ Modalità Live (non Development)
   - ✅ Business verification (se richiesto)

## 🚀 PROSSIMI STEP

1. Usa Graph API Explorer per ottenere i token
2. Trova il tuo Instagram Business Account ID
3. Testa con il Page Access Token
4. Configura automazione completa