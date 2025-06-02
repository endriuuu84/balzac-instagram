// Publish to Instagram with DALL-E 3 Generated Images
require('dotenv').config();
const axios = require('axios');
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

class BalzacAIPublisher {
  constructor() {
    this.config = {
      businessAccountId: process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID,
      accessToken: process.env.FACEBOOK_PAGE_ACCESS_TOKEN
    };
  }

  // Generate both caption and image with AI
  async generateAIContent(mealType) {
    const meals = {
      breakfast: {
        dishes: ['Cappuccino e Cornetto alla Crema', 'French Toast ai Frutti di Bosco', 'Uova Benedict alla Modenese'],
        prompt: 'elegant Italian bistrot breakfast, soft morning light, marble table'
      },
      lunch: {
        dishes: ['Tortellini in Brodo', 'Tagliatelle al Ragù Bolognese', 'Risotto all\'Aceto Balsamico di Modena'],
        prompt: 'traditional Italian lunch, rustic elegance, natural daylight'
      },
      aperitivo: {
        dishes: ['Spritz Balzac', 'Lambrusco con Parmigiano 36 mesi', 'Cocktail della Casa'],
        prompt: 'Italian aperitivo hour, golden sunset, Modena skyline view'
      }
    };

    const meal = meals[mealType];
    const dish = meal.dishes[Math.floor(Math.random() * meal.dishes.length)];

    console.log(`\n🍽️  Piatto selezionato: ${dish}`);

    // Generate caption
    console.log('📝 Generando caption con GPT...');
    const captionResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{
        role: "system",
        content: "Sei il social media manager del Balzac Bistrot Modena. Crea caption Instagram brevi, eleganti e invitanti che celebrano la cucina emiliana."
      }, {
        role: "user",
        content: `Caption per ${dish}. Max 120 caratteri. Include emoji e 3-4 hashtag: #BalzacBistrot #ModenaFood + specifici.`
      }],
      temperature: 0.8
    });
    const caption = captionResponse.choices[0].message.content.trim();
    console.log('✅ Caption:', caption);

    // Generate image with DALL-E 3
    console.log('🎨 Generando immagine con DALL-E 3...');
    const imageResponse = await openai.images.generate({
      model: "dall-e-3",
      prompt: `Professional food photography of ${dish}, ${meal.prompt}, Instagram square format, photorealistic, appetizing, luxury restaurant presentation, Balzac Bistrot Modena`,
      size: "1024x1024",
      quality: "hd",
      style: "natural"
    });
    const imageUrl = imageResponse.data[0].url;
    console.log('✅ Immagine generata!');

    return { dish, caption, imageUrl };
  }

  // Publish to Instagram
  async publishToInstagram(content) {
    try {
      console.log('\n📱 Pubblicazione su Instagram...');

      // Create media container
      const createMedia = await axios.post(
        `https://graph.facebook.com/v18.0/${this.config.businessAccountId}/media`,
        {
          image_url: content.imageUrl,
          caption: content.caption,
          access_token: this.config.accessToken
        }
      );

      console.log('⏳ Processamento immagine...');
      await new Promise(resolve => setTimeout(resolve, 5000));

      // Publish
      const publish = await axios.post(
        `https://graph.facebook.com/v18.0/${this.config.businessAccountId}/media_publish`,
        {
          creation_id: createMedia.data.id,
          access_token: this.config.accessToken
        }
      );

      console.log('✅ Pubblicato! Post ID:', publish.data.id);
      return publish.data;

    } catch (error) {
      console.error('❌ Errore pubblicazione:', error.response?.data || error.message);
      throw error;
    }
  }

  // Main flow
  async publishAIPost(mealType) {
    console.log(`🚀 BALZAC AI PUBLISHER - ${mealType.toUpperCase()}`);
    console.log('━'.repeat(50));

    try {
      // Generate AI content
      const content = await this.generateAIContent(mealType);
      
      // Publish to Instagram
      await this.publishToInstagram(content);
      
      console.log('\n🎉 SUCCESSO! Post pubblicato su @balzacmodena');
      console.log('🤖 100% generato con AI (testo + immagine)');
      
    } catch (error) {
      console.error('❌ Errore:', error.message);
    }
  }
}

// Determine meal type based on time
function getMealType() {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 11) return 'breakfast';
  if (hour >= 11 && hour < 17) return 'lunch';
  return 'aperitivo';
}

// Main execution
async function main() {
  const publisher = new BalzacAIPublisher();
  const mealType = process.argv[2] || getMealType();
  
  await publisher.publishAIPost(mealType);
}

if (require.main === module) {
  main();
}

module.exports = BalzacAIPublisher;