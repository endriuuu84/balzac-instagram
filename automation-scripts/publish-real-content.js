// Publish Real Balzac Content to Instagram
require('dotenv').config();
const axios = require('axios');
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

class BalzacInstagramPublisher {
  constructor() {
    this.config = {
      businessAccountId: process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID,
      accessToken: process.env.FACEBOOK_PAGE_ACCESS_TOKEN,
      restaurant: 'Balzac Bistrot Modena'
    };
  }

  // Generate content based on meal type
  async generateContent(mealType) {
    const meals = {
      breakfast: {
        dishes: ['Cappuccino e Cornetto', 'French Toast ai Frutti di Bosco', 'Uova Benedict'],
        time: 'colazione',
        emoji: '☕🥐'
      },
      lunch: {
        dishes: ['Tortellini in Brodo', 'Tagliatelle al Ragù', 'Risotto all\'Aceto Balsamico'],
        time: 'pranzo',
        emoji: '🍝🍷'
      },
      aperitivo: {
        dishes: ['Spritz Balzac', 'Lambrusco e Parmigiano', 'Tigelle con Salumi'],
        time: 'aperitivo',
        emoji: '🥂✨'
      }
    };

    const meal = meals[mealType];
    const dish = meal.dishes[Math.floor(Math.random() * meal.dishes.length)];

    // Generate caption with OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{
        role: "system",
        content: "Sei il social media manager del Balzac Bistrot Modena. Crea caption Instagram brevi (max 150 char), eleganti e invitanti."
      }, {
        role: "user",
        content: `Crea una caption per ${meal.time} con ${dish}. Usa emoji: ${meal.emoji}. Include 3 hashtag: #BalzacBistrot #ModenaFood e uno specifico.`
      }],
      temperature: 0.8,
      max_tokens: 100
    });

    return {
      dish,
      caption: response.choices[0].message.content.trim(),
      imageUrl: this.getImageUrl(mealType)
    };
  }

  // Get appropriate stock image for meal type
  getImageUrl(mealType) {
    const images = {
      breakfast: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1080&h=1080&fit=crop', // Coffee & croissant
      lunch: 'https://images.unsplash.com/photo-1546549032-9571cd6b27df?w=1080&h=1080&fit=crop', // Pasta
      aperitivo: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=1080&h=1080&fit=crop' // Cocktails
    };
    return images[mealType];
  }

  // Publish to Instagram
  async publishToInstagram(content) {
    try {
      console.log('📱 Publishing to Instagram...');
      console.log('📝 Caption:', content.caption);
      console.log('🎨 Image:', content.imageUrl);
      console.log('');

      // Step 1: Create media container
      const createMediaResponse = await axios.post(
        `https://graph.facebook.com/v18.0/${this.config.businessAccountId}/media`,
        {
          image_url: content.imageUrl,
          caption: content.caption,
          access_token: this.config.accessToken
        }
      );

      const mediaContainerId = createMediaResponse.data.id;
      console.log('✅ Media container created:', mediaContainerId);

      // Wait for processing
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Step 2: Publish media
      const publishResponse = await axios.post(
        `https://graph.facebook.com/v18.0/${this.config.businessAccountId}/media_publish`,
        {
          creation_id: mediaContainerId,
          access_token: this.config.accessToken
        }
      );

      console.log('✅ Published successfully! Post ID:', publishResponse.data.id);
      return publishResponse.data;

    } catch (error) {
      console.error('❌ Error:', error.response?.data || error.message);
      throw error;
    }
  }

  // Main publishing flow
  async publish(mealType = 'lunch') {
    console.log(`🚀 Balzac Instagram Publisher - ${mealType.toUpperCase()}\n`);

    try {
      // Generate content
      console.log('🤖 Generating content with AI...');
      const content = await this.generateContent(mealType);
      console.log('✅ Content generated for:', content.dish);
      console.log('');

      // Publish to Instagram
      const result = await this.publishToInstagram(content);
      
      console.log('\n🎉 SUCCESS! Check @balzacmodena on Instagram');
      
      return result;

    } catch (error) {
      console.error('❌ Publishing failed:', error.message);
    }
  }
}

// Run based on time or command line argument
async function main() {
  const publisher = new BalzacInstagramPublisher();
  
  // Get meal type from command line or based on current time
  let mealType = process.argv[2];
  
  if (!mealType) {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 11) mealType = 'breakfast';
    else if (hour >= 11 && hour < 16) mealType = 'lunch';
    else mealType = 'aperitivo';
  }
  
  await publisher.publish(mealType);
}

// Export for use in automation
module.exports = BalzacInstagramPublisher;

// Run if called directly
if (require.main === module) {
  main();
}