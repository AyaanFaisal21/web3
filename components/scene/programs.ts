import * as THREE from 'three'
import { chipWorld } from './pc/ramExplode'
import { GDDR, GDDR_SIZE, PCB_FACE_Y, blockLocal, cardToWorld } from './pc/gpuLayout'
import { EXPERIENCES } from '@/lib/content/experience'
import { PROJECTS } from '@/lib/content/projects'
import { sceneState } from './state'
import type { Waypoint } from './waypoints'

export const ease = (t: number) => t * t * (3 - 2 * t)

/** 0 before `a`, 1 after `b`, smooth in between. */
export function smooth(p: number, a: number, b: number) {
  return ease(THREE.MathUtils.clamp((p - a) / (b - a), 0, 1))
}

function frame(aspect: number, landscape: [number, number], portrait: [number, number]): Waypoint['frame'] {
  return aspect >= 1 ? { landscape, portrait: [0, 0] } : { landscape: [0, 0], portrait }
}

/**
 * Each program turns its chapter's drive (0 closed … 1 fully open) into part poses. Which
 * entry is in focus is the visitor's choice, kept in the state signals, not a function of the
 * drive, so a tour can be stepped in either direction.
 */

/** About: the pump block lifts, the heat spreader follows, then the die view fades in. */
export function runAboutProgram(open: number) {
  const about = sceneState.about
  about.explode = smooth(open, 0, 0.55)
  about.lid = smooth(open, 0.3, 0.8)
  about.dieOpacity = smooth(open, 0.62, 1)
}

const chipPos = new THREE.Vector3()

/**
 * Experience: sticks rise, turn and fan out (staggered), then the front spreaders slide off.
 * Returns the camera pose for the chip in focus once the sticks are bared, or null for the
 * chapter's overview waypoint.
 */
export function runExperienceProgram(open: number, chip: number, aspect: number): Waypoint | null {
  const ram = sceneState.ram
  for (let i = 0; i < ram.open.length; i++) ram.open[i] = smooth(open, i * 0.06, 0.62 + i * 0.06)
  ram.bare = smooth(open, 0.68, 0.96)
  if (chip < 0 || open < 0.9) return null
  const e = EXPERIENCES[chip]
  chipWorld(e.stick, e.slot, 1, chipPos)
  return {
    pos: [chipPos.x + 0.022, chipPos.y + 0.006, chipPos.z + 0.05],
    look: [chipPos.x, chipPos.y, chipPos.z],
    frame: frame(aspect, [-0.012, 0], [0, -0.008]),
  }
}

const blockPos = new THREE.Vector3()
const gddrPos = new THREE.Vector3()
const midPos = new THREE.Vector3()

/**
 * Projects: the card slides out and turns to the glass, then the shroud and heatsink lift
 * away. Returns the camera pose for the block in focus on the bared die (or a memory
 * controller and the GDDR package it feeds), or null for the overview waypoint.
 */
export function runProjectsProgram(open: number, project: number, aspect: number): Waypoint | null {
  const gpu = sceneState.gpu
  gpu.out = smooth(open, 0, 0.5)
  gpu.bare = smooth(open, 0.45, 0.88)
  if (project < 0 || open < 0.85) return null
  const { kind, index } = PROJECTS[project].block
  cardToWorld(blockLocal(kind, index), 1, blockPos)
  if (kind === 'mc') {
    const [gx, gz] = GDDR[index]
    cardToWorld([gx, PCB_FACE_Y - GDDR_SIZE[1], gz], 1, gddrPos)
    midPos.addVectors(blockPos, gddrPos).multiplyScalar(0.5)
    return { pos: [midPos.x + 0.004, midPos.y, midPos.z + 0.075], look: [midPos.x, midPos.y, midPos.z], frame: frame(aspect, [-0.02, 0], [0, -0.014]) }
  }
  const dist = kind === 'sm' ? 0.03 : 0.017
  return {
    pos: [blockPos.x + dist * 0.12, blockPos.y + dist * 0.15, blockPos.z + dist],
    look: [blockPos.x, blockPos.y, blockPos.z],
    frame: frame(aspect, [-dist * 0.3, 0], [0, -dist * 0.25]),
  }
}
