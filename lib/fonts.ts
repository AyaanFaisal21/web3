import { Italiana } from 'next/font/google'

/** The display face from the previous site's hero type; self-hosted by Next at build time. */
export const italiana = Italiana({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-italiana',
  display: 'swap',
})
