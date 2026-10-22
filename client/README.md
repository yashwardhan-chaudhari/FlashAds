# FlashAds — Client Frontend

The modern React single-page frontend application for the FlashAds outdoor and digital advertising marketplace.

## 🚀 Key Features

- **Explore & Marketplace:** Real-time search, multi-filter (area, format, size, price, traffic level), and sort algorithms.
- **Dynamic Pricing Engine:** Transparent client-side preview calculating optimal duration tiers (daily, weekly, monthly capping).
- **Interactive Map:** Leaflet + OpenStreetMap geo-coordinates display for hoardings and LED screens.
- **Multi-Role Dashboards:**
  - **Client Dashboard:** Real-time active campaigns, pending requests, Razorpay payment verification, and verified review submission.
  - **Advertiser Dashboard:** Inventory management, live board creation with multi-image Cloudinary upload, availability toggle, and request approval/rejection.
  - **Admin Dashboard:** Platform metrics and quality gatekeeper approving or rejecting pending boards with feedback.
- **Role-Based Authentication:** Protected route navigation, JWT persistence, and role guards (`client`, `advertiser`, `admin`).

## 🛠️ Tech Stack

- **Framework:** React 19, Vite
- **Styling:** Tailwind CSS v4, custom glassmorphism design tokens
- **Routing:** React Router v7
- **Icons:** Lucide React
- **Maps:** Leaflet & React-Leaflet (OpenStreetMap)
- **HTTP Client:** Axios with JWT request interceptors

## 🏁 Development

```bash
# Install dependencies
npm install

# Run Vite development server on port 5173
npm run dev

# Run production build
npm run build

# Run linter
npm run lint
```
