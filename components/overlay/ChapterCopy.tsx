'use client'

import { useSyncExternalStore } from 'react'
import { CORES } from '@/lib/content/about'
import { EXPERIENCES } from '@/lib/content/experience'
import { activeChip, activeCore } from '@/components/scene/state'

export const eyebrow = 'text-[11px] uppercase tracking-[0.3em]'
const block = 'relative z-20 px-6 pb-24 md:px-10 md:pb-28'
const label = `mb-3 text-[#d9b77a]/80 ${eyebrow}`
const title = 'mb-4 font-display text-5xl leading-none md:text-6xl'
const body = 'text-sm leading-relaxed text-white/60 md:text-base'

/** Chapter intros; About and Experience swap to per-item copy once their tours begin. */
export const COPY: Record<string, { index: string; title: string; body: string }> = {
  about: {
    index: '01',
    title: 'About me',
    body: 'Ambitious innovator, designer and engineer building scalable business solutions and human-centered technology.',
  },
  experience: { index: '02', title: 'Experience', body: 'Where I have worked, most recent first.' },
  projects: { index: '03', title: 'Projects', body: 'What I have built, in parallel.' },
}

/** `**bold**` markers from the previous site's copy, rendered as emphasis. */
function Rich({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
        part.startsWith('**') ? (
          <strong key={i} className="font-semibold text-[#efe6d4]">
            {part.slice(2, -2)}
          </strong>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  )
}

function Intro({ id }: { id: string }) {
  const copy = COPY[id]
  return (
    <>
      <p className={label}>
        {copy.index} — {copy.title}
      </p>
      <h2 className={title}>{copy.title}</h2>
      <p className={`max-w-md ${body}`}>{copy.body}</p>
    </>
  )
}

export function PlainCopy({ id }: { id: string }) {
  return (
    <div className={`${block} max-w-md`}>
      <Intro id={id} />
    </div>
  )
}

/**
 * The About chapter's copy: the intro while the stack pulls apart, then one entry per core as
 * the tour advances. Both occupy the same grid cell so swapping never shifts layout.
 */
export function AboutCopy() {
  const core = useSyncExternalStore(activeCore.subscribe, activeCore.get, () => -1)
  const entry = core >= 0 ? CORES[core] : null
  return (
    <div className={`${block} grid max-w-md md:w-1/2 md:max-w-none md:pr-16`}>
      <div className="col-start-1 row-start-1 transition-opacity duration-500" style={{ opacity: entry ? 0 : 1 }}>
        <Intro id="about" />
      </div>
      {entry && (
        <div key={core} className="core-in col-start-1 row-start-1">
          <p className={label}>
            Core {String(core + 1).padStart(2, '0')} / {String(CORES.length).padStart(2, '0')} — {entry.title}
          </p>
          <h2 className={title}>{entry.title}</h2>
          <p className={`max-w-md ${body}`}>{entry.body}</p>
        </div>
      )}
    </div>
  )
}

/** The Experience chapter's copy: the intro, then one entry per DRAM chip the camera visits. */
export function ExperienceCopy() {
  const chip = useSyncExternalStore(activeChip.subscribe, activeChip.get, () => -1)
  const entry = chip >= 0 ? EXPERIENCES[chip] : null
  return (
    <div className={`${block} grid max-w-lg md:w-1/2 md:max-w-none md:pr-16`}>
      <div className="col-start-1 row-start-1 transition-opacity duration-500" style={{ opacity: entry ? 0 : 1 }}>
        <Intro id="experience" />
      </div>
      {entry && (
        <div key={chip} className="core-in col-start-1 row-start-1 max-w-lg">
          <p className={label}>
            DRAM {String(chip + 1).padStart(2, '0')} / {String(EXPERIENCES.length).padStart(2, '0')} — {entry.company}
          </p>
          <h2 className="mb-2 font-display text-4xl leading-none md:text-5xl">{entry.role}</h2>
          <p className={`mb-4 text-[#d9b77a]/70 ${eyebrow}`}>{entry.dates}</p>
          {entry.summary && <p className={`mb-4 hidden md:block ${body}`}>{entry.summary}</p>}
          <ul className={`space-y-2 ${body}`}>
            {entry.bullets.map((b, i) => (
              <li key={i} className={`flex gap-3 ${i === 2 ? 'hidden md:flex' : ''}`}>
                <span className="mt-[0.55em] h-px w-3 shrink-0 bg-[#d9b77a]/60" aria-hidden />
                <span>
                  <Rich text={b} />
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
