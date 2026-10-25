import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import TournamentsPage from './pages/TournamentsPage';
import TournamentDetailPage from './pages/TournamentDetailPage';
import TeamsPage from './pages/TeamsPage';
import LeaderboardPage from './pages/LeaderboardPage';
import SqlInspectorPage from './pages/SqlInspectorPage';
import CreateTournamentPage from './pages/CreateTournamentPage';
import { Trophy } from 'lucide-react';

export default function App() {
  return (
    <Router>
      <div className="app-container">
        {/* Navigation Bar */}
        <Navbar />

        {/* Main Content View Container */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<TournamentsPage />} />
            <Route path="/tournaments/:id" element={<TournamentDetailPage />} />
            <Route path="/teams" element={<TeamsPage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/sql-joins" element={<SqlInspectorPage />} />
            <Route path="/create" element={<CreateTournamentPage />} />
          </Routes>
        </main>

        {/* eSports Footer */}
        <footer style={{
          background: 'var(--bg-surface)',
          borderTop: '1px solid var(--border-subtle)',
          padding: '2rem 1.5rem',
          textAlign: 'center',
          marginTop: 'auto'
        }}>
          <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-primary)', fontSize: '0.9rem', fontWeight: 600 }}>
              <Trophy size={16} />
              <span className="font-tech" style={{ letterSpacing: '0.05em' }}>ESPORTS ARENA — PRO TOURNAMENT & BRACKET PLATFORM</span>
            </div>
            
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Universal Multi-Game Support (CS2, Valorant, Rocket League, Dota 2, Custom Titles)
            </p>

            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span>Built with React, React Router & MySQL Relational Architecture</span>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}
