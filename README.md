# SPA Application

A modern Single Page Application featuring a cleanly structured Express.js backend and an Angular frontend, utilizing MongoDB for scalable data persistence.

## 🚀 Tech Stack

### Frontend
- **Framework**: Angular 18 (Zoneless Architecture enabled)
- **Styling**: Modern CSS with Glassmorphism UI
- **Language**: TypeScript

### Backend
- **Framework**: Express.js (MVC Architecture)
- **Database**: MongoDB (via Mongoose ODM)
- **Language**: TypeScript (running via `ts-node-dev`)

## ⚙️ Prerequisites

Before you begin, ensure you have met the following requirements:
* You have installed the latest version of [Node.js](https://nodejs.org/) and npm.
* You have a running instance of [MongoDB](https://www.mongodb.com/) (locally on port `27017` or via MongoDB Atlas).

## 🛠️ Installation & Setup

Because this repository contains both the frontend and backend in separate directories, you will need to open two separate terminal instances to run them concurrently.

### 1. Setting up the Backend
Navigate to the `backend` directory and install the dependencies:
```bash
cd backend
npm install
```

Start the backend development server (defaults to port `3000`):
```bash
npm run dev
```
*(The backend connects to `mongodb://localhost:27017/spa-app` by default. You can override this by adding a `.env` file with `MONGODB_URI` and `PORT`)*.

### 2. Setting up the Frontend
Open a new terminal window, navigate to the `frontend` directory, and install dependencies:
```bash
cd frontend
npm install
```

Start the Angular development server (defaults to port `4200`):
```bash
npm start
```

## 🌐 Usage
Once both servers are running:
1. Open your browser and navigate to `http://localhost:4200`.
2. Login to the Operational Portal using your system credentials.
3. Access security records or manage users via the System Directory Console based on your assigned authorization clearance (`General User` or `Admin`).

## 📁 Project Structure

```text
SPA/
├── backend/                  # Express API Server
│   ├── src/
│   │   ├── config/           # MongoDB Connection configuration
│   │   ├── controllers/      # Route controllers (MVC)
│   │   ├── middleware/       # Express middlewares (Auth/Latency emulator)
│   │   ├── models/           # Mongoose ODM Schemas
│   │   ├── routes/           # API Route Definitions
│   │   └── server.ts         # Main Application Entrypoint
│   └── package.json
└── frontend/                 # Angular SPA Client
    ├── src/
    │   ├── app/
    │   │   ├── components/   # Angular UI Components (Login/Dashboard)
    │   │   ├── guards/       # Route Protection
    │   │   └── services/     # HTTP Client logic
    │   ├── main.ts
    │   └── styles.css        # Global Glassmorphism Styles
    └── package.json
```

## 👤 About the Author

Built by [Ahmad Raza](https://github.com/ahmadraza20021119). 
