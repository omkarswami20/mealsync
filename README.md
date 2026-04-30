# MealSync 🍽️

MealSync is a modern, real-time food delivery application that streamlines the ordering process from menu browsing to live order tracking.

## 🚀 Live Demos
- **Frontend (Vercel):** [https://mealsync-client.vercel.app](https://mealsync-client.vercel.app) *(Placeholder)*
- **Backend (Render):** [https://mealserver-api.onrender.com](https://mealserver-api.onrender.com) *(Placeholder)*

---

## 🛠️ Tech Stack

| Component | Technologies |
| :--- | :--- |
| **Frontend** | React, Vite, Material UI (MUI), Redux Toolkit, RTK Query, React Router, Formik, Yup |
| **Backend** | Node.js, Fastify, `@fastify/websocket`, `@fastify/cors`, `@fastify/helmet` |
| **Testing** | Vitest (Frontend), Jest + Supertest (Backend), React Testing Library |
| **Deployment** | Vercel (Frontend), Render (Backend) |

---

## 🏗️ Architecture Decisions

### 1. WebSocket over SSE
We chose **WebSockets** for real-time order status updates. Unlike SSE (Server-Sent Events) which is unidirectional, WebSockets provide a full-duplex communication channel. This allows for more robust real-time interactions and easier expansion to features like live chat or driver updates in the future.

### 2. In-Memory Store
To keep the demonstration lightweight and focused on application logic, we implemented an **in-memory Map** on the server. This avoids the complexity of setting up a database while still providing a functional state that persists for the duration of the server's lifecycle.

### 3. RTK Query
**Redux Toolkit Query** was used for data fetching. It provides a standardized way to handle API requests, automatic caching, and built-in hooks that manage loading and error states seamlessly, significantly reducing boilerplate code.

### 4. Container-Presentational Pattern
The frontend follows the **Container-Presentational pattern**, separating logic (smart components) from UI (dumb components). This improves testability and makes the codebase easier to maintain.

---

## 💻 Local Development

### Prerequisites
- Node.js (v18+)
- npm

### 1. Backend Setup
```bash
cd mealserver
npm install
npm run dev
```
The server will run on `http://localhost:3001`.

### 2. Frontend Setup
```bash
cd mealclient
npm install
# Create .env file
echo "VITE_API_URL=http://localhost:3001/api" > .env
echo "VITE_WS_URL=ws://localhost:3001/ws" >> .env
npm run dev
```
The app will be available at `http://localhost:5173`.

---

## 🧪 Running Tests

### Backend Tests (Jest)
```bash
cd mealserver
npm test
```

### Frontend Tests (Vitest)
```bash
cd mealclient
npm test
```

---

## 🌐 Deployment Configuration

### 1. Render (Backend - Fastify)
- **Runtime:** Node
- **Root Directory:** `mealserver`
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Environment Variables:**
  - `NODE_ENV`: `production`
  - `PORT`: `10000` (Render handles this automatically)

### 2. Vercel (Frontend - Vite)
- **Framework Preset:** Vite
- **Root Directory:** `mealclient`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Environment Variables:**
  - `VITE_API_URL`: Your Render backend URL (e.g., `https://mealserver-api.onrender.com/api`)
  - `VITE_WS_URL`: Your Render WebSocket URL (e.g., `wss://mealserver-api.onrender.com/ws`)
- **SPA Routing:** Handled via `vercel.json` (already included in `mealclient/`).

---

## 🤖 AI Usage
This project was developed with the assistance of **Antigravity**, an AI coding assistant.
- **Scaffolding:** Rapid generation of project structures and configurations.
- **Component Design:** Styling and logic for complex UI components using MUI.
- **API Implementation:** Secure and modular Fastify routes with schema validation.
- **Testing:** Comprehensive test suites for both frontend and backend.
- **Deployment:** Optimized configurations for modern cloud platforms.
