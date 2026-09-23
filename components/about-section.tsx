"use client"

import type { ReactNode } from "react"
import { motion } from "framer-motion"
import { AsciiImage } from "@/components/ui/ascii-image"

// Copy carried over from the ayaan-faisal.com About section.
const INTRO = [
  "I started with Legos. I liked how scattered, incomplete pieces could become something whole; software gave me that same feeling, just without a messy floor to clean up.",
  "I'm a CS, Data Science, and Math student at the Rutgers University Honors College focused on exploring how intelligent systems should be designed and used: how they manage memory, make decisions under uncertainty, stay accurate at scale, and interact with modern tools in ways they could not in the past.",
  "I've worked across the stack, training and deploying ML models in PyTorch and ONNX, building concurrent real-time backends with WebSockets and AsyncIO, and shipping responsive frontends like this one. Along the way, I'm drawn to the abstractions that make hard things elegant: vector databases that turn meaning into math, embedding spaces where similarity is geometry, and memory architectures that let a system remember selectively.",
]

const PEOPLE_FIRST = [
  "But no amount of focus on the system will matter if the person using it doesn't benefit from it. I track how it feels to use something, and the extent to which I can really help the people I'm building for, because that doesn't just drive my work, it defines it.",
  "I'm also drawn to problems where the right answer isn't obvious—where prudent judgment, good architecture, and a genuine understanding of human decisions all have to show up at once. Those are the problems worth building for.",
]

const MASTERS_QUOTE = "Somewhere out there, someone is better than me — that means I can definitely still improve."

const MASTERS = [
  "Growing up playing League of Legends taught me so much, but this is my favorite thing it taught me. The knowledge that someone starting where I started has already done it is why I began learning Arabic despite how daunting it looked; it's why I started working out despite how impossibly far away being in shape felt; it's why I strive for excellence even when the goal looks far away. The uncertainty and behavioral reasoning that defined the game I loved is probably also why I ended up as someone always down for a game of poker.",
  "We're all more than our work, but through my work and beyond it, you'll learn that I'm a highly adaptable, pragmatic idealist — ambitious, realistic, and relentless — and I think those traits go well together.",
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
