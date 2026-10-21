require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fetch = require('node-fetch');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }
});

// ─── Weather API ────────────────────────────────────────────────────────────
app.get('/api/weather', async (req, res) => {
  const { lat, lon, city } = req.query;
  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    let url;
    if (apiKey) {
      url = lat && lon
        ? `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
        : `https://api.openweathermap.org/data/2.5/forecast?q=${city || 'Dhaka'}&appid=${apiKey}&units=metric`;
      const response = await fetch(url);
      const data = await response.json();
      return res.json({ source: 'live', data });
    }
    // Mock weather if no API key
    res.json({ source: 'mock', data: getMockWeather(city || 'Your Farm') });
  } catch (err) {
    res.json({ source: 'mock', data: getMockWeather('Your Farm') });
  }
});

function getMockWeather(city) {
  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const conditions = ['Clear','Clouds','Rain','Drizzle','Clear','Clouds','Clear'];
  const icons = ['☀️','⛅','🌧️','🌦️','☀️','⛅','☀️'];
  const today = new Date();
  return {
    city: { name: city },
    list: days.map((d, i) => ({
      dt: Math.floor(today.getTime()/1000) + i*86400,
      dt_txt: new Date(today.getTime() + i*86400000).toISOString(),
      main: {
        temp: 24 + Math.round(Math.random()*8 - 4),
        humidity: 60 + Math.round(Math.random()*30),
        feels_like: 26 + Math.round(Math.random()*4),
        pressure: 1010 + Math.round(Math.random()*10)
      },
      weather: [{ main: conditions[i], description: conditions[i].toLowerCase(), icon: icons[i] }],
      wind: { speed: 2 + Math.random()*5 },
      pop: Math.random() * 0.8
    }))
  };
}

// ─── Crop Disease Detection ──────────────────────────────────────────────────
app.post('/api/disease-detect', upload.single('leaf'), async (req, res) => {
  try {
    const imageData = req.file
      ? req.file.buffer.toString('base64')
      : req.body.base64;

    const mimeType = req.file ? req.file.mimetype : 'image/jpeg';

    // Use Gemini Vision API if key available
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && imageData) {
      const GEMINI_MODEL = 'gemini-2.0-flash';
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [
                {
                  inline_data: {
                    mime_type: mimeType,
                    data: imageData
                  }
                },
                {
                  text: `You are an expert agricultural plant pathologist. Analyze this leaf image and provide a JSON response ONLY with this exact structure:
{
  "disease": "Disease name or Healthy",
  "confidence": 85,
  "severity": "Mild|Moderate|Severe|None",
  "symptoms": ["symptom1", "symptom2", "symptom3"],
  "causes": "Brief explanation of causes",
  "treatment": ["treatment step 1", "treatment step 2", "treatment step 3"],
  "prevention": ["prevention tip 1", "prevention tip 2"],
  "affectedCrop": "Crop name if identifiable",
  "urgency": "Low|Medium|High|Critical"
}
Return ONLY valid JSON, no markdown, no code fences.`
                }
              ]
            }],
            generationConfig: {
              temperature: 0.2,
              maxOutputTokens: 1024
            }
          })
        }
      );
      const aiData = await response.json();
      const text = aiData.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
      try {
        const result = JSON.parse(text.replace(/```json|```/g, '').trim());
        return res.json({ success: true, result, source: 'gemini' });
      } catch {
        return res.json({ success: true, result: getMockDisease(), source: 'mock' });
      }
    }

    // Mock disease detection
    res.json({ success: true, result: getMockDisease(), source: 'mock' });
  } catch (err) {
    res.json({ success: true, result: getMockDisease(), source: 'mock' });
  }
});

function getMockDisease() {
  const diseases = [
    {
      disease: 'Early Blight (Alternaria solani)',
      confidence: 91,
      severity: 'Moderate',
      symptoms: ['Brown circular lesions with concentric rings', 'Yellow halo around spots', 'Lower leaves affected first'],
      causes: 'Fungal infection favored by warm, humid conditions and poor air circulation.',
      treatment: ['Remove infected leaves immediately', 'Apply copper-based fungicide every 7-10 days', 'Improve spacing for airflow'],
      prevention: ['Rotate crops annually', 'Use disease-resistant varieties', 'Avoid overhead irrigation'],
      affectedCrop: 'Tomato',
      urgency: 'Medium'
    },
    {
      disease: 'Powdery Mildew',
      confidence: 87,
      severity: 'Mild',
      symptoms: ['White powdery coating on leaves', 'Distorted young shoots', 'Premature leaf drop'],
      causes: 'Fungal spores spread by wind, thriving in dry conditions with high humidity at night.',
      treatment: ['Spray with potassium bicarbonate solution', 'Apply neem oil weekly', 'Remove heavily infected parts'],
      prevention: ['Ensure good air circulation', 'Avoid excessive nitrogen fertilizer', 'Water at base of plant'],
      affectedCrop: 'Cucumber / Squash',
      urgency: 'Low'
    },
    {
      disease: 'Leaf Rust',
      confidence: 78,
      severity: 'Severe',
      symptoms: ['Orange-brown pustules on undersides', 'Yellow spots on upper surface', 'Premature defoliation'],
      causes: 'Rust fungi spread through airborne spores, favored by wet and cool conditions.',
      treatment: ['Apply triazole fungicide immediately', 'Destroy all infected plant debris', 'Increase potassium nutrition'],
      prevention: ['Plant resistant varieties', 'Crop rotation with non-hosts', 'Monitor humidity closely'],
      affectedCrop: 'Wheat / Bean',
      urgency: 'High'
    }
  ];
  return diseases[Math.floor(Math.random() * diseases.length)];
}

// ─── Crop Recommendations ────────────────────────────────────────────────────
app.get('/api/crops', (req, res) => {
  res.json({ crops: getCropDatabase() });
});

function getCropDatabase() {
  return [
    { id:1, name:'Rice', emoji:'🌾', season:['Jun','Jul','Aug','Sep'], months:[6,7,8,9], category:'Grain', growDays:120, yieldPerAcre:'4-6 tons', water:'High', temp:'22-32°C', soil:'Clay loam', tips:'Keep field flooded 2-5cm during vegetative stage.' },
    { id:2, name:'Wheat', emoji:'🌿', season:['Nov','Dec','Jan','Feb'], months:[11,12,1,2], category:'Grain', growDays:110, yieldPerAcre:'3-5 tons', water:'Moderate', temp:'12-22°C', soil:'Well-drained loam', tips:'Sow at 100-125 kg/ha seed rate for best results.' },
    { id:3, name:'Tomato', emoji:'🍅', season:['Feb','Mar','Oct','Nov'], months:[2,3,10,11], category:'Vegetable', growDays:75, yieldPerAcre:'20-30 tons', water:'Moderate', temp:'18-27°C', soil:'Sandy loam', tips:'Stake plants at 30cm height to prevent lodging.' },
    { id:4, name:'Potato', emoji:'🥔', season:['Oct','Nov','Dec'], months:[10,11,12], category:'Vegetable', growDays:90, yieldPerAcre:'15-25 tons', water:'Moderate', temp:'15-20°C', soil:'Sandy loam', tips:'Earth up when plants reach 20cm height.' },
    { id:5, name:'Onion', emoji:'🧅', season:['Nov','Dec','Jan'], months:[11,12,1], category:'Vegetable', growDays:120, yieldPerAcre:'10-15 tons', water:'Low', temp:'13-24°C', soil:'Well-drained loam', tips:'Stop watering 2 weeks before harvest.' },
    { id:6, name:'Maize', emoji:'🌽', season:['Mar','Apr','May','Jun'], months:[3,4,5,6], category:'Grain', growDays:95, yieldPerAcre:'5-8 tons', water:'Moderate', temp:'18-27°C', soil:'Well-drained loam', tips:'Apply top dressing nitrogen at knee-high stage.' },
    { id:7, name:'Mango', emoji:'🥭', season:['Mar','Apr','May'], months:[3,4,5], category:'Fruit', growDays:110, yieldPerAcre:'8-12 tons', water:'Low', temp:'24-30°C', soil:'Deep loam', tips:'Prune after harvest to encourage next season bloom.' },
    { id:8, name:'Banana', emoji:'🍌', season:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], months:[1,2,3,4,5,6,7,8,9,10,11,12], category:'Fruit', growDays:300, yieldPerAcre:'20-35 tons', water:'High', temp:'20-30°C', soil:'Rich loam', tips:'Remove side suckers leaving one follower per plant.' },
    { id:9, name:'Lentil', emoji:'🫘', season:['Oct','Nov','Feb','Mar'], months:[10,11,2,3], category:'Pulse', growDays:85, yieldPerAcre:'1-2 tons', water:'Low', temp:'18-30°C', soil:'Sandy loam', tips:'Inoculate seed with Rhizobium before sowing.' },
    { id:10, name:'Sunflower', emoji:'🌻', season:['Jan','Feb','Jun','Jul'], months:[1,2,6,7], category:'Oilseed', growDays:95, yieldPerAcre:'1.5-2.5 tons', water:'Moderate', temp:'20-25°C', soil:'Well-drained loam', tips:'Ensure 60x30cm spacing for optimal head development.' },
    { id:11, name:'Cucumber', emoji:'🥒', season:['Feb','Mar','Apr','Aug','Sep'], months:[2,3,4,8,9], category:'Vegetable', growDays:55, yieldPerAcre:'10-20 tons', water:'Moderate', temp:'20-30°C', soil:'Sandy loam', tips:'Trellis vines at 30cm to improve yield and quality.' },
    { id:12, name:'Chili', emoji:'🌶️', season:['Jan','Feb','Mar','Oct','Nov'], months:[1,2,3,10,11], category:'Spice', growDays:90, yieldPerAcre:'2-5 tons', water:'Moderate', temp:'20-30°C', soil:'Well-drained clay loam', tips:'Mulch to retain soil moisture and control weeds.' },
  ];
}

// ─── Fertilizer Calculator ───────────────────────────────────────────────────
app.post('/api/fertilizer', (req, res) => {
  const { crop, area, unit, soilType, irrigationType } = req.body;
  const result = calculateFertilizer(crop, parseFloat(area), unit, soilType, irrigationType);
  res.json(result);
});

function calculateFertilizer(crop, area, unit, soilType, irrigationType) {
  const areaInHa = unit === 'acres' ? area * 0.4047 : area;

  const npkBase = {
    'Rice':     { N:120, P:60,  K:60  },
    'Wheat':    { N:120, P:60,  K:40  },
    'Maize':    { N:150, P:75,  K:75  },
    'Tomato':   { N:100, P:80,  K:100 },
    'Potato':   { N:120, P:100, K:120 },
    'Onion':    { N:100, P:50,  K:75  },
    'Cucumber': { N:80,  P:60,  K:80  },
    'Chili':    { N:100, P:50,  K:50  },
    'Lentil':   { N:25,  P:50,  K:25  },
    'Sunflower':{ N:80,  P:60,  K:60  },
    'Banana':   { N:200, P:100, K:300 },
    'Mango':    { N:100, P:50,  K:100 },
  };

  const base = npkBase[crop] || { N:100, P:60, K:60 };

  // Soil type adjustments
  const soilMod = { 'Sandy': 1.2, 'Loam': 1.0, 'Clay': 0.85, 'Silt': 0.9 };
  const mod = soilMod[soilType] || 1.0;

  const N = Math.round(base.N * mod * areaInHa);
  const P = Math.round(base.P * mod * areaInHa);
  const K = Math.round(base.K * mod * areaInHa);

  // Organic equivalents
  const compostKg = Math.round(areaInHa * 5000);
  const vermicompostKg = Math.round(areaInHa * 2000);

  // Chemical equivalents (conversion factors)
  const ureaKg = Math.round(N / 0.46);
  const sspKg = Math.round(P / 0.16);
  const mopKg = Math.round(K / 0.60);

  // Pest treatment protocols
  const pestProtocols = getPestProtocols(crop, areaInHa);

  return {
    crop, area, unit, areaInHa: areaInHa.toFixed(2),
    npk: { N, P, K },
    chemical: {
      urea: { amount: ureaKg, unit: 'kg', schedule: 'Split: 1/3 basal, 1/3 tillering, 1/3 panicle' },
      ssp:  { amount: sspKg,  unit: 'kg', schedule: 'Apply all at basal dose before planting' },
      mop:  { amount: mopKg,  unit: 'kg', schedule: 'Split: 1/2 basal, 1/2 at 45 days' },
    },
    organic: {
      compost:      { amount: compostKg,      unit: 'kg', schedule: 'Incorporate 2 weeks before planting' },
      vermicompost: { amount: vermicompostKg, unit: 'kg', schedule: 'Apply at sowing or transplanting' },
      neem_cake:    { amount: Math.round(areaInHa * 200), unit: 'kg', schedule: 'Mix into soil 1 week before planting' },
    },
    pestProtocols
  };
}

function getPestProtocols(crop, areaHa) {
  const protocols = {
    'Rice': [
      { pest: 'Brown Planthopper', chemical: 'Imidacloprid 17.8 SL', dose: `${(areaHa * 125).toFixed(0)} ml`, organic: 'Neem oil 3% spray' },
      { pest: 'Stem Borer',        chemical: 'Chlorpyrifos 20 EC',   dose: `${(areaHa * 1500).toFixed(0)} ml`, organic: 'Trichogramma cards' },
    ],
    'Tomato': [
      { pest: 'Fruit Borer',  chemical: 'Spinosad 45 SC',      dose: `${(areaHa * 160).toFixed(0)} ml`, organic: 'BT spray 0.5%' },
      { pest: 'Whitefly',     chemical: 'Thiamethoxam 25 WG',  dose: `${(areaHa * 100).toFixed(0)} g`,  organic: 'Yellow sticky traps' },
    ],
    'Wheat': [
      { pest: 'Aphids',     chemical: 'Dimethoate 30 EC', dose: `${(areaHa * 600).toFixed(0)} ml`,  organic: 'Neem extract spray' },
      { pest: 'Rust',       chemical: 'Propiconazole 25 EC', dose: `${(areaHa * 500).toFixed(0)} ml`, organic: 'Sulfur dust 25 kg/ha' },
    ],
    'Potato': [
      { pest: 'Late Blight',    chemical: 'Mancozeb 75 WP', dose: `${(areaHa * 2000).toFixed(0)} g`, organic: 'Copper hydroxide spray' },
      { pest: 'Potato Beetle',  chemical: 'Chlorpyrifos 20 EC', dose: `${(areaHa * 1000).toFixed(0)} ml`, organic: 'Pyrethrin spray' },
    ],
  };
  return protocols[crop] || [
    { pest: 'General Insects', chemical: 'Malathion 50 EC', dose: `${(areaHa * 1000).toFixed(0)} ml`, organic: 'Neem oil 2% spray' },
    { pest: 'Fungal Disease',  chemical: 'Mancozeb 75 WP',  dose: `${(areaHa * 1500).toFixed(0)} g`,  organic: 'Trichoderma viride' },
  ];
}

// ─── Catch-all → SPA ────────────────────────────────────────────────────────
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => console.log(`🌱 Smart Garden AI running on port ${PORT}`));
