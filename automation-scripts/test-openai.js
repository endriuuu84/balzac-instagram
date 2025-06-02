// Test OpenAI Integration for Balzac
// FIRST: Replace the API key in .env file with your new key

require('dotenv').config();
const OpenAI = require('openai');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Test function to generate Balzac-style content
async function testBalzacContent() {
  console.log('🚀 Testing OpenAI Integration for Balzac Bistrot...\n');
  
  try {
    // Test 1: Generate breakfast caption
    console.log('📝 Test 1: Generating breakfast caption...');
    const breakfastCaption = await generateCaption('breakfast', 'Cappuccino e Cornetto alla Crema');
    console.log('Result:', breakfastCaption);
    console.log('\n---\n');
    
    // Test 2: Generate lunch caption
    console.log('📝 Test 2: Generating lunch caption...');
    const lunchCaption = await generateCaption('lunch', 'Tortellini in Brodo');
    console.log('Result:', lunchCaption);
    console.log('\n---\n');
    
    // Test 3: Generate aperitivo caption
    console.log('📝 Test 3: Generating aperitivo caption...');
    const aperitivoCaption = await generateCaption('aperitivo', 'Spritz con vista Piazza Grande');
    console.log('Result:', aperitivoCaption);
    console.log('\n---\n');
    
    // Test 4: Generate food image prompt
    console.log('🎨 Test 4: Generating image prompt...');
    const imagePrompt = await generateImagePrompt('Tortellini in Brodo', 'lunch');
    console.log('DALL-E Prompt:', imagePrompt);
    console.log('\n---\n');
    
    // Test 5: Analyze competitor strategy
    console.log('🔍 Test 5: Generating competitor analysis...');
    const analysis = await analyzeCompetitorStrategy();
    console.log('Analysis:', analysis);
    
    console.log('\n✅ All tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n⚠️  Make sure to:');
    console.log('1. Add your OpenAI API key to .env file');
    console.log('2. Check your API key has GPT-4 access');
    console.log('3. Verify you have sufficient credits');
  }
}

// Function to generate Balzac-style captions
async function generateCaption(mealType, dish) {
  const prompts = {
    breakfast: `Genera una caption Instagram per la colazione al Balzac Bistrot Modena.
Piatto: ${dish}
Stile: Elegante ma accogliente, tradizione modenese con twist moderno
Tono: Friendly, invitante, sofisticato
Include: 1-2 emoji, 3-4 hashtag locali
Lunghezza: Max 150 caratteri
Lingua: Italiano`,
    
    lunch: `Genera una caption Instagram per il pranzo al Balzac Bistrot Modena.
Piatto: ${dish}
Stile: Celebra la tradizione emiliana, qualità premium
Tono: Orgoglioso della tradizione, moderno nell'approccio
Include: 2-3 emoji, 4-5 hashtag (mix locale/food)
Lunghezza: Max 150 caratteri
Lingua: Italiano`,
    
    aperitivo: `Genera una caption Instagram per l'aperitivo al Balzac Bistrot Modena.
Piatto: ${dish}
Stile: Aperitivo italiano elegante, atmosfera Piazza Grande
Tono: Sofisticato, invitante, social
Include: 2-3 emoji, 4-5 hashtag trending
Lunghezza: Max 150 caratteri
Lingua: Italiano`
  };
  
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "Sei il social media manager del Balzac Bistrot, un elegante bistrot nel cuore di Modena. Il tuo stile è sofisticato ma accessibile, celebri la tradizione culinaria emiliana con un tocco contemporaneo."
      },
      {
        role: "user",
        content: prompts[mealType]
      }
    ],
    temperature: 0.8,
    max_tokens: 200
  });
  
  return response.choices[0].message.content;
}

// Function to generate DALL-E image prompts
async function generateImagePrompt(dish, mealType) {
  const lightingMap = {
    breakfast: "soft morning light through window",
    lunch: "bright natural daylight",
    aperitivo: "warm golden hour lighting"
  };
  
  const prompt = `Professional food photography of ${dish}, 
    elegant Italian bistrot setting, 
    ${lightingMap[mealType]}, 
    shallow depth of field, 
    styled by Michelin restaurant, 
    Instagram square format, 
    appetizing and luxurious, 
    Modena Italy ambiance`;
  
  return prompt;
}

// Function to analyze competitor strategy
async function analyzeCompetitorStrategy() {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "Sei un esperto di social media marketing per ristoranti italiani."
      },
      {
        role: "user",
        content: `Analizza brevemente la strategia Instagram ideale per un bistrot elegante a Modena, considerando:
        1. Orari ottimali di pubblicazione
        2. Tipo di contenuto che funziona meglio
        3. Hashtag strategici per Modena
        4. Come differenziarsi dalla concorrenza
        Rispondi in modo conciso e actionable.`
      }
    ],
    temperature: 0.7,
    max_tokens: 300
  });
  
  return response.choices[0].message.content;
}

// Run tests
testBalzacContent();

// Instructions for user
console.log('\n📌 NEXT STEPS:');
console.log('1. Create a new OpenAI API key at platform.openai.com');
console.log('2. Add it to the .env file');
console.log('3. Run this test again: node automation-scripts/test-openai.js');
console.log('4. Once working, proceed with full automation setup');