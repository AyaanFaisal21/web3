'use client'

import { useEffect, useSyncExternalStore, type ReactNode } from 'react'
import dynamic from 'next/dynamic'
import { CHAPTERS, type ChapterId } from '@/lib/journey'
import { ITEM_COUNTS, activeChapter, activeChip, activeCore, activeProject, selectChapter, stepItem } from '@/components/scene/state'
import { AboutCopy, ConnectCopy, ExperienceCopy, ProjectsCopy, eyebrow } from './ChapterCopy'

const DieScene = dynamic(() => import('@/components/scene/die/DieScene'), { ssr: false })

const useChapter = () => useSyncExternalStore(activeChapter.subscribe, activeChapter.get, () => 'hero' as ChapterId)

/** The item in focus for a touring chapter, read from its signal. */
function useItem(id: ChapterId) {
  const sig = id === 'about' ? activeCore : id === 'experience' ? activeChip : activeProject
  return useSyncExternalStore(sig.subscribe, sig.get, () => -1)
}

const control =
  'pointer-events-auto rounded-full border border-white/20 bg-black/60 px-4 py-2 font-mono text-[12px] uppercase tracking-[0.2em] text-white/80 backdrop-blur transition-colors hover:border-white/60 hover:text-white disabled:opacity-30 disabled:hover:border-white/20 disabled:hover:text-white/80'

/** The copy for an open chapter, with the controls that step its tour and close it. */
function ChapterPanel({ id, children }: { id: ChapterId; children: ReactNode }) {
  const item = useItem(id)
  const count = ITEM_COUNTS[id] ?? 0
  return (
    <div className="absolute inset-0 flex items-end">
      <div className="chapter-scrim z-10" aria-hidden />
      <div className="relative z-20 w-full">
        {children}
        <div className="absolute bottom-6 left-5 flex items-center gap-2 md:left-10">
          <button type="button" className={control} onClick={() => stepItem(-1)} disabled={item < 0} aria-label="Previous entry">
            ‹ prev
          </button>
          <span className="pointer-events-none px-2 font-mono text-[12px] tracking-[0.2em] text-white/50">
            {item < 0 ? 'intro' : `${item + 1} / ${count}`}
          </span>
          <button type="button" className={control} onClick={() => stepItem(1)} disabled={item >= count - 1} aria-label="Next entry">
            next ›
          </button>
          <button type="button" className={`${control} ml-3`} onClick={() => selectChapter('hero')} aria-label="Back to the PC">
            ✕ close
          </button>
        </div>
      </div>
    </div>
  )
}

/**
 * The HTML layer over the 3D scene: a fixed header whose links open chapters, the copy and
 * controls of the open chapter, and a hint on the home view. Nothing scrolls; the page is one
 * screen and the PC is the navigation.
 */
export function Overlay() {
  const chapter = useChapter()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') stepItem(1)
      else if (e.key === 'ArrowLeft') stepItem(-1)
      else if (e.key === 'Escape') selectChapter('hero')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 z-10 text-[#efe6d4]">
      <header className="pointer-events-auto absolute inset-x-0 top-0 z-30 flex items-center justify-between px-6 py-5 md:px-10">
        <button type="button" onClick={() => selectChapter('hero')} className="font-display text-lg tracking-[0.22em] md:text-xl">
          AYAAN FAISAL
        </button>
        <nav className={`hidden gap-8 text-white/55 md:flex ${eyebrow}`}>
          {CHAPTERS.filter((c) => c.id !== 'hero').map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => selectChapter(c.id)}
              className={`transition-colors hover:text-white ${chapter === c.id ? 'text-white' : ''}`}
            >
              {c.label}
            </button>
          ))}
        </nav>
      </header>

      {chapter === 'hero' && (
        <p className="absolute bottom-8 left-6 font-mono text-[14px] leading-relaxed text-white/55 md:left-10">
          <span className="text-[#d9b77a]">ayaan@pc:~$</span> whoami
          <br />
          builder. computer hardware, human-centered work, impact.
          <br />
          <span className="text-white/35">click the CPU, the RAM, the GPU, or a button on the front</span>
        </p>
      )}

      <DieScene />

      {chapter === 'about' && (
        <ChapterPanel id="about">
          <AboutCopy />
        </ChapterPanel>
      )}
      {chapter === 'experience' && (
        <ChapterPanel id="experience">
          <ExperienceCopy />
        </ChapterPanel>
      )}
      {chapter === 'projects' && (
        <ChapterPanel id="projects">
          <ProjectsCopy />
        </ChapterPanel>
      )}
      {chapter === 'connect' && (
        <div className="absolute inset-0 flex items-end">
          <div className="chapter-scrim z-10" aria-hidden />
          <div className="relative z-20 w-full">
            <ConnectCopy />
            <div className="absolute bottom-6 left-5 md:left-10">
              <button type="button" className={control} onClick={() => selectChapter('hero')} aria-label="Back to the PC">
                ✕ close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
