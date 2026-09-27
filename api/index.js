const app = require('../src/app');
const { initDatabase } = require('../src/config/database');
const seedDatabase = require('../src/seed/seeder');

let isInitialized = false;

module.exports = async (req, res) => {
  if (!isInitialized) {
    try {
      await initDatabase();
      seedDatabase();
      isInitialized = true;
    } catch (err) {
      console.error('Initialization error in serverless function:', err);
    }
  }
  return app(req, res);
};
