/**
 * Mutable state shared between DOM listeners (scroll, pointer) and the three.js frame loop.
 * Nothing here is React state on purpose: the camera rig and animated parts read it inside
 * useFrame, so scrolling never re-renders the React tree.
 */
export const sceneState = {
  scrollY: 0,
  /** Pointer in normalized device coordinates, -1..1 on both axes, +y is up. */
  pointer: { x: 0, y: 0 },
  /** Smoothed camera z, so parts such as the glass can react to the camera coming inside. */
  cameraZ: 1,
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
