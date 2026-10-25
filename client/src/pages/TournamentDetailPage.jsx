import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, MapPin, Users, ArrowLeft, Swords, ListFilter, RefreshCw } from 'lucide-react';
import { useApi } from '../hooks/useApi';
import BracketTree from '../components/BracketTree';
import TeamCrest from '../components/TeamCrest';
import SqlQueryDrawer from '../components/SqlQueryDrawer';

export default function TournamentDetailPage() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('bracket');

  // Fetch tournament info
  const { data: tournament, loading: loadingTourney, refetch: refetchTourney } = useApi(`/api/tournaments/${id}`);

  // Fetch bracket matches
  const { data: matches, loading: loadingMatches, error: matchError, sqlInfo: matchSqlInfo, refetch: refetchMatches } = useApi(`/api/tournaments/${id}/bracket`);

  // Fetch registered participants
  const { data: participants, sqlInfo: partsSqlInfo, refetch: refetchParticipants } = useApi(`/api/tournaments/${id}/participants`);

  const refreshAll = () => {
    refetchMatches();
    refetchTourney();
    refetchParticipants();
  };

  if (loadingTourney && !tournament) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
        Loading Tournament Hub & Bracket...
      </div>
    );
  }

  if (!tournament) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem' }}>
        <h2>Tournament Not Found</h2>
        <Link to="/" className="btn btn-primary" style={{ marginTop: '1rem' }}>Return to Directory</Link>
      </div>
    );
  }

  return (
    <div>
      {/* Top action row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', color: 'var(--text-secondary)', fontSize: '0.88rem', fontWeight: 500 }}>
          <ArrowLeft size={16} />
          <span>Back to All Tournaments</span>
        </Link>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button 
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={refreshAll}
            title="Refresh Bracket & Scores"
          >
            <RefreshCw size={13} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Clean Toornament-style Tournament Header */}
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '10px',
        padding: '1.75rem 2rem',
        marginBottom: '1.75rem',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1.5rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
            <span className="badge badge-upcoming">{tournament.game_title}</span>
            <span className="badge badge-tier">S-Tier</span>
            <span className="badge badge-upcoming font-tech">{tournament.match_format || 'BO3'}</span>
            {tournament.status === 'active' && (
              <span className="badge badge-live">
                <span className="status-dot status-dot-amber" style={{ width: '5px', height: '5px' }}></span> LIVE
              </span>
            )}
            {tournament.status === 'upcoming' && (
              <span className="badge badge-upcoming">UPCOMING</span>
            )}
            {tournament.status === 'completed' && (
              <span className="badge badge-completed">FINAL</span>
            )}
          </div>

          <h1 style={{ fontSize: '1.85rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
            {tournament.name}
          </h1>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Calendar size={14} color="var(--accent-primary)" />
              <span>{new Date(tournament.start_date).toLocaleDateString()} — {tournament.end_date ? new Date(tournament.end_date).toLocaleDateString() : 'Finals'}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <MapPin size={14} color="var(--accent-amber)" />
              <span>{tournament.location || 'Main Arena'}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Users size={14} />
              <span>{participants?.length || tournament.registered_teams_count || 0} Seeded Squads</span>
            </div>
          </div>
        </div>

        {/* Prize Pool Box */}
        <div style={{
          background: 'var(--bg-input)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '8px',
          padding: '0.85rem 1.35rem',
          textAlign: 'right'
        }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Prize Pool
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-amber)' }}>
            ${Number(tournament.prize_pool).toLocaleString()} USD
          </div>
        </div>
      </div>

      {/* Tabs navigation */}
      <div style={{
        display: 'flex',
        gap: '0.35rem',
        borderBottom: '1px solid var(--border-subtle)',
        marginBottom: '1.75rem',
        overflowX: 'auto'
      }}>
        <button 
          type="button"
          style={{
            padding: '0.75rem 1.25rem',
            border: 'none',
            background: 'transparent',
            borderBottom: activeTab === 'bracket' ? '2px solid var(--accent-primary)' : '2px solid transparent',
            color: activeTab === 'bracket' ? 'var(--accent-primary)' : 'var(--text-secondary)',
            fontWeight: 600,
            fontSize: '0.9rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            whiteSpace: 'nowrap'
          }}
          onClick={() => setActiveTab('bracket')}
        >
          <Swords size={16} />
          <span>Interactive Bracket Tree</span>
        </button>

        <button 
          type="button"
          style={{
            padding: '0.75rem 1.25rem',
            border: 'none',
            background: 'transparent',
            borderBottom: activeTab === 'teams' ? '2px solid var(--accent-primary)' : '2px solid transparent',
            color: activeTab === 'teams' ? 'var(--accent-primary)' : 'var(--text-secondary)',
            fontWeight: 600,
            fontSize: '0.9rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            whiteSpace: 'nowrap'
          }}
          onClick={() => setActiveTab('teams')}
        >
          <Users size={16} />
          <span>Seeded Squads ({participants?.length || 0})</span>
        </button>

        <button 
          type="button"
          style={{
            padding: '0.75rem 1.25rem',
            border: 'none',
            background: 'transparent',
            borderBottom: activeTab === 'matches' ? '2px solid var(--accent-primary)' : '2px solid transparent',
            color: activeTab === 'matches' ? 'var(--accent-primary)' : 'var(--text-secondary)',
            fontWeight: 600,
            fontSize: '0.9rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            whiteSpace: 'nowrap'
          }}
          onClick={() => setActiveTab('matches')}
        >
          <ListFilter size={16} />
          <span>Match Schedule ({matches?.length || 0})</span>
        </button>
      </div>

      {/* Tab 1: Bracket Tree */}
      {activeTab === 'bracket' && (
        <div>
          {loadingMatches ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              Loading Bracket Tree...
            </div>
          ) : matchError ? (
            <div style={{ padding: '1.25rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--accent-rose)', borderRadius: '8px' }}>
              {matchError}
            </div>
          ) : (
            <BracketTree 
              matches={matches || []} 
              onMatchesUpdated={refreshAll} 
            />
          )}

          <SqlQueryDrawer 
            title="Relational SQL Query: Bracket Matches Multi-Table JOIN"
            sql={matchSqlInfo?.sql}
            explanation="This multi-table JOIN connects matches with tournaments, team1, team2, and winner team. Resolves team codes, colors, match lineage, and scores in a single query."
          />
        </div>
      )}

      {/* Tab 2: Seeded Squads & Rosters */}
      {activeTab === 'teams' && (
        <div>
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Seed</th>
                  <th>Team</th>
                  <th>Tag</th>
                  <th>Captain / IGL</th>
                  <th>Region</th>
                  <th>Squad Size</th>
                </tr>
              </thead>
              <tbody>
                {participants?.map(team => (
                  <tr key={team.registration_id}>
                    <td>
                      <span style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>
                        #{team.seed}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <TeamCrest name={team.team_name} tag={team.team_tag} color={team.primary_color || '#0284c7'} size={24} />
                        <strong style={{ color: 'var(--text-primary)' }}>{team.team_name}</strong>
                      </div>
                    </td>
                    <td>
                      <span style={{ padding: '0.15rem 0.45rem', background: 'var(--bg-input)', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>
                        {team.team_tag}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-primary)' }}>
                      {team.captain_name}
                    </td>
                    <td style={{ color: 'var(--text-muted)' }}>{team.region}</td>
                    <td>
                      <span className="badge badge-upcoming">{team.player_count || 5} Players</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <SqlQueryDrawer 
            title="Relational SQL Query: Tournament Participants & Rosters JOIN"
            sql={partsSqlInfo?.sql}
            explanation="JOINs tournament_teams with teams and players tables to retrieve seed order and active roster size."
          />
        </div>
      )}

      {/* Tab 3: Match Schedule List */}
      {activeTab === 'matches' && (
        <div>
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Match</th>
                  <th>Round</th>
                  <th>Matchup</th>
                  <th>Score</th>
                  <th>Status</th>
                  <th>Winner</th>
                </tr>
              </thead>
              <tbody>
                {matches?.map(m => (
                  <tr key={m.id}>
                    <td>
                      <span style={{ fontWeight: 600 }}>MATCH #{m.id}</span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.82rem', color: 'var(--accent-primary)' }}>
                        {m.round_number === 1 ? 'Quarterfinals' : m.round_number === 2 ? 'Semifinals' : 'Grand Finals'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <strong>{m.team1_name || 'TBD'}</strong>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>vs</span>
                        <strong>{m.team2_name || 'TBD'}</strong>
                      </div>
                    </td>
                    <td style={{ fontWeight: 700 }}>
                      {m.score1} - {m.score2}
                    </td>
                    <td>
                      {m.status === 'live' && <span className="badge badge-live">LIVE</span>}
                      {m.status === 'completed' && <span className="badge badge-completed">FINAL</span>}
                      {m.status === 'pending' && <span className="badge badge-upcoming">PENDING</span>}
                    </td>
                    <td>
                      {m.winner_name ? (
                        <span style={{ color: 'var(--accent-emerald)', fontWeight: 600 }}>
                          🏆 {m.winner_name}
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-muted)' }}>Pending</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
