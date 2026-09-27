const path = require('path');
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const { initDatabase } = require('./config/database');
const seedDatabase = require('./seed/seeder');
const { attachUser } = require('./middleware/auth');
const errorHandler = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/auth');
const opportunityRoutes = require('./routes/opportunities');
const dashboardRoutes = require('./routes/dashboard');
const discoverRoutes = require('./routes/discover');

const app = express();
const PORT = process.env.PORT || 8080;
const SESSION_SECRET = process.env.SESSION_SECRET || 'opportunest_secret_key_2026_student_platform';

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Body parsing, cookie parsing & static files
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser(SESSION_SECRET));
app.use(express.static(path.join(__dirname, '../public')));

// Session configuration
app.use(session({
  secret: SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
  }
}));

// Attach current user & bookmarks to all views
app.use(attachUser);

// Landing page route
app.get('/', (req, res) => {
  if (req.session && req.session.user) {
    return res.redirect('/dashboard');
  }
  res.render('index', { pageTitle: 'OpportuNest - Student Opportunity Discovery Platform' });
});

// Register feature routes
app.use('/', authRoutes);
app.use('/', opportunityRoutes);
app.use('/', dashboardRoutes);
app.use('/', discoverRoutes);

// Global Error Handler
app.use(errorHandler);

// Start server after DB initialization & auto-seeding (standalone only)
async function startServer() {
  try {
    await initDatabase();
    seedDatabase();
    app.listen(PORT, () => {
      console.log(`🚀 OpportuNest server successfully listening on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to initialize OpportuNest database & server:', err);
    process.exit(1);
  }
}

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  startServer();
}

module.exports = app;

