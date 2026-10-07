/**
 * The Projects chapter: one entry per block on the GPU die. Copy, stacks and numbers come
 * from the audited projects reference on the previous site. The tour opens with the kernel
 * and systems work in the SMs, then the models in the Tensor Cores, then the products in the
 * memory system (a memory controller on the die's edge and the GDDR package it feeds).
 */
export type ProjectCategory = 'systems' | 'ml' | 'agentic'
export type BlockKind = 'sm' | 'tensor' | 'mc'

export type ProjectEntry = {
  key: string
  title: string
  subtitle?: string
  category: ProjectCategory
  /** Which die block holds this project. `mc` entries also light GDDR package `index`. */
  block: { kind: BlockKind; index: number }
  description: string
  stack: string[]
  facts: string[]
  url?: string
  repo?: string
}

export const CATEGORIES: Record<ProjectCategory, { label: string; block: string; short: string; color: string }> = {
  systems: { label: 'Systems, Low-Level & Hardware', block: 'Streaming Multiprocessor', short: 'SM', color: '#ffb866' },
  ml: { label: 'ML & Data Science', block: 'Tensor Core', short: 'TENSOR CORE', color: '#6fd3c6' },
  agentic: { label: 'Agentic & Full-Stack', block: 'Memory controller + GDDR', short: 'GDDR · MC', color: '#8fb0ff' },
}

export const PROJECTS: ProjectEntry[] = [
  { key: 'apk', title: 'APK', subtitle: 'Adaptive Persistent Kernels', category: 'systems', block: { kind: 'sm', index: 0 }, repo: 'https://github.com/AyaanFaisal21/APK',
    description: "Tile-level preemption for MoE-serving megakernels rebuilt on Ampere, measuring whether ExpertPlex's Hopper design survives without thread-block clusters, DSMEM, or TMA multicast.",
    stack: ['CUDA', 'C++', 'Python', 'A100', '4x A10'],
    facts: ["Urgent wait 957us to 17.4us (p50), inside ExpertPlex's 2.2 to 25.3us band", 'Device-scope atomic flag polled at tile boundaries, atomicCAS claim, cp.async drain, abandon-and-recompute', '185,324,424 verified executions and 28,859 forced yields, clocks locked'] },
  { key: 'cornfield', title: 'Cornfield', subtitle: 'Automated GPU Kernel Tuner', category: 'systems', block: { kind: 'sm', index: 1 }, repo: 'https://github.com/AyaanFaisal21/cornfield',
    description: 'An op-agnostic CUDA autotuner: generate kernel variants, gate each on a reference, time the survivors, and cache the winner per op, shape, and GPU.',
    stack: ['CUDA C++', 'Python', 'PyTorch', 'Nsight'],
    facts: ['6-op registry to 200+ fused kernels (216 3-op chains); two memory passes per op cut to two total', 'Matmul narrowed from 6.5x to 1.5x slower than cuBLAS on an RTX 2060 SUPER', 'Tuning 5.1x faster (470s to 92s) with parallel compilation and serial GPU timing'] },
  { key: 'cornfield-v2', title: 'Cornfield V2', subtitle: 'SuperOptimizerVerification', category: 'systems', block: { kind: 'sm', index: 2 }, repo: 'https://github.com/AyaanFaisal21/SuperOptimizerVerification',
    description: 'A study of when kernel correctness checks lie: tolerance gates measure magnitude, not correctness.',
    stack: ['CUDA', 'Python'],
    facts: ['fp16 online softmax failed 100/100 against a reference 11x less accurate than the kernel it graded', 'The same kernel passed 98/100 against a tree-sum reference', 'K=11008 produced 100/100 false rejections'] },
  { key: 'transformerop', title: 'TransformerOp', category: 'systems', block: { kind: 'sm', index: 3 }, repo: 'https://github.com/AyaanFaisal21/TransformerOp',
    description: 'A 10.8M-parameter character-level GPT written from scratch (no nn.Transformer), then used as a testbed for hand-written CUDA kernels.',
    stack: ['Python', 'PyTorch', 'CUDA C++', 'CUDA Graphs'],
    facts: ['Decode 398 to 1,664 tok/s (4.2x) via CUDA Graph capture with a static KV cache', 'Tiny Shakespeare, val loss 1.50', 'Attention v5 transposed the K tile to clear a 32-way bank conflict; matmul was 60% of time, so kernels stayed out of training'] },
  { key: 'warp-rl', title: 'Warp-Fused RL Simulation', category: 'systems', block: { kind: 'sm', index: 4 },
    description: 'A reinforcement-learning environment whose whole timestep compiles into one NVIDIA Warp kernel, with the policy exported to TensorRT.',
    stack: ['NVIDIA Warp', 'CUDA', 'TensorRT', 'ONNX', 'Nsight'],
    facts: ['5.5x simulation speedup, 9.2M to 50.1M steps/s, 47 launches to 1', 'Policy inference 3.8x faster, 179us to 47us', 'Batched torch on GPU measured at 0.67x CPU throughput, so fusion, not the device, was the win'] },
  { key: 'privet', title: 'Privet', category: 'systems', block: { kind: 'sm', index: 5 }, url: 'https://get-privet.com',
    description: "A local proxy between a company's tools and cloud LLMs that redacts sensitive data before any prompt leaves the machine, so small professional firms can use AI on client data.",
    stack: ['Rust', 'Hyper', 'Tokio', 'ONNX Runtime', 'INT8 NER', 'SQLCipher', 'HMAC-SHA256'],
    facts: ['NER model 266MB to 67MB (4.0x); P95 inference 7.08ms to 2.47ms (2.9x), P99 4.1x', 'Placeholders and split codepoints handled across SSE chunk boundaries', 'AES-256 vault keyed from the OS keychain, hash-chained audit log, zero outbound traffic of its own'] },
  { key: 'tcp-game-server', title: 'Concurrent TCP Game Server', category: 'systems', block: { kind: 'sm', index: 6 }, repo: 'https://github.com/AyaanFaisal21/TCPGameServer',
    description: 'A C daemon that accepts TCP clients, pairs them into games through a mutex-guarded queue, and runs each game on its own detached thread. Systems Programming coursework, 825 lines.',
    stack: ['C', 'POSIX sockets', 'pthreads', 'Bash'],
    facts: ['Length-prefixed framing (0|LL|PAYLOAD) with a bounded recv loop', 'One mutex spanning name-check and enqueue closes a TOCTOU race', 'Closed sockets marked -1 and every send gated on fd >= 0, so a recycled descriptor never crosses into another game'] },
  { key: 'early-warning', title: 'Early Warning', subtitle: 'CCTV Anomaly Detection', category: 'ml', block: { kind: 'tensor', index: 7 },
    description: 'A near-miss detector for warehouse or site CCTV: a video model fills a fixed schema per clip, identical answers hash to one event ID, and a graph database surfaces hazards nobody reported.',
    stack: ['Python', 'Neo4j', 'Vision LLMs'],
    facts: ['Counting stays in deterministic code, not the model', 'Recurring hazards group deterministically by hashed event ID'] },
  { key: 'skindex', title: 'Skindex', subtitle: 'Skin Lesion Classifier', category: 'ml', block: { kind: 'tensor', index: 8 }, repo: 'https://github.com/KrishLenka/Skindex-HackRUF25',
    description: 'A web app that classifies a photographed skin lesion with two models and returns Gemini-written next-step guidance.',
    stack: ['React', 'Flask', 'PyTorch', 'timm', 'ONNX Runtime', 'TensorFlow'],
    facts: ['85% validation accuracy across 10 classes on a 10,000-image dataset', 'EfficientNet plus a custom CNN', 'ONNX export unified inference across 3+ frameworks and CUDA, CPU, and MPS backends'] },
  { key: 'car-deal', title: 'Car Deal Rating Model', category: 'ml', block: { kind: 'tensor', index: 9 }, repo: 'https://github.com/AyaanFaisal21/Car-Deal-Predictor',
    description: 'An XGBoost classifier that rates used-car deals.',
    stack: ['R', 'XGBoost', 'Random forest', 'Ensembling'],
    facts: ['92% cross-validated accuracy on 10,000 Dubai listings', 'Engineered price, mileage, and benchmark features (+4%)', '5-fold CV, stacking, and probability ensembling closed a 4-5% overfitting gap'] },
  { key: 'shortlist', title: 'Shortlist', category: 'agentic', block: { kind: 'mc', index: 0 }, url: 'https://short-list.app',
    description: 'A free job board for students that aggregates internship postings, sends alerts, and reports on what students see, run as a real product with daily users.',
    stack: ['Python', 'React', 'TypeScript', 'PostgreSQL', 'Docker', 'Caddy', 'AWS EC2', 'GitHub Actions'],
    facts: ['102+ unique daily users, measured by salted, irreversible IP hashes', '97% cloud database cost cut and 1.2M redundant queries a day prevented by an in-memory listings cache', 'LLM spend capped at $4.50 a day; 9-table schema with daily notification caps'] },
  { key: 'public-wire', title: 'Public Wire', category: 'agentic', block: { kind: 'mc', index: 1 }, url: 'https://public-wire.vercel.app', repo: 'https://github.com/RealPublicWire/Public-Wire',
    description: 'An autonomous local-news publisher: agents ingest messy civic sources, score relevance, draft, validate against evidence, and publish, with deterministic code owning every claim.',
    stack: ['TypeScript', 'Next.js', 'Google ADK', 'Gemini', 'PostgreSQL', 'Datadog'],
    facts: ['5-stage pipeline with dd-trace spans on every agent stage', '12 API fallback states behind one typed envelope, so a rate limit degrades one stage, not the run', '20% of otherwise-lost LLM outputs recovered by normalizing markdown-polluted JSON before validation'] },
  { key: 'fantasy-stocks', title: 'FantasyStocks', subtitle: 'FanTok', category: 'agentic', block: { kind: 'mc', index: 2 }, url: 'https://fantok.vercel.app', repo: 'https://github.com/AaravL/FantasyStocks',
    description: 'A multiplayer fantasy-league game where players build paper portfolios and compete on live market moves.',
    stack: ['Python', 'FastAPI', 'WebSockets', 'React', 'Docker', 'GitHub Actions', 'Supabase'],
    facts: ['70% fewer external market-data calls via quote caching and forward-filling closed-market gaps', 'Push to main lints, tests, builds the image, and a webhook restarts the host', 'Multi-stage, non-root Docker image with a HEALTHCHECK'] },
  { key: 'blackstar', title: 'Blackstar', subtitle: 'JacHacks SF 2026 winner, $900 from Jaseci Labs', category: 'agentic', block: { kind: 'mc', index: 3 },
    description: 'A red-teaming simulator where an AI agent writes multi-stage microgrid failures and deterministic rules decide what load to shed.',
    stack: ['Jac', 'byLLM', 'Anthropic API', 'Graph traversal', 'React'],
    facts: ['Endurance forecast before each strike cut prediction error from 98.1h to 2.5h', 'Load-shedding controller held to 0 model calls; every de-energization is a replayable rule', 'Scoped by asking judges and sponsors how their graph tool was meant to be used'] },
]
