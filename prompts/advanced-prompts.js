// Advanced OpenAI Prompts per Balzac Bistrot
// Integrati con Analytics Hashtag ROI in tempo reale

require('dotenv').config();
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

class BalzacAdvancedPrompts {
  constructor() {
    this.restaurantInfo = {
      name: 'Balzac Bistrot',
      location: 'Modena, Emilia-Romagna',
      style: 'Elegante bistrot francese-italiano',
      philosophy: 'Tradizione emiliana con raffinatezza contemporanea',
      atmosphere: 'Sofisticato ma accogliente, vista Piazza Grande',
      target: 'Food lovers, locali di Modena, turisti gourmet'
    };
  }

  // ========================================
  // COLAZIONE - Prompt Avanzato con ROI Analytics
  // ========================================
  
  async generateColazionePrompt(menuItems, hashtagAnalytics, timeContext) {
    const bestStrategy = hashtagAnalytics?.performance_summary?.best_performing_strategy || 'local_niche';
    const topHashtags = this.getTopHashtagsForStrategy(hashtagAnalytics, bestStrategy, 'colazione');
    const optimalTime = hashtagAnalytics?.optimal_posting_times || '08:00';
    
    const prompt = `
Crea una caption Instagram per la COLAZIONE al Balzac Bistrot Modena.

📍 CONTESTO RISTORANTE:
- Nome: ${this.restaurantInfo.name}
- Location: ${this.restaurantInfo.location} 
- Stile: ${this.restaurantInfo.style}
- Atmosfera: ${this.restaurantInfo.atmosphere}

🌅 MENU COLAZIONE OGGI:
${menuItems.items?.map(item => `- ${item.name}: ${item.description}`).join('\n') || '- Cornetti francesi appena sfornati\n- Cappuccino con latte art\n- Pain au chocolat'}

${menuItems.beverages ? `☕ BEVANDE:\n${menuItems.beverages.map(bev => `- ${bev.name}`).join('\n')}` : ''}

📊 STRATEGIA HASHTAG OTTIMIZZATA (ROI Analytics):
- Strategia migliore oggi: ${this.getStrategyName(bestStrategy)}
- Hashtag top performance: ${topHashtags.slice(0, 8).join(' ')}
- Orario ottimale: ${optimalTime}

🎯 OBIETTIVI CAPTION:
1. ENGAGEMENT: Usa emotion triggers per colazione (comfort, energia, tradizione)
2. LOCAL FOCUS: Enfatizza Modena e tradizione emiliana-francese
3. CALL TO ACTION: Invito sottile a venire ("Vi aspettiamo", "Iniziate la giornata con noi")
4. STAGIONALITÀ: ${this.getSeasonalContext()}

✍️ STILE RICHIESTO:
- Tono: Accogliente, raffinato, autentico
- Lunghezza: 120-180 caratteri (massimo 2 righe)
- Emoji: 2-3 selezionate con cura (🌅 ☕ 🥐)
- POV: Prima persona plurale ("Prepariamo", "Vi aspettiamo")

📱 HASHTAG STRATEGY:
Usa ESATTAMENTE questi hashtag (già ottimizzati per ROI):
${topHashtags.join(' ')}

🎨 ELEMENTI NARRATIVI:
- Momento del giorno: Prima mattina, energia positiva
- Sensazioni: Calore del forno, aroma del caffè
- Esperienza: Bistrot accogliente, qualità francese
- Benefit: Energia per iniziare la giornata

ESEMPIO STRUCTURE:
[Apertura emotiva] + [Prodotto/esperienza] + [Invito] + [Hashtag]

NON USARE:
- Hashtag generici (#food #breakfast #instafood)
- Cliché ("Il risveglio perfetto", "Buongiorno mondo")
- Superlative esagerati
- Inglese (solo italiano)
`;

    return this.generateWithOpenAI(prompt, 'colazione');
  }

  // ========================================
  // PRANZO - Prompt Avanzato con ROI Analytics  
  // ========================================
  
  async generatePranzoPrompt(menuItems, hashtagAnalytics, timeContext) {
    const bestStrategy = hashtagAnalytics?.performance_summary?.best_performing_strategy || 'local_niche';
    const topHashtags = this.getTopHashtagsForStrategy(hashtagAnalytics, bestStrategy, 'pranzo');
    const optimalTime = hashtagAnalytics?.optimal_posting_times || '13:00';
    
    const prompt = `
Crea una caption Instagram per il PRANZO al Balzac Bistrot Modena.

📍 CONTESTO RISTORANTE:
- Nome: ${this.restaurantInfo.name}
- Location: ${this.restaurantInfo.location}
- Philosophy: ${this.restaurantInfo.philosophy}
- Target: ${this.restaurantInfo.target}

🍝 MENU PRANZO OGGI:
${menuItems.items?.map(item => `- ${item.name}: ${item.description}`).join('\n') || '- Tortellini in brodo di cappone\n- Tagliatelle al ragù di mora romagnola\n- Risotto con lambrusco e squacquerone'}

${menuItems.salads ? `🥗 INSALATE:\n${menuItems.salads.map(sal => `- ${sal.name}`).join('\n')}` : ''}

📊 STRATEGIA HASHTAG OTTIMIZZATA (ROI Analytics):
- Strategia migliore: ${this.getStrategyName(bestStrategy)}
- Hashtag performance top: ${topHashtags.slice(0, 10).join(' ')}
- Best posting time: ${optimalTime}
- ROI Score: ${hashtagAnalytics?.performance_summary?.best_roi_score || 'N/A'}

🎯 OBIETTIVI CAPTION:
1. TRADIZIONE: Celebra l'heritage emiliano (tortellini, ragù, Parmigiano)
2. QUALITÀ: Emphasizza ingredienti di prima scelta e preparazione artigianale
3. TERRITORIO: Connessione forte con Modena e Emilia-Romagna  
4. EXPERTISE: Mostra competenza culinaria senza essere presuntuosi

✍️ STILE RICHIESTO:
- Tono: Orgoglioso, autentico, competente
- Lunghezza: 150-200 caratteri (massimo 3 righe)
- Emoji: 2-4 legate al territorio (🍝 🧀 🍷 🏰)
- POV: Storytelling in prima persona

📱 HASHTAG STRATEGY OTTIMIZZATA:
${topHashtags.join(' ')}

🎨 ELEMENTI NARRATIVI CHIAVE:
- Heritage: Ricette della tradizione, sapori di famiglia
- Territorio: Prodotti DOP, forniture locali
- Craftsmanship: Pasta fatta a mano, preparazioni tradizionali
- Momento: Pausa pranzo di qualità, coccolarsi a tavola

🏆 FOCUS SPECIALE:
- Prodotti di eccellenza: Parmigiano 24 mesi, Prosciutto San Daniele
- Tecniche tradizionali: Sfoglia tirata a mano, cotture lente
- Territorio: Fornitori locali, stagionalità
- Esperienza: Pranzo come momento di piacere

STRUCTURE VINCENTE:
[Heritage/Tradizione] + [Piatto specifico + dettaglio qualità] + [Invito experience] + [Hashtag]

NON USARE:
- Hashtag basic (#pasta #italianfood #foodporn)  
- Frasi commerciali dirette
- Aggettivi inflazionati ("fantastico", "incredibile")
- Inglese (tutto in italiano)
`;

    return this.generateWithOpenAI(prompt, 'pranzo');
  }

  // ========================================
  // APERITIVO - Prompt Avanzato con ROI Analytics
  // ========================================
  
  async generateAperitivoPrompt(menuItems, hashtagAnalytics, timeContext) {
    const bestStrategy = hashtagAnalytics?.performance_summary?.best_performing_strategy || 'local_niche';
    const topHashtags = this.getTopHashtagsForStrategy(hashtagAnalytics, bestStrategy, 'aperitivo');
    const optimalTime = hashtagAnalytics?.optimal_posting_times || '19:00';
    
    const prompt = `
Crea una caption Instagram per l'APERITIVO al Balzac Bistrot Modena.

📍 CONTESTO RISTORANTE:
- Nome: ${this.restaurantInfo.name}
- Location: ${this.restaurantInfo.location} - Vista Piazza Grande
- Stile: ${this.restaurantInfo.style}
- Atmosfera: Aperitivo di classe con vista sulla piazza storica

🍸 MENU APERITIVO OGGI:
${menuItems.items?.map(item => `- ${item.name}: ${item.description}`).join('\n') || '- Tagliere Opus Nera con salumi di suino nero\n- Gnocco fritto con mortadella\n- Selezione formaggi con mieli locali'}

🍷 COCKTAILS & DRINKS:
${menuItems.cocktails?.map(drink => `- ${drink.name}`).join('\n') || '- Spritz Balzac (ricetta speciale)\n- Lambrusco di Sorbara\n- Negroni con gin alle erbe'}

📊 STRATEGIA HASHTAG OTTIMIZZATA (ROI Analytics):
- Strategia top performance: ${this.getStrategyName(bestStrategy)}  
- Hashtag con ROI massimo: ${topHashtags.slice(0, 8).join(' ')}
- Golden hour posting: ${optimalTime}
- Engagement target: ${hashtagAnalytics?.performance_summary?.avg_engagement || 'High'}

🎯 OBIETTIVI CAPTION:
1. LIFESTYLE: Aperitivo come momento di qualità e socialità
2. LOCATION: Sfrutta la vista Piazza Grande come selling point
3. SOFISTICAZIONE: Cocktail curati, atmosfera ricercata
4. CONVIVIALITÀ: Invito a condividere il momento

✍️ STILE RICHIESTO:
- Tono: Sofisticato, conviviale, aspirazionale
- Lunghezza: 140-190 caratteri (2-3 righe max)
- Emoji: 2-3 selezionate (🍸 🌅 🏰 ✨)
- POV: Invito diretto ed emotivo

📱 HASHTAG STRATEGY PREMIUM:
${topHashtags.join(' ')}

🎨 ELEMENTI NARRATIVI VINCENTI:
- Golden Hour: Luce del tramonto, atmosfera magica
- Vista esclusiva: Piazza Grande, centro storico Modena
- Craft cocktails: Mixology di livello, ingredienti premium
- Social moment: Condivisione, connessione, pausa di qualità

🏆 FOCUS SPECIALE APERITIVO:
- Timing perfetto: Fine giornata, momento di relax
- Qualità bar: Cocktail artigianali, spirits selezionati
- Food pairing: Stuzzichini gourmet, salumi d'eccellenza
- Atmosphere: Bistrot chic con vista privilegiata

⏰ TIMING CONTEXT:
- Ora: ${optimalTime} (Golden hour optimization)
- Mood: Transizione giorno-sera, momento rilassante
- Target: After work, friends, romantic evening

STRUCTURE PERFETTA:
[Mood/Atmosfera] + [Signature drink/food + dettaglio] + [Vista/Location] + [Call to action emotivo] + [Hashtag]

ESEMPI TONI:
✅ "Mentre il sole tramonta su Piazza Grande..."
✅ "Il nostro Spritz Balzac e la vista più bella di Modena..."
✅ "Ogni tramonto merita un aperitivo speciale..."

NON USARE:
- Hashtag generici (#aperitivo #spritz #cocktails)
- Frasi banali ("L'aperitivo perfetto")
- Troppi superlativi
- Riferimenti commerciali diretti
`;

    return this.generateWithOpenAI(prompt, 'aperitivo');
  }

  // ========================================
  // UTILITY METHODS
  // ========================================

  async generateWithOpenAI(prompt, mealType) {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system", 
            content: `Sei il social media manager esperto del Balzac Bistrot Modena. 
            
            Scrivi caption Instagram che:
            - Convertono in visite reali al ristorante
            - Celebrano la tradizione emiliana con eleganza moderna  
            - Creano emotional connection con il territorio
            - Usano hashtag ottimizzati per ROI massimo
            - Evitano cliché e frasi fatte
            - Sono autentiche e mai commerciali
            
            Conosci perfettamente Modena, la cultura emiliana, e sai come parlare ai food lovers italiani.`
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 300,
        top_p: 0.9
      });

      return {
        caption: response.choices[0].message.content.trim(),
        meal_type: mealType,
        generated_at: new Date().toISOString(),
        model_used: "gpt-4o-mini",
        with_roi_analytics: true
      };
    } catch (error) {
      console.error(`Error generating ${mealType} prompt:`, error);
      throw error;
    }
  }

  // Extract top hashtags based on ROI analytics strategy
  getTopHashtagsForStrategy(analytics, strategy, mealType) {
    if (!analytics?.detailed_analysis?.[strategy]) {
      return this.getDefaultHashtags(mealType);
    }

    const strategyData = analytics.detailed_analysis[strategy];
    const recommendedMix = analytics.recommended_strategy;
    
    // Mix hashtags from best strategies
    const hashtags = [
      ...(recommendedMix?.ultra_niche || []).slice(0, 3),
      ...(recommendedMix?.local_niche || []).slice(0, 4), 
      ...(recommendedMix?.medium_engagement || []).slice(0, 3),
      ...(recommendedMix?.high_reach || []).slice(0, 2)
    ].map(tag => `#${tag}`);

    return hashtags.length > 0 ? hashtags : this.getDefaultHashtags(mealType);
  }

  getDefaultHashtags(mealType) {
    const defaults = {
      colazione: ['#balzacbistrot', '#modenacaffe', '#colazionemodena', '#cappuccino', '#cornetti', '#modena', '#colazione', '#breakfasttime'],
      pranzo: ['#balzacbistrot', '#tortellinimodena', '#modenafood', '#cucinaemiliana', '#pranzomodena', '#pasta', '#tortellini', '#emiliaromagna'],
      aperitivo: ['#balzacbistrot', '#aperitivomodena', '#spritzbalzac', '#modenabynight', '#aperitivo', '#cocktails', '#piazzagrande', '#modena']
    };
    return defaults[mealType] || defaults.aperitivo;
  }

  getStrategyName(strategy) {
    const names = {
      'high_reach': 'Alto Reach (massima visibilità)',
      'medium_engagement': 'Medio Engagement (bilanciato)',
      'local_niche': 'Nicchia Locale (Modena focus)',
      'ultra_niche': 'Ultra Nicchia (Brand specifico)'
    };
    return names[strategy] || strategy;
  }

  getSeasonalContext() {
    const month = new Date().getMonth();
    const seasonal = {
      0: 'Gennaio - comfort food, calore interno',
      1: 'Febbraio - preparazione primavera, ingredienti conservati',
      2: 'Marzo - primi prodotti freschi, rinascita',
      3: 'Aprile - primavera piena, verdure nuove',
      4: 'Maggio - stagione perfetta, prodotti peak',
      5: 'Giugno - estate inizia, terrazza aperta',
      6: 'Luglio - estate piena, aperitivi serali lunghi',
      7: 'Agosto - vacanze, atmosfera rilassata',
      8: 'Settembre - ritorno, vendemmia',
      9: 'Ottobre - autunno, funghi e tartufi',
      10: 'Novembre - comfort, primi freddi',
      11: 'Dicembre - festività, momenti speciali'
    };
    return seasonal[month] || 'Stagione di qualità';
  }
}

module.exports = { BalzacAdvancedPrompts };