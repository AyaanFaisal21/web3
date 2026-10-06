'use client'

import { FileText, Github, Linkedin } from 'lucide-react'
import { CHAPTERS } from '@/lib/journey'

function XIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.912-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

const SOCIALS = [
  { label: 'GitHub', href: 'https://github.com/AyaanFaisal21', Icon: Github },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/ayaanfaisal21/', Icon: Linkedin },
  { label: 'X', href: 'https://x.com/unorth_doX', Icon: XIcon },
  {
    label: 'Resume',
    href: 'https://drive.google.com/file/d/139lJn3_8caRHtZbu62m21gOkHSnOi0kh/view?usp=sharing',
    Icon: FileText,
  },
]

/** Chapter copy. The bodies are placeholders until each chapter's interior is built. */
const COPY: Record<string, { index: string; title: string; body: string }> = {
  about: {
    index: '01',
    title: 'About me',
    body: 'Ambitious innovator, designer and engineer building scalable business solutions and human-centered technology.',
  },
  projects: {
    index: '02',
    title: 'Projects',
    body: 'What I have built, stored block by block.',
  },
  experience: {
    index: '03',
    title: 'Experience',
    body: 'Technical work and community work, side by side.',
  },
}

const eyebrow = 'text-[11px] uppercase tracking-[0.3em]'

/**
 * The HTML layer over the 3D scene: a fixed header, one full-height section per chapter whose
 * sticky content stays put while the camera travels, and the social links at the end. Heights
 * come from the journey table so the camera and the copy always agree.
 */
export function Overlay() {
  return (
    <div className="relative z-10 pointer-events-none text-[#efe6d4]">
      <header className="fixed inset-x-0 top-0 z-20 flex items-center justify-between px-6 py-5 md:px-10 pointer-events-auto">
        <a href="#hero" className="font-display text-lg tracking-[0.22em] md:text-xl">
          AYAAN FAISAL
        </a>
        <nav className={`hidden gap-8 text-white/55 md:flex ${eyebrow}`}>
          {CHAPTERS.filter((c) => c.id !== 'hero').map((c) => (
            <a key={c.id} href={`#${c.id}`} className="transition-colors hover:text-white">
              {c.label}
            </a>
          ))}
        </nav>
      </header>

      {CHAPTERS.map((chapter) => (
        <section key={chapter.id} id={chapter.id} style={{ height: `${chapter.vh}vh` }} className="relative">
          <div className="sticky top-0 flex h-screen items-end">
            {chapter.id !== 'hero' && <div className="chapter-scrim" aria-hidden />}
            {chapter.id === 'hero' && (
              <>
                <p className={`absolute bottom-8 left-6 hidden text-white/50 md:left-10 md:block ${eyebrow}`}>
                  Software &amp; intelligent systems engineer
                </p>
                <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 text-[10px] uppercase tracking-[0.35em] text-white/40">
                  <span>Scroll</span>
                  <span className="scroll-line" />
                </div>
              </>
            )}

            {COPY[chapter.id] && (
              <div className="max-w-md px-6 pb-24 md:px-10 md:pb-28">
                <p className={`mb-3 text-[#d9b77a]/80 ${eyebrow}`}>
                  {COPY[chapter.id].index} — {COPY[chapter.id].title}
                </p>
                <h2 className="mb-4 font-display text-5xl leading-none md:text-6xl">{COPY[chapter.id].title}</h2>
                <p className="text-sm leading-relaxed text-white/60 md:text-base">{COPY[chapter.id].body}</p>
              </div>
            )}

            {chapter.id === 'connect' && (
              <div className="max-w-lg px-6 pb-24 md:px-10 md:pb-28">
                <p className={`mb-3 text-[#d9b77a]/80 ${eyebrow}`}>04 — Connect</p>
                <h2 className="mb-4 font-display text-5xl leading-none md:text-7xl">Don&apos;t be a Stranger</h2>
                <p className="mb-8 text-sm leading-relaxed text-white/60 md:text-base">
                  Whether it&apos;s a role, a project, or just a conversation — reach out, I&apos;m always down to talk.
                </p>
                <div className="flex flex-wrap gap-6 pointer-events-auto">
                  {SOCIALS.map(({ label, href, Icon }) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-2 text-white/60 transition-colors hover:text-white ${eyebrow}`}
                    >
                      <Icon size={14} /> {label}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      ))}
    </div>
  )
}
