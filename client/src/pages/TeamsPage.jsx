import React, { useState } from 'react';
import { Users, Search, PlusCircle, X } from 'lucide-react';
import { useApi } from '../hooks/useApi';
import TeamCrest from '../components/TeamCrest';
import SqlQueryDrawer from '../components/SqlQueryDrawer';

export default function TeamsPage() {
  const { data: teams, loading, error, sqlInfo, refetch } = useApi('/api/teams');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  // New team form state
  const [formData, setFormData] = useState({
    name: '',
    tag: '',
    captain_name: '',
    region: 'North America',
    primary_color: '#00f0ff',
    playersText: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const filteredTeams = teams?.filter(t => {
    const q = search.toLowerCase();
    return (
      t.name.toLowerCase().includes(q) ||
      t.tag.toLowerCase().includes(q) ||
      t.captain_name.toLowerCase().includes(q) ||
      (t.roster_preview && t.roster_preview.toLowerCase().includes(q))
    );
  }) || [];

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const playerList = formData.playersText
        ? formData.playersText.split(',').map((name, i) => ({
            nickname: name.trim(),
            role: i === 0 ? 'Captain' : 'Pro Player',
            rank_tier: 'Pro Elite'
          })).filter(p => p.nickname)
        : [];

      const res = await fetch('/api/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          tag: formData.tag,
          captain_name: formData.captain_name,
          region: formData.region,
          primary_color: formData.primary_color,
          players: playerList
        })
      });

      if (!res.ok) throw new Error('Failed to register team');
      refetch();
      setModalOpen(false);
      setFormData({
        name: '',
        tag: '',
        captain_name: '',
        region: 'North America',
        primary_color: '#00f0ff',
        playersText: ''
      });
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* Header bar */}
      {/* Header bar */}
      <section className="hero-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1>TEAMS & ACTIVE ROSTERS</h1>
            <p>
              Professional multi-game organizations, in-game leaders, and competitive squad lineups.
            </p>
          </div>

          <button type="button" className="btn btn-primary" onClick={() => setModalOpen(true)}>
            <PlusCircle size={16} />
            <span>Register New Team</span>
          </button>
        </div>
      </section>

      {/* Search Input Bar */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div className="search-input-box" style={{ width: '100%', maxWidth: '450px' }}>
          <Search size={15} color="var(--text-muted)" />
          <input
            type="text"
            style={{ width: '100%' }}
            placeholder="Search teams by name, tag, captain (e.g. nitr0, karrigan, Aleksib, TenZ), or region..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Showing <strong>{filteredTeams.length}</strong> active teams
        </div>
      </div>

      {/* Loading & Error */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          Loading Teams with Joined Player Rosters...
        </div>
      )}

      {error && (
        <div style={{ padding: '1.25rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--accent-rose)', borderRadius: '8px', marginBottom: '1.5rem' }}>
          {error}
        </div>
      )}

      {/* Teams Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2rem'
      }}>
        {filteredTeams.map(team => (
          <div key={team.id} className="card" style={{ padding: '1.25rem' }}>
            {/* Team Top info */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <TeamCrest name={team.name} tag={team.tag} color={team.primary_color || '#00f0ff'} size={48} />
                <div>
                  <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)' }}>{team.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem' }}>
                    <span className="team-tag-pill">{team.tag}</span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{team.region}</span>
                  </div>
                </div>
              </div>

              <span className="badge badge-cyan font-tech">
                {team.player_count || 5} Players
              </span>
            </div>

            {/* Captain */}
            <div style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-subtle)',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>In-Game Leader / Captain</span>
              <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                {team.captain_name}
              </span>
            </div>

            {/* Roster preview */}
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                Active Roster Lineup
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                {team.roster_preview ? (
                  team.roster_preview.split(', ').map((player, idx) => (
                    <span 
                      key={idx}
                      style={{
                        display: 'inline-block',
                        background: 'var(--bg-elevated)',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '4px',
                        marginRight: '0.4rem',
                        marginBottom: '0.4rem',
                        fontSize: '0.78rem',
                        border: '1px solid var(--border-subtle)',
                        color: 'var(--text-main)'
                      }}
                    >
                      {player}
                    </span>
                  ))
                ) : (
                  <em>Roster pending recruitment</em>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* SQL Drawer */}
      <SqlQueryDrawer 
        title="SQL JOIN Query: Teams Directory Joined with Player Rosters"
        sql={sqlInfo?.sql}
        explanation="Uses LEFT JOIN between teams and players, combined with MySQL's GROUP_CONCAT function to aggregate the entire team roster into a single record."
      />

      {/* Register Team Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Users size={20} color="var(--primary-cyan)" />
                <h3 className="font-title" style={{ fontSize: '1.2rem', color: 'var(--text-main)' }}>Register New eSports Team</h3>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={() => setModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateTeam}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Team Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Astralis / Natus Vincere"
                    className="form-input"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Team Tag</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. AST"
                      className="form-input"
                      value={formData.tag}
                      onChange={e => setFormData({ ...formData, tag: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Captain / IGL</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. device"
                      className="form-input"
                      value={formData.captain_name}
                      onChange={e => setFormData({ ...formData, captain_name: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Competitive Region</label>
                    <select
                      className="form-select"
                      value={formData.region}
                      onChange={e => setFormData({ ...formData, region: e.target.value })}
                    >
                      <option value="North America">North America</option>
                      <option value="Europe">Europe</option>
                      <option value="Asia-Pacific">Asia-Pacific</option>
                      <option value="South America">South America</option>
                      <option value="Global">Global / International</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Primary Color Code</label>
                    <input
                      type="text"
                      placeholder="#00f0ff"
                      className="form-input"
                      value={formData.primary_color}
                      onChange={e => setFormData({ ...formData, primary_color: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Roster Players (Comma-separated)</label>
                  <input
                    type="text"
                    placeholder="device, stavn, jabbi, Staehr, br0"
                    className="form-input"
                    value={formData.playersText}
                    onChange={e => setFormData({ ...formData, playersText: e.target.value })}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary btn-sm" onClick={() => setModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary btn-sm" disabled={submitting}>
                  {submitting ? 'Registering...' : 'Register Team'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
