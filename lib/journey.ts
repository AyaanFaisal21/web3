/**
 * The scroll journey, one entry per chapter in page order.
 *
 * `vh` is the chapter's scroll height in viewport heights. The camera travels from the
 * previous chapter's waypoint to this chapter's over the TRAVEL_VH of scrolling that
 * precede the chapter's top edge reaching the top of the viewport, then holds there until
 * the next chapter's travel begins. The DOM sections (Overlay) and the camera (CameraRig)
 * both derive their geometry from this table so they can never drift apart.
 */
export const CHAPTERS = [
  { id: 'hero',       label: 'Home',       vh: 100 },
  { id: 'about',      label: 'About',      vh: 150 },
  { id: 'projects',   label: 'Projects',   vh: 150 },
  { id: 'experience', label: 'Experience', vh: 150 },
  { id: 'connect',    label: 'Connect',    vh: 100 },
] as const

export type ChapterId = (typeof CHAPTERS)[number]['id']

/** Scroll distance, in vh, over which the camera moves between two waypoints. */
export const TRAVEL_VH = 70

/** Cumulative start offset of each chapter, in vh. */
export const CHAPTER_STARTS_VH: number[] = CHAPTERS.reduce<number[]>((acc, _c, i) => {
  acc.push(i === 0 ? 0 : acc[i - 1] + CHAPTERS[i - 1].vh)
  return acc
}, [])
