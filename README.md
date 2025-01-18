# AI-Powered Email Generator

![landing-page](https://github.com/user-attachments/assets/a9195519-66a7-45a6-b0c5-8c4154138986)

![signin](https://github.com/user-attachments/assets/165db480-d4cf-471c-8cfd-2bd9c0af7d65)

![signup](https://github.com/user-attachments/assets/f2c5983c-ef33-484e-882e-d0d6f64b091c)

![dashboard](https://github.com/user-attachments/assets/412906c4-0a94-4404-a336-69a0a6dd5668)

![email-history](https://github.com/user-attachments/assets/2a582f18-5545-4c25-b07d-028d94bc10dd)

![favorite email](https://github.com/user-attachments/assets/76a08929-8184-4634-9277-10d7de283b39)

This project is an AI-powered email generator that leverages the power of Google's Gemini models to create personalized emails based on user prompts.

## Features 🚀

*   **Prompt-Based Generation:** Generate emails by providing a text prompt describing the desired content.
*   **Customizable Parameters:** Control the length and creativity level of the generated emails.
*   **User-Friendly Interface:** A simple UI to interact with the email generation model.

## Tech Stack 🔨

*   **Frontend:** React.js with TypeScript
*   **Backend API:** Node.js with Express.js
*   **Auth:** JWT
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

2.  **Navigate to the backend Directory & Install Backend Dependencies:**

    ```bash
    cd backend
    ```
    ```bash
    npm install
    ```
    
3.  **Set Up Environment Variables (Backend):**
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
4.  **Start the Backend Server:**

    ```bash
    node index.js
    ```
    The server should start running on port `5000` (or the port configured in your backend code).
5. **To run the python server and ai model follow this commands:**

     1. Navigate to python directory by `cd python`.
     2. Create a new virtual environment.
        ```
          python -m venv venv
         ```
     3. Activate the virtual environment.
        ```
          venv\Scripts\Activate #For windows
          source venv/bin/activate # for mac/linux
         ```
     4.  Install requirements:
       ```
        pip install -r requirements.txt
       ```
     5. Run the app by
       ```
        flask run
       ```

6.  **Navigate to the frontend Directory & Install Frontend Dependencies:**

    ```bash
    cd frontend
    ```
    ```bash
    npm install
    ```

7.  **Start the Frontend Development Server:**

    ```bash
    npm run dev
    ```

    The React app should open in your browser (usually at `http://localhost:3000`).

9.  **Access the Application:**

    Open your browser and go to the frontend URL, and start generating emails!
