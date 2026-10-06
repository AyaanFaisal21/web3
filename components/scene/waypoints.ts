import type { ChapterId } from '@/lib/journey'
import { CASE, COOLER, CPU, FRONT_IO, GPU_BOX, RAM, RAM_CENTER_X, RAM_TOP_Z } from './pc/layout'

export type Waypoint = {
  pos: [number, number, number]
  look: [number, number, number]
  /** Optional control point: the camera arcs through it on the way to `pos`. */
  via?: [number, number, number]
  /**
   * Width of the subject, in metres, that must stay inside the viewport. On narrow screens the
   * rig backs the camera away along its line of sight until this fits.
   */
  fit?: number
}

/**
 * Where the camera sits for each chapter. The hero's distance is replaced at runtime by the
 * rig so the whole case fits whatever the viewport's shape; the others are fixed, subject to
 * their `fit` width.
 */
export const WAYPOINTS: Record<ChapterId, Waypoint> = {
  hero: { pos: [0, 0, 0.9], look: [0, -0.005, 0] },
  about: {
    pos: [CPU.x + 0.03, CPU.y + 0.012, COOLER.faceZ + 0.2],
    look: [CPU.x, CPU.y, COOLER.faceZ],
    fit: 0.11,
  },
  projects: {
    pos: [RAM_CENTER_X + 0.04, RAM.y, RAM_TOP_Z + 0.2],
    look: [RAM_CENTER_X, RAM.y, RAM_TOP_Z],
    fit: 0.1,
  },
  experience: {
    pos: [GPU_BOX.cx + 0.02, GPU_BOX.cy + 0.04, GPU_BOX.faceZ + 0.27],
    look: [GPU_BOX.cx, GPU_BOX.cy, GPU_BOX.faceZ],
    fit: 0.26,
  },
  connect: {
    pos: [0.44, -0.03, 0.2],
    look: [CASE.w / 2, FRONT_IO.y + 0.02, FRONT_IO.z],
    via: [0.62, 0.05, 0.75],
    fit: 0.14,
  },
}
