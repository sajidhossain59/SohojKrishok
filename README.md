# 🌿 Smart Garden AI

Agricultural intelligence platform — weather, AI disease detection, crop planning, fertilizer calculator.

## AI Disease Detection

Uses the **Hugging Face free Inference API** with `linkanjarad/mobilenet_v2_1.0_224-plant-disease-identification` — a MobileNetV2 model trained on the PlantVillage dataset (38 crop disease classes). **No billing required.**

## Quick Start

```bash
npm install
cp .env.example .env
# Optionally add your keys to .env
npm start
# Visit http://localhost:3000
```

## Deploy to Render

1. Push to GitHub
2. render.com → New → Web Service → connect repo
3. Render auto-detects `render.yaml`
4. Add environment variables (both optional):
   - `OPENWEATHER_API_KEY` — openweathermap.org (free)
   - `HF_API_TOKEN` — huggingface.co/settings/tokens (free read token, higher rate limits)

## Environment Variables

| Variable | Required | Source |
|----------|----------|--------|
| `OPENWEATHER_API_KEY` | Optional | openweathermap.org |
| `HF_API_TOKEN` | Optional | huggingface.co/settings/tokens |
| `PORT` | Auto | Set by Render |
