# Academic Climate Action Dashboard

A production-ready full-stack application for monitoring environmental data, analyzing sustainability performance, and providing actionable insights for academic institutions.

## 🏗️ Project Structure
- **/client**: React.js frontend with Tailwind CSS and Recharts.
- **/server**: Node.js + Express.js backend.
- **/server/models**: Mongoose schemas for MongoDB.
- **/server/routes**: Express route handlers.
- **/server/controllers**: Business logic for API endpoints.
- **/server/config**: Database connection settings.

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- MongoDB (Local or Atlas)
- npm or pnpm

### 2. Environment Setup
Create a `.env` file in the root directory:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/climate-dashboard
```

### 3. Installation
```bash
npm install
```

### 4. Running the App
```bash
# Start development server (Frontend + Backend)
npm run dev
```
The app will be available at `http://localhost:8080`.

## 🛠️ Deployment Steps

### Backend (Render / Railway)
1. Push your code to a GitHub repository.
2. Connect the repository to **Render** or **Railway**.
3. Set the build command: `npm install && npm run build`.
4. Set the start command: `npm start`.
5. Add environment variables (`MONGODB_URI`, etc.) in the platform's dashboard.

### Frontend (Netlify / Vercel)
1. For **Vercel**: Import the GitHub repo and it will automatically detect the Vite project.
2. For **Netlify**: Set the base directory to `.` and the build command to `npm run build`. Set the publish directory to `dist/spa`.

## 📚 Modules Overview
- **Data Collection**: Admin can input temperature, carbon, energy, and water metrics.
- **Visualization**: Real-time charts for trends and distributions using Recharts.
- **Insights**: Logic-based recommendations based on consumption levels.
- **Admin Panel**: CRUD operations for climate data with role-based access.
- **Awareness**: Built-in sustainability tips for campus users.
