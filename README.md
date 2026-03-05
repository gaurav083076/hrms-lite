# HRMS Lite

A lightweight Human Resource Management System with employee management and attendance tracking.

## Live Demo

- **Frontend**: https://hrms-lite-weld-three.vercel.app
- **GitHub**: https://github.com/gaurav083076/hrms-lite

## Tech Stack

**Frontend**
- React 19 + Vite
- React Router v6
- Axios
- React Hot Toast

**Backend**
- Python 3.11 + Flask
- PostgreSQL (Supabase)
- psycopg2
- Gunicorn

**Deployment**
- Frontend → Vercel
- Backend → Railway
- Database → Supabase (PostgreSQL)

## Features

- Add, view, and delete employees
- Mark daily attendance (Present / Absent) per employee
- Filter attendance by date and status
- Dashboard with today's attendance summary
- Server-side validation and error handling
- Duplicate employee ID and email detection

## Project Structure

```
hrms-lite/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.py       # DB connection
│   │   ├── models/
│   │   │   ├── employee.py       # Employee table schema
│   │   │   └── attendance.py     # Attendance table schema
│   │   ├── routes/
│   │   │   ├── employee.py       # Employee API endpoints
│   │   │   └── attendance.py     # Attendance API endpoints
│   │   └── main.py               # Flask app entry point
│   ├── Procfile
│   ├── requirements.txt
│   └── runtime.txt
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── index.js          # API client (Axios)
    │   ├── pages/
    │   │   ├── Dashboard.jsx
    │   │   ├── Employees.jsx
    │   │   └── Attendance.jsx
    │   ├── App.jsx               # Routing + layout
    │   ├── main.jsx
    │   └── index.css
    └── package.json
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/health | Health check |
| GET | /api/employees | Get all employees |
| POST | /api/employees | Add new employee |
| DELETE | /api/employees/:id | Delete employee |
| GET | /api/attendance | Get attendance records |
| POST | /api/attendance | Mark attendance |
| GET | /api/attendance/summary | Get attendance summary |

## Running Locally

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL database (or Supabase account)

### Backend Setup

```bash
cd backend

# Create virtual environment
python3 -m venv hrms
source hrms/bin/activate  # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Create .env file
echo "DATABASE_URL=your_postgresql_connection_string" > .env

# Start server
cd src
python3 main.py
```

Backend runs on `http://localhost:5009`

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:5009" > .env

# Start dev server
npm run dev
```

Frontend runs on `http://localhost:5173`

## Assumptions & Limitations

- Attendance can be marked once per employee per day. Re-marking updates the existing record.
- No authentication — this is an internal admin tool.
- Employee ID and email must be unique across the system.
- Free tier hosting may cause cold start delay (~10-15 seconds) on first load.