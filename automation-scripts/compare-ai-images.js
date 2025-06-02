// Compare DALL-E 3 vs Leonardo.ai for Balzac
require('dotenv').config();
const OpenAI = require('openai');
const LeonardoFoodGenerator = require('./leonardo-food-generator');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function compareAIGenerators() {
  console.log('🔬 DALL-E 3 vs LEONARDO.AI COMPARISON\n');
  
  const dish = 'Tagliatelle al ragù bolognese con parmigiano grattugiato';
  
  console.log(`📍 Test dish: ${dish}\n`);
  
  // Test DALL-E 3
  console.log('🎨 DALL-E 3 Generation...');
  try {
    const dalleStart = Date.now();
    
    const dalleResponse = await openai.images.generate({
      model: "dall-e-3",
      prompt: `Professional food photography of ${dish}, elegant Italian restaurant, natural lighting, shallow depth of field, appetizing presentation, Instagram square format`,
      size: "1024x1024",
      quality: "hd"
    });
    
    const dalleTime = (Date.now() - dalleStart) / 1000;
    const dalleUrl = dalleResponse.data[0].url;
    
    console.log('✅ DALL-E 3 Complete');
    console.log(`⏱️  Time: ${dalleTime}s`);
    console.log(`💰 Cost: ~€0.04`);
    console.log(`🔗 URL: ${dalleUrl}\n`);
    
  } catch (error) {
    console.error('❌ DALL-E 3 failed:', error.message);
  }
  
  // Test Leonardo.ai (if API key exists)
  if (process.env.LEONARDO_API_KEY) {
    console.log('🎨 Leonardo.ai Generation...');
    try {
      const leonardoStart = Date.now();
      const leonardo = new LeonardoFoodGenerator();
      
      const leonardoResult = await leonardo.generateFoodImage(dish, 'lunch', {
        saveLocal: false
      });
      
      const leonardoTime = (Date.now() - leonardoStart) / 1000;
      
      console.log('✅ Leonardo.ai Complete');
      console.log(`⏱️  Time: ${leonardoTime}s`);
      console.log(`💰 Cost: ~€0.048 (based on €24/month for 500 images)`);
      console.log(`🔗 URL: ${leonardoResult.url}\n`);
      
    } catch (error) {
      console.error('❌ Leonardo.ai failed:', error.message);
    }
  } else {
    console.log('⚠️  Leonardo.ai skipped (no API key)\n');
  }
  
  // Comparison summary
  console.log('📊 COMPARISON SUMMARY:');
  console.log('┌─────────────────┬──────────────┬──────────────────┐');
  console.log('│ Feature         │ DALL-E 3     │ Leonardo.ai      │');
  console.log('├─────────────────┼──────────────┼──────────────────┤');
  console.log('│ Quality         │ Excellent    │ Excellent        │');
  console.log('│ Food Realism    │ Very Good    │ Specialized      │');
  console.log('│ Speed           │ 5-10s        │ 10-20s           │');
  console.log('│ Cost/image      │ €0.04        │ €0.048           │');
  console.log('│ Monthly (90img) │ €3.60        │ €24 (flat rate)  │');
  console.log('│ Style Control   │ Limited      │ Advanced         │');
  console.log('│ Italian Food    │ Good         │ Can specialize   │');
  console.log('└─────────────────┴──────────────┴──────────────────┘');
  
  console.log('\n💡 RECOMMENDATIONS:');
  console.log('• DALL-E 3: Best for quick, high-quality general food images');
  console.log('• Leonardo.ai: Best for consistent style, Italian food specialization');
  console.log('• Both: Use DALL-E for variety, Leonardo for signature dishes');
}

// Run comparison
compareAIGenerators();