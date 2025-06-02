// Quick Webhook for Make.com Integration
// Deploy this on Vercel for free: vercel.com

const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Dishes database
const dishes = {
  breakfast: [
    'Cappuccino e Cornetto alla Crema',
    'French Toast con Frutti di Bosco e Sciroppo d\'Acero',
    'Uova Benedict alla Modenese con Prosciutto DOP',
    'Pancakes con Ricotta e Miele di Castagno',
    'Croissant Salato con Mortadella IGP'
  ],
  lunch: [
    'Tortellini in Brodo della Tradizione',
    'Tagliatelle al Ragù Bolognese',
    'Risotto all\'Aceto Balsamico di Modena',
    'Lasagne Verdi alla Bolognese',
    'Gramigna con Salsiccia e Panna'
  ],
  aperitivo: [
    'Spritz Balzac con Vista Piazza Grande',
    'Lambrusco Selezione con Parmigiano 36 Mesi',
    'Cocktail della Casa con Tigelle',
    'Aperitivo Gourmet con Gnocco Fritto',
    'Hugo Spritz con Specialità Emiliane'
  ]
};

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { mealType = 'lunch', apiKey } = req.body;
    
    // Verify API key if provided
    if (apiKey && apiKey !== process.env.WEBHOOK_API_KEY) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    // Select random dish
    const dishList = dishes[mealType] || dishes.lunch;
    const dish = dishList[Math.floor(Math.random() * dishList.length)];
    
    console.log(`Generating content for ${mealType}: ${dish}`);
    
    // Generate caption
    const captionResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{
        role: "system",
        content: "Sei il social media manager del Balzac Bistrot Modena. Crea caption Instagram brevi ed eleganti."
      }, {
        role: "user",
        content: `Caption per ${dish}. Max 120 caratteri. Include emoji e hashtag: #BalzacBistrot #ModenaFood`
      }],
      temperature: 0.8
    });
    
    const caption = captionResponse.choices[0].message.content.trim();
    
    // Generate image
    const imagePrompts = {
      breakfast: `${dish}, elegant Italian breakfast, morning light, marble table, professional food photography`,
      lunch: `${dish}, traditional Italian lunch, rustic table, natural light, appetizing presentation`,
      aperitivo: `${dish}, Italian aperitivo hour, golden light, elegant setup, Modena atmosphere`
    };
    
    const imageResponse = await openai.images.generate({
      model: "dall-e-3",
      prompt: imagePrompts[mealType],
      size: "1024x1024",
      quality: "hd"
    });
    
    const imageUrl = imageResponse.data[0].url;
    
    // Return formatted response for Make.com
    res.status(200).json({
      success: true,
      mealType,
      dish,
      caption,
      imageUrl,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      fallback: {
        caption: "Gustando la tradizione al Balzac Bistrot 🍝 #BalzacBistrot #ModenaFood",
        imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1080"
      }
    });
  }
};

// For local testing
if (require.main === module) {
  const express = require('express');
  const app = express();
  app.use(express.json());
  
  app.post('/api/webhook', module.exports);
  
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Webhook server running on port ${PORT}`);
    console.log(`Test with: curl -X POST http://localhost:${PORT}/api/webhook -H "Content-Type: application/json" -d '{"mealType":"lunch"}'`);
  });
}