# TrustBridge 
TrustBridge is a platform designed to help businesses in the informal economy build verifiable financial identities. By turning everyday transactions into quantifiable data, TrustBridge helps entrepreneurs build a certified "Trust Score" to unlock financial growth, partnerships, and institutional recognition.

![TrustBridge Logo](./public/landing-images/logo-bg.svg)

## Phase 1 Completed Features

### 1. Landing Page
* **Modern UI/UX:** Fully responsive landing page built with Tailwind CSS.
* **Smooth Animations:** Scroll-triggered entry animations and interactive elements powered by Framer Motion.
* **Key Sections:** Hero, Problem Statement, 4-Step "How it Works", Dashboard Preview, and AI Assistant feature highlights.

### 2. Authentication System
* **Secure Sign Up & Login:** Fully integrated with Supabase Authentication.
* **Real-time Validation:** Dynamic password strength indicator, email regex formatting, and instant error handling.
* **Field-Level Error States:** "On-blur" and real-time input validation to prevent user frustration without freezing the UI.

### 3. Dynamic 3-Step Onboarding Flow
* **State Management:** A master wrapper (`Onboarding.jsx`) that safely retains user data across multiple sub-steps without URL changes or data loss.
* **Step 1:** Business Details (Name, Registration, Industry, Country).
* **Step 2:** Contact Information (Email, Phone, Headquarters Address).
* **Step 3:** Final Classification (Legal Structure, Description).
* **Database Sync:** Automatically updates the user's row in the Supabase `profiles` table upon completion.

### 4. Verification Certificate Generation
* **Dynamic Data Fetching:** Pulls the user's real business name, creation date, and generates a custom `TB-XXXXX-X` ID from their Supabase UUID.
* **Print-Ready:** Includes a "Download PDF" function that leverages browser print APIs with hidden UI elements for a clean export.

---

## 🛠 Tech Stack

* **Frontend Framework:** [React 18](https://react.dev/)
* **Build Tool:** [Vite](https://vitejs.dev/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **Animations:** [Framer Motion](https://www.framer.com/motion/)
* **Routing:** [React Router DOM](https://reactrouter.com/)
* **Backend / Database / Auth:** [Supabase](https://supabase.com/)