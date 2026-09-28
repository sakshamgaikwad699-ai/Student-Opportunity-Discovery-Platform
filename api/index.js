const app = require('../src/app');
const { initDatabase } = require('../src/config/database');
const seedDatabase = require('../src/seed/seeder');

let initPromise = null;

async function ensureInitialized() {
  if (!initPromise) {
    initPromise = (async () => {
      await initDatabase();
      seedDatabase();
    })();
  }
  return initPromise;
}

module.exports = async (req, res) => {
  try {
    await ensureInitialized();
  } catch (err) {
    console.error('Fatal initialization error in serverless handler:', err);
    return res.status(500).send(`Server initialization error: ${err.message || err}`);
  }
  return app(req, res);
};

