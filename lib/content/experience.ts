/**
 * The Experience chapter: one entry per DRAM chip. The four sticks are grouped by era (most
 * recent first) and the tour visits the chips in this order. Copy and numbers come from the
 * audited experience reference on the previous site; the two high-school entries are from
 * the site before that.
 */
export type ExperienceEntry = {
  key: string
  role: string
  company: string
  dates: string
  /** Two short lines printed on the chip itself, like package markings. */
  chip: [string, string]
  stack: string[]
  summary: string
  /** Which fanned stick (0 = first) and which chip on it (0 = bottom … 7 = top) holds this entry. */
  stick: number
  slot: number
}

export const CHIPS_PER_STICK = 8

export const EXPERIENCES: ExperienceEntry[] = [
  {
    key: 'universal-selfcare',
    role: 'Software Engineering Intern',
    company: 'Universal Selfcare',
    dates: 'Sep 2026 – Present',
    chip: ['USC', '2026·SWE'],
    stack: ['Go', 'PostgreSQL', 'pgvector', 'GCP', 'REST', 'TF-IDF', 'MMR'],
    summary:
      'A gut-microbiome-based, drug-free program for children with autism and related conditions, tracked monthly with parents doing the logging. Built the provider-facing analyst endpoint that turns a dormant symptom matcher into one ranked report per patient, and own the TF-IDF + pgvector recommendation service.',
    stick: 0,
    slot: 6,
  },
  {
    key: 'shortlist',
    role: 'Founding Software Engineer',
    company: 'Shortlist',
    dates: 'Jul 2026 – Present',
    chip: ['SHORTLIST', '2026·FSE'],
    stack: ['Python', 'React', 'TypeScript', 'PostgreSQL', 'Docker', 'Caddy', 'AWS EC2', 'AWS SES', 'GitHub Actions'],
    summary:
      'Student job board at short-list.app with 102+ unique daily users. Built the REST API, cut cloud database costs 97% with an in-memory listing cache, capped LLM spend with a daily budget, and shipped a CI deploy over SSH.',
    stick: 0,
    slot: 5,
  },
  {
    key: 'open-source',
    role: 'Open Source Contributor',
    company: 'PyTorch, NVIDIA CUTLASS, Sentry, Vercel AI SDK, Supabase',
    dates: 'May 2026 – Present',
    chip: ['OSS', '2026·OSS'],
    stack: ['CUDA C++', 'Python', 'TypeScript', 'Rust', 'compute-sanitizer'],
    summary:
      "Fixed out-of-bounds and integer-overflow paths in PyTorch and CUTLASS CUDA code, removed a duplicate JSON serialization on Sentry's AI tracing path (33.3% peak memory), and stopped Supabase's edge runtime from replacing the system TLS store.",
    stick: 0,
    slot: 4,
  },
  {
    key: 'gpu-research',
    role: 'Independent Researcher',
    company: 'GPU systems, self-directed',
    dates: 'Jun 2026 – Aug 2026',
    chip: ['RESEARCH', '2026·GPU'],
    stack: ['CUDA', 'C++', 'Python', 'Ampere (A100, 4x A10)', 'Nsight', 'compute-sanitizer'],
    summary:
      "Rebuilt ExpertPlex's tile-level preemption for MoE serving on Ampere with a device-scope atomic flag in place of Hopper-only clusters and TMA multicast. Cut an urgent task's wait from 957us to 17.4us, reproduced across five GPUs on rented hardware.",
    stick: 0,
    slot: 3,
  },
  {
    key: 'privet',
    role: 'Founding Engineer',
    company: 'Privet',
    dates: 'Mar 2026 – Jun 2026',
    chip: ['PRIVET', '2026·FE'],
    stack: ['Rust', 'Hyper', 'Tokio', 'ONNX Runtime', 'INT8 quantization', 'SQLCipher', 'HMAC-SHA256'],
    summary:
      'Privacy startup redacting sensitive data from LLM traffic before it leaves the machine. Built the concurrent Rust proxy, quantized the NER model to INT8 (266MB to 67MB, P95 7.08ms to 2.47ms), and kept a hash-chained, HMAC-signed audit log.',
    stick: 0,
    slot: 2,
  },
  {
    key: 'rutgers-la',
    role: 'Learning Assistant, Calculus II',
    company: 'Rutgers University',
    dates: 'Sep 2026 – Present',
    chip: ['RUTGERS', '2026·LA'],
    stack: ['Teaching', 'Pedagogy'],
    summary:
      "Lead two weekly sections of 25+ students and cover peers' sections on short notice. Meet with four instructors and TAs to review sections and incorporate feedback.",
    stick: 1,
    slot: 5,
  },
  {
    key: 'mtc',
    role: 'Founding Board Member, Head of Projects',
    company: 'Muslim Tech Collaborative, Rutgers',
    dates: 'Dec 2025 – Present',
    chip: ['MTC', '2025·HOP'],
    stack: ['Event strategy', 'Outreach', 'Cross-team coordination'],
    summary:
      'Joined the founding team; Head of Projects since Jul 2026. Secured $4,000+ in hackathon funding through professional outreach and run programs moving students from interest in tech to hands-on work with industry mentors.',
    stick: 1,
    slot: 2,
  },
  {
    key: 'freelance',
    role: 'Freelance Frontend Engineer',
    company: 'Remote',
    dates: 'Jul 2025 – Feb 2026',
    chip: ['FREELANCE', '2025·FE'],
    stack: ['React', 'TypeScript', 'WebGL', 'Three.js', 'Chrome DevTools'],
    summary:
      'Interactive 3D web applications for paying clients. Cut Three.js tick self-time 722ms to 255ms by tying rendering to scroll progress, drove layout shift from 1.49 to 0.00, and cut asset payload 6.7MB to 716KB.',
    stick: 2,
    slot: 4,
  },
  {
    key: 'msa',
    role: 'Officer & Fundraiser Lead',
    company: 'Muslim Student Association, WWP-HSN',
    dates: 'Sept 2023 – June 2024',
    chip: ['MSA', '2023·OFF'],
    stack: ['Fundraising', 'Stakeholder alignment', 'Event ops'],
    summary:
      'Turned a fundraiser rejection into approval by mapping admin concerns into constraints and reframing the pitch: 100+ donors and $1,000 raised for humanitarian aid, delivered on an execution playbook with zero incidents.',
    stick: 3,
    slot: 5,
  },
  {
    key: 'esports',
    role: 'Varsity Team Captain',
    company: 'Esports Club (League of Legends), WWP-HSN',
    dates: 'Oct 2022 – June 2024',
    chip: ['ESPORTS', '2022·CPT'],
    stack: ['Shot-calling', 'Coaching', 'Team strategy'],
    summary:
      'Primary shot-caller for a roster spanning Bronze to Diamond; built a shared strategic vocabulary that carried the team to 3rd place in the Garden State Esports League of Legends Championship (Fall 2022).',
    stick: 3,
    slot: 2,
  },
]
