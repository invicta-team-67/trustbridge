# TrustBridge 

TrustBridge is a professional-grade fintech platform engineered to help businesses in the informal economy establish verifiable financial identities. By converting everyday service transactions into quantifiable, immutable data, the platform enables entrepreneurs to build a certified "Trust Score"—bridging the gap between informal operations and institutional recognition, financial growth, and formal partnerships.

![TrustBridge Logo](./public/landing-images/logo-bg.svg)

## 🚀 Phase 1: Core System Architecture

### 1. Advanced Authentication & Security
* **Institutional-Grade Protocols**: Secure sign-up and login workflows fully integrated with Supabase Authentication.
* **Automated Credential Recovery**: Robust "Forgot Password" logic utilizing Supabase SMTP services with dynamic production redirect links.
* **Real-time Validation Engine**: High-fidelity input handling featuring regex-based password strength scoring, email formatting verification, and instant field-level error states to ensure data integrity.

### 2. Dynamic 3-Step Onboarding Flow
* **State Persistence Architecture**: A master controller (`Onboarding.jsx`) manages complex business data across multiple sub-steps using local state management to prevent data loss during the setup lifecycle.
* **Comprehensive Data Capture**: 
    * **Step 1**: Core business identification, registration verification, and industry sector classification.
    * **Step 2**: Global contact synchronization and physical headquarters verification.
    * **Step 3**: Legal structure formalization and operational mission descriptions.
* **Database Synchronization**: Seamless `upsert` of verified profile data into the Supabase PostgreSQL `profiles` table upon completion.

### 3. Verification Certificate Generation
* **Dynamic ID Issuance**: Real-time retrieval of business metadata to generate unique `TB-XXXXX-X` identifiers derived from cryptographic Supabase UUIDs.
* **Portable Digital Identity**: A print-ready certificate interface utilizing browser-print API optimizations for high-quality, clean PDF exports of business credentials.

### 4. Transaction Ledger & Verification Portal
* **Immutable Logging**: Sophisticated interface for recording service entries with financial metadata and direct proof-of-work file uploads to Supabase Storage.
* **External Verification Gateway**: A secure, public-facing portal allowing clients to confirm service delivery or report disputes, updating the global ledger in real-time.
* **Automated Financial Documentation**: Dynamic generation of transaction receipts featuring real-time VAT calculations and unique reference tracking for audit trails.

### 5. Trust Score Analytics
* **Proprietary Scoring Algorithm**: Real-time calculation of credibility metrics based on verification rates, account longevity, and transaction consistency.
* **Interactive Data Visualization**: Executive-level dashboards featuring historical trend analysis and activity charting powered by Recharts.

---

## 🛠 Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend Library** | [React 19](https://react.dev/) |
| **Build Tooling** | [Vite](https://vitejs.dev/) |
| **Design System** | [Tailwind CSS 4.0+](https://tailwindcss.com/) |
| **Motion Design** | [Framer Motion](https://www.framer.com/motion/) |
| **Stateful Routing** | [React Router 7](https://reactrouter.com/) |
| **Backend (BaaS)** | [Supabase (Auth, PostgreSQL, Storage)](https://supabase.com/) |
| **Visualization** | [Recharts](https://recharts.org/) |

---

## 📱 Responsiveness & User Experience
The platform is engineered with a **Mobile-First** philosophy to support entrepreneurs in any environment:
* **Adaptive Navigation**: Desktop-optimized fixed sidebars transition into touch-friendly, high-performance drawer menus on mobile viewports.
* **Fluid Grid Systems**: Metric cards, data tables, and financial forms utilize dynamic layouts to maintain maximum legibility across all device scales.
* **Production Optimization**: Configured with a `_redirects` protocol for seamless Single Page Application (SPA) routing during Netlify deployment.

---

## ⚙️ Development Setup

### Environment Variables
To run this project locally, create a `.env` file in the root directory and add your Supabase credentials:

```text
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_public_key

## Installation
1. **Clone the repository.**
2. **Install dependencies**: `npm install`.
3. **Start the development server**: `npm run dev`.
4. **Build for production**: `npm run build`.
```

---

## ⚖️ License
© 2026 TrustBridge Inc. All rights reserved.
