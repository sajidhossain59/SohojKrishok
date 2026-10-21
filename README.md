# 🌾 SohojKrishok (সহজ কৃষক)

> **Smart Agronomy in Every Farmer’s Pocket.**  
> An AI-powered, mobile-first B2C web app delivering real-time crop disease diagnostics, soil telemetry, weather forecasting, and precise fertilizer calculations for smallholder farmers.

---

## 🚀 Live Demo & Presentation

- **Live Web App:** [https://sohojkrishok.onrender.com](https://sohojkrishok.onrender.com) *(Hosted on Render)*
- **Demo Video (YouTube):** [Link to Demo Video]
- **Presentation Deck:** [Link to 5-Slide Presentation]

---

## 🌟 Key Features

- 📸 **AI Leaf Disease Scanner:** Instant plant health diagnosis with confidence scores, pathogen details, and organic/chemical remediation steps.
- 📡 **Hyper-Local Field Telemetry:** Real-time weather data and multi-depth soil moisture tracking (0–1 cm) via API integration.
- 🧮 **Bilingual Nutrient Estimator:** Calculates exact N-P-K (Urea, DAP, MOP) bag requirements and estimated costs based on land size and crop type.
- 🇧🇩 **Instant Localization (EN / বাংলা):** Seamless language toggle to bridge the digital divide for rural farmers.
- 📱 **Mobile-First & PWA Ready:** Accessible directly through Chrome/Safari on any smartphone without installing store apps.

---

## 🛠️ Tech Stack & Architecture

- **Frontend:** React.js, Tailwind CSS, Lucide React (Icons), Canvas-based charts
- **Backend API:** FastAPI (Python), PyTorch / Computer Vision Inference
- **External APIs:** [Open-Meteo API](https://open-meteo.com/) (Free Weather & Soil Moisture Telemetry)
- **Deployment & Hosting:** [Render](https://render.com/) (Web Services & Static Site Hosting)

---

## 📂 Project Structure

```text
sohojkrishok/
├── backend/                  # FastAPI Python backend engine
│   ├── app.py                # Core API endpoints (Weather, Soil, Fertilizer, Disease AI)
│   └── requirements.txt      # Python dependencies
└── frontend/                 # React single-page app
    ├── src/
    │   ├── App.jsx           # Main UI dashboard & translation dictionary
    │   └── components/       # Reusable components
    ├── package.json
    └── vite.config.js