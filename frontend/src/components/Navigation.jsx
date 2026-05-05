import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import '../styles/Navigation.css';

export default function Navigation({ currentPage, setCurrentPage, onStaffAccess }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-logo">
          <span className="logo-icon">🏥</span>
          <h1>MedConsult</h1>
        </div>

        <button 
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          ☰
        </button>

        <div className={`nav-menu ${mobileMenuOpen ? 'active' : ''}`}>
          <button
            className={`nav-link ${currentPage === 'patient' ? 'active' : ''}`}
            onClick={() => {
              setCurrentPage('patient');
              setMobileMenuOpen(false);
            }}
          >
            Patient
          </button>
          <button
            className={`nav-link staff-access-link ${currentPage === 'doctor' || currentPage === 'admin' ? 'active' : ''}`}
            onClick={() => {
              onStaffAccess();
              setMobileMenuOpen(false);
            }}
          >
            Staff Access
          </button>

          <button
            className="theme-toggle-btn"
            onClick={toggleTheme}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? '☀️' : '🌙'}
          </button>
        </div>

        <button
          className="theme-toggle-btn desktop"
          onClick={toggleTheme}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDark ? '☀️' : '🌙'}
        </button>
      </div>
    </nav>
  );
}
