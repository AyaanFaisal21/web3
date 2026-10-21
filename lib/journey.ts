/**
 * The site's chapters, in nav order. There is no scrolling: the whole PC is the home view,
 * and clicking a part (or a nav link) opens its chapter in place.
 */
export const CHAPTERS = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'connect', label: 'Connect' },
] as const

export type ChapterId = (typeof CHAPTERS)[number]['id']
