import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv('GEMINI_API_KEY')

print(f"API_KEY: {API_KEY}")

try:
    genai.configure(api_key=API_KEY)
    print("Configuration successful with api_version='v1'") #added line for debugging
    for model in genai.list_models():
        print(f"Model: {model.name}")
except Exception as e:
    print(f"Error: {e}")