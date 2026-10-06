import * as THREE from 'three'
import { CORES } from '@/lib/content/about'
import { EXPERIENCES } from '@/lib/content/experience'
import { chipWorld } from './pc/ramExplode'
import { activeChip, activeCore, sceneState } from './state'
import type { Waypoint } from './waypoints'

export const ease = (t: number) => t * t * (3 - 2 * t)

/** 0 before `a`, 1 after `b`, smooth in between. */
export function smooth(p: number, a: number, b: number) {
  return ease(THREE.MathUtils.clamp((p - a) / (b - a), 0, 1))
}

/**
 * The About chapter's program, as a function of progress through its hold: the pump block
 * lifts, the heat spreader follows, the die view fades in and the tour visits each core.
 * The stack stays open through Experience; it closes again in that chapter's finale, after
 * the RAM has rebuilt (lid first, then the block drops).
 */
export function runAboutProgram(pAbout: number, pExperience: number) {
  const about = sceneState.about
  about.explode = Math.min(smooth(pAbout, 0, 0.1), 1 - smooth(pExperience, 0.94, 1))
  about.lid = Math.min(smooth(pAbout, 0.07, 0.16), 1 - smooth(pExperience, 0.9, 0.95))
  about.dieOpacity = smooth(pAbout, 0.12, 0.18) * (1 - smooth(pAbout, 0.92, 0.97))
  const tourStart = 0.18
  const tourEnd = 0.92
  const inTour = pAbout > tourStart && pAbout < tourEnd
  activeCore.set(inTour ? Math.min(CORES.length - 1, Math.floor(((pAbout - tourStart) / (tourEnd - tourStart)) * CORES.length)) : -1)
}

/** Where the Experience chapter leaves the camera: a wide shot of the rebuilt RAM and the stack closing. */
export const EXPERIENCE_FINALE: Waypoint = { pos: [-0.02, 0.1, 0.36], look: [-0.055, 0.085, -0.05], fit: 0.22 }

const chipPos = new THREE.Vector3()
const STOPS_START = 0.25
const STOPS_END = 0.84

/**
 * The Experience chapter's program: sticks rise, turn and fan out (staggered), the front
 * spreaders slide off, the camera visits each entry's chip, then everything rebuilds. Returns
 * the camera pose the hold should use, or null for the chapter's waypoint (the overview).
 */
export function runExperienceProgram(pExperience: number, aspect: number): Waypoint | null {
  const ram = sceneState.ram
  for (let i = 0; i < ram.open.length; i++) {
    const opening = smooth(pExperience, i * 0.02, 0.16 + i * 0.02)
    const closing = 1 - smooth(pExperience, 0.84 + i * 0.015, 0.92 + i * 0.015)
    ram.open[i] = Math.min(opening, closing)
  }
  ram.bare = Math.min(smooth(pExperience, 0.17, 0.24), 1 - smooth(pExperience, 0.79, 0.85))

  const inStops = pExperience > STOPS_START && pExperience < STOPS_END
  const chip = inStops
    ? Math.min(EXPERIENCES.length - 1, Math.floor(((pExperience - STOPS_START) / (STOPS_END - STOPS_START)) * EXPERIENCES.length))
    : -1
  activeChip.set(chip)

  if (chip >= 0) {
    const e = EXPERIENCES[chip]
    chipWorld(e.stick, e.slot, 1, chipPos)
    return {
      pos: [chipPos.x + 0.022, chipPos.y + 0.006, chipPos.z + 0.05],
      look: [chipPos.x, chipPos.y, chipPos.z],
      frame: aspect >= 1 ? { landscape: [-0.012, 0], portrait: [0, 0] } : { landscape: [0, 0], portrait: [0, -0.008] },
    }
  }
  if (pExperience >= STOPS_END) return EXPERIENCE_FINALE
  return null
}
