
# RuralCare AI

RuralCare AI is a comprehensive healthcare platform designed to bridge the gap in medical services for rural communities. It leverages AI-powered tools, telemedicine capabilities, and a suite of health management features to empower patients and support community health workers (CHWs) and specialists.

## Key Features

- **AI-Powered Diagnostics:**
  - **Symptom Analysis:** Users can describe symptoms via text or voice to receive an AI-generated preliminary diagnosis, risk assessment, and recommended next steps.
  - **Image Analysis:** Upload medical images (e.g., skin lesions, X-rays) for diagnostic insights and confidence scores.
  - **Emergency Detection:** Assesses patient-provided data to identify critical conditions and provide immediate action plans.

- **Telemedicine & Referrals:**
  - **Video Consultations:** Schedule and conduct live video sessions with specialists using an integrated Daily.co video chat.
  - **Specialist Directory:** Browse a directory of medical specialists and send referral requests with detailed notes.
  - **Referral Dashboards:** Specialists have a dedicated dashboard to manage incoming patient referrals, accept cases, and track their status.

- **Patient & CHW Management:**
  - **Digital Emergency Card:** A printable card containing a user's critical medical information (blood type, allergies, chronic conditions, emergency contacts) for first responders.
  - **Task Management for CHWs:** AI automatically generates tasks for Community Health Workers based on patient symptom analyses, such as performing a diagnostic test or scheduling a follow-up.
  - **Patient Roster for CHWs:** CHWs can view and manage a list of patients assigned to their specific coverage area.

- **Health & Wellness Resources:**
  - **Health Education Library:** Access a multilingual library of articles on topics like hygiene, nutrition, maternal health, and chronic illness.
  - **Women's Wellbeing:** A dedicated section with guidance on hygiene, safety, pregnancy, and other women's health topics.
  - **Vaccination Tracking:** Log personal vaccination records and browse a library of information on recommended vaccines.
  - **Self-Healing & Relaxation:** Guided sessions for chanting, yoga, and meditation to promote mental wellness and stress relief.

- **Authentication & User Roles:**
  - Secure user registration and login with email/password, Google, and anonymous sign-in options.
  - Role-based access control (RBAC) tailors the user experience for Patients, Community Health Workers (CHWs), and Specialists.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [ShadCN/UI](https://ui.shadcn.com/)
- **Backend & Database:** [Firebase](https://firebase.google.com/) (Authentication, Firestore)
- **Generative AI:** [Genkit (Google AI)](https://firebase.google.com/docs/genkit)
- **Video Conferencing:** [Daily.co](https://www.daily.co/)

## Getting Started

Follow these steps to get the project up and running on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up Environment Variables:**
    Create a `.env.local` file in the root of the project and add your Firebase and Daily.co API keys. You can get your Firebase configuration from your project settings in the Firebase console.

    ```.env.local
    # Firebase Client SDK Configuration
    NEXT_PUBLIC_FIREBASE_PROJECT_ID="..."
    NEXT_PUBLIC_FIREBASE_APP_ID="..."
    NEXT_PUBLIC_FIREBASE_API_KEY="..."
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="..."
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="..."
    
    # Daily.co API Key
    NEXT_PUBLIC_DAILY_API_KEY="..."

    # Gemini API Key (for Genkit)
    GEMINI_API_KEY="..."
    ```
    *Note: The application is configured to automatically use Firebase App Hosting environment variables if deployed there, falling back to the local config.*

### Running the Application

1.  **Start the development server:**
    This command starts the Next.js application.
    ```bash
    npm run dev
    ```

2.  **Start the Genkit AI server:**
    This command starts the local Genkit server to run the AI flows. It's important to run this in a separate terminal.
    ```bash
    npm run genkit:dev
    ```

The application will be available at `http://localhost:9002` and the Genkit developer UI at `http://localhost:4000`.

## Folder Structure

```
.
├── src/
│   ├── app/                # Next.js App Router: pages, layouts, and API routes
│   │   ├── dashboard/      # Main application dashboard and feature pages
│   │   └── ...
│   ├── ai/                 # Genkit configuration and AI flows
│   │   ├── flows/          # Individual AI-powered features
│   │   └── genkit.ts       # Genkit initialization
│   ├── components/         # Reusable UI components (ShadCN)
│   │   ├── common/         # App-wide components like header and sidebar
│   │   └── ui/             # Base UI components
│   ├── contexts/           # React contexts (e.g., Translation)
│   ├── firebase/           # Firebase configuration, hooks, and providers
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions and shared libraries
│   └── locales/            # JSON files for internationalization (i18n)
├── docs/
│   └── backend.json        # Schema definitions for Firebase entities
└── ...
```

