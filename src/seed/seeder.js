const bcrypt = require('bcryptjs');
const { getDb } = require('../config/database');
const sampleOpportunities = require('./seedData');

function seedDatabase() {
  const db = getDb();
  
  // Check count of opportunities
  const countRow = db.prepare("SELECT COUNT(*) as count FROM opportunities").get();
  if (countRow.count === 0) {
    console.log('Seeding initial 26 opportunities...');
    const insertStmt = db.prepare(`
      INSERT INTO opportunities (title, organization, category, description, required_skills, tags, eligibility, deadline, external_link, location)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const opp of sampleOpportunities) {
      insertStmt.run(
        opp.title,
        opp.organization,
        opp.category,
        opp.description,
        JSON.stringify(opp.required_skills),
        JSON.stringify(opp.tags),
        opp.eligibility,
        opp.deadline,
        opp.external_link,
        opp.location
      );
    }
    console.log('Opportunities successfully seeded!');
  } else {
    console.log(`Database already has ${countRow.count} opportunities. Refreshing any placeholder links...`);
    const updateStmt = db.prepare("UPDATE opportunities SET external_link = ? WHERE title = ? AND (external_link LIKE '%example.com%' OR external_link IS NULL)");
    for (const opp of sampleOpportunities) {
      updateStmt.run(opp.external_link, opp.title);
    }
  }

  // Check demo user
  const userCount = db.prepare("SELECT COUNT(*) as count FROM users").get();
  if (userCount.count === 0) {
    console.log('Seeding initial demo student account...');
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync('password123', salt);

    db.prepare(`
      INSERT INTO users (name, email, password_hash, education_level, field_of_study, skills, interests, preferred_categories)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      'Alex Rivera',
      'alex@student.edu',
      hash,
      'Undergraduate',
      'Computer Science',
      JSON.stringify(['Python', 'React', 'Node.js', 'SQL', 'Git']),
      JSON.stringify(['Artificial Intelligence', 'Web Development', 'Data Science', 'Hackathon']),
      JSON.stringify(['hackathon', 'internship', 'scholarship', 'workshop'])
    );
    console.log('Demo student account created: alex@student.edu / password123');
  }
}

module.exports = seedDatabase;
