import React, { useState } from 'react';
import { Trophy, Clock, CheckCircle2, Crown, Radio, Sparkles, Flame, Check } from 'lucide-react';
import MatchScoreModal from './MatchScoreModal';
import TeamCrest from './TeamCrest';

export default function BracketTree({ matches, onMatchesUpdated }) {
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'live', 'upcoming', 'completed'
  const [liveHighlight, setLiveHighlight] = useState(true);
  const [updatingMatchId, setUpdatingMatchId] = useState(null);

  // Group matches by round_number
  const round1 = matches.filter(m => m.round_number === 1).sort((a, b) => a.match_order - b.match_order);
  const round2 = matches.filter(m => m.round_number === 2).sort((a, b) => a.match_order - b.match_order);
  const round3 = matches.filter(m => m.round_number === 3).sort((a, b) => a.match_order - b.match_order);

  const grandFinalMatch = round3[0];
  const championName = grandFinalMatch?.winner_name;
  const championTag = grandFinalMatch?.winner_tag;

  // Counts for filter pills
  const liveMatches = matches.filter(m => m.status === 'live');
  const upcomingMatches = matches.filter(m => m.status === 'pending');
  const completedMatches = matches.filter(m => m.status === 'completed');

  // 1. Manually Select Winner Directly (Reflects in DBMS & advances bracket)
  const handleSelectWinner = async (e, match, winnerId) => {
    if (e) e.stopPropagation();
    if (!winnerId || !match.team1_id || !match.team2_id) return;
    setUpdatingMatchId(match.id);

    try {
      const isTeam1 = winnerId === match.team1_id;
      // Realistic default winning score for BO3/BO5 if currently 0
      const minWinScore = (match.match_format === 'BO5' ? 3 : 2);
      const score1 = isTeam1 ? Math.max(match.score1, minWinScore) : Math.min(match.score1, minWinScore - 1);
      const score2 = !isTeam1 ? Math.max(match.score2, minWinScore) : Math.min(match.score2, minWinScore - 1);

      const res = await fetch(`/api/matches/${match.id}/score`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          score1,
          score2,
          status: 'completed',
          winner_id: winnerId
        })
      });

      if (!res.ok) throw new Error('Failed to update winner in DBMS');
      if (onMatchesUpdated) onMatchesUpdated();
    } catch (err) {
      console.error('[Winner Selection Error]', err);
    } finally {
      setUpdatingMatchId(null);
    }
  };

  // 2. Toggle Match Live Status (Reflects in DBMS)
  const handleToggleLive = async (e, match) => {
    if (e) e.stopPropagation();
    setUpdatingMatchId(match.id);

    try {
      const newStatus = match.status === 'live' ? 'pending' : 'live';
      const res = await fetch(`/api/matches/${match.id}/score`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          score1: match.score1 || 0,
          score2: match.score2 || 0,
          winner_id: null
        })
      });

      if (!res.ok) throw new Error('Failed to toggle live status in DBMS');
      if (onMatchesUpdated) onMatchesUpdated();
    } catch (err) {
      console.error('[Live Status Toggle Error]', err);
    } finally {
      setUpdatingMatchId(null);
    }
  };

  // 3. Quick Score Increments for Live Matches
  const handleAdjustScore = async (e, match, teamNum, delta) => {
    if (e) e.stopPropagation();
    setUpdatingMatchId(match.id);

    try {
      const newScore1 = teamNum === 1 ? Math.max(0, (match.score1 || 0) + delta) : match.score1 || 0;
      const newScore2 = teamNum === 2 ? Math.max(0, (match.score2 || 0) + delta) : match.score2 || 0;

      const res = await fetch(`/api/matches/${match.id}/score`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          score1: newScore1,
          score2: newScore2,
          status: 'live'
        })
      });

      if (!res.ok) throw new Error('Failed to adjust live score');
      if (onMatchesUpdated) onMatchesUpdated();
    } catch (err) {
      console.error('[Score Adjust Error]', err);
    } finally {
      setUpdatingMatchId(null);
    }
  };

  // Filter matches for display if user selected a status filter
  const filterMatchesList = (list) => {
    if (statusFilter === 'all') return list;
    return list.filter(m => m.status === statusFilter);
  };

  return (
    <div>
      {/* Champion Crowned Banner */}
      {championName && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          padding: '1.25rem 2rem',
          borderRadius: '8px',
          background: 'var(--bg-surface)',
          border: '2px solid var(--accent-amber)',
          marginBottom: '2rem',
          boxShadow: 'var(--shadow-md)'
        }}>
          <Crown size={28} color="var(--accent-amber)" />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-amber)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              CHAMPION CROWNED
            </div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {championName} <span style={{ color: 'var(--accent-primary)' }}>[{championTag}]</span>
            </div>
          </div>
          <Trophy size={28} color="var(--accent-amber)" />
        </div>
      )}

      {/* Bracket View Option Controls Strip */}
      <div className="bracket-controls-strip">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginRight: '0.25rem' }}>
            View Option:
          </span>

          <button
            type="button"
            className={`filter-pill ${statusFilter === 'all' ? 'active' : ''}`}
            onClick={() => setStatusFilter('all')}
          >
            All Bracket Matches ({matches.length})
          </button>

          <button
            type="button"
            className={`filter-pill ${statusFilter === 'live' ? 'active' : ''}`}
            onClick={() => setStatusFilter('live')}
            style={liveMatches.length > 0 ? { color: 'var(--accent-rose)', fontWeight: 700 } : {}}
          >
            <Radio size={13} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
            Live Matches ({liveMatches.length})
          </button>

          <button
            type="button"
            className={`filter-pill ${statusFilter === 'upcoming' ? 'active' : ''}`}
            onClick={() => setStatusFilter('upcoming')}
          >
            Upcoming ({upcomingMatches.length})
          </button>

          <button
            type="button"
            className={`filter-pill ${statusFilter === 'completed' ? 'active' : ''}`}
            onClick={() => setStatusFilter('completed')}
          >
            Completed ({completedMatches.length})
          </button>
        </div>

        {/* Live Highlight Glow Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => setLiveHighlight(!liveHighlight)}
            style={{ fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <Sparkles size={13} color={liveHighlight ? 'var(--accent-amber)' : 'var(--text-muted)'} />
            <span>Live Glow: <strong>{liveHighlight ? 'ON' : 'OFF'}</strong></span>
          </button>
        </div>
      </div>

      {/* DEDICATED LIVE MATCHES HUB (When "Live" filter is selected or when active live matches exist) */}
      {statusFilter === 'live' && (
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--accent-rose)', display: 'inline-block', boxShadow: '0 0 10px var(--accent-rose)' }}></span>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', margin: 0 }}>
              LIVE MATCH ARENA — IN-PROGRESS BROADCAST
            </h3>
          </div>

          {liveMatches.length === 0 ? (
            <div className="card" style={{ padding: '2.5rem', textAlign: 'center' }}>
              <Radio size={36} color="var(--text-muted)" style={{ margin: '0 auto 1rem', display: 'block' }} />
              <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>No Matches Currently Marked as LIVE</h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '500px', margin: '0 auto 1.5rem' }}>
                You can turn any upcoming bracket match into a <strong>LIVE</strong> match at any time. Click below to start an upcoming match as live.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                {upcomingMatches.filter(m => m.team1_id && m.team2_id).slice(0, 3).map(m => (
                  <button
                    key={m.id}
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={(e) => handleToggleLive(e, m)}
                  >
                    <Flame size={14} />
                    <span>Set Match #{m.id} ({m.team1_tag} vs {m.team2_tag}) as LIVE</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="live-hub-grid">
              {liveMatches.map(match => (
                <div key={match.id} className="live-hub-card">
                  <div className="live-hub-topbar">
                    <span className="badge badge-live">
                      <span className="status-dot status-dot-amber" style={{ width: '6px', height: '6px', background: 'var(--accent-rose)' }}></span>
                      🔴 LIVE NOW — {match.round_number === 1 ? 'Quarterfinals' : match.round_number === 2 ? 'Semifinals' : 'Grand Finals'}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                      Series: {match.match_format || 'BO3'}
                    </span>
                  </div>

                  {/* Big Live Scoreboard */}
                  <div className="live-hub-scoreboard">
                    {/* Team 1 */}
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.35rem' }}>
                        <TeamCrest name={match.team1_name} tag={match.team1_tag} color={match.team1_color} size={38} />
                      </div>
                      <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)' }}>{match.team1_name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 700 }}>[{match.team1_tag}]</div>
                      {/* Score control */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', marginTop: '0.5rem' }}>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.1rem 0.5rem', height: '22px' }}
                          onClick={(e) => handleAdjustScore(e, match, 1, -1)}
                        >-</button>
                        <span style={{ fontSize: '1.4rem', fontWeight: 900, minWidth: '24px' }}>{match.score1}</span>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.1rem 0.5rem', height: '22px' }}
                          onClick={(e) => handleAdjustScore(e, match, 1, 1)}
                        >+</button>
                      </div>
                    </div>

                    {/* VS */}
                    <div style={{ textAlign: 'center', padding: '0 0.5rem' }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 900, color: 'var(--accent-rose)' }}>VS</div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>MAP SCORES</div>
                    </div>

                    {/* Team 2 */}
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.35rem' }}>
                        <TeamCrest name={match.team2_name} tag={match.team2_tag} color={match.team2_color} size={38} />
                      </div>
                      <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)' }}>{match.team2_name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontWeight: 700 }}>[{match.team2_tag}]</div>
                      {/* Score control */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', marginTop: '0.5rem' }}>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.1rem 0.5rem', height: '22px' }}
                          onClick={(e) => handleAdjustScore(e, match, 2, -1)}
                        >-</button>
                        <span style={{ fontSize: '1.4rem', fontWeight: 900, minWidth: '24px' }}>{match.score2}</span>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.1rem 0.5rem', height: '22px' }}
                          onClick={(e) => handleAdjustScore(e, match, 2, 1)}
                        >+</button>
                      </div>
                    </div>
                  </div>

                  {/* Manual Winner Buttons directly on the Live Card */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      Declare Winner (Commits to DBMS & Advances Bracket):
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        style={{ background: 'var(--accent-emerald)', borderColor: 'var(--accent-emerald)' }}
                        onClick={(e) => handleSelectWinner(e, match, match.team1_id)}
                        disabled={updatingMatchId === match.id}
                      >
                        <Check size={14} />
                        <span>👑 Win: {match.team1_name}</span>
                      </button>
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        style={{ background: 'var(--accent-emerald)', borderColor: 'var(--accent-emerald)' }}
                        onClick={(e) => handleSelectWinner(e, match, match.team2_id)}
                        disabled={updatingMatchId === match.id}
                      >
                        <Check size={14} />
                        <span>👑 Win: {match.team2_name}</span>
                      </button>
                    </div>

                    <button
                      type="button"
                      className="btn btn-secondary btn-sm"
                      style={{ marginTop: '0.25rem', width: '100%', fontSize: '0.75rem' }}
                      onClick={(e) => handleToggleLive(e, match)}
                    >
                      ⏸ Pause / Set back to Pending
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* FULL BRACKET TREE VIEW (Quarterfinals -> Semifinals -> Grand Finals) */}
      <div className="bracket-viewport">
        <div className="bracket-tree">

          {/* Round 1: Quarterfinals */}
          <div className="bracket-column">
            <div className="round-header-box">
              <div className="round-name">Quarterfinals</div>
              <div className="round-sub">Round of 8 • {round1[0]?.match_format || 'Best of 3'}</div>
            </div>
            <div className="match-list">
              {filterMatchesList(round1).map((match, idx) => (
                <ChallongeMatchCard
                  key={match.id}
                  match={match}
                  seed1={idx === 0 ? 1 : idx === 1 ? 4 : idx === 2 ? 2 : 3}
                  seed2={idx === 0 ? 8 : idx === 1 ? 5 : idx === 2 ? 7 : 6}
                  liveHighlight={liveHighlight}
                  isUpdating={updatingMatchId === match.id}
                  onClick={() => setSelectedMatch(match)}
                  onSelectWinner={handleSelectWinner}
                  onToggleLive={handleToggleLive}
                />
              ))}
              {filterMatchesList(round1).length === 0 && (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textAlign: 'center', padding: '1rem' }}>
                  No matches matching filter
                </div>
              )}
            </div>
          </div>

          {/* Round 2: Semifinals */}
          <div className="bracket-column">
            <div className="round-header-box">
              <div className="round-name">Semifinals</div>
              <div className="round-sub">Final 4 • {round2[0]?.match_format || 'Best of 3'}</div>
            </div>
            <div className="match-list">
              {filterMatchesList(round2).map(match => (
                <ChallongeMatchCard
                  key={match.id}
                  match={match}
                  liveHighlight={liveHighlight}
                  isUpdating={updatingMatchId === match.id}
                  onClick={() => setSelectedMatch(match)}
                  onSelectWinner={handleSelectWinner}
                  onToggleLive={handleToggleLive}
                />
              ))}
              {filterMatchesList(round2).length === 0 && (
                <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textAlign: 'center', padding: '1rem' }}>
                  No matches matching filter
                </div>
              )}
            </div>
          </div>

          {/* Round 3: Grand Finals */}
          <div className="bracket-column">
            <div className="round-header-box" style={{ borderBottomColor: 'var(--accent-amber)' }}>
              <div className="round-name" style={{ color: 'var(--accent-amber)' }}>Grand Finals</div>
              <div className="round-sub">Championship • {grandFinalMatch?.match_format || 'Best of 5'}</div>
            </div>
            <div className="match-list" style={{ justifyContent: 'center' }}>
              {grandFinalMatch && (statusFilter === 'all' || grandFinalMatch.status === statusFilter) ? (
                <ChallongeMatchCard
                  match={grandFinalMatch}
                  isGrandFinal={true}
                  liveHighlight={liveHighlight}
                  isUpdating={updatingMatchId === grandFinalMatch.id}
                  onClick={() => setSelectedMatch(grandFinalMatch)}
                  onSelectWinner={handleSelectWinner}
                  onToggleLive={handleToggleLive}
                />
              ) : (
                <div style={{ color: 'var(--text-muted)', textAlign: 'center', fontSize: '0.85rem' }}>
                  {statusFilter === 'all' ? 'Awaiting Finalists' : 'No matches matching filter'}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Guide Banner */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: '1.5rem',
        padding: '0.85rem 1.25rem',
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '8px',
        fontSize: '0.85rem',
        color: 'var(--text-secondary)'
      }}>
        <div>
          👑 <strong>Direct Winner Buttons:</strong> Click <strong>👑 Win [TAG]</strong> on any match card to designate that team as the winner. That change automatically updates the MySQL database and advances the winner into the next bracket round!
        </div>
      </div>

      {/* Match Score & Result Modal */}
      <MatchScoreModal
        isOpen={!!selectedMatch}
        match={selectedMatch}
        onClose={() => setSelectedMatch(null)}
        onSave={() => {
          if (onMatchesUpdated) onMatchesUpdated();
        }}
      />
    </div>
  );
}

// Challonge Authentic Match Card with Manual Winner Buttons & Live Options
function ChallongeMatchCard({
  match,
  seed1,
  seed2,
  onClick,
  onSelectWinner,
  onToggleLive,
  liveHighlight = true,
  isGrandFinal = false
}) {
  const isTeam1Winner = match.winner_id && match.winner_id === match.team1_id;
  const isTeam2Winner = match.winner_id && match.winner_id === match.team2_id;
  const isCompleted = match.status === 'completed';
  const isLive = match.status === 'live';

  return (
    <div
      className={`challonge-match-card ${isLive && liveHighlight ? 'is-live' : ''}`}
      onClick={onClick}
      style={isGrandFinal ? { border: '2px solid var(--accent-amber)' } : {}}
      title="Click to view details or edit scores"
    >
      {/* Match Top Bar */}
      <div className="match-topbar">
        <span>MATCH #{match.id}</span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          {isLive && (
            <span className="badge badge-live">
              <span className="status-dot status-dot-amber" style={{ width: '5px', height: '5px' }}></span>
              LIVE
            </span>
          )}
          {isCompleted && (
            <span className="badge badge-completed">
              <CheckCircle2 size={10} /> FINAL
            </span>
          )}
          {!isLive && !isCompleted && (
            <span className="badge badge-upcoming">
              <Clock size={10} /> {match.match_format || 'BO3'}
            </span>
          )}
        </div>
      </div>

      {/* Participant Row 1 */}
      <div className={`match-participant-row ${isTeam1Winner ? 'is-winner' : ''} ${isCompleted && !isTeam1Winner ? 'is-loser' : ''}`}>
        <div className="participant-info">
          <span className="seed-num">{seed1 ? `(${seed1})` : ''}</span>
          {match.team1_name ? (
            <TeamCrest name={match.team1_name} tag={match.team1_tag} color={match.team1_color || '#0284c7'} size={20} />
          ) : (
            <div className="team-crest-circle" style={{ background: 'var(--border-subtle)', color: 'var(--text-muted)' }}>?</div>
          )}
          <span className="team-name-text">
            {match.team1_name || 'TBD (Seed/Winner)'}
          </span>
          {isTeam1Winner && <span style={{ color: 'var(--accent-amber)', fontSize: '0.8rem', marginLeft: '4px' }}>👑</span>}
        </div>
        <div className="score-box">
          {match.score1}
        </div>
      </div>

      {/* Participant Row 2 */}
      <div className={`match-participant-row ${isTeam2Winner ? 'is-winner' : ''} ${isCompleted && !isTeam2Winner ? 'is-loser' : ''}`}>
        <div className="participant-info">
          <span className="seed-num">{seed2 ? `(${seed2})` : ''}</span>
          {match.team2_name ? (
            <TeamCrest name={match.team2_name} tag={match.team2_tag} color={match.team2_color || '#7c3aed'} size={20} />
          ) : (
            <div className="team-crest-circle" style={{ background: 'var(--border-subtle)', color: 'var(--text-muted)' }}>?</div>
          )}
          <span className="team-name-text">
            {match.team2_name || 'TBD (Seed/Winner)'}
          </span>
          {isTeam2Winner && <span style={{ color: 'var(--accent-amber)', fontSize: '0.8rem', marginLeft: '4px' }}>👑</span>}
        </div>
        <div className="score-box">
          {match.score2}
        </div>
      </div>

      {/* Manual Winner Buttons & Live Controls */}
      {match.team1_id && match.team2_id && (
        <div className="match-card-actions" onClick={e => e.stopPropagation()}>
          {/* Button: Manually pick Team 1 as Winner */}
          <button
            type="button"
            className={`btn-card-action btn-win ${isTeam1Winner ? 'active' : ''}`}
            onClick={(e) => onSelectWinner(e, match, match.team1_id)}
            title={`Manually declare ${match.team1_name} as the Winner (advances in DBMS)`}
          >
            👑 Win {match.team1_tag || 'T1'}
          </button>

          {/* Button: Set Match Live Toggle */}
          <button
            type="button"
            className={`btn-card-action btn-live ${isLive ? 'is-active' : ''}`}
            onClick={(e) => onToggleLive(e, match)}
            title={isLive ? 'Match is LIVE. Click to pause/set to pending' : 'Set match status to LIVE'}
          >
            {isLive ? '🔴 Live' : 'Set Live'}
          </button>

          {/* Button: Manually pick Team 2 as Winner */}
          <button
            type="button"
            className={`btn-card-action btn-win ${isTeam2Winner ? 'active' : ''}`}
            onClick={(e) => onSelectWinner(e, match, match.team2_id)}
            title={`Manually declare ${match.team2_name} as the Winner (advances in DBMS)`}
          >
            👑 Win {match.team2_tag || 'T2'}
          </button>
        </div>
      )}
    </div>
  );
}
