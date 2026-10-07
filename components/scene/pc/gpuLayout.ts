import { GPU, GPU_BOX } from './layout'

/**
 * The graphics card, in its own frame: x along its length (bracket at -x), y its thickness
 * (backplate +y, fans -y) and z its height off the board (slot edge at -z). Layers from the
 * top down: backplate, PCB with its parts on the underside, vapor chamber and fins, then
 * the shroud with the fans. All in metres.
 */
export const CARD = {
  length: GPU.length,
  thickness: GPU.thickness,
  height: GPU.height,
  backplateY: GPU.thickness / 2 - 0.001,
  pcbY: GPU.thickness / 2 - 0.0055,
  pcbT: 0.0016,
  heatsinkY: 0.001,
  heatsinkT: 0.024,
  shroudY: -GPU.thickness / 2 + 0.006,
  shroudT: 0.012,
  /** The open pose: slid toward the glass, raised a little, turned so the fan side faces out. */
  slide: 0.06,
  rise: 0.02,
  /** How far the shroud and the heatsink travel out when the card is bared. */
  shroudTravel: 0.1,
  heatsinkTravel: 0.045,
}

/** Face of the PCB that carries the parts: just below it in the card frame. */
export const PCB_FACE_Y = CARD.pcbY - CARD.pcbT / 2

/** GPU package on the PCB: substrate and die, centred left of the card's middle. */
export const PACKAGE = { x: -0.03, z: 0, size: 0.05, t: 0.002 }
export const GPU_DIE = { size: 0.026, t: 0.001 }

/** Twelve GDDR packages around the die, in card-local [x, z]. The first four are the top row. */
export const GDDR: [number, number][] = [
  [-0.057, 0.048], [-0.039, 0.048], [-0.021, 0.048], [-0.003, 0.048],
  [-0.057, -0.048], [-0.039, -0.048], [-0.021, -0.048], [-0.003, -0.048],
  [-0.082, 0.016], [-0.082, -0.016], [0.022, 0.016], [0.022, -0.016],
]
export const GDDR_SIZE: [number, number, number] = [0.014, 0.0012, 0.012]

/**
 * The die's floorplan, die-local [x, z] in metres: two columns of SM tiles with the L2 strip
 * between them, a tensor-core sub-block inside each SM, and memory controllers along the top
 * edge that feed the GDDR row above.
 */
export const FLOORPLAN = {
  l2: { w: 0.004, h: 0.02 },
  sm: { cols: 2, rows: 5, colX: 0.0075, rowPitch: 0.0044, w: 0.0085, h: 0.0036 },
  tensor: { dx: 0.0022, w: 0.0028, h: 0.0018 },
  mc: { count: 4, pitch: 0.006, z: 0.0118, w: 0.0038, h: 0.0012 },
}

export function smPosition(i: number): [number, number] {
  const row = Math.floor(i / FLOORPLAN.sm.cols)
  const col = i % FLOORPLAN.sm.cols
  return [(col === 0 ? -1 : 1) * FLOORPLAN.sm.colX, (2 - row) * FLOORPLAN.sm.rowPitch]
}

export function tensorPosition(i: number): [number, number] {
  const [x, z] = smPosition(i)
  return [x + FLOORPLAN.tensor.dx, z]
}

export function mcPosition(i: number): [number, number] {
  return [(i - (FLOORPLAN.mc.count - 1) / 2) * FLOORPLAN.mc.pitch, FLOORPLAN.mc.z]
}

/** Card-local position of a project block, by kind and index. */
export function blockLocal(kind: 'sm' | 'tensor' | 'mc', index: number): [number, number, number] {
  const [dx, dz] = kind === 'sm' ? smPosition(index) : kind === 'tensor' ? tensorPosition(index) : mcPosition(index)
  return [PACKAGE.x + dx, PCB_FACE_Y - PACKAGE.t - GPU_DIE.t, PACKAGE.z + dz]
}

export type CardPose = { x: number; y: number; z: number; rotX: number }

const ease = (t: number) => t * t * (3 - 2 * t)
const smooth = (p: number, a: number, b: number) => ease(Math.min(1, Math.max(0, (p - a) / (b - a))))

/** Where the card sits for an open amount of 0 (in its slot) to 1 (out, fan side to the glass). */
export function cardPose(out: number): CardPose {
  const slide = smooth(out, 0, 0.55)
  const turn = smooth(out, 0.35, 1)
  return {
    x: GPU_BOX.cx,
    y: GPU_BOX.cy + CARD.rise * slide,
    z: GPU_BOX.cz + CARD.slide * slide,
    rotX: (-Math.PI / 2) * turn,
  }
}

/** World position of a card-local point for a given open amount. */
export function cardToWorld(local: [number, number, number], out: number, target: { set: (x: number, y: number, z: number) => unknown }) {
  const p = cardPose(out)
  const c = Math.cos(p.rotX)
  const s = Math.sin(p.rotX)
  const [lx, ly, lz] = local
  // rotation about x: y' = y cos - z sin, z' = y sin + z cos
  return target.set(p.x + lx, p.y + ly * c - lz * s, p.z + ly * s + lz * c)
}
