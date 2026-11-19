# 🌾 AgroAssist – Agricultural Support Chatbot
**Developer:** Niranjan  
**Project Type:** Rule-Based Chatbot in Python (No Machine Learning / No External AI APIs)

Welcome to **AgroAssist**! This project is a beginner-friendly, rule-based chatbot engineered specifically for farmers and agricultural students. It helps farmers get basic, reliable answers on crops, fertilizers, pest control, irrigation, weather, soils, and farming best practices in simple, everyday language.

---

## 🎯 Key Features
1. **🌾 Crop Information:** Rice, Wheat, Maize, Sugarcane, Tomato, Potato, and Cotton.
2. **🧪 Fertilizer Guidance:** Organic farmyard manure, Vermicompost, Compost preparation, NPK balance, and Urea guidelines.
3. **🐛 Pest & Disease Support:** Tomato fruit borer & leaf curl, Rice stem borer, Wheat rust, organic Neem spray, and Integrated Pest Management (IPM).
4. **💧 Irrigation Guidance:** Drip irrigation, critical watering stages (CRI in wheat, tillering in rice), and water conservation.
5. **🌦️ Weather Awareness:** Practical farming advice for rainy/monsoon season, scorching summer heat, drought spells, and winter frost.
6. **🧱 Soil Information:** Alluvial, Black (Regur), Red, Sandy, and Loamy soils + step-by-step soil testing guide and pH recommendations.
7. **💡 Farming Tips:** Crop rotation with nitrogen-fixing pulses, straw mulching, seed treatment with Trichoderma, and safe grain storage.
8. **👋 Greetings & Polite Interaction:** Friendly responses to "Hello", "Namaste", "Thank you", and "Goodbye".
9. **🛡️ Unknown Questions Handler:** Polite fallback explaining supported topics with helpful examples.

---

## 🧠 How the Rule-Based Architecture Works (Step-by-Step for Beginners)

A **rule-based chatbot** does not guess or hallucinate answers like neural network models. Instead, it follows a deterministic sequence:

```
[Raw User Input] 
      │
      ▼
1. clean_text() ───> Converts to lowercase, strips punctuation, normalizes spaces
      │
      ▼
2. has_word() ─────> Uses Regex Word Boundaries (\bkeyword\b) to prevent false matches
      │              (e.g., prevents 'hi' from triggering on 'which')
      ▼
3. Rule Hierarchy ─> Evaluates prioritized conditions:
                     - Greetings / Civility / About
                     - Pest & Disease intent
                     - Fertilizer & Nutrient intent
                     - Irrigation & Water intent
                     - Weather conditions
                     - Soil types & testing
                     - Farming tips
                     - Direct crop queries
      │
      ▼
4. Knowledge Base ─> Retrieves accurate agricultural advice from Python dictionaries
      │
      ▼
5. Fallback ───────> If no rule matches, politely provides guided suggestions
```

---

## 💻 Step-by-Step Instructions to Run in VS Code

### Step 1: Install Python
1. Download Python (version 3.8 or higher) from [python.org](https://www.python.org/downloads/).
2. **Crucial on Windows:** Check the box that says **"Add Python to PATH"** before clicking Install.
3. Verify in your terminal/command prompt:
   ```bash
   python --version
   ```

### Step 2: Install Visual Studio Code
1. Download VS Code from [code.visualstudio.com](https://code.visualstudio.com/).
2. Open VS Code, go to the Extensions tab (`Ctrl+Shift+X` or `Cmd+Shift+X`), search for **Python** (by Microsoft), and click **Install**.

### Step 3: Open the Project Folder
1. In VS Code, click **File > Open Folder...** and select the folder containing `agroassist.py`.
2. Open `agroassist.py` in the editor.

### Step 4: Open the VS Code Integrated Terminal
1. Press ``Ctrl + ` `` (Backtick) or go to top menu **Terminal > New Terminal**.
2. Run the chatbot with:
   ```bash
   python agroassist.py
   ```
   *(On macOS / Linux, use `python3 agroassist.py`)*

### Step 5: Test the Chatbot!
Try these sample questions in the terminal:
- `Hello`
- `Which fertilizer is good for rice?`
- `How can I control pests in tomato plants?`
- `What soil is good for cotton?`
- `Tell me about drip irrigation`
- `What should I do in rainy weather?`
- `Give me a tip on crop rotation`
- `Thank you`
- `bye`

---

## 🧪 Running the Automated Unit Tests
To test all rules automatically:
```bash
python -m unittest test_agroassist.py
```

---

## 👨‍💻 Project Details
- **Developer:** Niranjan
- **Language:** Python 3 (Standard Library: `re`, `sys`, `time`)
- **License:** Open Source for farmers and educators 🌱
