// Balzac Content Generator - Production Ready
require('dotenv').config();
const OpenAI = require('openai');
const fs = require('fs').promises;
const path = require('path');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

class BalzacContentGenerator {
  constructor() {
    this.restaurantInfo = {
      name: 'Balzac Bistrot',
      location: 'Modena',
      style: 'Elegante bistrot italiano con twist moderno',
      specialties: {
        breakfast: ['Cappuccino e Cornetti', 'French Toast', 'Uova Benedict'],
        lunch: ['Tortellini in Brodo', 'Tagliatelle al Ragù', 'Risotto Balsamico'],
        aperitivo: ['Spritz Balzac', 'Lambrusco Selection', 'Tigelle e Salumi']
      }
    };
  }

  // Generate caption for specific meal and dish
  async generateCaption(mealType, dish) {
    const prompts = {
      breakfast: `Genera una caption Instagram per la colazione al ${this.restaurantInfo.name} ${this.restaurantInfo.location}.
Piatto: ${dish}
Stile: ${this.restaurantInfo.style}
Tono: Accogliente, raffinato ma non pretenzioso
Lunghezza: 100-150 caratteri
Include: 2-3 emoji appropriate, 3-4 hashtag locali
NON includere hashtag generici come #food o #instafood
Esempi hashtag: #BalzacBistrot #ModenaBreakfast #ColazioneModena`,

      lunch: `Genera una caption Instagram per il pranzo al ${this.restaurantInfo.name} ${this.restaurantInfo.location}.
Piatto: ${dish}
Stile: Celebra la tradizione emiliana con eleganza moderna
Tono: Orgoglioso della qualità, invitante
Lunghezza: 100-150 caratteri
Include: 2-3 emoji appropriate, 4-5 hashtag mix locale/specialità
Focus: Ingredienti locali, tradizione, qualità
Esempi hashtag: #BalzacBistrot #ModenaFood #CucinaEmiliana`,

      aperitivo: `Genera una caption Instagram per l'aperitivo al ${this.restaurantInfo.name} ${this.restaurantInfo.location}.
Piatto/Drink: ${dish}
Stile: Aperitivo italiano elegante, atmosfera Piazza Grande
Tono: Sofisticato, conviviale, Instagram-worthy
Lunghezza: 100-150 caratteri
Include: 2-3 emoji appropriate, 4-5 hashtag trending aperitivo
Focus: Atmosfera, socialità, qualità
Esempi hashtag: #BalzacAperitivo #AperitivoModena #ModenaNight`
    };

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "Sei il social media manager del Balzac Bistrot Modena. Crei caption brevi, eleganti e invitanti che celebrano la cucina emiliana con un tocco moderno. Non usare mai cliché o frasi fatte."
          },
          {
            role: "user",
            content: prompts[mealType]
          }
        ],
        temperature: 0.8,
        max_tokens: 200
      });

      return response.choices[0].message.content.trim();
    } catch (error) {
      console.error('Error generating caption:', error);
      throw error;
    }
  }

  // Generate image prompt for DALL-E or Leonardo.ai
  async generateImagePrompt(dish, mealType) {
    const settings = {
      breakfast: {
        lighting: "soft morning light, warm tones",
        style: "cozy Italian bistrot breakfast",
        props: "elegant table setting, fresh flowers"
      },
      lunch: {
        lighting: "bright natural daylight, vibrant colors",
        style: "traditional Italian lunch presentation",
        props: "rustic table, traditional ceramics"
      },
      aperitivo: {
        lighting: "golden hour lighting, warm ambiance",
        style: "sophisticated Italian aperitivo setup",
        props: "elegant glasses, Modena cityscape background"
      }
    };

    const setting = settings[mealType];
    
    const prompt = `Professional food photography of ${dish}, 
${setting.style}, 
${setting.lighting}, 
${setting.props},
shot from 45-degree angle,
shallow depth of field,
Instagram square format 1:1,
ultra realistic, appetizing,
Balzac Bistrot Modena ambiance,
high-end restaurant photography style`;

    return prompt;
  }

  // Generate weekly content plan
  async generateWeeklyPlan() {
    const weekDays = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'];
    const plan = {};

    for (const day of weekDays) {
      plan[day] = {
        breakfast: this.getRandomDish('breakfast'),
        lunch: this.getRandomDish('lunch'),
        aperitivo: this.getRandomDish('aperitivo')
      };
    }

    // Generate captions for the entire week
    const weeklyContent = {};
    
    for (const [day, meals] of Object.entries(plan)) {
      weeklyContent[day] = {};
      
      for (const [mealType, dish] of Object.entries(meals)) {
        weeklyContent[day][mealType] = {
          dish: dish,
          caption: await this.generateCaption(mealType, dish),
          imagePrompt: await this.generateImagePrompt(dish, mealType),
          postTime: this.getOptimalPostTime(mealType)
        };
      }
    }

    return weeklyContent;
  }

  // Get random dish for meal type
  getRandomDish(mealType) {
    const dishes = this.restaurantInfo.specialties[mealType];
    return dishes[Math.floor(Math.random() * dishes.length)];
  }

  // Get optimal posting time
  getOptimalPostTime(mealType) {
    const times = {
      breakfast: '08:15',
      lunch: '12:30',
      aperitivo: '18:45'
    };
    return times[mealType];
  }

  // Save content to file
  async saveContent(content, filename) {
    const dir = path.join(__dirname, '../generated-content');
    await fs.mkdir(dir, { recursive: true });
    
    const filepath = path.join(dir, filename);
    await fs.writeFile(filepath, JSON.stringify(content, null, 2));
    
    console.log(`✅ Content saved to: ${filepath}`);
    return filepath;
  }

  // Generate and display sample content
  async generateSampleContent() {
    console.log('🚀 Generating Balzac sample content...\n');

    // Generate content for each meal type
    const mealTypes = ['breakfast', 'lunch', 'aperitivo'];
    const sampleContent = {};

    for (const mealType of mealTypes) {
      const dish = this.getRandomDish(mealType);
      console.log(`\n📱 ${mealType.toUpperCase()} - ${dish}`);
      console.log('━'.repeat(50));

      const caption = await this.generateCaption(mealType, dish);
      const imagePrompt = await this.generateImagePrompt(dish, mealType);

      console.log('📝 Caption:', caption);
      console.log('🎨 Image Prompt:', imagePrompt.substring(0, 100) + '...');

      sampleContent[mealType] = {
        dish,
        caption,
        imagePrompt,
        postTime: this.getOptimalPostTime(mealType)
      };
    }

    return sampleContent;
  }
}

// Run generator
async function main() {
  const generator = new BalzacContentGenerator();

  try {
    // Generate sample content
    const sampleContent = await generator.generateSampleContent();
    
    // Save to file
    const timestamp = new Date().toISOString().split('T')[0];
    await generator.saveContent(sampleContent, `balzac-content-${timestamp}.json`);

    console.log('\n\n✅ SUCCESS! Content generation working perfectly!');
    console.log('\n🎯 Next steps:');
    console.log('1. Connect Instagram Graph API');
    console.log('2. Set up automatic posting');
    console.log('3. Add image generation with Leonardo.ai');
    console.log('4. Enable full automation');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Export for use in other scripts
module.exports = BalzacContentGenerator;

// Run if called directly
if (require.main === module) {
  main();
}