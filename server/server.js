const express = require('express');
const cors = require('cors');
require('dotenv').config();

const {
  connectToDatabase,
  getStatus,
  executeQuery,
  updateMatchScoreInMemory,
  createTournament,
  createTeam,
  exportTournamentData,
  importTournamentData
} = require('./db/connection');

const SQL_QUERIES = require('./db/queries');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Initialize DB connection
connectToDatabase();

// -------------------------------------------------------------
// 1. Health & Database Status Endpoints
// -------------------------------------------------------------
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'Universal eSports Tournament & Bracket Management API',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/db/status', (req, res) => {
  res.json(getStatus());
});

app.post('/api/db/reconnect', async (req, res) => {
  const success = await connectToDatabase();
  res.json({
    success,
    status: getStatus()
  });
});

// -------------------------------------------------------------
// 2. SQL Queries Documentation & Showcase
// -------------------------------------------------------------
app.get('/api/sql-queries', (req, res) => {
  res.json({
    description: 'Relational MySQL queries utilizing multi-table INNER and LEFT JOINs for the eSports system',
    queries: SQL_QUERIES
  });
});

// -------------------------------------------------------------
// 3. Tournaments Endpoints (JOINs with registrations & matches)
// -------------------------------------------------------------
app.get('/api/tournaments', async (req, res) => {
  try {
    const tournaments = await executeQuery(SQL_QUERIES.GET_TOURNAMENTS.sql);
    res.json({
      success: true,
      queryUsed: 'GET_TOURNAMENTS',
      sql: SQL_QUERIES.GET_TOURNAMENTS.sql.trim(),
      data: tournaments
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/tournaments/:id', async (req, res) => {
  try {
    const tournamentId = req.params.id;
    const rows = await executeQuery(SQL_QUERIES.GET_TOURNAMENT_BY_ID.sql, [tournamentId]);
    if (!rows || rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Tournament not found' });
    }
    res.json({
      success: true,
      queryUsed: 'GET_TOURNAMENT_BY_ID',
      sql: SQL_QUERIES.GET_TOURNAMENT_BY_ID.sql.trim(),
      data: rows[0]
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// 4. Bracket Matches Multi-Table JOIN Endpoint
// -------------------------------------------------------------
app.get('/api/tournaments/:id/bracket', async (req, res) => {
  try {
    const tournamentId = req.params.id;
    const matches = await executeQuery(SQL_QUERIES.GET_BRACKET_MATCHES.sql, [tournamentId]);
    res.json({
      success: true,
      queryUsed: 'GET_BRACKET_MATCHES',
      sql: SQL_QUERIES.GET_BRACKET_MATCHES.sql.trim(),
      tournamentId,
      data: matches
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Tournament registered teams & rosters JOIN
app.get('/api/tournaments/:id/participants', async (req, res) => {
  try {
    const tournamentId = req.params.id;
    const participants = await executeQuery(SQL_QUERIES.GET_TOURNAMENT_PARTICIPANTS.sql, [tournamentId]);
    res.json({
      success: true,
      queryUsed: 'GET_TOURNAMENT_PARTICIPANTS',
      sql: SQL_QUERIES.GET_TOURNAMENT_PARTICIPANTS.sql.trim(),
      data: participants
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// 5. Match Score Update & Bracket Winner Auto-Advancement
// -------------------------------------------------------------
const handleMatchScoreUpdate = async (req, res) => {
  try {
    const matchId = parseInt(req.params.id, 10);
    const { score1, score2, status, winner_id } = req.body;

    const statusObj = getStatus();
    if (statusObj.connectedToMysql) {
      const matchRows = await executeQuery(`SELECT * FROM matches WHERE id = ?`, [matchId]);
      if (!matchRows || matchRows.length === 0) {
        return res.status(404).json({ success: false, message: 'Match not found' });
      }
      const current = matchRows[0];

      const newScore1 = score1 !== undefined ? (parseInt(score1, 10) || 0) : current.score1;
      const newScore2 = score2 !== undefined ? (parseInt(score2, 10) || 0) : current.score2;
      const newStatus = status || current.status;
      let newWinnerId = winner_id !== undefined ? (winner_id ? parseInt(winner_id, 10) : null) : current.winner_id;

      if (newStatus !== 'completed' && winner_id === undefined) {
        newWinnerId = null;
      }

      await executeQuery(
        `UPDATE matches SET score1 = ?, score2 = ?, status = ?, winner_id = ? WHERE id = ?`,
        [newScore1, newScore2, newStatus, newWinnerId, matchId]
      );

      // Bracket Auto-Advancement logic: advance winner if completed, or clear if reverting
      if (current.next_match_id) {
        const isOdd = current.match_order % 2 === 1;
        const targetField = isOdd ? 'team1_id' : 'team2_id';
        const teamToAdvance = newStatus === 'completed' ? newWinnerId : null;
        await executeQuery(`UPDATE matches SET ${targetField} = ? WHERE id = ?`, [teamToAdvance, current.next_match_id]);
      }

      res.json({
        success: true,
        message: 'Match score updated in MySQL and bracket synchronized!',
        match: {
          id: matchId,
          score1: newScore1,
          score2: newScore2,
          status: newStatus,
          winner_id: newWinnerId
        }
      });
    } else {
      const updatedMatch = updateMatchScoreInMemory(matchId, score1, score2, status, winner_id);
      if (!updatedMatch) {
        return res.status(404).json({ success: false, message: 'Match not found' });
      }
      res.json({
        success: true,
        message: 'Match score updated & bracket auto-advancement executed!',
        match: updatedMatch
      });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

app.put('/api/matches/:id/score', handleMatchScoreUpdate);
app.post('/api/matches/:id/score', handleMatchScoreUpdate);


// -------------------------------------------------------------
// 6. Tournament Creation (Universal Games & Custom Games)
// -------------------------------------------------------------
app.post('/api/tournaments', async (req, res) => {
  try {
    const { name, game_title, category, format, match_format, prize_pool, max_teams, start_date, location, team_ids, is_offline_lan } = req.body;
    if (!name || !game_title) {
      return res.status(400).json({ success: false, message: 'Tournament name and game title are required' });
    }

    const created = await createTournament({
      name,
      game_title,
      category: category || 'Custom eSports',
      format: format || 'Single Elimination',
      match_format: match_format || 'BO3',
      prize_pool,
      max_teams,
      start_date,
      location,
      team_ids,
      is_offline_lan: is_offline_lan !== false
    });

    res.status(201).json({
      success: true,
      message: 'Tournament and bracket generated successfully!',
      data: created
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// 7. Offline LAN Tournament Export & Import
// -------------------------------------------------------------
app.get('/api/tournaments/:id/export', async (req, res) => {
  try {
    const bundle = await exportTournamentData(req.params.id);
    if (!bundle) return res.status(404).json({ success: false, message: 'Tournament not found' });
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=tournament_${req.params.id}_backup.json`);
    res.send(JSON.stringify(bundle, null, 2));
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/tournaments/import', async (req, res) => {
  try {
    const imported = await importTournamentData(req.body);
    res.status(201).json({
      success: true,
      message: 'Tournament imported successfully for offline LAN use!',
      data: imported
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// 8. Teams & Rosters (JOIN players)
// -------------------------------------------------------------
app.get('/api/teams', async (req, res) => {
  try {
    const teams = await executeQuery(SQL_QUERIES.GET_TEAMS_WITH_ROSTERS.sql);
    res.json({
      success: true,
      queryUsed: 'GET_TEAMS_WITH_ROSTERS',
      sql: SQL_QUERIES.GET_TEAMS_WITH_ROSTERS.sql.trim(),
      data: teams
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/teams', async (req, res) => {
  try {
    const { name, tag, captain_name, region, primary_color, players } = req.body;
    if (!name || !tag) {
      return res.status(400).json({ success: false, message: 'Team name and tag are required' });
    }

    const created = await createTeam({
      name,
      tag,
      captain_name,
      region,
      primary_color: primary_color || '#00f0ff',
      players
    });

    res.status(201).json({
      success: true,
      message: 'Team registered successfully!',
      data: created
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// 9. Global Standings & Win-rate Leaderboard JOIN
// -------------------------------------------------------------
app.get('/api/leaderboard', async (req, res) => {
  try {
    const leaderboard = await executeQuery(SQL_QUERIES.GET_LEADERBOARD.sql);
    res.json({
      success: true,
      queryUsed: 'GET_LEADERBOARD',
      sql: SQL_QUERIES.GET_LEADERBOARD.sql.trim(),
      data: leaderboard
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`[Universal eSports Arena Server] Running on http://localhost:${PORT}`);
});
