# 24INMCAL391 - RDBMS LAB
# 24INMCAL393 - USER INTERFACE AND DESIGN LAB
# 24INMCAT307 - SOFTWARE ENGINEERING

### *Microproject Report Submitted By*

## **CLARE LYZ MATHEW**
### **Reg. No: AJC24MCA-I020**

*In Partial fulfillment for the Award of the Degree Of*

### **INTEGRATED MASTER OF COMPUTER APPLICATIONS**
### **(MCA FIVE YEAR)**

---

### **AMAL JYOTHI COLLEGE OF ENGINEERING AUTONOMOUS, KANJIRAPPALLY**
[Approved by AICTE, Accredited by NAAC.  
Koovappally, Kanjirappally, Kottayam, Kerala – 686518]

### **2026-2027**

<div style="page-break-after: always;"></div>

---

## DEPARTMENT OF COMPUTER APPLICATIONS
### AMAL JYOTHI COLLEGE OF ENGINEERING AUTONOMOUS, KANJIRAPPALLY

---

## **CERTIFICATE**

This is to certify that the Microproject report entitled **"ESPORTS ARENA: Universal Tournament & Bracket Management System with Relational MySQL JOIN Architecture"**, submitted in combined fulfillment of the requirements for **"24INMCAL391 - RDBMS Lab"**, **"24INMCAL393 - User Interface and Design Lab"**, and **"24INMCAT307 - Software Engineering"**, is the bonafide work of **CLARE LYZ MATHEW (Reg. No: AJC24MCA-I020)** in partial fulfillment of the requirements for the award of the Degree of **Master of Computer Applications** under Amal Jyothi College of Engineering, Autonomous Kanjirappally during the academic year **2026-2027**.

<br><br><br>

| | |
| :---: | :---: |
| **Ms. Navyamol K T** | **Dr. Bijimol T K** |
| *Lab In - Charge* | *Head of the Department* |

<br>

**Academic Year: 2026-2027**

<div style="page-break-after: always;"></div>

---

## **Abstract**

The **ESPORTS ARENA** is an intuitive, full-stack tournament management and bracket orchestration platform engineered to streamline the administration of competitive electronic sports competitions. Built around a normalized relational MySQL database architecture and a reactive component-driven React 19 single-page interface, the system eliminates administrative friction by uniting multi-game discipline management, real-time single-elimination bracket tracking, live match monitoring, and relational automated progression. By leveraging advanced relational database design—including five interconnected normalized entities, foreign key constraints, cascading triggers, and multi-table `INNER` and `LEFT JOIN` aggregations—the platform guarantees absolute data integrity across tournament registrations, match series outcomes, and dynamic win-rate leaderboards. The user interface embodies contemporary design principles, offering seamless Cyber Dark and Soft Titanium Light themes, dynamic Challonge-style tree visualizations, and one-click manual winner adjudication that synchronizes instantaneously with the backend database. Furthermore, with built-in offline LAN backup serialization, the application serves both online community leagues and disconnected local area network arena tournaments, delivering an enterprise-grade operational standard for pro esports events.

<div style="page-break-after: always;"></div>

---

## **1. Project Overview**

### 1.1 Introduction to the Project
Electronic sports (esports) have experienced exponential growth, evolving from informal local gatherings into global athletic spectacles with millions of concurrent spectators across premier titles such as League of Legends, Counter-Strike 2, and Valorant. Despite this institutional growth, grassroots tournament organizers, collegiate gaming leagues, and local LAN centers frequently struggle with fragmented spreadsheets, manual paper brackets, and unverified scorekeeping tools that introduce scoring disputes and human error.

The **ESPORTS ARENA** system was conceptualized and engineered to resolve these operational bottlenecks. It delivers an autonomous, professional, and accessible web-based tournament management platform that couples sophisticated relational database engineering with human-centered user interface design.

### 1.2 Objectives of the Project
- **Automate Bracket Lifecycle Management:** Implement deterministic single-elimination tournament trees (Quarterfinals, Semifinals, Grand Finals) with automated winner progression based on relational lineage (`next_match_id`).
- **Provide Live In-Progress Status Viewing:** Allow tournament administrators and spectators to monitor ongoing matches with real-time score counters, map tracking, and dedicated live arena dashboards.
- **Implement Manual Adjudication Controls:** Equip referees with one-click manual winner selection buttons that immediately persist match outcomes into the MySQL database and advance teams to succeeding rounds.
- **Showcase Advanced Relational Database Capabilities:** Structure normalized tables ensuring referential integrity and execute complex multi-table SQL JOIN queries for live analytics and win-rate computations.
- **Support Disconnected / Offline LAN Arenas:** Guarantee zero reliance on external CDNs or cloud assets by utilizing local inline SVG team crests and complete JSON import/export routines.

### 1.3 Scope of the Project
The project scope encompasses competitive multi-game tournament setups (League of Legends, Counter-Strike 2, Valorant, Rocket League, Dota 2, and Custom Titles), team roster tracking, bracket generation, live match scorekeeping, dynamic leaderboards, and an interactive SQL query inspector. The platform is designed for cross-platform deployment, running seamlessly on local network hosts or distributed web servers.

---

## **2. Technologies Used**

| Layer / Role | Technology / Tool | Version | Description & Justification |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | React | 19.3 | High-performance component-driven declarative UI architecture. |
| **Client Routing** | React Router DOM | 7.18 | Single-page client-side routing across tournaments, brackets, and teams. |
| **Build Tooling** | Vite | 8.3 | High-speed frontend development server and ES module bundler. |
| **Styling & Theme** | Modern Vanilla CSS | CSS3 | Custom CSS variables supporting Obsidian Dark and Soft Titanium Light modes. |
| **Icons & Symbols** | Lucide React | 1.59 | Lightweight, accessible SVG vector icon system. |
| **Backend API** | Node.js / Express | 4.19 | RESTful HTTP microservice delivering parameterized JSON endpoints. |
| **Database Engine** | MySQL | 8.x | Enterprise RDBMS enforcing foreign keys, indexes, and ACID guarantees. |
| **Database Driver** | mysql2 / promise | 3.9 | Asynchronous connection pooling with parameterized SQL query execution. |
| **Process Manager** | Concurrently | 8.2 | Concurrently executes frontend Vite and Express API from a single command. |
| **Source Control** | Git & GitHub | 2.45+ | Distributed version control and source code repository hosting. |

---

## **3. User Roles & Responsibilities**

| User Role | Primary Responsibilities | Permissions & System Scope |
| :--- | :--- | :--- |
| **Tournament Administrator** | Initializes tournaments, registers pro squads, configures prize pools, and sets game formats. | Full CRUD access to tournaments, teams, players, and bracket configurations. |
| **Match Referee / Official** | Monitors live matches, enters map scores, updates status to LIVE, and declares winning teams. | Score updating, manual winner declaration, and live status toggling. |
| **Team Captain / Player** | Views team match schedules, current seeding, bracket positions, and roster listings. | Read-only bracket viewing, team registration request submission. |
| **Public Spectator / Guest** | Follows live tournament brackets, inspects leaderboard standings, and views SQL query executions. | Read-only access to tournaments, live scoreboard hub, and SQL Inspector. |

---

## **4. Key Functional Modules**

### Module 1: Tournament Lifecycle & Category Management
- **Purpose:** Oversees the end-to-end configuration of multi-game esports competitions, ranging from international invitationals to local community LANs.
- **Functionality:** Supports multi-game disciplines (LoL, CS2, Valorant, Rocket League, Dota 2, and Custom Titles), single-elimination tree seeding, customizable prize allocations, and date/location scheduling.
- **Inputs:** Tournament Name, Game Discipline, Match Format (BO1/BO3/BO5), Prize Pool, Team Seeding, Venue Location.
- **Outputs:** New tournament record persisted in `tournaments` table; auto-generated single-elimination bracket graph with 7 interconnected match entities.

### Module 2: Interactive Single-Elimination Bracket Tree Engine
- **Purpose:** Renders visual Challonge-style bracket trees illustrating progression from Quarterfinals (Round of 8) through Semifinals to the Grand Finals.
- **Functionality:** Displays opposing teams, seeded ranks, official color accents, and live/final map scores. Incorporates an interactive lineage graph where advancing finalists are dynamically rendered upon match conclusion.
- **Inputs:** Tournament identifier (`tournament_id`).
- **Outputs:** Responsive SVG/CSS bracket hierarchy with clickable matchup cards and winner highlight badges.

### Module 3: Live Arena Monitor & Real-Time Broadcast Hub
- **Purpose:** Delivers a dedicated operational monitor for active games currently in progress.
- **Functionality:** Provides a "Live Matches Only" filter view with animated pulsing live badges, map score adjustment steppers (`+`/`-`), in-game status indicators, and instantaneous winner declaration.
- **Inputs:** Live match selection, score adjustment increments.
- **Outputs:** Broadcast-grade scoreboard card displaying team crests, live map tallies, and direct match adjudication controls.

### Module 4: Manual Winner Selection & Relational Auto-Advancement Engine
- **Purpose:** Enables referees to manually designate the match winner and guarantee instant relational progression in the bracket.
- **Functionality:** Clicking `👑 Win [TAG]` sends a validated `PUT` request to the API, writing the winning team's ID to `winner_id`, setting status to `completed`, and executing a targeted relational update into `team1_id` or `team2_id` of `next_match_id`.
- **Inputs:** Match ID, Winner Team ID, Winning Map Scores.
- **Outputs:** Synchronized database update across two tables and visual advancement of the winner into the next round match card.

### Module 5: Team Roster & Pro Player Management
- **Purpose:** Maintains accurate registry data for competitive organizations, team captains, and 5-man pro rosters.
- **Functionality:** Tracks player in-game aliases (e.g., Faker, Chovy, ZmjjKK), tactical roles (IGL, AWPer, Duelist, Mid Laner), regional affiliations, and distinctive hex primary colors used to render SVG emblems.
- **Inputs:** Team name, 3-character tag, captain name, region, primary color, roster player profiles.
- **Outputs:** Relational player records bound via `team_id` foreign key constraint; dynamic crest generation.

### Module 6: Global Standings & Dynamic Win-Rate Aggregation
- **Purpose:** Computes cumulative tournament victories, total series played, match wins, and win-rate percentages across all registered squads.
- **Functionality:** Utilizes conditional SQL aggregation (`CASE WHEN m.winner_id = t.id THEN 1 ELSE 0 END`) to compute real-time leaderboards with podium rankings (#1, #2, #3).
- **Inputs:** All completed match history records.
- **Outputs:** Ranked tabular leaderboard with visual win-rate progress meters and championship accolades.

### Module 7: SQL JOINs & Relational Schema Inspector
- **Purpose:** Serves as an interactive educational and debugging workbench to showcase database queries in real time.
- **Functionality:** Features an SQL query playground with syntax-highlighted SQL scripts, execution time benchmarks in milliseconds, and raw tabular result visualizers.
- **Inputs:** Selected query type (Tournaments Overview, Bracket Lineage, Rosters, Standings).
- **Outputs:** Formatted JSON payload, query execution time, and rendered table rows.

---

## **5. Database Design (24INMCAL391 - RDBMS Lab)**

The database name is **`esports_db`**, hosted on MySQL 8.x. The relational schema is organized in 3rd Normal Form (3NF) to eliminate duplication and maintain referential integrity across tournaments, participants, and tournament brackets.

### 5.1 Relational Schema & Table Structures

#### Table 1: `tournaments`
Stores tournament metadata, game titles, formats, prize pools, and operational dates.
```sql
CREATE TABLE tournaments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    game_title VARCHAR(100) NOT NULL,
    category VARCHAR(50) DEFAULT 'Tactical Shooter',
    format VARCHAR(50) DEFAULT 'Single Elimination',
    match_format VARCHAR(20) DEFAULT 'BO3',
    status ENUM('upcoming', 'active', 'completed') DEFAULT 'upcoming',
    prize_pool DECIMAL(12, 2) DEFAULT 0.00,
    max_teams INT DEFAULT 8,
    start_date DATE NOT NULL,
    end_date DATE NULL,
    location VARCHAR(100) DEFAULT 'LAN Arena / Online',
    is_offline_lan BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Table 2: `teams`
Stores competitive esports organizations, unique acronym tags, captains, and visual branding tokens.
```sql
CREATE TABLE teams (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    tag VARCHAR(10) NOT NULL UNIQUE,
    captain_name VARCHAR(100) NOT NULL,
    region VARCHAR(50) DEFAULT 'Global',
    primary_color VARCHAR(20) DEFAULT '#00f0ff',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Table 3: `players`
Normalized player records linked to their parent organization.
```sql
CREATE TABLE players (
    id INT AUTO_INCREMENT PRIMARY KEY,
    team_id INT NOT NULL,
    nickname VARCHAR(50) NOT NULL,
    full_name VARCHAR(100) NULL,
    role VARCHAR(50) NOT NULL,
    rank_tier VARCHAR(50) DEFAULT 'Pro Elite',
    is_captain BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE
);
```

#### Table 4: `tournament_teams` (Junction Table)
Implements the M:N relationship between tournaments and enrolled teams.
```sql
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
```

#### Table 5: `matches` (Relational Bracket Graph)
Represents the bracket tree hierarchy with forward lineage pointers (`next_match_id`).
```sql
CREATE TABLE matches (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tournament_id INT NOT NULL,
    round_number INT NOT NULL,
    match_order INT NOT NULL,
    team1_id INT NULL,
    team2_id INT NULL,
    score1 INT DEFAULT 0,
    score2 INT DEFAULT 0,
    winner_id INT NULL,
    status ENUM('pending', 'live', 'completed') DEFAULT 'pending',
    scheduled_time DATETIME NULL,
    next_match_id INT NULL,
    FOREIGN KEY (tournament_id) REFERENCES tournaments(id) ON DELETE CASCADE,
    FOREIGN KEY (team1_id) REFERENCES teams(id) ON DELETE SET NULL,
    FOREIGN KEY (team2_id) REFERENCES teams(id) ON DELETE SET NULL,
    FOREIGN KEY (winner_id) REFERENCES teams(id) ON DELETE SET NULL,
    FOREIGN KEY (next_match_id) REFERENCES matches(id) ON DELETE SET NULL
);
```

### 5.2 SQL Multi-Table JOIN Showcase

#### Query 1: Bracket Lineage Multi-Table JOIN
```sql
SELECT 
    m.id, m.tournament_id, m.round_number, m.match_order, m.status,
    m.score1, m.score2, m.scheduled_time, m.next_match_id,
    m.team1_id, t1.name AS team1_name, t1.tag AS team1_tag, t1.primary_color AS team1_color,
    m.team2_id, t2.name AS team2_name, t2.tag AS team2_tag, t2.primary_color AS team2_color,
    m.winner_id, w.name AS winner_name, w.tag AS winner_tag,
    tr.name AS tournament_name, tr.game_title, tr.match_format
FROM matches m
INNER JOIN tournaments tr ON m.tournament_id = tr.id
LEFT JOIN teams t1 ON m.team1_id = t1.id
LEFT JOIN teams t2 ON m.team2_id = t2.id
LEFT JOIN teams w ON m.winner_id = w.id
WHERE m.tournament_id = ?
ORDER BY m.round_number ASC, m.match_order ASC;
```

#### Query 2: Team Rosters Aggregation with `GROUP_CONCAT`
```sql
SELECT 
    t.id, t.name, t.tag, t.captain_name, t.region, t.primary_color,
    COUNT(p.id) AS player_count,
    GROUP_CONCAT(CONCAT(p.nickname, ' (', p.role, ')') ORDER BY p.is_captain DESC SEPARATOR ', ') AS roster_preview
FROM teams t
LEFT JOIN players p ON t.id = p.team_id
GROUP BY t.id
ORDER BY t.name ASC;
```

---

## **6. User Interface & Screen Descriptions (24INMCAL393 - UID Lab)**

### Figure 1: Tournaments Catalog & Game Disciplines
Displays upcoming, active, and completed tournaments with discipline filtering (League of Legends, CS2, Valorant, Rocket League), prize pool metrics, and registration status.

```text
+--------------------------------------------------------------------------------------------------+
|  ESPORTS ARENA                                 [Tournaments]  [Teams]  [Leaderboard]  [SQL Inspector]  [☀️ Light] |
+--------------------------------------------------------------------------------------------------+
|  PREMIER ESPORTS TOURNAMENTS & CHAMPIONSHIPS                                                      |
|  Active Events: 1  |  Total Prize Pool Managed: $7.08M USD                                        |
|                                                                                                  |
|  [All Events]  [Live Now (1)]  [Upcoming (2)]  [Completed (3)]  |  [CS2] [Valorant] [LoL]         |
|                                                                                                  |
|  +-------------------------------------+  +-------------------------------------+                |
|  | IEM Cologne 2026         [LIVE NOW] |  | 2024 LoL World Championship[FINAL]  |                |
|  | Discipline: Counter-Strike 2        |  | Discipline: League of Legends       |                |
|  | Format: Single Elimination • BO3    |  | Format: Single Elimination • BO5    |                |
|  | Prize Pool: $1,250,000 USD          |  | Prize Pool: $2,225,000 USD          |                |
|  | Venue: LANXESS Arena, Cologne       |  | Venue: The O2 Arena, London         |                |
|  | [View Bracket & Live Matches ->]    |  | [View Historic Bracket ->]          |                |
|  +-------------------------------------+  +-------------------------------------+                |
+--------------------------------------------------------------------------------------------------+
```
*Caption: Figure 1 – Tournaments Catalog featuring multi-game disciplines, prize metrics, and live indicators.*

### Figure 2: Interactive Bracket Tree with Live View & Winner Action Controls
Presents the Challonge-style tournament tree from Quarterfinals to the Grand Finals. Includes the View Option strip and direct `👑 Win [TAG]` manual adjudication buttons on each matchup.

```text
+--------------------------------------------------------------------------------------------------+
|  [ View Option: [ All Bracket Matches (7) ]  [ 🔴 Live Matches (1) ]  [ Upcoming (1) ]  [ Completed (5) ] ]  |
|                                                                                                  |
|  +---------------------------+   +---------------------------+   +---------------------------+   |
|  | MATCH #1        [FINAL]   |   | MATCH #5        [FINAL]   |   | MATCH #7        [UPCOMING]|   |
|  | (1) [TL] Team Liquid   [2]|---| (1) [TL] Team Liquid   [2]|---| (1) [TL] Team Liquid   [0]|   |
|  | (8) [TS] Team Spirit   [1]|   | (4) [SEN] Sentinels    [0]|   | (2) [FAZE] FaZe Clan   [0]|   |
|  +---------------------------+   +---------------------------+   +---------------------------+   |
|  | MATCH #2        [FINAL]   |                                                                   |
|  | (4) [SEN] Sentinels    [2]|                                                                   |
|  | (5) [VIT] Team Vitality [0]|                                                                   |
|  +---------------------------+                                                                   |
|  | MATCH #3         [🔴 LIVE] |   +---------------------------+                                   |
|  | (2) [FAZE] FaZe Clan   [2]|---| MATCH #6        [FINAL]   |                                   |
|  | (7) [FNC] Fnatic       [1]|   | (2) [FAZE] FaZe Clan   [2]|                                   |
|  | [👑 Win FAZE] [Set Live]  |   | (3) [NAVI] Natus Vincere[1]|                                   |
|  +---------------------------+   +---------------------------+                                   |
|  | MATCH #4        [FINAL]   |                                                                   |
|  | (3) [NAVI] NAVI        [2]|                                                                   |
|  | (6) [C9] Cloud9        [0]|                                                                   |
|  +---------------------------+                                                                   |
+--------------------------------------------------------------------------------------------------+
```
*Caption: Figure 2 – Interactive single-elimination bracket tree with live highlight, manual winner controls, and relational progression.*

### Figure 3: Dedicated Live Match Arena Hub
When "Live Matches Only" is activated, the dedicated Live Arena dashboard displays real-time map score steppers, team crests, and direct winner declaration controls.

```text
+--------------------------------------------------------------------------------------------------+
|  🔴 LIVE MATCH ARENA — IN-PROGRESS BROADCAST                                                     |
+--------------------------------------------------------------------------------------------------+
|  MATCH #3 — QUARTERFINALS 3 • BEST OF 3                                                          |
|                                                                                                  |
|         [FAZE] FaZe Clan                     VS                    [FNC] Fnatic                  |
|      Europe • Captain: karrigan          MAP SCORES             Europe • Captain: Boaster        |
|                                                                                                  |
|          [-]   [ 1 ]   [+]                                           [-]   [ 1 ]   [+]           |
|                                                                                                  |
|  DECLARE WINNER (Commits directly to MySQL DBMS & Advances Winner to Semifinals):               |
|  +---------------------------------------+  +---------------------------------------+             |
|  |     👑 Win: FaZe Clan (2-1)           |  |     👑 Win: Fnatic (1-2)              |             |
|  +---------------------------------------+  +---------------------------------------+             |
+--------------------------------------------------------------------------------------------------+
```
*Caption: Figure 3 – Dedicated Live Match Arena Hub featuring real-time map score incrementers and manual winner declaration.*

---

## **7. Advantages, Limitations & Future Enhancements**

### 7.1 Advantages
- **Deterministic Relational Integrity:** Enforces primary key and foreign key constraints, eliminating dangling records and bracket inconsistency.
- **Immediate Operational Responsiveness:** Selecting a winner updates the backend DBMS and advances the winning team in the user interface instantaneously without requiring a full page refresh.
- **Offline LAN Resilience:** Embedded inline SVG crests and local serialization guarantee that the platform functions flawlessly in disconnected local area network environments.
- **Pedagogical SQL Transparency:** The integrated SQL Inspector demystifies complex database operations by exposing live query strings, parameter bindings, and execution telemetry.

### 7.2 Limitations
- **Single-Elimination Focus:** The automated bracket engine currently targets 8-team single-elimination formats; double-elimination lower brackets require additional junction structures.
- **Roster-Level Analytics:** Match scores track team-level map victories; individual player statistics (e.g., individual frags, ADR, assists) are tracked at the roster profile level.
- **Session Authentication:** Access control relies on role-based operational views rather than persistent OAuth/JWT user authentication sessions.

### 7.3 Future Enhancements
- **Double-Elimination & Swiss System Modules:** Implement dynamic lower brackets and Swiss-system qualification stages for larger competitions.
- **Game Server Integration:** Direct integration with Counter-Strike 2 Game State Integration (GSI) and Riot Games APIs for automatic map score updates.
- **Automated Certificate Generation:** Instant generation of digitally signed PDF championship certificates for winning teams upon conclusion of the Grand Finals.

---

## **8. Conclusion**

The **ESPORTS ARENA** project successfully realizes the unified objectives of **RDBMS Lab (24INMCAL391)**, **User Interface and Design Lab (24INMCAL393)**, and **Software Engineering (24INMCAT307)**. By bridging normalized relational database modeling, explicit multi-table SQL join architectures, agile software engineering principles, and a modern component-driven React interface, the project provides a comprehensive solution for managing competitive esports tournaments.

From tournament seeding and live broadcast tracking to automated bracket advancement and historical world championship records, the platform demonstrates how robust relational backend design and empathetic user experience engineering combine to deliver software that is both academically rigorous and practically deployable in competitive environments.

---

## **9. Repository & Links**

- **GitHub Project Repository:**  
  [https://github.com/Clare-Lyz-Mathew/microproject.git](https://github.com/Clare-Lyz-Mathew/microproject.git)
- **Local Application Access:**  
  - Frontend Interface: `http://localhost:3000`  
  - Backend REST API: `http://localhost:5000`  
  - Database Status Telemetry: `http://localhost:5000/api/db/status`
