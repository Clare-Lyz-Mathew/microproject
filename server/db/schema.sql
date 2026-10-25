-- =====================================================================
-- Universal eSports Tournament & Bracket Management System Database Schema
-- Multi-Game Relational Architecture (CS2, Valorant, Rocket League, Dota 2, Custom)
-- Supports Offline LAN & Production MySQL 8.x
-- =====================================================================

CREATE DATABASE IF NOT EXISTS esports_db;
USE esports_db;

-- Drop tables in reverse order of foreign keys
DROP TABLE IF EXISTS matches;
DROP TABLE IF EXISTS tournament_teams;
DROP TABLE IF EXISTS players;
DROP TABLE IF EXISTS teams;
DROP TABLE IF EXISTS tournaments;

-- ---------------------------------------------------------------------
-- 1. TOURNAMENTS TABLE
-- ---------------------------------------------------------------------
CREATE TABLE tournaments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    game_title VARCHAR(100) NOT NULL,
    category VARCHAR(50) DEFAULT 'Tactical Shooter', -- FPS, MOBA, Battle Royale, Fighting, Sports, Custom
    format VARCHAR(50) DEFAULT 'Single Elimination',
    match_format VARCHAR(20) DEFAULT 'BO3', -- BO1, BO3, BO5, BO7
    status ENUM('upcoming', 'active', 'completed') DEFAULT 'upcoming',
    prize_pool DECIMAL(12, 2) DEFAULT 0.00,
    max_teams INT DEFAULT 8,
    start_date DATE NOT NULL,
    end_date DATE,
    location VARCHAR(100) DEFAULT 'LAN Arena / Online',
    is_offline_lan BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------------------------------
-- 2. TEAMS TABLE
-- ---------------------------------------------------------------------
CREATE TABLE teams (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    tag VARCHAR(10) NOT NULL UNIQUE,
    captain_name VARCHAR(100) NOT NULL,
    region VARCHAR(50) DEFAULT 'Global',
    primary_color VARCHAR(20) DEFAULT '#00f0ff',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ---------------------------------------------------------------------
-- 3. PLAYERS TABLE (Relational: 1 Team -> Many Players)
-- ---------------------------------------------------------------------
CREATE TABLE players (
    id INT AUTO_INCREMENT PRIMARY KEY,
    team_id INT NOT NULL,
    nickname VARCHAR(50) NOT NULL,
    full_name VARCHAR(100),
    role VARCHAR(50) NOT NULL, -- e.g., 'Entry Fragger', 'IGL', 'AWPer', 'Striker', 'Support'
    rank_tier VARCHAR(50) DEFAULT 'Pro Elite',
    is_captain BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE
);

-- ---------------------------------------------------------------------
-- 4. TOURNAMENT_TEAMS TABLE (Many-to-Many Junction Table)
-- ---------------------------------------------------------------------
CREATE TABLE tournament_teams (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tournament_id INT NOT NULL,
    team_id INT NOT NULL,
    seed INT NOT NULL,
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tournament_id) REFERENCES tournaments(id) ON DELETE CASCADE,
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
    UNIQUE KEY unique_tournament_team (tournament_id, team_id),
    UNIQUE KEY unique_tournament_seed (tournament_id, seed)
);

-- ---------------------------------------------------------------------
-- 5. MATCHES TABLE (Bracket single-elimination graph)
-- ---------------------------------------------------------------------
CREATE TABLE matches (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tournament_id INT NOT NULL,
    round_number INT NOT NULL, -- 1: Quarterfinals, 2: Semifinals, 3: Grand Finals
    match_order INT NOT NULL,  -- Match position within the round (1, 2, 3, 4)
    team1_id INT NULL,
    team2_id INT NULL,
    score1 INT DEFAULT 0,
    score2 INT DEFAULT 0,
    winner_id INT NULL,
    status ENUM('pending', 'live', 'completed') DEFAULT 'pending',
    scheduled_time DATETIME,
    next_match_id INT NULL,    -- Winner moves to next_match_id
    FOREIGN KEY (tournament_id) REFERENCES tournaments(id) ON DELETE CASCADE,
    FOREIGN KEY (team1_id) REFERENCES teams(id) ON DELETE SET NULL,
    FOREIGN KEY (team2_id) REFERENCES teams(id) ON DELETE SET NULL,
    FOREIGN KEY (winner_id) REFERENCES teams(id) ON DELETE SET NULL,
    FOREIGN KEY (next_match_id) REFERENCES matches(id) ON DELETE SET NULL
);

-- =====================================================================
-- SEED DATA: UNIVERSAL MULTI-GAME ESPORTS ECOSYSTEM
-- =====================================================================

-- 1. Insert Global Multi-Game Teams
INSERT INTO teams (id, name, tag, captain_name, region, primary_color) VALUES
(1, 'Team Liquid', 'TL', 'nitr0', 'North America', '#0047b3'),
(2, 'FaZe Clan', 'FAZE', 'karrigan', 'Europe', '#e11d48'),
(3, 'Natus Vincere', 'NAVI', 'Aleksib', 'Eastern Europe', '#eab308'),
(4, 'Sentinels', 'SEN', 'johnqt', 'Americas', '#ef4444'),
(5, 'Team Vitality', 'VIT', 'apEX', 'Europe', '#facc15'),
(6, 'Cloud9', 'C9', 'Boombl4', 'North America', '#0284c7'),
(7, 'Fnatic', 'FNC', 'Boaster', 'Europe', '#ff5900'),
(8, 'Team Spirit', 'TS', 'chopper', 'Global', '#10b981'),
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

-- 2. Insert Pro Players across multiple roles
INSERT INTO players (team_id, nickname, full_name, role, rank_tier, is_captain) VALUES
-- Team Liquid
(1, 'nitr0', 'Nicholas Cannella', 'In-Game Leader / Captain', 'Global Elite', TRUE),
(1, 'Twistzz', 'Russel Van Dulken', 'Rifler / Entry', 'Global Elite', FALSE),
(1, 'NAF', 'Keith Markovic', 'Lurker / Anchor', 'Global Elite', FALSE),
(1, 'ultimate', 'Roland Tomkowiak', 'AWPer / Sniper', 'Global Elite', FALSE),
(1, 'jks', 'Justin Savage', 'Support / Anchor', 'Global Elite', FALSE),
-- FaZe Clan
(2, 'karrigan', 'Finn Andersen', 'Mastermind IGL', 'Pro Elite', TRUE),
(2, 'rain', 'Håvard Nygaard', 'Entry Fragger', 'Pro Elite', FALSE),
(2, 'broky', 'Helvijs Saukants', 'Primary Sniper', 'Pro Elite', FALSE),
(2, 'frozen', 'David Čerňanský', 'Rifler', 'Pro Elite', FALSE),
(2, 'ropz', 'Robin Kool', 'Lurker / Closer', 'Pro Elite', FALSE),
-- NAVI
(3, 'Aleksib', 'Aleksi Virolainen', 'IGL / Tactician', 'Pro Elite', TRUE),
(3, 'b1t', 'Valerij Vakhovsjkyj', 'Headshot Machine', 'Pro Elite', FALSE),
(3, 'jL', 'Justinas Lekavicius', 'Entry / Playmaker', 'Pro Elite', FALSE),
(3, 'iM', 'Mihai Ivan', 'Aggressive Rifler', 'Pro Elite', FALSE),
(3, 'w0nderful', 'Ihor Zhdanov', 'AWPer', 'Pro Elite', FALSE),
-- Sentinels
(4, 'johnqt', 'Amine Ouarid', 'IGL / Sentinel', 'Radiant', TRUE),
(4, 'TenZ', 'Tyson Ngo', 'Duelist / Flex', 'Radiant', FALSE),
(4, 'zekken', 'Zachary Patrone', 'Duelist / Entry', 'Radiant', FALSE),
(4, 'Sacy', 'Gustavo Rossi', 'Initiator', 'Radiant', FALSE),
(4, 'Zellsis', 'Jordan Montemurro', 'Flex / Motivator', 'Radiant', FALSE),
-- Team Vitality
(5, 'apEX', 'Dan Madesclaire', 'Captain / IGL', 'Pro Elite', TRUE),
(5, 'ZywOo', 'Mathieu Herbaut', 'Superstar Sniper / AWPer', 'Pro Elite #1', FALSE),
(5, 'flameZ', 'Shahar Shushan', 'Rifler', 'Pro Elite', FALSE),
(5, 'Spinx', 'Lotan Giladi', 'Lurker', 'Pro Elite', FALSE),
(5, 'mezii', 'William Merriman', 'Support Anchor', 'Pro Elite', FALSE),
-- Cloud9
(6, 'Boombl4', 'Kirill Mikhailov', 'IGL / Captain', 'Pro Elite', TRUE),
(6, 'Ax1Le', 'Sergey Rykhtorov', 'Rifler', 'Pro Elite', FALSE),
(6, 'HeavyGod', 'Nikita Martynenko', 'Rifler', 'Pro Elite', FALSE),
(6, 'ICY', 'Kaisar Faiznurov', 'AWPer', 'Pro Elite', FALSE),
(6, 'interz', 'Timofey Yakushin', 'Support Anchor', 'Pro Elite', FALSE),
-- Fnatic
(7, 'Boaster', 'Jake Howlett', 'IGL / Strategist', 'Radiant', TRUE),
(7, 'Derke', 'Nikita Sirmitev', 'Duelist', 'Radiant', FALSE),
(7, 'Chronicle', 'Timofey Khromov', 'Flex / Initiator', 'Radiant', FALSE),
(7, 'Alfajer', 'Emir Ali Beder', 'Sentinel Anchor', 'Radiant', FALSE),
(7, 'crashies', 'Austin Roberts', 'Initiator', 'Radiant', FALSE),
-- Team Spirit
(8, 'chopper', 'Leonid Vishnyakov', 'IGL / Captain', 'Pro Elite', TRUE),
(8, 'donk', 'Danil Kryshkovets', 'Phenom Rifler', 'Pro Elite MVP', FALSE),
(8, 'sh1ro', 'Dmitriy Sokolov', 'Tactical AWPer', 'Pro Elite', FALSE),
(8, 'magixx', 'Boris Vorobiev', 'Support', 'Pro Elite', FALSE),
(8, 'zonixx', 'Myroslav Plakhotja', 'Rifler', 'Pro Elite', FALSE);

-- 3. Insert Multi-Game Tournaments (CS2, Valorant, Rocket League, Apex Legends)
INSERT INTO tournaments (id, name, game_title, category, format, match_format, status, prize_pool, max_teams, start_date, end_date, location, is_offline_lan) VALUES
(1, 'IEM Cologne 2026: Cathedral of Counter-Strike', 'Counter-Strike 2', 'Tactical Shooter', 'Single Elimination', 'BO3', 'active', 1250000.00, 8, '2026-10-18', '2026-10-26', 'LANXESS Arena, Cologne', FALSE),
(2, 'VCT Masters: Pacific Showdown', 'Valorant', 'Tactical Shooter', 'Single Elimination', 'BO3', 'upcoming', 850000.00, 8, '2026-11-05', '2026-11-15', 'Makuhari Messe, Tokyo', FALSE),
(3, 'RLCS World Championship 2026', 'Rocket League', 'Vehicular Soccer', 'Single Elimination', 'BO5', 'completed', 1000000.00, 8, '2026-08-10', '2026-08-18', 'Dickies Arena, Texas', FALSE),
(4, 'Apex Legends Global Series (ALGS) Championship', 'Apex Legends', 'Battle Royale', 'Single Elimination', 'BO3', 'upcoming', 500000.00, 8, '2026-12-01', '2026-12-10', 'ExCeL London', FALSE),
(5, '2024 League of Legends World Championship (Knockout Stage)', 'League of Legends', 'MOBA', 'Single Elimination', 'BO5', 'completed', 2225000.00, 8, '2024-10-17', '2024-11-02', 'The O2 Arena, London', TRUE),
(6, 'VALORANT Champions 2024 (Playoffs)', 'Valorant', 'Tactical Shooter', 'Single Elimination', 'BO3', 'completed', 2250000.00, 8, '2024-08-14', '2024-08-25', 'INSPIRE Arena, Seoul', TRUE);

-- 4. Tournament Registrations (Tournament 1: IEM Cologne 8 Teams)
INSERT INTO tournament_teams (tournament_id, team_id, seed) VALUES
(1, 1, 1), -- Liquid (#1)
(1, 8, 8), -- Spirit (#8)
(1, 2, 2), -- FaZe (#2)
(1, 7, 7), -- Fnatic (#7)
(1, 3, 3), -- NAVI (#3)
(1, 6, 6), -- Cloud9 (#6)
(1, 4, 4), -- Sentinels (#4)
(1, 5, 5); -- Vitality (#5)

-- Tournament 2 (Valorant Masters)
INSERT INTO tournament_teams (tournament_id, team_id, seed) VALUES
(2, 4, 1),
(2, 7, 2),
(2, 1, 3),
(2, 5, 4);

-- Tournament 5 (LoL Worlds 2024)
INSERT INTO tournament_teams (tournament_id, team_id, seed) VALUES
(5, 15, 1), -- WBG
(5, 12, 8), -- G2
(5, 11, 2), -- BLG
(5, 17, 7), -- HLE
(5, 16, 3), -- TES
(5, 9, 6),  -- T1
(5, 10, 4), -- GEN
(5, 18, 5); -- FLY

-- Tournament 6 (Valorant Champions 2024)
INSERT INTO tournament_teams (tournament_id, team_id, seed) VALUES
(6, 14, 1), -- EDG
(6, 4, 8),  -- Sentinels
(6, 7, 2),  -- Fnatic
(6, 5, 7),  -- Vitality
(6, 13, 3), -- PRX
(6, 1, 6),  -- Liquid
(6, 8, 4),  -- Spirit
(6, 2, 5);  -- FaZe

-- 5. Matches for Tournament 1 (Single Elimination Bracket)
INSERT INTO matches (id, tournament_id, round_number, match_order, team1_id, team2_id, score1, score2, winner_id, status, scheduled_time, next_match_id) VALUES
-- Grand Finals (Match 7)
(7, 1, 3, 1, NULL, NULL, 0, 0, NULL, 'pending', '2026-10-26 19:00:00', NULL),
-- Semifinal 1 (Match 5 -> feeds to Match 7)
(5, 1, 2, 1, 1, 4, 0, 0, NULL, 'pending', '2026-10-24 16:00:00', 7),
-- Semifinal 2 (Match 6 -> feeds to Match 7)
(6, 1, 2, 2, NULL, NULL, 0, 0, NULL, 'pending', '2026-10-24 20:00:00', 7),
-- Quarterfinals
(1, 1, 1, 1, 1, 8, 2, 1, 1, 'completed', '2026-10-18 14:00:00', 5),
(2, 1, 1, 2, 4, 5, 2, 0, 4, 'completed', '2026-10-18 18:00:00', 5),
(3, 1, 1, 3, 2, 7, 1, 1, NULL, 'live', '2026-10-19 14:00:00', 6),
(4, 1, 1, 4, 3, 6, 0, 0, NULL, 'pending', '2026-10-19 18:00:00', 6),

-- Actual Matches for Tournament 5 (LoL Worlds 2024: T1 5th World Championship)
(15, 5, 3, 1, 11, 9, 2, 3, 9, 'completed', '2024-11-02 15:00:00', NULL),
(13, 5, 2, 1, 15, 11, 0, 3, 11, 'completed', '2024-10-26 14:00:00', 15),
(14, 5, 2, 2, 9, 10, 3, 1, 9, 'completed', '2024-10-27 14:00:00', 15),
(9,  5, 1, 1, 15, 12, 3, 1, 15, 'completed', '2024-10-17 14:00:00', 13),
(10, 5, 1, 2, 11, 17, 3, 1, 11, 'completed', '2024-10-18 14:00:00', 13),
(11, 5, 1, 3, 16, 9,  0, 3, 9,  'completed', '2024-10-19 14:00:00', 14),
(12, 5, 1, 4, 10, 18, 3, 2, 10, 'completed', '2024-10-20 14:00:00', 14),

-- Actual Matches for Tournament 6 (Valorant Champions 2024: EDG World Champions)
(22, 6, 3, 1, 14, 13, 3, 2, 14, 'completed', '2024-08-25 16:00:00', NULL),
(20, 6, 2, 1, 14, 7, 2, 1, 14, 'completed', '2024-08-23 15:00:00', 22),
(21, 6, 2, 2, 13, 8, 2, 0, 13, 'completed', '2024-08-23 19:00:00', 22),
(16, 6, 1, 1, 14, 4, 2, 1, 14, 'completed', '2024-08-14 15:00:00', 20),
(17, 6, 1, 2, 7,  5, 2, 0, 7,  'completed', '2024-08-14 19:00:00', 20),
(18, 6, 1, 3, 13, 1, 2, 1, 13, 'completed', '2024-08-15 15:00:00', 21),
(19, 6, 1, 4, 8,  2, 2, 0, 8,  'completed', '2024-08-15 19:00:00', 21);
