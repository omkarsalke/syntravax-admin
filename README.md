# Syntravax — Admin Panel

Workforce Management System for managing staff, tasks, and attendance.

## Tech Stack

- React.js
- Firebase (Firestore + Authentication)
- Tailwind CSS
- Cloudinary (photo storage)

## Features

- Google SSO Login
- Multi-tenant architecture (company isolation)
- Staff Management — add, view, remove staff
- Task Assignment — daily, alternate days, weekly, monthly
- Task Completions — view proof photos with timestamps
- Attendance Logs — auto Wi-Fi based check-in/out
- Wi-Fi Settings — set office Wi-Fi for attendance tracking

## Project Structure

syntravax-admin/
├── public/
│   ├── index.html
│   └── favicon.svg
├── src/
│   ├── firebase.js          # Firebase config
│   ├── App.js               # Root component
│   ├── Login.js             # Google SSO login
│   ├── CompanySetup.js      # Company registration
│   ├── Dashboard.js         # Main layout + sidebar
│   ├── StaffManagement.js   # Staff CRUD
│   ├── TaskAssignment.js    # Task CRUD
│   ├── TaskCompletions.js   # View completions + photos
│   ├── AttendanceLogs.js    # Attendance records
│   └── WifiSettings.js      # Office Wi-Fi config
└── package.json

## Setup

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/syntravax-admin.git
cd syntravax-admin
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Firebase
Update `src/firebase.js` with your Firebase project credentials.

### 4. Run locally
```bash
npm start
```

### 5. Build for production
```bash
npm run build
```

## Deployment

Deployed on Vercel. Every push to `main` branch triggers automatic deployment.

## Mobile App

The staff mobile app (React Native + Expo) is in a separate repository: `syntravax-mobile`

## License

Private — All rights reserved © 2026 Syntravax