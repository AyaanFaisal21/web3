"use client"

import type * as React from "react"
import { useRef, useState } from "react"
import { motion, useMotionTemplate, useScroll, useTransform } from "framer-motion"
import { FileText, Github, Linkedin } from "lucide-react"

// Contact form posts straight to Formspree, same endpoint as ayaan-faisal.com.
const FORMSPREE_ENDPOINT = "https://formspree.io/f/xrekjgzr"
const WHITE_GLOW = "0 0 40px 4px rgba(255,255,255,0.08), 0 0 80px 8px rgba(255,255,255,0.04)"
const INPUT_CLASS =
  "flex-1 bg-black/40 border border-zinc-700 px-4 py-3 text-zinc-200 text-sm focus:outline-none focus:border-white/60 focus:shadow-[0_0_10px_2px_rgba(255,255,255,0.18),0_0_24px_rgba(255,255,255,0.08)] transition-all placeholder:text-zinc-600"

const SOCIAL_LINKS = [
  { label: "GitHub", href: "https://github.com/AyaanFaisal21", Icon: Github },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/ayaanfaisal21/", Icon: Linkedin },
  { label: "X", href: "https://x.com/unorth_doX", Icon: XIcon },
  {
    label: "Resume",
    href: "https://drive.google.com/file/d/139lJn3_8caRHtZbu62m21gOkHSnOi0kh/view?usp=sharing",
    Icon: FileText,
  },
]

function XIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.912-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

interface SmoothScrollHeroProps {
  scrollHeight?: number
  desktopImage: string
  mobileImage: string
  initialClipPercentage?: number
  finalClipPercentage?: number
}

const SmoothScrollHero: React.FC<SmoothScrollHeroProps> = ({
  scrollHeight = 1875,
  desktopImage,
  mobileImage,
  initialClipPercentage = 25,
  finalClipPercentage = 75,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [formState, setFormState] = useState<"idle" | "sending" | "sent" | "error">("idle")

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFormState("sending")
    const form = event.currentTarget
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      })
      if (res.ok) {
        setFormState("sent")
        form.reset()
      } else {
        setFormState("error")
      }
    } catch {
      setFormState("error")
    }
  }

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  // Clip path animation - image fully reveals by 70% scroll progress
  const clipStart = useTransform(scrollYProgress, [0, 0.7], [initialClipPercentage, 0])
  const clipEnd = useTransform(scrollYProgress, [0, 0.7], [finalClipPercentage, 100])
  const clipPath = useMotionTemplate`polygon(${clipStart}% ${clipStart}%, ${clipEnd}% ${clipStart}%, ${clipEnd}% ${clipEnd}%, ${clipStart}% ${clipEnd}%)`

  // Background size animation - completes when image is fully revealed
  const backgroundSize = useTransform(scrollYProgress, [0, 0.7], ["170%", "100%"])

  // Scale animation - completes when image is fully revealed
  const scale = useTransform(scrollYProgress, [0, 0.7], [1.2, 1])

  // Contact overlay animations - appears earlier and completes by 50%
  const ctaOpacity = useTransform(scrollYProgress, [0.3, 0.5], [0, 1])
  const ctaY = useTransform(scrollYProgress, [0.3, 0.5], [50, 0])

  return (
    <div ref={containerRef} style={{ height: `${scrollHeight}px` }} className="relative w-full">
      <motion.div
        className="sticky top-0 h-screen w-full bg-black overflow-hidden"
        style={{
          clipPath,
          willChange: "transform",
        }}
      >
        {/* Desktop background */}
        <motion.div
          className="absolute inset-0 hidden md:block"
          style={{
            backgroundImage: `url(${desktopImage})`,
            backgroundSize,
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            scale,
          }}
        />
        {/* Mobile background */}
        <motion.div
          className="absolute inset-0 md:hidden"
          style={{
            backgroundImage: `url(${mobileImage})`,
            backgroundSize,
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            scale,
          }}
        />

        {/* Dark overlay for better contrast */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Contact Overlay — title and form sit directly on the background image */}
        <motion.div
          className="absolute inset-0 z-20 flex flex-col items-center overflow-y-auto overflow-x-hidden"
          style={{
            opacity: ctaOpacity,
            y: ctaY,
          }}
        >
          <h2
            className="shrink-0 text-center pointer-events-none select-none px-4 md:whitespace-nowrap"
            style={{
              fontFamily: "var(--font-italiana)",
              color: "#d6bb6a",
              // Italiana runs about 0.55em per character, so 8.5vw keeps the 19-character title inside the viewport.
              fontSize: "clamp(2.5rem, 8.5vw, 8.5rem)",
              lineHeight: 0.95,
              paddingTop: "4.5rem",
              paddingBottom: "1.5rem",
            }}
          >
            {"Don't be a Stranger"}
          </h2>

          <div className="w-full max-w-7xl px-4 sm:px-8 flex flex-col gap-4 pb-8">
            <div
              className="flex flex-col gap-4 bg-black/50 border border-zinc-700 px-5 py-6 sm:px-8 sm:py-7"
              style={{ backdropFilter: "blur(6px)", boxShadow: WHITE_GLOW }}
            >
              <p
                className="text-white/90 text-base leading-relaxed text-center font-light"
                style={{ textShadow: "0 0 10px rgba(255,255,255,0.85)" }}
              >
                {"Whether it's a role, a project, or just a conversation — reach out, I'm always down to talk"}
              </p>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-4 sm:flex-row">
                  <input type="text" name="name" placeholder="Name" required className={INPUT_CLASS} />
                  <input type="email" name="email" placeholder="Email" required className={INPUT_CLASS} />
                </div>
                <textarea
                  name="message"
                  placeholder="Your message"
                  required
                  rows={5}
                  className={`${INPUT_CLASS} resize-none`}
                />
                <div className="flex flex-wrap items-center justify-center gap-4">
                  {formState === "sent" && (
                    <span className="text-zinc-400 text-xs tracking-wide">{"Message sent — I'll be in touch."}</span>
                  )}
                  {formState === "error" && (
                    <span className="text-zinc-500 text-xs tracking-wide">{"Something went wrong — try again."}</span>
                  )}
                  <button
                    type="submit"
                    disabled={formState === "sending" || formState === "sent"}
                    className="border border-zinc-500 px-10 py-3 text-zinc-200 hover:text-white hover:border-white transition-colors text-xs tracking-widest uppercase disabled:opacity-40 disabled:pointer-events-none"
                  >
                    {formState === "sending" ? "Sending…" : formState === "sent" ? "Sent" : "Send Message"}
                  </button>
                </div>
              </form>
            </div>

            {/* Footer */}
            <div className="mt-2 pt-5 border-t border-zinc-700/60 flex flex-col items-center gap-3">
              <span className="text-sm uppercase text-white/80" style={{ letterSpacing: "0.12em" }}>
                Ayaan Faisal
              </span>
              <div className="flex flex-wrap items-center justify-center gap-6">
                {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5 text-xs tracking-wide"
                  >
                    <Icon size={14} /> {label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default SmoothScrollHero
