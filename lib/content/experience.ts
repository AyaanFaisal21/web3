/**
 * The Experience chapter: one entry per DRAM chip. The four sticks are grouped by era (one
 * per stick, most recent first) and the tour visits the chips in this order. Copy is from the
 * previous site; `**bold**` is rendered as emphasis.
 */
export type ExperienceEntry = {
  key: string
  role: string
  company: string
  dates: string
  /** Two short lines printed on the chip itself, like package markings. */
  chip: [string, string]
  summary?: string
  bullets: string[]
  /** Which fanned stick (0 = first) and which chip on it (0 = bottom … 7 = top) holds this entry. */
  stick: number
  slot: number
}

export const CHIPS_PER_STICK = 8

export const EXPERIENCES: ExperienceEntry[] = [
  {
    key: 'privet',
    role: 'Lead Software Engineer',
    company: 'Privet',
    dates: 'Mar 2026 – Present',
    chip: ['PRIVET', '2026·LSE'],
    stick: 0,
    slot: 4,
    summary:
      "A local privacy layer for people using AI with sensitive data — accountants, lawyers, financial advisors, pharmacists, founders. It runs as a proxy on your machine, intercepting outbound prompts so nothing sensitive ever leaves the device.",
    bullets: [
      'Routed **100%** of outbound LLM traffic through a full-stack detection pipeline by building a Rust/Tokio HTTPS proxy with custom TLS termination, preserving provider authentication and streaming SSE support.',
      'Achieved **under 150ms** sanitization latency on CPU-only hardware with a two-layer detection system combining regex and NER pattern matching with a quantized Phi-3-mini model using less than **500MB** RAM.',
      'Kept client data off the network with an SQLCipher-encrypted vault, OS keychain key derivation and a tamper-evident audit log storing **zero** sensitive data.',
    ],
  },
  {
    key: 'rutgers-la',
    role: 'Learning Assistant — Calculus II',
    company: 'Rutgers University New Brunswick',
    dates: 'Apr 2026 – Apr 2027',
    chip: ['RUTGERS', '2026·LA'],
    stick: 1,
    slot: 5,
    bullets: [
      'Support student understanding of multivariable calculus, sequences and series, and integral techniques by leading collaborative problem-solving sessions and translating abstract concepts into intuitive frameworks.',
      'Bridge the gap between lecture and comprehension by identifying recurring points of confusion and developing targeted explanations that address conceptual gaps rather than surface-level procedure.',
      'Collaborate with course instructors to align supplementary support with curriculum pacing.',
    ],
  },
  {
    key: 'mtc',
    role: 'Executive Board Member',
    company: 'Muslim Tech Collaborative, Rutgers',
    dates: 'Dec 2025 – Present',
    chip: ['MTC', '2025·EXEC'],
    stick: 1,
    slot: 2,
    summary:
      'A Rutgers student organization that builds bridges between the campus tech community and outside industry. Joined the founding team in its first year to help run hackathons, recruiting events, and Forge, a startup-immersion program that places students into real workplaces.',
    bullets: [
      'Co-coordinated a hackathon featuring **$4,000+** in prizes and meaningful industry participation, managing logistics, partner communication, and attendee experience.',
      'Organized a career networking event connecting **70** students with **10** professionals in a campus environment dense with competing events.',
      'Partnered with student leaders and external professionals to expand access to mentorship and career opportunities in tech.',
    ],
  },
  {
    key: 'freelance',
    role: 'Frontend Software Engineer',
    company: 'Freelance',
    dates: 'Jul 2025 – Feb 2026',
    chip: ['FREELANCE', '2025·FE'],
    stick: 2,
    slot: 4,
    bullets: [
      'Built premium web experiences with advanced frontend engineering tools, achieving Lighthouse scores over **90** across audited categories.',
      'Reduced CPU rendering workload by **65%** by identifying a costly 3D animation loop and applying scroll-progress-based render gating.',
      'Achieved **99%** CLS reduction site-wide with **0** INP regression by replacing layout-property animations with compositor-only transforms.',
    ],
  },
  {
    key: 'msa',
    role: 'Officer & Fundraiser Lead',
    company: 'Muslim Student Association, WWP-HSN',
    dates: 'Sept 2023 – June 2024',
    chip: ['MSA', '2023·OFF'],
    stick: 3,
    slot: 5,
    bullets: [
      'Turned a fundraiser rejection into approval by mapping admin concerns into constraints and reframing the pitch — ultimately engaging **100+** donors and raising **$1,000** for humanitarian aid.',
      'Aligned the board and school administration by translating feedback into a compliance-ready plan and updating materials to meet policy requirements.',
      'Developed an execution playbook covering roles, cash-handling and communications, enabling smooth event delivery with zero incidents.',
    ],
  },
  {
    key: 'esports',
    role: 'Varsity Team Captain',
    company: 'Esports Club (League of Legends), WWP-HSN',
    dates: 'Oct 2022 – June 2024',
    chip: ['ESPORTS', '2022·CPT'],
    stick: 3,
    slot: 2,
    bullets: [
      "Led a cross-skill-gap roster as the team's primary shot-caller, running structured practice sessions to build cohesion and strategic execution across players from Bronze to Diamond.",
      'Translated high-level game sense into digestible, actionable callouts for teammates several tiers below, building a shared strategic vocabulary.',
      'Guided the team to **3rd place** in the Garden State Esports League of Legends Championship (Fall 2022).',
    ],
  },
]
