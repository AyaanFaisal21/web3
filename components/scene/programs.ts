import * as THREE from 'three'
import { CORES } from '@/lib/content/about'
import { EXPERIENCES } from '@/lib/content/experience'
import { PROJECTS } from '@/lib/content/projects'
import { chipWorld } from './pc/ramExplode'
import { GDDR, GDDR_SIZE, PCB_FACE_Y, blockLocal, cardToWorld } from './pc/gpuLayout'
import { activeChip, activeCore, activeProject, sceneState } from './state'
import type { Waypoint } from './waypoints'

export const ease = (t: number) => t * t * (3 - 2 * t)

/** 0 before `a`, 1 after `b`, smooth in between. */
export function smooth(p: number, a: number, b: number) {
  return ease(THREE.MathUtils.clamp((p - a) / (b - a), 0, 1))
}

/** Index of the stop a tour is on, or -1 outside its window. */
function stopAt(p: number, start: number, end: number, count: number) {
  if (p <= start || p >= end) return -1
  return Math.min(count - 1, Math.floor(((p - start) / (end - start)) * count))
}

function frame(aspect: number, landscape: [number, number], portrait: [number, number]): Waypoint['frame'] {
  return aspect >= 1 ? { landscape, portrait: [0, 0] } : { landscape: [0, 0], portrait }
}

/**
 * The About chapter: the pump block lifts, the heat spreader follows, the die view fades in
 * and the tour visits each core. The stack stays open through Experience and closes in that
 * chapter's finale, after the RAM has rebuilt (lid first, then the block drops).
 */
export function runAboutProgram(pAbout: number, pExperience: number) {
  const about = sceneState.about
  about.explode = Math.min(smooth(pAbout, 0, 0.1), 1 - smooth(pExperience, 0.94, 1))
  about.lid = Math.min(smooth(pAbout, 0.07, 0.16), 1 - smooth(pExperience, 0.9, 0.95))
  about.dieOpacity = smooth(pAbout, 0.12, 0.18) * (1 - smooth(pAbout, 0.92, 0.97))
  activeCore.set(stopAt(pAbout, 0.18, 0.92, CORES.length))
}

/** Where the Experience chapter leaves the camera: a wide shot of the rebuilt RAM and the stack closing. */
export const EXPERIENCE_FINALE: Waypoint = { pos: [-0.02, 0.1, 0.36], look: [-0.055, 0.085, -0.05], fit: 0.22 }

const chipPos = new THREE.Vector3()

/**
 * The Experience chapter: sticks rise, turn and fan out (staggered), the front spreaders
 * slide off, the camera visits each entry's chip, then everything rebuilds. Returns the
 * camera pose the hold should use, or null for the chapter's waypoint (the overview).
 */
export function runExperienceProgram(pExperience: number, aspect: number): Waypoint | null {
  const ram = sceneState.ram
  for (let i = 0; i < ram.open.length; i++) {
    const opening = smooth(pExperience, i * 0.02, 0.16 + i * 0.02)
    const closing = 1 - smooth(pExperience, 0.84 + i * 0.015, 0.92 + i * 0.015)
    ram.open[i] = Math.min(opening, closing)
  }
  ram.bare = Math.min(smooth(pExperience, 0.17, 0.24), 1 - smooth(pExperience, 0.79, 0.85))
  const chip = stopAt(pExperience, 0.25, 0.84, EXPERIENCES.length)
  activeChip.set(chip)
  if (chip >= 0) {
    const e = EXPERIENCES[chip]
    chipWorld(e.stick, e.slot, 1, chipPos)
    return { pos: [chipPos.x + 0.022, chipPos.y + 0.006, chipPos.z + 0.05], look: [chipPos.x, chipPos.y, chipPos.z], frame: frame(aspect, [-0.012, 0], [0, -0.008]) }
  }
  if (pExperience >= 0.84) return EXPERIENCE_FINALE
  return null
}

const blockPos = new THREE.Vector3()
const gddrPos = new THREE.Vector3()
const midPos = new THREE.Vector3()

/**
 * The Projects chapter: the card slides out and turns to the glass, the shroud and heatsink
 * lift away, and the camera visits each project's block on the bared die (or a memory
 * controller and the GDDR package it feeds). Returns the hold's camera pose, or null for
 * the overview waypoint.
 */
export function runProjectsProgram(pProjects: number, aspect: number): Waypoint | null {
  const gpu = sceneState.gpu
  gpu.out = Math.min(smooth(pProjects, 0, 0.08), 1 - smooth(pProjects, 0.95, 1))
  gpu.bare = Math.min(smooth(pProjects, 0.08, 0.17), 1 - smooth(pProjects, 0.9, 0.95))
  const project = stopAt(pProjects, 0.19, 0.89, PROJECTS.length)
  activeProject.set(project)
  if (project < 0) return null
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
