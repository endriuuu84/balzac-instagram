// Leonardo.ai + Instagram Publisher for Balzac
require('dotenv').config();
const axios = require('axios');
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

class BalzacLeonardoPublisher {
  constructor() {
    this.leonardo = {
      apiKey: process.env.LEONARDO_API_KEY,
      baseURL: 'https://cloud.leonardo.ai/api/rest/v1',
      // Best models for food photography
      models: {
        dreamshaper: 'ac614f96-1082-45bf-be9d-757f2d31c174',
        realistic: 'e316348f-7773-490e-adcd-46757c738eb7',
        leonardo: '291be633-cb24-434f-898f-e662799936ad'
      }
    };
    
    this.instagram = {
      businessAccountId: process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID,
      accessToken: process.env.FACEBOOK_PAGE_ACCESS_TOKEN
    };
  }

  // Generate food image with Leonardo
  async generateFoodImage(dish, mealType) {
    const prompts = {
      breakfast: `${dish}, Italian breakfast, elegant bistrot, morning sunlight through window, marble table, fresh flowers, professional food photography, appetizing, warm colors, steam rising, high quality, detailed`,
      lunch: `${dish}, traditional Italian cuisine, rustic elegant presentation, natural lighting, wooden table, fresh herbs garnish, Michelin star plating, professional food photography, vibrant colors, appetizing`,
      aperitivo: `${dish}, Italian aperitivo hour, golden hour lighting, cocktail bar ambiance, elegant glassware, Modena skyline background, lifestyle photography, sophisticated, warm atmosphere`
    };

    console.log(`\n🎨 Generating ${mealType} image with Leonardo.ai...`);

    try {
      // Create generation
      const response = await axios.post(
        `${this.leonardo.baseURL}/generations`,
        {
          prompt: prompts[mealType],
          modelId: this.leonardo.models.dreamshaper,
          width: 768,
          height: 768,
          num_images: 1,
          guidance_scale: 7,
          num_inference_steps: 30,
          seed: Math.floor(Math.random() * 1000000)
        },
        {
          headers: {
            'Authorization': `Bearer ${this.leonardo.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const generationId = response.data.sdGenerationJob.generationId;
      console.log(`⏳ Generation ID: ${generationId}`);

      // Wait for completion
      const imageUrl = await this.waitForGeneration(generationId);
      console.log(`✅ Image ready: ${imageUrl}`);
      
      return imageUrl;

    } catch (error) {
      console.error('❌ Leonardo error:', error.response?.data || error.message);
      throw error;
    }
  }

  // Wait for Leonardo generation
  async waitForGeneration(generationId) {
    for (let i = 0; i < 30; i++) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const response = await axios.get(
        `${this.leonardo.baseURL}/generations/${generationId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.leonardo.apiKey}`
          }
        }
      );
      
      const generation = response.data.generations_by_pk;
      
      if (generation.status === 'COMPLETE') {
        return generation.generated_images[0].url;
      }
    }
    
    throw new Error('Generation timeout');
  }

  // Generate caption with GPT
  async generateCaption(dish, mealType) {
    console.log(`\n📝 Generating caption with GPT...`);
    
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{
        role: "system",
        content: "Sei il social media manager del Balzac Bistrot Modena. Crea caption Instagram brevi ed eleganti."
      }, {
        role: "user",
        content: `Caption per ${dish} (${mealType}). Max 120 caratteri, emoji, hashtag #BalzacBistrot #ModenaFood`
      }],
      temperature: 0.8
    });
    
    const caption = response.choices[0].message.content.trim();
    console.log(`✅ Caption: ${caption}`);
    return caption;
  }

  // Publish to Instagram
  async publishToInstagram(imageUrl, caption) {
    console.log(`\n📱 Publishing to Instagram...`);
    
    try {
      // Create media container
      const createMedia = await axios.post(
        `https://graph.facebook.com/v18.0/${this.instagram.businessAccountId}/media`,
        {
          image_url: imageUrl,
          caption: caption,
          access_token: this.instagram.accessToken
        }
      );
      
      await new Promise(resolve => setTimeout(resolve, 5000));
      
      // Publish
      const publish = await axios.post(
        `https://graph.facebook.com/v18.0/${this.instagram.businessAccountId}/media_publish`,
        {
          creation_id: createMedia.data.id,
          access_token: this.instagram.accessToken
        }
      );
      
      console.log(`✅ Published! Post ID: ${publish.data.id}`);
      return publish.data;
      
    } catch (error) {
      console.error('❌ Instagram error:', error.response?.data || error.message);
      throw error;
    }
  }

  // Main publish flow
  async publish(mealType) {
    const dishes = {
      breakfast: ['Cappuccino e Cornetto', 'French Toast ai Frutti di Bosco', 'Pancakes allo Sciroppo d\'Acero'],
      lunch: ['Tortellini in Brodo', 'Tagliatelle al Ragù', 'Risotto all\'Aceto Balsamico'],
      aperitivo: ['Spritz Balzac', 'Tagliere di Salumi DOP', 'Cocktail della Casa']
    };
    
    const dish = dishes[mealType][Math.floor(Math.random() * dishes[mealType].length)];
    
    console.log(`\n🚀 BALZAC LEONARDO PUBLISHER - ${mealType.toUpperCase()}`);
    console.log(`🍽️  Dish: ${dish}`);
    
    try {
      // Generate content
      const [imageUrl, caption] = await Promise.all([
        this.generateFoodImage(dish, mealType),
        this.generateCaption(dish, mealType)
      ]);
      
      // Publish
      await this.publishToInstagram(imageUrl, caption);
      
      console.log(`\n🎉 SUCCESS! Posted to @balzacmodena`);
      console.log(`💰 Credits used: ~50 Leonardo credits`);
      
    } catch (error) {
      console.error('❌ Publishing failed:', error.message);
    }
  }
}

// Main execution
async function main() {
  const publisher = new BalzacLeonardoPublisher();
  
  // Get meal type from args or time
  let mealType = process.argv[2];
  if (!mealType) {
    const hour = new Date().getHours();
    if (hour < 11) mealType = 'breakfast';
    else if (hour < 17) mealType = 'lunch';
    else mealType = 'aperitivo';
  }
  
  await publisher.publish(mealType);
}

if (require.main === module) {
  main();
}

module.exports = BalzacLeonardoPublisher;