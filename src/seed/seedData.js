/**
 * Realistic seed data for OpportuNest
 * 26 sample opportunities across all categories with real platform links and varied deadlines.
 */

const getFutureDate = (days) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
};

const sampleOpportunities = [
  // 1. Hackathons
  {
    title: "Global AI & LLM Innovation Hackathon 2026",
    organization: "OpenAI & Anthropic Developer Network",
    category: "hackathon",
    description: "Build groundbreaking generative AI applications, autonomous agents, and RAG systems in a 48-hour virtual hackathon. Over $50,000 in prizes and direct mentorship from leading AI researchers.",
    required_skills: ["Python", "Machine Learning", "PyTorch", "RAG & LLMs", "Node.js"],
    tags: ["Artificial Intelligence", "Generative AI", "Hackathon", "Virtual"],
    eligibility: "Undergraduate, Master's, PhD",
    deadline: getFutureDate(5),
    external_link: "https://devpost.com/hackathons?search=ai",
    location: "Remote"
  },
  {
    title: "Cloud & Web3 Distributed Systems Challenge",
    organization: "AWS Developer Ecosystem",
    category: "hackathon",
    description: "Design resilient microservices, decentralized protocols, and scalable cloud architectures. Compete for cloud credits and internship fast-track opportunities.",
    required_skills: ["React", "Node.js", "Solidity", "AWS", "Docker"],
    tags: ["Cloud Computing", "Web3", "Blockchain", "DevOps"],
    eligibility: "All Students",
    deadline: getFutureDate(18),
    external_link: "https://aws.amazon.com/developer/community/events",
    location: "Hybrid - San Francisco, CA"
  },
  {
    title: "HealthTech & Bio-Informatics Hackathon",
    organization: "MIT Hacking Medicine & Harvard Health",
    category: "hackathon",
    description: "Tackle real-world healthcare challenges using clinical data analysis, predictive modeling, and patient-centric web platforms.",
    required_skills: ["Python", "SQL", "Pandas", "Healthcare Tech", "React"],
    tags: ["Healthcare", "Data Science", "Bioinformatics", "Social Impact"],
    eligibility: "Undergraduate, Master's",
    deadline: getFutureDate(3),
    external_link: "https://hackingmedicine.mit.edu",
    location: "Boston, MA"
  },
  {
    title: "Sustainable Tech & Green Energy Hackathon",
    organization: "CleanEnergy Tech Foundation",
    category: "hackathon",
    description: "Develop smart grid monitoring solutions, carbon footprint trackers, and IoT analytics tools for a cleaner planet.",
    required_skills: ["Python", "Linux", "JavaScript", "SQL", "System Design"],
    tags: ["Sustainability", "IoT", "Data Science", "Environment"],
    eligibility: "All Students",
    deadline: getFutureDate(42),
    external_link: "https://devfolio.co/hackathons",
    location: "Remote"
  },

  // 2. Internships
  {
    title: "Frontend Engineering Intern - Summer 2026",
    organization: "Stripe & Vercel Partner Network",
    category: "internship",
    description: "Join the core UI platform team building ultra-fast dashboard components, design systems, and responsive web applications for millions of global users.",
    required_skills: ["React", "TypeScript", "Tailwind CSS", "Git", "Node.js"],
    tags: ["Frontend", "Web Development", "UI/UX", "Paid Internship"],
    eligibility: "Undergraduate, Master's",
    deadline: getFutureDate(10),
    external_link: "https://vercel.com/careers",
    location: "Remote"
  },
  {
    title: "Backend Software Engineering Intern",
    organization: "Datadog & Cloudflare Ecosystem",
    category: "internship",
    description: "Architect high-throughput RESTful APIs, optimize relational database queries, and implement real-time streaming pipelines.",
    required_skills: ["Node.js", "Express", "SQL", "Docker", "Git"],
    tags: ["Backend", "Software Engineering", "APIs", "Database"],
    eligibility: "Undergraduate, Master's, PhD",
    deadline: getFutureDate(14),
    external_link: "https://www.cloudflare.com/careers",
    location: "New York, NY"
  },
  {
    title: "Data Science & Machine Learning Intern",
    organization: "Spotify Analytics Lab",
    category: "internship",
    description: "Work on recommendation algorithms, user behavior clustering, and large-scale data transformation using Python and SQL data pipelines.",
    required_skills: ["Python", "SQL", "Pandas", "Machine Learning", "Tableau"],
    tags: ["Data Science", "Machine Learning", "Analytics", "Music Tech"],
    eligibility: "Undergraduate, Master's",
    deadline: getFutureDate(7),
    external_link: "https://lifeatspotify.com/jobs",
    location: "Austin, TX"
  },
  {
    title: "Cloud Infrastructure & DevOps Intern",
    organization: "HashiCorp & AWS Education",
    category: "internship",
    description: "Automate CI/CD pipelines, write Infrastructure as Code (Terraform), and manage containerized workloads in Kubernetes clusters.",
    required_skills: ["AWS", "Docker", "Kubernetes", "Linux", "Python"],
    tags: ["DevOps", "Cloud Infrastructure", "Kubernetes", "Automation"],
    eligibility: "Undergraduate, Master's",
    deadline: getFutureDate(30),
    external_link: "https://careers.google.com",
    location: "Seattle, WA"
  },
  {
    title: "Product Design & UX Research Intern",
    organization: "Figma Creator Studio",
    category: "internship",
    description: "Conduct user research, design wireframes, build high-fidelity interactive prototypes, and collaborate directly with product engineers.",
    required_skills: ["Figma", "UI/UX", "User Research", "Tailwind CSS"],
    tags: ["Design", "User Experience", "Product Management"],
    eligibility: "All Students",
    deadline: getFutureDate(12),
    external_link: "https://www.figma.com/careers",
    location: "San Francisco, CA"
  },

  // 3. Scholarships
  {
    title: "NextGen Women in Computer Science Scholarship 2026",
    organization: "AnitaB.org & Tech Diversity Alliance",
    category: "scholarship",
    description: "A $10,000 merit-based educational grant for underrepresented women pursuing degrees in Computer Science, Software Engineering, or Artificial Intelligence.",
    required_skills: ["Computer Science", "Git", "Python", "Leadership"],
    tags: ["Diversity", "Grant", "Women in Tech", "Financial Aid"],
    eligibility: "Undergraduate, Master's",
    deadline: getFutureDate(16),
    external_link: "https://anitab.org/awards-grants",
    location: "Remote / Global"
  },
  {
    title: "STEM Future Leaders Undergraduate Grant",
    organization: "National Science & Technology Foundation",
    category: "scholarship",
    description: "Providing $7,500 tuition aid plus conference travel stipends for students demonstrating technical excellence and research initiative in STEM disciplines.",
    required_skills: ["Python", "Data Structures", "Linux", "SQL"],
    tags: ["STEM", "Undergraduate", "Scholarship", "Research"],
    eligibility: "Undergraduate",
    deadline: getFutureDate(35),
    external_link: "https://www.nsf.gov/funding",
    location: "United States"
  },
  {
    title: "Cybersecurity Diversity Fellowship Grant",
    organization: "Cyber Threat Alliance & SANS Institute",
    category: "scholarship",
    description: "Full scholarship covering GIAC certification training courses, exam vouchers, and one-on-one mentorship with industry CISO leaders.",
    required_skills: ["Cybersecurity", "Linux", "Penetration Testing", "Python"],
    tags: ["Cybersecurity", "Fellowship", "Certification", "InfoSec"],
    eligibility: "All Students",
    deadline: getFutureDate(8),
    external_link: "https://www.sans.org/scholarships",
    location: "Remote"
  },

  // 4. Certifications
  {
    title: "AWS Certified Cloud Practitioner Student Voucher Program",
    organization: "Amazon Web Services Training & Certification",
    category: "certification",
    description: "Get 100% sponsored access to official AWS Cloud Practitioner practice exams, video training courses, and certification exam vouchers.",
    required_skills: ["AWS", "Cloud Computing", "System Design", "Linux"],
    tags: ["AWS", "Certification", "Cloud", "Sponsor"],
    eligibility: "All Students",
    deadline: getFutureDate(60),
    external_link: "https://aws.amazon.com/certification",
    location: "Online / Self-Paced"
  },
  {
    title: "Meta Professional Front-End Developer Certificate Sponsor",
    organization: "Meta & Coursera Education Fund",
    category: "certification",
    description: "Full access scholarship for Meta's 9-course professional frontend certificate covering React, Advanced JavaScript, CSS Frameworks, and UX Design.",
    required_skills: ["React", "JavaScript", "Tailwind CSS", "Git"],
    tags: ["Frontend", "Meta", "Professional Certificate", "React"],
    eligibility: "All Students",
    deadline: getFutureDate(22),
    external_link: "https://www.coursera.org/professional-certificates/meta-front-end-developer",
    location: "Online"
  },
  {
    title: "Google Data Analytics Professional Certification Sponsor",
    organization: "Google Career Certificates Alliance",
    category: "certification",
    description: "Master data cleaning, SQL query optimization, R programming, and data visualization using Tableau with 100% fee waiver.",
    required_skills: ["SQL", "Pandas", "Tableau", "Python"],
    tags: ["Data Analytics", "Google", "SQL", "Tableau"],
    eligibility: "All Students",
    deadline: getFutureDate(45),
    external_link: "https://grow.google/certificates/data-analytics",
    location: "Online"
  },

  // 5. Competitions
  {
    title: "National Algorithmic Competitive Programming Cup",
    organization: "International Collegiate Programming Contest (ICPC)",
    category: "competition",
    description: "Test your speed and mastery over complex dynamic programming, graph algorithms, and number theory against 2,000 top university coders.",
    required_skills: ["C++", "Java", "Algorithms", "Data Structures", "Python"],
    tags: ["Algorithms", "Competitive Programming", "ICPC", "Prizes"],
    eligibility: "Undergraduate, Master's",
    deadline: getFutureDate(4),
    external_link: "https://codeforces.com/contests",
    location: "Remote"
  },
  {
    title: "Kaggle Financial Risk Prediction Challenge",
    organization: "Kaggle & Global Banking Analytics",
    category: "competition",
    description: "Predict credit default risk using anonymized financial transaction logs. $25,000 prize pool and direct recruiter outreach for top 10 leaderboard submissions.",
    required_skills: ["Python", "Machine Learning", "Pandas", "PyTorch", "SQL"],
    tags: ["Kaggle", "Machine Learning", "FinTech", "Data Science"],
    eligibility: "All Students",
    deadline: getFutureDate(13),
    external_link: "https://www.kaggle.com/competitions",
    location: "Online"
  },
  {
    title: "Global Cyber Defense CTF Competition 2026",
    organization: "DefCon Student Chapter & Offensive Security",
    category: "competition",
    description: "Jeopardy-style Capture The Flag challenge featuring reverse engineering, binary exploitation, web security vulnerability hunting, and cryptography.",
    required_skills: ["Cybersecurity", "Linux", "Penetration Testing", "Python", "C++"],
    tags: ["CTF", "Ethical Hacking", "InfoSec", "Competition"],
    eligibility: "All Students",
    deadline: getFutureDate(9),
    external_link: "https://www.hackthebox.com",
    location: "Online"
  },

  // 6. Workshops
  {
    title: "Building Production RAG & Autonomous AI Agents Masterclass",
    organization: "DeepLearning.AI & LangChain",
    category: "workshop",
    description: "Hands-on 1-day live workshop covering vector databases, semantic search chunking strategies, tool-calling agents, and evaluation frameworks.",
    required_skills: ["Python", "RAG & LLMs", "Node.js", "Express"],
    tags: ["AI Agents", "RAG", "LangChain", "Live Workshop"],
    eligibility: "All Students",
    deadline: getFutureDate(6),
    external_link: "https://www.langchain.com",
    location: "Virtual / Zoom"
  },
  {
    title: "Full-Stack System Design & Microservices Architectures",
    organization: "TechLead Mentorship Network",
    category: "workshop",
    description: "Interactive weekend intensive on load balancing, caching strategies (Redis), database sharding, message queues, and API gateways.",
    required_skills: ["System Design", "Node.js", "SQL", "Docker", "Express"],
    tags: ["System Design", "Microservices", "Backend", "Workshop"],
    eligibility: "Undergraduate, Master's, Bootcamp",
    deadline: getFutureDate(11),
    external_link: "https://bytebytego.com",
    location: "Remote"
  },
  {
    title: "Intro to Quantum Computing & Qiskit Hands-On Workshop",
    organization: "IBM Quantum Network",
    category: "workshop",
    description: "Learn quantum gates, superposition, entanglement, and execute algorithms live on IBM Quantum hardware via the Qiskit SDK.",
    required_skills: ["Python", "Linear Algebra", "Algorithms"],
    tags: ["Quantum Computing", "IBM", "Physics", "Workshop"],
    eligibility: "All Students",
    deadline: getFutureDate(2),
    external_link: "https://quantum-computing.ibm.com",
    location: "Virtual"
  },

  // 7. Courses
  {
    title: "Advanced Scalable Backend Architecture with Node.js & Go",
    organization: "Backend Masters Academy",
    category: "course",
    description: "Comprehensive guided course building high-concurrency microservices, gRPC protocol communication, and zero-downtime deployment pipelines.",
    required_skills: ["Node.js", "Express", "SQL", "Docker", "System Design"],
    tags: ["Backend", "Go", "Distributed Systems", "Course"],
    eligibility: "Undergraduate, Master's, Bootcamp",
    deadline: getFutureDate(50),
    external_link: "https://www.educative.io",
    location: "Online / Self-Paced"
  },
  {
    title: "Cross-Platform Mobile App Engineering with Flutter & Firebase",
    organization: "Google Developer Student Clubs",
    category: "course",
    description: "Build iOS and Android applications with single codebase using Flutter, Dart, real-time Firestore database, and authentication.",
    required_skills: ["Flutter", "Dart", "Firebase", "React", "JavaScript"],
    tags: ["Mobile Dev", "Flutter", "Firebase", "App Development"],
    eligibility: "All Students",
    deadline: getFutureDate(24),
    external_link: "https://flutter.dev/learn",
    location: "Online"
  },
  {
    title: "Practical Technical Interview Preparation & Algorithmic Design",
    organization: "LeetCode & Tech Interview Pro",
    category: "course",
    description: "Master patterns for array sliding window, binary tree traversals, dynamic programming, system design whiteboarding, and mock interviews.",
    required_skills: ["Algorithms", "Data Structures", "Python", "Java", "C++"],
    tags: ["Interview Prep", "Algorithms", "Career Prep", "Course"],
    eligibility: "All Students",
    deadline: getFutureDate(15),
    external_link: "https://leetcode.com",
    location: "Online"
  },
  {
    title: "Open Source Software Development & Git Collaborative Workflows",
    organization: "GitHub Education & Linux Foundation",
    category: "course",
    description: "Learn how to navigate large codebases, write effective pull requests, manage issue triage, and contribute meaningfully to major OSS projects.",
    required_skills: ["Git", "GitHub", "Linux", "Python", "React"],
    tags: ["Open Source", "Git", "Collaboration", "Free Course"],
    eligibility: "All Students",
    deadline: getFutureDate(21),
    external_link: "https://www.linuxfoundation.org",
    location: "Online"
  },
  {
    title: "Ethical Hacking & Network Penetration Testing Fundamentals",
    organization: "Offensive Security & Offensive Academy",
    category: "course",
    description: "Learn network scanning with Nmap, packet analysis with Wireshark, web vulnerability exploitation, and ethical disclosure standards.",
    required_skills: ["Cybersecurity", "Penetration Testing", "Linux", "Python"],
    tags: ["Security", "Ethical Hacking", "InfoSec", "Course"],
    eligibility: "All Students",
    deadline: getFutureDate(-5),
    external_link: "https://www.offsec.com",
    location: "Online"
  }
];

module.exports = sampleOpportunities;
