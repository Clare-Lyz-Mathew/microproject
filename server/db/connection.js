const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// In-Memory Relational Store (Multi-game eSports ecosystem)
let memoryStore = {
  teams: [
    { id: 1, name: 'Team Liquid', tag: 'TL', captain_name: 'nitr0', region: 'North America', primary_color: '#0047b3', created_at: new Date() },
    { id: 2, name: 'FaZe Clan', tag: 'FAZE', captain_name: 'karrigan', region: 'Europe', primary_color: '#e11d48', created_at: new Date() },
    { id: 3, name: 'Natus Vincere', tag: 'NAVI', captain_name: 'Aleksib', region: 'Eastern Europe', primary_color: '#eab308', created_at: new Date() },
    { id: 4, name: 'Sentinels', tag: 'SEN', captain_name: 'johnqt', region: 'Americas', primary_color: '#ef4444', created_at: new Date() },
    { id: 5, name: 'Team Vitality', tag: 'VIT', captain_name: 'apEX', region: 'Europe', primary_color: '#facc15', created_at: new Date() },
    { id: 6, name: 'Cloud9', tag: 'C9', captain_name: 'Boombl4', region: 'North America', primary_color: '#0284c7', created_at: new Date() },
    { id: 7, name: 'Fnatic', tag: 'FNC', captain_name: 'Boaster', region: 'Europe', primary_color: '#ff5900', created_at: new Date() },
    { id: 8, name: 'Team Spirit', tag: 'TS', captain_name: 'chopper', region: 'Global', primary_color: '#10b981', created_at: new Date() },
    { id: 9, name: 'T1', tag: 'T1', captain_name: 'Faker', region: 'South Korea', primary_color: '#e2012d', created_at: new Date() },
    { id: 10, name: 'Gen.G', tag: 'GEN', captain_name: 'Chovy', region: 'South Korea', primary_color: '#aa8a00', created_at: new Date() },
    { id: 11, name: 'Bilibili Gaming', tag: 'BLG', captain_name: 'knight', region: 'China', primary_color: '#00a4db', created_at: new Date() },
    { id: 12, name: 'G2 Esports', tag: 'G2', captain_name: 'Caps', region: 'Europe', primary_color: '#ee1b24', created_at: new Date() },
    { id: 13, name: 'Paper Rex', tag: 'PRX', captain_name: 'f0rsakeN', region: 'Pacific', primary_color: '#df2060', created_at: new Date() },
    { id: 14, name: 'EDward Gaming', tag: 'EDG', captain_name: 'CHICHOO', region: 'China', primary_color: '#1a1a1a', created_at: new Date() },
    { id: 15, name: 'Weibo Gaming', tag: 'WBG', captain_name: 'Xiaohu', region: 'China', primary_color: '#e60012', created_at: new Date() },
    { id: 16, name: 'Top Esports', tag: 'TES', captain_name: 'JackeyLove', region: 'China', primary_color: '#ff0036', created_at: new Date() },
    { id: 17, name: 'Hanwha Life Esports', tag: 'HLE', captain_name: 'Viper', region: 'South Korea', primary_color: '#f37321', created_at: new Date() },
    { id: 18, name: 'FlyQuest', tag: 'FLY', captain_name: 'Bwipo', region: 'North America', primary_color: '#004733', created_at: new Date() }
  ],
  players: [
    // Team Liquid
    { id: 1, team_id: 1, nickname: 'nitr0', full_name: 'Nicholas Cannella', role: 'In-Game Leader / Captain', rank_tier: 'Global Elite', is_captain: true },
    { id: 2, team_id: 1, nickname: 'Twistzz', full_name: 'Russel Van Dulken', role: 'Rifler / Entry', rank_tier: 'Global Elite', is_captain: false },
    { id: 3, team_id: 1, nickname: 'NAF', full_name: 'Keith Markovic', role: 'Lurker / Anchor', rank_tier: 'Global Elite', is_captain: false },
    { id: 4, team_id: 1, nickname: 'ultimate', full_name: 'Roland Tomkowiak', role: 'AWPer / Sniper', rank_tier: 'Global Elite', is_captain: false },
    { id: 5, team_id: 1, nickname: 'jks', full_name: 'Justin Savage', role: 'Support / Anchor', rank_tier: 'Global Elite', is_captain: false },
    // FaZe Clan
    { id: 6, team_id: 2, nickname: 'karrigan', full_name: 'Finn Andersen', role: 'Mastermind IGL', rank_tier: 'Pro Elite', is_captain: true },
    { id: 7, team_id: 2, nickname: 'rain', full_name: 'Håvard Nygaard', role: 'Entry Fragger', rank_tier: 'Pro Elite', is_captain: false },
    { id: 8, team_id: 2, nickname: 'broky', full_name: 'Helvijs Saukants', role: 'Primary Sniper', rank_tier: 'Pro Elite', is_captain: false },
    { id: 9, team_id: 2, nickname: 'frozen', full_name: 'David Čerňanský', role: 'Rifler', rank_tier: 'Pro Elite', is_captain: false },
    { id: 10, team_id: 2, nickname: 'ropz', full_name: 'Robin Kool', role: 'Lurker / Closer', rank_tier: 'Pro Elite', is_captain: false },
    // NAVI
    { id: 11, team_id: 3, nickname: 'Aleksib', full_name: 'Aleksi Virolainen', role: 'IGL / Tactician', rank_tier: 'Pro Elite', is_captain: true },
    { id: 12, team_id: 3, nickname: 'b1t', full_name: 'Valerij Vakhovsjkyj', role: 'Headshot Machine', rank_tier: 'Pro Elite', is_captain: false },
    { id: 13, team_id: 3, nickname: 'jL', full_name: 'Justinas Lekavicius', role: 'Entry / Playmaker', rank_tier: 'Pro Elite', is_captain: false },
    // Sentinels
    { id: 14, team_id: 4, nickname: 'johnqt', full_name: 'Amine Ouarid', role: 'IGL / Sentinel', rank_tier: 'Radiant', is_captain: true },
    { id: 15, team_id: 4, nickname: 'TenZ', full_name: 'Tyson Ngo', role: 'Duelist / Flex', rank_tier: 'Radiant', is_captain: false },
    { id: 16, team_id: 4, nickname: 'zekken', full_name: 'Zachary Patrone', role: 'Duelist / Entry', rank_tier: 'Radiant', is_captain: false },
    // Vitality
    { id: 17, team_id: 5, nickname: 'apEX', full_name: 'Dan Madesclaire', role: 'Captain / IGL', rank_tier: 'Pro Elite', is_captain: true },
    { id: 18, team_id: 5, nickname: 'ZywOo', full_name: 'Mathieu Herbaut', role: 'Superstar Sniper', rank_tier: 'Pro Elite #1', is_captain: false },
    // Cloud9
    { id: 19, team_id: 6, nickname: 'Boombl4', full_name: 'Kirill Mikhailov', role: 'IGL / Captain', rank_tier: 'Pro Elite', is_captain: true },
    // Fnatic
    { id: 20, team_id: 7, nickname: 'Boaster', full_name: 'Jake Howlett', role: 'IGL / Strategist', rank_tier: 'Radiant', is_captain: true },
    // Team Spirit
    { id: 21, team_id: 8, nickname: 'chopper', full_name: 'Leonid Vishnyakov', role: 'IGL / Captain', rank_tier: 'Pro Elite', is_captain: true },
    { id: 22, team_id: 8, nickname: 'donk', full_name: 'Danil Kryshkovets', role: 'Phenom Rifler', rank_tier: 'Pro Elite MVP', is_captain: false }
  ],
  tournaments: [
    {
      id: 1,
      name: 'IEM Cologne 2026: Cathedral of Counter-Strike',
      game_title: 'Counter-Strike 2',
      category: 'Tactical Shooter',
      format: 'Single Elimination',
      match_format: 'BO3',
      status: 'active',
      prize_pool: 1250000.00,
      max_teams: 8,
      start_date: '2026-10-18',
      end_date: '2026-10-26',
      location: 'LANXESS Arena, Cologne',
      is_offline_lan: false,
      created_at: new Date('2026-10-01')
    },
    {
      id: 2,
      name: 'VCT Masters: Pacific Showdown',
      game_title: 'Valorant',
      category: 'Tactical Shooter',
      format: 'Single Elimination',
      match_format: 'BO3',
      status: 'upcoming',
      prize_pool: 850000.00,
      max_teams: 8,
      start_date: '2026-11-05',
      end_date: '2026-11-15',
      location: 'Makuhari Messe, Tokyo',
      is_offline_lan: false,
      created_at: new Date('2026-10-05')
    },
    {
      id: 3,
      name: 'RLCS World Championship 2026',
      game_title: 'Rocket League',
      category: 'Vehicular Soccer',
      format: 'Single Elimination',
      match_format: 'BO5',
      status: 'completed',
      prize_pool: 1000000.00,
      max_teams: 8,
      start_date: '2026-08-10',
      end_date: '2026-08-18',
      location: 'Dickies Arena, Texas',
      is_offline_lan: false,
      created_at: new Date('2026-07-20')
    },
    {
      id: 4,
      name: 'Apex Legends Global Series (ALGS) Championship',
      game_title: 'Apex Legends',
      category: 'Battle Royale',
      format: 'Single Elimination',
      match_format: 'BO3',
      status: 'upcoming',
      prize_pool: 500000.00,
      max_teams: 8,
      start_date: '2026-12-01',
      end_date: '2026-12-10',
      location: 'ExCeL London',
      is_offline_lan: false,
      created_at: new Date('2026-09-15')
    }
  ],
  tournament_teams: [
    { id: 1, tournament_id: 1, team_id: 1, seed: 1, registered_at: '2026-10-10' },
    { id: 2, tournament_id: 1, team_id: 8, seed: 8, registered_at: '2026-10-10' },
    { id: 3, tournament_id: 1, team_id: 2, seed: 2, registered_at: '2026-10-10' },
    { id: 4, tournament_id: 1, team_id: 7, seed: 7, registered_at: '2026-10-10' },
    { id: 5, tournament_id: 1, team_id: 3, seed: 3, registered_at: '2026-10-10' },
    { id: 6, tournament_id: 1, team_id: 6, seed: 6, registered_at: '2026-10-10' },
    { id: 7, tournament_id: 1, team_id: 4, seed: 4, registered_at: '2026-10-10' },
    { id: 8, tournament_id: 1, team_id: 5, seed: 5, registered_at: '2026-10-10' },
    { id: 9, tournament_id: 2, team_id: 4, seed: 1, registered_at: '2026-10-12' },
    { id: 10, tournament_id: 2, team_id: 7, seed: 2, registered_at: '2026-10-12' }
  ],
  matches: [
    // Grand Finals (Match 7)
    { id: 7, tournament_id: 1, round_number: 3, match_order: 1, team1_id: null, team2_id: null, score1: 0, score2: 0, winner_id: null, status: 'pending', scheduled_time: '2026-10-26 19:00:00', next_match_id: null },
    // Semifinals (Matches 5, 6)
    { id: 5, tournament_id: 1, round_number: 2, match_order: 1, team1_id: 1, team2_id: 4, score1: 0, score2: 0, winner_id: null, status: 'pending', scheduled_time: '2026-10-24 16:00:00', next_match_id: 7 },
    { id: 6, tournament_id: 1, round_number: 2, match_order: 2, team1_id: null, team2_id: null, score1: 0, score2: 0, winner_id: null, status: 'pending', scheduled_time: '2026-10-24 20:00:00', next_match_id: 7 },
    // Quarterfinals (Matches 1, 2, 3, 4)
    { id: 1, tournament_id: 1, round_number: 1, match_order: 1, team1_id: 1, team2_id: 8, score1: 2, score2: 1, winner_id: 1, status: 'completed', scheduled_time: '2026-10-18 14:00:00', next_match_id: 5 },
    { id: 2, tournament_id: 1, round_number: 1, match_order: 2, team1_id: 4, team2_id: 5, score1: 2, score2: 0, winner_id: 4, status: 'completed', scheduled_time: '2026-10-18 18:00:00', next_match_id: 5 },
    { id: 3, tournament_id: 1, round_number: 1, match_order: 3, team1_id: 2, team2_id: 7, score1: 1, score2: 1, winner_id: null, status: 'live', scheduled_time: '2026-10-19 14:00:00', next_match_id: 6 },
    { id: 4, tournament_id: 1, round_number: 1, match_order: 4, team1_id: 3, team2_id: 6, score1: 0, score2: 0, winner_id: null, status: 'pending', scheduled_time: '2026-10-19 18:00:00', next_match_id: 6 }
  ]
};

let pool = null;
let isConnectedToMysql = false;
let dbError = null;

const dbConfig = {
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'esports_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Attempt MySQL connection
async function connectToDatabase() {
  try {
    const testPool = mysql.createPool(dbConfig);
    const conn = await testPool.getConnection();
    await conn.ping();
    conn.release();
    pool = testPool;
    isConnectedToMysql = true;
    dbError = null;
    console.log(`[Database] Successfully connected to MySQL at ${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`);
    return true;
  } catch (err) {
    if (err.code === 'ER_BAD_DB_ERROR') {
      console.log(`[Database] Database '${dbConfig.database}' does not exist. Initializing...`);
      try {
        const initDb = require('../scripts/initDb');
        const initialized = await initDb();
        if (initialized) {
          const testPool = mysql.createPool(dbConfig);
          const conn = await testPool.getConnection();
          await conn.ping();
          conn.release();
          pool = testPool;
          isConnectedToMysql = true;
          dbError = null;
          console.log(`[Database] Successfully connected to MySQL at ${dbConfig.host}:${dbConfig.port}/${dbConfig.database}`);
          return true;
        }
      } catch (initErr) {
        console.error('[Database Init Error]', initErr.message);
      }
    }
    isConnectedToMysql = false;
    dbError = err.message;
    console.warn(`[Database] MySQL is offline (${err.message}). Using In-Memory Relational Engine.`);
    return false;
  }
}

// Get DB status for the UI
function getStatus() {
  return {
    connectedToMysql: isConnectedToMysql,
    engine: isConnectedToMysql ? 'MySQL 8.x (Live Production DB)' : 'In-Memory Relational Engine',
    config: {
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      database: dbConfig.database
    },
    error: dbError
  };
}

// Relational Query Dispatcher
async function executeQuery(sqlQueryString, params = []) {
  if (isConnectedToMysql && pool) {
    try {
      const [rows] = await pool.query(sqlQueryString, params);
      return rows;
    } catch (err) {
      console.error('[MySQL Error]', err.message);
      throw err;
    }
  }

  // Fallback relational logic matching the exact SQL JOIN operations
  return executeMemoryRelationalQuery(sqlQueryString, params);
}

// Memory engine implementing the exact JOIN queries
function executeMemoryRelationalQuery(sql, params) {
  const normalizedSql = sql.trim().toLowerCase();

  // 1. Tournaments overview with LEFT JOIN tournament_teams and matches
  if (normalizedSql.includes('from tournaments t') && normalizedSql.includes('left join tournament_teams tt')) {
    if (normalizedSql.includes('where t.id = ?')) {
      const tournamentId = parseInt(params[0], 10);
      const t = memoryStore.tournaments.find(item => item.id === tournamentId);
      if (!t) return [];
      const regCount = memoryStore.tournament_teams.filter(tt => tt.tournament_id === t.id).length;
      return [{
        ...t,
        registered_teams_count: regCount
      }];
    }

    return memoryStore.tournaments.map(t => {
      const regCount = memoryStore.tournament_teams.filter(tt => tt.tournament_id === t.id).length;
      const tMatches = memoryStore.matches.filter(m => m.tournament_id === t.id);
      const completedCount = tMatches.filter(m => m.status === 'completed').length;
      return {
        ...t,
        registered_teams_count: regCount,
        total_matches_count: tMatches.length,
        completed_matches_count: completedCount
      };
    });
  }

  // 2. Bracket Matches Multi-Table JOIN
  if (normalizedSql.includes('from matches m') && normalizedSql.includes('join tournaments tr')) {
    const tournamentId = parseInt(params[0], 10);
    const tournament = memoryStore.tournaments.find(t => t.id === tournamentId) || {};
    const filteredMatches = memoryStore.matches.filter(m => m.tournament_id === tournamentId);

    return filteredMatches.map(m => {
      const team1 = memoryStore.teams.find(t => t.id === m.team1_id) || {};
      const team2 = memoryStore.teams.find(t => t.id === m.team2_id) || {};
      const winner = memoryStore.teams.find(t => t.id === m.winner_id) || {};

      return {
        id: m.id,
        tournament_id: m.tournament_id,
        round_number: m.round_number,
        match_order: m.match_order,
        status: m.status,
        score1: m.score1,
        score2: m.score2,
        scheduled_time: m.scheduled_time,
        next_match_id: m.next_match_id,

        team1_id: m.team1_id,
        team1_name: team1.name || null,
        team1_tag: team1.tag || null,
        team1_color: team1.primary_color || '#00f0ff',

        team2_id: m.team2_id,
        team2_name: team2.name || null,
        team2_tag: team2.tag || null,
        team2_color: team2.primary_color || '#a855f7',

        winner_id: m.winner_id,
        winner_name: winner.name || null,
        winner_tag: winner.tag || null,

        tournament_name: tournament.name || 'Tournament',
        game_title: tournament.game_title || 'eSports Title',
        match_format: tournament.match_format || 'BO3'
      };
    }).sort((a, b) => a.round_number - b.round_number || a.match_order - b.match_order);
  }

  // 3. Teams with Player Roster JOIN (LEFT JOIN players p ON t.id = p.team_id)
  if (normalizedSql.includes('from teams t') && normalizedSql.includes('left join players p')) {
    return memoryStore.teams.map(t => {
      const teamPlayers = memoryStore.players.filter(p => p.team_id === t.id);
      const rosterPreview = teamPlayers.map(p => `${p.nickname} [${p.role}]`).join(', ');
      return {
        ...t,
        player_count: teamPlayers.length,
        roster_preview: rosterPreview
      };
    });
  }

  // 4. Tournament Participants JOIN (tournament_teams tt JOIN teams t LEFT JOIN players p)
  if (normalizedSql.includes('from tournament_teams tt') && normalizedSql.includes('join teams t')) {
    const tournamentId = parseInt(params[0], 10);
    const registrations = memoryStore.tournament_teams.filter(tt => tt.tournament_id === tournamentId);
    return registrations.map(tt => {
      const team = memoryStore.teams.find(t => t.id === tt.team_id) || {};
      const teamPlayers = memoryStore.players.filter(p => p.team_id === team.id);
      return {
        registration_id: tt.id,
        tournament_id: tt.tournament_id,
        seed: tt.seed,
        registered_at: tt.registered_at,
        team_id: team.id,
        team_name: team.name,
        team_tag: team.tag,
        primary_color: team.primary_color,
        captain_name: team.captain_name,
        region: team.region,
        player_count: teamPlayers.length
      };
    }).sort((a, b) => a.seed - b.seed);
  }

  // 5. Global Leaderboard JOIN
  if (normalizedSql.includes('win_rate_percentage') || normalizedSql.includes('total_matches_played')) {
    return memoryStore.teams.map(t => {
      const tourneys = new Set(memoryStore.tournament_teams.filter(tt => tt.team_id === t.id).map(tt => tt.tournament_id));
      const teamMatches = memoryStore.matches.filter(m => m.team1_id === t.id || m.team2_id === t.id);
      const wonMatches = memoryStore.matches.filter(m => m.winner_id === t.id);
      const winRate = teamMatches.length > 0 ? ((wonMatches.length / teamMatches.length) * 100).toFixed(1) : 0;

      return {
        id: t.id,
        name: t.name,
        tag: t.tag,
        captain_name: t.captain_name,
        region: t.region,
        primary_color: t.primary_color,
        tournaments_entered: tourneys.size,
        total_matches_played: teamMatches.length,
        matches_won: wonMatches.length,
        win_rate_percentage: parseFloat(winRate)
      };
    }).sort((a, b) => b.matches_won - a.matches_won || b.win_rate_percentage - a.win_rate_percentage);
  }

  return [];
}

// Memory Mutation Helpers
function updateMatchScoreInMemory(matchId, score1, score2, status, winnerId) {
  const match = memoryStore.matches.find(m => m.id === parseInt(matchId, 10));
  if (!match) return null;

  match.score1 = score1 !== undefined ? (parseInt(score1, 10) || 0) : match.score1;
  match.score2 = score2 !== undefined ? (parseInt(score2, 10) || 0) : match.score2;
  match.status = status || match.status;
  match.winner_id = winnerId !== undefined ? (winnerId ? parseInt(winnerId, 10) : null) : (match.status === 'completed' ? match.winner_id : null);

  // Bracket Auto-Advancement logic
  if (match.next_match_id) {
    const nextMatch = memoryStore.matches.find(m => m.id === match.next_match_id);
    if (nextMatch) {
      const advancedWinner = match.status === 'completed' ? match.winner_id : null;
      if (match.match_order % 2 === 1) {
        nextMatch.team1_id = advancedWinner;
      } else {
        nextMatch.team2_id = advancedWinner;
      }
    }
  }

  return match;
}

function createTournamentInMemory(data) {
  const newId = memoryStore.tournaments.length > 0 ? Math.max(...memoryStore.tournaments.map(t => t.id)) + 1 : 1;
  const newTournament = {
    id: newId,
    name: data.name,
    game_title: data.game_title || 'Custom eSports Title',
    category: data.category || 'General eSports',
    format: data.format || 'Single Elimination',
    match_format: data.match_format || 'BO3',
    status: 'upcoming',
    prize_pool: parseFloat(data.prize_pool) || 50000,
    max_teams: parseInt(data.max_teams) || 8,
    start_date: data.start_date || new Date().toISOString().split('T')[0],
    end_date: data.end_date || null,
    location: data.location || 'Local LAN Arena',
    is_offline_lan: data.is_offline_lan !== false,
    created_at: new Date()
  };
  memoryStore.tournaments.unshift(newTournament);

  // Register teams
  const teamIds = data.team_ids && Array.isArray(data.team_ids) ? data.team_ids : [1, 2, 3, 4, 5, 6, 7, 8];
  
  teamIds.forEach((tId, idx) => {
    memoryStore.tournament_teams.push({
      id: memoryStore.tournament_teams.length + 1,
      tournament_id: newId,
      team_id: parseInt(tId, 10),
      seed: idx + 1,
      registered_at: new Date()
    });
  });

  // Generate Matches for 8-team bracket
  const baseMatchId = memoryStore.matches.length > 0 ? Math.max(...memoryStore.matches.map(m => m.id)) + 1 : 100;
  
  // Finals (Round 3)
  const finalsMatch = {
    id: baseMatchId + 6,
    tournament_id: newId,
    round_number: 3,
    match_order: 1,
    team1_id: null,
    team2_id: null,
    score1: 0,
    score2: 0,
    winner_id: null,
    status: 'pending',
    scheduled_time: new Date(Date.now() + 86400000 * 7),
    next_match_id: null
  };

  // Semifinals (Round 2)
  const sf1 = {
    id: baseMatchId + 4,
    tournament_id: newId,
    round_number: 2,
    match_order: 1,
    team1_id: null,
    team2_id: null,
    score1: 0,
    score2: 0,
    winner_id: null,
    status: 'pending',
    scheduled_time: new Date(Date.now() + 86400000 * 4),
    next_match_id: finalsMatch.id
  };

  const sf2 = {
    id: baseMatchId + 5,
    tournament_id: newId,
    round_number: 2,
    match_order: 2,
    team1_id: null,
    team2_id: null,
    score1: 0,
    score2: 0,
    winner_id: null,
    status: 'pending',
    scheduled_time: new Date(Date.now() + 86400000 * 5),
    next_match_id: finalsMatch.id
  };

  // Quarterfinals (Round 1)
  const qf1 = { id: baseMatchId, tournament_id: newId, round_number: 1, match_order: 1, team1_id: teamIds[0] || 1, team2_id: teamIds[7] || 8, score1: 0, score2: 0, winner_id: null, status: 'pending', scheduled_time: new Date(Date.now() + 86400000), next_match_id: sf1.id };
  const qf2 = { id: baseMatchId + 1, tournament_id: newId, round_number: 1, match_order: 2, team1_id: teamIds[3] || 4, team2_id: teamIds[4] || 5, score1: 0, score2: 0, winner_id: null, status: 'pending', scheduled_time: new Date(Date.now() + 86400000), next_match_id: sf1.id };
  const qf3 = { id: baseMatchId + 2, tournament_id: newId, round_number: 1, match_order: 3, team1_id: teamIds[1] || 2, team2_id: teamIds[6] || 7, score1: 0, score2: 0, winner_id: null, status: 'pending', scheduled_time: new Date(Date.now() + 86400000 * 2), next_match_id: sf2.id };
  const qf4 = { id: baseMatchId + 3, tournament_id: newId, round_number: 1, match_order: 4, team1_id: teamIds[2] || 3, team2_id: teamIds[5] || 6, score1: 0, score2: 0, winner_id: null, status: 'pending', scheduled_time: new Date(Date.now() + 86400000 * 2), next_match_id: sf2.id };

  memoryStore.matches.push(finalsMatch, sf1, sf2, qf1, qf2, qf3, qf4);
  return newTournament;
}

function createTeamInMemory(data) {
  const newId = memoryStore.teams.length > 0 ? Math.max(...memoryStore.teams.map(t => t.id)) + 1 : 1;
  const newTeam = {
    id: newId,
    name: data.name,
    tag: data.tag.toUpperCase(),
    captain_name: data.captain_name || 'Captain',
    region: data.region || 'Global',
    primary_color: data.primary_color || '#00f0ff',
    created_at: new Date()
  };
  memoryStore.teams.push(newTeam);

  if (data.players && Array.isArray(data.players)) {
    data.players.forEach((p, idx) => {
      memoryStore.players.push({
        id: memoryStore.players.length + 1,
        team_id: newId,
        nickname: p.nickname || `Player_${idx + 1}`,
        full_name: p.full_name || '',
        role: p.role || 'Pro Player',
        rank_tier: p.rank_tier || 'Pro Elite',
        is_captain: idx === 0
      });
    });
  }

  return newTeam;
}

// Unified tournament creation (MySQL with in-memory fallback)
async function createTournament(data) {
  if (isConnectedToMysql && pool) {
    try {
      const [tRes] = await pool.query(
        `INSERT INTO tournaments (name, game_title, category, format, match_format, status, prize_pool, max_teams, start_date, end_date, location, is_offline_lan)
         VALUES (?, ?, ?, ?, ?, 'upcoming', ?, ?, ?, ?, ?, ?)`,
        [
          data.name,
          data.game_title || 'Custom eSports Title',
          data.category || 'General eSports',
          data.format || 'Single Elimination',
          data.match_format || 'BO3',
          parseFloat(data.prize_pool) || 50000,
          parseInt(data.max_teams, 10) || 8,
          data.start_date || new Date().toISOString().split('T')[0],
          data.end_date || null,
          data.location || 'Local LAN Arena',
          data.is_offline_lan !== false
        ]
      );
      const newId = tRes.insertId;
      const teamIds = data.team_ids && Array.isArray(data.team_ids) ? data.team_ids : [1, 2, 3, 4, 5, 6, 7, 8];

      // Register teams
      for (let idx = 0; idx < teamIds.length; idx++) {
        await pool.query(
          `INSERT INTO tournament_teams (tournament_id, team_id, seed) VALUES (?, ?, ?)`,
          [newId, parseInt(teamIds[idx], 10), idx + 1]
        );
      }

      // Finals (Round 3)
      const [finalsRes] = await pool.query(
        `INSERT INTO matches (tournament_id, round_number, match_order, team1_id, team2_id, score1, score2, winner_id, status, scheduled_time, next_match_id)
         VALUES (?, 3, 1, NULL, NULL, 0, 0, NULL, 'pending', ?, NULL)`,
        [newId, new Date(Date.now() + 86400000 * 7)]
      );
      const finalsMatchId = finalsRes.insertId;

      // Semifinals (Round 2)
      const [sf1Res] = await pool.query(
        `INSERT INTO matches (tournament_id, round_number, match_order, team1_id, team2_id, score1, score2, winner_id, status, scheduled_time, next_match_id)
         VALUES (?, 2, 1, NULL, NULL, 0, 0, NULL, 'pending', ?, ?)`,
        [newId, new Date(Date.now() + 86400000 * 4), finalsMatchId]
      );
      const sf1MatchId = sf1Res.insertId;

      const [sf2Res] = await pool.query(
        `INSERT INTO matches (tournament_id, round_number, match_order, team1_id, team2_id, score1, score2, winner_id, status, scheduled_time, next_match_id)
         VALUES (?, 2, 2, NULL, NULL, 0, 0, NULL, 'pending', ?, ?)`,
        [newId, new Date(Date.now() + 86400000 * 5), finalsMatchId]
      );
      const sf2MatchId = sf2Res.insertId;

      // Quarterfinals (Round 1)
      await pool.query(
        `INSERT INTO matches (tournament_id, round_number, match_order, team1_id, team2_id, score1, score2, winner_id, status, scheduled_time, next_match_id)
         VALUES (?, 1, 1, ?, ?, 0, 0, NULL, 'pending', ?, ?)`,
        [newId, teamIds[0] || null, teamIds[7] || null, new Date(Date.now() + 86400000), sf1MatchId]
      );
      await pool.query(
        `INSERT INTO matches (tournament_id, round_number, match_order, team1_id, team2_id, score1, score2, winner_id, status, scheduled_time, next_match_id)
         VALUES (?, 1, 2, ?, ?, 0, 0, NULL, 'pending', ?, ?)`,
        [newId, teamIds[3] || null, teamIds[4] || null, new Date(Date.now() + 86400000), sf1MatchId]
      );
      await pool.query(
        `INSERT INTO matches (tournament_id, round_number, match_order, team1_id, team2_id, score1, score2, winner_id, status, scheduled_time, next_match_id)
         VALUES (?, 1, 3, ?, ?, 0, 0, NULL, 'pending', ?, ?)`,
        [newId, teamIds[1] || null, teamIds[6] || null, new Date(Date.now() + 86400000 * 2), sf2MatchId]
      );
      await pool.query(
        `INSERT INTO matches (tournament_id, round_number, match_order, team1_id, team2_id, score1, score2, winner_id, status, scheduled_time, next_match_id)
         VALUES (?, 1, 4, ?, ?, 0, 0, NULL, 'pending', ?, ?)`,
        [newId, teamIds[2] || null, teamIds[5] || null, new Date(Date.now() + 86400000 * 2), sf2MatchId]
      );

      return { id: newId, ...data };
    } catch (err) {
      console.error('[MySQL Tournament Create Error]', err);
      throw err;
    }
  }

  return createTournamentInMemory(data);
}

// Unified team creation (MySQL with in-memory fallback)
async function createTeam(data) {
  if (isConnectedToMysql && pool) {
    try {
      const [tRes] = await pool.query(
        `INSERT INTO teams (name, tag, captain_name, region, primary_color) VALUES (?, ?, ?, ?, ?)`,
        [data.name, data.tag.toUpperCase(), data.captain_name || 'Captain', data.region || 'Global', data.primary_color || '#00f0ff']
      );
      const newId = tRes.insertId;

      if (data.players && Array.isArray(data.players)) {
        for (let idx = 0; idx < data.players.length; idx++) {
          const p = data.players[idx];
          await pool.query(
            `INSERT INTO players (team_id, nickname, full_name, role, rank_tier, is_captain) VALUES (?, ?, ?, ?, ?, ?)`,
            [newId, p.nickname || `Player_${idx + 1}`, p.full_name || '', p.role || 'Pro Player', p.rank_tier || 'Pro Elite', idx === 0]
          );
        }
      }

      return { id: newId, ...data, tag: data.tag.toUpperCase() };
    } catch (err) {
      console.error('[MySQL Team Create Error]', err);
      throw err;
    }
  }

  return createTeamInMemory(data);
}

// Offline Export/Import helpers for LAN Organizers
async function exportTournamentData(tournamentId) {
  const tId = parseInt(tournamentId, 10);
  if (isConnectedToMysql && pool) {
    try {
      const [tRows] = await pool.query('SELECT * FROM tournaments WHERE id = ?', [tId]);
      if (!tRows || tRows.length === 0) return null;
      const tournament = tRows[0];
      const [matches] = await pool.query('SELECT * FROM matches WHERE tournament_id = ? ORDER BY round_number ASC, match_order ASC', [tId]);
      const [registrations] = await pool.query('SELECT * FROM tournament_teams WHERE tournament_id = ? ORDER BY seed ASC', [tId]);
      const teamIds = registrations.map(r => r.team_id);
      let teams = [];
      let players = [];
      if (teamIds.length > 0) {
        const [teamsData] = await pool.query('SELECT * FROM teams WHERE id IN (?)', [teamIds]);
        teams = teamsData;
        const [playersData] = await pool.query('SELECT * FROM players WHERE team_id IN (?)', [teamIds]);
        players = playersData;
      }
      return {
        version: '1.0',
        exported_at: new Date().toISOString(),
        engine: 'MySQL 8.x Live Database',
        tournament,
        matches,
        registrations,
        teams,
        players
      };
    } catch (err) {
      console.error('[MySQL Export Error]', err);
      throw err;
    }
  }

  const tournament = memoryStore.tournaments.find(t => t.id === tId);
  if (!tournament) return null;

  const matches = memoryStore.matches.filter(m => m.tournament_id === tId);
  const registrations = memoryStore.tournament_teams.filter(tt => tt.tournament_id === tId);
  const teamIds = registrations.map(r => r.team_id);
  const teams = memoryStore.teams.filter(t => teamIds.includes(t.id));
  const players = memoryStore.players.filter(p => teamIds.includes(p.team_id));

  return {
    version: '1.0',
    exported_at: new Date().toISOString(),
    engine: 'In-Memory Relational Engine',
    tournament,
    matches,
    registrations,
    teams,
    players
  };
}

async function importTournamentData(jsonData) {
  if (!jsonData.tournament || !jsonData.matches) {
    throw new Error('Invalid tournament package structure');
  }

  if (isConnectedToMysql && pool) {
    try {
      const t = jsonData.tournament;
      const [tRes] = await pool.query(
        `INSERT INTO tournaments (name, game_title, category, format, match_format, status, prize_pool, max_teams, start_date, end_date, location, is_offline_lan)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          `${t.name} (Imported LAN)`,
          t.game_title,
          t.category || 'General eSports',
          t.format || 'Single Elimination',
          t.match_format || 'BO3',
          t.status || 'upcoming',
          t.prize_pool || 0,
          t.max_teams || 8,
          t.start_date ? new Date(t.start_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          t.end_date ? new Date(t.end_date).toISOString().split('T')[0] : null,
          t.location || 'Local LAN Arena',
          true
        ]
      );
      const newTourneyId = tRes.insertId;

      if (Array.isArray(jsonData.teams)) {
        for (const tm of jsonData.teams) {
          await pool.query(
            `INSERT IGNORE INTO teams (id, name, tag, captain_name, region, primary_color) VALUES (?, ?, ?, ?, ?, ?)`,
            [tm.id, tm.name, tm.tag, tm.captain_name || 'Captain', tm.region || 'Global', tm.primary_color || '#00f0ff']
          );
        }
      }

      if (Array.isArray(jsonData.registrations)) {
        for (const reg of jsonData.registrations) {
          await pool.query(
            `INSERT IGNORE INTO tournament_teams (tournament_id, team_id, seed) VALUES (?, ?, ?)`,
            [newTourneyId, reg.team_id, reg.seed]
          );
        }
      }

      if (Array.isArray(jsonData.matches)) {
        for (const m of jsonData.matches) {
          await pool.query(
            `INSERT INTO matches (tournament_id, round_number, match_order, team1_id, team2_id, score1, score2, winner_id, status, scheduled_time, next_match_id)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [newTourneyId, m.round_number, m.match_order, m.team1_id || null, m.team2_id || null, m.score1 || 0, m.score2 || 0, m.winner_id || null, m.status || 'pending', m.scheduled_time || null, null]
          );
        }
      }

      return { id: newTourneyId, ...t, name: `${t.name} (Imported LAN)` };
    } catch (err) {
      console.error('[MySQL Import Error]', err);
      throw err;
    }
  }

  // Import tournament into memory
  const newTourneyId = memoryStore.tournaments.length > 0 ? Math.max(...memoryStore.tournaments.map(t => t.id)) + 1 : 1;
  const importedTourney = {
    ...jsonData.tournament,
    id: newTourneyId,
    name: `${jsonData.tournament.name} (Imported LAN)`
  };
  memoryStore.tournaments.unshift(importedTourney);

  if (Array.isArray(jsonData.teams)) {
    jsonData.teams.forEach(t => {
      if (!memoryStore.teams.find(existing => existing.id === t.id || existing.name === t.name)) {
        memoryStore.teams.push(t);
      }
    });
  }

  if (Array.isArray(jsonData.matches)) {
    const baseMatchId = memoryStore.matches.length > 0 ? Math.max(...memoryStore.matches.map(m => m.id)) + 1 : 200;
    jsonData.matches.forEach((m, idx) => {
      memoryStore.matches.push({
        ...m,
        id: baseMatchId + idx,
        tournament_id: newTourneyId
      });
    });
  }

  return importedTourney;
}

module.exports = {
  connectToDatabase,
  getStatus,
  executeQuery,
  updateMatchScoreInMemory,
  createTournament,
  createTeam,
  createTournamentInMemory,
  createTeamInMemory,
  exportTournamentData,
  importTournamentData,
  getMemoryStore: () => memoryStore
};
