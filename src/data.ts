// All portfolio content in one place — sourced from the resume and live projects.

export const LINKS = {
  github: 'https://github.com/ChristianKamalu',
  linkedin: 'https://linkedin.com/in/christiankamalu/',
  email: 'ckamalu98@gmail.com',
  resume: '/Christian-Kamalu-Resume.pdf',
};

/**
 * Everything the SEO layer needs, in one place. `vite.config.ts` reads this at
 * build time and writes the JSON-LD into index.html, so the structured data
 * ships as static markup instead of something only a JS-running crawler ever
 * sees. Edit here, not in index.html.
 *
 * `serviceArea.city` is the one local-SEO lever on the whole site: fill it in
 * and both the local `areaServed` entry and the "based in X" line switch on;
 * leave it empty and the site stays purely national, which is the safe
 * default. Never guess a city here — claiming the wrong location ranks worse
 * than claiming none, because the signal contradicts every other one Google
 * has (IP, links, reviews, the Business Profile).
 */
export const SITE = {
  url: 'https://www.christiankamalu.com',
  name: 'Christian Kamalu',
  jobTitle: 'Full-stack engineer and freelance web designer',
  /** Used verbatim as the meta description. Keep it under ~160 characters. */
  description:
    'I design and build websites for people and small businesses — personal sites, ' +
    'small business sites, and rebuilds. Hand-written, fast, and yours to own outright.',
  serviceArea: {
    /** Where he actually is. This is the location claim — keep it true. */
    city: 'Layton',
    region: 'Utah',
    country: 'United States',
    /**
     * Places genuinely served, which is not the same as a location claim.
     * The schema type here is `Service`, not `LocalBusiness`, so naming these
     * declares reach without asserting an address in any of them — Layton is
     * a principal city of the Ogden–Clearfield metro, not Salt Lake City's,
     * and claiming otherwise would put the page at odds with every other
     * signal (Business Profile, citations, actual proximity).
     */
    alsoServes: [
      { type: 'City', name: 'Salt Lake City' },
      { type: 'City', name: 'Ogden' },
      { type: 'City', name: 'Bountiful' },
      { type: 'AdministrativeArea', name: 'Davis County' },
    ],
    /** How the region reads to a human. Used in the meta description; the
     *  title stays tight with just city + state. */
    label: 'Layton and the greater Salt Lake area',
  },
  /** Drives the JSON-LD offer catalog — the part that says "this is for hire". */
  services: [
    {
      name: 'Personal website design and development',
      description:
        'A site with your name on it — portfolio, personal brand, booking or contact ' +
        'form. Designed, built, and deployed to your own domain.',
    },
    {
      name: 'Small business website design and development',
      description:
        'The site your business runs on — what you do, who you are, and how people ' +
        'reach you, with enquiries landing straight in your inbox.',
    },
    {
      name: 'Website redesign and rebuild',
      description:
        'A rebuild of a site that has aged out — faster, readable on a phone, and ' +
        'editable without paying rent to a page builder.',
    },
  ],
};

export const SUMMARY =
  'I build websites for people and small businesses — design through deploy, hand-written, ' +
  'no page-builder bloat. Behind that: 7+ years as a full-stack engineer in React, TypeScript, ' +
  'and Node.js, and an AI-first workflow that lets me learn a new business fast and ship fast ' +
  'without cutting the corners that matter — speed, accessibility, and a site you can actually ' +
  'keep updated.';

export interface Project {
  id: string;
  name: string;
  tagline: string;
  description: string;
  tech: string[];
  link?: string;
  linkLabel?: string;
  status?: string;
  /** which mini-interaction the card renders */
  demo?: 'bank' | 'boggle' | 'ble' | 'nourish';
}

/**
 * Client work — sites I was paid to build, for real people with real
 * deadlines. These lead the Projects section on purpose: they are the proof
 * behind the pitch in `SUMMARY`, so keep this array first and keep every
 * `link` live. A dead link here is worse than no card at all.
 */
export const CLIENT_SITES: Project[] = [
  {
    id: 'toddharris',
    name: 'Todd Harris',
    tagline: 'Sports commentator — full rebuild',
    description:
      'Rebuilt an Emmy-winning Olympic commentator’s site from scratch on Astro: a reel player that ' +
      'switches video host from one config line, a photo gallery he can refill himself, career credits ' +
      'that read in fifteen seconds, and a booking form straight to his inbox. Sitemap, metadata and ' +
      'IndexNow submission so the producers hiring him actually find it.',
    tech: ['Astro', 'React', 'TypeScript', 'Tailwind', 'Netlify'],
    link: 'https://www.thetoddharris.com',
    linkLabel: 'Visit the site',
  },
  {
    id: 'buildingstrongwomen',
    name: 'Building Strong Women',
    tagline: 'Brand site & storefront',
    description:
      'Marketing site and store for a community empowering women and girls — in sport and in ' +
      'life — built out from the brand identity they already had: ' +
      'palette, quote-card motif and pamphlet copy carried across intact. Newsletter, ' +
      'product-interest and contact forms wired up, and products flip from “Notify me” to “Buy” with ' +
      'one flag when checkout goes live.',
    tech: ['React', 'TypeScript', 'Vite', 'Netlify'],
    link: 'https://buildingstrongwomen.com',
    linkLabel: 'Visit the site',
  },
];

/**
 * Everything else — built for myself, and the reason the client work goes
 * fast. The playable cards live here.
 */
export const PROJECTS: Project[] = [
  {
    id: 'ble',
    name: 'BLE Beacon Device',
    tagline: 'From bare metal to the App Store',
    description:
      'Self-taught embedded C to build a Bluetooth Low Energy device end to end: firmware on a ' +
      'TI CC2340R5 MCU with a deep-sleep power model targeting 5+ year battery life, a SwiftUI iOS ' +
      'companion shipping to TestFlight via GitHub Actions, and a Kotlin Android client in progress.',
    tech: ['Embedded C', 'BLE', 'SwiftUI', 'Kotlin', 'GitHub Actions'],
    status: 'In progress',
    demo: 'ble',
  },
  {
    id: 'nourishai',
    name: 'NourishAI',
    tagline: 'AI meal planning, end to end',
    description:
      'Full-stack AI app: a React Native/TypeScript client and Node.js + PostgreSQL backend with ' +
      'LLM-driven meal planning behind a provider-agnostic layer. Hybrid retrieval-and-ranking ' +
      'pipeline, evaluation and cost controls, photo → meal logging, and text → image meal previews.',
    tech: ['React Native', 'TypeScript', 'Node.js', 'PostgreSQL', 'LLM Integrations'],
    status: 'In progress',
    demo: 'nourish',
  },
  {
    id: 'bank',
    name: 'Bank',
    tagline: 'Push-your-luck dice, live with friends',
    description:
      'Real-time multiplayer dice game — PIN lobbies, anonymous auth, and optimistic Firestore writes ' +
      'so every roll lands on every screen instantly. Configurable bust rules, doubles, and anonymous banking. ' +
      'Try the pocket version here, then host a real game.',
    tech: ['React Native', 'Expo', 'TypeScript', 'Firebase'],
    link: 'https://bank.christiankamalu.com',
    linkLabel: 'Host a game',
    demo: 'bank',
  },
  {
    id: 'boggle',
    name: 'Boggle — Party Edition',
    tagline: 'The word game, multiplayer in the browser',
    description:
      'Live lobbies, synchronized rounds with a shared board, word challenges, round review and scoring — ' +
      'all on a single Firestore document per game. There are words hiding in this very board: ' +
      'trace adjacent tiles to find one.',
    tech: ['React Native', 'Expo', 'TypeScript', 'Firebase'],
    link: 'https://boggle.christiankamalu.com',
    linkLabel: 'Play with friends',
    demo: 'boggle',
  },
  {
    id: 'tradeangel',
    name: 'TradeAngel & Litiscape',
    tagline: 'Two products, one small team, lead engineer',
    description:
      'Led architecture and delivery across a two-product startup effort (2020–2022): integrated ' +
      'Thomson Reuters’ CLEAR API to turn large external data flows into an analytical platform, and ' +
      'built a client-facing marketplace from the ground up. Both products have since been retired.',
    tech: ['React', 'Node.js', 'Data Integration'],
    status: 'Retired',
  },
];

export interface Job {
  company: string;
  title: string;
  period: string;
  bullets: string[];
}

export const EXPERIENCE: Job[] = [
  {
    company: 'Independent',
    title: 'Freelance Web Designer & Developer',
    period: '2026 — present',
    bullets: [
      'Design and build websites for people and small businesses end to end — first sketch, copy, build, domain, deploy, and a handoff that leaves the owner able to edit their own words.',
      'Shipped thetoddharris.com, an Astro rebuild for an Emmy-winning Olympic commentator, and buildingstrongwomen.com, a brand site and storefront built out from an existing identity.',
    ],
  },
  {
    company: 'Delinea',
    title: 'Software Engineer',
    period: '2022 — 2026',
    bullets: [
      'Built and maintained the company’s shared React component library — reusable UI shipped across its full suite of applications, partnering with product teams to standardize patterns.',
      'Used AI tooling to ramp on unfamiliar areas of a large codebase quickly — a habit that’s central to how I deliver.',
    ],
  },
  {
    company: 'Litiscape & TradeAngel',
    title: 'Software Lead',
    period: '2020 — 2022',
    bullets: [
      'Led a two-product engineering effort as technical lead, owning architecture and delivery in a fast-moving startup.',
      'Integrated Thomson Reuters’ CLEAR API to turn large external data flows into an analytical platform, and built a client-facing marketplace from the ground up.',
    ],
  },
  {
    company: 'DentalQore',
    title: 'Associate Engineer & Technical Support',
    period: '2019 — 2020',
    bullets: [
      'Rebuilt hundreds of client dental websites, adapting quickly across a high volume of varied requests.',
      'Worked directly with customers in 1-on-1 support, translating non-technical needs into shipped improvements.',
    ],
  },
];

export interface SkillGroup {
  label: string;
  skills: string[];
}

// Grouped for reading, not for behaviour — these chips are static labels
// (see the Skills component). Order runs client-facing first.
export const SKILLS: SkillGroup[] = [
  { label: 'Sites', skills: ['React', 'Astro', 'TypeScript', 'Tailwind', 'Vite', 'Angular'] },
  { label: 'Backend', skills: ['Node.js', 'PostgreSQL', 'Firebase'] },
  { label: 'Ship it', skills: ['Netlify', 'GitHub Actions', 'SEO & metadata', 'Playwright'] },
  { label: 'AI', skills: ['LLM Integrations', 'Prompting & Evals', 'Claude', 'Gemini'] },
  { label: 'Apps & Systems', skills: ['React Native', 'Expo', 'Embedded C', 'BLE', 'SwiftUI', 'Kotlin'] },
];
