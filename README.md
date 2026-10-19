# Vaxio — Smart Vaccination Schedule Tracker

> **College Mini-Project** | Submission Date: **26 October 2026**  
> **Headline:** *Stay Protected. Stay on Schedule.*  
> **Repository:** [https://github.com/Archanas-bit/Vaxio](https://github.com/Archanas-bit/Vaxio) (New, independent project)

---

## 📌 Project Overview

**Vaxio** is an independent, full-stack MERN web application engineered to solve real-world immunization adherence challenges. It empowers patients, parents, and healthcare seekers to track multi-dose vaccine courses, monitor upcoming and overdue vaccinations, record certified administration details (clinics, doctors, lot/batch numbers), and securely maintain immutable digital immunization records.

### Key Highlights
- **Dynamic Scheduling & Dose Series:** Handles single-dose and multi-dose vaccination series (Dose $N$ of $M$) with automatic schedule status computations.
- **Accurate Real-Time Status Computation:**
  - **Completed:** Vaccination recorded as administered with full clinical details.
  - **Upcoming:** Not yet completed and scheduled for today or a future date.
  - **Overdue:** Not yet completed and scheduled before today.
- **Database-Backed Dashboard Statistics:** Live statistics for Total Vaccines, Completed Doses, Upcoming Doses, Overdue Doses, Completion Progress (%), and Spotlight on the Next Scheduled Vaccination.
- **Verified Records Vault:** Generates audit-ready immunization records with batch numbers and administering providers without duplicate records.
- **Privacy & Security:** Secure JWT authentication, salted bcrypt password hashing, input validation, and strict cross-user data isolation.
- **Original Pastel UI/UX:** Tailored aesthetic featuring pastel purple (`#7c5cfc`, `#8b5cf6`), lavender accents (`#ede9fe`, `#ddd6fe`), smooth glassmorphic navigation, accessible inputs, and responsive cards.

---

## 💻 Technology Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React 18 (Vite 6) | Fast reactive single-page application |
| **Styling** | Vanilla CSS3 | Custom pastel purple & lavender design system |
| **Icons** | Lucide React | Clean, accessible healthcare and UI icons |
| **Routing** | React Router v6 | Client-side routing with protected route guards |
| **Backend** | Node.js & Express.js (ES Modules) | RESTful API architecture with centralized error handling |
| **Database** | MongoDB & Mongoose ODM | Dedicated schema models with compound indexes |
| **Security** | JWT & bcryptjs | Token-based auth & salted password hashing |
| **Testing** | Node.js Test Runner & Supertest | Automated integration tests with zero-dependency runner |

---

## 📁 Folder Structure

```
Vaxio/
├── client/                      # React 18 frontend (Vite)
│   ├── public/                  # Static assets & favicon
│   ├── src/
│   │   ├── api/
│   │   │   └── client.js        # Centralized HTTP request helper
│   │   ├── components/
│   │   │   ├── CompleteModal.jsx        # Clinical administration modal
│   │   │   ├── DeleteConfirmModal.jsx   # Deletion confirmation modal
│   │   │   ├── Footer.jsx               # Footer with medical disclaimer
│   │   │   ├── Navbar.jsx               # Responsive navigation bar
│   │   │   ├── ProtectedRoute.jsx       # Auth guard wrapper
│   │   │   └── VaccineModal.jsx         # Schedule/edit vaccine modal
│   │   ├── context/
│   │   │   └── AuthContext.jsx  # User session & token state
│   │   ├── pages/
│   │   │   ├── DashboardPage.jsx        # Live statistics & spotlight
│   │   │   ├── LandingPage.jsx          # Public branding & features
│   │   │   ├── LoginPage.jsx            # User sign in
│   │   │   ├── MyVaccinesPage.jsx       # Vaccine CRUD & filtering
│   │   │   ├── ProfilePage.jsx          # Profile details & password
│   │   │   ├── RecordsPage.jsx          # Archived immunization history
│   │   │   └── RegisterPage.jsx         # User registration
│   │   ├── styles/
│   │   │   └── index.css        # Responsive pastel purple CSS system
│   │   ├── App.jsx              # Application router
│   │   └── main.jsx             # React DOM root
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── .env.example
├── server/                      # Express backend API
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js            # MongoDB & Mongoose connection
│   │   ├── controllers/
│   │   │   ├── authController.js        # Register, login, getMe
│   │   │   ├── recordController.js      # Immunization records
│   │   │   ├── userController.js        # Profile & password updates
│   │   │   └── vaccineController.js     # Vaccine CRUD & dashboard stats
│   │   ├── middleware/
│   │   │   ├── auth.js          # JWT bearer token verification
│   │   │   └── errorHandler.js  # Mongoose & HTTP error handlers
│   │   ├── models/
│   │   │   ├── Record.js        # Completed record model (deduped)
│   │   │   ├── User.js          # User model with bcrypt pre-hook
│   │   │   └── Vaccine.js       # Vaccine schedule model
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── recordRoutes.js
│   │   │   ├── userRoutes.js
│   │   │   └── vaccineRoutes.js
│   │   ├── utils/
│   │   │   └── helpers.js       # JWT generation & status computation
│   │   ├── app.js               # Express application configuration
│   │   └── server.js            # Server entry point
│   ├── tests/
│   │   └── api.test.js          # Automated end-to-end API test suite
│   ├── package.json
│   └── .env.example
├── .gitignore                   # Multi-tier gitignore (secrets excluded)
├── package.json                 # Root script runner
└── README.md
```

---

## ⚙️ Environment Variables

### Backend (`server/.env`)
Copy `server/.env.example` to `server/.env`:
```env
PORT=5001
NODE_ENV=development
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/vaxio_db?retryWrites=true&w=majority
JWT_SECRET=your_secure_jwt_secret_key_here
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```
*(Note: If `MONGODB_URI` is omitted during local development or testing, an automated in-memory MongoDB instance runs seamlessly out-of-the-box!)*

### Frontend (`client/.env`)
Copy `client/.env.example` to `client/.env`:
```env
# In development, the Vite proxy directs /api to http://localhost:5001 automatically
# In production, set to your deployed backend URL:
VITE_API_URL=/api
```

---

## 🚀 Installation & Local Startup

### 1. Clone the repository
```bash
git clone https://github.com/Archanas-bit/Vaxio.git
cd Vaxio
```

### 2. Install Dependencies
You can install both client and server dependencies with one command:
```bash
npm run install:all
```
Or manually:
```bash
cd server && npm install
cd ../client && npm install
```

### 3. Run Backend Server
```bash
cd server
npm start
# Server runs on http://localhost:5001
```

### 4. Run Frontend Client
In a new terminal:
```bash
cd client
npm run dev
# Frontend runs on http://localhost:5173
```

---

## 🧪 Testing

Vaxio includes a comprehensive 21-test automated integration suite covering authentication, duplicate detection, invalid credentials, protected routes, data isolation, vaccine lifecycle, and dashboard calculations:

```bash
cd server
npm test
```

### Verified Test Results:
```
▶ Vaxio Complete API & Business Logic Test Suite
  ✔ POST /api/auth/register - Register a new user
  ✔ POST /api/auth/register - Rejects duplicate email
  ✔ POST /api/auth/register - Rejects invalid email and short password
  ✔ POST /api/auth/login - Log in with valid credentials
  ✔ POST /api/auth/login - Rejects invalid password
  ✔ Setup second user for isolation test
  ✔ GET /api/vaccines - Protected route rejects request without token
  ✔ POST /api/vaccines - Add an upcoming vaccination
  ✔ POST /api/vaccines - Add an overdue vaccination
  ✔ GET /api/vaccines - View all user vaccinations
  ✔ GET /api/vaccines/:id - View single vaccination
  ✔ PUT /api/vaccines/:id - Edit a vaccination
  ✔ Cross-user isolation: User 2 cannot view or edit User 1 vaccination
  ✔ PATCH /api/vaccines/:id/complete - Mark vaccination as completed
  ✔ GET /api/records - View vaccination records
  ✔ PATCH /api/vaccines/:id/complete - Prevents duplicate completion records
  ✔ GET /api/vaccines/dashboard/stats - Real database-backed statistics
  ✔ GET /api/user/profile - Get user profile
  ✔ PUT /api/user/profile - Update user profile
  ✔ PUT /api/user/password - Change user password & login with new password
  ✔ DELETE /api/vaccines/:id - Delete vaccination and clean records
✔ Vaxio Complete API & Business Logic Test Suite
ℹ tests 21 | pass 21 | fail 0
```

---

## 🌐 REST API Endpoints

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register a new account
- `POST /api/auth/login` — Sign in and receive JWT token
- `GET /api/auth/me` — Retrieve active user session *(Protected)*

### Vaccines (`/api/vaccines`)
- `GET /api/vaccines` — Retrieve user vaccinations *(Protected, supports `?status=` and `?search=`)*
- `GET /api/vaccines/dashboard/stats` — Live computed dashboard statistics *(Protected)*
- `GET /api/vaccines/:id` — Get single vaccination *(Protected, ownership enforced)*
- `POST /api/vaccines` — Schedule a new vaccination *(Protected)*
- `PUT /api/vaccines/:id` — Update vaccination details *(Protected)*
- `PATCH /api/vaccines/:id/complete` — Mark as completed and generate record *(Protected)*
- `DELETE /api/vaccines/:id` — Delete vaccination and related records *(Protected)*

### Records (`/api/records`)
- `GET /api/records` — Retrieve completed immunization logs *(Protected, supports `?search=`)*
- `GET /api/records/:id` — Get individual record details *(Protected)*
- `DELETE /api/records/:id` — Delete record and revert vaccine completion *(Protected)*

### Profile (`/api/user`)
- `GET /api/user/profile` — Get profile information *(Protected)*
- `PUT /api/user/profile` — Update name, phone, DOB, and blood group *(Protected)*
- `PUT /api/user/password` — Change password with current password verification *(Protected)*

---

## 🚀 Free Deployment Guide

### Backend on Render (Node.js Web Service)
1. Push this repository to GitHub.
2. Sign in to [Render](https://render.com) and click **New > Web Service**.
3. Select your repository: `Vaxio`.
4. Configure settings:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `node src/server.js`
5. Add Environment Variables:
   - `NODE_ENV`: `production`
   - `PORT`: `10000` (Render default)
   - `MONGODB_URI`: Dedicated MongoDB Atlas connection string for Vaxio
   - `JWT_SECRET`: Random 64-character secret
   - `CLIENT_URL`: URL of your frontend (e.g. `https://vaxio.vercel.app`)

### Frontend on Vercel
1. Sign in to [Vercel](https://vercel.com) and click **Add New > Project**.
2. Select your repository: `Vaxio`.
3. Set **Root Directory** to `client`.
4. In Environment Variables, set:
   - `VITE_API_URL`: Your hosted backend URL (e.g., `https://vaxio-api.onrender.com/api`)
5. Click **Deploy**.

---

## ⚖️ Clinical Disclaimer
Vaxio is an informational and organizational tool designed for academic evaluation. It does not provide medical diagnoses or prescribe immunization schedules. Users should always consult certified physicians, pediatricians, or public health authorities for verified immunization advice.
