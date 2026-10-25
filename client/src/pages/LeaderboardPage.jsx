import React from 'react';
import { Trophy } from 'lucide-react';
import { useApi } from '../hooks/useApi';
import TeamCrest from '../components/TeamCrest';
import SqlQueryDrawer from '../components/SqlQueryDrawer';

export default function LeaderboardPage() {
  const { data: leaderboard, loading, error, sqlInfo } = useApi('/api/leaderboard');

  const top3 = leaderboard?.slice(0, 3) || [];

  return (
    <div>
      {/* Clean Header */}
      <section className="hero-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1>GLOBAL ESPORTS STANDINGS</h1>
            <p>
              Real-time win-rates, tournament victories, and match records aggregated across all official esports leagues and premier tournaments.
            </p>
          </div>
        </div>
      </section>

      {loading && (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          Aggregating Leaderboard Standings via Relational JOINs...
        </div>
      )}

      {error && (
        <div style={{ padding: '1.25rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--accent-rose)', borderRadius: '8px', marginBottom: '1.5rem' }}>
          {error}
        </div>
      )}

      {/* Podium for Top 3 */}
      {top3.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3rem',
          alignItems: 'flex-end'
        }}>
          {/* #2 Rank */}
          {top3[1] && (
            <div className="card" style={{ padding: '1.75rem 1.25rem', textAlign: 'center' }}>
              <div style={{ width: '44px', height: '44px', margin: '0 auto 1rem', borderRadius: '50%', background: '#94a3b8', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.1rem' }}>
                #2
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.75rem' }}>
                <TeamCrest name={top3[1].name} tag={top3[1].tag} color={top3[1].primary_color} size={54} />
              </div>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)' }}>{top3[1].name}</h3>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>{top3[1].region}</div>
              <div className="font-tech" style={{ fontSize: '1.4rem', color: 'var(--text-main)' }}>
                {top3[1].matches_won} Wins <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>({top3[1].win_rate_percentage}%)</span>
              </div>
            </div>
          )}

          {/* #1 Rank (Championship Podium) */}
          {top3[0] && (
            <div className="card" style={{
              padding: '2.5rem 1.5rem',
              textAlign: 'center',
              border: '2px solid var(--primary-amber)',
              boxShadow: '0 0 40px rgba(245, 158, 11, 0.25)',
              transform: 'scale(1.02)'
            }}>
              <div style={{
                width: '54px',
                height: '54px',
                margin: '0 auto 1rem',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)',
                color: '#000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: '1.4rem',
                boxShadow: '0 0 20px rgba(245, 158, 11, 0.5)'
              }}>
                <Trophy size={28} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.75rem' }}>
                <TeamCrest name={top3[0].name} tag={top3[0].tag} color={top3[0].primary_color} size={64} />
              </div>
              <div className="badge badge-amber" style={{ marginBottom: '0.5rem' }}>RANK #1 LEADER</div>
              <h3 className="font-title" style={{ fontSize: '1.45rem', color: 'var(--text-main)' }}>{top3[0].name}</h3>
              <div style={{ color: 'var(--primary-cyan)', fontSize: '0.9rem', marginBottom: '1rem' }}>Captain: {top3[0].captain_name}</div>
              <div className="font-tech" style={{ fontSize: '1.75rem', color: 'var(--primary-amber)', fontWeight: 700 }}>
                {top3[0].matches_won} Wins <span style={{ fontSize: '1rem', color: 'var(--text-main)' }}>({top3[0].win_rate_percentage}%)</span>
              </div>
            </div>
          )}

          {/* #3 Rank */}
          {top3[2] && (
            <div className="card" style={{ padding: '1.75rem 1.25rem', textAlign: 'center' }}>
              <div style={{ width: '44px', height: '44px', margin: '0 auto 1rem', borderRadius: '50%', background: '#b45309', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.1rem' }}>
                #3
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.75rem' }}>
                <TeamCrest name={top3[2].name} tag={top3[2].tag} color={top3[2].primary_color} size={54} />
              </div>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)' }}>{top3[2].name}</h3>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>{top3[2].region}</div>
              <div className="font-tech" style={{ fontSize: '1.4rem', color: 'var(--text-main)' }}>
                {top3[2].matches_won} Wins <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>({top3[2].win_rate_percentage}%)</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Full Leaderboard Table */}
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Team</th>
              <th>Tag</th>
              <th>Captain</th>
              <th>Region</th>
              <th>Tourneys</th>
              <th>Matches Played</th>
              <th>Matches Won</th>
              <th>Win Rate</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard?.map((t, idx) => (
              <tr key={t.id}>
                <td>
                  <span style={{ fontWeight: 700, color: idx === 0 ? 'var(--accent-amber)' : 'var(--text-muted)' }}>
                    #{idx + 1}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <TeamCrest name={t.name} tag={t.tag} color={t.primary_color} size={24} />
                    <strong style={{ color: 'var(--text-primary)' }}>{t.name}</strong>
                  </div>
                </td>
                <td>
                  <span style={{ padding: '0.15rem 0.45rem', background: 'var(--bg-input)', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>
                    {t.tag}
                  </span>
                </td>
                <td style={{ color: 'var(--text-primary)' }}>
                  {t.captain_name}
                </td>
                <td style={{ color: 'var(--text-muted)' }}>{t.region}</td>
                <td>{t.tournaments_entered || 1}</td>
                <td>{t.total_matches_played || 0}</td>
                <td>
                  <strong style={{ color: 'var(--text-primary)' }}>{t.matches_won || 0}</strong>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '80px', height: '6px', background: 'var(--border-subtle)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${t.win_rate_percentage || 0}%`, height: '100%', background: idx === 0 ? 'var(--accent-amber)' : 'var(--accent-primary)' }} />
                    </div>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                      {t.win_rate_percentage || 0}%
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* SQL Drawer */}
      <SqlQueryDrawer 
        title="SQL JOIN Query: Relational Leaderboard & Win-Rate Aggregation"
        sql={sqlInfo?.sql}
        explanation="This query joins teams with tournament_teams and matches. It computes conditional aggregation (CASE WHEN winner_id = team.id) to calculate match wins, total matches, and win rates dynamically."
      />
    </div>
  );
}
