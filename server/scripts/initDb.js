const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function initDatabase() {
  const host = process.env.DB_HOST || '127.0.0.1';
  const port = parseInt(process.env.DB_PORT || '3306', 10);
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || '';
  const database = process.env.DB_NAME || 'esports_db';

  console.log(`[DB Init] Connecting to MySQL server at ${host}:${port}...`);

  try {
    // Connect without database first to ensure server is alive
    const connection = await mysql.createConnection({
      host,
      port,
      user,
      password,
      multipleStatements: true
    });

    console.log('[DB Init] Connected! Reading schema.sql...');
    const schemaPath = path.join(__dirname, '../db/schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    console.log(`[DB Init] Executing schema.sql to initialize ${database}...`);
    await connection.query(schemaSql);

    console.log(`[DB Init] SUCCESS! Database '${database}' initialized with all tables & seed data.`);
    await connection.end();
    return true;
  } catch (err) {
    console.error('[DB Init Error]', err.message);
    return false;
  }
}

if (require.main === module) {
  initDatabase().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = initDatabase;
