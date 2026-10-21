import React, { useState, useEffect, useRef } from 'react';
import { 
  Sun, Cloud, CloudRain, Droplets, Wind, Sparkles, Camera, BarChart2, Home, Bell, 
  Settings, ChevronRight, AlertTriangle, ShieldCheck, RefreshCw, Globe, 
  User, CheckCircle2, Leaf, ArrowUpRight, Zap, Layers, DollarSign, Calendar,
  MapPin, Upload, Sliders, Check, Info, Search, Activity
} from 'lucide-react';

// ==========================================
// BILINGUAL DICTIONARY (EN / BN)
// ==========================================
const translations = {
  EN: {
    appTitle: "AgriSense AI",
    greeting: "Good Morning",
    defaultUser: "Farmer",
    locationFetching: "Detecting location...",
    locationDefault: "Dhaka, Bangladesh",
    weatherStatus: "Live Weather",
    humidity: "Humidity",
    wind: "Wind",
    soilMoistureApi: "Soil Moisture",
    
    // Bottom Nav Tabs
    tabHome: "Home",
    tabAnalytics: "Analytics",
    tabScan: "Scan",
    tabAlerts: "Alerts",
    tabCalc: "Fertilizer",
    tabSettings: "Settings",

    // Soil Status Section
    soilStatusTitle: "Soil & Field Telemetry",
    detailedReport: "Detailed Report",
    moisture: "Soil Moisture",
    phLevel: "pH Level",
    nitrogen: "Nitrogen (N)",
    phosphorus: "Phosphorus (P)",
    potassium: "Potassium (K)",
    soilTemp: "Soil Temp",
    
    // Status Badges
    lowLevel: "Low Level",
    optimal: "Optimal",
    good: "Good",
    normal: "Normal",
    high: "High",

    // AI Insight
    aiInsightTitle: "AI Agronomist Insight",
    aiInsightDefault: "Soil moisture is trending low in Sector B (32%). Recommended irrigation: 30 minutes today at 5:30 PM to optimize root absorption.",

    // Crop Health
    cropHealthTitle: "Crop Health Overview",
    viewAll: "View All",
    winterWheat: "Winter Wheat",
    sweetCorn: "Sweet Corn",
    ricePaddy: "Aman Rice",
    vegetativeStage: "Vegetative Stage • Field A",
    floweringStage: "Flowering Stage • Field B",
    ripeningStage: "Ripening Stage • Field C",

    // Analytics View
    fieldAnalytics: "Field Analytics & Growth",
    growthProgress: "Growth Index",
    vsAverage: "vs. seasonal avg",
    pestAlertTitle: "Pest Risk Warning",
    pestAlertText: "Rising ambient humidity increases fungal risk for Solanaceous crops in your zone.",
    soilComposition: "Nutrient Balance (NPK)",

    // Disease Scanner View
    scanHeader: "AI Leaf Disease Scanner",
    analyzingText: "Analyzing Leaf Cellular Structure...",
    scanInstruction: "Take or upload a clear photo of an infected crop leaf",
    uploadBtn: "Upload Leaf Image",
    demoLeaf1: "Tomato Leaf Blight Sample",
    demoLeaf2: "Healthy Corn Leaf Sample",
    detectedTitle: "Early Blight (Alternaria solani)",
    healthyTitle: "Healthy Crop Leaf",
    highSeverity: "High Severity",
    healthySeverity: "No Infection",
    confidence: "94% AI Confidence",
    healthyConfidence: "98% AI Confidence",
    affectedArea: "Affected Area",
    affectedParts: "Leaves & Stems",
    cause: "Pathogen",
    causeType: "Fungal Spores",
    recommendedAction: "Treatment Protocol",
    actionText: "Apply copper-based fungicide or Mancozeb spray immediately. Prune lower infected leaves to prevent spore transmission.",
    healthyActionText: "Crop exhibits healthy chlorophyll levels. Maintain standard watering and weekly monitoring schedule.",
    saveReport: "Save Diagnostic Report",
    getTreatmentPlan: "Get Remedy Steps",
    scanAnother: "Scan Another Leaf",

    // Fertilizer Calculator
    calcTitle: "Nutrient & Fertilizer Estimator",
    selectCrop: "Select Target Crop",
    farmArea: "Farm Area (Acres)",
    calculateBtn: "Recalculate Requirements",
    ureaBags: "Urea (46% N)",
    dapBags: "DAP (18-46-0)",
    mopBags: "MOP (60% K)",
    totalEstCost: "Estimated Total Cost",
    costNotice: "*Calculated with current market pricing in Bangladesh/regional rates.",

    // Alerts
    alertsTitle: "Field Alerts & Risk Radar",
    alert1: "High moisture level forecasted tomorrow. High fungal infection risk.",
    alert2: "Schedule Nitrogen top-dressing application for Field A sweet corn within 48 hours.",
    
    // Settings
    settingsTitle: "App Settings & Preferences",
    languageSetting: "Language Preference",
    locationSetting: "Field Location Sync",
    unitsSetting: "Measurement Units",
    metricUnits: "Metric (°C, Acres, kg)",
    imperialUnits: "Imperial (°F, Acres, lbs)",
    apiStatus: "Open-Meteo Weather API",
    connected: "Connected (Live)",
    refreshData: "Refresh Live Sensor Data"
  },
  BN: {
    appTitle: "এগ্রিসেন্স এআই",
    greeting: "শুভ সকাল",
    defaultUser: "কৃষক ভাই",
    locationFetching: "অবস্থান চিহ্নিত করা হচ্ছে...",
    locationDefault: "ঢাকা, বাংলাদেশ",
    weatherStatus: "লাইভ আবহাওয়া",
    humidity: "আর্দ্রতা",
    wind: "বাতাস",
    soilMoistureApi: "মাটির আর্দ্রতা",

    // Bottom Nav Tabs
    tabHome: "হোম",
    tabAnalytics: "অ্যানালিটিক্স",
    tabScan: "স্ক্যান",
    tabAlerts: "অ্যালার্ট",
    tabCalc: "সার হিসাব",
    tabSettings: "সেটিংস",

    // Soil Status Section
    soilStatusTitle: "মাটি ও মাঠের টেলিমেট্রি",
    detailedReport: "বিস্তারিত রিপোর্ট",
    moisture: "মাটির আর্দ্রতা",
    phLevel: "পিএইচ (pH) মাত্রা",
    nitrogen: "নাইট্রোজেন (N)",
    phosphorus: "ফসফরাস (P)",
    potassium: "পটাশিয়াম (K)",
    soilTemp: "মাটির তাপমাত্রা",

    // Status Badges
    lowLevel: "কম মাত্রা",
    optimal: "আদর্শ",
    good: "ভালো",
    normal: "স্বাভাবিক",
    high: "উচ্চ",

    // AI Insight
    aiInsightTitle: "এআই কৃষিবিদ পরামর্শ",
    aiInsightDefault: "সেক্টর বি-তে মাটির আর্দ্রতা কমে ৩২% এ নেমেছে। শেকড়ের পুষ্টি নিশ্চিত করতে আজ বিকেল ৫:৩০ মিনিটে ৩০ মিনিট সেচ দিন।",

    // Crop Health
    cropHealthTitle: "ফসলের স্বাস্থ্য পর্যালোচনা",
    viewAll: "সব দেখুন",
    winterWheat: "গম ফসল",
    sweetCorn: "মিষ্টি ভুট্টা",
    ricePaddy: "আমন ধান",
    vegetativeStage: "বৃদ্ধি পর্যায় • ফিল্ড এ",
    floweringStage: "ফুল ফোটার পর্যায় • ফিল্ড বি",
    ripeningStage: "পাকার পর্যায় • ফিল্ড সি",

    // Analytics View
    fieldAnalytics: "ফিল্ড অ্যানালিটিক্স ও বৃদ্ধি",
    growthProgress: "বৃদ্ধির সূচক",
    vsAverage: "গড়ের তুলনায়",
    pestAlertTitle: "কীটপতঙ্গের ঝুঁকি সতর্কবার্তা",
    pestAlertText: "বাতাসে আর্দ্রতা বৃদ্ধির কারণে আপনার এলাকার সোলাแนসিয়াস ফসলে ছত্রাকজনিত রোগের ঝুঁকি বেড়েছে।",
    soilComposition: "পুষ্টির সামঞ্জস্য (NPK)",

    // Disease Scanner View
    scanHeader: "এআই পাতার রোগ নির্ণয়ক",
    analyzingText: "পাতার কোশের গঠন বিশ্লেষণ করা হচ্ছে...",
    scanInstruction: "রোগাক্রান্ত পাতার একটি স্পষ্ট ছবি তুলুন বা আপলোড করুন",
    uploadBtn: "ছবি আপলোড করুন",
    demoLeaf1: "টমেটো ব্লাইট রোগের নমুনা",
    demoLeaf2: "সুস্থ ভুট্টার পাতার নমুনা",
    detectedTitle: "আর্লি ব্লাইট (Alternaria solani)",
    healthyTitle: "সম্পূর্ণ সুস্থ পাতা",
    highSeverity: "উচ্চ ঝুঁকি",
    healthySeverity: "ঝুঁকিমুক্ত",
    confidence: "৯৪% নিশ্চিত",
    healthyConfidence: "৯৮% নিশ্চিত",
    affectedArea: "আক্রান্ত স্থান",
    affectedParts: "পাতা ও কাণ্ড",
    cause: "রোগজীবাণু",
    causeType: "ছত্রাক স্পোর",
    recommendedAction: "চিকিৎসা নির্দেশনা",
    actionText: "অবিলম্বে কপার-ভিত্তিক ছত্রাকনাশক বা ম্যানকোজেব স্প্রে করুন। সুস্থ গাছে ছড়ানো রোধে আক্রান্ত পাতা কেটে ফেলুন।",
    healthyActionText: "ফসলে পর্যাপ্ত ক্লোরোফিল বিদ্যমান। নিয়মিত সেচ ও প্রতি সপ্তাহে স্বাভাবিক পর্যবেক্ষণ বজায় রাখুন।",
    saveReport: "রিপোর্ট সংরক্ষণ করুন",
    getTreatmentPlan: "চিকিৎসা তথ্য নিন",
    scanAnother: "নতুন পাতা স্ক্যান করুন",

    // Fertilizer Calculator
    calcTitle: "সার ও পুষ্টি উপাদান হিসাবক",
    selectCrop: "ফসল নির্বাচন করুন",
    farmArea: "জমির পরিমাণ (একর)",
    calculateBtn: "সারের চাহিদা পুনরায় হিসাব করুন",
    ureaBags: "ইউরিয়া (৪৬% N)",
    dapBags: "ডিএপি (১৮-৪৬-০)",
    mopBags: "এমওপি (৬০% K)",
    totalEstCost: "আনুমানিক সারের মোট খরচ",
    costNotice: "*স্থানীয় বর্তমান বাজার দর অনুযায়ী আনুমানিক হিসাব।",

    // Alerts
    alertsTitle: "মাঠের সতর্কতা ও ঝুঁকি রাডার",
    alert1: "আগামীকাল ভারী আর্দ্রতার সম্ভাবনা। ছত্রাকজনিত সংক্রমণের ঝুঁকি বেশি।",
    alert2: "ফিল্ড এ-এর মিষ্টি ভুট্টার জন্য ৪৮ ঘণ্টার মধ্যে নাইট্রোজেন সার প্রয়োগ করুন।",

    // Settings
    settingsTitle: "অ্যাপ সেটিংস ও পছন্দসমূহ",
    languageSetting: "ভাষা পছন্দ",
    locationSetting: "ফিল্ড লোকেশন সিঙ্ক",
    unitsSetting: "পরিমাপের একক",
    metricUnits: "মেট্রিক (°C, একর, কেজি)",
    imperialUnits: "ইম্পেরিয়াল (°F, একর, পাউন্ড)",
    apiStatus: "ওপেন-মেটিও আবহাওয়া এপিআই",
    connected: "সংযুক্ত (লাইভ)",
    refreshData: "লাইভ সেন্সর ডেটা রিফ্রেশ করুন"
  }
};

export default function App() {
  const [lang, setLang] = useState('EN');
  const [activeTab, setActiveTab] = useState('home'); // home | analytics | scan | alerts | calc | settings
  
  // Real Weather & Location State
  const [locationName, setLocationName] = useState('');
  const [coords, setCoords] = useState({ lat: 23.8103, lon: 90.4125 }); // Default: Dhaka
  const [weatherData, setWeatherData] = useState({
    temp: 28,
    humidity: 62,
    windSpeed: 11,
    soilMoisture: 38,
    weatherCode: 1,
    isLoaded: false
  });
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Scanner States
  const [isScanning, setIsScanning] = useState(false);
  const [scanResultType, setScanResultType] = useState('diseased'); // diseased | healthy
  const [uploadedImage, setUploadedImage] = useState('https://images.unsplash.com/photo-1592417817098-8f3d6ef23a8d?auto=format&fit=crop&w=600&q=80');
  const fileInputRef = useRef(null);

  // Fertilizer State
  const [selectedCrop, setSelectedCrop] = useState('rice');
  const [acres, setAcres] = useState(3.5);
  const [fertResult, setFertResult] = useState(null);

  const t = translations[lang];

  // ==========================================
  // FETCH REAL WEATHER FROM OPEN-METEO API
  // ==========================================
  const fetchLiveWeather = async (latitude, longitude) => {
    setIsRefreshing(true);
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&hourly=soil_moisture_0_to_1cm&forecast_days=1`;
      const response = await fetch(url);
      const data = await response.json();

      if (data && data.current) {
        // Soil moisture value scaled from m³/m³ (0.00-0.50) to percentage
        const rawSoilMoisture = data.hourly?.soil_moisture_0_to_1cm?.[0] || 0.35;
        const soilPercent = Math.min(Math.round((rawSoilMoisture / 0.50) * 100), 100);

        setWeatherData({
          temp: Math.round(data.current.temperature_2m),
          humidity: Math.round(data.current.relative_humidity_2m),
          windSpeed: Math.round(data.current.wind_speed_10m),
          soilMoisture: soilPercent > 0 ? soilPercent : 38,
          weatherCode: data.current.weather_code,
          isLoaded: true
        });
      }
    } catch (err) {
      console.error("Open-Meteo API fetch failed, using fallback data", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Detect User Geolocation on initial load
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCoords({ lat: latitude, lon: longitude });
          setLocationName(lang === 'EN' ? "Current Location (GPS)" : "বর্তমান স্থান (GPS)");
          fetchLiveWeather(latitude, longitude);
        },
        () => {
          // Fallback location
          setLocationName(t.locationDefault);
          fetchLiveWeather(coords.lat, coords.lon);
        }
      );
    } else {
      setLocationName(t.locationDefault);
      fetchLiveWeather(coords.lat, coords.lon);
    }
  }, []);

  // Update fertilizer calculations
  useEffect(() => {
    const cropRates = {
      rice: { ureaPerAcre: 1.4, dapPerAcre: 0.6, mopPerAcre: 0.6, basePriceUSD: 180 },
      corn: { ureaPerAcre: 1.6, dapPerAcre: 0.8, mopPerAcre: 0.6, basePriceUSD: 220 },
      wheat: { ureaPerAcre: 1.2, dapPerAcre: 0.7, mopPerAcre: 0.5, basePriceUSD: 160 }
    };

    const rate = cropRates[selectedCrop] || cropRates.rice;
    const urea = (rate.ureaPerAcre * acres).toFixed(1);
    const dap = (rate.dapPerAcre * acres).toFixed(1);
    const mop = (rate.mopPerAcre * acres).toFixed(1);
    const costUSD = Math.round(rate.basePriceUSD * acres);
    const costBDT = Math.round(costUSD * 122);

    setFertResult({ urea, dap, mop, costUSD, costBDT });
  }, [selectedCrop, acres]);

  // Handle Image Upload for Disease Scanner
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setUploadedImage(uploadEvent.target.result);
        triggerScan('diseased');
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerScan = (type = 'diseased') => {
    setActiveTab('scan');
    setScanResultType(type);
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-200 flex justify-center items-center p-0 sm:p-4 font-sans antialiased text-slate-800">
      
      {/* Mobile Frame Container */}
      <div className="w-full max-w-md bg-slate-50 min-h-screen sm:min-h-[880px] sm:max-h-[920px] sm:rounded-[44px] shadow-2xl flex flex-col justify-between overflow-hidden relative border-0 sm:border-[8px] sm:border-slate-900">
        
        {/* ========================================== */}
        {/* TOP STATUS HEADER                          */}
        {/* ========================================== */}
        <div className="sticky top-0 z-30 bg-slate-50/95 backdrop-blur-md px-5 pt-4 pb-3 flex justify-between items-center border-b border-slate-100">
          <div>
            <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 uppercase tracking-wider">
              <Leaf className="w-3.5 h-3.5 fill-emerald-600 text-emerald-600" />
              {t.appTitle}
            </div>
            <h1 className="text-base font-bold text-slate-900 leading-tight">
              {t.greeting}, <span className="text-emerald-700">{t.defaultUser}</span>
            </h1>
          </div>

          <div className="flex items-center gap-2">
            {/* Bilingual Toggle Button */}
            <button 
              onClick={() => setLang(prev => prev === 'EN' ? 'BN' : 'EN')}
              className="flex items-center gap-1.5 bg-emerald-100/80 hover:bg-emerald-200 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-full transition shadow-sm active:scale-95"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-700" />
              <span>{lang === 'EN' ? 'বাংলা' : 'English'}</span>
            </button>

            {/* Profile Avatar */}
            <div 
              onClick={() => setActiveTab('settings')}
              className="w-9 h-9 rounded-full bg-emerald-600 border-2 border-white flex items-center justify-center text-white shadow-sm cursor-pointer hover:bg-emerald-700 transition"
            >
              <User className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* ========================================== */}
        {/* SCROLLABLE CONTENT BODY                    */}
        {/* ========================================== */}
        <div className="flex-1 overflow-y-auto px-5 py-3 space-y-4 pb-24">
          
          {/* ========================================== */}
          {/* TAB 1: HOME DASHBOARD                      */}
          {/* ========================================== */}
          {activeTab === 'home' && (
            <>
              {/* Weather & Real Sensor Card */}
              <div className="bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-800 rounded-3xl p-4 text-white shadow-lg shadow-emerald-700/20 relative overflow-hidden">
                <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-1 text-emerald-100 text-xs font-medium mb-1">
                      <MapPin className="w-3 h-3 text-emerald-300" />
                      <span>{locationName || t.locationDefault}</span>
                    </div>
                    
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black tracking-tight">
                        {weatherData.temp}°C
                      </span>
                      <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-medium text-emerald-50">
                        {t.weatherStatus}
                      </span>
                    </div>
                  </div>

                  <button 
                    onClick={() => fetchLiveWeather(coords.lat, coords.lon)} 
                    className="p-2 bg-white/10 hover:bg-white/20 active:rotate-180 transition-all rounded-2xl"
                    title="Refresh Live Weather API"
                  >
                    <RefreshCw className={`w-5 h-5 text-emerald-100 ${isRefreshing ? 'animate-spin' : ''}`} />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/15 text-xs text-emerald-100">
                  <div className="flex items-center gap-1.5">
                    <Droplets className="w-3.5 h-3.5 text-emerald-200" />
                    <div>
                      <p className="text-[10px] text-emerald-200/80">{t.humidity}</p>
                      <p className="font-bold">{weatherData.humidity}%</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Wind className="w-3.5 h-3.5 text-emerald-200" />
                    <div>
                      <p className="text-[10px] text-emerald-200/80">{t.wind}</p>
                      <p className="font-bold">{weatherData.windSpeed} km/h</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-emerald-200" />
                    <div>
                      <p className="text-[10px] text-emerald-200/80">{t.soilMoistureApi}</p>
                      <p className="font-bold">{weatherData.soilMoisture}%</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Soil Telemetry Status Grid */}
              <div>
                <div className="flex justify-between items-center mb-2.5">
                  <h2 className="text-sm font-bold text-slate-900">{t.soilStatusTitle}</h2>
                  <button onClick={() => setActiveTab('analytics')} className="text-xs font-semibold text-emerald-700 hover:text-emerald-800">
                    {t.detailedReport}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Soil Moisture Card */}
                  <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
                        <Droplets className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-semibold text-slate-500">{t.moisture}</span>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-slate-900">{weatherData.soilMoisture}%</div>
                      <span className={`inline-block mt-1 px-2 py-0.5 font-semibold text-[10px] rounded-full ${weatherData.soilMoisture < 40 ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
                        {weatherData.soilMoisture < 40 ? t.lowLevel : t.optimal}
                      </span>
                    </div>
                  </div>

                  {/* pH Level Card */}
                  <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
                        <Layers className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-semibold text-slate-500">{t.phLevel}</span>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-slate-900">6.5</div>
                      <span className="inline-block mt-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 font-semibold text-[10px] rounded-full border border-emerald-200">
                        {t.optimal}
                      </span>
                    </div>
                  </div>

                  {/* Nitrogen Card */}
                  <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1.5 bg-purple-50 text-purple-600 rounded-lg">
                        <Zap className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-semibold text-slate-500">{t.nitrogen}</span>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-slate-900">{t.high}</div>
                      <span className="inline-block mt-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 font-semibold text-[10px] rounded-full border border-emerald-200">
                        {t.good}
                      </span>
                    </div>
                  </div>

                  {/* Soil Temp Card */}
                  <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
                        <Sun className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-semibold text-slate-500">{t.soilTemp}</span>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-slate-900">22°C</div>
                      <span className="inline-block mt-1 px-2 py-0.5 bg-slate-100 text-slate-600 font-semibold text-[10px] rounded-full">
                        {t.normal}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Agronomist Dark Insight Card */}
              <div className="bg-slate-900 rounded-2xl p-4 text-white shadow-xl relative overflow-hidden border border-slate-800">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 bg-amber-500/20 text-amber-400 rounded-lg">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-amber-400 tracking-wider uppercase">{t.aiInsightTitle}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {t.aiInsightDefault}
                </p>
              </div>

              {/* Crop Health Progress */}
              <div>
                <div className="flex justify-between items-center mb-2.5">
                  <h2 className="text-sm font-bold text-slate-900">{t.cropHealthTitle}</h2>
                  <button className="text-xs font-semibold text-emerald-700">{t.viewAll}</button>
                </div>

                <div className="space-y-2.5">
                  {/* Crop Item 1 */}
                  <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                        <Leaf className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{t.ricePaddy}</h4>
                        <p className="text-[11px] text-slate-400">{t.vegetativeStage}</p>
                      </div>
                    </div>
                    <div className="relative w-11 h-11 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <path className="text-slate-100" strokeWidth="3.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        <path className="text-emerald-600" strokeDasharray="88, 100" strokeWidth="3.5" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                      </svg>
                      <span className="absolute text-[10px] font-bold text-slate-800">88%</span>
                    </div>
                  </div>

                  {/* Crop Item 2 */}
                  <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                        <Sun className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{t.sweetCorn}</h4>
                        <p className="text-[11px] text-slate-400">{t.floweringStage}</p>
                      </div>
                    </div>
                    <div className="relative w-11 h-11 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                        <path className="text-slate-100" strokeWidth="3.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                        <path className="text-amber-500" strokeDasharray="65, 100" strokeWidth="3.5" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                      </svg>
                      <span className="absolute text-[10px] font-bold text-slate-800">65%</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ========================================== */}
          {/* TAB 2: FIELD ANALYTICS                     */}
          {/* ========================================== */}
          {activeTab === 'analytics' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-base font-bold text-slate-900">{t.fieldAnalytics}</h2>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-1 rounded-full">
                  Season 2026
                </span>
              </div>

              {/* Growth Progress Chart */}
              <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-xs text-slate-400 font-medium">{t.growthProgress}</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-slate-900">+14%</span>
                      <span className="text-xs font-semibold text-emerald-600">{t.vsAverage}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full">
                    Weekly Growth
                  </span>
                </div>

                <div className="h-28 w-full">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 300 80">
                    <defs>
                      <linearGradient id="chartGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#16a34a" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#16a34a" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path fill="url(#chartGrad)" d="M 0,60 Q 50,45 100,50 T 200,20 T 300,10 L 300,80 L 0,80 Z" />
                    <path fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" d="M 0,60 Q 50,45 100,50 T 200,20 T 300,10" />
                    <circle cx="300" cy="10" r="4" fill="#16a34a" stroke="#ffffff" strokeWidth="2" />
                  </svg>
                </div>

                <div className="flex justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-100 font-medium">
                  <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                </div>
              </div>

              {/* Pest Risk Alert */}
              <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-3.5 text-amber-900">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span className="text-xs font-bold text-amber-900">{t.pestAlertTitle}</span>
                  </div>
                  <span className="text-[10px] font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded">
                    Moderate
                  </span>
                </div>
                <p className="text-xs text-amber-800 leading-relaxed mb-2">
                  {t.pestAlertText}
                </p>
              </div>

              {/* Soil Composition NPK Breakdown */}
              <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
                <h3 className="text-xs font-bold text-slate-800 mb-3">{t.soilComposition}</h3>
                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-slate-50 p-2.5 rounded-xl text-center">
                    <span className="text-[10px] text-slate-400 font-bold block mb-1">N (Nitrogen)</span>
                    <span className="text-xs font-black text-slate-800 block">180 mg/kg</span>
                    <span className="text-[9px] text-emerald-600 font-bold">{t.optimal}</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl text-center">
                    <span className="text-[10px] text-slate-400 font-bold block mb-1">P (Phosphorus)</span>
                    <span className="text-xs font-black text-slate-800 block">42 mg/kg</span>
                    <span className="text-[9px] text-amber-600 font-bold">{t.lowLevel}</span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl text-center">
                    <span className="text-[10px] text-slate-400 font-bold block mb-1">K (Potassium)</span>
                    <span className="text-xs font-black text-slate-800 block">210 mg/kg</span>
                    <span className="text-[9px] text-emerald-600 font-bold">{t.optimal}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================== */}
          {/* TAB 3: AI LEAF DISEASE SCANNER              */}
          {/* ========================================== */}
          {activeTab === 'scan' && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-slate-900">{t.scanHeader}</h2>

              {/* Viewfinder / Image Frame */}
              <div className="relative rounded-3xl overflow-hidden aspect-square bg-slate-950 border-2 border-slate-800 flex items-center justify-center shadow-xl">
                <img 
                  src={uploadedImage} 
                  alt="Crop Leaf" 
                  className="absolute inset-0 w-full h-full object-cover opacity-90"
                />

                {/* Animated Viewfinder Overlay */}
                <div className="absolute inset-8 border-2 border-dashed border-amber-400/90 rounded-2xl pointer-events-none flex items-center justify-center">
                  <div className="w-full h-0.5 bg-emerald-400/90 shadow-lg shadow-emerald-400 animate-pulse" />
                </div>

                {/* Scanner Overlay Status Badge */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-700 text-white text-xs font-medium flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${isScanning ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`} />
                  {isScanning ? t.analyzingText : t.scanInstruction}
                </div>
              </div>

              {/* Upload Controls & Presets */}
              <div className="grid grid-cols-2 gap-2">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
                
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition"
                >
                  <Upload className="w-4 h-4" />
                  {t.uploadBtn}
                </button>

                <button 
                  onClick={() => triggerScan('healthy')}
                  className="py-2.5 px-3 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  {t.demoLeaf2}
                </button>
              </div>

              {/* Diagnostic Result Section */}
              {!isScanning && (
                <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-md space-y-3 animate-fade-in">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-sm font-extrabold text-slate-900">
                        {scanResultType === 'diseased' ? t.detectedTitle : t.healthyTitle}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
                          {scanResultType === 'diseased' ? t.confidence : t.healthyConfidence}
                        </span>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${scanResultType === 'diseased' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
                      {scanResultType === 'diseased' ? t.highSeverity : t.healthySeverity}
                    </span>
                  </div>

                  {scanResultType === 'diseased' && (
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-slate-50 p-2.5 rounded-xl">
                        <span className="text-[10px] text-slate-400 block mb-0.5">{t.affectedArea}</span>
                        <span className="font-bold text-slate-800">{t.affectedParts}</span>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded-xl">
                        <span className="text-[10px] text-slate-400 block mb-0.5">{t.cause}</span>
                        <span className="font-bold text-slate-800">{t.causeType}</span>
                      </div>
                    </div>
                  )}

                  <div className="space-y-1">
                    <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      {t.recommendedAction}
                    </span>
                    <p className="text-xs text-slate-600 leading-relaxed bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100">
                      {scanResultType === 'diseased' ? t.actionText : t.healthyActionText}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================== */}
          {/* TAB 4: FERTILIZER CALCULATOR               */}
          {/* ========================================== */}
          {activeTab === 'calc' && (
            <div className="space-y-4">
              <h2 className="text-base font-bold text-slate-900">{t.calcTitle}</h2>

              <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                {/* Crop Type Select */}
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">{t.selectCrop}</label>
                  <select 
                    value={selectedCrop}
                    onChange={e => setSelectedCrop(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-xl p-3 font-bold focus:ring-2 focus:ring-emerald-500 outline-none"
                  >
                    <option value="rice">{lang === 'EN' ? 'Rice / Paddy (ধান)' : 'ধান'}</option>
                    <option value="corn">{lang === 'EN' ? 'Corn / Maize (ভুট্টা)' : 'ভুট্টা'}</option>
                    <option value="wheat">{lang === 'EN' ? 'Wheat (গম)' : 'গম'}</option>
                  </select>
                </div>

                {/* Farm Area Range Slider */}
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1.5">
                    <span className="text-slate-700">{t.farmArea}</span>
                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">{acres} {lang === 'EN' ? 'Acres' : 'একর'}</span>
                  </div>
                  <input 
                    type="range" 
                    min="0.5" 
                    max="15" 
                    step="0.5"
                    value={acres} 
                    onChange={e => setAcres(Number(e.target.value))}
                    className="w-full accent-emerald-600 cursor-pointer"
                  />
                </div>

                {/* Result Cards */}
                {fertResult && (
                  <div className="pt-2 space-y-3 border-t border-slate-100">
                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-slate-50 p-2.5 rounded-xl text-center">
                        <span className="text-[10px] text-slate-400 font-bold block mb-0.5">{t.ureaBags}</span>
                        <span className="text-sm font-black text-slate-900">{fertResult.urea} <span className="text-[10px] text-slate-500 font-normal">Bags</span></span>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded-xl text-center">
                        <span className="text-[10px] text-slate-400 font-bold block mb-0.5">{t.dapBags}</span>
                        <span className="text-sm font-black text-slate-900">{fertResult.dap} <span className="text-[10px] text-slate-500 font-normal">Bags</span></span>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded-xl text-center">
                        <span className="text-[10px] text-slate-400 font-bold block mb-0.5">{t.mopBags}</span>
                        <span className="text-sm font-black text-slate-900">{fertResult.mop} <span className="text-[10px] text-slate-500 font-normal">Bags</span></span>
                      </div>
                    </div>

                    <div className="bg-emerald-50 p-3.5 rounded-2xl border border-emerald-200 text-center">
                      <span className="text-xs text-emerald-800 font-semibold block">{t.totalEstCost}</span>
                      <div className="text-2xl font-black text-emerald-700 mt-0.5">
                        ৳{fertResult.costBDT.toLocaleString()} <span className="text-xs font-normal text-emerald-800">/ ${fertResult.costUSD}</span>
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-400 italic text-center">{t.costNotice}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================== */}
          {/* TAB 5: ALERTS & RISKS                      */}
          {/* ========================================== */}
          {activeTab === 'alerts' && (
            <div className="space-y-3">
              <h2 className="text-base font-bold text-slate-900">{t.alertsTitle}</h2>
              
              <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm flex gap-3 items-start">
                <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 mb-0.5">Weather Advisory</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{t.alert1}</p>
                </div>
              </div>

              <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm flex gap-3 items-start">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 mb-0.5">Fertilizer Top-dressing Reminder</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{t.alert2}</p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================== */}
          {/* TAB 6: SETTINGS                            */}
          {/* ========================================== */}
          {activeTab === 'settings' && (
            <div className="space-y-3">
              <h2 className="text-base font-bold text-slate-900">{t.settingsTitle}</h2>

              <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                {/* Language Picker */}
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">{t.languageSetting}</h4>
                    <p className="text-[11px] text-slate-400">English / বাংলা toggle</p>
                  </div>
                  <button 
                    onClick={() => setLang(prev => prev === 'EN' ? 'BN' : 'EN')}
                    className="bg-emerald-100 text-emerald-800 font-bold text-xs px-3 py-1.5 rounded-full"
                  >
                    {lang === 'EN' ? 'English' : 'বাংলা'}
                  </button>
                </div>

                {/* API Status */}
                <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
                  <div>
                    <h4 className="text-xs font-bold text-slate-800">{t.apiStatus}</h4>
                    <p className="text-[11px] text-emerald-600 font-medium">{t.connected}</p>
                  </div>
                  <button 
                    onClick={() => fetchLiveWeather(coords.lat, coords.lon)}
                    className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl"
                  >
                    <RefreshCw className="w-4 h-4 text-slate-700" />
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* ========================================== */}
        {/* FLOATING BOTTOM NAVIGATION BAR             */}
        {/* ========================================== */}
        <div className="absolute bottom-3 left-4 right-4 bg-white/95 backdrop-blur-md rounded-full shadow-2xl border border-slate-100 px-3 py-2 flex justify-between items-center z-40">
          
          {/* Home */}
          <button 
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-bold px-2 py-1 rounded-full transition ${activeTab === 'home' ? 'text-emerald-700' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Home className="w-4 h-4" />
            <span>{t.tabHome}</span>
          </button>

          {/* Analytics */}
          <button 
            onClick={() => setActiveTab('analytics')}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-bold px-2 py-1 rounded-full transition ${activeTab === 'analytics' ? 'text-emerald-700' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <BarChart2 className="w-4 h-4" />
            <span>{t.tabAnalytics}</span>
          </button>

          {/* Floating AI Scan Camera FAB */}
          <button 
            onClick={() => triggerScan('diseased')}
            className="w-12 h-12 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full flex items-center justify-center shadow-lg shadow-emerald-600/30 transform -translate-y-3 border-4 border-slate-50 transition active:scale-95"
            title="Scan Leaf Image"
          >
            <Camera className="w-5 h-5" />
          </button>

          {/* Alerts */}
          <button 
            onClick={() => setActiveTab('alerts')}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-bold px-2 py-1 rounded-full transition ${activeTab === 'alerts' ? 'text-emerald-700' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Bell className="w-4 h-4" />
            <span>{t.tabAlerts}</span>
          </button>

          {/* Fertilizer Calculator */}
          <button 
            onClick={() => setActiveTab('calc')}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-bold px-2 py-1 rounded-full transition ${activeTab === 'calc' ? 'text-emerald-700' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <DollarSign className="w-4 h-4" />
            <span>{t.tabCalc}</span>
          </button>

        </div>

      </div>
    </div>
  );
}