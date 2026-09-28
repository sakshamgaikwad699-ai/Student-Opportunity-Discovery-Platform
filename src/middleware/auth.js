const { getDb } = require('../config/database');

function attachUser(req, res, next) {
  let userId = null;
  if (req.session && req.session.user && req.session.user.id) {
    userId = req.session.user.id;
  } else if (req.signedCookies && req.signedCookies.auth_user_id) {
    userId = parseInt(req.signedCookies.auth_user_id, 10);
  }

  if (userId) {
    try {
      const db = getDb();
      const freshUser = db.prepare("SELECT * FROM users WHERE id = ?").get(userId);
      if (freshUser) {
        try { freshUser.skills = JSON.parse(freshUser.skills || '[]'); } catch (e) { freshUser.skills = []; }
        try { freshUser.interests = JSON.parse(freshUser.interests || '[]'); } catch (e) { freshUser.interests = []; }
        try { freshUser.preferred_categories = JSON.parse(freshUser.preferred_categories || '[]'); } catch (e) { freshUser.preferred_categories = []; }
        
        let score = 0;
        if (freshUser.name) score += 10;
        if (freshUser.email) score += 10;
        if (freshUser.education_level) score += 20;
        if (freshUser.field_of_study) score += 20;
        if (freshUser.skills && freshUser.skills.length > 0) score += 20;
        if (freshUser.interests && freshUser.interests.length > 0) score += 10;
        if (freshUser.preferred_categories && freshUser.preferred_categories.length > 0) score += 10;
        freshUser.completionPercentage = Math.min(score, 100);

        if (req.session) {
          req.session.user = freshUser;
        }
        res.locals.currentUser = freshUser;

        const userBookmarks = db.prepare("SELECT opportunity_id FROM bookmarks WHERE user_id = ?").all(freshUser.id);
        res.locals.userBookmarkIds = new Set(userBookmarks.map(b => b.opportunity_id));
        return next();
      }
    } catch (e) {
      console.error('attachUser lookup error:', e.message);
    }
  }

  if (req.session) {
    req.session.user = null;
  }
  res.locals.currentUser = null;
  res.locals.userBookmarkIds = new Set();
  next();
}

function requireAuth(req, res, next) {
  const hasUser = res.locals.currentUser || (req.session && req.session.user) || (req.signedCookies && req.signedCookies.auth_user_id);
  if (!hasUser) {
    if (req.xhr || (req.headers.accept && req.headers.accept.includes('application/json'))) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    return res.redirect('/login');
  }
  next();
}

module.exports = { attachUser, requireAuth };
