from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import requests

app = FastAPI()

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "AgriSense API Online"}

# 1. Weather & Soil Telemetry Endpoint
@app.get("/api/weather")
def get_weather(lat: float = 23.8103, lon: float = 90.4125):
    url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current=temperature_2m,relative_humidity_2m&hourly=soil_moisture_0_to_1cm"
    response = requests.get(url).json()
    return {
        "temperature": response["current"]["temperature_2m"],
        "humidity": response["current"]["relative_humidity_2m"],
        "soil_moisture": int(response["hourly"]["soil_moisture_0_to_1cm"][0] * 100)
    }

# 2. Fertilizer Calculation Endpoint
@app.post("/api/calculate-fertilizer")
def calculate_fertilizer(crop: str, area_acres: float):
    # Rates in kg/acre
    rates = {
        "corn": {"urea": 80, "dap": 40, "mop": 30},
        "wheat": {"urea": 60, "dap": 35, "mop": 25},
        "rice": {"urea": 70, "dap": 30, "mop": 30},
    }
    selected = rates.get(crop.lower(), rates["corn"])

    urea_qty = selected["urea"] * area_acres
    dap_qty = selected["dap"] * area_acres
    mop_qty = selected["mop"] * area_acres

    # Estimated pricing
    est_cost = (urea_qty * 0.50) + (dap_qty * 0.85) + (mop_qty * 0.70)

    return {
        "crop": crop,
        "urea_kg": urea_qty,
        "dap_kg": dap_qty,
        "mop_kg": mop_qty,
        "estimated_cost_usd": round(est_cost, 2)
    }

# 3. AI Disease Scanner Endpoint (Mock/API Integration)
@app.post("/api/scan-leaf")
async def scan_leaf(file: UploadFile = File(...)):
    # Integrate Plant.id API or custom TensorFlow PyTorch model here
    return {
        "filename": file.filename,
        "disease": "Early Blight (Alternaria solani)",
        "confidence": 0.94,
        "treatment": "Apply copper-based fungicide and prune lower infected leaves."
    }