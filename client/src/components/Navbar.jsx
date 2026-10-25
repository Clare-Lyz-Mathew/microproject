import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Trophy, Swords, Users, Award, Database, PlusCircle, Sun, Moon } from 'lucide-react';

export default function Navbar() {
  const [dbStatus, setDbStatus] = useState(null);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('esports_theme') || 'dark';
  });

  useEffect(() => {
    fetch('/api/db/status')
      .then(res => res.json())
      .then(data => setDbStatus(data))
      .catch(() => {});
  }, []);

  // Apply theme to both html and body elements
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('esports_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <>
      <header className="navbar">
        <div className="navbar-inner">
          {/* Brand Logo - Challonge & Toornament inspired */}
          <Link to="/" className="brand-logo">
            <div className="brand-icon-box">
              <Swords size={20} />
            </div>
            <div>
              <div className="brand-title">ESPORTS ARENA</div>
              <div className="brand-subtitle">Tournament Platform</div>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="nav-links">
            <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Trophy size={16} />
              <span>Tournaments</span>
            </NavLink>

            <NavLink to="/teams" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Users size={16} />
              <span>Teams & Rosters</span>
            </NavLink>

            <NavLink to="/leaderboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Award size={16} />
              <span>Leaderboard</span>
            </NavLink>

            <NavLink to="/sql-joins" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Database size={16} />
              <span>SQL Inspector</span>
            </NavLink>
          </nav>

          {/* Actions: Theme Toggle, LAN / DB Status & New Tournament */}
          <div className="nav-actions">
            {/* Live Database Engine Status Pill */}
            <Link 
              to="/sql-joins" 
              className="db-status-badge"
              title={dbStatus?.connectedToMysql ? `Connected to MySQL (${dbStatus.config.host}:${dbStatus.config.port}/${dbStatus.config.database})` : 'Running with In-Memory Relational Engine'}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.35rem 0.75rem',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: 600,
                textDecoration: 'none',
                background: dbStatus?.connectedToMysql ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                color: dbStatus?.connectedToMysql ? 'var(--accent-emerald, #10b981)' : 'var(--accent-amber, #f59e0b)',
                border: `1px solid ${dbStatus?.connectedToMysql ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`
              }}
            >
              <span style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: dbStatus?.connectedToMysql ? '#10b981' : '#f59e0b',
                boxShadow: dbStatus?.connectedToMysql ? '0 0 8px #10b981' : '0 0 8px #f59e0b'
              }} />
              <Database size={13} />
              <span>{dbStatus?.connectedToMysql ? 'MySQL 8.x Live' : 'Memory Engine'}</span>
            </Link>

            {/* Theme Toggle Button */}
            <button
              type="button"
              className="theme-toggle-btn"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              title={`Switch to ${theme === 'dark' ? 'Eye-Friendly Light' : 'Dark'} mode`}
            >
              {theme === 'dark' ? (
                <>
                  <Sun size={15} color="var(--accent-amber)" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <Moon size={15} color="var(--accent-primary)" />
                  <span>Dark Mode</span>
                </>
              )}
            </button>

            <Link to="/create" className="btn btn-primary btn-sm">
              <PlusCircle size={15} />
              <span>Create Tournament</span>
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}
