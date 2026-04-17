# Academic Climate Action Dashboard (EcoTrack) 🌍

A production-ready full-stack web application designed for universities to monitor sustainability metrics and track progress towards **UN Sustainable Development Goal 13 (Climate Action)**.

[![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)](https://reactjs.org/)
[![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/mysql-%2300f.svg?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)

---

## 🚀 Features

- **📊 Comprehensive Dashboards**: Real-time visualization of energy, water, waste, and carbon metrics.
- **⚡ Energy Monitoring**: Track grid vs. solar consumption with building-level granularity.
- **🌱 Carbon Tracker**: Calculate CO₂ emissions with specialized emission factors for campus activities.
- **💧 Water Management**: Monitor consumption and track rainwater harvesting effectiveness.
- **♻️ Waste Analytics**: Detailed logging for plastic, organic, and e-waste with recycling rate insights.
- **📅 Green Initiatives**: Manage campus events, plantation drives, and student-led sustainability research.
- **📄 Automated Reporting**: Generate sustainability reports compliant with NAAC/NIRF standards.
- **🏆 Institutional Green Score**: Dynamic scoring system based on environmental performance.

## 🛠 Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, Recharts, Lucide React.
- **Backend**: Node.js, Express server with TypeScript.
- **Database**: MySQL (Primary data store).
- **Authentication**: JWT (JSON Web Tokens) with Secure Password Hashing (Bcrypt).
- **State Management**: TanStack Query (React Query) for efficient API data fetching.

## 📂 Project Structure

```text
├── client/          # React SPA frontend (Vite)
│   ├── components/  # Reusable UI components
│   ├── hooks/       # Custom React hooks
│   └── pages/       # Dashboard view components
├── server/          # Express API backend (TypeScript)
│   ├── controllers/ # API logic handles
│   ├── routes/      # Express route definitions
│   └── models/      # Database schema definitions
├── shared/          # Shared TypeScript interfaces
├── database/        # SQL schemas and seed scripts
└── public/          # Static assets
```

## ⚙️ Installation & Setup

### 1. Prerequisites
- Node.js (v18+)
- pnpm / npm / yarn
- MySQL Database

### 2. Database Configuration
1. Create a MySQL database named `climate_dashboard`.
2. Import the schema found in `database/schema.sql`.
3. (Optional) Run `database/seed.sql` to populate sample data for testing.

### 3. Environment Setup
Create a `.env` file in the root directory:
```env
PORT=8080
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=climate_dashboard
JWT_SECRET=your_jwt_secret_key
```

### 4. Install Dependencies
```bash
pnpm install
```

### 5. Run the Application
```bash
# Start development server (Client + Server)
pnpm dev
```

The application will be available at `http://localhost:8080`.

## 📸 Screenshots
*(Add your project screenshots here)*
![Dashboard Overview](https://via.placeholder.com/800x400?text=Dashboard+UI+Screenshot)
![Carbon Tracking](https://via.placeholder.com/800x400?text=Analytics+Chart+Screenshot)

## 🌎 Deployment Guide

### Frontend (Vite + React)
- **Vercel**: Preferred for high performance and edge functions.
- **Netlify**: Great for quick SPA deployments.

### Backend (Node.js + Express)
- **Render**: Best for free-tier Node.js hosting.
- **Railway**: Excellent for managed MySQL + Node.js environments.

---

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

---
*Built for Academic Excellence and Campus Sustainability.*
