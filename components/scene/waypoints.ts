import type { ChapterId } from '@/lib/journey'
import { CASE, COOLER, CPU, FRONT_IO, GPU_BOX } from './pc/layout'
import { CARD } from './pc/gpuLayout'

export type Waypoint = {
  pos: [number, number, number]
  look: [number, number, number]
  /**
   * Width of the subject, in metres, that must stay inside the viewport. On narrow screens the
   * rig backs the camera away along its line of sight until this fits.
   */
  fit?: number
  /** Height of the subject that must fit, the same way. */
  fitH?: number
  /**
   * Shifts the look target sideways/up in camera space (metres) so the subject sits off-centre,
   * leaving room for a panel of copy or the die view. Chosen by viewport orientation.
   */
  frame?: { landscape: [number, number]; portrait: [number, number] }
}

/** The home view's line of sight: from the front-right, a little above, so the glass side and the front panel both show. */
// About 36° toward the front: any further and the front pillar hides the RAM sticks, which sit deep by the tray.
export const HERO_DIR: [number, number, number] = [0.576, 0.196, 0.793]

/**
 * Where the camera sits for each chapter. The hero's position is set at runtime by the rig,
 * along HERO_DIR at whatever distance fits the case; the others are fixed, subject to `fit`.
 */
export const WAYPOINTS: Record<ChapterId, Waypoint> = {
  // Room above and beside the case for the callout boxes.
  hero: { pos: [0.3, 0.1, 0.27], look: [0.0, 0.0, 0.0], fit: 0.7, fitH: CASE.h * 1.5 },
  // A three-quarter view from the front-right, so the pulled-apart stack (board → CPU → block)
  // reads as layers in depth. Framed to the right (or top) to leave room for the die view.
  about: {
    pos: [CPU.x + 0.13, CPU.y + 0.05, COOLER.faceZ + 0.34],
    look: [CPU.x, CPU.y, COOLER.faceZ + 0.04],
    fit: 0.2,
    frame: { landscape: [-0.15, 0], portrait: [-0.035, -0.075] },
  },
  // The overview of the four sticks once they have risen, turned to the glass and fanned out.
  experience: {
    pos: [0.0375, 0.06, 0.3],
    look: [0.0375, 0.06, -0.04],
    fit: 0.2,
    frame: { landscape: [-0.06, 0], portrait: [0, -0.05] },
  },
  // The card once it has slid out and turned its fan side to the glass: an upright 32 × 14 cm board.
  projects: {
    pos: [GPU_BOX.cx, GPU_BOX.cy + CARD.rise - 0.005, GPU_BOX.cz + CARD.slide + 0.37],
    look: [GPU_BOX.cx, GPU_BOX.cy + CARD.rise, GPU_BOX.cz + CARD.slide],
    fit: 0.36,
    frame: { landscape: [-0.09, 0], portrait: [0, -0.07] },
  },
  // The front panel's column of buttons, seen a little from the glass side so they read as raised parts.
  connect: {
    pos: [0.46, -0.0, 0.1],
    look: [CASE.w / 2, FRONT_IO.y, FRONT_IO.z],
    fit: 0.2,
    fitH: 0.22,
    frame: { landscape: [-0.05, 0], portrait: [0, -0.03] },
  },
}
