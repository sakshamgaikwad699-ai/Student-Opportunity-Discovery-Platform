# OpportuNest 🪹 — Student Opportunity Discovery Platform

> **OpportuNest** is a production-ready, full-stack student opportunity discovery web application featuring a rule-based, fully transparent recommendation engine, proactive skill-gap analysis, and a swipeable discovery mode deck.

---

## 🎯 Problem & Solution Summary

**The Problem:**  
Students frequently miss out on critical hackathons, internships, scholarships, certifications, and technical workshops because listings are fragmented across dozens of separate university portals, corporate career pages, and social channels. Furthermore, existing platforms either present static, unranked lists or rely on black-box recommendation models that fail to explain why a student is matched to an opportunity.

**The Solution:**  
**OpportuNest** unifies 26+ sample opportunities across 7 distinct categories into a single platform. Students create a profile once, specifying their academic level, field of study, skills, and interests. OpportuNest automatically scores, ranks, and surfaces opportunities using a **transparent, explainable scoring engine** (no black-box AI API costs or latencies), highlights exact reasons for every recommendation, and computes a **Skill Gap Advisor** insight to guide students on which skill to learn next.

---

## ✨ Features Built & Verified

1. **Student Profile & Preference Center**
   - Session-based Signup / Login / Logout with `bcryptjs` password hashing.
   - Interactive profile manager for education level, field of study, technical skills, interests, and preferred opportunity categories.
   - Dynamic **Profile Completion % Bar** calculating completeness across 6 profile dimensions.
   - Instant Demo Account (`alex@student.edu` / `password123`) for evaluator testing.

2. **Opportunity Search & Multi-Parametric Filtering**
   - Full-text keyword search across titles, organizations, and descriptions.
   - Filter by Category (Hackathon, Internship, Scholarship, Certification, Competition, Workshop, Course).
   - Filter by Location (Remote vs On-Site).
   - Filter by Deadline Range (Closing Soon ≤ 7 days, ≤ 14 days, ≤ 30 days, Active, Expired).
   - Filter by Required Skill dropdown.
   - Sort by Deadline (earliest first), Transparent Match Score, or Newest Posted.

3. **Explainable Recommendation Engine (Core Technical Differentiator)**
   - Rule-based, 100% deterministic & transparent match scoring function:
     - `+3 pts` per overlapping skill (`user.skills` ∩ `opportunity.required_skills`).
     - `+2 pts` per overlapping interest/category match (`user.interests` ∩ `opportunity.tags`).
     - `+1 pt` if eligibility matches user's education level.
     - `+2 pts` urgency boost if deadline ≤ 14 days; `+1 pt` if ≤ 30 days.
   - Every card renders an explicit **"Why Recommended"** chip detailing exact point breakdowns.
   - Top 6 ranked opportunities presented on the Student Dashboard.

4. **⭐ WOW FEATURE 1 — Skill Gap Advisor**
   - Hypothetically executes the scoring function against all skills not currently present in the student's profile.
   - Determines which single skill unlocks the maximum number of additional matching opportunities.
   - Prominently displays: *"Add 'SQL' to your profile to unlock 4 more matching opportunities."*
   - Features a one-click CTA button (`+ Add "SQL" to Profile`) to dynamically update profile skills and recalculate matches.

5. **⭐ WOW FEATURE 2 — Swipeable Discovery Deck Mode**
   - Secondary `/discover` view presenting opportunities one card at a time.
   - Card deck interaction with Left/Right controls:
     - **Swipe Right / Right Arrow Key (<kbd>&rarr;</kbd>):** Save / Bookmark opportunity with toast confirmation.
     - **Swipe Left / Left Arrow Key (<kbd>&larr;</kbd>):** Pass / Skip card.
   - CSS transform animations, counter badge (`Card X of Y`), and end-of-deck celebration screen.

6. **Save / Bookmark Manager**
   - One-click AJAX bookmark toggle on list cards, detail pages, and swipe deck.
   - Dedicated `/bookmarks` page managing all saved opportunities.

7. **Opportunity Details Page**
   - Comprehensive view with eligibility badges, deadline countdown timers, required skills, tags, organization, bookmark controls, match breakdown, and external application links opening in new browser tabs.

8. **Dashboard Category Breakdown Chart**
   - Pure CSS multi-segment bar chart showing active opportunity distribution across all 7 categories without heavy external charting libraries.

---

## 🛠️ Tech Stack Table

| Layer | Technology Choice | Rationale |
| :--- | :--- | :--- |
| **Backend** | Node.js + Express | Fast, lightweight server-side routing & middleware chain. |
| **Database** | SQLite via `better-sqlite3` (with pure-JS `sql.js` fallback) | Zero external DB setup required, file-persisted at `./data/opportunest.db`. Auto-seeds on first launch. |
| **Frontend** | Server-rendered EJS + Vanilla JS | Fast SSR without heavy JS client bundles or build steps. |
| **Styling** | Tailwind CSS via CDN | Utility-first, mobile-responsive modern card UI. |
| **Auth** | `express-session` + `bcryptjs` | Secure session cookie auth without paid 3rd-party OAuth. |
| **Container** | Docker (Alpine Node 20) | Cloud Run ready, listens on `process.env.PORT` (default `8080`). |

---

## 🧠 How the Recommendation & Skill Gap Advisor Work

### 1. Explainable Scoring Engine Math

Given a user $U$ and an opportunity $O$:
$$\text{Score}(U, O) = 3 \cdot |U.\text{skills} \cap O.\text{required\_skills}| + 2 \cdot |U.\text{interests} \cap O.\text{tags}| + \text{EligScore}(U, O) + \text{UrgencyBoost}(O.\text{deadline})$$

- **Skill Overlap:** Each matching skill awards $+3$ points. If a user possesses `Python` and `React`, and an opportunity requires both, the user receives $+6$ match points.
- **Interest & Category Overlap:** Matching user interests against opportunity tags or preferred categories awards $+2$ points each.
- **Education Eligibility:** If $O.\text{eligibility}$ matches $U.\text{education\_level}$ (or applies to all students), $+1$ point is added.
- **Urgency Boost:** Active listings closing in $\le 14$ days receive $+2$ points; listings closing in $15-30$ days receive $+1$ point.

### 2. Skill Gap Advisor Reasoning

For every skill $S \notin U.\text{skills}$ present in the opportunity catalog:
1. Construct a hypothetical profile $U' = U \cup \{S\}$.
2. Run $\text{Score}(U', O)$ for all active opportunities.
3. Count how many opportunities gain $+3$ points or transition into a high-relevance match tier.
4. Select the top missing skill $S^*$ with the highest opportunity gain count and display an actionable CTA.

---

## 📁 Workspace Folder Structure

```
c:\Student Opportunity Discovery Platform\
├── Dockerfile                  # Production Docker container setup
├── .dockerignore               # Container build exclusions
├── .env.example                # Environment variable defaults
├── package.json                # Dependencies descriptor
├── README.md                   # Complete documentation
├── public/
│   ├── css/
│   │   └── custom.css          # Category badges & swipe animations
│   └── js/
│       ├── bookmarkToggle.js   # AJAX bookmark interaction
│       └── swipeCard.js        # ⭐ WOW Discover deck swiper
└── src/
    ├── app.js                  # Main server entry point
    ├── config/
    │   └── database.js         # SQLite connection & schema initialization
    ├── middleware/
    │   ├── auth.js             # Session authentication & user context
    │   └── errorHandler.js     # Global error handling
    ├── routes/
    │   ├── auth.js             # Login, signup, logout, profile
    │   ├── dashboard.js        # Dashboard, stats, skill gap advisor
    │   ├── discover.js         # ⭐ WOW Swipeable deck route
    │   └── opportunities.js    # Search, filter, details, bookmarks
    ├── seed/
    │   ├── seedData.js         # 26 realistic seed opportunities
    │   └── seeder.js           # Auto-seeding logic
    ├── services/
    │   ├── recommendationEngine.js # Transparent scoring algorithm
    │   └── skillGapAdvisor.js      # ⭐ WOW Skill gap analyzer
    └── views/
        ├── index.ejs           # Landing page
        ├── login.ejs           # Login page
        ├── signup.ejs          # Signup page
        ├── profile.ejs         # Profile manager
        ├── dashboard.ejs       # Student dashboard
        ├── opportunities.ejs   # Search & filter list
        ├── detail.ejs          # Opportunity details
        ├── bookmarks.ejs       # Saved bookmarks
        ├── discover.ejs        # ⭐ WOW Swipeable deck view
        └── partials/
            ├── header.ejs      # Responsive navbar & head
            └── footer.ejs      # Shared footer
```

---

## 🚀 Local Setup Instructions

1. **Clone or navigate to workspace:**
   ```bash
   cd "c:\Student Opportunity Discovery Platform"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the application:**
   ```bash
   npm start
   ```

4. **Access in browser:**  
   Open `http://localhost:8080` in your web browser.

5. **Demo Evaluator Login:**
   - **Email:** `alex@student.edu`
   - **Password:** `password123`

---

## ☁️ Google Cloud Run Deployment Guide

Follow these exact CLI commands to deploy OpportuNest to Google Cloud Run:

### 1. Set Google Cloud Project & Region
```bash
gcloud config set project YOUR_GCP_PROJECT_ID
export REGION="us-central1"
export SERVICE_NAME="opportunest-platform"
```

### 2. Enable Required APIs & Create Artifact Registry Repository
```bash
gcloud services enable artifactregistry.googleapis.com run.googleapis.com cloudbuild.googleapis.com

gcloud artifacts repositories create opportunest-repo \
    --repository-format=docker \
    --location=$REGION \
    --description="OpportuNest Docker Repository"
```

### 3. Build & Push Container Image
```bash
gcloud builds submit --tag $REGION-docker.pkg.dev/YOUR_GCP_PROJECT_ID/opportunest-repo/$SERVICE_NAME:v1 .
```

### 4. Deploy to Google Cloud Run
```bash
gcloud run deploy $SERVICE_NAME \
    --image=$REGION-docker.pkg.dev/YOUR_GCP_PROJECT_ID/opportunest-repo/$SERVICE_NAME:v1 \
    --platform=managed \
    --region=$REGION \
    --allow-unauthenticated \
    --port=8080 \
    --set-env-vars NODE_ENV=production,SESSION_SECRET=opportunest_prod_secret_2026
```

Once deployed, Google Cloud Run will output a public HTTPS URL (e.g., `https://opportunest-platform-xyz-uc.a.run.app`) ready for immediate judge evaluation.

---

## 🖼️ Application Interface Previews

- **Landing Page (`/`):** Clean hero section with problem/solution statement and one-click demo login.
- **Student Dashboard (`/dashboard`):** Real-time profile completeness bar, category breakdown CSS chart, top 6 explainable recommendations, and the **Skill Gap Advisor banner**.
- **Swipeable Discover Deck (`/discover`):** Large interactive opportunity deck with smooth card swiping and keyboard arrow shortcuts.
- **Opportunity Search (`/opportunities`):** Multi-parametric filtering by category, deadline range, location, and required skills.
- **Opportunity Detail (`/opportunities/:id`):** Deep-dive view with transparent recommendation point breakdown and direct external application links.
