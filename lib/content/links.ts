/**
 * The Connect chapter's links, pressed from the buttons on the PC's front panel. The power
 * button is the email; the others open in a new tab. Edit here; nothing else changes.
 */
const EMAIL = 'ayaanf205@gmail.com'

export type SiteLink = { key: string; label: string; href: string }

export const LINKS: SiteLink[] = [
  { key: 'github', label: 'GitHub', href: 'https://github.com/AyaanFaisal21' },
  { key: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/in/ayaanfaisal21/' },
  { key: 'resume', label: 'Resume', href: 'https://drive.google.com/file/d/1PnMkKbz0tW5yD7QxN5HltIdwNWfisRlw/view?usp=sharing' },
]

export function openLink(href: string) {
  window.open(href, '_blank', 'noopener,noreferrer')
}

/** Copies the address to the clipboard; where that is not allowed, opens a mail draft instead. */
export async function copyEmail(): Promise<'copied' | 'opened'> {
  try {
    await navigator.clipboard.writeText(EMAIL)
    return 'copied'
  } catch {
    window.location.href = `mailto:${EMAIL}`
    return 'opened'
  }
}
