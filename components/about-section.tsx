"use client"

import type { ReactNode } from "react"
import { motion } from "framer-motion"
import { AsciiImage } from "@/components/ui/ascii-image"

// Copy cut from Ayaan's answer bank: systems and AI pull first, then agency and people, then the drive.
const INTRO = [
  "I've always built things: Legos, technical Minecraft mods, Discord bots for friends, then web apps for paying clients. Two years ago I also had a quiet list of things that were for other people: C++, Linux, systems programming, hardware. I turned out to be wrong about every item, and finding that out became the whole plan.",
  "So I kept going one layer beneath where most people stop. Today my work sits where performance and correctness meet AI: building agentic services, making models run faster at whatever layer the bottleneck actually lives, and asking whether the tests and correctness checks built around them hold. Every abstraction is somebody else's decision about what I don't get to touch, and the lower I go, the more of the answer I get to hold myself.",
  "That's why most of applied CS pulls at me, from GPU scheduling and backends to ML and security, including the corners where I don't have the most experience yet. The exception is frontend. I've shipped plenty of it, but technically it's a bit boring.",
]

const PEOPLE_FIRST = [
  "Nearly everything I've built, I built without permission. This summer I rented GPUs and measured how a scheduler behaves under contention on real silicon, clocks locked because I didn't trust the reported numbers. No lab, no supervisor, two papers. I joined a startup as its first engineer, and I ship a job board that students use every day. If the opportunity isn't there, I'd rather make it than wait for it.",
  "The other half is people. I help run a hackathon and an accelerator for student founders, and I go to hackathons and conferences more for the rooms than the outcomes. I like being early on things, and I especially like being around people who are further along than me. A year ago I joined the founding team of Rutgers' Muslim Tech Collaborative on a whim, and being surrounded by people who built things and expected me to changed my whole trajectory.",
  "It shapes how I build, too: understanding the people I'm building for and turning ambiguous wants into design insights is the part of engineering I refuse to skip.",
]

const MASTERS_QUOTE = "Somewhere out there, someone is better than me — that means I can definitely still improve."

const MASTERS = [
  "League taught me that. Knowing someone who started where I started has already done it is why I began learning Arabic, why I started working out, and why I go toward the thing I don't understand and don't accept a result until I've tried to break it.",
]

const MASTERS_CAPTION = "Statistically, I'm part of the 99th percentile of LoL players!"

function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      // Fire as soon as a slice of the block is on screen, so tall text is never left hidden on short viewports.
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function Paragraphs({ items, className }: { items: string[]; className: string }) {
  return (
    <div className={`space-y-5 text-lg md:text-xl leading-relaxed ${className}`}>
      {items.map((text) => (
        <p key={text}>{text}</p>
      ))}
    </div>
  )
}

export function AboutSection() {
  return (
    <section id="about" className="relative bg-white">
      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-grid-subtle opacity-30 pointer-events-none" />

      <div className="container relative z-10 mx-auto px-6 py-24 md:py-32">
        {/* Block 1: ASCII portrait on the left, intro on the right */}
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-20">
          <Reveal>
            <AsciiImage
              src="/images/about/AboutMe3.jpeg"
              alt="Portrait of Ayaan rendered in ASCII characters"
              width={598}
              height={787}
              cols={110}
              className="shadow-2xl"
            />
          </Reveal>
          <Reveal delay={0.15}>
            <h2 className="mb-8 text-4xl font-black tracking-wider text-gray-900 md:text-6xl">ABOUT ME</h2>
            <Paragraphs items={INTRO} className="text-gray-700" />
          </Reveal>
        </div>

        {/* Block 2: text on the left, two overlapping photos on the right */}
        <div className="mt-24 grid grid-cols-1 items-center gap-12 md:mt-32 md:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:gap-20">
          <Reveal>
            <Paragraphs items={PEOPLE_FIRST} className="text-gray-700" />
          </Reveal>
          <Reveal delay={0.15}>
            {/* The lower photo sits in front of the upper one. */}
            <div className="relative w-full" style={{ aspectRatio: "4 / 5" }}>
              <figure className="absolute left-0 top-0 aspect-[3/4] w-[58%] overflow-hidden border border-zinc-200 bg-zinc-100 shadow-xl">
                <img
                  src="/images/about/daytona-win.jpg"
                  alt="Ayaan holding the Daytona HackSprint prize check in San Francisco"
                  className="h-full w-full object-cover"
                />
              </figure>
              <figure className="absolute bottom-0 right-0 z-10 aspect-[3/4] w-[58%] overflow-hidden border border-zinc-200 bg-zinc-100 shadow-2xl">
                <img
                  src="/images/about/yc-picture.jpg"
                  alt="Ayaan in front of the Y Combinator sign"
                  className="h-full w-full object-cover"
                />
              </figure>
            </div>
          </Reveal>
        </div>

        {/* Block 3: final about block with the Masters promotion */}
        <div className="mt-24 grid grid-cols-1 items-center gap-12 md:mt-32 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-20">
          <Reveal>
            <figure className="relative overflow-hidden border border-zinc-200 bg-zinc-100 shadow-xl">
              <img
                src="/images/about/masters-promotion.jpg"
                alt="League of Legends ranked screen showing a promotion to Master"
                className="h-auto w-full"
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-black/85 px-4 py-3 text-center text-sm text-white/80">
                {MASTERS_CAPTION}
              </figcaption>
            </figure>
          </Reveal>
          <Reveal delay={0.15}>
            <p
              className="text-3xl leading-tight md:text-4xl lg:text-5xl"
              style={{ fontFamily: "var(--font-italiana)", color: "#c78347" }}
            >
              &ldquo;{MASTERS_QUOTE}&rdquo;
            </p>
            <div className="mt-8">
              <Paragraphs items={MASTERS} className="text-gray-700" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
