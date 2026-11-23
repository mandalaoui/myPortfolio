// Projects shown in the Projects section, in display order.
//
// featured: true  -> large card in the sideways-scrolling track (with highlights)
// featured: false -> row in the "More projects" index below it
//
// Fields:
//   type        "independent" | "client" | "academic" (badge on every card)
//   ai          true adds the "AI" badge
//   summary     one sentence: what the project is / what it does
//   short       condensed line for the "More projects" index rows
//   highlights  2-3 bullets (featured cards only)
//   tags        up to 5 (featured) / 4 (compact)
//   github, live, video  optional; each one present becomes a button
export const projectsData = [
  // ─── Featured ───────────────────────────────────────────────
  {
    id: 1,
    featured: true,
    title: "AI Control Center",
    type: "independent",
    ai: true,
    image: "images/AIControlCenter.webp",
    summary:
      "An AI usage intelligence platform that shows teams where their AI spend really goes.",
    highlights: [
      "Deterministic analytics for cost, ROI, efficiency and waste across teams and tools",
      "Surfaces optimization opportunities from the data",
      "Natural-language AI insights (Groq / Llama) on top of the numbers"
    ],
    tags: ["Next.js", "TypeScript", "Groq / Llama", "Recharts", "Vercel"],
    github: "https://github.com/mandalaoui/AIControlCenter",
    live: "https://ai-control-center-omer.vercel.app/"
  },
  {
    id: 2,
    featured: true,
    title: "AI Automation Marketplace",
    type: "academic",
    ai: true,
    image: "images/AI_Marketplace.webp",
    video: "videos/AI_Marketplace.mp4",
    summary:
      "A marketplace where creators build AI automations and sell them as products.",
    highlights: [
      "Visual, node-based workflow builder for AI-agent and automation products",
      "Review-and-publish flow that turns a workflow into a purchasable product",
      "Each purchase gives the customer their own running instance"
    ],
    tags: ["Angular", "Node.js", "PostgreSQL", "Docker Compose", "AI Integration"],
    github: "https://github.com/mandalaoui/LOT"
  },
  {
    id: 3,
    featured: true,
    title: "WanderWise",
    type: "independent",
    ai: true,
    image: "images/wanderwise.webp",
    video: "https://res.cloudinary.com/dpwwlrcvz/video/upload/v1771521863/wanderwise_bq3gbz.mp4",
    summary:
      "An AI-assisted trip planner that builds personalized multi-day itineraries.",
    highlights: [
      "Itineraries generated from each user's preferences",
      "Structured AI output processing via OpenRouter",
      "Backend services and APIs with persistent data and JWT authentication"
    ],
    tags: ["React", "Node.js", "MongoDB", "OpenRouter", "Docker"],
    github: "https://github.com/mandalaoui/WanderWise"
  },
  {
    id: 4,
    featured: true,
    title: "Teacher Assistant AI",
    type: "academic",
    ai: true,
    image: "images/TeacherAssistantAI.webp",
    video: "https://res.cloudinary.com/dpwwlrcvz/video/upload/v1771521854/TeacherAssistantAI_nhtibi.mp4",
    summary:
      "An academic project: an AI research assistant that answers questions from real scholarly data, using RAG over a relational database.",
    highlights: [
      "ETL pipeline that loads scholarly data from OpenAlex into MySQL",
      "RAG: relevant data is retrieved with SQL and passed to the model, so answers stay grounded",
      "Answers and research guidance generated with Groq, plus SQL-based exploration and charts"
    ],
    tags: ["TypeScript", "MySQL", "ETL", "OpenAlex", "Groq"],
    github: "https://github.com/mandalaoui/TeacherAssistantAI"
  },
  {
    id: 8,
    featured: true,
    title: "Mortgage AI",
    type: "client",
    ai: true,
    image: "images/mortgAI.webp",
    summary: "A mortgage platform for a client that turns financial data into clear, AI-written mortgage insights.",
    highlights: [
      "Live in production for the client",
      "Generates clear, natural-language mortgage insights with the OpenAI API",
      "CI/CD pipeline with GitHub Actions"
    ],
    tags: ["React", "Node.js", "OpenAI API", "CI/CD"],
    live: "https://mortgage-ai.netlify.app/"
  },
  {
    id: 5,
    featured: true,
    title: "Real Estate Platform",
    type: "client",
    ai: true,
    image: "images/rannadlan.webp",
    summary:
      "The platform a real-estate business runs on: listings, leads, valuations and content, managed from one private admin.",
    highlights: [
      "Live and in daily use by the client",
      "Custom valuation tool and a private admin CMS",
      "LLM-powered content pipeline"
    ],
    tags: ["React", "TypeScript", "MongoDB", "LLM Integration", "Netlify"],
    live: "https://ran-nadlan.netlify.app/"
  },

  // ─── More projects ──────────────────────────────────────────
  {
    id: 14,
    featured: false,
    title: "Family Vehicle Manager",
    short: "Household vehicle renewals, Hebrew app",
    type: "independent",
    image: "images/family-vehicle-manager.webp",
    summary:
      "Keeps a household's vehicle renewals on track in a secure, multi-user Hebrew app.",
    tags: ["Next.js", "TypeScript", "Supabase", "Google OAuth"],
    github: "https://github.com/mandalaoui/family-vehicle-manager",
    live: "https://family-vehicle-manager.vercel.app/"
  },
  {
    id: 6,
    featured: false,
    title: "Netfilm",
    short: "Streaming, web and Android clients",
    type: "academic",
    image: "images/netfilm.webp",
    video: "https://res.cloudinary.com/dpwwlrcvz/video/upload/v1771521858/Netfilm_rkigdk.mp4",
    summary:
      "A movie streaming system with web and Android clients sharing one secure REST backend.",
    tags: ["React", "Node.js", "MongoDB", "Android"],
    github: "https://github.com/mandalaoui/Netfilm"
  },
  {
    id: 7,
    featured: false,
    title: "Coupon Marketplace",
    short: "Coupon store with atomic purchases",
    type: "independent",
    image: "images/couponMarketplace.webp",
    video: "videos/couponMarketplace.mp4",
    summary:
      "A digital coupon store with customer, admin and reseller flows, and atomic purchases that prevent duplicate sales.",
    tags: ["React", "Node.js", "MongoDB", "Docker Compose"],
    github: "https://github.com/mandalaoui/Coupon-Marketplace"
  },
  {
    id: 9,
    featured: false,
    title: "Argentina Travel Companion",
    short: "The whole trip in one app",
    type: "independent",
    image: "images/Argentina.webp",
    summary:
      "One app for the whole trip: itinerary, maps, live data, saved documents, translation and a location-based travel journal.",
    tags: ["Full-Stack", "External APIs", "Database", "Vercel"],
    github: "https://github.com/mandalaoui/Argentina-2026",
    live: "https://argentina-2026-mandalaoui.vercel.app/"
  },
  {
    id: 10,
    featured: false,
    title: "Mika Coffee",
    short: "Fast, accessible coffee-shop site",
    type: "client",
    image: "images/mika.webp",
    summary:
      "A fast, accessible, responsive website for a coffee business, live and in daily use by the client.",
    tags: ["React", "JavaScript", "WCAG Accessibility", "Netlify"],
    live: "https://mikacoffee.netlify.app/"
  },
  {
    id: 11,
    featured: false,
    title: "Pilates Studio",
    short: "Conversion-focused landing page",
    type: "client",
    image: "images/Pilates.webp",
    summary: "A conversion-focused landing page for a Pilates studio, live and in daily use by the client.",
    tags: ["Responsive Design", "Landing Page", "Netlify"],
    live: "https://lightfitstudio.netlify.app/"
  },
  {
    id: 12,
    featured: false,
    title: "Guess The Country",
    short: "Country game with a Node.js API",
    type: "independent",
    image: "images/GuessTheCountry.webp",
    summary:
      "A country-guessing game with a separate Node.js/Express API and persistent data in MongoDB Atlas.",
    tags: ["Node.js", "Express", "MongoDB Atlas", "Render"],
    github: "https://github.com/mandalaoui/Guess-The-Country",
    live: "https://guess-the-country-game.netlify.app/"
  },
  {
    id: 13,
    featured: false,
    title: "Brick-Breaker",
    short: "Arkanoid-style game in Java",
    type: "academic",
    image: "images/brick_breaker.webp",
    video: "https://res.cloudinary.com/dpwwlrcvz/video/upload/v1771521846/brick_breaker_msnwwz.mp4",
    summary:
      "An Arkanoid-style game in Java with a modular object-oriented design, animations, scoring and collision detection.",
    tags: ["Java", "OOP", "Collision Detection", "biuoop"],
    github: "https://github.com/mandalaoui/Brick-Breaker"
  }
];
