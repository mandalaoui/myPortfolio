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
    title: "AIControlCenter",
    type: "independent",
    ai: true,
    image: "images/AIControlCenter.png",
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
    image: "images/AI_Marketplace.png",
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
    image: "images/wanderwise.png",
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
    title: "TeacherAssistantAI",
    type: "academic",
    ai: true,
    image: "images/TeacherAssistantAI.png",
    video: "https://res.cloudinary.com/dpwwlrcvz/video/upload/v1771521854/TeacherAssistantAI_nhtibi.mp4",
    summary:
      "A research analytics platform that makes large-scale scholarly data explorable.",
    highlights: [
      "ETL pipeline that ingests and organizes scholarly data from OpenAlex",
      "SQL-based exploration and visualization",
      "AI-assisted research guidance powered by Groq"
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
    image: "images/mortgAI.png",
    summary: "An AI-assisted mortgage platform built for a client.",
    highlights: [
      "Processes structured financial data",
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
    image: "images/rannadlan.png",
    summary:
      "A production full-stack platform built for a real-estate business.",
    highlights: [
      "Property and content management with lead workflows",
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
    image: "images/family-vehicle-manager.png",
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
    image: "images/netfilm.png",
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
    image: "images/couponMarketplace.png",
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
    image: "images/Argentina.png",
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
    image: "images/mika.png",
    summary:
      "A fast, accessible, responsive website built and deployed for a coffee business.",
    tags: ["React", "JavaScript", "WCAG Accessibility", "Netlify"],
    live: "https://mikacoffee.netlify.app/"
  },
  {
    id: 11,
    featured: false,
    title: "Pilates Studio",
    short: "Conversion-focused landing page",
    type: "client",
    image: "images/Pilates.png",
    summary: "A conversion-focused landing page built and deployed for a Pilates studio.",
    tags: ["Responsive Design", "Landing Page", "Netlify"],
    live: "https://lightfitstudio.netlify.app/"
  },
  {
    id: 12,
    featured: false,
    title: "Guess The Country",
    short: "Country game with a Node.js API",
    type: "independent",
    image: "images/GuessTheCountry.png",
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
    image: "images/brick_breaker.png",
    video: "https://res.cloudinary.com/dpwwlrcvz/video/upload/v1771521846/brick_breaker_msnwwz.mp4",
    summary:
      "An Arkanoid-style game in Java with a modular object-oriented design, animations, scoring and collision detection.",
    tags: ["Java", "OOP", "Collision Detection", "biuoop"],
    github: "https://github.com/mandalaoui/Brick-Breaker"
  }
];
