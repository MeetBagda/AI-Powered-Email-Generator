from flask import Flask, request, jsonify
import google.generativeai as genai
from flask_cors import CORS
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

API_KEY =  os.getenv('GEMINI_API_KEY')

print(f"API_KEY from .env: {API_KEY}") #Debugging: Check if API key is loaded

if not API_KEY:
    print("Error: GEMINI_API_KEY not set in .env file")  # More specific error
    # Consider raising an exception or returning an error response here

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

    try:
        genai.configure(api_key=API_KEY) #FORCE API V1
        model = genai.GenerativeModel('models/gemini-1.5-pro-latest')  # Use a model from your list! 
        #OR try: 
        #model = genai.GenerativeModel('models/gemini-2.0-flash-exp')

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


        response = model.generate_content(prompt)

        if response.prompt_feedback:  # Check for prompt feedback
            print("Prompt Feedback:", response.prompt_feedback)  # Debugging

        if response.text:
             return jsonify({"email": response.text}), 200
        else:
            return jsonify({"error": "Gemini API returned an empty response."}), 500

    except Exception as e:
         print(f"Error during API call: {e}")
         return jsonify({"error": f"Failed to generate email. Please try again. Error: {str(e)}"}), 500

if __name__ == '__main__':
    print("Flask server starting...")
    app.run(debug=True)