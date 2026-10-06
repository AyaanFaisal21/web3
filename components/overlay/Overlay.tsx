'use client'

import { useSyncExternalStore } from 'react'
import dynamic from 'next/dynamic'
import { FileText, Github, Linkedin } from 'lucide-react'
import { CHAPTERS } from '@/lib/journey'
import { CORES } from '@/lib/content/about'
import { getActiveCore, subscribeActiveCore } from '@/components/scene/state'

const DieScene = dynamic(() => import('@/components/scene/die/DieScene'), { ssr: false })

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

/** Chapter copy. Experience and Projects are placeholders until their interiors are built. */
const COPY: Record<string, { index: string; title: string; body: string }> = {
  about: {
    index: '01',
    title: 'About me',
    body: 'Ambitious innovator, designer and engineer building scalable business solutions and human-centered technology.',
  },
  experience: { index: '02', title: 'Experience', body: 'Where I have worked, most recent first.' },
  projects: { index: '03', title: 'Projects', body: 'What I have built, in parallel.' },
}

const eyebrow = 'text-[11px] uppercase tracking-[0.3em]'
const copyBlock = 'relative z-20 max-w-md px-6 pb-24 md:px-10 md:pb-28'

function ChapterCopy({ id }: { id: string }) {
  const copy = COPY[id]
  return (
    <div className={copyBlock}>
      <p className={`mb-3 text-[#d9b77a]/80 ${eyebrow}`}>
        {copy.index} — {copy.title}
      </p>
      <h2 className="mb-4 font-display text-5xl leading-none md:text-6xl">{copy.title}</h2>
      <p className="text-sm leading-relaxed text-white/60 md:text-base">{copy.body}</p>
    </div>
  )
}

/**
 * The About chapter's copy: the chapter intro while the stack pulls apart, then one entry per
 * core as the tour advances. Both occupy the same grid cell so swapping never shifts layout.
 */
function AboutCopy() {
  const core = useSyncExternalStore(subscribeActiveCore, getActiveCore, () => -1)
  const entry = core >= 0 ? CORES[core] : null
  const intro = COPY.about
  return (
    <div className={`${copyBlock} grid md:w-1/2 md:max-w-none md:pr-16`}>
      <div className="col-start-1 row-start-1 transition-opacity duration-500" style={{ opacity: entry ? 0 : 1 }}>
        <p className={`mb-3 text-[#d9b77a]/80 ${eyebrow}`}>
          {intro.index} — {intro.title}
        </p>
        <h2 className="mb-4 font-display text-5xl leading-none md:text-6xl">{intro.title}</h2>
        <p className="max-w-md text-sm leading-relaxed text-white/60 md:text-base">{intro.body}</p>
      </div>
      {entry && (
        <div key={core} className="core-in col-start-1 row-start-1">
          <p className={`mb-3 text-[#d9b77a]/80 ${eyebrow}`}>
            Core {String(core + 1).padStart(2, '0')} / {String(CORES.length).padStart(2, '0')} — {entry.title}
          </p>
          <h2 className="mb-4 font-display text-5xl leading-none md:text-6xl">{entry.title}</h2>
          <p className="max-w-md text-sm leading-relaxed text-white/60 md:text-base">{entry.body}</p>
        </div>
      )}
    </div>
  )
}

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
            {chapter.id !== 'hero' && <div className="chapter-scrim z-10" aria-hidden />}

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

            {chapter.id === 'about' && (
              <>
                <DieScene />
                <AboutCopy />
              </>
            )}

            {(chapter.id === 'experience' || chapter.id === 'projects') && <ChapterCopy id={chapter.id} />}

            {chapter.id === 'connect' && (
              <div className="relative z-20 max-w-lg px-6 pb-24 md:px-10 md:pb-28">
                <p className={`mb-3 text-[#d9b77a]/80 ${eyebrow}`}>04 — Connect</p>
                <h2 className="mb-4 font-display text-5xl leading-none md:text-7xl">Don&apos;t be a Stranger</h2>
                <p className="mb-8 text-sm leading-relaxed text-white/60 md:text-base">
                  Whether it&apos;s a role, a project, or just a conversation — reach out, I&apos;m always down to talk.
                </p>
                <div className="flex flex-wrap gap-6 pointer-events-auto">
                  {SOCIALS.map(({ label, href, Icon }) => (
                    <a key={label} href={href} target="_blank" rel="noopener noreferrer" className={`flex items-center gap-2 text-white/60 transition-colors hover:text-white ${eyebrow}`}>
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
