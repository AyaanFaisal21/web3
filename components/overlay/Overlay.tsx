'use client'

import dynamic from 'next/dynamic'
import { CHAPTERS } from '@/lib/journey'
import { AboutCopy, ConnectCopy, ExperienceCopy, ProjectsCopy, eyebrow } from './ChapterCopy'

const DieScene = dynamic(() => import('@/components/scene/die/DieScene'), { ssr: false })

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
                <p className="absolute bottom-8 left-6 hidden font-mono text-[12px] text-white/55 md:left-10 md:block">
                  <span className="text-[#d9b77a]">ayaan@pc:~$</span> whoami
                  <br />
                  software &amp; intelligent systems engineer
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
            {chapter.id === 'experience' && <ExperienceCopy />}
            {chapter.id === 'projects' && <ProjectsCopy />}

            {chapter.id === 'connect' && <ConnectCopy />}
          </div>
        </section>
      ))}
    </div>
  )
}
