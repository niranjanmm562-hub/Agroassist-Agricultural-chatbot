import { PYTHON_CODE_RAW } from './pythonCodeString';

export interface ProjectFile {
  name: string;
  description: string;
  content: string;
  mimeType: string;
}

export const TEST_AGROASSIST_RAW = `"""
Unit Tests for AgroAssist Rule-Based Chatbot
Developer: Niranjan
Run with: python -m unittest test_agroassist.py
"""

import unittest
from agroassist import clean_text, has_word, get_agro_response

class TestAgroAssist(unittest.TestCase):

    def test_clean_text(self):
        self.assertEqual(clean_text("Hello, World!"), "hello world")
        self.assertEqual(clean_text("  Rice & Wheat??? "), "rice wheat")
        self.assertEqual(clean_text(""), "")

    def test_has_word_boundaries(self):
        # Prevent false substring matches
        self.assertFalse(has_word("which fertilizer", "hi"))
        self.assertTrue(has_word("hi there", "hi"))
        self.assertFalse(has_word("what is the price of bitcoin", "rice"))
        self.assertTrue(has_word("tell me about rice crop", "rice"))
        self.assertFalse(has_word("give me a tip on crop rotation", "rot"))

    def test_greeting(self):
        res = get_agro_response("Hello")
        self.assertEqual(res["category"], "greeting")
        self.assertIn("Hello! Welcome to AgroAssist", res["response"])

    def test_fertilizer_rice(self):
        res = get_agro_response("Which fertilizer is good for rice?")
        self.assertEqual(res["category"], "fertilizer")
        self.assertIn("Rice Fertilizer Guidance", res["response"])

    def test_pest_tomato(self):
        res = get_agro_response("How can I control pests in tomato plants?")
        self.assertEqual(res["category"], "pest_disease")
        self.assertIn("Tomato Pest & Disease Management", res["response"])

    def test_soil_cotton(self):
        res = get_agro_response("What soil is good for cotton?")
        self.assertEqual(res["category"], "soil")
        self.assertIn("Black Cotton Soil", res["response"])

    def test_drip_irrigation(self):
        res = get_agro_response("Tell me about drip irrigation")
        self.assertEqual(res["category"], "irrigation")
        self.assertIn("Drip Irrigation System", res["response"])

    def test_weather_rainy(self):
        res = get_agro_response("What should I do in rainy weather?")
        self.assertEqual(res["category"], "weather")
        self.assertIn("Rainy & Monsoon Conditions", res["response"])

    def test_tips_crop_rotation(self):
        res = get_agro_response("Give me a tip on crop rotation")
        self.assertEqual(res["category"], "farming_tips")
        self.assertIn("Crop Rotation Tip", res["response"])

    def test_unknown_question(self):
        res = get_agro_response("What is the stock market trend today?")
        self.assertEqual(res["category"], "unknown")
        self.assertIn("I'm sorry, I couldn't understand that agricultural question", res["response"])

    def test_civility(self):
        res_thanks = get_agro_response("Thank you")
        self.assertEqual(res_thanks["category"], "gratitude")

        res_bye = get_agro_response("bye")
        self.assertEqual(res_bye["category"], "exit")


if __name__ == "__main__":
    unittest.main()
`;

export const README_RAW = `# 🌾 AgroAssist – Agricultural Support Chatbot
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

## 💻 Step-by-Step Instructions to Run in VS Code

### Step 1: Install Python
1. Download Python (version 3.8 or higher) from https://www.python.org/downloads/
2. **Crucial on Windows:** Check the box that says **"Add Python to PATH"** before clicking Install.
3. Verify in your terminal/command prompt:
   \`\`\`bash
   python --version
   \`\`\`

### Step 2: Install Visual Studio Code
1. Download VS Code from https://code.visualstudio.com/
2. Open VS Code, go to Extensions (\`Ctrl+Shift+X\` or \`Cmd+Shift+X\`), search for **Python** (by Microsoft), and click **Install**.

### Step 3: Open the Project Folder
1. Unzip \`agroassist-python-project.zip\` (or open the folder containing \`agroassist.py\`).
2. In VS Code, click **File > Open Folder...** and select the project folder.

### Step 4: Run in VS Code Integrated Terminal
1. Press \`Ctrl + \`\` (Backtick) or go to **Terminal > New Terminal**.
2. Run the chatbot:
   \`\`\`bash
   python agroassist.py
   \`\`\`
   *(On macOS / Linux, use \`python3 agroassist.py\`)*

### Step 5: Run Unit Tests
\`\`\`bash
python -m unittest test_agroassist.py
\`\`\`

---

## 👨‍💻 Project Details
- **Developer:** Niranjan
- **Language:** Python 3 (Standard Library: \`re\`, \`sys\`, \`time\`)
`;

export const REQUIREMENTS_RAW = `# AgroAssist - Agricultural Support Chatbot
# Developer: Niranjan
#
# AgroAssist is built using the Python Standard Library (re, sys, time)
# No external libraries are strictly required!
#
# Optional packages for colorful console and testing:
colorama>=0.4.6
pytest>=7.0.0
`;

export const PROJECT_FILES: ProjectFile[] = [
  {
    name: 'agroassist.py',
    description: 'Main rule-based chatbot program',
    content: PYTHON_CODE_RAW,
    mimeType: 'text/x-python;charset=utf-8',
  },
  {
    name: 'test_agroassist.py',
    description: '11 automated unit tests',
    content: TEST_AGROASSIST_RAW,
    mimeType: 'text/x-python;charset=utf-8',
  },
  {
    name: 'README.md',
    description: 'VS Code setup & documentation',
    content: README_RAW,
    mimeType: 'text/markdown;charset=utf-8',
  },
  {
    name: 'requirements.txt',
    description: 'Optional Python dependencies',
    content: REQUIREMENTS_RAW,
    mimeType: 'text/plain;charset=utf-8',
  },
];

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 150);
}

export function downloadProjectFile(file: ProjectFile) {
  const blob = new Blob([file.content], { type: file.mimeType });
  triggerDownload(blob, file.name);
}

export const ZIP_FILE_URL = '/agroassist-python-project.zip';
export const ZIP_FILE_NAME = 'agroassist-python-project.zip';

/**
 * Downloads the verified static ZIP archive of the complete Python VS Code project.
 */
export function downloadProjectZip() {
  const link = document.createElement('a');
  link.href = ZIP_FILE_URL;
  link.download = ZIP_FILE_NAME;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  setTimeout(() => {
    document.body.removeChild(link);
  }, 150);
}
