# StoreWise

StoreWise is a farmer-focused web app for assessing post-harvest crop spoilage risk, monitoring storage conditions, and making informed storage and market decisions. The interface is available in English and Tamil.

## Features

- Crop spoilage-risk assessment using crop, harvest, quantity, storage, temperature, and humidity details.
- Crop-specific storage guidance and risk results with recommended actions.
- Dashboard with saved crop batches, risk summaries, alerts, and estimated loss prevention.
- Simulated environmental readings and a one-click demo scenario.
- Market information and crop-focused market navigation.
- English and Tamil interface.
- Phone-based authentication and password recovery through Firebase Authentication.
- Browser-local storage for crop records, alerts, and language preferences.

Risk scores and environmental readings are decision-support/demo features, not a substitute for professional agricultural advice or calibrated sensor data.

## Technologies

- React 19
- Vite 8
- JavaScript and CSS
- Firebase Authentication
- Lucide React icons
- Browser Local Storage

## Requirements

- Node.js `^20.19.0` or `>=22.12.0`
- npm
- A Firebase project for live phone authentication

## Setup

1. Clone the repository and enter the project directory:

   ```sh
   git clone https://github.com/coding-wizard123/StoreWise.git
   cd StoreWise
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Create a local environment file by copying `.env.example` to `.env.local`. For example, in PowerShell:

   ```powershell
   Copy-Item .env.example .env.local
   ```

4. To enable live authentication, fill in the Firebase web-app values in `.env.local`:

   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`

   Enable Phone authentication in Firebase Authentication and configure the project's authorized domains. For Firebase test numbers, optionally set `VITE_FIREBASE_TEST_PHONE_NUMBERS` to a comma-separated list. Keep `.env.local` private; environment files other than `.env.example` are ignored by Git.

## Run

Start the development server:

```sh
npm run dev
```

Open the local URL printed by Vite (typically `http://localhost:5173`).

Create a production build and preview it locally with:

```sh
npm run build
npm run preview
```

Without Firebase configuration, the app can still load, but Firebase-backed authentication will not work.
