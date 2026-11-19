"""
Unit Tests for AgroAssist Rule-Based Chatbot
Developer: Niranjan
Run with: python3 python_project/test_agroassist.py
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
