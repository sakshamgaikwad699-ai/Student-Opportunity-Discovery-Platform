const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { getDb } = require('../config/database');
const { requireAuth } = require('../middleware/auth');

// GET /signup
router.get('/signup', (req, res) => {
  if (req.session && req.session.user) {
    return res.redirect('/dashboard');
  }
  res.render('signup', { error: null, pageTitle: 'Sign Up - OpportuNest' });
});

// POST /signup
router.post('/signup', (req, res) => {
  const { name, email, password, education_level, field_of_study } = req.body;

  if (!name || !email || !password) {
    return res.render('signup', { error: 'Please provide name, email, and password.', pageTitle: 'Sign Up - OpportuNest' });
  }

  const db = getDb();
  const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email.toLowerCase().trim());
  if (existing) {
    return res.render('signup', { error: 'An account with that email already exists.', pageTitle: 'Sign Up - OpportuNest' });
  }

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  const defaultSkills = JSON.stringify(['Python', 'Git']);
  const defaultInterests = JSON.stringify(['Web Development', 'Artificial Intelligence']);
  const defaultCategories = JSON.stringify(['hackathon', 'internship']);

  const result = db.prepare(`
    INSERT INTO users (name, email, password_hash, education_level, field_of_study, skills, interests, preferred_categories)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    name.trim(),
    email.toLowerCase().trim(),
    hash,
    education_level || 'Undergraduate',
    field_of_study || 'Computer Science',
    defaultSkills,
    defaultInterests,
    defaultCategories
  );

  const newUser = db.prepare("SELECT * FROM users WHERE id = ?").get(result.lastInsertRowid);
  req.session.user = newUser;

  req.session.save((err) => {
    if (err) console.error('Session save error on signup:', err);
    res.redirect('/profile?welcome=1');
  });
});

// GET /login
router.get('/login', (req, res) => {
  if (req.session && req.session.user) {
    return res.redirect('/dashboard');
  }
  res.render('login', { error: null, pageTitle: 'Log In - OpportuNest' });
});

// POST /login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.render('login', { error: 'Please provide email and password.', pageTitle: 'Log In - OpportuNest' });
  }

  const db = getDb();
  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email.toLowerCase().trim());
  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    return res.render('login', { error: 'Invalid email or password.', pageTitle: 'Log In - OpportuNest' });
  }

  req.session.user = user;
  req.session.save((err) => {
    if (err) console.error('Session save error on login:', err);
    res.redirect(303, '/dashboard');
  });
});


// GET & POST /logout
router.all('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});

// GET /profile
router.get('/profile', requireAuth, (req, res) => {
  const db = getDb();
  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(req.session.user.id);
  
  try { user.skills = JSON.parse(user.skills || '[]'); } catch (e) { user.skills = []; }
  try { user.interests = JSON.parse(user.interests || '[]'); } catch (e) { user.interests = []; }
  try { user.preferred_categories = JSON.parse(user.preferred_categories || '[]'); } catch (e) { user.preferred_categories = []; }

  const welcome = req.query.welcome === '1';

  res.render('profile', {
    user,
    welcome,
    successMsg: null,
    errorMsg: null,
    pageTitle: 'My Profile - OpportuNest'
  });
});

// POST /profile
router.post('/profile', requireAuth, (req, res) => {
  const { education_level, field_of_study, skills, interests, preferred_categories } = req.body;

  let skillsArr = [];
  if (typeof skills === 'string') {
    skillsArr = skills.split(',').map(s => s.trim()).filter(Boolean);
  } else if (Array.isArray(skills)) {
    skillsArr = skills.map(s => String(s).trim()).filter(Boolean);
  }

  let interestsArr = [];
  if (typeof interests === 'string') {
    interestsArr = interests.split(',').map(i => i.trim()).filter(Boolean);
  } else if (Array.isArray(interests)) {
    interestsArr = interests.map(i => String(i).trim()).filter(Boolean);
  }

  let categoriesArr = [];
  if (typeof preferred_categories === 'string') {
    categoriesArr = [preferred_categories];
  } else if (Array.isArray(preferred_categories)) {
    categoriesArr = preferred_categories;
  }

  const db = getDb();
  db.prepare(`
    UPDATE users 
    SET education_level = ?, field_of_study = ?, skills = ?, interests = ?, preferred_categories = ?
    WHERE id = ?
  `).run(
    education_level || 'Undergraduate',
    field_of_study || 'Computer Science',
    JSON.stringify(skillsArr),
    JSON.stringify(interestsArr),
    JSON.stringify(categoriesArr),
    req.session.user.id
  );

  const updatedUser = db.prepare("SELECT * FROM users WHERE id = ?").get(req.session.user.id);
  try { updatedUser.skills = JSON.parse(updatedUser.skills || '[]'); } catch (e) { updatedUser.skills = []; }
  try { updatedUser.interests = JSON.parse(updatedUser.interests || '[]'); } catch (e) { updatedUser.interests = []; }
  try { updatedUser.preferred_categories = JSON.parse(updatedUser.preferred_categories || '[]'); } catch (e) { updatedUser.preferred_categories = []; }

  req.session.user = updatedUser;

  res.render('profile', {
    user: updatedUser,
    welcome: false,
    successMsg: 'Profile updated successfully! Your opportunity recommendations have been recalculated.',
    errorMsg: null,
    pageTitle: 'My Profile - OpportuNest'
  });
});

// POST /profile/add-skill (Skill Gap Advisor CTA)
router.post('/profile/add-skill', requireAuth, (req, res) => {
  const { skill } = req.body;
  if (!skill) {
    return res.redirect('/dashboard');
  }

  const db = getDb();
  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(req.session.user.id);
  let currentSkills = [];
  try { currentSkills = JSON.parse(user.skills || '[]'); } catch (e) { currentSkills = []; }

  const skillTrimmed = skill.trim();
  const exists = currentSkills.some(s => s.toLowerCase() === skillTrimmed.toLowerCase());

  if (!exists) {
    currentSkills.push(skillTrimmed);
    db.prepare("UPDATE users SET skills = ? WHERE id = ?").run(
      JSON.stringify(currentSkills),
      user.id
    );
  }

  if (req.xhr || req.headers.accept?.includes('application/json')) {
    return res.json({ success: true, addedSkill: skillTrimmed, newSkills: currentSkills });
  }

  res.redirect('/dashboard?addedSkill=' + encodeURIComponent(skillTrimmed));
});

module.exports = router;
