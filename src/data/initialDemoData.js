// Preloaded realistic demo batches and alerts for initial launch

export const INITIAL_DEMO_RECORDS = [
  {
    id: "rec-tomato-demo-1",
    farmerName: "Murugan Selvam",
    cropId: "tomato",
    cropName: "Tomato",
    cropNameTa: "தக்காளி",
    cropIcon: "🍅",
    quantity: 450,
    quantityUnit: "kg",
    harvestDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    storageDays: 4,
    storageType: "Open Storage",
    temperature: 31,
    humidity: 78,
    riskScore: 82,
    riskLevel: "HIGH",
    safeDaysRemaining: 2,
    reasons: [
      "Temperature (31°C) is above the recommended range of 12°C–18°C",
      "Relative humidity (78%) differs from recommended high humidity (85%–90%), accelerating skin dehydration",
      "Open floor storage exposes produce to ambient heat fluctuation and spore build-up",
      "Crop has already been in storage for 4 days"
    ],
    reasonsTa: [
      "வெப்பநிலை (31°C) பரிந்துரைக்கப்பட்ட 12°C–18°C வரம்பை விட அதிகமாக உள்ளது",
      "ஈரப்பதம் (78%) பரிந்துரைக்கப்பட்ட 85%–90% அளவை விட குறைவாக உள்ளதால் தோல் வறண்டு அழுகும்",
      "திறந்தவெளி தரை சேமிப்பு அதிக வெப்பம் மற்றும் பூஞ்சை தொற்று பாதிப்புகளை நேரடியாக உருவாக்குகிறது",
      "பயிர் ஏற்கனவே 4 நாட்கள் சேமிப்பில் உள்ளது"
    ],
    consequences: [
      "High temperature and open air exposure will trigger rapid softening, leakage, and fungal rot within 48 hours.",
      "Marketable value will drop by 30-50% if produce is not relocated or sold immediately."
    ],
    consequencesTa: [
      "அதிக வெப்பம் மற்றும் திறந்த சேமிப்பால் அடுத்த 48 மணி நேரத்தில் தக்காளி நசுங்கி அழுகத் தொடங்கும்.",
      "உடனடியாக விற்காவிட்டால் சந்தை மதிப்பு 30-50% வரை வீழ்ச்சியடையும்."
    ],
    recommendations: [
      {
        action: "Move crop immediately to a shaded, ventilated area",
        actionTa: "விளைபொருளை உடனே குளிர்ந்த, நிழலான, நல்ல காற்றோட்டமுள்ள இடத்திற்கு மாற்றவும்",
        priority: "CRITICAL",
        icon: "Wind"
      },
      {
        action: "Spread into single-layer aerated plastic crates; avoid heaps",
        actionTa: "குவித்து வைப்பதை தவிர்த்து காற்றோட்டமுள்ள துளை பெட்டிகளில் ஒற்றை அடுக்காக பரப்பவும்",
        priority: "CRITICAL",
        icon: "Layers"
      },
      {
        action: "Sell to nearest mandi (Sivakasi / Madurai) within 2 days to prevent financial loss",
        actionTa: "பொருளாதார இழப்பைத் தவிர்க்க இன்னும் 2 நாட்களுக்குள் சந்தையில் விற்றுவிடவும்",
        priority: "CRITICAL",
        icon: "ShoppingBag"
      }
    ],
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "rec-onion-demo-2",
    farmerName: "Karthik R.",
    cropId: "onion",
    cropName: "Onion",
    cropNameTa: "வெங்காயம்",
    cropIcon: "🧅",
    quantity: 1200,
    quantityUnit: "kg",
    harvestDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    storageDays: 14,
    storageType: "Gunny Bag",
    temperature: 28,
    humidity: 75,
    riskScore: 54,
    riskLevel: "MEDIUM",
    safeDaysRemaining: 12,
    reasons: [
      "Temperature (28°C) is above the ideal threshold (max 25°C)",
      "Relative humidity (75%) exceeds the recommended ceiling (65%-70%), creating damp conditions",
      "Gunny bags absorb ambient moisture during monsoon humid spells",
      "Crop is 14 days old in storage"
    ],
    reasonsTa: [
      "வெப்பநிலை (28°C) உகந்த வரம்பை விட (அதிகபட்சம் 25°C) சற்று அதிகமாக உள்ளது",
      "ஈரப்பதம் (75%) பரிந்துரைக்கப்பட்ட 65%-70% அளவை தாண்டி உள்ளதால் ஈரக்கசிவு ஏற்படும் அபாயம் உள்ளது",
      "மழைக்கால ஈரப்பதத்தில் சணல் சாக்குகள் ஈரத்தை உறிஞ்சுகின்றன",
      "பயிர் சேமிக்கப்பட்டு 14 நாட்கள் ஆகியுள்ளன"
    ],
    consequences: [
      "Excess humidity may trigger root emergence, neck rot, and black mold within 7-10 days if left unventilated."
    ],
    consequencesTa: [
      "அதிக ஈரப்பதம் காரணமாக அடுத்த 7-10 நாட்களில் வேர் விடுதல் மற்றும் கருப்பு பூஞ்சை வர வாய்ப்புள்ளது."
    ],
    recommendations: [
      {
        action: "Improve airflow and place bags on raised wooden dunnage slats",
        actionTa: "சாக்குகளை தரையில் வைக்காமல் மரப்பலகைகள் மீது வைத்து காற்றோட்டம் தரவும்",
        priority: "MEDIUM",
        icon: "Wind"
      },
      {
        action: "Recheck bulb firmness and moisture levels within 24 hours",
        actionTa: "அடுத்த 24 மணி நேரத்திற்குள் வெங்காயத்தின் ஈரப்பதத்தை மீண்டும் ஆய்வு செய்யவும்",
        priority: "MEDIUM",
        icon: "Clock"
      }
    ],
    createdAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "rec-rice-demo-3",
    farmerName: "Anbarasu M.",
    cropId: "rice",
    cropName: "Rice (Paddy/Grain)",
    cropNameTa: "நெல் / அரிசி",
    cropIcon: "🌾",
    quantity: 3500,
    quantityUnit: "kg",
    harvestDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    storageDays: 30,
    storageType: "Warehouse",
    temperature: 24,
    humidity: 56,
    riskScore: 18,
    riskLevel: "LOW",
    safeDaysRemaining: 180,
    reasons: [
      "Temperature (24°C) is within safe recommended threshold (15°C–24°C)",
      "Relative humidity (56%) is optimal for grain moisture stabilization",
      "Ventilated warehouse provides adequate thermal insulation and rodent barrier",
      "Moisture level is well below mold thresholds"
    ],
    reasonsTa: [
      "வெப்பநிலை (24°C) பாதுகாப்பான வரம்பில் உள்ளது (15°C–24°C)",
      "ஈரப்பதம் (56%) தானிய சேமிப்புக்கு மிகவும் உகந்த அளவில் உள்ளது",
      "காற்றோட்டமான கிடங்கு வெப்பம் மற்றும் பூச்சிகளிலிருந்து நல்ல பாதுகாப்பு தருகிறது",
      "தானியத்தில் பூஞ்சை பிடிக்கும் அபாயம் இல்லை"
    ],
    consequences: [
      "Current conditions are optimal. Safe for medium- to long-term storage without quality deterioration."
    ],
    consequencesTa: [
      "சேமிப்பு சூழல் மிக நன்று. நீண்ட காலம் தரம் குறையாமல் வைத்திருக்கலாம்."
    ],
    recommendations: [
      {
        action: "Current conditions are safe. Continue periodic inspections every 15 days.",
        actionTa: "சேமிப்பு பாதுகாப்பானது. 15 நாட்களுக்கு ஒருமுறை வழக்கமான ஆய்வு செய்யவும்.",
        priority: "LOW",
        icon: "CheckCircle"
      }
    ],
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()
  }
];

export const INITIAL_DEMO_ALERTS = [
  {
    id: "alt-1",
    recordId: "rec-tomato-demo-1",
    cropName: "Tomato",
    cropNameTa: "தக்காளி",
    riskLevel: "HIGH",
    message: "Tomato storage conditions require immediate attention: High spoilage risk (82/100) under 31°C open heat. Only ~2 safe days remaining.",
    messageTa: "தக்காளி சேமிப்பு சூழலுக்கு உடனடி கவனம் தேவை: 31°C திறந்த வெப்பத்தில் அழுகல் அபாயம் அதிகம் (82/100). பாதுகாப்பான சேமிப்புக்கு இன்னும் ~2 நாட்கள் மட்டுமே உள்ளது.",
    isRead: false,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "alt-2",
    recordId: "rec-onion-demo-2",
    cropName: "Onion",
    cropNameTa: "வெங்காயம்",
    riskLevel: "MEDIUM",
    message: "Onion storage humidity is approaching the recommended limit (75% RH). Improve air ventilation to prevent neck rot.",
    messageTa: "வெங்காய சேமிப்பு ஈரப்பதம் உச்ச வரம்பை நெருங்குகிறது (75% RH). அழுகலைத் தடுக்க காற்றோட்டத்தை அதிகரிக்கவும்.",
    isRead: false,
    timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "alt-3",
    recordId: "rec-rice-demo-3",
    cropName: "Rice",
    cropNameTa: "நெல்",
    riskLevel: "SAFE",
    message: "Rice storage conditions are currently within the safe range (56% RH, 24°C). Warehouse conditions are stable.",
    messageTa: "நெல் சேமிப்பு சூழல் தற்போது பாதுகாப்பான வரம்பில் உள்ளது (56% RH, 24°C). கிடங்கு நிலை சீராக உள்ளது.",
    isRead: true,
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  }
];
