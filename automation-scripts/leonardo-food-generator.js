// Leonardo.ai Food Photography Generator for Balzac
require('dotenv').config();
const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

class LeonardoFoodGenerator {
  constructor(apiKey) {
    this.apiKey = apiKey || process.env.LEONARDO_API_KEY;
    this.baseURL = 'https://cloud.leonardo.ai/api/rest/v1';
    this.models = {
      photoreal: '6bef9f1b-29cb-40c7-b9df-32b51c1f67d3',
      diffusion: '1e60896f-3c26-4296-8ecc-53e2afecc132'
    };
  }

  // Generate food image with Leonardo
  async generateFoodImage(dish, mealType, options = {}) {
    const prompts = this.getFoodPrompts(dish, mealType);
    const settings = this.getOptimalSettings(mealType);
    
    console.log(`🎨 Generating ${mealType} image for: ${dish}`);
    console.log(`📝 Prompt: ${prompts.prompt.substring(0, 100)}...`);
    
    try {
      // Remove non-API parameters
      const { saveLocal, ...apiOptions } = options;
      
      // Step 1: Create generation
      const generation = await this.createGeneration({
        prompt: prompts.prompt,
        negative_prompt: prompts.negative,
        ...settings,
        ...apiOptions
      });
      
      console.log(`⏳ Generation started: ${generation.sdGenerationJob.generationId}`);
      
      // Step 2: Wait for completion
      const result = await this.waitForGeneration(generation.sdGenerationJob.generationId);
      
      // Step 3: Get image URL
      const imageUrl = result.generations[0].url;
      console.log(`✅ Image generated: ${imageUrl}`);
      
      // Optional: Download locally
      if (saveLocal) {
        const filename = await this.saveImageLocally(imageUrl, dish, mealType);
        console.log(`💾 Saved: ${filename}`);
      }
      
      return {
        url: imageUrl,
        id: result.generations[0].id,
        prompt: prompts.prompt,
        settings: settings
      };
      
    } catch (error) {
      console.error('❌ Leonardo API Error:', error.response?.data || error.message);
      throw error;
    }
  }

  // Get optimized prompts for food photography
  getFoodPrompts(dish, mealType) {
    const prompts = {
      breakfast: {
        base: `${dish}, elegant Italian breakfast setting, professional food photography, marble table with fresh flowers, soft morning window light streaming in, steam rising, `,
        style: `shot with 85mm lens, shallow depth of field, warm color grading, inviting atmosphere, fine dining presentation, bakery fresh, artisanal quality`,
        negative: `blurry, amateur, artificial lighting, messy, unappetizing, cartoon, illustration, text, watermark, oversaturated, plastic looking`
      },
      lunch: {
        base: `${dish}, traditional Italian lunch presentation, Michelin star food photography, rustic wooden table, natural daylight, `,
        style: `perfectly plated, fresh herbs garnish, 45-degree angle, appetizing steam, rich textures, authentic Italian trattoria ambiance, Modena tradition`,
        negative: `poor lighting, amateur photo, fake looking, processed food, bad presentation, illustration, low quality, cluttered composition`
      },
      aperitivo: {
        base: `${dish}, Italian aperitivo hour setting, cocktail photography, golden hour lighting, elegant bar setup, `,
        style: `condensation on glass, bokeh background, lifestyle photography, sophisticated presentation, rooftop terrace view, Italian dolce vita mood`,
        negative: `bad lighting, amateur, artificial, stock photo feel, messy, poor composition, cartoon style, unrealistic`
      }
    };
    
    const prompt = prompts[mealType];
    return {
      prompt: `${prompt.base}${prompt.style}, ultra realistic, 8k quality, award winning food photography`,
      negative: prompt.negative
    };
  }

  // Get optimal Leonardo settings per meal type
  getOptimalSettings(mealType) {
    const settings = {
      breakfast: {
        modelId: this.models.photoreal,
        num_images: 1,
        width: 1024,
        height: 1024,
        guidance_scale: 7,
        init_strength: 0.55,
        scheduler: 'LEONARDO',
        presetStyle: 'LEONARDO',
        alchemy: true,
        photoReal: true,
        photoRealStrength: 0.55,
        promptMagic: true,
        promptMagicVersion: 'v3',
        seed: Math.floor(Math.random() * 1000000)
      },
      lunch: {
        modelId: this.models.photoreal,
        num_images: 1,
        width: 1024,
        height: 1024,
        guidance_scale: 8,
        init_strength: 0.65,
        scheduler: 'LEONARDO',
        presetStyle: 'CINEMATIC',
        alchemy: true,
        photoReal: true,
        photoRealStrength: 0.65,
        contrastRatio: 0.8,
        highContrast: true,
        seed: Math.floor(Math.random() * 1000000)
      },
      aperitivo: {
        modelId: this.models.photoreal,
        num_images: 1,
        width: 1024,
        height: 1024,
        guidance_scale: 7.5,
        init_strength: 0.5,
        scheduler: 'LEONARDO',
        presetStyle: 'DYNAMIC',
        alchemy: true,
        photoReal: true,
        photoRealStrength: 0.5,
        expandedDomain: true,
        seed: Math.floor(Math.random() * 1000000)
      }
    };
    
    return settings[mealType] || settings.lunch;
  }

  // Create generation via API
  async createGeneration(params) {
    const response = await axios.post(
      `${this.baseURL}/generations`,
      params,
      {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    return response.data;
  }

  // Wait for generation to complete
  async waitForGeneration(generationId, maxAttempts = 30) {
    for (let i = 0; i < maxAttempts; i++) {
      const response = await axios.get(
        `${this.baseURL}/generations/${generationId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`
          }
        }
      );
      
      const generation = response.data.generations_by_pk;
      
      if (generation.status === 'COMPLETE') {
        return generation;
      } else if (generation.status === 'FAILED') {
        throw new Error('Generation failed: ' + generation.error);
      }
      
      // Wait 2 seconds before next check
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    throw new Error('Generation timeout');
  }

  // Save image locally
  async saveImageLocally(imageUrl, dish, mealType) {
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    
    const dir = path.join(__dirname, '../generated-content/leonardo');
    await fs.mkdir(dir, { recursive: true });
    
    const filename = `balzac-${mealType}-${dish.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.jpg`;
    const filepath = path.join(dir, filename);
    
    await fs.writeFile(filepath, response.data);
    return filename;
  }

  // Generate variations of a dish
  async generateVariations(dish, mealType, count = 3) {
    console.log(`🎨 Generating ${count} variations for ${dish}...`);
    
    const variations = [];
    const baseSettings = this.getOptimalSettings(mealType);
    
    for (let i = 0; i < count; i++) {
      // Vary some parameters for diversity
      const settings = {
        ...baseSettings,
        seed: Math.floor(Math.random() * 1000000),
        guidance_scale: baseSettings.guidance_scale + (Math.random() - 0.5),
        photoRealStrength: baseSettings.photoRealStrength + (Math.random() - 0.5) * 0.1
      };
      
      try {
        const result = await this.generateFoodImage(dish, mealType, {
          ...settings,
          saveLocal: true
        });
        variations.push(result);
        
        console.log(`✅ Variation ${i + 1} complete`);
        
        // Wait between generations
        await new Promise(resolve => setTimeout(resolve, 3000));
        
      } catch (error) {
        console.error(`❌ Variation ${i + 1} failed:`, error.message);
      }
    }
    
    return variations;
  }
}

// Test the generator
async function testLeonardoFood() {
  // Check if API key exists
  if (!process.env.LEONARDO_API_KEY) {
    console.log('❌ LEONARDO_API_KEY not found in .env');
    console.log('\n📝 To get your API key:');
    console.log('1. Go to leonardo.ai');
    console.log('2. Sign up for Artisan plan (€24/month)');
    console.log('3. Dashboard → API → Create API Key');
    console.log('4. Add to .env: LEONARDO_API_KEY=your_key_here');
    return;
  }
  
  const generator = new LeonardoFoodGenerator();
  
  console.log('🚀 LEONARDO.AI FOOD GENERATOR TEST\n');
  
  // Test dishes
  const tests = [
    { dish: 'Cappuccino con schiuma perfetta e cornetto alla crema', type: 'breakfast' },
    { dish: 'Tortellini in brodo fumante con Parmigiano', type: 'lunch' },
    { dish: 'Aperol Spritz con olive e stuzzichini', type: 'aperitivo' }
  ];
  
  for (const test of tests) {
    console.log(`\n${'='.repeat(60)}`);
    try {
      const result = await generator.generateFoodImage(test.dish, test.type, {
        saveLocal: true
      });
      
      console.log('\n📊 Generation complete!');
      console.log('🔗 URL:', result.url);
      console.log('🆔 ID:', result.id);
      
    } catch (error) {
      console.error('Test failed:', error.message);
    }
    
    // Wait between tests
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
  
  console.log('\n✅ All tests completed!');
}

// Export for use in other modules
module.exports = LeonardoFoodGenerator;

// Run test if called directly
if (require.main === module) {
  testLeonardoFood();
}