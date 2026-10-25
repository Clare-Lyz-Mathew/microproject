import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, ChevronRight, Search, PlusCircle, LayoutGrid, List } from 'lucide-react';
import { useApi } from '../hooks/useApi';
import SqlQueryDrawer from '../components/SqlQueryDrawer';

const GAME_TABS = [
  { id: 'all', label: 'All Disciplines' },
  { id: 'league of legends', label: 'League of Legends' },
  { id: 'counter-strike', label: 'CS2' },
  { id: 'valorant', label: 'Valorant' },
  { id: 'rocket league', label: 'Rocket League' },
  { id: 'apex', label: 'Apex Legends' },
  { id: 'dota', label: 'Dota 2' }
];

export default function TournamentsPage() {
  const { data: tournaments, loading, error, sqlInfo } = useApi('/api/tournaments');
  const [statusFilter, setStatusFilter] = useState('all');
  const [gameFilter, setGameFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'

  // Filter tournaments
  const filteredTournaments = tournaments?.filter(t => {
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    const matchesGame = gameFilter === 'all' || t.game_title.toLowerCase().includes(gameFilter.toLowerCase());
    const matchesSearch = searchQuery === '' || 
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      t.game_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.location && t.location.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesStatus && matchesGame && matchesSearch;
  }) || [];

  // Metrics
  const totalPrize = tournaments?.reduce((acc, t) => acc + (parseFloat(t.prize_pool) || 0), 0) || 0;
  const activeCount = tournaments?.filter(t => t.status === 'active').length || 0;
  const upcomingCount = tournaments?.filter(t => t.status === 'upcoming').length || 0;

  return (
    <div>
      {/* Clean Toornament-style Header */}
      <section className="hero-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1>TOURNAMENTS DIRECTORY</h1>
            <p>
              Official esports competitions, championship brackets, and community tournaments across all competitive titles.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
            <Link to="/create" className="btn btn-primary">
              <PlusCircle size={16} />
              <span>Create Tournament</span>
            </Link>
          </div>
        </div>

        {/* Quick Stats Strip */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem',
          marginTop: '1.5rem',
          paddingTop: '1.25rem',
          borderTop: '1px solid var(--border-subtle)'
        }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Events</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)' }}>{tournaments?.length || 0}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Active Competitions</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--accent-rose)' }}>{activeCount} Live</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Upcoming Tourneys</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--accent-primary)' }}>{upcomingCount}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Prize Pool Managed</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--accent-amber)' }}>${(totalPrize / 1000000).toFixed(2)}M USD</div>
          </div>
        </div>
      </section>

      {/* Filter Strip */}
      <div className="filter-strip">
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Status Pills */}
          <div className="filter-pills">
            <button 
              type="button"
              className={`filter-pill ${statusFilter === 'all' ? 'active' : ''}`}
              onClick={() => setStatusFilter('all')}
            >
              All Events
            </button>
            <button 
              type="button"
              className={`filter-pill ${statusFilter === 'active' ? 'active' : ''}`}
              onClick={() => setStatusFilter('active')}
            >
              Live Now ({activeCount})
            </button>
            <button 
              type="button"
              className={`filter-pill ${statusFilter === 'upcoming' ? 'active' : ''}`}
              onClick={() => setStatusFilter('upcoming')}
            >
              Upcoming ({upcomingCount})
            </button>
            <button 
              type="button"
              className={`filter-pill ${statusFilter === 'completed' ? 'active' : ''}`}
              onClick={() => setStatusFilter('completed')}
            >
              Completed
            </button>
          </div>

          {/* Game Discipline Pills */}
          <div style={{ width: '1px', height: '24px', background: 'var(--border-subtle)', margin: '0 0.25rem' }}></div>

          <div className="filter-pills">
            {GAME_TABS.map(tab => (
              <button
                key={tab.id}
                type="button"
                className={`filter-pill ${gameFilter === tab.id ? 'active' : ''}`}
                onClick={() => setGameFilter(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right side: Search Box & View Mode Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="search-input-box">
            <Search size={14} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Search tournaments..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: '6px' }}>
            <button
              type="button"
              style={{
                background: viewMode === 'grid' ? 'var(--bg-surface)' : 'transparent',
                border: 'none',
                padding: '0.4rem 0.6rem',
                cursor: 'pointer',
                color: viewMode === 'grid' ? 'var(--text-primary)' : 'var(--text-muted)',
                borderRadius: '5px'
              }}
              onClick={() => setViewMode('grid')}
              title="Grid View"
            >
              <LayoutGrid size={15} />
            </button>
            <button
              type="button"
              style={{
                background: viewMode === 'table' ? 'var(--bg-surface)' : 'transparent',
                border: 'none',
                padding: '0.4rem 0.6rem',
                cursor: 'pointer',
                color: viewMode === 'table' ? 'var(--text-primary)' : 'var(--text-muted)',
                borderRadius: '5px'
              }}
              onClick={() => setViewMode('table')}
              title="Table View (Esports Charts style)"
            >
              <List size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Loading & Error States */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          Loading Tournaments & Bracket Lineage...
        </div>
      )}

      {error && (
        <div style={{ padding: '1.25rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--accent-rose)', borderRadius: '8px', color: 'var(--accent-rose)', marginBottom: '1.5rem' }}>
          Failed to load tournaments: {error}
        </div>
      )}

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '1.25rem'
        }}>
          {filteredTournaments.map(tournament => (
            <div key={tournament.id} className="card">
              <div style={{ padding: '1.25rem' }}>
                {/* Header row: Game & Status */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <span className="badge badge-upcoming">
                      {tournament.game_title}
                    </span>
                    <span className="badge badge-tier">
                      S-Tier
                    </span>
                  </div>

                  {tournament.status === 'active' && (
                    <span className="badge badge-live">
                      <span className="status-dot status-dot-amber" style={{ width: '5px', height: '5px' }}></span>
                      LIVE
                    </span>
                  )}
                  {tournament.status === 'upcoming' && (
                    <span className="badge badge-upcoming">UPCOMING</span>
                  )}
                  {tournament.status === 'completed' && (
                    <span className="badge badge-completed">FINAL</span>
                  )}
                </div>

                {/* Tournament Title */}
                <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem', lineHeight: 1.3 }}>
                  <Link to={`/tournaments/${tournament.id}`} style={{ color: 'inherit' }}>
                    {tournament.name}
                  </Link>
                </h3>

                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                  {tournament.category || 'eSports'} • {tournament.format || 'Single Elimination'} • {tournament.match_format || 'BO3'}
                </div>

                {/* Metrics */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'var(--bg-input)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  padding: '0.65rem 0.85rem',
                  fontSize: '0.82rem',
                  marginBottom: '1rem'
                }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Prize Pool:</span>{' '}
                    <strong style={{ color: 'var(--accent-amber)' }}>
                      ${Number(tournament.prize_pool).toLocaleString()} USD
                    </strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Teams:</span>{' '}
                    <strong style={{ color: 'var(--text-primary)' }}>
                      {tournament.registered_teams_count || 0} / {tournament.max_teams}
                    </strong>
                  </div>
                </div>

                {/* Dates & Location */}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '1.15rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Calendar size={13} />
                    <span>{new Date(tournament.start_date).toLocaleDateString()}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <MapPin size={13} />
                    <span>{tournament.location || 'Main Arena'}</span>
                  </div>
                </div>

                {/* View Bracket Button */}
                <Link to={`/tournaments/${tournament.id}`} className="btn btn-secondary btn-sm" style={{ width: '100%' }}>
                  <span>View Bracket & Lineage</span>
                  <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Esports Charts Structured Table View */}
      {viewMode === 'table' && (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Tournament</th>
                <th>Game</th>
                <th>Format</th>
                <th>Status</th>
                <th>Prize Pool</th>
                <th>Dates</th>
                <th>Location</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredTournaments.map(t => (
                <tr key={t.id}>
                  <td>
                    <Link to={`/tournaments/${t.id}`} style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                      {t.name}
                    </Link>
                  </td>
                  <td>
                    <span className="badge badge-upcoming">{t.game_title}</span>
                  </td>
                  <td style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    {t.format} ({t.match_format})
                  </td>
                  <td>
                    {t.status === 'active' && <span className="badge badge-live">LIVE</span>}
                    {t.status === 'upcoming' && <span className="badge badge-upcoming">UPCOMING</span>}
                    {t.status === 'completed' && <span className="badge badge-completed">FINAL</span>}
                  </td>
                  <td style={{ fontWeight: 700, color: 'var(--accent-amber)' }}>
                    ${Number(t.prize_pool).toLocaleString()}
                  </td>
                  <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    {new Date(t.start_date).toLocaleDateString()}
                  </td>
                  <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    {t.location}
                  </td>
                  <td>
                    <Link to={`/tournaments/${t.id}`} className="btn btn-secondary btn-sm">
                      Bracket
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filteredTournaments.length === 0 && !loading && (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          No tournaments matching the selected filters.
        </div>
      )}

      {/* SQL Query Drawer */}
      <SqlQueryDrawer 
        title="SQL JOIN Query: Tournaments Overview with Team & Match Aggregations"
        sql={sqlInfo?.sql}
        explanation="Executes multi-table LEFT JOINs between tournaments, tournament_teams, and matches. Computes registered team counts, active matches, and completion status dynamically."
      />
    </div>
  );
}
