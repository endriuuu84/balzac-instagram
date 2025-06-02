# 🎨 LEONARDO.AI - SETUP PER FOOD PHOTOGRAPHY

## PERCHÉ LEONARDO.AI?
- **Modelli specializzati** in food photography
- **Più controllo** su stile e consistenza
- **Costo inferiore** a DALL-E 3 (€24 vs €150/mese)
- **PhotoReal** per immagini ultra-realistiche

## STEP 1: REGISTRAZIONE

1. Vai su [leonardo.ai](https://leonardo.ai)
2. Registrati con email
3. Scegli piano **Artisan** (€24/mese)
   - 25,000 tokens/mese
   - Accesso a PhotoReal e Alchemy
   - ~500 immagini HD/mese

## STEP 2: OTTIENI API KEY

1. Dashboard → API → API Access
2. Click "Create API Key"
3. Nome: "Balzac Food Photography"
4. Copia la key: `leonardo_api_xxxxx`

## STEP 3: MODELLI CONSIGLIATI PER FOOD

### 1. LEONARDO PHOTOREAL V2
- Best per: Fotografia realistica cibo
- Stile: Professional food photography
- ID: `6bef9f1b-29cb-40c7-b9df-32b51c1f67d3`

### 2. LEONARDO DIFFUSION XL
- Best per: Versatilità e dettagli
- Stile: High quality, artistic
- ID: `1e60896f-3c26-4296-8ecc-53e2afecc132`

### 3. FOOD & BEVERAGE CUSTOM
- Best per: Specializzato in cibo italiano
- Training: Custom su piatti italiani

## STEP 4: CONFIGURAZIONE API

```javascript
// leonardo-config.js
const LEONARDO_CONFIG = {
  apiKey: process.env.LEONARDO_API_KEY,
  models: {
    photoreal: '6bef9f1b-29cb-40c7-b9df-32b51c1f67d3',
    diffusion: '1e60896f-3c26-4296-8ecc-53e2afecc132'
  },
  presets: {
    breakfast: {
      model: 'photoreal',
      photoReal: true,
      photoRealStrength: 0.55,
      alchemy: true,
      stylePreset: 'FOOD_PHOTOGRAPHY',
      settings: {
        num_images: 1,
        width: 1024,
        height: 1024,
        guidance_scale: 7,
        promptMagic: true,
        promptMagicVersion: 'v3',
        highResolution: true
      }
    },
    lunch: {
      model: 'photoreal',
      photoReal: true,
      photoRealStrength: 0.65,
      alchemy: true,
      stylePreset: 'CINEMATIC',
      settings: {
        num_images: 1,
        width: 1024,
        height: 1024,
        guidance_scale: 8,
        contrastRatio: 0.8
      }
    },
    aperitivo: {
      model: 'photoreal',
      photoReal: true,
      photoRealStrength: 0.5,
      alchemy: true,
      stylePreset: 'DYNAMIC',
      settings: {
        num_images: 1,
        width: 1024,
        height: 1024,
        guidance_scale: 7.5,
        dynamicRange: 'HIGH'
      }
    }
  }
};
```

## PROMPT ENGINEERING PER FOOD

### Template Base
```
[DISH NAME], [SETTING], [LIGHTING], [STYLE], [DETAILS], [CAMERA], [MOOD]
```

### Esempi Ottimizzati per Balzac:

**BREAKFAST:**
```
Cappuccino with perfect foam art and fresh cornetto alla crema, 
elegant Italian bistrot marble table, soft morning window light,
professional food photography style, steam rising from coffee,
shot with 85mm lens shallow depth of field, warm inviting mood,
fine dining presentation, Modena Italy ambiance
```

**LUNCH:**
```
Tortellini in brodo traditional Modena recipe, handmade pasta floating,
rustic wooden table with linen napkin, bright natural daylight,
Michelin star restaurant photography, golden broth with herbs,
overhead 45-degree angle food styling, authentic Italian trattoria,
garnished with aged Parmigiano Reggiano
```

**APERITIVO:**
```
Aperol Spritz cocktail with Prosecco bubbles, orange slice garnish,
rooftop bar terrace overlooking Modena cathedral, golden hour lighting,
lifestyle photography editorial style, condensation on glass,
bokeh background lights, sophisticated Italian aperitivo culture,
accompanied by olive and cheese selection
```

## NEGATIVE PROMPTS (IMPORTANTE!)

Sempre includere per evitare:
```
blurry, amateur, plastic looking, artificial, stock photo, 
watermark, text, oversaturated, unappetizing, messy presentation,
bad lighting, low quality, cartoon, illustration
```

## ADVANCED SETTINGS

### PhotoReal Settings:
- **Strength**: 0.5-0.7 (troppo alto = rigido)
- **Depth of Field**: 0.3-0.5 (sfocato giusto)
- **Raw Mode**: ON per più controllo

### Alchemy Settings:
- **Contrast**: 1.1 (più pop)
- **Saturation**: 1.05 (colori naturali)
- **Structure**: 0.8 (dettagli cibo)

## ELEMENTI CHIAVE PER BALZAC

1. **Signature Elements:**
   - Tovagliette con logo Balzac
   - Vista Piazza Grande per aperitivo
   - Ingredienti DOP/IGP in vista

2. **Styling Tips:**
   - Parmigiano sempre presente
   - Aceto Balsamico di Modena
   - Lambrusco per aperitivo

3. **Composizione:**
   - Rule of thirds
   - Angolo 45° per pasta
   - Overhead per antipasti
   - Eye-level per drinks

## WORKFLOW OTTIMIZZATO

1. **Genera 3-4 varianti** per post
2. **Seleziona la migliore** con AI scoring
3. **Upscale** a 2048x2048 per qualità
4. **Post-processing** automatico con preset

## INTEGRAZIONE CON INSTAGRAM

Leonardo API → Buffer/Resize → Instagram API
- Auto-crop quadrato 1:1
- Ottimizzazione per mobile
- Mantenimento qualità HD

## COSTI DETTAGLIATI

**Piano Artisan (€24/mese):**
- 3 immagini/giorno = 90/mese
- ~250 tokens per immagine HD
- Totale: 22,500 tokens (sotto limite)
- Margine per test e varianti

## CUSTOM MODEL TRAINING

Possiamo creare modello custom "Balzac Style":
1. Upload 50-100 foto piatti Balzac
2. Training su stile specifico
3. Risultati 100% on-brand