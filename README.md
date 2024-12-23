# AI-Powered Email Generator

![image](https://github.com/user-attachments/assets/a9195519-66a7-45a6-b0c5-8c4154138986)

![image](https://github.com/user-attachments/assets/d161da40-a0ba-4a53-bd5b-11cf3a6587d3)


This project is an AI-powered email generator that leverages the power of Google's Gemini models to create personalized emails based on user prompts.

## Features 🚀

*   **Prompt-Based Generation:** Generate emails by providing a text prompt describing the desired content.
*   **Customizable Parameters:** Control the length and creativity level of the generated emails.
*   **User-Friendly Interface:** A simple UI to interact with the email generation model.

## Tech Stack 🔨

*   **Frontend:** React.js with TypeScript
*   **Backend API:** Node.js with Express.js
*    **AI Model Interaction Layer:** Python with Flask
*   **AI Model:** Google Gemini (via their API)
*   **Other Packages:** See `package.json` files (for frontend and backend) and `requirements.txt` for Python dependencies for details.

## Prerequisites

Before you begin, ensure you have the following installed:

*   **Node.js:** (Version 16 or higher is recommended)
*   **Google Gemini API Key:** You will need an API key from Google to use the Gemini model. Get one from the Google Cloud Console or Google AI Studio (if applicable):
    [https://ai.google.dev/](https://ai.google.dev/) or [https://makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey) (depending on your access method)

## Setup Instructions
1.  **Clone the Repository:**

    ```bash
    git clone https://github.com/MeetBagda/AI-Powered-Email-Generator.git
    cd AI-Powered-Email-Generator
    ```

2.  **Navigate to the Backend Directory:**

    ```bash
    cd backend
    ```

3.  **Install Backend Dependencies:**

    ```bash
    npm install
    ```

4.  **Set Up Environment Variables (Backend):**
    *   Create a `.env` file in the `backend` directory.
    *   Add the following environment variable:

          ```
           GOOGLE_API_KEY=YOUR_GOOGLE_API_KEY
          ```
          **Replace `YOUR_GOOGLE_API_KEY` with your actual API key from Google Gemini.**
         * If you are using `gemini-pro` you might want to add the `MODEL_NAME`
         ```
            MODEL_NAME=gemini-pro
         ```
5.  **Start the Backend Server:**

    ```bash
    npm start
    ```

    The server should start running on port `5000` (or the port configured in your backend code).

6.  **Navigate to the Frontend Directory:**

    ```bash
    cd ../client
    ```

7.  **Install Frontend Dependencies:**

    ```bash
    npm install
    ```

8.  **Start the Frontend Development Server:**

    ```bash
    npm start
    ```

    The React app should open in your browser (usually at `http://localhost:3000`).

9.  **Access the Application:**

    Open your browser and go to the frontend URL, and start generating emails!
