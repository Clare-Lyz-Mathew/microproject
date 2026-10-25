const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function seedMore() {
  const host = process.env.DB_HOST || '127.0.0.1';
  const port = parseInt(process.env.DB_PORT || '3306', 10);
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || '';
  const database = process.env.DB_NAME || 'esports_db';

  console.log(`[Seed Expansion] Connecting to ${database}...`);
  const conn = await mysql.createConnection({ host, port, user, password, database, multipleStatements: true });

  const sql = `
    -- 1. Insert New Famous eSports Teams
    INSERT IGNORE INTO teams (id, name, tag, captain_name, region, primary_color) VALUES
    (9, 'T1', 'T1', 'Faker', 'South Korea', '#e2012d'),
    (10, 'Gen.G', 'GEN', 'Chovy', 'South Korea', '#aa8a00'),
    (11, 'Bilibili Gaming', 'BLG', 'knight', 'China', '#00a4db'),
    (12, 'G2 Esports', 'G2', 'Caps', 'Europe', '#ee1b24'),
    (13, 'Paper Rex', 'PRX', 'f0rsakeN', 'Pacific', '#df2060'),
    (14, 'EDward Gaming', 'EDG', 'CHICHOO', 'China', '#1a1a1a'),
    (15, 'Weibo Gaming', 'WBG', 'Xiaohu', 'China', '#e60012'),
    (16, 'Top Esports', 'TES', 'JackeyLove', 'China', '#ff0036'),
    (17, 'Hanwha Life Esports', 'HLE', 'Viper', 'South Korea', '#f37321'),
    (18, 'FlyQuest', 'FLY', 'Bwipo', 'North America', '#004733');

    -- 2. Insert Pro Players for New Teams
    INSERT IGNORE INTO players (team_id, nickname, full_name, role, rank_tier, is_captain) VALUES
    -- T1 (LoL Worlds 2023 & 2024 Champions)
    (9, 'Faker', 'Lee Sang-hyeok', 'Mid Laner / The GOAT', 'Challenger', TRUE),
    (9, 'Zeus', 'Choi Woo-je', 'Top Laner', 'Challenger', FALSE),
    (9, 'Oner', 'Mun Hyeon-jun', 'Jungler', 'Challenger', FALSE),
    (9, 'Gumayusi', 'Lee Min-hyeong', 'Bot Laner / ADC', 'Challenger', FALSE),
    (9, 'Keria', 'Ryu Min-seok', 'Support Prodigy', 'Challenger', FALSE),

    -- Gen.G (MSI 2024 Champions)
    (10, 'Chovy', 'Jeong Ji-hoon', 'Mid Laner / CS Titan', 'Challenger', TRUE),
    (10, 'Kiin', 'Kim Gi-in', 'Top Laner', 'Challenger', FALSE),
    (10, 'Canyon', 'Kim Geon-bu', 'Jungle Maestro', 'Challenger', FALSE),
    (10, 'Ruler', 'Park Jae-hyuk', 'Legendary ADC', 'Challenger', FALSE),
    (10, 'Lehends', 'Son Si-woo', 'Support Tactician', 'Challenger', FALSE),

    -- Bilibili Gaming (BLG - LPL Champions)
    (11, 'knight', 'Zhuo Ding', 'Mid Laner / Left Hand', 'Challenger', TRUE),
    (11, 'Bin', 'Chen Ze-Bin', 'Top Carry Phenomenon', 'Challenger', FALSE),
    (11, 'Wei', 'Yan Yang-Wei', 'Aggressive Jungler', 'Challenger', FALSE),
    (11, 'Elk', 'Zhao Jia-Hao', 'Hypercarry ADC', 'Challenger', FALSE),
    (11, 'ON', 'Luo Wen-Jun', 'Playmaking Support', 'Challenger', FALSE),

    -- G2 Esports (LEC Champions)
    (12, 'Caps', 'Rasmus Winther', 'Mid King', 'Challenger', TRUE),
    (12, 'BrokenBlade', 'Sergen Çelik', 'Top Father', 'Challenger', FALSE),
    (12, 'Yike', 'Martin Sundelin', 'Jungler', 'Challenger', FALSE),
    (12, 'Hans Sama', 'Steven Liv', 'ADC', 'Challenger', FALSE),
    (12, 'Mikyx', 'Mihael Mehle', 'Support Mastermind', 'Challenger', FALSE),

    -- Paper Rex (PRX - Pacific Champions)
    (13, 'f0rsakeN', 'Jason Susanto', 'IGL / Flex Master', 'Radiant', TRUE),
    (13, 'Jinggg', 'Wang Jing Jie', 'Chaos Duelist', 'Radiant', FALSE),
    (13, 'something', 'Ilya Petrov', 'Speed Duelist / Sniper', 'Radiant', FALSE),
    (13, 'd4v41', 'Khalish Rusyaidee', 'Initiator Anchor', 'Radiant', FALSE),
    (13, 'mindfreak', 'Aaron Leonhart', 'Clutch Controller', 'Radiant', FALSE),

    -- EDward Gaming (EDG - Valorant Champions 2024 World Champions)
    (14, 'CHICHOO', 'Wan Shunzhi', 'IGL / Clutch Anchor', 'Radiant', TRUE),
    (14, 'ZmjjKK', 'Zheng Yongkang', 'KangKang / World MVP Sniper', 'Radiant', FALSE),
    (14, 'Smoggy', 'Zhang Zhao', 'Flex Fragger', 'Radiant', FALSE),
    (14, 'nobody', 'Wang Senxu', 'Initiator Tactician', 'Radiant', FALSE),
    (14, 'S1Mon', 'Hsieh Meng-hsun', 'Support Flex', 'Radiant', FALSE),

    -- Weibo Gaming (WBG)
    (15, 'Xiaohu', 'Li Yuan-Hao', 'Mid Laner / Veteran Leader', 'Challenger', TRUE),
    (15, 'Breathe', 'Chen Chen', 'Top Laner', 'Challenger', FALSE),
    (15, 'Tarzan', 'Lee Seung-yong', 'Jungle Strategist', 'Challenger', FALSE),
    (15, 'Light', 'Wang Guang-Yu', 'Consistent ADC', 'Challenger', FALSE),
    (15, 'Crisp', 'Liu Qing-Song', 'World Champion Support', 'Challenger', FALSE),

    -- Top Esports (TES)
    (16, 'JackeyLove', 'Yu Wen-Bo', 'Hyper-Aggressive ADC', 'Challenger', TRUE),
    (16, '369', 'Bai Jia-Hao', 'Versatile Top Laner', 'Challenger', FALSE),
    (16, 'Tian', 'Gao Tian-Peng', 'Worlds MVP Jungler', 'Challenger', FALSE),
    (16, 'Creme', 'Lin Jian', 'Assassin Mid', 'Challenger', FALSE),
    (16, 'Meiko', 'Tian Ye', 'Grand Slam Support', 'Challenger', FALSE),

    -- Hanwha Life Esports (HLE)
    (17, 'Viper', 'Park Do-hyeon', 'Hypercarry ADC / Captain', 'Challenger', TRUE),
    (17, 'Doran', 'Choi Hyeon-joon', 'Top Laner', 'Challenger', FALSE),
    (17, 'Peanut', 'Han Wang-ho', 'Legendary Jungler', 'Challenger', FALSE),
    (17, 'Zeka', 'Kim Geon-woo', 'Mid Champion', 'Challenger', FALSE),
    (17, 'Delight', 'Yoo Hwan-joong', 'Engage Support', 'Challenger', FALSE),

    -- FlyQuest (FLY - LCS Champions)
    (18, 'Bwipo', 'Gabriël Rau', 'Wide Bwipo / Top Leader', 'Challenger', TRUE),
    (18, 'Inspired', 'Kacper Słoma', 'Jungle MVP', 'Challenger', FALSE),
    (18, 'Quad', 'Song Su-hyeong', 'Control Mid Mage', 'Challenger', FALSE),
    (18, 'Massu', 'Fahad Abdulmalek', 'Rookie ADC Phenom', 'Challenger', FALSE),
    (18, 'Busio', 'Alan Cwalina', 'Support Roamer', 'Challenger', FALSE);

    -- 3. Insert Real Past Historical Tournaments
    INSERT IGNORE INTO tournaments (id, name, game_title, category, format, match_format, status, prize_pool, max_teams, start_date, end_date, location, is_offline_lan) VALUES
    (5, '2024 League of Legends World Championship (Knockout Stage)', 'League of Legends', 'MOBA', 'Single Elimination', 'BO5', 'completed', 2225000.00, 8, '2024-10-17', '2024-11-02', 'The O2 Arena, London', TRUE),
    (6, 'VALORANT Champions 2024 (Playoffs)', 'Valorant', 'Tactical Shooter', 'Single Elimination', 'BO3', 'completed', 2250000.00, 8, '2024-08-14', '2024-08-25', 'INSPIRE Arena, Seoul', TRUE);

    -- 4. Registrations for Tournament 5 (LoL Worlds 2024)
    INSERT IGNORE INTO tournament_teams (tournament_id, team_id, seed) VALUES
    (5, 15, 1), -- WBG (#1)
    (5, 12, 8), -- G2 (#8)
    (5, 11, 2), -- BLG (#2)
    (5, 17, 7), -- HLE (#7)
    (5, 16, 3), -- TES (#3)
    (5, 9, 6),  -- T1 (#6)
    (5, 10, 4), -- GEN (#4)
    (5, 18, 5); -- FLY (#5)

    -- 5. Actual Past Matches for Tournament 5 (LoL Worlds 2024 Knockouts: Faker 5th Trophy)
    INSERT IGNORE INTO matches (id, tournament_id, round_number, match_order, team1_id, team2_id, score1, score2, winner_id, status, scheduled_time, next_match_id) VALUES
    -- Grand Finals (Match 15: BLG vs T1 -> T1 3-2 BLG!)
    (15, 5, 3, 1, 11, 9, 2, 3, 9, 'completed', '2024-11-02 15:00:00', NULL),

    -- Semifinals (Match 13 & 14)
    (13, 5, 2, 1, 15, 11, 0, 3, 11, 'completed', '2024-10-26 14:00:00', 15),
    (14, 5, 2, 2, 9, 10, 3, 1, 9, 'completed', '2024-10-27 14:00:00', 15),

    -- Quarterfinals (Matches 9, 10, 11, 12)
    (9,  5, 1, 1, 15, 12, 3, 1, 15, 'completed', '2024-10-17 14:00:00', 13),
    (10, 5, 1, 2, 11, 17, 3, 1, 11, 'completed', '2024-10-18 14:00:00', 13),
    (11, 5, 1, 3, 16, 9,  0, 3, 9,  'completed', '2024-10-19 14:00:00', 14),
    (12, 5, 1, 4, 10, 18, 3, 2, 10, 'completed', '2024-10-20 14:00:00', 14);

    -- 6. Registrations for Tournament 6 (Valorant Champions 2024)
    INSERT IGNORE INTO tournament_teams (tournament_id, team_id, seed) VALUES
    (6, 14, 1), -- EDG (#1)
    (6, 4, 8),  -- Sentinels (#8)
    (6, 7, 2),  -- Fnatic (#2)
    (6, 5, 7),  -- Vitality (#7)
    (6, 13, 3), -- PRX (#3)
    (6, 1, 6),  -- Liquid (#6)
    (6, 8, 4),  -- Spirit (#4)
    (6, 2, 5);  -- FaZe (#5)

    -- 7. Actual Past Matches for Tournament 6 (Valorant Champions 2024: EDG World Champions)
    INSERT IGNORE INTO matches (id, tournament_id, round_number, match_order, team1_id, team2_id, score1, score2, winner_id, status, scheduled_time, next_match_id) VALUES
    -- Grand Finals (Match 22: EDG vs PRX -> EDG 3-2 PRX!)
    (22, 6, 3, 1, 14, 13, 3, 2, 14, 'completed', '2024-08-25 16:00:00', NULL),

    -- Semifinals (Match 20 & 21)
    (20, 6, 2, 1, 14, 7, 2, 1, 14, 'completed', '2024-08-23 15:00:00', 22),
    (21, 6, 2, 2, 13, 8, 2, 0, 13, 'completed', '2024-08-23 19:00:00', 22),

    -- Quarterfinals (Matches 16, 17, 18, 19)
    (16, 6, 1, 1, 14, 4, 2, 1, 14, 'completed', '2024-08-14 15:00:00', 20),
    (17, 6, 1, 2, 7,  5, 2, 0, 7,  'completed', '2024-08-14 19:00:00', 20),
    (18, 6, 1, 3, 13, 1, 2, 1, 13, 'completed', '2024-08-15 15:00:00', 21),
    (19, 6, 1, 4, 8,  2, 2, 0, 8,  'completed', '2024-08-15 19:00:00', 21);
  `;

  console.log('[Seed Expansion] Executing SQL batch...');
  await conn.query(sql);
  console.log('[Seed Expansion] SUCCESS! 10 new pro teams, players, Worlds 2024, and Champions 2024 brackets added.');
  await conn.end();
}

if (require.main === module) {
  seedMore().then(() => process.exit(0)).catch(err => {
    console.error(err);
    process.exit(1);
  });
}

module.exports = seedMore;
