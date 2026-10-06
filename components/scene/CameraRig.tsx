'use client'

import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { CHAPTERS, CHAPTER_STARTS_VH, TRAVEL_VH } from '@/lib/journey'
import { CASE } from './pc/layout'
import { WAYPOINTS, type Waypoint } from './waypoints'
import { sceneState } from './state'

type Vec = [number, number, number]

const ease = (t: number) => t * t * (3 - 2 * t)

function lerp3(out: THREE.Vector3, a: Vec, b: Vec, t: number) {
  return out.set(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t)
}

/** Quadratic bezier a → v → b. */
function bezier(out: THREE.Vector3, a: Vec, v: Vec, b: Vec, t: number) {
  const u = 1 - t
  const w0 = u * u
  const w1 = 2 * u * t
  const w2 = t * t
  return out.set(
    a[0] * w0 + v[0] * w1 + b[0] * w2,
    a[1] * w0 + v[1] * w1 + b[1] * w2,
    a[2] * w0 + v[2] * w1 + b[2] * w2,
  )
}

const scratch = new THREE.Vector3()

/**
 * A waypoint's camera position, pushed back along its line of sight when the viewport is too
 * narrow to show the subject's `fit` width at the authored distance.
 */
function fittedPos(w: Waypoint, tanHalfFov: number, aspect: number): Vec {
  if (!w.fit) return w.pos
  const minDist = (w.fit * 1.1) / (2 * tanHalfFov * aspect)
  scratch.set(w.pos[0] - w.look[0], w.pos[1] - w.look[1], w.pos[2] - w.look[2])
  const dist = scratch.length()
  if (dist >= minDist) return w.pos
  scratch.multiplyScalar(minDist / dist)
  return [w.look[0] + scratch.x, w.look[1] + scratch.y, w.look[2] + scratch.z]
}

/**
 * Drives the camera from scroll position. Each chapter owns a leg of the journey: the camera
 * travels to that chapter's waypoint over the TRAVEL_VH before its section reaches the top of
 * the viewport, then holds. Motion is smoothed with exponential damping, and a little pointer
 * parallax is mixed in while the hero is on screen.
 */
export function CameraRig() {
  const { camera, size } = useThree()
  const pos = useRef(new THREE.Vector3())
  const look = useRef(new THREE.Vector3())
  const targetPos = useRef(new THREE.Vector3())
  const targetLook = useRef(new THREE.Vector3())
  const initialised = useRef(false)

  useFrame((_, dt) => {
    const cam = camera as THREE.PerspectiveCamera
    const vh = window.innerHeight
    const y = sceneState.scrollY
    const travel = (TRAVEL_VH / 100) * vh
    const aspect = size.width / size.height
    const tanHalfFov = Math.tan(THREE.MathUtils.degToRad(cam.fov) / 2)

    // Hero framing fits the whole case with a margin, whatever the viewport's shape.
    const margin = 1.12
    const distH = ((CASE.h / 2) * margin) / tanHalfFov
    const distW = ((CASE.w / 2) * margin) / (tanHalfFov * aspect)
    const hero: Waypoint = { pos: [0, 0, CASE.d / 2 + Math.max(distH, distW)], look: WAYPOINTS.hero.look }
    const points = CHAPTERS.map((c) => (c.id === 'hero' ? hero : WAYPOINTS[c.id]))

    // Which leg are we on? The last chapter whose travel window has started.
    let k = 0
    for (let i = 1; i < points.length; i++) {
      if (y >= (CHAPTER_STARTS_VH[i] / 100) * vh - travel) k = i
    }
    if (k === 0) {
      targetPos.current.set(...hero.pos)
      targetLook.current.set(...hero.look)
    } else {
      const start = (CHAPTER_STARTS_VH[k] / 100) * vh - travel
      const t = ease(THREE.MathUtils.clamp((y - start) / travel, 0, 1))
      const a = points[k - 1]
      const b = points[k]
      const aPos = fittedPos(a, tanHalfFov, aspect)
      const bPos = fittedPos(b, tanHalfFov, aspect)
      if (b.via) bezier(targetPos.current, aPos, b.via, bPos, t)
      else lerp3(targetPos.current, aPos, bPos, t)
      lerp3(targetLook.current, a.look, b.look, t)
    }

    // Pointer parallax, only while the hero is on screen.
    const heroAmount = THREE.MathUtils.clamp(1 - y / (0.6 * vh), 0, 1)
    targetPos.current.x += sceneState.pointer.x * 0.07 * heroAmount
    targetPos.current.y += sceneState.pointer.y * 0.045 * heroAmount

    if (!initialised.current) {
      pos.current.copy(targetPos.current)
      look.current.copy(targetLook.current)
      initialised.current = true
    }
    // Exponential smoothing: frame-rate independent and settles without overshoot.
    const blend = 1 - Math.exp(-dt * 5)
    pos.current.lerp(targetPos.current, blend)
    look.current.lerp(targetLook.current, blend)
    cam.position.copy(pos.current)
    cam.lookAt(look.current)
    sceneState.cameraZ = pos.current.z
  })

  return null
}
