# MealSync Backend (Mealserver)

A lightweight, high-performance Fastify backend for the MealSync food delivery application. This server handles menu management, order processing, and real-time status updates via WebSockets.

## 🏗️ Architecture Layers

| Layer       | Folder/File     | Responsibility                             |
| ----------- | --------------- | ------------------------------------------ |
| **Entry**   | `server.js`     | Application entry point and server startup |
| **Setup**   | `src/app.js`    | Fastify instance & plugin registration     |
| **API**     | `src/routes/`   | Thin HTTP request handlers                 |
| **Services**| `src/services/` | Business logic and orchestration (NEW 🔥)  |
| **Logic**   | `src/store/`    | Data access layer (DAL)                    |
| **Data**    | `src/data/`     | Raw data sources (In-memory menu/orders)   |
| **Config**  | `src/config/`   | Application constants and configuration    |
| **Realtime**| `src/ws/`       | WebSocket handlers for live order updates  |

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm

### Installation
```bash
cd mealserver
npm install
```

### Running the Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```
The server will start on `http://localhost:3001` (default).

## 📡 API Endpoints

| Method | Endpoint           | Description                   |
| ------ | ------------------ | ----------------------------- |
| `GET`  | `/api/menu`        | Retrieve all menu items       |
| `POST` | `/api/orders`      | Create a new order            |
| `GET`  | `/api/orders/:id`  | Get status of a specific order|

## 🔌 WebSocket Integration
The server provides real-time updates for order status changes. Connect to the server's root or `/ws` endpoint (depending on configuration) to receive live updates.

## 🛠️ Tech Stack
- **Fastify**: High-performance web framework.
- **WebSocket**: Real-time communication for order tracking.
- **Helmet**: Security headers middleware.
- **CORS**: Cross-Origin Resource Sharing.
- **Jest**: Testing framework.
