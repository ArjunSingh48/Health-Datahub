# HealthMarket

A prototype decentralized marketplace for wearable health data. Contributors monetize their anonymized health metrics; researchers discover and purchase curated datasets. Built with React, Tailwind CSS, shadcn/ui, and Recharts.

---

## What is this application?

HealthMarket is a **frontend prototype** of a two-sided health data marketplace that demonstrates how wearable health data could be traded between individuals (contributors) and research institutions (researchers) using a simulated blockchain token economy.

### Core Concept

| Side | Role | Actions |
|------|------|---------|
| **Contributor** | Individual wearing health devices | Connect wearables, choose what data to share, earn HLTH tokens |
| **Researcher** | Scientist / Institution | Browse datasets, request access, purchase anonymized health data |

### Simulated Blockchain Layer

The app includes a visual simulation of on-chain interactions:

- **HLTH Token**: The platform's native currency (displayed in wallet balances)
- **Smart Contract Flow**: Visualized step-by-step — Request → Approval → Payment → Access
- **Transaction Hashes**: Mock block hashes like `0x8f3a...2e4b` for realism
- **Wallet Balances**: Contributors earn tokens; researchers spend them

### Data Types Supported

- Heart Rate & Heart Rate Variability (HRV)
- Sleep duration, stages, and quality scores
- Daily steps, distance, and calories
- Blood Oxygen (SpO2)
- Stress levels
- Body temperature variations

---

## Features Implemented

### Onboarding Flow
1. **Landing Page** — Minimalist hero with single "Get Started" CTA
2. **Role Selection** — Dual-card layout: Join as Contributor vs. Join as Researcher
3. **Sign Up / Login** — Role-aware forms with a "Try Demo" bypass button

### Contributor Features
- **User Dashboard** — Health metric cards (heart rate, sleep, steps, SpO2) with sparkline trends
- **Health Wallet** — Connected wearables, vaccination records, medical documents, prescriptions
- **Data Sharing** — Toggle individual data streams on/off with per-stream earning estimates
- **Earnings** — Monthly earnings charts, breakdown by data type, total balance
- **Transactions** — Simulated blockchain transaction history with statuses and hashes

### Researcher Features
- **Researcher Dashboard** — Active data requests, purchased datasets, spending stats
- **Marketplace** — Browse 6+ curated datasets with filters for data type, sample size, price, rating
- **Transactions** — Purchase history and pending request tracking

### Shared Features
- **Notifications** — Data requests, payments received, research opportunities
- **Profile** — Avatar, name, bio, connected devices list
- **Settings** — Privacy preferences, notification settings, account options
- **Data Privacy** — Privacy policy, data usage explanation, consent management

### Navigation
- **Collapsible Sidebar** — Context-aware navigation links based on user role
- **Back Buttons** — Every non-root page has a back button (`navigate(-1)`)
- **Breadcrumb-aware header** — Balance display, notification bell with badge

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React 18 |
| Language | TypeScript 5 |
| Bundler | Vite 5 |
| Styling | Tailwind CSS 3 |
| Components | shadcn/ui + Radix UI primitives |
| Charts | Recharts |
| Icons | Lucide React |
| Routing | React Router v6 |
| State | React Context (Auth) + TanStack Query |
| Testing | Vitest + React Testing Library + Playwright |

### Key Dependencies

- `@tanstack/react-query` — Server state management
- `recharts` — Data visualization (line charts, bar charts, pie charts)
- `react-router-dom` — Client-side routing
- `lucide-react` — Iconography
- `class-variance-authority` + `tailwind-merge` + `clsx` — Utility class composition
- `zod` — Schema validation (via `@hookform/resolvers`)
- `date-fns` — Date formatting

---

## Project Structure

```
├── public/
│   ├── placeholder.svg
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── ui/                    # shadcn/ui components (Button, Card, Input, etc.)
│   │   ├── AppSidebar.tsx         # Collapsible role-aware sidebar
│   │   ├── DashboardLayout.tsx    # Dashboard shell with header + back button
│   │   └── NavLink.tsx            # Active-state nav link helper
│   ├── contexts/
│   │   └── AuthContext.tsx        # Mock auth: login, signup, role switching, demo mode
│   ├── data/
│   │   └── mockData.ts            # All hardcoded health metrics, datasets, transactions
│   ├── hooks/
│   │   ├── use-mobile.tsx         # Mobile viewport detection
│   │   └── use-toast.ts           # Toast notification hook
│   ├── lib/
│   │   └── utils.ts               # cn() utility for Tailwind class merging
│   ├── pages/
│   │   ├── LandingPage.tsx        # Minimal hero → /choose-role
│   │   ├── ChooseRole.tsx         # Contributor vs Researcher cards
│   │   ├── SignupPage.tsx         # Role-aware signup + Try Demo
│   │   ├── LoginPage.tsx          # Login + Try Demo
│   │   ├── UserDashboard.tsx      # Contributor dashboard with health cards
│   │   ├── ResearcherDashboard.tsx# Researcher dashboard with requests
│   │   ├── HealthWallet.tsx       # Wearables, vaccines, records, prescriptions
│   │   ├── DataSharing.tsx        # Toggle data streams + earnings preview
│   │   ├── Marketplace.tsx        # Dataset catalog with filters
│   │   ├── Earnings.tsx           # Earnings charts and breakdowns
│   │   ├── Transactions.tsx       # Simulated blockchain tx history
│   │   ├── Notifications.tsx      # Notification inbox
│   │   ├── Profile.tsx            # User profile page
│   │   ├── Settings.tsx           # Preferences and account settings
│   │   ├── DataPrivacy.tsx        # Privacy policy and consent
│   │   └── NotFound.tsx           # 404 page
│   ├── App.tsx                    # Router + providers
│   ├── main.tsx                   # React root render
│   └── index.css                  # Tailwind base + custom CSS variables
├── index.html
├── package.json
├── tailwind.config.ts
├── tsconfig.json / tsconfig.app.json / tsconfig.node.json
├── vite.config.ts
├── vitest.config.ts
├── playwright.config.ts
└── eslint.config.js
```

---

## How to Run Locally

### Prerequisites

- **Node.js** 18+ (recommended: 20 LTS)
- **npm**, **yarn**, **pnpm**, or **bun**

### 1. Clone the repository

```bash
git clone <repository-url>
cd <project-folder>
```

### 2. Install dependencies

```bash
npm install
```

> The project uses **Vite** with `@vitejs/plugin-react-swc` for fast compilation. No additional setup is required.

### 3. Start the development server

```bash
npm run dev
```

The app will be available at **http://localhost:8080** (or the port Vite assigns if 8080 is busy).

### 4. Try the demo

1. Click **"Get Started"** on the landing page
2. Choose **Contributor** or **Researcher**
3. Click **"Try Demo"** to skip registration and log in instantly

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server (port 8080) |
| `npm run build` | Production build |
| `npm run build:dev` | Development build |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |
| `npm run test` | Run Vitest once |
| `npm run test:watch` | Run Vitest in watch mode |

### Running Playwright E2E tests

```bash
npx playwright test
```

---

## Design System

- **Primary Color**: Teal (`#0D9488` — Tailwind `teal-600`)
- **Accent**: Soft greens and blues
- **Background**: Light gray (`#F8FAFC`) with white cards
- **Cards**: Rounded corners (`rounded-xl`), subtle shadows, glassmorphism on some surfaces
- **Typography**: Clean sans-serif hierarchy with Inter / system-ui stack
- **Theme**: Light mode only (no dark mode toggle implemented)

---

## Architecture Decisions

### Mock Data Only

All data is hardcoded in `src/data/mockData.ts`. There is **no backend API** or database. Authentication is simulated via React Context with predefined mock users.

### Role-Based Routing

Routes are not protected by guards — the app relies on the auth context state. Demo mode logs you in as either:
- **Contributor** (`Alex Johnson`, 2,847.50 HLTH) → `/dashboard`
- **Researcher** (`Dr. Sarah Chen`, 15,420.00 HLTH) → `/researcher`

### No Persistent State

Refreshing the page resets auth state (you'll be logged out). This is expected for a frontend prototype.

---

## Browser Support

- Chrome / Edge (latest)
- Firefox (latest)
- Safari (latest)

Best viewed at **1280×720** and above. Responsive down to mobile (sidebar collapses, cards stack).

---

## License

This is a prototype built for demonstration purposes.
