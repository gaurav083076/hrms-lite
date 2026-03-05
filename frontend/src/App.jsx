import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Dashboard from './pages/Dashboard.jsx';
import Employees from './pages/Employees.jsx';
import Attendance from './pages/Attendance.jsx';

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-mark">
          <div className="logo-icon">HR</div>
          <div>
            <div className="logo-text">HRMS Lite</div>
            <span className="logo-sub">Admin Panel</span>
          </div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <span className="nav-section-label">Overview</span>
        <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          Dashboard
        </NavLink>

        <span className="nav-section-label">Management</span>
        <NavLink to="/employees" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          Employees
        </NavLink>
        <NavLink to="/attendance" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          Attendance
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <span>HRMS Lite v1.0</span>
      </div>
    </aside>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/attendance" element={<Attendance />} />
          </Routes>
        </main>
      </div>
      <Toaster position="bottom-right" />
    </BrowserRouter>
  );
}