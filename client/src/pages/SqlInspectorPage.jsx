import React, { useState, useEffect } from 'react';
import { Database, Play, CheckCircle2, Copy, Check, GitMerge, FileCode } from 'lucide-react';

export default function SqlInspectorPage() {
  const [queriesDoc, setQueriesDoc] = useState(null);
  const [selectedKey, setSelectedKey] = useState('GET_BRACKET_MATCHES');
  const [executing, setExecuting] = useState(false);
  const [queryResult, setQueryResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const [dbStatus, setDbStatus] = useState(null);

  // Fetch queries metadata
  useEffect(() => {
    fetch('/api/sql-queries')
      .then(res => res.json())
      .then(data => setQueriesDoc(data.queries))
      .catch(err => console.error(err));

    fetch('/api/db/status')
      .then(res => res.json())
      .then(data => setDbStatus(data))
      .catch(err => console.error(err));
  }, []);

  // Run selected query
  const handleRunQuery = async (queryKey) => {
    setExecuting(true);
    setQueryResult(null);
    const startTime = performance.now();

    try {
      let endpoint = '/api/tournaments/1/bracket';
      if (queryKey === 'GET_TOURNAMENTS') endpoint = '/api/tournaments';
      if (queryKey === 'GET_TEAMS_WITH_ROSTERS') endpoint = '/api/teams';
      if (queryKey === 'GET_TOURNAMENT_PARTICIPANTS') endpoint = '/api/tournaments/1/participants';
      if (queryKey === 'GET_LEADERBOARD') endpoint = '/api/leaderboard';

      const res = await fetch(endpoint);
      const data = await res.json();
      const endTime = performance.now();

      setQueryResult({
        executionTime: Math.round(endTime - startTime),
        rowCount: Array.isArray(data.data) ? data.data.length : 1,
        rows: Array.isArray(data.data) ? data.data : [data.data],
        sql: queriesDoc?.[queryKey]?.sql || data.sql
      });
    } catch (err) {
      setQueryResult({ error: err.message });
    } finally {
      setExecuting(false);
    }
  };

  // Run default query on load
  useEffect(() => {
    if (queriesDoc) {
      handleRunQuery(selectedKey);
    }
  }, [queriesDoc]);

  const currentQuery = queriesDoc?.[selectedKey];

  const handleCopy = () => {
    if (currentQuery?.sql) {
      navigator.clipboard.writeText(currentQuery.sql);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div>
      {/* Title */}
      <div style={{ marginBottom: '2rem' }}>
        <div className="badge badge-amber" style={{ marginBottom: '0.75rem' }}>
          <Database size={14} />
          RELATIONAL DATABASE ARCHITECTURE
        </div>
        <h1 style={{ fontSize: '2.3rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
          MySQL JOINs & Relational Inspector
        </h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: '750px' }}>
          Explore the multi-table INNER and LEFT JOIN queries connecting tournaments, teams, players, seedings, and bracket matches in real-time.
        </p>
      </div>

      {/* Relational Schema Visualizer Card */}
      <div className="card" style={{ padding: '1.75rem', marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <GitMerge size={20} color="var(--primary-cyan)" />
          <h3 className="font-title" style={{ fontSize: '1.2rem', color: 'var(--text-main)' }}>
            Entity Relationship & JOIN Cardinality
          </h3>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '1rem'
        }}>
          {/* Tournaments */}
          <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '1rem' }}>
            <div className="font-tech" style={{ color: 'var(--primary-cyan)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
              TABLE: tournaments
            </div>
            <ul style={{ listStyle: 'none', fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              <li><strong style={{ color: 'var(--text-main)' }}>id</strong> (PK, INT)</li>
              <li>name (VARCHAR)</li>
              <li>game_title (VARCHAR)</li>
              <li>category (VARCHAR)</li>
              <li>format (VARCHAR)</li>
              <li>match_format (VARCHAR)</li>
              <li>status (ENUM)</li>
              <li>prize_pool (DECIMAL)</li>
            </ul>
          </div>

          {/* Tournament_Teams (Junction) */}
          <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '1rem' }}>
            <div className="font-tech" style={{ color: 'var(--primary-amber)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
              TABLE: tournament_teams
            </div>
            <ul style={{ listStyle: 'none', fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              <li><strong style={{ color: 'var(--text-main)' }}>id</strong> (PK, INT)</li>
              <li><span style={{ color: 'var(--primary-cyan)' }}>tournament_id</span> (FK)</li>
              <li><span style={{ color: 'var(--primary-cyan)' }}>team_id</span> (FK)</li>
              <li>seed (INT)</li>
              <li>registered_at (DATETIME)</li>
            </ul>
          </div>

          {/* Teams */}
          <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '1rem' }}>
            <div className="font-tech" style={{ color: 'var(--primary-cyan)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
              TABLE: teams
            </div>
            <ul style={{ listStyle: 'none', fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              <li><strong style={{ color: 'var(--text-main)' }}>id</strong> (PK, INT)</li>
              <li>name (VARCHAR)</li>
              <li>tag (VARCHAR)</li>
              <li>captain_name (VARCHAR)</li>
              <li>region (VARCHAR)</li>
            </ul>
          </div>

          {/* Players */}
          <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '1rem' }}>
            <div className="font-tech" style={{ color: 'var(--primary-purple)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
              TABLE: players
            </div>
            <ul style={{ listStyle: 'none', fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              <li><strong style={{ color: 'var(--text-main)' }}>id</strong> (PK, INT)</li>
              <li><span style={{ color: 'var(--primary-cyan)' }}>team_id</span> (FK)</li>
              <li>nickname (VARCHAR)</li>
              <li>role (VARCHAR)</li>
              <li>rank_tier (VARCHAR)</li>
            </ul>
          </div>

          {/* Matches */}
          <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', padding: '1rem' }}>
            <div className="font-tech" style={{ color: 'var(--primary-accent)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
              TABLE: matches
            </div>
            <ul style={{ listStyle: 'none', fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              <li><strong style={{ color: 'var(--text-main)' }}>id</strong> (PK, INT)</li>
              <li><span style={{ color: 'var(--primary-cyan)' }}>tournament_id</span> (FK)</li>
              <li>round_number (INT)</li>
              <li><span style={{ color: 'var(--primary-cyan)' }}>team1_id, team2_id</span> (FK)</li>
              <li><span style={{ color: 'var(--primary-cyan)' }}>winner_id</span> (FK)</li>
              <li><span style={{ color: 'var(--primary-cyan)' }}>next_match_id</span> (FK)</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Query Selector Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        {queriesDoc && Object.keys(queriesDoc).map(key => (
          <button
            key={key}
            className={`btn btn-sm ${selectedKey === key ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => {
              setSelectedKey(key);
              handleRunQuery(key);
            }}
          >
            <FileCode size={14} />
            <span>{queriesDoc[key].name}</span>
          </button>
        ))}
      </div>

      {/* Active Query Details */}
      {currentQuery && (
        <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '1.3rem', color: 'var(--text-primary)' }}>
                {currentQuery.name}
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: '0.2rem' }}>
                {currentQuery.description}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button className="btn btn-secondary btn-sm" onClick={handleCopy}>
                {copied ? <Check size={14} color="var(--accent-emerald)" /> : <Copy size={14} />}
                <span>{copied ? 'Copied' : 'Copy SQL'}</span>
              </button>

              <button 
                className="btn btn-primary btn-sm" 
                onClick={() => handleRunQuery(selectedKey)} 
                disabled={executing}
              >
                <Play size={14} className={executing ? 'spin' : ''} />
                <span>{executing ? 'Executing...' : 'Run Query'}</span>
              </button>
            </div>
          </div>

          {/* SQL Display */}
          <div style={{ marginBottom: '1.5rem' }}>
            <pre className="sql-box">{currentQuery.sql.trim()}</pre>
          </div>

          {/* Execution Stats Banner */}
          {queryResult && !queryResult.error && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.75rem 1.25rem',
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              marginBottom: '1.5rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#34d399' }}>
                <CheckCircle2 size={16} />
                <span>Query executed successfully against <strong>{dbStatus?.engine || 'Relational Engine'}</strong></span>
              </div>
              <div style={{ color: 'var(--text-muted)' }}>
                Returned <strong>{queryResult.rowCount} rows</strong> in <strong>{queryResult.executionTime} ms</strong>
              </div>
            </div>
          )}

          {/* Tabular Output */}
          {queryResult?.rows && queryResult.rows.length > 0 && (
            <div>
              <h4 className="font-tech" style={{ color: 'var(--t1-gold)', fontSize: '0.9rem', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
                Result Set (First {Math.min(5, queryResult.rows.length)} Records)
              </h4>
              <div className="table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      {Object.keys(queryResult.rows[0]).slice(0, 7).map(col => (
                        <th key={col}>{col}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {queryResult.rows.slice(0, 5).map((row, i) => (
                      <tr key={i}>
                        {Object.keys(row).slice(0, 7).map(col => (
                          <td key={col} style={{ fontSize: '0.85rem' }}>
                            {String(row[col] !== null && row[col] !== undefined ? row[col] : 'NULL')}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
