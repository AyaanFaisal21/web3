/**
 * Every dimension of the PC in one place, in metres, so the model, the camera waypoints and
 * (later) the component interiors all agree.
 *
 * World origin is the centre of the case. The viewer looks through the glass side panel from
 * +Z; the motherboard tray is the far wall at -Z. Rear of the case is -X, front is +X.
 */
export const CASE = {
  w: 0.42, // x: rear → front
  h: 0.47, // y
  d: 0.285, // z: tray → glass
  panel: 0.012,
  front: 0.02, // the brushed front pillar is thicker than the other panels
  glass: 0.004,
}

/** Usable interior volume. */
export const INNER = {
  xMin: -CASE.w / 2 + CASE.panel,
  xMax: CASE.w / 2 - CASE.front,
  yMin: -CASE.h / 2 + CASE.panel,
  yMax: CASE.h / 2 - CASE.panel,
  zMin: -CASE.d / 2 + 0.01,
  zMax: CASE.d / 2 - CASE.glass,
}

export const FAN = { size: 0.12, depth: 0.025 }

/** ATX motherboard (244 × 305 mm) standing on the tray, rear edge 8 mm off the rear panel. */
export const BOARD = {
  w: 0.244,
  h: 0.305,
  t: 0.0016,
  x: INNER.xMin + 0.008 + 0.122,
  y: 0.0075,
  z: INNER.zMin + 0.0088, // standoffs
}
export const BOARD_FACE_Z = BOARD.z + BOARD.t / 2

/** CPU socket centre, about 90 mm from the rear edge and 65 mm below the top edge. */
export const CPU = { x: BOARD.x - 0.032, y: BOARD.y + 0.0875, size: 0.04 }

/** AIO pump block over the CPU; its lit face is what the About chapter flies toward. */
export const COOLER = { size: 0.072, depth: 0.05, faceZ: BOARD_FACE_Z + 0.05 }

/** Four DIMMs to the right of the CPU. Their light bars face the glass. */
export const RAM = {
  count: 4,
  pitch: 0.0085,
  thickness: 0.007,
  length: 0.133,
  height: 0.04, // how far a stick stands off the board
  x0: BOARD.x + 0.03, // first slot
  y: BOARD.y + 0.085,
}
export const RAM_TOP_Z = BOARD_FACE_Z + RAM.height
export const RAM_CENTER_X = RAM.x0 + (RAM.pitch * (RAM.count - 1)) / 2

/**
 * Graphics card in the top PCIe slot: horizontal, backplate up, fans down. Its side edge
 * (the face toward the glass) is the one with the name on it.
 */
export const GPU = {
  length: 0.32,
  thickness: 0.061,
  height: 0.14,
  xMin: INNER.xMin + 0.004, // bracket against the rear panel
  slotY: BOARD.y - 0.02,
}
export const GPU_BOX = {
  cx: GPU.xMin + GPU.length / 2,
  cy: GPU.slotY + 0.003 - GPU.thickness / 2, // backplate 3 mm above the slot, cooler below
  cz: BOARD_FACE_Z + GPU.height / 2,
  faceZ: BOARD_FACE_Z + GPU.height,
}

/** 360 mm radiator along the top, with its end tank and fittings at the front. */
export const RADIATOR = {
  length: 0.36,
  thick: 0.028,
  width: 0.12,
  x: -0.015,
  y: INNER.yMax - 0.014,
  z: 0,
  tankX: 0.1775,
  tankLength: 0.025,
}
export const TOP_FANS_X = [-0.135, -0.015, 0.105]
export const TOP_FAN_Y = RADIATOR.y - RADIATOR.thick / 2 - FAN.depth / 2
export const BOTTOM_FANS_X = [-0.12, 0, 0.12]
export const BOTTOM_FAN_Y = INNER.yMin + FAN.depth / 2
export const REAR_FAN = { x: INNER.xMin + FAN.depth / 2, y: 0.11, z: -0.02 }

/** Front panel IO on the outer face of the front pillar: the Connect chapter's subject. */
export const FRONT_IO = { x: CASE.w / 2, y: -0.09, z: 0.085 }

/**
 * The CPU die under the heat spreader: eight cores in two rows with the L3 cache between
 * them. Both the tiny die on the board and the close-up die view lay cores out with this, so
 * the same core lights up in both.
 */
export const DIE = {
  w: 0.012,
  h: 0.01,
  cols: 4,
  rows: 2,
  pitchX: 0.0028,
  rowY: 0.0025,
  core: [0.0022, 0.0026] as const,
  cache: [0.0105, 0.0012] as const,
}

/** Die-local [x, y] of core `i`, in metres; row 0 is the top row. */
export function corePosition(i: number): [number, number] {
  const col = i % DIE.cols
  const row = Math.floor(i / DIE.cols)
  return [(col - (DIE.cols - 1) / 2) * DIE.pitchX, row === 0 ? DIE.rowY : -DIE.rowY]
}
