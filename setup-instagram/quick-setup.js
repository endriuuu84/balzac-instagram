// Instagram Quick Setup Helper
// Aiuta a ottenere tutti i token necessari

const readline = require('readline');
const https = require('https');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🚀 INSTAGRAM API SETUP HELPER\n');
console.log('Questo script ti aiuterà a configurare Instagram Graph API\n');

async function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function setupInstagram() {
  console.log('📋 STEP 1: Prima assicurati di aver fatto:');
  console.log('1. Instagram account → Business account');
  console.log('2. Collegato pagina Facebook');
  console.log('3. Creato app su developers.facebook.com');
  console.log('4. Aggiunto Instagram Basic Display\n');
  
  const ready = await question('Hai completato questi step? (y/n): ');
  
  if (ready.toLowerCase() !== 'y') {
    console.log('\n⚠️  Completa prima questi step seguendo instagram-setup-guide.md');
    rl.close();
    return;
  }
  
  console.log('\n📝 STEP 2: Inserisci i dati dalla Facebook Developer Console:\n');
  
  const appId = await question('Instagram App ID: ');
  const appSecret = await question('Instagram App Secret: ');
  const shortToken = await question('Short-lived Access Token (dal Token Generator): ');
  
  console.log('\n🔄 Conversione in Long-lived token...');
  
  // Convert to long-lived token
  const longTokenUrl = `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${appSecret}&access_token=${shortToken}`;
  
  https.get(longTokenUrl, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const result = JSON.parse(data);
        
        if (result.access_token) {
          console.log('\n✅ Long-lived token ottenuto!');
          console.log(`Token valido per: ${Math.floor(result.expires_in / 86400)} giorni\n`);
          
          console.log('📋 Aggiungi questi valori al file .env:\n');
          console.log(`INSTAGRAM_APP_ID=${appId}`);
          console.log(`INSTAGRAM_APP_SECRET=${appSecret}`);
          console.log(`INSTAGRAM_ACCESS_TOKEN=${result.access_token}`);
          
          console.log('\n🎯 Prossimi step:');
          console.log('1. Ottieni il tuo Instagram Business Account ID');
          console.log('2. Ottieni Facebook Page Access Token');
          console.log('3. Testa la pubblicazione con test-instagram-post.js');
          
        } else {
          console.error('❌ Errore:', result);
        }
      } catch (error) {
        console.error('❌ Errore nel parsing:', error);
      }
      
      rl.close();
    });
  }).on('error', (err) => {
    console.error('❌ Errore richiesta:', err);
    rl.close();
  });
}

setupInstagram();