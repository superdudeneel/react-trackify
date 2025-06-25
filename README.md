# Trackify

A full-stack expense tracking application with a modern React + Vite frontend and a Node.js/Express + MongoDB backend.

<p>
    <img src="https://img.shields.io/badge/Frontend-React-blue" />
    <img src="https://img.shields.io/badge/Backend-Node.js-green" />
    <img src="https://img.shields.io/badge/Database-MongoDB-brightgreen" />
    <img src="https://img.shields.io/badge/Auth-Cookies%20%2F%20Session-orange" />
    <img src="https://img.shields.io/badge/Styling-TailwindCSS-06B6D4" />
    <img src="https://img.shields.io/badge/Language-JavaScript-yellow" />
</p>

## Features

- User authentication (signup, login, logout)
- Secure session management
- Add, view, and categorize expenses
- Dashboard with analytics and KPIs
- Profile management and monthly budget setting
- Responsive, mobile-optimized UI with Tailwind CSS
- SweetAlert2 for user notifications

## Project Structure

```
multi-threading/
│
├── backend/         # Node.js/Express API server
│   ├── index.js
│   ├── package.json
│   └── models/
│       ├── userschema.js
│       └── expenseschema.js
│
└── frontend/        # React + Vite client
    ├── src/
    │   ├── App.jsx
    │   ├── main.jsx
    │   ├── index.css
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── Signup.jsx
    │   │   ├── Login.jsx
    │   │   └── Dashboard.jsx
    │   └── components/
    ├── package.json
    ├── vite.config.js
    └── index.html
```

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, React Router, Lucide Icons, SweetAlert2
- **Backend:** Node.js, Express, MongoDB, Mongoose, bcrypt, express-session, connect-mongo, dotenv, cors

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB instance (local or cloud)

### Backend Setup

1. Navigate to the backend folder:
   ```sh
   cd backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file with:
   ```
   MONGO_URI=your_mongodb_connection_string
   PORT=7000
   FRONT_END_URI=http://localhost:5173
   ```
4. Start the backend server:
   ```sh
   npm start
   ```

### Frontend Setup

1. Navigate to the frontend folder:
   ```sh
   cd frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   npm run dev
   ```
4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Usage

- Sign up for a new account.
- Log in to access your dashboard.
- Add and manage expenses, set your monthly budget, and view analytics.

## Scripts

### Backend

- `npm start` — Start the backend server with nodemon

### Frontend

- `npm run dev` — Start the Vite dev server
- `npm run build` — Build for production
- `npm run preview` — Preview the production build
- `npm run lint` — Run ESLint

## License

This project is licensed under the ISC License.
