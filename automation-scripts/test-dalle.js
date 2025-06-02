// Test DALL-E 3 Image Generation for Balzac
require('dotenv').config();
const OpenAI = require('openai');
const fs = require('fs');
const axios = require('axios');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function generateBalzacImage(dish, mealType) {
  console.log(`🎨 Generating DALL-E 3 image for: ${dish}\n`);
  
  const prompts = {
    breakfast: `Professional food photography of ${dish}, elegant Italian bistrot breakfast setting, soft morning light streaming through window, marble table, fresh flowers, Modena Italy ambiance, shallow depth of field, Instagram square format, appetizing, luxury restaurant style, photorealistic`,
    
    lunch: `Professional food photography of ${dish}, traditional Italian lunch presentation, bright natural daylight, rustic wooden table, elegant plating, Modena bistrot setting, vibrant colors, shallow depth of field, Instagram square format, Michelin star quality, photorealistic`,
    
    aperitivo: `Professional food photography of ${dish}, sophisticated Italian aperitivo setup, golden hour lighting, elegant glasses, Modena cityscape visible through window, cocktail bar ambiance, premium presentation, Instagram square format, lifestyle photography, photorealistic`
  };

  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompts[mealType],
      n: 1,
      size: "1024x1024",
      quality: "hd",
      style: "natural"
    });

    const imageUrl = response.data[0].url;
    console.log('✅ Image generated:', imageUrl);
    
    // Download and save locally
    const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const filename = `balzac-${mealType}-${Date.now()}.png`;
    fs.writeFileSync(`generated-content/${filename}`, imageResponse.data);
    console.log('💾 Saved locally as:', filename);
    
    return imageUrl;
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response?.status === 400) {
      console.log('\n⚠️  DALL-E 3 requires specific subscription or credits');
      console.log('Alternative: Use DALL-E 2 with model: "dall-e-2"');
    }
  }
}

// Test all meal types
async function testAllMealTypes() {
  console.log('🚀 TESTING DALL-E 3 FOR BALZAC BISTROT\n');
  
  const tests = [
    { dish: 'Cappuccino e Cornetto alla Crema', type: 'breakfast' },
    { dish: 'Tortellini in Brodo della Tradizione', type: 'lunch' },
    { dish: 'Spritz Balzac con Vista Piazza Grande', type: 'aperitivo' }
  ];
  
  for (const test of tests) {
    console.log(`\n${'='.repeat(50)}`);
    await generateBalzacImage(test.dish, test.type);
    console.log('Waiting 5 seconds before next generation...');
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
  
  console.log('\n✅ All tests completed!');
}

// Create directory if doesn't exist
if (!fs.existsSync('generated-content')) {
  fs.mkdirSync('generated-content');
}

// Run tests
testAllMealTypes();