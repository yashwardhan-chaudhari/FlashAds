# FlashAds — Find. Book. Advertise.

A two-sided web marketplace connecting businesses directly with outdoor & digital advertising space owners (hoardings, unipoles, LED screens, bus shelters).

---

## 🚀 Project Structure

```
FlashAds/
├── client/                     # React + Vite Frontend
│   ├── public/
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/             # Application route pages
│   │   ├── layouts/           # Page & dashboard layouts
│   │   ├── context/           # React context providers (Auth, etc.)
│   │   ├── hooks/             # Custom React hooks
│   │   ├── services/          # API communication services
│   │   ├── utils/             # Helper functions and formatters
│   │   ├── App.jsx            # Core router & layout wrapper
│   │   ├── main.jsx           # Vite React entrypoint
│   │   └── index.css          # Tailwind & custom styling system
│   ├── package.json
│   └── vite.config.js
│
├── server/                     # Node.js + Express REST API
│   ├── config/                # Database & third-party service configs
│   ├── controllers/           # Route controller handlers
│   ├── middleware/            # Auth, validation, error middleware
│   ├── models/                # Mongoose schemas (User, Board, Booking, etc.)
│   ├── routes/                # Express API endpoints
│   ├── services/              # Business logic (Pricing engine, availability)
│   ├── utils/                 # Token, helpers, constants
│   ├── server.js              # Server entry point
│   ├── .env.example           # Template environment variables
│   └── package.json
│
├── docs/                      # Documentation
│   └── PRD.md                 # Product Requirements Document
├── .gitignore
└── README.md
```

---

## 🛠️ Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS, React Router v7, Lucide Icons, Leaflet / OpenStreetMap
- **Backend:** Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs, Helmet, Morgan, Cloudinary
- **Target Market:** Pune, India (INR `₹`)

---

## 🏁 Quick Start

### Option A: Monorepo Single-Command (Recommended)
```bash
# 1. Install dependencies across client & server
npm run install:all

# 2. Configure server environment
cd server
cp .env.example .env   # Update with your MongoDB URI or use local default
cd ..

# 3. Launch both backend API (port 5000) & Vite frontend (port 5173) concurrently
npm run dev
```

### Option B: Individual Terminal Startup

#### 1. Backend Server
```bash
cd server
npm install
npm run dev
# Server runs on http://localhost:5000
```

#### 2. Frontend Client
```bash
cd client
npm install
npm run dev
# Client runs on http://localhost:5173
```

---

## 👥 Seed Demo Accounts

| Role | Email | Password | Dashboard URL |
| --- | --- | --- | --- |
| **Super Admin** | `admin@flashads.in` | `adminSecret123` | `/admin/dashboard` |
| **Advertiser (Board Owner)** | `meena.owner@example.com` | `password123` | `/advertiser/dashboard` |
| **Client (Business)** | `rahul.client@example.com` | `password123` | `/client/dashboard` |

