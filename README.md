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

### 1. Backend Setup
```bash
cd server
npm install
cp .env.example .env   # Configure your MONGO_URI, JWT_SECRET, etc.
npm run dev
```

### 2. Frontend Setup
```bash
cd client
npm install
npm run dev
```
