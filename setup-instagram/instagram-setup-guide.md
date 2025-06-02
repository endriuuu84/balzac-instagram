# 📱 SETUP INSTAGRAM GRAPH API - GUIDA PASSO PASSO

## PREREQUISITI
- ✅ Account Instagram del Balzac Bistrot
- ✅ Pagina Facebook collegata all'account Instagram
- ✅ Accesso admin alla Pagina Facebook

## STEP 1: CONVERTI INSTAGRAM IN BUSINESS ACCOUNT

1. **Apri Instagram** sul telefono
2. **Vai su Impostazioni** → **Account** 
3. **Passa a un account professionale** → Scegli "Business"
4. **Collega la Pagina Facebook** del Balzac Bistrot

## STEP 2: CREA APP FACEBOOK DEVELOPER

1. **Vai su [developers.facebook.com](https://developers.facebook.com)**
2. **Login** con account Facebook admin del Balzac
3. **My Apps** → **Create App**
4. **Scegli tipo**: "Business"
5. **Nome App**: "Balzac Instagram Automation"
6. **Email**: tua email
7. **Click Create App**

## STEP 3: CONFIGURA INSTAGRAM BASIC DISPLAY

1. Nella Dashboard dell'app, trova **"Add Products"**
2. Trova **"Instagram Basic Display"** → Click **"Set Up"**
3. **Create New App**:
   - Display Name: "Balzac Instagram Automation"
   - Click "Create App"

## STEP 4: OTTIENI INSTAGRAM APP ID & SECRET

1. Nella sezione **Instagram Basic Display**:
   - **Instagram App ID**: (copia e salva)
   - **Instagram App Secret**: (copia e salva)

2. **OAuth Redirect URIs**:
   - Aggiungi: `https://localhost:3000/auth/callback`
   - Aggiungi: `https://balzacbistrot.com/auth/callback`

3. **Deauthorize Callback URL**:
   - Aggiungi: `https://balzacbistrot.com/deauth`

4. **Data Deletion Request URL**:
   - Aggiungi: `https://balzacbistrot.com/delete`

5. Click **"Save Changes"**

## STEP 5: AGGIUNGI INSTAGRAM TEST USER

1. Vai su **Roles** → **Instagram Testers**
2. Click **"Add Instagram Testers"**
3. Inserisci username Instagram del Balzac (senza @)
4. Click **"Submit"**
5. **Su Instagram**: Vai su Impostazioni → App e siti web → Inviti dei tester → Accetta

## STEP 6: GENERA ACCESS TOKEN

1. Vai su **Instagram Basic Display** → **User Token Generator**
2. Click su **"Generate Token"** per il tuo account
3. Si aprirà Instagram login - autorizza l'app
4. **COPIA IL TOKEN** (importante: salvalo subito!)

## STEP 7: OTTIENI LONG-LIVED TOKEN

Il token che hai è valido solo 1 ora. Convertiamolo in long-lived (60 giorni):

```bash
curl -X GET \
  "https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret={app-secret}&access_token={short-lived-token}"
```

Risposta:
```json
{
  "access_token": "{long-lived-user-access-token}",
  "token_type": "bearer",
  "expires_in": 5183944 // 60 giorni
}
```

## STEP 8: OTTIENI PAGE ACCESS TOKEN

Per pubblicare su Instagram Business, serve il Page Access Token:

1. **Ottieni User ID Facebook**:
```bash
curl -X GET \
  "https://graph.facebook.com/v18.0/me?access_token={long-lived-token}"
```

2. **Ottieni Page ID**:
```bash
curl -X GET \
  "https://graph.facebook.com/v18.0/me/accounts?access_token={long-lived-token}"
```

3. **Ottieni Instagram Business Account ID**:
```bash
curl -X GET \
  "https://graph.facebook.com/v18.0/{page-id}?fields=instagram_business_account&access_token={page-access-token}"
```

## STEP 9: SALVA I DATI NEL FILE .env

```env
# Instagram API Configuration
INSTAGRAM_APP_ID=your_app_id_here
INSTAGRAM_APP_SECRET=your_app_secret_here
INSTAGRAM_ACCESS_TOKEN=your_long_lived_token_here
INSTAGRAM_BUSINESS_ACCOUNT_ID=your_business_account_id_here
FACEBOOK_PAGE_ID=your_page_id_here
FACEBOOK_PAGE_ACCESS_TOKEN=your_page_access_token_here
```

## STEP 10: TEST PUBBLICAZIONE

Usa questo script per testare:

```javascript
// test-instagram-post.js
const axios = require('axios');
require('dotenv').config();

async function testInstagramPost() {
  const businessAccountId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;
  const accessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
  
  // Step 1: Create media container
  const mediaUrl = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38'; // Test image
  const caption = 'Test post dal Balzac Bistrot! 🍝 #test';
  
  try {
    const createMedia = await axios.post(
      `https://graph.facebook.com/v18.0/${businessAccountId}/media`,
      {
        image_url: mediaUrl,
        caption: caption,
        access_token: accessToken
      }
    );
    
    console.log('Media container created:', createMedia.data);
    
    // Step 2: Publish the media
    const publish = await axios.post(
      `https://graph.facebook.com/v18.0/${businessAccountId}/media_publish`,
      {
        creation_id: createMedia.data.id,
        access_token: accessToken
      }
    );
    
    console.log('✅ Post published successfully!', publish.data);
    
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

testInstagramPost();
```

## TROUBLESHOOTING

### Errore "Invalid OAuth access token"
- Verifica che il token non sia scaduto
- Rigenera il token seguendo Step 6-7

### Errore "Media posted before business account conversion"
- L'account deve essere Business da almeno 24 ore

### Errore "The image url is invalid"
- L'URL immagine deve essere HTTPS
- L'immagine deve essere pubblica
- Formati supportati: JPG, PNG

### Errore "Please reduce the amount of data"
- Caption troppo lunga (max 2200 caratteri)
- Troppi hashtag (max 30)

## PROSSIMI PASSI

Una volta che il test funziona:
1. ✅ Instagram API configurata
2. ➡️ Integra con Make.com per automazione
3. ➡️ Aggiungi Leonardo.ai per immagini AI
4. ➡️ Setup completo automation workflow

---

## LINK UTILI

- [Facebook Developer Dashboard](https://developers.facebook.com)
- [Instagram Graph API Docs](https://developers.facebook.com/docs/instagram-api)
- [Token Debugger](https://developers.facebook.com/tools/debug/accesstoken)
- [API Explorer](https://developers.facebook.com/tools/explorer)