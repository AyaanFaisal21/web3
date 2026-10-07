'use client'

import { useSyncExternalStore } from 'react'
import { CORES } from '@/lib/content/about'
import { EXPERIENCES } from '@/lib/content/experience'
import { CATEGORIES, PROJECTS } from '@/lib/content/projects'
import { activeChip, activeCore, activeProject } from '@/components/scene/state'
import { Terminal, type TermLine } from './Terminal'

export const eyebrow = 'text-[11px] uppercase tracking-[0.3em]'
const block = 'relative z-20 w-full px-5 pb-20 md:px-10 md:pb-24'
const half = 'md:w-1/2 md:pr-12'

const INTRO: Record<string, { cmd: string; title: string; body: string }> = {
  about: { cmd: 'cat about.md', title: 'About me', body: 'Ambitious innovator, designer and engineer building scalable business solutions and human-centered technology.' },
  experience: { cmd: 'cat experience.md', title: 'Experience', body: 'Where I have worked, one DRAM package per role, most recent first.' },
  projects: { cmd: 'cat projects.md', title: 'Projects', body: 'Fourteen builds mapped onto the die by what they are: kernels and systems in the SMs, models in the Tensor Cores, products in the memory system.' },
}

const introLines = (id: string): TermLine[] => [
  { kind: 'cmd', text: INTRO[id].cmd },
  { kind: 'h1', text: INTRO[id].title },
  { kind: 'text', text: INTRO[id].body },
]

/** Both the intro and the item share one grid cell, so swapping never shifts layout. */
function Swap({ id, title, item, itemKey, wide = false }: { id: string; title: string; item: TermLine[] | null; itemKey: number; wide?: boolean }) {
  return (
    <div className={`${block} grid ${wide ? 'max-w-2xl' : 'max-w-xl'} ${half}`}>
      <div className="col-start-1 row-start-1 transition-opacity duration-500" style={{ opacity: item ? 0 : 1 }} aria-hidden={!!item}>
        <Terminal title={`${id} — bash`} lines={introLines(id)} />
      </div>
      {item && (
        <div key={itemKey} className="col-start-1 row-start-1">
          <Terminal title={title} lines={item} className="max-h-[62vh] md:max-h-none" />
        </div>
      )}
    </div>
  )
}

export function AboutCopy() {
  const core = useSyncExternalStore(activeCore.subscribe, activeCore.get, () => -1)
  const entry = core >= 0 ? CORES[core] : null
  const lines: TermLine[] | null = entry && [
    { kind: 'cmd', text: `cat cores/${String(core).padStart(2, '0')}-${entry.key}.md`, cwd: '~/about' },
    { kind: 'h1', text: entry.title },
    { kind: 'meta', label: 'core', text: `${core + 1} / ${CORES.length}` },
    { kind: 'text', text: entry.body },
  ]
  return <Swap id="about" title={`about/${entry?.key ?? ''} — bash`} item={lines} itemKey={core} />
}

export function ExperienceCopy() {
  const chip = useSyncExternalStore(activeChip.subscribe, activeChip.get, () => -1)
  const entry = chip >= 0 ? EXPERIENCES[chip] : null
  const lines: TermLine[] | null = entry && [
    { kind: 'cmd', text: `cat ${entry.key}.md`, cwd: '~/experience' },
    { kind: 'h1', text: entry.role },
    { kind: 'meta', label: 'org', text: entry.company },
    { kind: 'meta', label: 'when', text: entry.dates },
    { kind: 'meta', label: 'dram', text: `${chip + 1} / ${EXPERIENCES.length}` },
    { kind: 'meta', label: 'stack', text: entry.stack.join(' · ') },
    { kind: 'blank' },
    { kind: 'text', text: entry.summary },
  ]
  return <Swap id="experience" title={`experience/${entry?.key ?? ''} — bash`} item={lines} itemKey={chip} />
}

export function ProjectsCopy() {
  const project = useSyncExternalStore(activeProject.subscribe, activeProject.get, () => -1)
  const entry = project >= 0 ? PROJECTS[project] : null
  const lines: TermLine[] | null = entry && [
    { kind: 'cmd', text: `cat ${entry.key}.md`, cwd: '~/projects' },
    { kind: 'h1', text: entry.subtitle ? `${entry.title} — ${entry.subtitle}` : entry.title },
    { kind: 'meta', label: 'block', text: `${CATEGORIES[entry.category].block} · ${project + 1} / ${PROJECTS.length}` },
    { kind: 'meta', label: 'kind', text: CATEGORIES[entry.category].label },
    { kind: 'meta', label: 'stack', text: entry.stack.join(' · ') },
    { kind: 'blank' },
    { kind: 'text', text: entry.description },
    ...entry.facts.map((f): TermLine => ({ kind: 'item', text: f })),
    ...(entry.url ? [{ kind: 'link', label: entry.url.replace(/^https?:\/\//, ''), href: entry.url } as TermLine] : []),
    ...(entry.repo ? [{ kind: 'link', label: entry.repo.replace(/^https?:\/\//, ''), href: entry.repo } as TermLine] : []),
  ]
  return <Swap id="projects" title={`projects/${entry?.key ?? ''} — bash`} item={lines} itemKey={project} wide />
}

const SOCIALS = [
  { label: 'github.com/AyaanFaisal21', href: 'https://github.com/AyaanFaisal21' },
  { label: 'linkedin.com/in/ayaanfaisal21', href: 'https://www.linkedin.com/in/ayaanfaisal21/' },
  { label: 'x.com/unorth_doX', href: 'https://x.com/unorth_doX' },
  { label: 'resume.pdf', href: 'https://drive.google.com/file/d/139lJn3_8caRHtZbu62m21gOkHSnOi0kh/view?usp=sharing' },
]

export function ConnectCopy() {
  const lines: TermLine[] = [
    { kind: 'cmd', text: 'cat contact.txt' },
    { kind: 'h1', text: "Don't be a Stranger" },
    { kind: 'text', text: "Whether it's a role, a project, or just a conversation — reach out, I'm always down to talk." },
    { kind: 'blank' },
    { kind: 'cmd', text: 'ls links/' },
    ...SOCIALS.map((s): TermLine => ({ kind: 'link', label: s.label, href: s.href })),
  ]
  return (
    <div className={`${block} max-w-xl`}>
      <Terminal title="contact — bash" lines={lines} />
    </div>
  )
}
