# 🎮 ESPORTS ARENA: Universal Tournament & Bracket Management System

A full-stack, responsive, and intuitive **eSports Tournament & Bracket Management System** built with **React 19**, **Express**, and **MySQL Relational JOIN Architecture**. 

Designed for **both online and offline LAN tournaments** across all popular competitive disciplines (CS2, Valorant, Rocket League, Dota 2, Fighting Games, etc.) as well as **custom user-defined games**.

---

## 🌟 What's New & Core Capabilities

- **Universal Multi-Game Architecture & Pro Teams**:
  - Pre-seeded with 18 premier world organizations (**T1**, **Gen.G**, **Bilibili Gaming**, **G2 Esports**, **Paper Rex**, **EDward Gaming**, **Weibo Gaming**, **Top Esports**, **Hanwha Life Esports**, **FlyQuest**, **Team Liquid**, **FaZe Clan**, **NAVI**, **Sentinels**, **Vitality**, **Cloud9**, **Fnatic**, **Spirit**).
  - Authentic historic championship brackets including **2024 League of Legends World Championship (Knockout Stage)** (T1 5th World Championship) and **VALORANT Champions 2024 (Playoffs)** (EDG World Champions).
  - Out-of-the-box support for **League of Legends**, **Counter-Strike 2**, **Valorant**, **Rocket League**, **Dota 2**, **Rainbow Six Siege**, **Apex Legends**, **Overwatch 2**, and **Custom Games**.
- **Live Match View & Live Hub**:
  - Toggle between **All Bracket Matches**, **🔴 Live Matches Only**, **Upcoming**, and **Completed**.
  - Interactive **Live Match Hub** with real-time map score counters (`+`/`-`), live pulsating indicators, and direct in-game management.
- **Manual Winner Selection & Direct DBMS Advancement**:
  - Direct 1-click **`👑 Win [TAG]`** buttons on every match card and in score modals to manually designate the winning team.
  - Automatically updates MySQL database and advances the winner into subsequent rounds via relational lineage.
- **Multi-Table Relational MySQL JOIN Queries**:
  - Explicit `INNER JOIN`, `LEFT JOIN`, `GROUP BY`, and `GROUP_CONCAT` queries connecting tournaments, teams, players, seedings, and matches.
  - Dedicated **SQL JOINs & Relational Inspector** page (`/sql-joins`) with ER diagram and live query runner.
  - Interactive SQL syntax drawer on every view.
- **Dual-Mode Database Architecture (Zero-Setup)**:
  - Connects to your local MySQL 8.x instance on `127.0.0.1:3306` with schema in [`server/db/schema.sql`](file:///c:/Users/ACER/OneDrive/Desktop/Unwanted/esports-arena/server/db/schema.sql).
  - Automatically operates in offline local engine mode if MySQL is not running, with a 1-click **Test / Reconnect** button.

---

## 📂 Project Structure

```text
esports-arena/
├── package.json               # Root scripts to run client & server concurrently
├── README.md                  # Project documentation
├── server/                    # Node.js + Express + MySQL API
│   ├── .env                   # Database credentials (DB_HOST, DB_USER, etc.)
│   ├── server.js              # REST API endpoints & LAN export/import routes
│   └── db/
│       ├── schema.sql         # Universal multi-game DDL tables, foreign keys & seed data
│       ├── queries.js         # Explicit SQL queries with JOINs
│       └── connection.js      # MySQL2 pool with offline LAN engine & bracket advancement
└── client/                    # Vite + React 19 Frontend
    ├── index.html             # Google fonts & meta tags
    ├── vite.config.js         # Proxy configuration (/api -> localhost:5000)
    └── src/
        ├── App.jsx            # React Router multi-view routing
        ├── index.css          # Dark & soft titanium light themes, bracket styling
        ├── hooks/
        │   └── useApi.js      # Custom API fetch hook with SQL tracking
        ├── components/
        │   ├── Navbar.jsx               # Navigation, theme toggle, and LAN status pill
        │   ├── TeamCrest.jsx            # Offline SVG team emblems generator
        │   ├── BracketTree.jsx          # Interactive 3-round tournament bracket
        │   ├── MatchScoreModal.jsx      # Score editing & auto-advancement modal
        │   ├── DatabaseStatusModal.jsx  # Connection diagnostics & reconnect tool
        │   └── SqlQueryDrawer.jsx       # Expandable SQL syntax viewer
        └── pages/
            ├── TournamentsPage.jsx      # Multi-game events catalog, LAN JSON import
            ├── TournamentDetailPage.jsx # Interactive Bracket, Teams & LAN JSON export
            ├── TeamsPage.jsx            # Multi-game teams & rosters directory
            ├── LeaderboardPage.jsx      # Global podium & win-rate standings
            ├── SqlInspectorPage.jsx     # ER diagram & SQL JOIN playground
            └── CreateTournamentPage.jsx # Popular & custom games tournament wizard
```

---

## 🚀 Quick Start (Running Locally)

### 1. Unified Launch (Runs Both Backend & Frontend)
From the `esports-arena` directory:
```bash
npm start
```
- **React Frontend**: [http://localhost:3000](http://localhost:3000)
- **Express API**: [http://localhost:5000](http://localhost:5000)

### 2. Running Individually (Optional)
**Terminal 1 (Backend Server):**
```bash
cd server
npm start
```

**Terminal 2 (Frontend Client):**
```bash
cd client
npm run dev
```

---

## 🗄️ MySQL Database Setup (Optional)

1. Open your MySQL client (MySQL Workbench, phpMyAdmin, or Command Line).
2. Run the script [`server/db/schema.sql`](file:///c:/Users/ACER/OneDrive/Desktop/Unwanted/esports-arena/server/db/schema.sql):
   ```sql
   SOURCE server/db/schema.sql;
   ```
3. Update your credentials in [`server/.env`](file:///c:/Users/ACER/OneDrive/Desktop/Unwanted/esports-arena/server/.env) if needed.
4. Click the **Database Status** button in the web app and click **Test / Reconnect MySQL**.
