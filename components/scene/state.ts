/**
 * Mutable state shared between DOM listeners (scroll, pointer) and the three.js frame loops.
 * Nothing here is React state on purpose: the camera rig and animated parts read it inside
 * useFrame, so scrolling never re-renders the React tree. The one value the DOM must render,
 * the core in focus, has a tiny subscription of its own.
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
}

const coreListeners = new Set<() => void>()

export function setActiveCore(core: number) {
  if (core === sceneState.about.core) return
  sceneState.about.core = core
  coreListeners.forEach((listener) => listener())
}

export function subscribeActiveCore(listener: () => void) {
  coreListeners.add(listener)
  return () => {
    coreListeners.delete(listener)
  }
}

export function getActiveCore() {
  return sceneState.about.core
}

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
