/**
 * Mutable state shared between DOM listeners (pointer, clicks, keys) and the three.js frame
 * loops. Nothing here is React state on purpose: the camera rig and animated parts read it
 * inside useFrame, so animation never re-renders the React tree. The few values the DOM must
 * render (the chapter, which item is in focus) are exposed as tiny signals.
 */
import type { ChapterId } from '@/lib/journey'
import { CORES } from '@/lib/content/about'
import { EXPERIENCES } from '@/lib/content/experience'
import { PROJECTS } from '@/lib/content/projects'

export const sceneState = {
  /** The chapter on screen; 'hero' is the whole PC at rest. */
  chapter: 'hero' as ChapterId,
  /**
   * 0..1 per chapter: how far its parts have opened. The rig tweens each toward 1 while its
   * chapter is up and back toward 0 otherwise, and the programs turn them into part poses.
   */
  drive: { about: 0, experience: 0, projects: 0 },
  /** Pointer in normalized device coordinates, -1..1 on both axes, +y is up. */
  pointer: { x: 0, y: 0 },
  /** Smoothed camera z, so parts such as the glass can react to the camera coming inside. */
  cameraZ: 1,
  /** The About chapter's pose, all 0..1 except `core` (index into CORES, or -1 for the intro). */
  about: {
    /** How far the pump block has lifted off the CPU. */
    explode: 0,
    /** How far the heat spreader has lifted off the die. */
    lid: 0,
    core: -1,
    /** Opacity of the die close-up view. */
    dieOpacity: 0,
  },
  /** The Experience chapter's pose. */
  ram: {
    /** Per stick, 0 = seated in its slot … 1 = out, turned to the glass and fanned. */
    open: [0, 0, 0, 0],
    /** 0..1: how far the front heat spreaders have slid off to bare the chips. */
    bare: 0,
    /** Index into EXPERIENCES of the chip in focus, or -1 for the intro. */
    chip: -1,
  },
  /** The Projects chapter's pose. */
  gpu: {
    /** 0..1: the card has slid out of its slot and turned its fan side to the glass. */
    out: 0,
    /** 0..1: shroud and heatsink have lifted away to bare the PCB and die. */
    bare: 0,
    /** Index into PROJECTS of the block in focus, or -1 for the intro. */
    project: -1,
  },
}

/** A value the DOM subscribes to (via useSyncExternalStore) and the frame loop can read. */
function signal<T>(read: () => T, write: (value: T) => void) {
  const listeners = new Set<() => void>()
  return {
    get: read,
    set(value: T) {
      if (value === read()) return
      write(value)
      listeners.forEach((listener) => listener())
    },
    subscribe(listener: () => void) {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },
  }
}

export const activeChapter = signal<ChapterId>(
  () => sceneState.chapter,
  (value) => {
    sceneState.chapter = value
  },
)

export const activeCore = signal<number>(
  () => sceneState.about.core,
  (value) => {
    sceneState.about.core = value
  },
)

export const activeChip = signal<number>(
  () => sceneState.ram.chip,
  (value) => {
    sceneState.ram.chip = value
  },
)

export const activeProject = signal<number>(
  () => sceneState.gpu.project,
  (value) => {
    sceneState.gpu.project = value
  },
)

/** How many entries each touring chapter has. */
export const ITEM_COUNTS: Partial<Record<ChapterId, number>> = {
  about: CORES.length,
  experience: EXPERIENCES.length,
  projects: PROJECTS.length,
}

function itemSignal(id: ChapterId) {
  return id === 'about' ? activeCore : id === 'experience' ? activeChip : id === 'projects' ? activeProject : null
}

/** Opens a chapter (or returns home with 'hero'). Every tour restarts at its intro. */
export function selectChapter(id: ChapterId) {
  if (sceneState.chapter === id) return
  activeCore.set(-1)
  activeChip.set(-1)
  activeProject.set(-1)
  activeChapter.set(id)
}

/** The item in focus in the current chapter, or -1 for its intro. */
export function currentItem() {
  return itemSignal(sceneState.chapter)?.get() ?? -1
}

/** Moves the current chapter's tour by `delta` entries; -1 is the intro, so the first step lands on entry 0. */
export function stepItem(delta: number) {
  const id = sceneState.chapter
  const sig = itemSignal(id)
  const count = ITEM_COUNTS[id]
  if (!sig || !count) return
  sig.set(Math.min(count - 1, Math.max(-1, sig.get() + delta)))
}

export function setItem(index: number) {
  const sig = itemSignal(sceneState.chapter)
  if (sig) sig.set(index)
}

export function bindSceneState() {
  const onPointer = (e: PointerEvent) => {
    sceneState.pointer.x = (e.clientX / window.innerWidth) * 2 - 1
    sceneState.pointer.y = -((e.clientY / window.innerHeight) * 2 - 1)
  }
  const onLeave = () => {
    sceneState.pointer.x = 0
    sceneState.pointer.y = 0
  }
  window.addEventListener('pointermove', onPointer, { passive: true })
  document.addEventListener('pointerleave', onLeave)
  return () => {
    window.removeEventListener('pointermove', onPointer)
    document.removeEventListener('pointerleave', onLeave)
  }
}
