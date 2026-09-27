const express = require('express');
const router = express.Router();
const { getDb } = require('../config/database');
const { requireAuth } = require('../middleware/auth');
const { rankOpportunitiesForUser } = require('../services/recommendationEngine');

// GET /discover
router.get('/discover', requireAuth, (req, res) => {
  const db = getDb();
  const user = res.locals.currentUser;

  const rawOpps = db.prepare("SELECT * FROM opportunities WHERE deadline >= DATE('now')").all();

  const now = new Date();
  const opportunities = rawOpps.map(opp => {
    try { opp.required_skills = JSON.parse(opp.required_skills || '[]'); } catch (e) { opp.required_skills = []; }
    try { opp.tags = JSON.parse(opp.tags || '[]'); } catch (e) { opp.tags = []; }

    const deadlineDate = new Date(opp.deadline);
    const diffTime = deadlineDate - now;
    opp.daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    opp.isBookmarked = res.locals.userBookmarkIds.has(opp.id);
    return opp;
  });

  const rankedDeck = rankOpportunitiesForUser(user, opportunities);

  res.render('discover', {
    deck: rankedDeck,
    pageTitle: 'Discover Mode (Swipe Deck) - OpportuNest'
  });
});

module.exports = router;
