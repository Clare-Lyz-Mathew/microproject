// =====================================================================
// SQL Queries Definition for Universal eSports Tournament & Bracket System
// Multi-Table JOIN queries across: tournaments, teams, players, tournament_teams, matches
// =====================================================================

const SQL_QUERIES = {
  // 1. Get all tournaments with team count and match count using multi-table LEFT JOINs
  GET_TOURNAMENTS: {
    name: 'Tournaments Overview with Aggregated JOINs',
    description: 'LEFT JOIN tournaments with tournament_teams and matches to aggregate registered squads and match progress.',
    sql: `
      SELECT 
        t.id, 
        t.name, 
        t.game_title, 
        t.category,
        t.format, 
        t.match_format,
        t.status, 
        t.prize_pool, 
        t.max_teams, 
        t.start_date, 
        t.end_date, 
        t.location, 
        t.is_offline_lan,
        COUNT(DISTINCT tt.team_id) AS registered_teams_count,
        COUNT(DISTINCT m.id) AS total_matches_count,
        COUNT(DISTINCT CASE WHEN m.status = 'completed' THEN m.id END) AS completed_matches_count
      FROM tournaments t
      LEFT JOIN tournament_teams tt ON t.id = tt.tournament_id
      LEFT JOIN matches m ON t.id = m.tournament_id
      GROUP BY t.id
      ORDER BY t.created_at DESC;
    `
  },

  // 2. Get tournament details by ID with metadata
  GET_TOURNAMENT_BY_ID: {
    name: 'Tournament by ID with Metadata',
    description: 'Retrieve tournament metadata and registered team count.',
    sql: `
      SELECT 
        t.id, 
        t.name, 
        t.game_title, 
        t.category,
        t.format, 
        t.match_format,
        t.status, 
        t.prize_pool, 
        t.max_teams, 
        t.start_date, 
        t.end_date, 
        t.location, 
        t.is_offline_lan,
        COUNT(DISTINCT tt.team_id) AS registered_teams_count
      FROM tournaments t
      LEFT JOIN tournament_teams tt ON t.id = tt.tournament_id
      WHERE t.id = ?
      GROUP BY t.id;
    `
  },

  // 3. Multi-table JOIN: Bracket matches with opposing teams, tags, colors, and winner
  GET_BRACKET_MATCHES: {
    name: 'Interactive Bracket Matches Multi-Team JOIN',
    description: 'JOIN matches with tournaments, team1, team2, and winner team to resolve all team names, tags, colors, and bracket lineage.',
    sql: `
      SELECT 
        m.id,
        m.tournament_id,
        m.round_number,
        m.match_order,
        m.status,
        m.score1,
        m.score2,
        m.scheduled_time,
        m.next_match_id,
        
        -- Team 1 JOIN info
        m.team1_id,
        t1.name AS team1_name,
        t1.tag AS team1_tag,
        t1.primary_color AS team1_color,
        
        -- Team 2 JOIN info
        m.team2_id,
        t2.name AS team2_name,
        t2.tag AS team2_tag,
        t2.primary_color AS team2_color,
        
        -- Winner Team JOIN info
        m.winner_id,
        w.name AS winner_name,
        w.tag AS winner_tag,

        -- Tournament JOIN info
        tr.name AS tournament_name,
        tr.game_title AS game_title,
        tr.match_format AS match_format
      FROM matches m
      JOIN tournaments tr ON m.tournament_id = tr.id
      LEFT JOIN teams t1 ON m.team1_id = t1.id
      LEFT JOIN teams t2 ON m.team2_id = t2.id
      LEFT JOIN teams w ON m.winner_id = w.id
      WHERE m.tournament_id = ?
      ORDER BY m.round_number ASC, m.match_order ASC;
    `
  },

  // 4. Teams Directory with Player Roster JOIN & GROUP_CONCAT
  GET_TEAMS_WITH_ROSTERS: {
    name: 'Teams Directory with Player Roster JOIN',
    description: 'JOIN teams with players table to aggregate player rosters, roles, and squad counts.',
    sql: `
      SELECT 
        t.id, 
        t.name, 
        t.tag, 
        t.captain_name, 
        t.region, 
        t.primary_color,
        COUNT(p.id) AS player_count,
        GROUP_CONCAT(CONCAT(p.nickname, ' [', p.role, ']') ORDER BY p.is_captain DESC, p.id ASC SEPARATOR ', ') AS roster_preview
      FROM teams t
      LEFT JOIN players p ON t.id = p.team_id
      GROUP BY t.id
      ORDER BY t.name ASC;
    `
  },

  // 5. Registered Teams for a specific tournament with Seed info
  GET_TOURNAMENT_PARTICIPANTS: {
    name: 'Tournament Registered Participants JOIN',
    description: 'JOIN tournament_teams with teams and players to display tournament roster & seedings.',
    sql: `
      SELECT 
        tt.id AS registration_id,
        tt.tournament_id,
        tt.seed,
        tt.registered_at,
        t.id AS team_id,
        t.name AS team_name,
        t.tag AS team_tag,
        t.primary_color,
        t.captain_name,
        t.region,
        COUNT(p.id) AS player_count
      FROM tournament_teams tt
      JOIN teams t ON tt.team_id = t.id
      LEFT JOIN players p ON t.id = p.team_id
      WHERE tt.tournament_id = ?
      GROUP BY t.id, tt.seed
      ORDER BY tt.seed ASC;
    `
  },

  // 6. Global Leaderboard & Win-Rate Standings JOIN
  GET_LEADERBOARD: {
    name: 'Universal eSports Global Standings JOIN',
    description: 'Relational aggregation joining teams with tournament participations, match wins, and win-rate computations.',
    sql: `
      SELECT 
        t.id,
        t.name,
        t.tag,
        t.captain_name,
        t.region,
        t.primary_color,
        COUNT(DISTINCT tt.tournament_id) AS tournaments_entered,
        COUNT(DISTINCT CASE WHEN m.team1_id = t.id OR m.team2_id = t.id THEN m.id END) AS total_matches_played,
        COUNT(DISTINCT CASE WHEN m.winner_id = t.id THEN m.id END) AS matches_won,
        ROUND(
          (COUNT(DISTINCT CASE WHEN m.winner_id = t.id THEN m.id END) * 100.0) / 
          NULLIF(COUNT(DISTINCT CASE WHEN m.team1_id = t.id OR m.team2_id = t.id THEN m.id END), 0), 1
        ) AS win_rate_percentage
      FROM teams t
      LEFT JOIN tournament_teams tt ON t.id = tt.team_id
      LEFT JOIN matches m ON (m.team1_id = t.id OR m.team2_id = t.id)
      GROUP BY t.id
      ORDER BY matches_won DESC, win_rate_percentage DESC;
    `
  }
};

module.exports = SQL_QUERIES;
