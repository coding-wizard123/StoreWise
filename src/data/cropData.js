// Crop storage knowledge base & biological thresholds

export const CROP_DATA = [
  {
    id: "tomato",
    name: "Tomato",
    nameTa: "தக்காளி",
    category: "Perishable Vegetable",
    categoryTa: "அழுகும் காய்கறி",
    icon: "🍅",
    color: "#ef4444",
    // Biological storage thresholds
    minTemp: 12,
    maxTemp: 18,
    minHumidity: 85,
    maxHumidity: 90,
    typicalStorageDays: 14,
    criticalTempHigh: 28, // rapid degradation threshold
    recommendedStorage: "Well-ventilated crates in cool shaded area, or controlled cold room at 13-15°C",
    recommendedStorageTa: "குளிர்ந்த நிழலான பகுதியில் காற்றோட்டமான பிளாஸ்டிக் பெட்டிகளில் அல்லது 13-15°C குளிர்சாதன அறையில் சேமிக்கவும்",
    spoilageRisks: [
      "Skin softening, water loss, and shriveling due to excessive heat",
      "Bacterial soft rot and gray mold (Botrytis) triggered by high humidity and stagnant air",
      "Accelerated ethylene gas accumulation when piled in closed open heaps",
      "Chilling injury if kept below 10°C (leads to blotchy ripening)"
    ],
    spoilageRisksTa: [
      "அதிக வெப்பத்தால் தோல் சுருங்குதல் மற்றும் நீர்ச்சத்து குறைந்து அழுகுதல்",
      "ஈரப்பதம் மற்றும் போதிய காற்றோட்டம் இன்மையால் பூஞ்சை மற்றும் பாக்டீரியா தொற்று ஏற்படுதல்",
      "குவித்து வைப்பதால் எத்திலீன் வாயு அதிகரித்து விரைவாக பழுத்து அழுகுதல்",
      "10°C-க்கு கீழ் வைத்தால் பயிர் குளிர்வினால் பாதிக்கப்பட்டு கரும்புள்ளிகள் தோன்றும்"
    ],
    preventionTips: [
      "Never store tomatoes in direct sunlight or sealed plastic sacks",
      "Keep stems attached or store calyx-down in shallow single-layer crates",
      "Maintain active air circulation; keep 15cm gap between crate stacks",
      "Separate overripe tomatoes daily to prevent ethylene spreading to healthy lot"
    ],
    preventionTipsTa: [
      "நேரடி வெயிலிலோ அல்லது பிளாஸ்டிக் சாக்குகளிலோ அடைத்து வைக்கக் கூடாது",
      "ஒற்றை அடுக்காக காற்றோட்டமுள்ள பெட்டிகளில் காம்பு கீழாக இருக்குமாறு வைக்கவும்",
      "பெட்டி அடுக்குகளுக்கு இடையே 15 செ.மீ இடைவெளி விட்டு நல்ல காற்றோட்டம் தரவும்",
      "பழுத்த அல்லது வெடித்த தக்காளிகளை தினமும் பிரித்தெடுத்து அகற்றவும்"
    ]
  },
  {
    id: "onion",
    name: "Onion",
    nameTa: "வெங்காயம்",
    category: "Semi-Perishable Bulb",
    categoryTa: "கிழங்கு / வெங்காயம்",
    icon: "🧅",
    color: "#b45309",
    minTemp: 0,
    maxTemp: 25,
    minHumidity: 65,
    maxHumidity: 70,
    typicalStorageDays: 90,
    criticalTempHigh: 32,
    recommendedStorage: "Dry, well-aerated bamboo racks (pattarai) or open mesh bags with <70% humidity",
    recommendedStorageTa: "உலர்ந்த, நல்ல காற்றோட்டமுள்ள மூங்கில் பட்டறை அல்லது வலைப்பைகளில் 70% குறைவான ஈரப்பதத்தில் வைக்கவும்",
    spoilageRisks: [
      "Neck rot (Botrytis allii) and black mold (Aspergillus) under damp conditions",
      "Premature sprouting if temperature stays between 10°C and 20°C with moisture",
      "Root emergence and bulb softening due to floor moisture absorption",
      "Heat rotting if stored in tight closed polythene or dense piles"
    ],
    spoilageRisksTa: [
      "அதிக ஈரப்பதத்தால் கழுத்து அழுகல் மற்றும் கருப்பு பூஞ்சை உருவாவது",
      "ஈரப்பதமான சூழலில் 10°C முதல் 20°C வரை இருந்தால் முளைகட்டத் தொடங்குவது",
      "தரை ஈரத்தை உறிஞ்சி வேர் விடுதல் மற்றும் அழுகல் ஏற்படுதல்",
      "காற்றோட்டம் இல்லாத அடர்ந்த குவியல்களில் வெப்பம் கூடி அழுகுவது"
    ],
    preventionTips: [
      "Thoroughly cure onions in open shade for 10-14 days before bulk storage",
      "Store on raised bamboo racks (pattarai) at least 1 foot off the damp ground",
      "Keep relative humidity below 70%; humidity is onions' biggest enemy",
      "Inspect weekly and immediately discard softened or sprouted bulbs"
    ],
    preventionTipsTa: [
      "சேமிப்பதற்கு முன் 10-14 நாட்கள் நிழலில் நன்கு உலர்த்தி தாள் காய வைக்க வேண்டும்",
      "தரையில் இருந்து 1 அடி உயரத்தில் அமைக்கப்பட்ட மூங்கில் பட்டறையில் பரப்பவும்",
      "ஈரப்பதம் 70%-க்கு மேல் போகாமல் உலர்ந்த சூழலை பராமரிக்கவும்",
      "வாரந்தோறும் ஆய்வு செய்து மென்மையான அல்லது முளைத்த வெங்காயங்களை அகற்றவும்"
    ]
  },
  {
    id: "potato",
    name: "Potato",
    nameTa: "உருளைக்கிழங்கு",
    category: "Tuber",
    categoryTa: "கிழங்கு வகை",
    icon: "🥔",
    color: "#ca8a04",
    minTemp: 7,
    maxTemp: 10,
    minHumidity: 85,
    maxHumidity: 90,
    typicalStorageDays: 120,
    criticalTempHigh: 26,
    recommendedStorage: "Dark, well-ventilated warehouse or cold storage with controlled humidity",
    recommendedStorageTa: "இருண்ட, நல்ல காற்றோட்டமுள்ள சேமிப்பு கிடங்கு அல்லது ஈரப்பதம் கட்டுப்படுத்தப்பட்ட குளிர்சாதன கிடங்கு",
    spoilageRisks: [
      "Greening and poisonous solanine accumulation from exposure to light",
      "Bacterial soft rot and dry rot (Fusarium) in poorly ventilated humid heaps",
      "Sprouting and shrinkage weight loss when temperature exceeds 15°C",
      "Sugar accumulation if stored below 4°C (ruins processing/cooking quality)"
    ],
    spoilageRisksTa: [
      "வெளிச்சம் படுவதால் பச்சை நிறமாக மாறி நச்சுத்தன்மை கொண்ட சோலனைன் உருவாவது",
      "காற்றோட்டம் இல்லாத குவியல்களில் பாக்டீரியா மென் அழுகல் மற்றும் உலர் அழுகல்",
      "15°C-க்கு மேல் வெப்பம் அதிகரிக்கும் போது முளை கட்டுதல் மற்றும் எடை குறைதல்",
      "4°C-க்கு கீழ் வைத்தால் சர்க்கரை அளவு கூடி தரம் கெடுதல்"
    ],
    preventionTips: [
      "Store strictly in darkness using breathable jute bags; avoid any light",
      "Cure harvested tubers for 10 days at 15-20°C with 85% RH to heal skin cuts",
      "Ensure bottom-to-top air circulation through slatted pallets",
      "Maintain ambient temperature below 15°C to suppress sprout development"
    ],
    preventionTipsTa: [
      "முற்றிலும் இருண்ட இடத்தில் சணல் சாக்குகளில் சேமிக்கவும்; வெளிச்சம் படக்கூடாது",
      "அறுவடைக்கு பின் தோல் கடினப்பட 10 நாட்கள் 15-20°C நிழலில் உலர்த்தவும்",
      "மர பலகைகள் மீது வைத்து அடிப்பகுதியில் இருந்து காற்றோட்டம் வர வழிசெய்யவும்",
      "முளை கட்டுவதை தடுக்க சேமிப்பு வெப்பநிலையை 15°C-க்கு குறைவாக வைக்கவும்"
    ]
  },
  {
    id: "rice",
    name: "Rice (Paddy/Grain)",
    nameTa: "நெல் / அரிசி",
    category: "Cereal Grain",
    categoryTa: "தானியம்",
    icon: "🌾",
    color: "#16a34a",
    minTemp: 15,
    maxTemp: 24,
    minHumidity: 50,
    maxHumidity: 65,
    typicalStorageDays: 365,
    criticalTempHigh: 35,
    recommendedStorage: "Moisture-proof warehouse, hermetic grain bags, or metal bins with grain moisture <14%",
    recommendedStorageTa: "ஈரப்பதம் இல்லாத சேமிப்புக் கிடங்கு, காற்றுப்புகா தானிய பைகள் அல்லது உலோகம் / மூங்கில் தொம்பிகள்",
    spoilageRisks: [
      "Aflatoxin-producing Aspergillus flavus fungus if stored at >14% grain moisture",
      "Stored-grain insect pests (rice weevil, lesser grain borer) multiplying in warm air",
      "Milling quality reduction and grain yellowing from respiratory heat in heaps",
      "Moisture migration and crusting at top layer when warehouse walls heat up"
    ],
    spoilageRisksTa: [
      "நெல் ஈரப்பதம் 14%-க்கு மேல் இருந்தால் அஃப்லாடாக்சின் நச்சு பூஞ்சை உருவாவது",
      "வெப்பமான சூழலில் கூன் வண்டு, மாவு வண்டு போன்ற பூச்சிகள் பெருகி தானியத்தை அரிப்பது",
      "குவியலில் வெப்பம் கூடி அரிசி மஞ்சள் நிறமாக மாறுதல் மற்றும் உடைசல் அதிகரித்தல்",
      "சுவர் மற்றும் தரை ஈரம் பட்டு தானியங்கள் கட்டி பிடித்து அழுகுவது"
    ],
    preventionTips: [
      "Sun-dry thoroughly until grain moisture is strictly below 13-14%",
      "Stack gunny bags on wooden dunnage crates 1.5 ft away from walls",
      "Use airtight hermetic bags (PICS / Super Grain bags) to eliminate weevils naturally",
      "Keep storage area rodent-proof and seal roof leaks immediately"
    ],
    preventionTipsTa: [
      "நெல்லை வெயிலில் நன்கு உலர்த்தி ஈரப்பதத்தை 13-14%-க்கு கீழ் கொண்டு வரவும்",
      "சுவர்களில் இருந்து 1.5 அடி தள்ளி மரப் பலகைகளின் மேல் சாக்குகளை அடுக்கவும்",
      "கூன் வண்டுகளைத் தடுக்க காற்றுப்புகா ஹெர்மெடிக் பைகளை (Super Grain Bags) பயன்படுத்தவும்",
      "எலி மற்றும் பூச்சிகள் வராமல் தரை மற்றும் கூரை ஓட்டைகளை அடைக்கவும்"
    ]
  },
  {
    id: "banana",
    name: "Banana",
    nameTa: "வாழைப்பழம்",
    category: "Climacteric Fruit",
    categoryTa: "பழ வகை",
    icon: "🍌",
    color: "#eab308",
    minTemp: 13,
    maxTemp: 15,
    minHumidity: 85,
    maxHumidity: 90,
    typicalStorageDays: 21,
    criticalTempHigh: 28,
    recommendedStorage: "Hanging bunches in cool shaded packing shed or 13-14°C cold store with ethylene scrubber",
    recommendedStorageTa: "குளிர்ந்த நிழலான கூடத்தில் தார்களை தொங்கவிடுதல் அல்லது 13-14°C குளிர்சாதன அறையில் சேமித்தல்",
    spoilageRisks: [
      "Rapid runaway ripening and oversoftening when exposed to heat and ethylene",
      "Crown rot (Colletotrichum musae) and finger drop at humid stem cuts",
      "Skin blackening and pulp failure if chilled below 12°C",
      "Weight loss and finger shriveling in dry windy conditions"
    ],
    spoilageRisksTa: [
      "அதிக வெப்பம் மற்றும் எத்திலீன் வாயுவினால் மிக வேகமாக கனிந்து அழுகிப்போதல்",
      "தண்டுப்பகுதியில் ஈரப்பதம் தேங்குவதால் காம்பு அழுகல் மற்றும் பழங்கள் உதிர்தல்",
      "12°C-க்கு கீழ் குளிர்வித்தால் தோல் கறுத்து சுவை மற்றும் தரம் கெடுதல்",
      "காற்றோட்டம் அதிகமுள்ள உலர்ந்த இடத்தில் பழங்கள் சுருங்குதல்"
    ],
    preventionTips: [
      "Hang bunches upside down on padded hooks; avoid resting fruit directly on floor",
      "Keep away from ripening fruit or vehicle exhaust (ethylene sources)",
      "Treat crown cut surface with clean potassium sorbate or food-grade alum paste",
      "Harvest at 75-80% maturity stage (3/4th round) for long-distance transport"
    ],
    preventionTipsTa: [
      "தார்களை தரையில் வைக்காமல் கொக்கிகளில் தலைகீழாக தொங்கவிடவும்",
      "பழுத்த பழங்கள் அல்லது வாகன புகைக்கு அருகில் வைக்கக் கூடாது",
      "அறுவடை செய்த தண்டுப்பகுதியில் படிகாரம் அல்லது பாதுகாப்பான பூஞ்சைக்கட்டுப்பூச்சு இடவும்",
      "நீண்ட தூர சந்தைக்கு அனுப்ப 75-80% முதிர்ச்சியில் முக்கால் காயாக அறுவடை செய்யவும்"
    ]
  },
  {
    id: "chilli",
    name: "Chilli (Green / Dry)",
    nameTa: "மிளகாய் (பச்சை / வற்றல்)",
    category: "Spice / Vegetable",
    categoryTa: "மசாலா / காய்கறி",
    icon: "🌶️",
    color: "#dc2626",
    minTemp: 8,
    maxTemp: 12,
    minHumidity: 60,
    maxHumidity: 70,
    typicalStorageDays: 25,
    criticalTempHigh: 30,
    recommendedStorage: "Perforated crates in cool dry shed; dried chillies in polythene-lined gunny bags with <10% moisture",
    recommendedStorageTa: "துளையிட்ட பெட்டிகளில் குளிர்ந்த கொட்டகை; வற்றல் மிளகாய் எனில் 10% குறைந்த ஈரப்பதத்தில் சாக்குகளில்",
    spoilageRisks: [
      "Anthracnose rot and black spot disease under high heat and dampness",
      "Rapid calyx yellowing, pod shriveling, and weight loss in dry open heat",
      "Loss of pungent capsaicin and red color fading in dry chillies exposed to sunlight",
      "Mould development and foul odor if packed wet after harvest rain"
    ],
    spoilageRisksTa: [
      "அதிக வெப்பம் மற்றும் ஈரப்பதத்தால் அந்த்ராக்னோஸ் புள்ளி அழுகல் நோய் தாக்குதல்",
      "சூடான காற்றில் காம்பு மஞ்சள் நிறமாகி மிளகாய் சுருங்கி எடை குறைதல்",
      "வற்றல் மிளகாயை வெயிலில் நீண்ட நேரம் வைத்தால் நிறம் மங்குதல் மற்றும் காரத்தன்மை குறைதல்",
      "மழையில் நனைந்த ஈரத்துடன் மூட்டையிட்டால் பூஞ்சை பூத்து நாற்றமடித்தல்"
    ],
    preventionTips: [
      "Pre-cool freshly picked green chillies in shade before crate packing",
      "Never store green chillies in tightly packed unventilated plastic sacks",
      "For dried chillies, maintain moisture strictly under 10% and store in dark cool rooms",
      "Avoid mixing rainy harvest with dry batches to prevent mold contagion"
    ],
    preventionTipsTa: [
      "பறித்த பச்சை மிளகாயை பெட்டிகளில் அடைக்கும் முன் நிழலில் பரப்பி குளிர்விக்கவும்",
      "காற்று புகாத பாலித்தீன் பைகளில் இறுக்கமாக அடைக்கக் கூடாது",
      "வற்றல் மிளகாய்க்கு ஈரப்பதத்தை 10%-க்குள் வைத்து இருண்ட உலர்ந்த இடத்தில் வைக்கவும்",
      "மழையில் பறித்த மிளகாய்களை நல்ல காய்களோடு கலந்து வைக்கக் கூடாது"
    ]
  }
];

export const STORAGE_TYPES = [
  { id: "Open Storage", name: "Open Storage (Floor/Heaps)", nameTa: "திறந்தவெளி சேமிப்பு (தரை/குவியல்)", riskMultiplier: 1.35, icon: "📦" },
  { id: "Gunny Bag", name: "Gunny / Jute Bag", nameTa: "சணல் / சாக்குப்பை சேமிப்பு", riskMultiplier: 1.0, icon: "🛍️" },
  { id: "Bamboo/Traditional Storage", name: "Bamboo / Traditional Pattarai", nameTa: "மூங்கில் / பாரம்பரிய பட்டறை", riskMultiplier: 0.95, icon: "🎋" },
  { id: "Warehouse", name: "Ventilated Warehouse", nameTa: "காற்றோட்டமான சேமிப்புக் கிடங்கு", riskMultiplier: 0.75, icon: "🏭" },
  { id: "Cold Storage", name: "Cold Storage Facility", nameTa: "குளிர்சாதன சேமிப்புக் கிடங்கு", riskMultiplier: 0.40, icon: "❄️" },
];
