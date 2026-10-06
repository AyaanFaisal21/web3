import type * as THREE from 'three'
import { BOARD_FACE_Z, RAM } from './layout'

const ease = (t: number) => t * t * (3 - 2 * t)
const smooth = (p: number, a: number, b: number) => ease(Math.min(1, Math.max(0, (p - a) / (b - a))))

/**
 * One DDR5 stick, in its own frame: y along its length, z its height off the board (centred,
 * so the slot end is at -height/2), x its thickness. The PCB carries eight chips on its +x face
 * under a front heat-spreader half; the back half and the light bar stay put when it opens.
 */
export const STICK = {
  length: RAM.length,
  height: RAM.height,
  pcb: 0.0012,
  spreader: 0.001,
  chip: { count: 8, w: 0.001, len: 0.011, h: 0.0085, pitch: 0.0152 },
  /** The open pose: lifted off the board, dropped a little so it clears the tubes, fanned to the right. */
  lift: 0.06,
  drop: 0.0325,
  fanX0: -0.03,
  fanPitch: 0.045,
  /** How far the front spreader slides up the stick to bare the chips. */
  bareSlide: 0.09,
}

export type StickPose = { x: number; y: number; z: number; rotY: number }

/**
 * Where stick `i` sits for an open amount of 0 (seated in its slot) to 1 (out, turned so the
 * chips face the glass, fanned out to the right). It rises first, then turns and spreads.
 */
export function stickPose(i: number, open: number): StickPose {
  const rise = smooth(open, 0, 0.5)
  const turn = smooth(open, 0.4, 1)
  const slotX = RAM.x0 + i * RAM.pitch
  return {
    x: slotX + (STICK.fanX0 + i * STICK.fanPitch - slotX) * turn,
    y: RAM.y - STICK.drop * rise,
    z: BOARD_FACE_Z + STICK.height / 2 + STICK.lift * rise,
    rotY: (-Math.PI / 2) * turn,
  }
}

/** Centre of chip `slot` (0 = bottom … 7 = top) in the stick's frame. */
export function chipLocal(slot: number): [number, number, number] {
  return [STICK.pcb / 2 + STICK.chip.w / 2, (slot - (STICK.chip.count - 1) / 2) * STICK.chip.pitch, 0.001]
}

/** World position of a chip on stick `i` for a given open amount. */
export function chipWorld(i: number, slot: number, open: number, out: THREE.Vector3) {
  const p = stickPose(i, open)
  const [lx, ly, lz] = chipLocal(slot)
  const c = Math.cos(p.rotY)
  const s = Math.sin(p.rotY)
  return out.set(p.x + lx * c + lz * s, p.y + ly, p.z - lx * s + lz * c)
}
