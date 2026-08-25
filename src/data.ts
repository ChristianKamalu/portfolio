// All portfolio content in one place — sourced from the resume and live projects.

export const LINKS = {
  github: 'https://github.com/ChristianKamalu',
  linkedin: 'https://linkedin.com/in/christiankamalu/',
  email: 'ckamalu98@gmail.com',
  resume: '/Christian-Kamalu-Resume.pdf',
};

export const SUMMARY =
  'Full-stack engineer with 7+ years across React, TypeScript, and Node.js — and an AI-first workflow. ' +
  'I use LLMs daily to learn new domains fast and ship. Drawn to ambiguous, fast-moving problems, ' +
  'deliberate about tradeoffs, and energized by building AI agents and the systems around them, ' +
  'from concept to live deployment.';

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
  demo?: 'bank' | 'boggle' | 'ble' | 'nourish' | 'wave';
}

export const PROJECTS: Project[] = [
  {
    id: 'nourishai',
    name: 'NourishAI',
    tagline: 'AI meal planning, end to end',
    description:
      'Full-stack AI app: a React Native/TypeScript client and Node.js + PostgreSQL backend where ' +
      'LLM agents generate meal plans through a provider-agnostic layer. Hybrid retrieval-and-ranking ' +
      'pipeline, evaluation and cost controls, photo → meal logging, and text → image meal previews.',
    tech: ['React Native', 'TypeScript', 'Node.js', 'PostgreSQL', 'LLM Agents'],
    link: 'https://nourishai.christiankamalu.com',
    linkLabel: 'Open the app',
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
    id: 'tradeangel',
    name: 'TradeAngel & Litiscape',
    tagline: 'Two products, one small team, lead engineer',
    description:
      'Led architecture and delivery across a two-product startup effort: integrated Thomson Reuters’ ' +
      'CLEAR API to turn large external data flows into an analytical platform, and built a ' +
      'client-facing marketplace from the ground up.',
    tech: ['React', 'Node.js', 'Data Integration'],
    link: 'https://thetradeangel.com',
    linkLabel: 'Visit TradeAngel',
  },
  {
    id: 'soundwave',
    name: 'SoundWave',
    tagline: 'Speaker rentals, minus the phone calls',
    description:
      'A clean rental site for a local speaker and audio-equipment business — browse the gear, ' +
      'pick your dates, book it.',
    tech: ['React'],
    link: 'https://soundwaveaudio.netlify.app',
    linkLabel: 'Browse the gear',
    demo: 'wave',
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
    company: 'Delinea',
    title: 'Software Engineer',
    period: 'Jul 2022 — Present',
    bullets: [
      'Build and maintain the company’s shared React component library — reusable UI shipped across its full suite of applications, partnering with product teams to standardize patterns.',
      'Use AI tooling to ramp on unfamiliar areas of a large codebase quickly — a habit that’s central to how I deliver.',
    ],
  },
  {
    company: 'Litiscape & TradeAngel',
    title: 'Software Lead',
    period: 'Mar 2020 — Jul 2022',
    bullets: [
      'Led a two-product engineering effort as technical lead, owning architecture and delivery in a fast-moving startup.',
      'Integrated Thomson Reuters’ CLEAR API to turn large external data flows into an analytical platform, and built a client-facing marketplace from the ground up.',
    ],
  },
  {
    company: 'DentalQore',
    title: 'Associate Engineer & Technical Support',
    period: 'Sep 2019 — Mar 2020',
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

// Skill names that also appear in project `tech` arrays light those projects
// up on hover — keep the spellings in sync.
export const SKILLS: SkillGroup[] = [
  { label: 'Frontend', skills: ['React', 'TypeScript', 'React Native', 'Expo'] },
  { label: 'Backend', skills: ['Node.js', 'PostgreSQL', 'Firebase'] },
  { label: 'AI', skills: ['LLM Agents', 'Prompting & Evals', 'Claude', 'Gemini'] },
  { label: 'Systems & Mobile', skills: ['Embedded C', 'BLE', 'SwiftUI', 'Kotlin'] },
  { label: 'Ship it', skills: ['GitHub Actions', 'Netlify', 'Vite', 'Playwright'] },
];
