import React, { useState, useEffect } from 'react';
import { X, Trophy, Swords, ArrowRight, Radio, Check } from 'lucide-react';
import TeamCrest from './TeamCrest';

export default function MatchScoreModal({ isOpen, onClose, match, onSave }) {
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);
  const [status, setStatus] = useState('pending');
  const [winnerId, setWinnerId] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (match) {
      setScore1(match.score1 || 0);
      setScore2(match.score2 || 0);
      setStatus(match.status || 'pending');
      setWinnerId(match.winner_id ? String(match.winner_id) : '');
      setError(null);
    }
  }, [match]);

  if (!isOpen || !match) return null;

  const handleScore1Change = (val) => {
    const s1 = parseInt(val, 10) || 0;
    setScore1(s1);
    if (s1 > score2 && match.team1_id) {
      setWinnerId(String(match.team1_id));
    } else if (score2 > s1 && match.team2_id) {
      setWinnerId(String(match.team2_id));
    }
  };

  const handleScore2Change = (val) => {
    const s2 = parseInt(val, 10) || 0;
    setScore2(s2);
    if (score1 > s2 && match.team1_id) {
      setWinnerId(String(match.team1_id));
    } else if (s2 > score1 && match.team2_id) {
      setWinnerId(String(match.team2_id));
    }
  };

  // 1-Click Manual Winner Declaration (Saves directly to DBMS, advances bracket & closes modal)
  const handleDeclareWinnerDirectly = async (winnerTeamId, finalScore1, finalScore2) => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/matches/${match.id}/score`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          score1: finalScore1,
          score2: finalScore2,
          status: 'completed',
          winner_id: winnerTeamId
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to declare winner');
      if (onSave) onSave();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // 1-Click Set Match Live
  const handleSetLiveDirectly = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/matches/${match.id}/score`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          score1,
          score2,
          status: 'live',
          winner_id: null
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to set match live');
      if (onSave) onSave();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const payload = {
        score1,
        score2,
        status,
        winner_id: winnerId ? parseInt(winnerId, 10) : null
      };

      const res = await fetch(`/api/matches/${match.id}/score`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!res.ok || (data.success !== undefined && !data.success)) {
        throw new Error(data.message || 'Failed to update score');
      }

      if (onSave) onSave();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const roundName = match.round_number === 1 ? 'Quarterfinals' : match.round_number === 2 ? 'Semifinals' : 'Grand Finals';
  const minWin = match.match_format === 'BO5' ? 3 : 2;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Swords size={18} color="var(--accent-primary)" />
            <div>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                Match #{match.id} — {roundName}
              </h3>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Series Format: {match.match_format || 'BO3'}
              </div>
            </div>
          </div>
          <button type="button" className="btn btn-secondary btn-sm" onClick={onClose} style={{ padding: '0.3rem 0.5rem' }}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && (
              <div style={{ padding: '0.65rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--accent-rose)', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.82rem' }}>
                {error}
              </div>
            )}

            {/* QUICK 1-CLICK WINNER BUTTONS */}
            {match.team1_id && match.team2_id && (
              <div style={{
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '8px',
                padding: '0.9rem',
                marginBottom: '1.25rem'
              }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-emerald)', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Check size={14} />
                  1-Click Select Winner (Instantly Updates DBMS & Bracket)
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    style={{ background: 'var(--accent-emerald)', borderColor: 'var(--accent-emerald)', fontSize: '0.8rem' }}
                    onClick={() => handleDeclareWinnerDirectly(match.team1_id, minWin, 0)}
                    disabled={saving}
                  >
                    👑 Declare {match.team1_name} Won ({minWin}-0)
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    style={{ background: 'var(--accent-emerald)', borderColor: 'var(--accent-emerald)', fontSize: '0.8rem' }}
                    onClick={() => handleDeclareWinnerDirectly(match.team2_id, 0, minWin)}
                    disabled={saving}
                  >
                    👑 Declare {match.team2_name} Won (0-{minWin})
                  </button>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    style={{ flex: 1, fontSize: '0.74rem' }}
                    onClick={() => handleDeclareWinnerDirectly(match.team1_id, minWin, minWin - 1)}
                    disabled={saving}
                  >
                    Win {match.team1_tag} ({minWin}-{minWin - 1})
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    style={{ flex: 1, fontSize: '0.74rem' }}
                    onClick={() => handleDeclareWinnerDirectly(match.team2_id, minWin - 1, minWin)}
                    disabled={saving}
                  >
                    Win {match.team2_tag} ({minWin - 1}-{minWin})
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    style={{ color: 'var(--accent-rose)', borderColor: 'rgba(244, 63, 94, 0.4)', fontSize: '0.74rem' }}
                    onClick={handleSetLiveDirectly}
                    disabled={saving}
                  >
                    <Radio size={12} />
                    <span>Set LIVE</span>
                  </button>
                </div>
              </div>
            )}

            {/* Score Matchup Box */}
            <div style={{
              background: 'var(--bg-input)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              padding: '1.25rem',
              display: 'grid',
              gridTemplateColumns: '1fr auto 1fr',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '1.25rem'
            }}>
              {/* Team 1 */}
              <div style={{ textAlign: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.4rem' }}>
                  <TeamCrest name={match.team1_name || 'TBD'} tag={match.team1_tag} color={match.team1_color || '#0284c7'} size={36} />
                </div>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem', marginBottom: '0.15rem' }}>
                  {match.team1_name || 'TBD'}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', marginBottom: '0.65rem' }}>
                  {match.team1_tag ? `[${match.team1_tag}]` : 'Awaiting team'}
                </div>
                <input
                  type="number"
                  min="0"
                  max="99"
                  className="form-input"
                  style={{ textAlign: 'center', fontSize: '1.4rem', fontWeight: 700, width: '75px', margin: '0 auto' }}
                  value={score1}
                  onChange={e => handleScore1Change(e.target.value)}
                  disabled={!match.team1_id}
                />
              </div>

              {/* VS Divider */}
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-muted)' }}>VS</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{match.match_format || 'BO3'}</div>
              </div>

              {/* Team 2 */}
              <div style={{ textAlign: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.4rem' }}>
                  <TeamCrest name={match.team2_name || 'TBD'} tag={match.team2_tag} color={match.team2_color || '#7c3aed'} size={36} />
                </div>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem', marginBottom: '0.15rem' }}>
                  {match.team2_name || 'TBD'}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', marginBottom: '0.65rem' }}>
                  {match.team2_tag ? `[${match.team2_tag}]` : 'Awaiting team'}
                </div>
                <input
                  type="number"
                  min="0"
                  max="99"
                  className="form-input"
                  style={{ textAlign: 'center', fontSize: '1.4rem', fontWeight: 700, width: '75px', margin: '0 auto' }}
                  value={score2}
                  onChange={e => handleScore2Change(e.target.value)}
                  disabled={!match.team2_id}
                />
              </div>
            </div>

            {/* Match Status Dropdown */}
            <div className="form-group">
              <label className="form-label">Match Status</label>
              <select className="form-select" value={status} onChange={e => setStatus(e.target.value)}>
                <option value="pending">Upcoming / Pending</option>
                <option value="live">🔴 Live in Progress</option>
                <option value="completed">Completed / Final</option>
              </select>
            </div>

            {/* Winner Selection Dropdown */}
            <div className="form-group">
              <label className="form-label">Declared Winner (Required for Bracket Progression)</label>
              <select 
                className="form-select" 
                value={winnerId} 
                onChange={e => setWinnerId(e.target.value)}
              >
                <option value="">-- No Winner Decided Yet --</option>
                {match.team1_id && <option value={match.team1_id}>👑 {match.team1_name} ({match.team1_tag})</option>}
                {match.team2_id && <option value={match.team2_id}>👑 {match.team2_name} ({match.team2_tag})</option>}
              </select>
            </div>

            {/* Advancement Lineage Info */}
            {match.next_match_id ? (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                padding: '0.75rem 1rem',
                borderRadius: '6px',
                background: 'rgba(2, 132, 199, 0.08)',
                border: '1px solid rgba(2, 132, 199, 0.25)',
                fontSize: '0.82rem',
                color: 'var(--accent-primary)'
              }}>
                <ArrowRight size={15} />
                <span>
                  Winner will automatically advance to <strong>Match #{match.next_match_id}</strong> in the next round.
                </span>
              </div>
            ) : (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.65rem',
                padding: '0.75rem 1rem',
                borderRadius: '6px',
                background: 'rgba(245, 158, 11, 0.08)',
                border: '1px solid rgba(245, 158, 11, 0.25)',
                fontSize: '0.82rem',
                color: 'var(--accent-amber)'
              }}>
                <Trophy size={15} />
                <span>
                  This is the <strong>Grand Finals</strong>. Declaring a winner crowns the Tournament Champion!
                </span>
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>
              {saving ? 'Saving...' : 'Save & Advance Bracket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
