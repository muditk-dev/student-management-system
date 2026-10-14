# EduPulse: Student Information Management System (SIS)

> A polished, production-ready, three-tier Student Information Management System built for college mini projects.

![Architecture](https://img.shields.io/badge/Architecture-3--Tier%20MERN-blue?style=for-the-badge)
![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61dafb?style=for-the-badge&logo=react)
![Backend](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-green?style=for-the-badge&logo=node.js)
![Database](https://img.shields.io/badge/Database-MongoDB%20Atlas-47a248?style=for-the-badge&logo=mongodb)
![Deployment](https://img.shields.io/badge/Deployment-Netlify%20%26%20Render-00c7b7?style=for-the-badge)

---

## 📋 Table of Contents
1. [Project Overview & Architecture](#-project-overview--architecture)
2. [Tech Stack](#-tech-stack)
3. [Key Features](#-key-features)
4. [Folder Structure](#-folder-structure)
5. [Prerequisites](#-prerequisites)
6. [Local Development Setup](#-local-development-setup)
7. [Step-by-Step MongoDB Atlas Setup](#-step-by-step-mongodb-atlas-setup)
8. [Backend Deployment Guide (Render)](#-backend-deployment-guide-render)
9. [Frontend Deployment Guide (Netlify)](#-frontend-deployment-guide-netlify)
10. [REST API Documentation](#-rest-api-documentation)
11. [Testing Checklist](#-testing-checklist)
12. [Manual Steps You Must Perform](#-manual-steps-you-must-perform)

---

## 🏛️ Project Overview & Architecture

This application strictly adheres to the standard **Three-Tier Architecture**:

```
+-----------------------------------------------------------+
|                   TIER 1: PRESENTATION                    |
|      React.js (Vite) Single Page Application (SPA)        |
|               Deployed Independently on Netlify           |
+-----------------------------+-----------------------------+
                              |
                              | HTTPS REST Requests (CORS)
                              v
+-----------------------------------------------------------+
|                   TIER 2: APPLICATION API                 |
|       Node.js + Express.js RESTful API & Middleware       |
|               Deployed Independently on Render            |
+-----------------------------+-----------------------------+
                              |
                              | Secure Mongoose ODM Driver
                              v
+-----------------------------------------------------------+
|                      TIER 3: DATA                         |
|         MongoDB Atlas Cloud NoSQL Cluster                 |
|          Isolated Database with IP Whitelisting           |
+-----------------------------------------------------------+
```

### Security Principle
- The database credentials and connection string **never exist in the frontend code**.
- The React frontend communicates strictly via HTTP JSON APIs with the Express backend.
- The backend connects to MongoDB Atlas using Mongoose and guards cross-origin traffic via CORS.

---

## 💻 Tech Stack

| Tier | Technology | Purpose | Hosting Platform |
| :--- | :--- | :--- | :--- |
| **Frontend** | React 19, Vite, Lucide Icons | Admin portal UI, responsive views, modal dialogs, state | **Netlify** |
| **Backend** | Node.js, Express.js | REST API routing, schema validation, error handling, CORS | **Render** |
| **Database** | MongoDB Atlas, Mongoose | Persistent cloud storage, schema constraints, indexing | **MongoDB Atlas** |
| **Version Control** | Git & GitHub | Source tracking and independent CI/CD deployments | **GitHub** |

---

## ✨ Key Features

1. **Administration Dashboard**:
   - Total students counter with live update.
   - Interactive academic department breakdown with percentage bars and click-to-filter.
   - Semester distribution grid (Semester 1 through 8).
   - Quick action shortcuts (Register student, download CSV, filter directory).
   - Recent admissions table highlighting newly enrolled students.

2. **Student Directory & Clean Table**:
   - High-density administrative table with mono badges for Student IDs.
   - Department badges color-coded by division.
   - Semester tags and direct email/phone click-to-action links.

3. **Live Search & Multi-Filter**:
   - Instant search across **Student ID**, **Name**, or **Email**.
   - Dropdown filter by **Department**.
   - Dropdown filter by **Semester**.
   - Instant sorting by Student ID, Name (A-Z / Z-A), Semester, or Registration Date.

4. **Add Student (with Validation)**:
   - Captures Student ID, Full Name, Email, Department, Semester, and Contact Number.
   - Real-time client-side checks + server-side Mongoose schema validation.
   - Explicit prevention and friendly error alerts for duplicate Student IDs (HTTP 409).

5. **View Individual Student Profile**:
   - Clean profile modal displaying full academic information, enrollment timestamps, and direct contact options.

6. **Edit Student Details**:
   - Pre-populated edit modal allowing updates to student contact information, department, or semester with duplicate conflict prevention.

7. **Safe Delete with Confirmation Dialog**:
   - Dedicated modal requiring administrative confirmation before removing student records from the database.

8. **Export to CSV**:
   - Single-click export of current filtered students into a formatted `.csv` spreadsheet.

9. **Live Diagnostics & Health Checker**:
   - Built-in status modal pinging `/api/health` to verify tier connectivity, uptime, and database link.

10. **Responsive Admin Layout**:
    - Mobile-friendly slide-over sidebar, clean navy/slate administrative color scheme, and toast notifications.

---

## 📁 Folder Structure

```
student-management-system/
├── .gitignore                    # Root gitignore (protects .env and node_modules)
├── package.json                  # Root runner scripts
├── README.md                     # Comprehensive project documentation
│
├── backend/                      # TIER 2: Express REST API
│   ├── .env.example              # Template for backend environment variables
│   ├── .gitignore                # Backend-specific ignore
│   ├── package.json              # Backend dependencies & scripts
│   ├── server.js                 # Express server entry point & middleware mounting
│   ├── scripts/
│   │   ├── seed.js               # Database seeder (populates 10 sample students)
│   │   └── testEndpoints.js      # Automated 13-point REST API test verification suite
│   └── src/
│       ├── config/
│       │   └── db.js             # Mongoose connection & status checker
│       ├── controllers/
│       │   └── studentController.js # CRUD, duplicate checking & aggregation logic
│       ├── middleware/
│       │   ├── corsConfig.js     # Safe CORS policy (FRONTEND_URL & local dev)
│       │   └── errorHandler.js   # Centralized Mongoose/HTTP error handler
│       ├── models/
│       │   └── Student.js        # Mongoose Schema & validators
│       └── routes/
│           ├── healthRoutes.js   # GET /api/health
│           └── studentRoutes.js  # GET, POST, PUT, DELETE /api/students
│
└── frontend/                     # TIER 1: React.js (Vite)
    ├── .env.example              # Template for VITE_API_URL
    ├── .gitignore                # Frontend-specific ignore
    ├── index.html                # HTML mount point
    ├── netlify.toml              # Netlify SPA build & redirect configuration
    ├── package.json              # Frontend dependencies
    ├── vite.config.js            # Vite configuration with local API proxy
    ├── public/
    │   └── _redirects            # Netlify SPA fallback routing rule
    └── src/
        ├── App.jsx               # Main state controller & layout coordinator
        ├── constants.js          # Departments, semesters, validation & CSV helpers
        ├── index.css             # College administrative theme styles
        ├── main.jsx              # React DOM bootstrap
        ├── components/
        │   ├── Dashboard.jsx     # Analytics, cards, progress bars & recent records
        │   ├── DeleteConfirmModal.jsx # Irreversible deletion warning modal
        │   ├── Navbar.jsx        # Header bar with quick actions & admin badge
        │   ├── Sidebar.jsx       # Admin navigation & system status indicator
        │   ├── StatusModal.jsx   # 3-tier system diagnostics & Atlas helper
        │   ├── StudentList.jsx   # Filterable data table & sorting controls
        │   ├── StudentModal.jsx  # Reusable Add/Edit form with validation
        │   ├── Toast.jsx         # Floating alert notifications
        │   └── ViewStudentModal.jsx # Student profile drawer
        └── services/
            └── api.js            # Standardized fetch API client
```

---

## 🛠️ Prerequisites

Before running the project locally, ensure you have:
- **Node.js**: v18.0.0 or later (v20+ recommended). Check with `node -v`.
- **npm**: v9.0.0 or later. Check with `npm -v`.
- **Git**: Installed and configured. Check with `git --version`.
- A free **MongoDB Atlas** account (or a local MongoDB instance).

---

## 🚀 Local Development Setup

Follow these exact steps to run the complete system on your computer:

### Step 1: Clone or Navigate to the Project
```bash
cd student-management-system
```

### Step 2: Install Dependencies
You can install dependencies for both applications using the root script:
```bash
npm run install:all
```
*(Or manually run `npm install` inside `backend` and `npm install` inside `frontend`)*

### Step 3: Configure Backend Environment Variables
1. Create a `.env` file in the `backend/` directory:
   ```bash
   # Windows PowerShell
   copy backend\.env.example backend\.env
   ```
2. Open `backend/.env` and insert your MongoDB Atlas URI:
   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/student_db?retryWrites=true&w=majority
   FRONTEND_URL=http://localhost:5173
   NODE_ENV=development
   ```
   *(Note: If you have local MongoDB running, you can use `mongodb://127.0.0.1:27017/student_mgmt_db`)*

### Step 4: (Optional) Seed the Database with Sample Data
Populate 10 realistic student records across departments with one command:
```bash
npm run seed
```

### Step 5: Start the Backend Server
In your first terminal:
```bash
npm run backend
```
The backend API will start at: `http://localhost:5000`  
Health check endpoint: `http://localhost:5000/api/health`

### Step 6: Start the Frontend Application
In a second terminal:
```bash
npm run frontend
```
The React application will open at: `http://localhost:5173`

---

## 🍃 Step-by-Step MongoDB Atlas Setup

Follow this beginner walkthrough to obtain your MongoDB Atlas connection string:

1. **Sign Up / Log In**:
   - Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) and log in or create a free account.
2. **Create a Free Cluster**:
   - Click **Create Deployment** → choose the **M0 (Free)** tier.
   - Choose a provider (e.g., AWS) and region closest to you.
   - Click **Create Deployment**.
3. **Configure Database Access (User)**:
   - In the left sidebar, click **Security** → **Database Access**.
   - Click **Add New Database User**.
   - Authentication Method: **Password**.
   - Enter a username (e.g., `admin_user`) and a secure password (avoid symbols like `@`, `#`, `/` or URL-encode them).
   - Under **Database User Privileges**, select **Read and write to any database**.
   - Click **Add User**.
4. **Configure Network Access (Whitelist IP)**:
   - In the left sidebar, click **Security** → **Network Access**.
   - Click **Add IP Address**.
   - Click **Allow Access from Anywhere** (adds `0.0.0.0/0`). This is required so both your local PC and Render can connect.
   - Click **Confirm**.
5. **Obtain Connection String**:
   - In the left sidebar, click **Deployments** → **Database**.
   - Click the **Connect** button next to your cluster.
   - Choose **Drivers** (Node.js).
   - Copy the connection string. It will look like:
     ```
     mongodb+srv://admin_user:<db_password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority
     ```
   - Replace `<db_password>` with your database user password and add a database name (e.g., `student_db` before the `?`):
     ```
     mongodb+srv://admin_user:mySecretPass123@cluster0.abcde.mongodb.net/student_db?retryWrites=true&w=majority
     ```

---

## ☁️ Backend Deployment Guide (Render)

Render hosts the Node.js/Express REST API independently.

1. **Push your code to GitHub**:
   ```bash
   git add .
   git commit -m "Complete Student Management System"
   git branch -M main
   git remote add origin https://github.com/<your-username>/student-management-system.git
   git push -u origin main
   ```
2. **Create a Web Service on Render**:
   - Log in to [render.com](https://render.com).
   - Click **New +** → **Web Service**.
   - Connect your GitHub repository.
3. **Configure the Service**:
   - **Name**: `student-management-api`
   - **Root Directory**: `backend` *(Important: Must be set to backend)*
   - **Environment**: `Node`
   - **Region**: Closest to your database region (e.g., Oregon or Frankfurt).
   - **Branch**: `main`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Instance Type**: `Free`
4. **Add Environment Variables on Render**:
   In the **Environment Variables** section, add:
   - `MONGODB_URI`: `<Your MongoDB Atlas connection string>`
   - `FRONTEND_URL`: `https://your-app.netlify.app` *(or `*` temporarily until Netlify is deployed)*
   - `NODE_ENV`: `production`
5. **Deploy**:
   - Click **Deploy Web Service**.
   - Once deployed, copy your Render API URL (e.g., `https://student-management-api.onrender.com`).
   - Test it by visiting: `https://student-management-api.onrender.com/api/health`

---

## 🌐 Frontend Deployment Guide (Netlify)

Netlify hosts the React frontend independently.

1. **Log in to Netlify**:
   - Go to [netlify.com](https://www.netlify.com) and log in with your GitHub account.
2. **Add New Site**:
   - Click **Add new site** → **Import an existing project** → choose **GitHub**.
   - Select your `student-management-system` repository.
3. **Configure Build Settings**:
   - **Base directory**: `frontend` *(Important: Must be set to frontend)*
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
4. **Configure Environment Variables**:
   - Under **Environment variables**, click **Add a variable**:
     - Key: `VITE_API_URL`
     - Value: `<Your Render backend URL>` (e.g., `https://student-management-api.onrender.com`)
5. **Deploy**:
   - Click **Deploy site**.
   - Once published, Netlify will assign a live URL (e.g., `https://edupulse-students.netlify.app`).
6. **Update CORS on Render**:
   - Copy your Netlify URL.
   - Go to your Render dashboard → **Environment** → update `FRONTEND_URL` to match your exact Netlify URL.

> **Note on React SPA Routing**:  
> The file `frontend/public/_redirects` (`/* /index.html 200`) and `frontend/netlify.toml` are already preconfigured so that browser refreshes on any page route never result in a Netlify 404 error.

---

## 📡 REST API Documentation

Base URL: `http://localhost:5000` (Local) or `https://<render-subdomain>.onrender.com` (Production)

| Method | Endpoint | Description | Request Query / Body | Success Status |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Health check & Atlas status | None | `200 OK` |
| `GET` | `/api/students/stats` | Aggregated dashboard metrics | None | `200 OK` |
| `GET` | `/api/students` | Get all students (search/filter/sort) | `?search=...&department=...&semester=...` | `200 OK` |
| `GET` | `/api/students/:id` | Get student by Mongo ID or Student ID | None | `200 OK` |
| `POST` | `/api/students` | Register a new student | JSON Student object | `201 Created` |
| `PUT` | `/api/students/:id` | Update existing student | JSON fields to update | `200 OK` |
| `DELETE` | `/api/students/:id` | Delete student record | None | `200 OK` |

### Sample POST Request Body:
```json
{
  "studentId": "CS2026-001",
  "name": "Aarav Sharma",
  "email": "aarav.sharma@college.edu",
  "department": "Computer Science & Engineering",
  "semester": 6,
  "contactNumber": "+91 98765 43210"
}
```

### Sample Duplicate ID Conflict Response (`409 Conflict`):
```json
{
  "success": false,
  "message": "A student with Student ID \"CS2026-001\" already exists. Please use a unique ID."
}
```

---

## ✅ Testing Checklist

Use this checklist during your viva, examination, or evaluation:

- [x] **Backend Health Check**: Open `http://localhost:5000/api/health` and verify `status: "ok"` and `database.connected: true`.
- [x] **Create (Add Student)**:
  - Click **Add Student** in the portal.
  - Fill all required fields and submit. Verify student appears in the directory table and a green success toast appears.
- [x] **Duplicate ID Validation**:
  - Try adding a student with the same Student ID. Verify that an informative error message is displayed and the record is rejected.
- [x] **Read (Search & Filter)**:
  - Type a student name or ID into the search bar: table filters in real time.
  - Select a department filter (e.g., *Information Technology*): only matching students appear.
  - Select a semester filter: verifies semester filtering.
- [x] **View Profile**:
  - Click the **Eye icon** on any student row. Verify the profile modal displays all details, formatted registration date, and clickable links.
- [x] **Update (Edit Student)**:
  - Click the **Pencil icon** on any student row.
  - Update their phone number or semester and click **Update Student**.
  - Verify changes reflect immediately in the table and database.
- [x] **Delete with Confirmation**:
  - Click the **Trash icon** on a student row.
  - Verify the red confirmation modal appears with the student's name and ID.
  - Click **Delete Student** and verify the record is removed.
- [x] **Database Persistence**:
  - Restart the backend server.
  - Refresh the frontend browser page (`F5`).
  - Verify all student records persist from MongoDB Atlas.
- [x] **CSV Export**:
  - Click **Export CSV** and open the downloaded spreadsheet in Excel or Google Sheets.

---

## 📌 Manual Steps You Must Perform

Because automated assistants do not have access to your personal cloud accounts or credit/billing dashboards, you must perform these few external account actions yourself:

1. **MongoDB Atlas Account**:
   - Log into [cloud.mongodb.com](https://cloud.mongodb.com).
   - Create your database user and whitelist IP `0.0.0.0/0`.
   - Copy your connection string into `backend/.env`.
2. **GitHub Repository**:
   - Create a new repository on your GitHub account (e.g., `student-management-system`).
   - Push this workspace to your GitHub repository.
3. **Render Deployment (Backend)**:
   - Create a Web Service connected to your repository with root directory `backend`.
   - Set environment variables `MONGODB_URI` and `FRONTEND_URL`.
4. **Netlify Deployment (Frontend)**:
   - Create a new Netlify site connected to your repository with base directory `frontend`.
   - Set environment variable `VITE_API_URL` to your live Render backend URL.
