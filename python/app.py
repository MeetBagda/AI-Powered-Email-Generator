from flask import Flask, request, jsonify
import google.generativeai as genai
from flask_cors import CORS
import os
from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__)
CORS(app)

API_KEY =  os.getenv('GEMINI_API_KEY') 

@app.route('/generate-email', methods=['POST'])
def generate_email():
    data = request.get_json()
    purpose = data.get('purpose')
    subject_line = data.get('subjectLine')
    recipients = data.get('recipients')
    senders = data.get('senders')
    max_length = data.get('maxLength')
    tone = data.get('tone')


    if not all([purpose, subject_line, recipients, senders, max_length]):
          return jsonify({"error": "Missing required parameters"}), 400

    genai.configure(api_key=API_KEY)
    model = genai.GenerativeModel('gemini-pro')

    prompt = f"""
        Generate an email with the following details:
        Purpose: {purpose}
        Subject Line: {subject_line}
        Recipients: {recipients}
        Senders: {senders}
        Tone: {tone}

        Ensure the generated email has a maximum of {max_length} words.
        Email:
        """
    try:
        response = model.generate_content(prompt)
        if response.text:
             return jsonify({"email": response.text}), 200
        else:
            return jsonify({"error": "Gemini API returned an empty response."}), 500

    except Exception as e:
         print(f"Error during API call: {e}")
         return jsonify({"error": "Failed to generate email. Please try again."}), 500

if __name__ == '__main__':
    app.run(debug=True)