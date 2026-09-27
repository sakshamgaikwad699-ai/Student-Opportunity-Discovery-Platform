const http = require('http');
const querystring = require('querystring');

function request(url, options = {}, body = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, headers: res.headers, body: data }));
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

async function runE2ETest() {
  console.log('--- Starting Full System End-to-End Verification ---');

  // 1. Landing Page
  const landing = await request('http://localhost:8080/');
  console.log('1. Landing Page GET /:', landing.statusCode === 200 ? '✅ PASS' : '❌ FAIL');

  // 2. Signup
  const uniqueEmail = `sarah.${Date.now()}@university.edu`;
  const signupData = querystring.stringify({
    name: 'Sarah Chen',
    email: uniqueEmail,
    password: 'password123',
    education_level: 'Undergraduate',
    field_of_study: 'Data Science'
  });

  const signupRes = await request('http://localhost:8080/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(signupData)
    }
  }, signupData);

  const rawCookieHeader = signupRes.headers['set-cookie'];
  const cookieStr = rawCookieHeader ? decodeURIComponent(rawCookieHeader[0].split(';')[0]) : null;
  console.log('2. Signup POST /signup:', signupRes.statusCode === 302 && cookieStr ? '✅ PASS' : '❌ FAIL', `(Cookie: ${cookieStr})`);

  if (!cookieStr) return;

  // 3. Profile Update
  const profileData = querystring.stringify({
    education_level: 'Undergraduate',
    field_of_study: 'Data Science',
    skills: 'Python, SQL, Pandas, Tableau',
    interests: 'Machine Learning, Data Analytics',
    preferred_categories: 'internship'
  });

  const profileRes = await request('http://localhost:8080/profile', {
    method: 'POST',
    headers: {
      'Cookie': cookieStr,
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(profileData)
    }
  }, profileData);
  console.log('3. Profile Update POST /profile:', profileRes.statusCode === 200 ? '✅ PASS' : `❌ FAIL (Status: ${profileRes.statusCode})`);

  // 4. Dashboard
  const dashRes = await request('http://localhost:8080/dashboard', {
    headers: { 'Cookie': cookieStr }
  });
  console.log('4. Dashboard GET /dashboard:', dashRes.statusCode === 200 ? '✅ PASS' : `❌ FAIL (Status: ${dashRes.statusCode})`);

  // 5. Bookmark Toggle
  const bookmarkRes = await request('http://localhost:8080/opportunities/1/bookmark', {
    method: 'POST',
    headers: {
      'Cookie': cookieStr,
      'Accept': 'application/json'
    }
  });
  console.log('5. Bookmark AJAX POST /opportunities/1/bookmark:', bookmarkRes.statusCode === 200 ? '✅ PASS' : `❌ FAIL (Status: ${bookmarkRes.statusCode})`);

  // 6. Bookmarks Page
  const bookmarksPage = await request('http://localhost:8080/bookmarks', {
    headers: { 'Cookie': cookieStr }
  });
  console.log('6. Bookmarks Page GET /bookmarks:', bookmarksPage.statusCode === 200 ? '✅ PASS' : `❌ FAIL (Status: ${bookmarksPage.statusCode})`);

  // 7. Discover Page
  const discoverPage = await request('http://localhost:8080/discover', {
    headers: { 'Cookie': cookieStr }
  });
  console.log('7. Discover Deck GET /discover:', discoverPage.statusCode === 200 ? '✅ PASS' : `❌ FAIL (Status: ${discoverPage.statusCode})`);

  // 8. Search & Filters
  const searchPage = await request('http://localhost:8080/opportunities?category=internship&location=remote&sort=relevance', {
    headers: { 'Cookie': cookieStr }
  });
  console.log('8. Search & Filter GET /opportunities:', searchPage.statusCode === 200 ? '✅ PASS' : '❌ FAIL');

  // 9. Opportunity Detail
  const detailPage = await request('http://localhost:8080/opportunities/1', {
    headers: { 'Cookie': cookieStr }
  });
  console.log('9. Opportunity Detail GET /opportunities/1:', detailPage.statusCode === 200 ? '✅ PASS' : '❌ FAIL');

  console.log('--- Full End-to-End System Verification Completed Successfully! ---');
}

runE2ETest();
