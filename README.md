# 🌿 Smart Garden AI

An agricultural intelligence platform with AI-powered features for modern farmers.

## Features

| Module | Description |
|--------|-------------|
| 🌤️ **Weather & Climate** | 7-day forecasts, agricultural hazard alerts (heat stress, frost, fungal risk) |
| 🔬 **Disease Detection** | Upload leaf photos — analysed by **Gemini Vision AI** (`gemini-2.0-flash`) |
| 🌱 **Crop Recommender** | Monthly/seasonal crop calendar with yield, water, and growth data |
| ⚗️ **Fertilizer Calculator** | NPK dosage, urea/compost/SSP/MOP amounts, pest treatment protocols |

## Quick Start (Local)

```bash
npm install
cp .env.example .env
# Add your API keys to .env
npm start
# Visit http://localhost:3000
```

## Deploy to Render

1. Push this project to a GitHub repository
2. Go to [render.com](https://render.com) → New → Web Service
3. Connect your GitHub repo — Render auto-detects `render.yaml`
4. Add environment variables in the Render dashboard:
   - `OPENWEATHER_API_KEY` — from [openweathermap.org](https://openweathermap.org/api) (free)
   - `GEMINI_API_KEY` — from [aistudio.google.com](https://aistudio.google.com) (free)

> **Note:** The app works fully without API keys using realistic demo data. Add keys for live weather and real Gemini AI image analysis.

## Environment Variables

| Variable | Required | Source |
|----------|----------|--------|
| `OPENWEATHER_API_KEY` | Optional | openweathermap.org (free tier) |
| `GEMINI_API_KEY` | Optional | aistudio.google.com (free tier) |
| `PORT` | Auto-set | Set by Render automatically |

## Tech Stack

- **Backend:** Node.js + Express
- **Frontend:** Vanilla JS, CSS custom properties, Google Fonts
- **AI:** Google Gemini Vision API — `gemini-2.0-flash` (disease detection)
- **Weather:** OpenWeatherMap API
- **Deploy:** Render.com (`render.yaml` included)
