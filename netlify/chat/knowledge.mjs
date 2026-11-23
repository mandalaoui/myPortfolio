// Knowledge base for the "AI Omer" chat (retrieval-augmented generation).
//
// Every chunk is a small fact sheet. The chat only answers from chunks that
// retrieval selects, so anything Omer wants the avatar to know must be here.
// Projects are pulled from the site's own data (single source of truth).
//
// Each chunk: { id, title, href (where it lives on the site, for the source
// chip), text, keywords (extra search terms, English) }.

import { projectsData } from "../../assets/js/projectsData.js";

const TYPE = { client: "client project", academic: "academic project", independent: "independent project" };

const projectChunks = projectsData.map((p) => ({
  id: `project-${p.id}`,
  featured: !!p.featured,
  title: p.title,
  href: p.featured ? "#projects" : "#more-projects",
  text: [
    `${p.title} is one of my ${p.featured ? "featured" : "other"} projects (${TYPE[p.type] || p.type}${p.ai ? ", AI-powered" : ""}).`,
    p.summary,
    p.highlights ? `Highlights: ${p.highlights.join("; ")}.` : "",
    `Built with: ${p.tags.join(", ")}.`,
    p.live ? "There is a live version you can open from the project card." : "",
    p.github ? "The code is on GitHub (linked from the project card)." : "",
    p.video ? "There's a demo video on the project card." : ""
  ].filter(Boolean).join(" "),
  keywords: `project portfolio ${p.type} ${p.ai ? "ai llm artificial intelligence" : ""} ${p.tags.join(" ")}`
}));

const profileChunks = [
  {
    id: "profile",
    title: "About me",
    href: "#about",
    always: true,
    text: "I'm Omer Mandalaoui, an AI and full-stack engineer based in Petah Tikva, Israel. I build software and AI-powered systems that streamline how businesses work, and I train people and teams to use AI tools. I'm both employed and self-employed (freelance).",
    keywords: "who are you about omer introduction background summary"
  },
  {
    id: "current-role",
    title: "Current role",
    href: "#about",
    text: "Since November 2026 I work as an AI Solutions Engineer. I develop systems for organizations to streamline their processes, use AI tools to get there, and run personal and group training sessions on using those tools. I don't share employer details here.",
    keywords: "current job role position ai solutions engineer work company employer now"
  },
  {
    id: "freelance",
    title: "Freelance work",
    href: "#about",
    text: "From 2025 to 2026 I worked as a freelance full-stack developer for business clients: from requirements through development to deployment. I built a production platform combining admin tools, lead management, custom business logic and LLM-powered content automation, plus responsive websites focused on usability, performance and accessibility.",
    keywords: "freelance experience self-employed clients previous work history"
  },
  {
    id: "services",
    title: "What I offer",
    href: "#contact",
    text: "I take on short and long-term projects, mainly software development and web systems; personal and group training on AI tools; and consulting and guidance for getting into AI. My focus is solving business owners' problems with existing AI tools, and with tools I can build for them.",
    keywords: "services offer hire help consulting training workshop mentoring project build automation business owner"
  },
  {
    id: "availability",
    title: "Availability",
    href: "#contact",
    text: "I'm available mainly for freelance work: projects, training, mentoring and consulting. A part-time position is also possible.",
    keywords: "available availability open to work hiring freelance part-time job position recruit"
  },
  {
    id: "work-mode",
    title: "Where and how I work",
    href: "#contact",
    text: "I work hybrid: on-site at your offices, from home, or over Zoom. On-site mostly in Petah Tikva and the surrounding area.",
    keywords: "location remote hybrid office onsite zoom where area petah tikva israel"
  },
  {
    id: "languages",
    title: "Languages",
    href: "#about",
    text: "I speak Hebrew and English, and basic Spanish.",
    keywords: "languages speak hebrew english spanish"
  },
  {
    id: "education",
    title: "Education",
    href: "#about",
    text: "I hold a B.Sc. in Computer Science from Bar-Ilan University (2023–2026), with a strong foundation in algorithms, data structures, databases, software engineering and artificial intelligence.",
    keywords: "education degree university bar-ilan computer science bsc studies graduate"
  },
  {
    id: "military",
    title: "Military service and training experience",
    href: "#about",
    text: "I served nearly four years (2019–2022) as an HR officer in the IDF. I led and mentored officers and soldiers, managed training cycles of up to 150 people, delivered trainings and talks to groups of 5 to 200 people, and handled HR for 100+ personnel. That's where my experience teaching and training groups comes from; today I also train people on AI tools.",
    keywords: "military army idf service officer leadership training teaching instructor experience"
  },
  {
    id: "ai-experience",
    title: "Experience with AI",
    href: "#projects",
    text: "I've used AI in many of my projects (LLM integrations, AI-generated insights, structured AI output, AI content pipelines) and worked with different business owners on applying AI to their work. Six of my featured projects are AI-powered: AI Control Center, AI Automation Marketplace, WanderWise, Teacher Assistant AI, Mortgage AI and the Real Estate Platform.",
    keywords: "ai artificial intelligence llm experience gpt openai groq automation"
  },
  {
    id: "featured",
    title: "My top projects",
    href: "#projects",
    text: "The projects I'm proudest of are my six featured ones, all AI-powered: AI Control Center, AI Automation Marketplace, WanderWise, Teacher Assistant AI, Mortgage AI and the Real Estate Platform. The others (Family Vehicle Manager, Netfilm, Coupon Marketplace, Argentina Travel Companion, Mika Coffee, Pilates Studio, Guess The Country, Brick-Breaker) are listed under More projects; most of those are not AI projects.",
    keywords: "best top favorite favourite proudest main featured highlight strongest recommended project projects portfolio"
  },
  {
    id: "code",
    title: "Code and implementation details",
    href: "#projects",
    text: "The code for most of my projects is on GitHub, linked from each project card (the Code button). I don't go into internal implementation details in this chat; I'm happy to walk through the architecture of any project in a short call.",
    keywords: "code source github repository repo how built architecture structure implementation internals design folders stack details technical"
  },
  {
    id: "skills",
    title: "Technical stack",
    href: "#skills",
    text: "Frontend: React, Next.js, TypeScript, JavaScript, Angular, Tailwind CSS. Backend: Node.js, Express, Python, Java. Data: PostgreSQL, MySQL, MongoDB, Supabase. Infrastructure: Git, Docker, GitHub Actions, Vercel, Netlify. AI: OpenAI API, Groq / Llama, OpenRouter, LLM integration, prompt engineering, workflow automation.",
    keywords: "skills stack technologies tools languages frameworks react node python database"
  },
  {
    id: "contact",
    title: "How to reach me",
    href: "#contact",
    text: "You can reach me through the contact section at the bottom of this site: email (mandalaoui.omer@gmail.com), WhatsApp, or the 'Book a call' button to schedule a short intro call. I'm also on GitHub and LinkedIn.",
    keywords: "contact email reach whatsapp call meeting book schedule talk linkedin github"
  },
  {
    id: "ai-tips",
    title: "Getting started with AI",
    href: "#contact",
    text: "Starter tips I like to share: pick one repetitive task you do every week and try an existing AI tool on it first; give the AI context, an example and the format you want; always check the output before using it; don't paste sensitive customer data into public tools; once something works, turn it into a routine or an automation. For a plan tailored to your business, a short call works best.",
    keywords: "tips tip first start starting beginner begin how to use ai chatgpt claude gemini prompt prompts advice recommendation getting started business small business productivity tools"
  },
  {
    id: "this-chat",
    title: "How this chat works",
    href: "#avatar",
    text: "This chat is a small RAG system I built: your question is rewritten into search terms, the most relevant facts about me are retrieved from a knowledge base, and an LLM on Groq writes the answer only from those facts. A separate model screens messages for prompt-injection attempts.",
    keywords: "how does this chat work rag retrieval bot avatar built llm groq"
  }
];

export const chunks = [...profileChunks, ...projectChunks];
