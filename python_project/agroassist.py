"""
================================================================================
🌾 AgroAssist – Agricultural Support Chatbot
Developer: Niranjan
Chatbot Type: Rule-Based Chatbot (No ML, No Deep Learning, No External APIs)
================================================================================

This program is a complete, beginner-friendly rule-based agricultural chatbot.
It uses:
1. Python dictionaries to store predefined agricultural knowledge.
2. String cleaning and regex word boundaries for accurate keyword detection.
3. If-elif-else priority logic to match farmer queries to the best answer.
4. Polite fallback handling for unknown queries with guided suggestions.
"""

import re
import sys
import time

# ==============================================================================
# 1. PREDEFINED KNOWLEDGE BASE (Dictionaries & Lists)
# ==============================================================================

# Greeting triggers and response
GREETING_WORDS = ["hello", "hi", "hey", "good morning", "good afternoon", "good evening", "namaste", "vanakkam", "greetings"]
GREETING_RESPONSE = (
    "Hello! Welcome to AgroAssist. How can I help you with agriculture today?\n"
    "You can ask me about crops, fertilizers, pest control, irrigation, weather, soil, or farming tips!"
)

# Identity & Developer queries
ABOUT_WORDS = ["who are you", "what are you", "developer", "creator", "niranjan", "about you", "what is agroassist"]
ABOUT_RESPONSE = (
    "I am AgroAssist, a beginner-friendly rule-based agricultural support chatbot "
    "developed by Niranjan. I am built using pure Python rules to help farmers get "
    "instant, simple, and practical farming advice without needing complex AI."
)

# Gratitude & Closing
THANKS_WORDS = ["thank you", "thanks", "thank u", "dhanyawad", "shukriya", "grateful"]
THANKS_RESPONSE = "You're welcome! Happy farming and wish you a bountiful harvest! 🌱"

EXIT_WORDS = ["bye", "goodbye", "exit", "quit", "see you", "close", "stop"]
EXIT_RESPONSE = "Goodbye! Take care of your crops. AgroAssist is always here whenever you need farming guidance! 🙏"

# Help and Supported Topics
HELP_WORDS = ["help", "topics", "menu", "options", "what can you do", "features", "categories"]
HELP_RESPONSE = (
    "🌾 AgroAssist Supported Topics:\n"
    "--------------------------------------------------\n"
    "1. Crops: Rice, Wheat, Maize, Sugarcane, Tomato, Potato, Cotton\n"
    "2. Fertilizers: Organic compost, Vermicompost, NPK, Urea, Biofertilizers\n"
    "3. Pests & Diseases: Tomato leaf curl/blight, Rice stem borer, Neem spray, IPM\n"
    "4. Irrigation: Drip watering, critical stages, saving water\n"
    "5. Weather: Rainy season care, Summer heat protection, Frost prevention\n"
    "6. Soil: Alluvial, Black, Red, Sandy, Loamy soils & Soil testing\n"
    "7. Tips: Crop rotation, Mulching, Seed treatment, Storage\n"
    "--------------------------------------------------\n"
    "💡 Tip: Type questions in simple words, e.g., 'fertilizer for rice' or 'tomato pests'."
)

# Crop information database
CROP_DATA = {
    "rice": (
        "🌾 Rice (Paddy) Guide:\n"
        "• Season: Kharif (sown in June-July) & Rabi in south/east regions.\n"
        "• Soil: Clayey loam and alluvial soils with high water retention.\n"
        "• Temperature: 22°C to 32°C with abundant water supply.\n"
        "• Key Practice: Maintain shallow standing water (2-5 cm) during early tillering. "
        "Drain water 10-14 days before harvesting for uniform grain ripening."
    ),
    "wheat": (
        "🌾 Wheat Guide:\n"
        "• Season: Rabi (winter) crop sown from late October to November.\n"
        "• Soil: Well-drained fertile loams and clay loams.\n"
        "• Temperature: Cool growing season (15°C - 20°C) and warm ripening.\n"
        "• Key Practice: The first irrigation at Crown Root Initiation (CRI) stage (20-25 days after sowing) "
        "is critical to establish a strong root system."
    ),
    "maize": (
        "🌽 Maize (Corn) Guide:\n"
        "• Season: Sown in Kharif, Rabi, and Spring seasons.\n"
        "• Soil: Fertile, well-drained sandy loam to silty loam. Avoid waterlogged fields.\n"
        "• Temperature: Warm climate (21°C - 27°C).\n"
        "• Key Practice: Extremely sensitive to moisture stress during flowering (tasseling & silking)."
    ),
    "sugarcane": (
        "🎋 Sugarcane Guide:\n"
        "• Season: Long duration crop (10 to 18 months); planted in spring or autumn.\n"
        "• Soil: Deep, well-drained fertile loamy soil rich in organic matter.\n"
        "• Water: High water requirement (1500 to 2500 mm total).\n"
        "• Key Practice: Earth up soil around rows in the 3rd and 4th months to prevent lodging during high winds."
    ),
    "tomato": (
        "🍅 Tomato Guide:\n"
        "• Season: Grown in winter (transplanted Oct-Nov) or spring-summer.\n"
        "• Soil: Well-drained sandy loam rich in organic matter; pH 6.0 - 7.0.\n"
        "• Temperature: 18°C to 28°C; highly sensitive to heavy frost and prolonged waterlogging.\n"
        "• Key Practice: Stake plants with wooden poles or trellis to elevate foliage and keep fruits clean."
    ),
    "potato": (
        "🥔 Potato Guide:\n"
        "• Season: Cool-season crop sown in October-November in plains.\n"
        "• Soil: Well-aerated, loose sandy loam rich in organic matter.\n"
        "• Key Practice: Earth up ridges when plants reach 15-20 cm to protect growing tubers from turning green."
    ),
    "cotton": (
        "🌱 Cotton Guide:\n"
        "• Season: Kharif crop sown in April-May (irrigated) or June-July (rainfed).\n"
        "• Soil: Deep black cotton soil (regur) with excellent moisture retention capacity.\n"
        "• Climate: Needs warm, sunny weather and a minimum of 180 frost-free days."
    ),
}

# Fertilizer information database
FERTILIZER_DATA = {
    "rice": (
        "🌾 Rice Fertilizer Guidance:\n"
        "• Organic: Incorporate 5-8 tons of farmyard manure (FYM) or green manure before puddling.\n"
        "• Chemical: Follow balanced NPK (usually 100:50:50 kg/ha based on local soil test).\n"
        "• Method: Apply full Phosphorus and Potash as basal dose. Apply Nitrogen (Urea) in 3 splits:\n"
        "  1) 1/3rd at basal transplanting, 2) 1/3rd at tillering, 3) 1/3rd at panicle initiation.\n"
        "• Note: Fertilizer requirements depend on soil conditions and crop growth stage. "
        "For specific fertilizer quantities, follow a soil-test-based recommendation from an agricultural expert."
    ),
    "wheat": (
        "🌾 Wheat Fertilizer Guidance:\n"
        "• Balanced NPK: Recommended dose is typically 120 kg N, 60 kg P2O5, and 40 kg K2O per hectare.\n"
        "• Application: Full P and K plus half Nitrogen applied at sowing time.\n"
        "• Top-Dressing: Top-dress remaining Nitrogen in two equal splits after the 1st and 2nd irrigations."
    ),
    "tomato": (
        "🍅 Tomato Fertilizer Guidance:\n"
        "• Organic: Apply 10-15 tons of compost or vermicompost per acre during field preparation.\n"
        "• Calcium: Ensure adequate calcium in soil to prevent Blossom End Rot (black rot at fruit base).\n"
        "• Balanced NPK: Apply moderate nitrogen early, and boost potassium during flowering and fruit setting."
    ),
    "organic": (
        "🌿 Organic Fertilizer & Compost Guidance:\n"
        "• Farmyard Manure (FYM): Decomposed cow dung rich in humus; apply 2-3 weeks before sowing.\n"
        "• Vermicompost: Earthworm castings rich in plant enzymes, beneficial microbes, and trace minerals.\n"
        "• Neem Cake: Natural fertilizer that enriches nitrogen while deterring soil nematodes and termites.\n"
        "• Biofertilizers: Treat seeds with Rhizobium (legumes) or Azotobacter / PSB (cereals and vegetables)."
    ),
    "compost": (
        "🍂 How to Make & Use Compost:\n"
        "• Mix 3 parts brown waste (dry leaves, straw) with 1 part green waste (cow dung slurry, vegetable scraps).\n"
        "• Keep moist like a damp sponge and turn the heap every 2 weeks for airflow.\n"
        "• In 60-90 days, you will get dark, crumbly, sweet-smelling organic compost.\n"
        "• Organic compost can improve soil health, retain moisture, and support beneficial soil microbes."
    ),
    "general": (
        "🧪 Fertilizer Guidance:\n"
        "• Fertilizer requirements depend on soil conditions and crop growth stage.\n"
        "• Organic compost can improve soil health and water retention.\n"
        "• Chemical fertilizers (Urea for Nitrogen, DAP for Phosphorus, MOP for Potassium) must be balanced.\n"
        "• For specific fertilizer quantities, follow a soil-test-based recommendation from an agricultural expert."
    ),
}

# Pest & Disease information database
PEST_DATA = {
    "tomato": (
        "🍅 Tomato Pest & Disease Management:\n"
        "• First identify the pest affecting your tomato plants. Inspect the leaves and fruits regularly.\n"
        "• Common Pests: Fruit borer caterpillar, whiteflies, leafminers, and aphids.\n"
        "• Common Diseases: Early/Late Blight (brown-black leaf spots), Leaf Curl Virus (spread by whiteflies).\n"
        "• Safe Action Steps:\n"
        "  1. Install yellow sticky cards (8-10 per acre) to trap whiteflies and aphids.\n"
        "  2. Spray organic Neem Oil (3-5 ml per liter of water + 1 ml liquid soap) at early pest sighting.\n"
        "  3. Remove and safely destroy virus-infected plants immediately to prevent spreading.\n"
        "• Use appropriate integrated pest management methods and consult a local agricultural officer before applying chemical pesticides."
    ),
    "rice": (
        "🌾 Rice (Paddy) Pest & Disease Management:\n"
        "• Yellow Stem Borer: Causes 'dead hearts' in tillers and 'whiteheads' in panicles. "
        "Install 4-5 pheromone traps per acre to monitor and capture male moths.\n"
        "• Rice Blast Disease: Spindle-shaped spots on leaves. Avoid excessive urea application; maintain proper water level.\n"
        "• Brown Planthopper (BPH): Practice Alternate Wetting and Drying (AWD) rather than continuous stagnation."
    ),
    "wheat": (
        "🌾 Wheat Pest & Disease Management:\n"
        "• Yellow & Brown Rust: Yellow or orange powdery pustules on leaves. Plant resistant certified seed varieties.\n"
        "• Aphids: Small green sucking bugs that cluster during cloudy winter weather. Spray neem extract if population is low."
    ),
    "general": (
        "🐛 Integrated Pest Management (IPM) & Safe Steps:\n"
        "• Inspect the leaves, stems, and fruits regularly twice a week.\n"
        "• Prevention First: Use certified disease-free seeds, practice crop rotation, and avoid dense planting.\n"
        "• Bio-control: Spray Neem Seed Kernel Extract (NSKE 5%) or Neem Oil (5ml/liter water).\n"
        "• Beneficial Insects: Protect spiders, ladybird beetles, and dragonflies that naturally eat harmful pests.\n"
        "• Always consult your local agricultural extension officer (KVK) before applying chemical pesticides."
    ),
}

# Irrigation information database
IRRIGATION_DATA = {
    "drip": (
        "💧 Drip Irrigation System:\n"
        "• Delivers precise water and soluble fertilizers directly to the crop root zone.\n"
        "• Water Savings: Saves 40% to 70% water compared to flood irrigation.\n"
        "• Weed Reduction: Inter-row soil stays dry, dramatically decreasing weed pressure.\n"
        "• Best suited for vegetables (tomato, chili, capsicum), fruit orchards, sugarcane, and cotton."
    ),
    "rice": (
        "💧 Rice Watering Guidance:\n"
        "• Early Stage: Keep shallow standing water (2 to 5 cm) during transplanting and tillering.\n"
        "• Mid Season: Practice Alternate Wetting and Drying (AWD) to save up to 30% water without lowering yield.\n"
        "• Pre-harvest: Completely drain the field 10 to 14 days before harvest so grain dries evenly."
    ),
    "wheat": (
        "💧 Wheat Watering Guidance:\n"
        "• Wheat requires 4 to 6 irrigations during its lifecycle.\n"
        "• Most Critical Stage: Crown Root Initiation (CRI) at 20-25 days after sowing. Never let the crop face moisture stress now.\n"
        "• Other Critical Stages: Active tillering (40-45 days), Late jointing (60-65 days), Flowering (80-85 days), and Grain filling (100-105 days)."
    ),
    "general": (
        "💧 Irrigation Best Practices:\n"
        "• Timing: Irrigate during early morning or evening hours to minimize evaporation losses.\n"
        "• Mulching: Cover soil with crop residues or straw to retain moisture longer.\n"
        "• Soil Check: Dig 2-3 inches into the soil; if soil forms a ball in your hand, moisture is adequate."
    ),
}

# Weather awareness database
WEATHER_DATA = {
    "rainy": (
        "🌧️ Farming Advice for Rainy & Monsoon Conditions:\n"
        "• Field Drainage: Clear field channels to ensure excess water drains out promptly; waterlogging causes root rot.\n"
        "• Fertilizer & Sprays: Postpone fertilizer application and pesticide spraying when heavy rainfall is forecasted.\n"
        "• Disease Vigilance: High humidity favors fungal spores. Scout for leaf spots and blight.\n"
        "• Grain Protection: Keep harvested produce and seed bags off the ground on dry pallets covered with waterproof tarpaulins."
    ),
    "hot": (
        "☀️ Farming Advice for Hot Summer & Heatwaves:\n"
        "• Watering: Irrigate strictly in early morning or after sunset; mid-day watering heats the soil and shocks root systems.\n"
        "• Mulching: Spread a 3-inch layer of straw or dry grass around crop stems to preserve moisture and cool soil.\n"
        "• Nursery Care: Use agro-shade nets (50% shade) over delicate vegetable seedlings.\n"
        "• Livestock: Keep farm animals in well-ventilated, shaded sheds with clean, cool drinking water."
    ),
    "dry": (
        "🏜️ Farming Advice for Dry & Drought Conditions:\n"
        "• Crop Choice: Choose drought-resistant, short-duration crops like millets (Ragi, Bajra) and pulses.\n"
        "• Water Conservation: Adopt drip or sprinkler irrigation and avoid open furrow flooding.\n"
        "• Tillage: Minimize deep plowing to prevent exposing moist subsoil to dry winds."
    ),
    "cold": (
        "❄️ Farming Advice for Cold & Frost Conditions:\n"
        "• Light Evening Irrigation: Give a light watering to standing crops before forecasted frost; wet soil holds heat better.\n"
        "• Border Smoking: Burn dry straw or cow dung cakes on windward field borders on freezing nights to create a protective warm smoke blanket."
    ),
}

# Soil types and testing database
SOIL_DATA = {
    "types": (
        "🧱 Soil Types & Crop Suitability:\n"
        "1. Alluvial Soil: Porous, fertile river silt rich in potash. Best for Rice, Wheat, Sugarcane, and Maize.\n"
        "2. Black (Regur) Soil: High clay, deep moisture retention, rich in calcium/magnesium. Best for Cotton, Soybean, and Gram.\n"
        "3. Red Soil: Porous with ferric oxide, drains freely. Best for Groundnut, Millets, Pulses, and Potatoes.\n"
        "4. Sandy Soil: Fast-draining with low fertility. Best for Root vegetables, Watermelon, and Peanuts with heavy organic manure.\n"
        "5. Loamy Soil: Balanced mix of sand, silt, and clay. Considered the golden soil for vegetables and cereal crops."
    ),
    "black": (
        "🧱 Black Soil (Cotton / Regur Soil):\n"
        "• Features: High clay content, swells when wet, develops deep cracks in dry season, retains moisture for months.\n"
        "• Best Crops: Cotton, Soybean, Wheat, Pigeon Pea (Tur), Jowar, and Sunflower."
    ),
    "alluvial": (
        "🧱 Alluvial Soil:\n"
        "• Features: Highly fertile soil deposited by rivers, excellent texture, good moisture and nutrient retention.\n"
        "• Best Crops: Rice, Wheat, Sugarcane, Maize, Pulses, Jute, and all vegetables."
    ),
    "red": (
        "🧱 Red Soil:\n"
        "• Features: Porous, gritty texture, rich in iron and potash but low in nitrogen and phosphorus.\n"
        "• Best Crops: Groundnut, Ragi, Bajra, Red Gram, Potato, and Tobacco (requires irrigation)."
    ),
    "sandy": (
        "🧱 Sandy Soil:\n"
        "• Features: Coarse grains, drains water very quickly, warms rapidly in sunny weather.\n"
        "• Management: Add frequent farmyard manure or vermicompost to build water-holding humus.\n"
        "• Best Crops: Watermelon, Muskmelon, Cucumber, Carrot, and Radish."
    ),
    "testing": (
        "🧪 Soil Testing Guide for Farmers:\n"
        "• Why Test: Knowing your soil pH and nutrient levels prevents wasting money on unneeded fertilizers.\n"
        "• How to Sample: Dig a 'V' shaped pit of 15 cm depth in 8 to 10 spots across your field. Scrape a 1-inch slice from each.\n"
        "• Preparation: Mix all samples in a bucket, divide into quarters, retain 500 grams, and dry in shade.\n"
        "• Submit to: Your nearest Krishi Vigyan Kendra (KVK) or government Soil Testing Laboratory for a Soil Health Card.\n"
        "• Ideal pH: 6.0 to 7.5 is ideal for most food crops."
    ),
}

# Farming tips database
FARMING_TIPS = [
    (
        "💡 Crop Rotation Tip:\n"
        "Never plant the same crop family continuously on the same plot. Rotate cereals (rice, wheat, maize) with "
        "legumes (chickpea, moong, cowpea). Legumes fix natural atmospheric nitrogen, improving soil fertility for free!"
    ),
    (
        "💡 Mulching Best Practice:\n"
        "Cover soil around crop rows with dry straw, leaves, or plastic film. Mulching reduces moisture evaporation "
        "by up to 35%, stops weeds from sprouting, and keeps root temperature moderate."
    ),
    (
        "💡 Seed Treatment Before Sowing:\n"
        "Always treat seeds with bio-fungicide (Trichoderma viride @ 4-5 grams per kg of seed) or Rhizobium culture. "
        "This protects against damping-off disease and ensures high seedling germination."
    ),
    (
        "💡 Safe Grain Storage:\n"
        "Sun-dry harvested grains until moisture is below 10-12% before storage. Mix dried neem leaves into grain bins "
        "to naturally prevent storage weevils and insect damage without toxic chemicals."
    ),
]


# ==============================================================================
# 2. STRING PROCESSING & ACCURATE WORD MATCHING
# ==============================================================================

def clean_text(raw_text: str) -> str:
    """
    Cleans raw text by converting to lowercase and stripping excess punctuation.
    """
    if not raw_text:
        return ""
    text = raw_text.lower()
    # Replace non-alphanumeric characters with spaces
    text = re.sub(r"[^\w\s]", " ", text)
    # Collapse multiple spaces into single space
    text = re.sub(r"\s+", " ", text).strip()
    return text


def has_word(text: str, target_word_or_phrase: str) -> bool:
    """
    Checks if a target word or phrase exists in text with exact word boundaries.
    Prevents false positive substring matches:
    - Avoids matching 'hi' in 'which'
    - Avoids matching 'rice' in 'price'
    - Avoids matching 'rot' in 'rotation'
    """
    pattern = r"\b" + re.escape(target_word_or_phrase.lower()) + r"\b"
    return bool(re.search(pattern, text))


def has_any(text: str, word_list: list) -> list:
    """
    Returns all words from word_list that match as full words in the text.
    """
    return [w for w in word_list if has_word(text, w)]


# ==============================================================================
# 3. RULE-BASED DECISION LOGIC (If - Elif - Else)
# ==============================================================================

def get_agro_response(raw_input: str) -> dict:
    """
    Core rule-based engine:
    Evaluates farmer query against predefined keywords, context rules, and priorities.
    Returns:
    - response (str): Clear, farmer-friendly answer
    - category (str): Domain topic name
    - matched_keywords (list): Keywords triggered for debugging and learning
    """
    cleaned = clean_text(raw_input)

    # Empty query check
    if not cleaned:
        return {
            "response": "Please type a question or choose a topic like crops, fertilizers, pests, irrigation, or soil.",
            "category": "empty",
            "matched_keywords": [],
        }

    # RULE 1: Greetings & Civility
    matched_greetings = has_any(cleaned, GREETING_WORDS)
    if matched_greetings:
        # If the query only has greeting or greeting with short hello/hi
        # We don't want 'Hello, how to control pests' to only give hello!
        # Check if query contains other agricultural topics
        has_other_intent = any(
            has_word(cleaned, w)
            for w in ["pest", "disease", "fertilizer", "fertiliser", "water", "irrigation", "soil", "crop", "rice", "wheat", "tomato"]
        )
        if not has_other_intent:
            return {
                "response": GREETING_RESPONSE,
                "category": "greeting",
                "matched_keywords": matched_greetings,
            }

    # RULE 2: About Bot & Developer Niranjan
    matched_about = has_any(cleaned, ABOUT_WORDS)
    if matched_about:
        return {
            "response": ABOUT_RESPONSE,
            "category": "about",
            "matched_keywords": matched_about,
        }

    # RULE 3: Gratitude
    matched_thanks = has_any(cleaned, THANKS_WORDS)
    if matched_thanks:
        return {
            "response": THANKS_RESPONSE,
            "category": "gratitude",
            "matched_keywords": matched_thanks,
        }

    # RULE 4: Exit & Goodbye
    matched_exit = has_any(cleaned, EXIT_WORDS)
    if matched_exit:
        return {
            "response": EXIT_RESPONSE,
            "category": "exit",
            "matched_keywords": matched_exit,
        }

    # RULE 5: Help & Supported Menu
    matched_help = has_any(cleaned, HELP_WORDS)
    if matched_help:
        return {
            "response": HELP_RESPONSE,
            "category": "help",
            "matched_keywords": matched_help,
        }

    # RULE 6: Pest & Disease Guidance
    # Check for pest and disease intent
    pest_keywords = ["pest", "pests", "disease", "diseases", "insect", "insects", "worm", "worms", "bug", "bugs",
                     "fungus", "fungal", "blight", "borer", "borers", "aphid", "aphids", "rot", "spray", "spraying", "leaf curl"]
    matched_pests = has_any(cleaned, pest_keywords)
    if matched_pests:
        if has_word(cleaned, "tomato"):
            return {
                "response": PEST_DATA["tomato"],
                "category": "pest_disease",
                "matched_keywords": matched_pests + ["tomato"],
            }
        elif has_word(cleaned, "rice") or has_word(cleaned, "paddy"):
            return {
                "response": PEST_DATA["rice"],
                "category": "pest_disease",
                "matched_keywords": matched_pests + ["rice"],
            }
        elif has_word(cleaned, "wheat"):
            return {
                "response": PEST_DATA["wheat"],
                "category": "pest_disease",
                "matched_keywords": matched_pests + ["wheat"],
            }
        else:
            return {
                "response": PEST_DATA["general"],
                "category": "pest_disease",
                "matched_keywords": matched_pests,
            }

    # RULE 7: Fertilizer & Nutrition Guidance
    fertilizer_keywords = ["fertilizer", "fertilizers", "fertiliser", "fertilisers", "manure", "manures",
                           "compost", "urea", "dap", "npk", "potash", "vermicompost", "cow dung", "biofertilizer", "nutrient", "nutrients"]
    matched_fertilizers = has_any(cleaned, fertilizer_keywords)
    if matched_fertilizers:
        if has_word(cleaned, "rice") or has_word(cleaned, "paddy"):
            return {
                "response": FERTILIZER_DATA["rice"],
                "category": "fertilizer",
                "matched_keywords": matched_fertilizers + ["rice"],
            }
        elif has_word(cleaned, "wheat"):
            return {
                "response": FERTILIZER_DATA["wheat"],
                "category": "fertilizer",
                "matched_keywords": matched_fertilizers + ["wheat"],
            }
        elif has_word(cleaned, "tomato"):
            return {
                "response": FERTILIZER_DATA["tomato"],
                "category": "fertilizer",
                "matched_keywords": matched_fertilizers + ["tomato"],
            }
        elif has_word(cleaned, "organic") or has_word(cleaned, "vermicompost") or has_word(cleaned, "manure"):
            return {
                "response": FERTILIZER_DATA["organic"],
                "category": "fertilizer",
                "matched_keywords": matched_fertilizers + ["organic"],
            }
        elif has_word(cleaned, "compost"):
            return {
                "response": FERTILIZER_DATA["compost"],
                "category": "fertilizer",
                "matched_keywords": matched_fertilizers + ["compost"],
            }
        else:
            return {
                "response": FERTILIZER_DATA["general"],
                "category": "fertilizer",
                "matched_keywords": matched_fertilizers,
            }

    # RULE 8: Irrigation & Watering Guidance
    irrigation_keywords = ["irrigation", "water", "watering", "drip", "sprinkler", "flood", "furrow"]
    matched_irrigation = has_any(cleaned, irrigation_keywords)
    if matched_irrigation:
        if has_word(cleaned, "drip"):
            return {
                "response": IRRIGATION_DATA["drip"],
                "category": "irrigation",
                "matched_keywords": matched_irrigation + ["drip"],
            }
        elif has_word(cleaned, "rice") or has_word(cleaned, "paddy"):
            return {
                "response": IRRIGATION_DATA["rice"],
                "category": "irrigation",
                "matched_keywords": matched_irrigation + ["rice"],
            }
        elif has_word(cleaned, "wheat"):
            return {
                "response": IRRIGATION_DATA["wheat"],
                "category": "irrigation",
                "matched_keywords": matched_irrigation + ["wheat"],
            }
        else:
            return {
                "response": IRRIGATION_DATA["general"],
                "category": "irrigation",
                "matched_keywords": matched_irrigation,
            }

    # RULE 9: Weather Awareness
    weather_keywords = ["weather", "rain", "rainy", "monsoon", "rainfall", "hot", "summer", "heat",
                        "heatwave", "dry", "drought", "cold", "frost", "winter"]
    matched_weather = has_any(cleaned, weather_keywords)
    if matched_weather:
        if has_word(cleaned, "rain") or has_word(cleaned, "rainy") or has_word(cleaned, "monsoon") or has_word(cleaned, "rainfall"):
            return {
                "response": WEATHER_DATA["rainy"],
                "category": "weather",
                "matched_keywords": matched_weather,
            }
        elif has_word(cleaned, "hot") or has_word(cleaned, "summer") or has_word(cleaned, "heat") or has_word(cleaned, "heatwave"):
            return {
                "response": WEATHER_DATA["hot"],
                "category": "weather",
                "matched_keywords": matched_weather,
            }
        elif has_word(cleaned, "dry") or has_word(cleaned, "drought"):
            return {
                "response": WEATHER_DATA["dry"],
                "category": "weather",
                "matched_keywords": matched_weather,
            }
        elif has_word(cleaned, "cold") or has_word(cleaned, "frost") or has_word(cleaned, "winter"):
            return {
                "response": WEATHER_DATA["cold"],
                "category": "weather",
                "matched_keywords": matched_weather,
            }

    # RULE 10: Soil Information & Testing
    soil_keywords = ["soil", "earth", "alluvial", "black soil", "red soil", "sandy soil", "loamy", "clay", "soil testing", "ph", "soil test"]
    matched_soil = has_any(cleaned, soil_keywords)
    # Also check single words like 'soil' or 'ph'
    if matched_soil or has_word(cleaned, "soil"):
        if has_word(cleaned, "test") or has_word(cleaned, "testing") or has_word(cleaned, "ph"):
            return {
                "response": SOIL_DATA["testing"],
                "category": "soil",
                "matched_keywords": ["soil testing"],
            }
        elif has_word(cleaned, "black"):
            return {
                "response": SOIL_DATA["black"],
                "category": "soil",
                "matched_keywords": ["black soil"],
            }
        elif has_word(cleaned, "alluvial"):
            return {
                "response": SOIL_DATA["alluvial"],
                "category": "soil",
                "matched_keywords": ["alluvial soil"],
            }
        elif has_word(cleaned, "red"):
            return {
                "response": SOIL_DATA["red"],
                "category": "soil",
                "matched_keywords": ["red soil"],
            }
        elif has_word(cleaned, "sandy") or has_word(cleaned, "sand"):
            return {
                "response": SOIL_DATA["sandy"],
                "category": "soil",
                "matched_keywords": ["sandy soil"],
            }
        elif has_word(cleaned, "cotton"):
            return {
                "response": (
                    "🌱 Soil for Cotton:\n"
                    "Cotton grows best in deep Black Cotton Soil (Regur Soil) with high clay content "
                    "and great water retention. Alluvial soils with good drainage are also suitable."
                ),
                "category": "soil",
                "matched_keywords": ["cotton", "soil"],
            }
        else:
            return {
                "response": SOIL_DATA["types"],
                "category": "soil",
                "matched_keywords": matched_soil or ["soil"],
            }

    # RULE 11: Farming Tips & Best Practices
    tip_keywords = ["tip", "tips", "advice", "rotation", "mulch", "mulching", "seed treatment", "storage"]
    matched_tips = has_any(cleaned, tip_keywords)
    if matched_tips:
        if has_word(cleaned, "rotation"):
            return {
                "response": FARMING_TIPS[0],
                "category": "farming_tips",
                "matched_keywords": ["rotation"],
            }
        elif has_word(cleaned, "mulch") or has_word(cleaned, "mulching"):
            return {
                "response": FARMING_TIPS[1],
                "category": "farming_tips",
                "matched_keywords": ["mulching"],
            }
        elif has_word(cleaned, "seed"):
            return {
                "response": FARMING_TIPS[2],
                "category": "farming_tips",
                "matched_keywords": ["seed treatment"],
            }
        elif has_word(cleaned, "storage"):
            return {
                "response": FARMING_TIPS[3],
                "category": "farming_tips",
                "matched_keywords": ["storage"],
            }
        else:
            all_tips = "\n\n".join(FARMING_TIPS)
            return {
                "response": f"🌱 Best Farming Practices & Tips:\n\n{all_tips}",
                "category": "farming_tips",
                "matched_keywords": matched_tips,
            }

    # RULE 12: Crop Information (Direct crop lookup)
    for crop in CROP_DATA.keys():
        if has_word(cleaned, crop):
            return {
                "response": CROP_DATA[crop],
                "category": "crop_info",
                "matched_keywords": [crop],
            }

    # Alternate crop synonyms
    if has_word(cleaned, "paddy"):
        return {
            "response": CROP_DATA["rice"],
            "category": "crop_info",
            "matched_keywords": ["paddy"],
        }
    if has_word(cleaned, "corn"):
        return {
            "response": CROP_DATA["maize"],
            "category": "crop_info",
            "matched_keywords": ["corn"],
        }

    # RULE 13: Unknown Questions (Polite Fallback Handler)
    return {
        "response": (
            "I'm sorry, I couldn't understand that agricultural question.\n\n"
            "AgroAssist is a rule-based chatbot designed to help with:\n"
            "• Crops: Rice, Wheat, Maize, Sugarcane, Tomato, Potato, Cotton\n"
            "• Fertilizers: Compost, Vermicompost, Organic manure, NPK, Urea\n"
            "• Pests & Diseases: Tomato pest control, Rice stem borer, Neem spray\n"
            "• Irrigation: Drip irrigation, wheat/rice watering stages\n"
            "• Weather: Rainy season care, Summer heat, Frost protection\n"
            "• Soil: Alluvial, Black, Red, Sandy soils and Soil testing\n"
            "• Tips: Crop rotation, Mulching, Seed treatment\n\n"
            "Please try asking again, for example:\n"
            "👉 'Which fertilizer is good for rice?'\n"
            "👉 'How can I control pests in tomato plants?'\n"
            "👉 'Tell me about drip irrigation'"
        ),
        "category": "unknown",
        "matched_keywords": [],
    }


# ==============================================================================
# 4. INTERACTIVE CLI RUNNER
# ==============================================================================

def run_chatbot():
    """
    Console loop for farmers and students to run AgroAssist in VS Code or Terminal.
    """
    header = "=" * 65 + "\n"
    header += "  🌾  AgroAssist – Agricultural Support Chatbot  🌾\n"
    header += "  Developer: Niranjan | Rule-Based Chatbot for Farmers\n"
    header += "=" * 65 + "\n"
    header += "Welcome to AgroAssist! Ask your farming question below.\n"
    header += "Type 'help' to see all topics, or 'exit' / 'bye' to quit.\n"
    header += "-" * 65

    print(header)

    while True:
        try:
            user_input = input("\nFarmer: ").strip()
            if not user_input:
                continue

            result = get_agro_response(user_input)

            # Natural brief pause for conversational feel
            time.sleep(0.15)
            print(f"\nAgroAssist [{result['category']}]:\n{result['response']}\n")

            if result["category"] == "exit":
                break

        except (KeyboardInterrupt, EOFError):
            print("\n\nAgroAssist: Goodbye! Wishing you good crops and happy farming! 🌱")
            break


if __name__ == "__main__":
    run_chatbot()
