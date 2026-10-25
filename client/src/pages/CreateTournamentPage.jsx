import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Swords, CheckCircle2, Gamepad2, Settings } from 'lucide-react';
import { useApi } from '../hooks/useApi';

const POPULAR_ESPORTS = [
  { name: 'Counter-Strike 2', category: 'Tactical Shooter', defaultFormat: 'BO3' },
  { name: 'Valorant', category: 'Tactical Shooter', defaultFormat: 'BO3' },
  { name: 'Rocket League', category: 'Vehicular Soccer', defaultFormat: 'BO5' },
  { name: 'Dota 2', category: 'MOBA', defaultFormat: 'BO3' },
  { name: 'Rainbow Six Siege', category: 'Tactical FPS', defaultFormat: 'BO3' },
  { name: 'Apex Legends', category: 'Battle Royale', defaultFormat: 'BO3' },
  { name: 'Overwatch 2', category: 'Hero Shooter', defaultFormat: 'BO5' },
  { name: 'Street Fighter 6', category: 'Fighting', defaultFormat: 'BO5' },
  { name: 'Tekken 8', category: 'Fighting', defaultFormat: 'BO5' },
  { name: 'EA Sports FC 25', category: 'Sports Simulation', defaultFormat: 'BO1' },
  { name: 'Super Smash Bros. Ultimate', category: 'Platform Fighter', defaultFormat: 'BO5' },
  { name: 'League of Legends', category: 'MOBA', defaultFormat: 'BO3' },
  { name: 'Custom Game', category: 'Custom', defaultFormat: 'BO3' }
];

export default function CreateTournamentPage() {
  const navigate = useNavigate();
  const { data: teams } = useApi('/api/teams');

  const [selectedGame, setSelectedGame] = useState('Counter-Strike 2');
  const [customGameName, setCustomGameName] = useState('');
  const [customCategory, setCustomCategory] = useState('Custom eSports');

  const [formData, setFormData] = useState(() => ({
    name: 'IEM Global Pro Championship 2026',
    format: 'Single Elimination',
    match_format: 'BO3',
    prize_pool: '500000',
    max_teams: 8,
    start_date: new Date().toISOString().split('T')[0],
    location: 'Main Arena Stage'
  }));

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleGameSelect = (gameName) => {
    setSelectedGame(gameName);
    const found = POPULAR_ESPORTS.find(g => g.name === gameName);
    if (found && found.name !== 'Custom Game') {
      setFormData(prev => ({
        ...prev,
        match_format: found.defaultFormat
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const finalGameTitle = selectedGame === 'Custom Game' 
        ? (customGameName.trim() || 'Custom eSports Title') 
        : selectedGame;

      const finalCategory = selectedGame === 'Custom Game'
        ? (customCategory.trim() || 'Custom')
        : POPULAR_ESPORTS.find(g => g.name === selectedGame)?.category || 'General';

      // Pick first 8 team IDs
      const teamIds = teams?.slice(0, 8).map(t => t.id) || [1, 2, 3, 4, 5, 6, 7, 8];

      const res = await fetch('/api/tournaments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          game_title: finalGameTitle,
          category: finalCategory,
          team_ids: teamIds
        })
      });

      const data = await res.json();
      if (!res.ok || (data.success !== undefined && !data.success)) {
        throw new Error(data.message || 'Failed to create tournament');
      }

      navigate(`/tournaments/${data.data.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '820px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <div className="badge badge-cyan" style={{ marginBottom: '0.75rem' }}>
          <Gamepad2 size={14} />
          BRACKET GENERATION ENGINE
        </div>
        <h1 style={{ fontSize: '2.4rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
          Create Championship & Bracket
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Launch an official tournament for any popular eSports title or customize for your own game.
        </p>
      </div>

      <div className="card" style={{ padding: '2.5rem' }}>
        {error && (
          <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.15)', color: 'var(--status-live)', borderRadius: '4px', marginBottom: '1.5rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Tournament Name */}
          <div className="form-group">
            <label className="form-label">Tournament Name</label>
            <input
              type="text"
              required
              placeholder="e.g. DreamHack Winter Open 2026"
              className="form-input"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          {/* Game Selection (Popular eSports + Custom) */}
          <div className="form-group">
            <label className="form-label">Game Discipline</label>
            <select
              className="form-select"
              value={selectedGame}
              onChange={e => handleGameSelect(e.target.value)}
            >
              {POPULAR_ESPORTS.map(g => (
                <option key={g.name} value={g.name}>
                  {g.name} {g.category ? `(${g.category})` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* If Custom Game Selected, provide text inputs */}
          {selectedGame === 'Custom Game' && (
            <div style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-focus)',
              borderRadius: 'var(--radius-sm)',
              padding: '1.25rem',
              marginBottom: '1.25rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-primary)', marginBottom: '0.75rem', fontWeight: 600, fontSize: '0.9rem' }}>
                <Settings size={16} />
                <span>Custom Game Specification</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="form-label">Custom Game Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Halo Infinite / Chess / Brawlhalla"
                    className="form-input"
                    value={customGameName}
                    onChange={e => setCustomGameName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="form-label">Category / Genre</label>
                  <input
                    type="text"
                    placeholder="e.g. Arena FPS / Strategy / Fighting"
                    className="form-input"
                    value={customCategory}
                    onChange={e => setCustomCategory(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            {/* Match Format */}
            <div className="form-group">
              <label className="form-label">Match Series Format</label>
              <select
                className="form-select"
                value={formData.match_format}
                onChange={e => setFormData({ ...formData, match_format: e.target.value })}
              >
                <option value="BO1">Best of 1 (Single Map / Match)</option>
                <option value="BO3">Best of 3 (Standard eSports Series)</option>
                <option value="BO5">Best of 5 (Championship Series)</option>
                <option value="BO7">Best of 7 (Marathon Grand Finals)</option>
              </select>
            </div>

            {/* Bracket Structure */}
            <div className="form-group">
              <label className="form-label">Bracket Format</label>
              <select
                className="form-select"
                value={formData.format}
                onChange={e => setFormData({ ...formData, format: e.target.value })}
              >
                <option value="Single Elimination">Single Elimination (8 Teams • 3 Rounds)</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            {/* Prize Pool */}
            <div className="form-group">
              <label className="form-label">Prize Pool ($ USD)</label>
              <input
                type="number"
                required
                min="0"
                step="5000"
                className="form-input"
                value={formData.prize_pool}
                onChange={e => setFormData({ ...formData, prize_pool: e.target.value })}
              />
            </div>

            {/* Start Date */}
            <div className="form-group">
              <label className="form-label">Kickoff Date</label>
              <input
                type="date"
                required
                className="form-input"
                value={formData.start_date}
                onChange={e => setFormData({ ...formData, start_date: e.target.value })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Location / Arena</label>
            <input
              type="text"
              placeholder="e.g. Arena Hall B, Cologne / Esports Stadium"
              className="form-input"
              value={formData.location}
              onChange={e => setFormData({ ...formData, location: e.target.value })}
            />
          </div>

          {/* Automation info */}
          <div style={{
            background: 'rgba(0, 240, 255, 0.06)',
            border: '1px solid rgba(0, 240, 255, 0.25)',
            borderRadius: 'var(--radius-sm)',
            padding: '1rem',
            marginBottom: '2rem',
            fontSize: '0.85rem',
            color: 'var(--primary-cyan)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, marginBottom: '0.4rem' }}>
              <CheckCircle2 size={16} />
              Automatic Bracket & Seed Generation
            </div>
            <p style={{ color: 'var(--text-muted)' }}>
              Submitting will automatically seed the top 8 registered teams into Quarterfinals, Semifinals, and Grand Finals, with relational foreign key linkage for real-time winner advancement.
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/')}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              <Swords size={18} />
              <span>{submitting ? 'Generating Bracket...' : 'Launch Tournament'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
