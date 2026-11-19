/**
 * AgroAssist Rule-Based Engine (TypeScript implementation matching agroassist.py)
 * Developer: Niranjan
 * Pure rule-based processing: No ML, No external AI APIs.
 */

export interface RuleResponse {
  response: string;
  category: 'greeting' | 'about' | 'gratitude' | 'exit' | 'help' | 'pest_disease' | 'fertilizer' | 'irrigation' | 'weather' | 'soil' | 'farming_tips' | 'crop_info' | 'unknown' | 'empty';
  categoryLabel: string;
  matchedKeywords: string[];
  suggestedFollowUps?: string[];
}

export const GREETING_WORDS = ["hello", "hi", "hey", "good morning", "good afternoon", "good evening", "namaste", "vanakkam", "greetings"];
export const GREETING_RESPONSE = 
  "Hello! Welcome to AgroAssist. How can I help you with agriculture today?\n" +
  "You can ask me about crops, fertilizers, pest control, irrigation, weather, soil, or farming tips!";

export const ABOUT_WORDS = ["who are you", "what are you", "developer", "creator", "niranjan", "about you", "what is agroassist"];
export const ABOUT_RESPONSE = 
  "I am AgroAssist, a beginner-friendly rule-based agricultural support chatbot developed by Niranjan. " +
  "I am built using pure Python rules to help farmers get instant, simple, and practical farming advice without needing complex AI.";

export const THANKS_WORDS = ["thank you", "thanks", "thank u", "dhanyawad", "shukriya", "grateful"];
export const THANKS_RESPONSE = "You're welcome! Happy farming and wish you a bountiful harvest! 🌱";

export const EXIT_WORDS = ["bye", "goodbye", "exit", "quit", "see you", "close", "stop"];
export const EXIT_RESPONSE = "Goodbye! Take care of your crops. AgroAssist is always here whenever you need farming guidance! 🙏";

export const HELP_WORDS = ["help", "topics", "menu", "options", "what can you do", "features", "categories"];
export const HELP_RESPONSE = 
  "🌾 AgroAssist Supported Topics:\n" +
  "--------------------------------------------------\n" +
  "1. Crops: Rice, Wheat, Maize, Sugarcane, Tomato, Potato, Cotton\n" +
  "2. Fertilizers: Organic compost, Vermicompost, NPK, Urea, Biofertilizers\n" +
  "3. Pests & Diseases: Tomato leaf curl/blight, Rice stem borer, Neem spray, IPM\n" +
  "4. Irrigation: Drip watering, critical stages, saving water\n" +
  "5. Weather: Rainy season care, Summer heat protection, Frost prevention\n" +
  "6. Soil: Alluvial, Black, Red, Sandy, Loamy soils & Soil testing\n" +
  "7. Tips: Crop rotation, Mulching, Seed treatment, Storage\n" +
  "--------------------------------------------------\n" +
  "💡 Tip: Type questions in simple words, e.g., 'fertilizer for rice' or 'tomato pests'.";

export const CROP_DATA: Record<string, { title: string; text: string; icon: string }> = {
  rice: {
    title: "Rice (Paddy) Guide",
    icon: "🌾",
    text: "🌾 Rice (Paddy) Guide:\n" +
          "• Season: Kharif (sown in June-July) & Rabi in south/east regions.\n" +
          "• Soil: Clayey loam and alluvial soils with high water retention.\n" +
          "• Temperature: 22°C to 32°C with abundant water supply.\n" +
          "• Key Practice: Maintain shallow standing water (2-5 cm) during early tillering. " +
          "Drain water 10-14 days before harvesting for uniform grain ripening."
  },
  wheat: {
    title: "Wheat Guide",
    icon: "🌾",
    text: "🌾 Wheat Guide:\n" +
          "• Season: Rabi (winter) crop sown from late October to November.\n" +
          "• Soil: Well-drained fertile loams and clay loams.\n" +
          "• Temperature: Cool growing season (15°C - 20°C) and warm ripening.\n" +
          "• Key Practice: The first irrigation at Crown Root Initiation (CRI) stage (20-25 days after sowing) " +
          "is critical to establish a strong root system."
  },
  maize: {
    title: "Maize (Corn) Guide",
    icon: "🌽",
    text: "🌽 Maize (Corn) Guide:\n" +
          "• Season: Sown in Kharif, Rabi, and Spring seasons.\n" +
          "• Soil: Fertile, well-drained sandy loam to silty loam. Avoid waterlogged fields.\n" +
          "• Temperature: Warm climate (21°C - 27°C).\n" +
          "• Key Practice: Extremely sensitive to moisture stress during flowering (tasseling & silking)."
  },
  sugarcane: {
    title: "Sugarcane Guide",
    icon: "🎋",
    text: "🎋 Sugarcane Guide:\n" +
          "• Season: Long duration crop (10 to 18 months); planted in spring or autumn.\n" +
          "• Soil: Deep, well-drained fertile loamy soil rich in organic matter.\n" +
          "• Water: High water requirement (1500 to 2500 mm total).\n" +
          "• Key Practice: Earth up soil around rows in the 3rd and 4th months to prevent lodging during high winds."
  },
  tomato: {
    title: "Tomato Guide",
    icon: "🍅",
    text: "🍅 Tomato Guide:\n" +
          "• Season: Grown in winter (transplanted Oct-Nov) or spring-summer.\n" +
          "• Soil: Well-drained sandy loam rich in organic matter; pH 6.0 - 7.0.\n" +
          "• Temperature: 18°C to 28°C; highly sensitive to heavy frost and prolonged waterlogging.\n" +
          "• Key Practice: Stake plants with wooden poles or trellis to elevate foliage and keep fruits clean."
  },
  potato: {
    title: "Potato Guide",
    icon: "🥔",
    text: "🥔 Potato Guide:\n" +
          "• Season: Cool-season crop sown in October-November in plains.\n" +
          "• Soil: Well-aerated, loose sandy loam rich in organic matter.\n" +
          "• Key Practice: Earth up ridges when plants reach 15-20 cm to protect growing tubers from turning green."
  },
  cotton: {
    title: "Cotton Guide",
    icon: "🌱",
    text: "🌱 Cotton Guide:\n" +
          "• Season: Kharif crop sown in April-May (irrigated) or June-July (rainfed).\n" +
          "• Soil: Deep black cotton soil (regur) with excellent moisture retention capacity.\n" +
          "• Climate: Needs warm, sunny weather and a minimum of 180 frost-free days."
  }
};

export const FERTILIZER_DATA = {
  rice: "🌾 Rice Fertilizer Guidance:\n" +
        "• Organic: Incorporate 5-8 tons of farmyard manure (FYM) or green manure before puddling.\n" +
        "• Chemical: Follow balanced NPK (usually 100:50:50 kg/ha based on local soil test).\n" +
        "• Method: Apply full Phosphorus and Potash as basal dose. Apply Nitrogen (Urea) in 3 splits:\n" +
        "  1) 1/3rd at basal transplanting, 2) 1/3rd at tillering, 3) 1/3rd at panicle initiation.\n" +
        "• Note: Fertilizer requirements depend on soil conditions and crop growth stage. " +
        "For specific fertilizer quantities, follow a soil-test-based recommendation from an agricultural expert.",
  wheat: "🌾 Wheat Fertilizer Guidance:\n" +
         "• Balanced NPK: Recommended dose is typically 120 kg N, 60 kg P2O5, and 40 kg K2O per hectare.\n" +
         "• Application: Full P and K plus half Nitrogen applied at sowing time.\n" +
         "• Top-Dressing: Top-dress remaining Nitrogen in two equal splits after the 1st and 2nd irrigations.",
  tomato: "🍅 Tomato Fertilizer Guidance:\n" +
          "• Organic: Apply 10-15 tons of compost or vermicompost per acre during field preparation.\n" +
          "• Calcium: Ensure adequate calcium in soil to prevent Blossom End Rot (black rot at fruit base).\n" +
          "• Balanced NPK: Apply moderate nitrogen early, and boost potassium during flowering and fruit setting.",
  organic: "🌿 Organic Fertilizer & Compost Guidance:\n" +
           "• Farmyard Manure (FYM): Decomposed cow dung rich in humus; apply 2-3 weeks before sowing.\n" +
           "• Vermicompost: Earthworm castings rich in plant enzymes, beneficial microbes, and trace minerals.\n" +
           "• Neem Cake: Natural fertilizer that enriches nitrogen while deterring soil nematodes and termites.\n" +
           "• Biofertilizers: Treat seeds with Rhizobium (legumes) or Azotobacter / PSB (cereals and vegetables).",
  compost: "🍂 How to Make & Use Compost:\n" +
           "• Mix 3 parts brown waste (dry leaves, straw) with 1 part green waste (cow dung slurry, vegetable scraps).\n" +
           "• Keep moist like a damp sponge and turn the heap every 2 weeks for airflow.\n" +
           "• In 60-90 days, you will get dark, crumbly, sweet-smelling organic compost.\n" +
           "• Organic compost can improve soil health, retain moisture, and support beneficial soil microbes.",
  general: "🧪 Fertilizer Guidance:\n" +
           "• Fertilizer requirements depend on soil conditions and crop growth stage.\n" +
           "• Organic compost can improve soil health and water retention.\n" +
           "• Chemical fertilizers (Urea for Nitrogen, DAP for Phosphorus, MOP for Potassium) must be balanced.\n" +
           "• For specific fertilizer quantities, follow a soil-test-based recommendation from an agricultural expert."
};

export const PEST_DATA = {
  tomato: "🍅 Tomato Pest & Disease Management:\n" +
          "• First identify the pest affecting your tomato plants. Inspect the leaves and fruits regularly.\n" +
          "• Common Pests: Fruit borer caterpillar, whiteflies, leafminers, and aphids.\n" +
          "• Common Diseases: Early/Late Blight (brown-black leaf spots), Leaf Curl Virus (spread by whiteflies).\n" +
          "• Safe Action Steps:\n" +
          "  1. Install yellow sticky cards (8-10 per acre) to trap whiteflies and aphids.\n" +
          "  2. Spray organic Neem Oil (3-5 ml per liter of water + 1 ml liquid soap) at early pest sighting.\n" +
          "  3. Remove and safely destroy virus-infected plants immediately to prevent spreading.\n" +
          "• Use appropriate integrated pest management methods and consult a local agricultural officer before applying chemical pesticides.",
  rice: "🌾 Rice (Paddy) Pest & Disease Management:\n" +
        "• Yellow Stem Borer: Causes 'dead hearts' in tillers and 'whiteheads' in panicles. " +
        "Install 4-5 pheromone traps per acre to monitor and capture male moths.\n" +
        "• Rice Blast Disease: Spindle-shaped spots on leaves. Avoid excessive urea application; maintain proper water level.\n" +
        "• Brown Planthopper (BPH): Practice Alternate Wetting and Drying (AWD) rather than continuous stagnation.",
  wheat: "🌾 Wheat Pest & Disease Management:\n" +
         "• Yellow & Brown Rust: Yellow or orange powdery pustules on leaves. Plant resistant certified seed varieties.\n" +
         "• Aphids: Small green sucking bugs that cluster during cloudy winter weather. Spray neem extract if population is low.",
  general: "🐛 Integrated Pest Management (IPM) & Safe Steps:\n" +
           "• Inspect the leaves, stems, and fruits regularly twice a week.\n" +
           "• Prevention First: Use certified disease-free seeds, practice crop rotation, and avoid dense planting.\n" +
           "• Bio-control: Spray Neem Seed Kernel Extract (NSKE 5%) or Neem Oil (5ml/liter water).\n" +
           "• Beneficial Insects: Protect spiders, ladybird beetles, and dragonflies that naturally eat harmful pests.\n" +
           "• Always consult your local agricultural extension officer (KVK) before applying chemical pesticides."
};

export const IRRIGATION_DATA = {
  drip: "💧 Drip Irrigation System:\n" +
        "• Delivers precise water and soluble fertilizers directly to the crop root zone.\n" +
        "• Water Savings: Saves 40% to 70% water compared to flood irrigation.\n" +
        "• Weed Reduction: Inter-row soil stays dry, dramatically decreasing weed pressure.\n" +
        "• Best suited for vegetables (tomato, chili, capsicum), fruit orchards, sugarcane, and cotton.",
  rice: "💧 Rice Watering Guidance:\n" +
        "• Early Stage: Keep shallow standing water (2 to 5 cm) during transplanting and tillering.\n" +
        "• Mid Season: Practice Alternate Wetting and Drying (AWD) to save up to 30% water without lowering yield.\n" +
        "• Pre-harvest: Completely drain the field 10 to 14 days before harvest so grain dries evenly.",
  wheat: "💧 Wheat Watering Guidance:\n" +
         "• Wheat requires 4 to 6 irrigations during its lifecycle.\n" +
         "• Most Critical Stage: Crown Root Initiation (CRI) at 20-25 days after sowing. Never let the crop face moisture stress now.\n" +
         "• Other Critical Stages: Active tillering (40-45 days), Late jointing (60-65 days), Flowering (80-85 days), and Grain filling (100-105 days).",
  general: "💧 Irrigation Best Practices:\n" +
           "• Timing: Irrigate during early morning or evening hours to minimize evaporation losses.\n" +
           "• Mulching: Cover soil with crop residues or straw to retain moisture longer.\n" +
           "• Soil Check: Dig 2-3 inches into the soil; if soil forms a ball in your hand, moisture is adequate."
};

export const WEATHER_DATA = {
  rainy: "🌧️ Farming Advice for Rainy & Monsoon Conditions:\n" +
         "• Field Drainage: Clear field channels to ensure excess water drains out promptly; waterlogging causes root rot.\n" +
         "• Fertilizer & Sprays: Postpone fertilizer application and pesticide spraying when heavy rainfall is forecasted.\n" +
         "• Disease Vigilance: High humidity favors fungal spores. Scout for leaf spots and blight.\n" +
         "• Grain Protection: Keep harvested produce and seed bags off the ground on dry pallets covered with waterproof tarpaulins.",
  hot: "☀️ Farming Advice for Hot Summer & Heatwaves:\n" +
       "• Watering: Irrigate strictly in early morning or after sunset; mid-day watering heats the soil and shocks root systems.\n" +
       "• Mulching: Spread a 3-inch layer of straw or dry grass around crop stems to preserve moisture and cool soil.\n" +
       "• Nursery Care: Use agro-shade nets (50% shade) over delicate vegetable seedlings.\n" +
       "• Livestock: Keep farm animals in well-ventilated, shaded sheds with clean, cool drinking water.",
  dry: "🏜️ Farming Advice for Dry & Drought Conditions:\n" +
       "• Crop Choice: Choose drought-resistant, short-duration crops like millets (Ragi, Bajra) and pulses.\n" +
       "• Water Conservation: Adopt drip or sprinkler irrigation and avoid open furrow flooding.\n" +
       "• Tillage: Minimize deep plowing to prevent exposing moist subsoil to dry winds.",
  cold: "❄️ Farming Advice for Cold & Frost Conditions:\n" +
        "• Light Evening Irrigation: Give a light watering to standing crops before forecasted frost; wet soil holds heat better.\n" +
        "• Border Smoking: Burn dry straw or cow dung cakes on windward field borders on freezing nights to create a protective warm smoke blanket."
};

export const SOIL_DATA = {
  types: "🧱 Soil Types & Crop Suitability:\n" +
         "1. Alluvial Soil: Porous, fertile river silt rich in potash. Best for Rice, Wheat, Sugarcane, and Maize.\n" +
         "2. Black (Regur) Soil: High clay, deep moisture retention, rich in calcium/magnesium. Best for Cotton, Soybean, and Gram.\n" +
         "3. Red Soil: Porous with ferric oxide, drains freely. Best for Groundnut, Millets, Pulses, and Potatoes.\n" +
         "4. Sandy Soil: Fast-draining with low fertility. Best for Root vegetables, Watermelon, and Peanuts with heavy organic manure.\n" +
         "5. Loamy Soil: Balanced mix of sand, silt, and clay. Considered the golden soil for vegetables and cereal crops.",
  black: "🧱 Black Soil (Cotton / Regur Soil):\n" +
         "• Features: High clay content, swells when wet, develops deep cracks in dry season, retains moisture for months.\n" +
         "• Best Crops: Cotton, Soybean, Wheat, Pigeon Pea (Tur), Jowar, and Sunflower.",
  alluvial: "🧱 Alluvial Soil:\n" +
            "• Features: Highly fertile soil deposited by rivers, excellent texture, good moisture and nutrient retention.\n" +
            "• Best Crops: Rice, Wheat, Sugarcane, Maize, Pulses, Jute, and all vegetables.",
  red: "🧱 Red Soil:\n" +
       "• Features: Porous, gritty texture, rich in iron and potash but low in nitrogen and phosphorus.\n" +
       "• Best Crops: Groundnut, Ragi, Bajra, Red Gram, Potato, and Tobacco (requires irrigation).",
  sandy: "🧱 Sandy Soil:\n" +
         "• Features: Coarse grains, drains water very quickly, warms rapidly in sunny weather.\n" +
         "• Management: Add frequent farmyard manure or vermicompost to build water-holding humus.\n" +
         "• Best Crops: Watermelon, Muskmelon, Cucumber, Carrot, and Radish.",
  testing: "🧪 Soil Testing Guide for Farmers:\n" +
           "• Why Test: Knowing your soil pH and nutrient levels prevents wasting money on unneeded fertilizers.\n" +
           "• How to Sample: Dig a 'V' shaped pit of 15 cm depth in 8 to 10 spots across your field. Scrape a 1-inch slice from each.\n" +
           "• Preparation: Mix all samples in a bucket, divide into quarters, retain 500 grams, and dry in shade.\n" +
           "• Submit to: Your nearest Krishi Vigyan Kendra (KVK) or government Soil Testing Laboratory for a Soil Health Card.\n" +
           "• Ideal pH: 6.0 to 7.5 is ideal for most food crops."
};

export const FARMING_TIPS = [
  "💡 Crop Rotation Tip:\n" +
  "Never plant the same crop family continuously on the same plot. Rotate cereals (rice, wheat, maize) with " +
  "legumes (chickpea, moong, cowpea). Legumes fix natural atmospheric nitrogen, improving soil fertility for free!",

  "💡 Mulching Best Practice:\n" +
  "Cover soil around crop rows with dry straw, leaves, or plastic film. Mulching reduces moisture evaporation " +
  "by up to 35%, stops weeds from sprouting, and keeps root temperature moderate.",

  "💡 Seed Treatment Before Sowing:\n" +
  "Always treat seeds with bio-fungicide (Trichoderma viride @ 4-5 grams per kg of seed) or Rhizobium culture. " +
  "This protects against damping-off disease and ensures high seedling germination.",

  "💡 Safe Grain Storage:\n" +
  "Sun-dry harvested grains until moisture is below 10-12% before storage. Mix dried neem leaves into grain bins " +
  "to naturally prevent storage weevils and insect damage without toxic chemicals."
];

// String cleaning matching Python clean_text
export function cleanText(rawText: string): string {
  if (!rawText) return "";
  let text = rawText.toLowerCase();
  text = text.replace(/[^\w\s]/g, " ");
  text = text.replace(/\s+/g, " ").trim();
  return text;
}

// Word boundary matching matching Python has_word
export function hasWord(text: string, targetWordOrPhrase: string): boolean {
  const escaped = targetWordOrPhrase.toLowerCase().replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
  const regex = new RegExp(`\\b${escaped}\\b`, "i");
  return regex.test(text);
}

export function hasAny(text: string, wordList: string[]): string[] {
  return wordList.filter((w) => hasWord(text, w));
}

/**
 * Executes the exact rule-based decision ladder as in agroassist.py
 */
export function evaluateAgroRules(rawInput: string): RuleResponse {
  const cleaned = cleanText(rawInput);

  if (!cleaned) {
    return {
      response: "Please type a question or choose a topic like crops, fertilizers, pests, irrigation, or soil.",
      category: "empty",
      categoryLabel: "Empty",
      matchedKeywords: [],
      suggestedFollowUps: ["Fertilizer for rice", "Tomato pest control", "Drip irrigation benefits", "Black soil crops"]
    };
  }

  // 1. Greetings
  const matchedGreetings = hasAny(cleaned, GREETING_WORDS);
  if (matchedGreetings.length > 0) {
    const hasOtherIntent = ["pest", "disease", "fertilizer", "fertiliser", "water", "irrigation", "soil", "crop", "rice", "wheat", "tomato"]
      .some(w => hasWord(cleaned, w));
    if (!hasOtherIntent) {
      return {
        response: GREETING_RESPONSE,
        category: "greeting",
        categoryLabel: "Greeting",
        matchedKeywords: matchedGreetings,
        suggestedFollowUps: ["Which fertilizer is good for rice?", "How to control pests in tomato?", "What soil is best for cotton?", "Tell me about drip irrigation"]
      };
    }
  }

  // 2. About
  const matchedAbout = hasAny(cleaned, ABOUT_WORDS);
  if (matchedAbout.length > 0) {
    return {
      response: ABOUT_RESPONSE,
      category: "about",
      categoryLabel: "About AgroAssist",
      matchedKeywords: matchedAbout,
      suggestedFollowUps: ["What can you do?", "Give me a farming tip", "Which crops do you support?"]
    };
  }

  // 3. Gratitude
  const matchedThanks = hasAny(cleaned, THANKS_WORDS);
  if (matchedThanks.length > 0) {
    return {
      response: THANKS_RESPONSE,
      category: "gratitude",
      categoryLabel: "Thank You",
      matchedKeywords: matchedThanks,
      suggestedFollowUps: ["How to make organic compost?", "Rainy weather precautions", "Soil testing guide"]
    };
  }

  // 4. Exit
  const matchedExit = hasAny(cleaned, EXIT_WORDS);
  if (matchedExit.length > 0) {
    return {
      response: EXIT_RESPONSE,
      category: "exit",
      categoryLabel: "Goodbye",
      matchedKeywords: matchedExit
    };
  }

  // 5. Help
  const matchedHelp = hasAny(cleaned, HELP_WORDS);
  if (matchedHelp.length > 0) {
    return {
      response: HELP_RESPONSE,
      category: "help",
      categoryLabel: "Help & Menu",
      matchedKeywords: matchedHelp,
      suggestedFollowUps: ["Wheat guide", "Organic fertilizer", "Tomato blight", "Mulching tip"]
    };
  }

  // 6. Pest & Disease
  const pestKeywords = [
    "pest", "pests", "disease", "diseases", "insect", "insects", "worm", "worms", "bug", "bugs",
    "fungus", "fungal", "blight", "borer", "borers", "aphid", "aphids", "rot", "spray", "spraying", "leaf curl"
  ];
  const matchedPests = hasAny(cleaned, pestKeywords);
  if (matchedPests.length > 0) {
    if (hasWord(cleaned, "tomato")) {
      return {
        response: PEST_DATA.tomato,
        category: "pest_disease",
        categoryLabel: "Pest & Disease Control",
        matchedKeywords: [...matchedPests, "tomato"],
        suggestedFollowUps: ["How to make organic neem spray?", "Tomato fertilizer guide", "Early blight symptoms"]
      };
    } else if (hasWord(cleaned, "rice") || hasWord(cleaned, "paddy")) {
      return {
        response: PEST_DATA.rice,
        category: "pest_disease",
        categoryLabel: "Pest & Disease Control",
        matchedKeywords: [...matchedPests, "rice"],
        suggestedFollowUps: ["Rice stem borer traps", "Alternate wetting and drying", "Rice fertilizer"]
      };
    } else if (hasWord(cleaned, "wheat")) {
      return {
        response: PEST_DATA.wheat,
        category: "pest_disease",
        categoryLabel: "Pest & Disease Control",
        matchedKeywords: [...matchedPests, "wheat"],
        suggestedFollowUps: ["Wheat rust resistant seeds", "Wheat irrigation schedule"]
      };
    } else {
      return {
        response: PEST_DATA.general,
        category: "pest_disease",
        categoryLabel: "Integrated Pest Management",
        matchedKeywords: matchedPests,
        suggestedFollowUps: ["Tomato pests", "Rice stem borer", "Neem oil application"]
      };
    }
  }

  // 7. Fertilizer & Nutrition
  const fertilizerKeywords = [
    "fertilizer", "fertilizers", "fertiliser", "fertilisers", "manure", "manures",
    "compost", "urea", "dap", "npk", "potash", "vermicompost", "cow dung", "biofertilizer", "nutrient", "nutrients"
  ];
  const matchedFertilizers = hasAny(cleaned, fertilizerKeywords);
  if (matchedFertilizers.length > 0) {
    if (hasWord(cleaned, "rice") || hasWord(cleaned, "paddy")) {
      return {
        response: FERTILIZER_DATA.rice,
        category: "fertilizer",
        categoryLabel: "Fertilizer Guidance",
        matchedKeywords: [...matchedFertilizers, "rice"],
        suggestedFollowUps: ["Rice irrigation schedule", "Rice stem borer control", "Organic manure for rice"]
      };
    } else if (hasWord(cleaned, "wheat")) {
      return {
        response: FERTILIZER_DATA.wheat,
        category: "fertilizer",
        categoryLabel: "Fertilizer Guidance",
        matchedKeywords: [...matchedFertilizers, "wheat"],
        suggestedFollowUps: ["Wheat critical watering stages", "Wheat rust prevention"]
      };
    } else if (hasWord(cleaned, "tomato")) {
      return {
        response: FERTILIZER_DATA.tomato,
        category: "fertilizer",
        categoryLabel: "Fertilizer Guidance",
        matchedKeywords: [...matchedFertilizers, "tomato"],
        suggestedFollowUps: ["How to prevent tomato blossom end rot?", "Tomato pest control"]
      };
    } else if (hasWord(cleaned, "organic") || hasWord(cleaned, "vermicompost") || hasWord(cleaned, "manure")) {
      return {
        response: FERTILIZER_DATA.organic,
        category: "fertilizer",
        categoryLabel: "Organic Fertilizers",
        matchedKeywords: [...matchedFertilizers, "organic"],
        suggestedFollowUps: ["How to make compost?", "Biofertilizer usage", "Soil testing"]
      };
    } else if (hasWord(cleaned, "compost")) {
      return {
        response: FERTILIZER_DATA.compost,
        category: "fertilizer",
        categoryLabel: "Compost Making",
        matchedKeywords: [...matchedFertilizers, "compost"],
        suggestedFollowUps: ["Vermicompost benefits", "Organic manure application", "Mulching"]
      };
    } else {
      return {
        response: FERTILIZER_DATA.general,
        category: "fertilizer",
        categoryLabel: "Fertilizer Guidance",
        matchedKeywords: matchedFertilizers,
        suggestedFollowUps: ["Fertilizer for rice", "Fertilizer for wheat", "Organic compost"]
      };
    }
  }

  // 8. Irrigation & Watering
  const irrigationKeywords = ["irrigation", "water", "watering", "drip", "sprinkler", "flood", "furrow"];
  const matchedIrrigation = hasAny(cleaned, irrigationKeywords);
  if (matchedIrrigation.length > 0) {
    if (hasWord(cleaned, "drip")) {
      return {
        response: IRRIGATION_DATA.drip,
        category: "irrigation",
        categoryLabel: "Drip Irrigation",
        matchedKeywords: [...matchedIrrigation, "drip"],
        suggestedFollowUps: ["Tomato watering tips", "Watering in hot summer", "Mulching to save water"]
      };
    } else if (hasWord(cleaned, "rice") || hasWord(cleaned, "paddy")) {
      return {
        response: IRRIGATION_DATA.rice,
        category: "irrigation",
        categoryLabel: "Rice Irrigation",
        matchedKeywords: [...matchedIrrigation, "rice"],
        suggestedFollowUps: ["What is Alternate Wetting and Drying (AWD)?", "Rice fertilizer"]
      };
    } else if (hasWord(cleaned, "wheat")) {
      return {
        response: IRRIGATION_DATA.wheat,
        category: "irrigation",
        categoryLabel: "Wheat Irrigation",
        matchedKeywords: [...matchedIrrigation, "wheat"],
        suggestedFollowUps: ["What is Crown Root Initiation (CRI)?", "Wheat fertilizer"]
      };
    } else {
      return {
        response: IRRIGATION_DATA.general,
        category: "irrigation",
        categoryLabel: "Irrigation Guidance",
        matchedKeywords: matchedIrrigation,
        suggestedFollowUps: ["Drip irrigation benefits", "Watering during summer", "Wheat watering stages"]
      };
    }
  }

  // 9. Weather Awareness
  const weatherKeywords = [
    "weather", "rain", "rainy", "monsoon", "rainfall", "hot", "summer", "heat",
    "heatwave", "dry", "drought", "cold", "frost", "winter"
  ];
  const matchedWeather = hasAny(cleaned, weatherKeywords);
  if (matchedWeather.length > 0) {
    if (hasWord(cleaned, "rain") || hasWord(cleaned, "rainy") || hasWord(cleaned, "monsoon") || hasWord(cleaned, "rainfall")) {
      return {
        response: WEATHER_DATA.rainy,
        category: "weather",
        categoryLabel: "Monsoon & Rain Advice",
        matchedKeywords: matchedWeather,
        suggestedFollowUps: ["How to protect stored grain?", "Preventing root rot", "Fertilizer in rainy season"]
      };
    } else if (hasWord(cleaned, "hot") || hasWord(cleaned, "summer") || hasWord(cleaned, "heat") || hasWord(cleaned, "heatwave")) {
      return {
        response: WEATHER_DATA.hot,
        category: "weather",
        categoryLabel: "Summer & Heat Care",
        matchedKeywords: matchedWeather,
        suggestedFollowUps: ["Mulching to keep soil cool", "Drip irrigation", "Vegetable nursery shade nets"]
      };
    } else if (hasWord(cleaned, "dry") || hasWord(cleaned, "drought")) {
      return {
        response: WEATHER_DATA.dry,
        category: "weather",
        categoryLabel: "Drought & Dry Spell",
        matchedKeywords: matchedWeather,
        suggestedFollowUps: ["Drought tolerant crops", "Drip watering", "Mulching tips"]
      };
    } else if (hasWord(cleaned, "cold") || hasWord(cleaned, "frost") || hasWord(cleaned, "winter")) {
      return {
        response: WEATHER_DATA.cold,
        category: "weather",
        categoryLabel: "Winter & Frost Protection",
        matchedKeywords: matchedWeather,
        suggestedFollowUps: ["Wheat sowing in winter", "Border smoking for frost"]
      };
    }
  }

  // 10. Soil Information & Testing
  const soilKeywords = ["soil", "earth", "alluvial", "black soil", "red soil", "sandy soil", "loamy", "clay", "soil testing", "ph", "soil test"];
  const matchedSoil = hasAny(cleaned, soilKeywords);
  if (matchedSoil.length > 0 || hasWord(cleaned, "soil")) {
    if (hasWord(cleaned, "test") || hasWord(cleaned, "testing") || hasWord(cleaned, "ph")) {
      return {
        response: SOIL_DATA.testing,
        category: "soil",
        categoryLabel: "Soil Testing & pH",
        matchedKeywords: ["soil testing"],
        suggestedFollowUps: ["Ideal soil pH for crops", "Alluvial soil crops", "Organic manure"]
      };
    } else if (hasWord(cleaned, "black")) {
      return {
        response: SOIL_DATA.black,
        category: "soil",
        categoryLabel: "Black Soil (Regur)",
        matchedKeywords: ["black soil"],
        suggestedFollowUps: ["What soil is good for cotton?", "Soybean in black soil"]
      };
    } else if (hasWord(cleaned, "alluvial")) {
      return {
        response: SOIL_DATA.alluvial,
        category: "soil",
        categoryLabel: "Alluvial Soil",
        matchedKeywords: ["alluvial soil"],
        suggestedFollowUps: ["Rice in alluvial soil", "Wheat soil requirements"]
      };
    } else if (hasWord(cleaned, "red")) {
      return {
        response: SOIL_DATA.red,
        category: "soil",
        categoryLabel: "Red Soil",
        matchedKeywords: ["red soil"],
        suggestedFollowUps: ["Groundnut in red soil", "Millets in red soil"]
      };
    } else if (hasWord(cleaned, "sandy") || hasWord(cleaned, "sand")) {
      return {
        response: SOIL_DATA.sandy,
        category: "soil",
        categoryLabel: "Sandy Soil",
        matchedKeywords: ["sandy soil"],
        suggestedFollowUps: ["Improving sandy soil with compost", "Carrot and watermelon"]
      };
    } else if (hasWord(cleaned, "cotton")) {
      return {
        response: "🌱 Soil for Cotton:\n" +
                  "Cotton grows best in deep Black Cotton Soil (Regur Soil) with high clay content " +
                  "and great water retention. Alluvial soils with good drainage are also suitable.",
        category: "soil",
        categoryLabel: "Cotton Soil",
        matchedKeywords: ["cotton", "soil"],
        suggestedFollowUps: ["Cotton crop season", "Black soil features"]
      };
    } else {
      return {
        response: SOIL_DATA.types,
        category: "soil",
        categoryLabel: "Soil Types & Suitability",
        matchedKeywords: matchedSoil.length > 0 ? matchedSoil : ["soil"],
        suggestedFollowUps: ["How to take soil samples for testing?", "Black soil crops", "Red soil crops"]
      };
    }
  }

  // 11. Farming Tips & Best Practices
  const tipKeywords = ["tip", "tips", "advice", "rotation", "mulch", "mulching", "seed treatment", "storage"];
  const matchedTips = hasAny(cleaned, tipKeywords);
  if (matchedTips.length > 0) {
    if (hasWord(cleaned, "rotation")) {
      return {
        response: FARMING_TIPS[0],
        category: "farming_tips",
        categoryLabel: "Farming Tip: Crop Rotation",
        matchedKeywords: ["rotation"],
        suggestedFollowUps: ["Mulching best practice", "Seed treatment with Trichoderma"]
      };
    } else if (hasWord(cleaned, "mulch") || hasWord(cleaned, "mulching")) {
      return {
        response: FARMING_TIPS[1],
        category: "farming_tips",
        categoryLabel: "Farming Tip: Mulching",
        matchedKeywords: ["mulching"],
        suggestedFollowUps: ["Crop rotation benefits", "Watering in hot summer"]
      };
    } else if (hasWord(cleaned, "seed")) {
      return {
        response: FARMING_TIPS[2],
        category: "farming_tips",
        categoryLabel: "Farming Tip: Seed Treatment",
        matchedKeywords: ["seed treatment"],
        suggestedFollowUps: ["Safe grain storage", "Crop rotation tip"]
      };
    } else if (hasWord(cleaned, "storage")) {
      return {
        response: FARMING_TIPS[3],
        category: "farming_tips",
        categoryLabel: "Farming Tip: Grain Storage",
        matchedKeywords: ["storage"],
        suggestedFollowUps: ["Rainy season storage", "Seed treatment"]
      };
    } else {
      return {
        response: `🌱 Best Farming Practices & Tips:\n\n${FARMING_TIPS.join("\n\n")}`,
        category: "farming_tips",
        categoryLabel: "Farming Best Practices",
        matchedKeywords: matchedTips,
        suggestedFollowUps: ["Crop rotation", "Mulching tip", "Safe grain storage"]
      };
    }
  }

  // 12. Direct Crop Lookups
  for (const cropKey of Object.keys(CROP_DATA)) {
    if (hasWord(cleaned, cropKey)) {
      return {
        response: CROP_DATA[cropKey].text,
        category: "crop_info",
        categoryLabel: `${CROP_DATA[cropKey].title}`,
        matchedKeywords: [cropKey],
        suggestedFollowUps: [`Fertilizer for ${cropKey}`, `Pests in ${cropKey}`, `Irrigation for ${cropKey}`]
      };
    }
  }

  if (hasWord(cleaned, "paddy")) {
    return {
      response: CROP_DATA.rice.text,
      category: "crop_info",
      categoryLabel: "Rice (Paddy) Guide",
      matchedKeywords: ["paddy"],
      suggestedFollowUps: ["Fertilizer for rice", "Pests in rice", "Rice irrigation"]
    };
  }

  if (hasWord(cleaned, "corn")) {
    return {
      response: CROP_DATA.maize.text,
      category: "crop_info",
      categoryLabel: "Maize (Corn) Guide",
      matchedKeywords: ["corn"],
      suggestedFollowUps: ["Maize irrigation", "Fertilizer for maize"]
    };
  }

  // 13. Unknown Questions - Polite Fallback
  return {
    response: 
      "I'm sorry, I couldn't understand that agricultural question.\n\n" +
      "AgroAssist is a rule-based chatbot designed to help with:\n" +
      "• Crops: Rice, Wheat, Maize, Sugarcane, Tomato, Potato, Cotton\n" +
      "• Fertilizers: Compost, Vermicompost, Organic manure, NPK, Urea\n" +
      "• Pests & Diseases: Tomato pest control, Rice stem borer, Neem spray\n" +
      "• Irrigation: Drip irrigation, wheat/rice watering stages\n" +
      "• Weather: Rainy season care, Summer heat, Frost protection\n" +
      "• Soil: Alluvial, Black, Red, Sandy soils and Soil testing\n" +
      "• Tips: Crop rotation, Mulching, Seed treatment\n\n" +
      "Please try asking again, for example:\n" +
      "👉 'Which fertilizer is good for rice?'\n" +
      "👉 'How can I control pests in tomato plants?'\n" +
      "👉 'Tell me about drip irrigation'",
    category: "unknown",
    categoryLabel: "Supported Topics Guide",
    matchedKeywords: [],
    suggestedFollowUps: [
      "Which fertilizer is good for rice?",
      "How can I control pests in tomato plants?",
      "Tell me about drip irrigation",
      "What soil is good for cotton?"
    ]
  };
}
