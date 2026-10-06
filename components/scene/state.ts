/**
 * Mutable state shared between DOM listeners (scroll, pointer) and the three.js frame loops.
 * Nothing here is React state on purpose: the camera rig and animated parts read it inside
 * useFrame, so scrolling never re-renders the React tree. The few values the DOM must render
 * (which core or chip is in focus) are exposed as tiny signals.
 */
export const sceneState = {
  scrollY: 0,
  /** Pointer in normalized device coordinates, -1..1 on both axes, +y is up. */
  pointer: { x: 0, y: 0 },
  /** Smoothed camera z, so parts such as the glass can react to the camera coming inside. */
  cameraZ: 1,
  /** The About chapter's program, all 0..1 except `core` (index into CORES, or -1). */
  about: {
    /** How far the pump block has lifted off the CPU. */
    explode: 0,
    /** How far the heat spreader has lifted off the die. */
    lid: 0,
    core: -1,
    /** Opacity of the die close-up view. */
    dieOpacity: 0,
  },
  /** The Experience chapter's program. */
  ram: {
    /** Per stick, 0 = seated in its slot … 1 = out, turned to the glass and fanned. */
    open: [0, 0, 0, 0],
    /** 0..1: how far the front heat spreaders have slid off to bare the chips. */
    bare: 0,
    /** Index into EXPERIENCES of the chip in focus, or -1. */
    chip: -1,
  },
}

/** A number the frame loop writes and the DOM subscribes to (via useSyncExternalStore). */
function signal(read: () => number, write: (value: number) => void) {
  const listeners = new Set<() => void>()
  return {
    get: read,
    set(value: number) {
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

export const activeCore = signal(
  () => sceneState.about.core,
  (value) => {
    sceneState.about.core = value
  },
)

export const activeChip = signal(
  () => sceneState.ram.chip,
  (value) => {
    sceneState.ram.chip = value
  },
)

export function bindSceneState() {
  const onScroll = () => {
    sceneState.scrollY = window.scrollY
  }
  const onPointer = (e: PointerEvent) => {
    sceneState.pointer.x = (e.clientX / window.innerWidth) * 2 - 1
    sceneState.pointer.y = -((e.clientY / window.innerHeight) * 2 - 1)
  }
  const onLeave = () => {
    sceneState.pointer.x = 0
    sceneState.pointer.y = 0
  }
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('pointermove', onPointer, { passive: true })
  document.addEventListener('pointerleave', onLeave)
  return () => {
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('pointermove', onPointer)
    document.removeEventListener('pointerleave', onLeave)
  }
}
