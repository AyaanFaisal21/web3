'use client'

import type { ReactNode } from 'react'

export type TermLine =
  | { kind: 'cmd'; text: string; cwd?: string }
  | { kind: 'h1'; text: string }
  | { kind: 'meta'; label: string; text: string }
  | { kind: 'text'; text: ReactNode }
  | { kind: 'item'; text: ReactNode }
  | { kind: 'link'; label: string; href: string }
  | { kind: 'blank' }

const USER = 'ayaan@pc'

/**
 * Every text box on the site is a shell session: a window with a title bar, a typed command,
 * and its output revealed line by line. `key` the parent on the item in focus so a new
 * session types in when the tour moves on.
 */
export function Terminal({ title, lines, className = '' }: { title: string; lines: TermLine[]; className?: string }) {
  let delay = 0
  const next = (ms: number) => {
    const d = delay
    delay += ms
    return d
  }
  return (
    <div className={`term ${className}`} role="group" aria-label={title}>
      <div className="term-bar" aria-hidden>
        <span className="term-dot" />
        <span className="term-dot" />
        <span className="term-dot" />
        <span className="term-title">{title}</span>
      </div>
      <div className="term-body">
        {lines.map((line, i) => {
          if (line.kind === 'cmd') {
            const d = next(60 + line.text.length * 28)
            return (
              <div key={i} className="term-line" style={{ animationDelay: `${d}ms` }}>
                <span className="term-prompt">
                  {USER}:{line.cwd ?? '~'}$
                </span>{' '}
                <span className="term-typed" style={{ ['--n' as string]: line.text.length, animationDelay: `${d}ms` }}>
                  {line.text}
                </span>
              </div>
            )
          }
          const d = next(line.kind === 'blank' ? 0 : 45)
          const style = { animationDelay: `${d}ms` }
          switch (line.kind) {
            case 'h1':
              return (
                <div key={i} className="term-line term-h1" style={style}>
                  # {line.text}
                </div>
              )
            case 'meta':
              return (
                <div key={i} className="term-line term-meta" style={style}>
                  <span className="term-key">{line.label}</span>
                  {line.text}
                </div>
              )
            case 'item':
              return (
                <div key={i} className="term-line term-item" style={style}>
                  <span className="term-bullet">-</span>
                  <span>{line.text}</span>
                </div>
              )
            case 'link':
              return (
                <div key={i} className="term-line" style={style}>
                  <a href={line.href} target="_blank" rel="noopener noreferrer" className="term-link pointer-events-auto">
                    → {line.label}
                  </a>
                </div>
              )
            case 'blank':
              return <div key={i} className="term-line term-blank" aria-hidden />
            default:
              return (
                <div key={i} className="term-line" style={style}>
                  {line.text}
                </div>
              )
          }
        })}
        <div className="term-line" style={{ animationDelay: `${delay}ms` }} aria-hidden>
          <span className="term-prompt">{USER}:~$</span> <span className="term-caret" />
        </div>
      </div>
    </div>
  )
}
