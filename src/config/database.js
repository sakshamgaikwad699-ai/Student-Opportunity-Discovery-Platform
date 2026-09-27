const fs = require('fs');
const path = require('path');

// In Vercel serverless functions, only /tmp is writable
const dataDir = process.env.VERCEL ? '/tmp' : path.join(__dirname, '../../data');
if (!fs.existsSync(dataDir)) {
  try {
    fs.mkdirSync(dataDir, { recursive: true });
  } catch (e) {}
}

const dbPath = path.join(dataDir, 'opportunest.db');


let db = null;

class SqlJsAdapter {
  constructor(SQL, dbFile) {
    this.SQL = SQL;
    this.dbFile = dbFile;
    if (fs.existsSync(dbFile)) {
      const buffer = fs.readFileSync(dbFile);
      this.rawDb = new SQL.Database(buffer);
    } else {
      this.rawDb = new SQL.Database();
      this.save();
    }
  }

  save() {
    try {
      const data = this.rawDb.export();
      const buffer = Buffer.from(data);
      fs.writeFileSync(this.dbFile, buffer);
    } catch (e) {
      console.error('Error writing SQLite file to disk:', e);
    }
  }

  exec(sql) {
    this.rawDb.exec(sql);
    this.save();
  }

  pragma(str) {
    try {
      this.rawDb.exec(`PRAGMA ${str};`);
    } catch (e) {}
  }

  prepare(sql) {
    const self = this;
    return {
      get(...params) {
        const flatParams = params.length === 1 && Array.isArray(params[0]) ? params[0] : params;
        const stmt = self.rawDb.prepare(sql);
        if (flatParams.length > 0) {
          stmt.bind(flatParams);
        }
        let row = undefined;
        if (stmt.step()) {
          row = stmt.getAsObject();
        }
        stmt.free();
        return row;
      },
      all(...params) {
        const flatParams = params.length === 1 && Array.isArray(params[0]) ? params[0] : params;
        const stmt = self.rawDb.prepare(sql);
        if (flatParams.length > 0) {
          stmt.bind(flatParams);
        }
        const rows = [];
        while (stmt.step()) {
          rows.push(stmt.getAsObject());
        }
        stmt.free();
        return rows;
      },
      run(...params) {
        const flatParams = params.length === 1 && Array.isArray(params[0]) ? params[0] : params;
        self.rawDb.run(sql, flatParams);
        const res = self.rawDb.exec("SELECT last_insert_rowid() as id, changes() as changes");
        let lastInsertRowid = 0;
        let changes = 0;
        if (res.length > 0 && res[0].values.length > 0) {
          lastInsertRowid = res[0].values[0][0];
          changes = res[0].values[0][1];
        }
        self.save();
        return { lastInsertRowid, changes };
      }
    };
  }
}

async function initDatabase() {
  if (db) return db;

  try {
    const BetterSqlite3 = require('better-sqlite3');
    const nativeDb = new BetterSqlite3(dbPath);
    nativeDb.pragma('journal_mode = WAL');
    nativeDb.pragma('foreign_keys = ON');
    db = nativeDb;
    console.log('Successfully initialized native better-sqlite3 database.');
  } catch (err) {
    console.log('Native better-sqlite3 unavailable. Using sql.js fallback driver.');
    const initSqlJs = require('sql.js');
    const SQL = await initSqlJs();
    db = new SqlJsAdapter(SQL, dbPath);
    db.pragma('foreign_keys = ON');
    console.log('Successfully initialized sql.js persistent database adapter.');
  }

  // Schema creation
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      education_level TEXT DEFAULT 'Undergraduate',
      field_of_study TEXT DEFAULT 'Computer Science',
      skills TEXT DEFAULT '[]',
      interests TEXT DEFAULT '[]',
      preferred_categories TEXT DEFAULT '[]',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS opportunities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      organization TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT NOT NULL,
      required_skills TEXT DEFAULT '[]',
      tags TEXT DEFAULT '[]',
      eligibility TEXT DEFAULT 'All Students',
      deadline DATE NOT NULL,
      external_link TEXT NOT NULL,
      location TEXT DEFAULT 'Remote',
      posted_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS bookmarks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      opportunity_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, opportunity_id),
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY(opportunity_id) REFERENCES opportunities(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS skill_gap_cache (
      user_id INTEGER NOT NULL,
      missing_skill TEXT NOT NULL,
      frequency_count INTEGER DEFAULT 0,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY(user_id, missing_skill)
    );
  `);

  return db;
}

function getDb() {
  if (!db) {
    throw new Error("Database not initialized yet! Call initDatabase() first.");
  }
  return db;
}

module.exports = { initDatabase, getDb };
