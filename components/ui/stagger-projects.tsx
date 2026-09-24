"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"

const SQRT_5000 = Math.sqrt(5000)

// Card geometry. The template shipped at 365px; these are 1.5x.
const CARD_SIZE_DESKTOP = 548
const CARD_SIZE_MOBILE = 435
const STAGE_HEIGHT = 900
const CORNER_CUT = 75

// Buckets. `accent` colors borders, dots and the key; `deep` is the focused card's background;
// `tint` is the category chip on white cards.
const CATEGORIES = {
  agentic: { label: "Agentic & Full-Stack", accent: "#4f6a99", deep: "#2f405c", tint: "#e7edf6" },
  systems: { label: "Systems, Low-Level & Hardware", accent: "#c78347", deep: "#7a4d24", tint: "#f8ece0" },
  ml: { label: "ML & Data Science", accent: "#3b6d67", deep: "#27504b", tint: "#e3efed" },
} as const

type CategoryKey = keyof typeof CATEGORIES

interface Project {
  tempId: number
  title: string
  subtitle?: string
  category: CategoryKey
  /** One plain-words line on what it is. */
  description: string
  stack: string[]
  /** Verified numbers and mechanisms, shortest first. */
  facts: string[]
  url?: string
  repo?: string
}

// Copy and numbers from the audited projects reference. Entries without a public link stay unlinked.
const projects: Project[] = [
  {
    tempId: 0,
    title: "Shortlist",
    category: "agentic",
    url: "https://short-list.app",
    description:
      "A free job board for students that aggregates internship postings, sends alerts, and reports on what students see, run as a real product with daily users.",
    stack: ["Python", "React", "TypeScript", "PostgreSQL", "Docker", "Caddy", "AWS EC2", "GitHub Actions"],
    facts: [
      "102+ unique daily users, measured by salted, irreversible IP hashes",
      "97% cloud database cost cut and 1.2M redundant queries a day prevented by an in-memory listings cache",
      "LLM spend capped at $4.50 a day; 9-table schema with daily notification caps",
    ],
  },
  {
    tempId: 1,
    title: "Public Wire",
    category: "agentic",
    url: "https://public-wire.vercel.app",
    repo: "https://github.com/RealPublicWire/Public-Wire",
    description:
      "An autonomous local-news publisher: agents ingest messy civic sources, score relevance, draft, validate against evidence, and publish, with deterministic code owning every claim.",
    stack: ["TypeScript", "Next.js", "Google ADK", "Gemini", "PostgreSQL", "Datadog"],
    facts: [
      "5-stage pipeline with dd-trace spans on every agent stage",
      "12 API fallback states behind one typed envelope, so a rate limit degrades one stage, not the run",
      "20% of otherwise-lost LLM outputs recovered by normalizing markdown-polluted JSON before validation",
    ],
  },
  {
    tempId: 2,
    title: "FantasyStocks",
    subtitle: "FanTok",
    category: "agentic",
    url: "https://fantok.vercel.app",
    description:
      "A multiplayer fantasy-league game where players build paper portfolios and compete on live market moves.",
    stack: ["Python", "FastAPI", "WebSockets", "React", "Docker", "GitHub Actions", "Supabase"],
    facts: [
      "70% fewer external market-data calls via quote caching and forward-filling closed-market gaps",
      "Push to main lints, tests, builds the image, and a webhook restarts the host",
      "Multi-stage, non-root Docker image with a HEALTHCHECK",
    ],
  },
  {
    tempId: 3,
    title: "Blackstar",
    subtitle: "JacHacks SF 2026 winner, $900 from Jaseci Labs",
    category: "agentic",
    description:
      "A red-teaming simulator where an AI agent writes multi-stage microgrid failures and deterministic rules decide what load to shed.",
    stack: ["Jac", "byLLM", "Anthropic API", "Graph traversal", "React"],
    facts: [
      "Endurance forecast before each strike cut prediction error from 98.1h to 2.5h",
      "Load-shedding controller held to 0 model calls; every de-energization is a replayable rule",
      "Scoped by asking judges and sponsors how their graph tool was meant to be used",
    ],
  },
  {
    tempId: 4,
    title: "Privet",
    category: "systems",
    url: "https://get-privet.com",
    description:
      "A local proxy between a company's tools and cloud LLMs that redacts sensitive data before any prompt leaves the machine, so small professional firms can use AI on client data.",
    stack: ["Rust", "Hyper", "Tokio", "ONNX Runtime", "INT8 NER", "SQLCipher", "HMAC-SHA256"],
    facts: [
      "NER model 266MB to 67MB (4.0x); P95 inference 7.08ms to 2.47ms (2.9x), P99 4.1x",
      "Placeholders and split codepoints handled across SSE chunk boundaries",
      "AES-256 vault keyed from the OS keychain, hash-chained audit log, zero outbound traffic of its own",
    ],
  },
  {
    tempId: 5,
    title: "APK",
    subtitle: "Adaptive Persistent Kernels",
    category: "systems",
    repo: "https://github.com/AyaanFaisal21/APK",
    description:
      "Tile-level preemption for MoE-serving megakernels rebuilt on Ampere, measuring whether ExpertPlex's Hopper design survives without thread-block clusters, DSMEM, or TMA multicast.",
    stack: ["CUDA", "C++", "Python", "A100", "4x A10"],
    facts: [
      "Urgent wait 957us to 17.4us (p50), inside ExpertPlex's 2.2 to 25.3us band",
      "Device-scope atomic flag polled at tile boundaries, atomicCAS claim, cp.async drain, abandon-and-recompute",
      "185,324,424 verified executions and 28,859 forced yields, clocks locked",
    ],
  },
  {
    tempId: 6,
    title: "Cornfield",
    subtitle: "Automated GPU Kernel Tuner",
    category: "systems",
    repo: "https://github.com/AyaanFaisal21/cornfield",
    description:
      "An op-agnostic CUDA autotuner: generate kernel variants, gate each on a reference, time the survivors, and cache the winner per op, shape, and GPU.",
    stack: ["CUDA C++", "Python", "PyTorch", "Nsight"],
    facts: [
      "6-op registry to 200+ fused kernels (216 3-op chains); two memory passes per op cut to two total",
      "Matmul narrowed from 6.5x to 1.5x slower than cuBLAS on an RTX 2060 SUPER",
      "Tuning 5.1x faster (470s to 92s) with parallel compilation and serial GPU timing",
    ],
  },
  {
    tempId: 7,
    title: "Cornfield V2",
    subtitle: "SuperOptimizerVerification",
    category: "systems",
    repo: "https://github.com/AyaanFaisal21/SuperOptimizerVerification",
    description: "A study of when kernel correctness checks lie: tolerance gates measure magnitude, not correctness.",
    stack: ["CUDA", "Python"],
    facts: [
      "fp16 online softmax failed 100/100 against a reference 11x less accurate than the kernel it graded",
      "The same kernel passed 98/100 against a tree-sum reference",
      "K=11008 produced 100/100 false rejections",
    ],
  },
  {
    tempId: 8,
    title: "TransformerOp",
    category: "systems",
    repo: "https://github.com/AyaanFaisal21/TransformerOp",
    description:
      "A 10.8M-parameter character-level GPT written from scratch (no nn.Transformer), then used as a testbed for hand-written CUDA kernels.",
    stack: ["Python", "PyTorch", "CUDA C++", "CUDA Graphs"],
    facts: [
      "Decode 398 to 1,664 tok/s (4.2x) via CUDA Graph capture with a static KV cache",
      "Tiny Shakespeare, val loss 1.50",
      "Attention v5 transposed the K tile to clear a 32-way bank conflict; matmul was 60% of time, so kernels stayed out of training",
    ],
  },
  {
    tempId: 9,
    title: "Warp-Fused RL Simulation",
    category: "systems",
    description:
      "A reinforcement-learning environment whose whole timestep compiles into one NVIDIA Warp kernel, with the policy exported to TensorRT.",
    stack: ["NVIDIA Warp", "CUDA", "TensorRT", "ONNX", "Nsight"],
    facts: [
      "5.5x simulation speedup, 9.2M to 50.1M steps/s, 47 launches to 1",
      "Policy inference 3.8x faster, 179us to 47us",
      "Batched torch on GPU measured at 0.67x CPU throughput, so fusion, not the device, was the win",
    ],
  },
  {
    tempId: 10,
    title: "Concurrent TCP Game Server",
    category: "systems",
    repo: "https://github.com/AyaanFaisal21/TCPGameServer",
    description:
      "A C daemon that accepts TCP clients, pairs them into games through a mutex-guarded queue, and runs each game on its own detached thread. Systems Programming coursework, 825 lines.",
    stack: ["C", "POSIX sockets", "pthreads", "Bash"],
    facts: [
      "Length-prefixed framing (0|LL|PAYLOAD) with a bounded recv loop",
      "One mutex spanning name-check and enqueue closes a TOCTOU race",
      "Closed sockets marked -1 and every send gated on fd >= 0, so a recycled descriptor never crosses into another game",
    ],
  },
  {
    tempId: 11,
    title: "Early Warning",
    subtitle: "CCTV Anomaly Detection",
    category: "ml",
    description:
      "A near-miss detector for warehouse or site CCTV: a video model fills a fixed schema per clip, identical answers hash to one event ID, and a graph database surfaces hazards nobody reported.",
    stack: ["Python", "Neo4j", "Vision LLMs"],
    facts: ["Counting stays in deterministic code, not the model", "Recurring hazards group deterministically by hashed event ID"],
  },
  {
    tempId: 12,
    title: "Skindex",
    subtitle: "Skin Lesion Classifier",
    category: "ml",
    description:
      "A web app that classifies a photographed skin lesion with two models and returns Gemini-written next-step guidance.",
    stack: ["React", "Flask", "PyTorch", "timm", "ONNX Runtime", "TensorFlow"],
    facts: [
      "85% validation accuracy across 10 classes on a 10,000-image dataset",
      "EfficientNet plus a custom CNN",
      "ONNX export unified inference across 3+ frameworks and CUDA, CPU, and MPS backends",
    ],
  },
  {
    tempId: 13,
    title: "Car Deal Rating Model",
    category: "ml",
    description: "An XGBoost classifier that rates used-car deals.",
    stack: ["R", "XGBoost", "Random forest", "Ensembling"],
    facts: [
      "92% cross-validated accuracy on 10,000 Dubai listings",
      "Engineered price, mileage, and benchmark features (+4%)",
      "5-fold CV, stacking, and probability ensembling closed a 4-5% overfitting gap",
    ],
  },
]

const hostOf = (url: string) => url.replace(/^https?:\/\//, "").replace(/\/$/, "")

interface ProjectCardProps {
  position: number
  project: Project
  handleMove: (steps: number) => void
  cardSize: number
}

const ProjectCard: React.FC<ProjectCardProps> = ({ position, project, handleMove, cardSize }) => {
  const isCenter = position === 0
  const category = CATEGORIES[project.category]
  const links = [
    project.url ? { label: hostOf(project.url), href: project.url } : null,
    project.repo ? { label: "GitHub", href: project.repo } : null,
  ].filter((link): link is { label: string; href: string } => link !== null)

  return (
    <div
      onClick={() => handleMove(position)}
      className={cn(
        "absolute left-1/2 top-1/2 cursor-pointer border-2 transition-all duration-500 ease-in-out",
        isCenter ? "z-10 text-white" : "z-0 bg-white text-gray-900",
      )}
      style={{
        width: cardSize,
        height: cardSize,
        borderColor: isCenter ? category.deep : category.accent,
        backgroundColor: isCenter ? category.deep : "#ffffff",
        clipPath: `polygon(${CORNER_CUT}px 0%, calc(100% - ${CORNER_CUT}px) 0%, 100% ${CORNER_CUT}px, 100% 100%, calc(100% - ${CORNER_CUT}px) 100%, ${CORNER_CUT}px 100%, 0 100%, 0 0)`,
        transform: `
          translate(-50%, -50%)
          translateX(${(cardSize / 1.5) * position}px)
          translateY(${isCenter ? -98 : position % 2 ? 22 : -22}px)
          rotate(${isCenter ? 0 : position % 2 ? 2.5 : -2.5}deg)
        `,
        boxShadow: isCenter ? "0px 8px 0px 4px hsl(var(--border))" : "0px 0px 0px 0px transparent",
      }}
    >
      <span
        className="absolute block origin-top-right rotate-45"
        style={{
          right: -2,
          top: CORNER_CUT - 2,
          width: SQRT_5000 * 1.5,
          height: 2,
          backgroundColor: isCenter ? "rgba(255,255,255,0.35)" : category.accent,
        }}
      />

      <div className="flex h-full flex-col overflow-y-auto p-8 sm:p-10">
        <span
          className="self-start rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider"
          style={
            isCenter
              ? { backgroundColor: "rgba(255,255,255,0.14)", color: "#ffffff" }
              : { backgroundColor: category.tint, color: category.deep }
          }
        >
          {category.label}
        </span>

        <h3 className="mt-3 text-2xl font-black leading-tight tracking-wide sm:text-[1.75rem]">{project.title}</h3>
        {project.subtitle && (
          <p className={cn("mt-1 text-xs font-semibold uppercase tracking-widest", isCenter ? "text-white/70" : "text-gray-500")}>
            {project.subtitle}
          </p>
        )}

        <p className={cn("mt-3 text-sm leading-relaxed", isCenter ? "text-white/90" : "text-gray-700")}>
          {project.description}
        </p>

        <ul className="mt-3 flex flex-wrap gap-1.5">
          {project.stack.map((item) => (
            <li
              key={item}
              className={cn(
                "rounded-full border px-2 py-0.5 text-[11px] font-medium",
                isCenter ? "border-white/30 text-white/85" : "border-gray-300 text-gray-600",
              )}
            >
              {item}
            </li>
          ))}
        </ul>

        <ul className={cn("mt-3 space-y-1.5 text-sm leading-snug", isCenter ? "text-white/90" : "text-gray-700")}>
          {project.facts.map((fact, index) => (
            <li key={fact} className={cn("flex gap-2", index >= 2 && "hidden sm:flex")}>
              <span
                className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ backgroundColor: isCenter ? "rgba(255,255,255,0.7)" : category.accent }}
              />
              <span>{fact}</span>
            </li>
          ))}
        </ul>

        {links.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-4 pt-4">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(event) => event.stopPropagation()}
                className={cn(
                  "inline-flex items-center gap-1 text-sm font-semibold underline-offset-4 hover:underline",
                  isCenter ? "text-white" : "text-gray-800",
                )}
              >
                {link.label}
                <ArrowUpRight className="h-4 w-4" />
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export const StaggerProjects: React.FC = () => {
  const [cardSize, setCardSize] = useState(CARD_SIZE_DESKTOP)
  const [projectList, setProjectList] = useState<Project[]>(projects)

  const handleMove = (steps: number) => {
    const newList = [...projectList]
    if (steps > 0) {
      for (let i = steps; i > 0; i--) {
        const item = newList.shift()
        if (!item) return
        newList.push({ ...item, tempId: Math.random() })
      }
    } else {
      for (let i = steps; i < 0; i++) {
        const item = newList.pop()
        if (!item) return
        newList.unshift({ ...item, tempId: Math.random() })
      }
    }
    setProjectList(newList)
  }

  useEffect(() => {
    const updateSize = () => {
      const { matches } = window.matchMedia("(min-width: 640px)")
      setCardSize(matches ? CARD_SIZE_DESKTOP : CARD_SIZE_MOBILE)
    }
    updateSize()
    window.addEventListener("resize", updateSize)
    return () => window.removeEventListener("resize", updateSize)
  }, [])

  return (
    <div>
      {/* Key */}
      <div className="mb-2 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-gray-600">
        {Object.values(CATEGORIES).map((category) => (
          <span key={category.label} className="inline-flex items-center gap-2">
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: category.accent }} />
            {category.label}
          </span>
        ))}
      </div>
      <p className="mb-4 text-center text-xs text-gray-500">Click a card to bring it forward.</p>

      <div className="relative w-full overflow-hidden bg-white" style={{ height: STAGE_HEIGHT }}>
        {projectList.map((project, index) => {
          const position =
            projectList.length % 2 ? index - (projectList.length + 1) / 2 : index - projectList.length / 2
          return (
            <ProjectCard
              key={project.tempId}
              project={project}
              handleMove={handleMove}
              position={position}
              cardSize={cardSize}
            />
          )
        })}
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
          <button
            onClick={() => handleMove(-1)}
            className={cn(
              "flex h-14 w-14 items-center justify-center text-2xl transition-colors",
              "bg-white border-2 border-gray-300 hover:bg-gray-900 hover:text-white",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2",
            )}
            aria-label="Previous project"
          >
            <ChevronLeft />
          </button>
          <button
            onClick={() => handleMove(1)}
            className={cn(
              "flex h-14 w-14 items-center justify-center text-2xl transition-colors",
              "bg-white border-2 border-gray-300 hover:bg-gray-900 hover:text-white",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2",
            )}
            aria-label="Next project"
          >
            <ChevronRight />
          </button>
        </div>
      </div>
    </div>
  )
}
