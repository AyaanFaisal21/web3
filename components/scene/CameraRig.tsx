'use client'

import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { CHAPTERS, CHAPTER_STARTS_VH, TRAVEL_VH, chapterIndex, chapterLocalProgress } from '@/lib/journey'
import { CASE } from './pc/layout'
import { WAYPOINTS, type Waypoint } from './waypoints'
import { sceneState } from './state'
import { EXPERIENCE_FINALE, ease, runAboutProgram, runExperienceProgram, runProjectsProgram } from './programs'

type Vec = [number, number, number]

const ABOUT = chapterIndex('about')
const EXPERIENCE = chapterIndex('experience')
const PROJECTS = chapterIndex('projects')
const UP = new THREE.Vector3(0, 1, 0)
const scratch = new THREE.Vector3()
const right = new THREE.Vector3()
const upv = new THREE.Vector3()

function lerp3(out: THREE.Vector3, a: Vec, b: Vec, t: number) {
  return out.set(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t)
}

/** Quadratic bezier a → v → b. */
function bezier(out: THREE.Vector3, a: Vec, v: Vec, b: Vec, t: number) {
  const u = 1 - t
  return out.set(
    a[0] * u * u + v[0] * 2 * u * t + b[0] * t * t,
    a[1] * u * u + v[1] * 2 * u * t + b[1] * t * t,
    a[2] * u * u + v[2] * 2 * u * t + b[2] * t * t,
  )
}

/** A waypoint's position, pushed back along its line of sight until its `fit` width fits the viewport. */
function fittedPos(w: Waypoint, tanHalfFov: number, aspect: number): Vec {
  if (!w.fit) return w.pos
  const minDist = (w.fit * 1.1) / (2 * tanHalfFov * aspect)
  scratch.set(w.pos[0] - w.look[0], w.pos[1] - w.look[1], w.pos[2] - w.look[2])
  const dist = scratch.length()
  if (dist >= minDist) return w.pos
  scratch.multiplyScalar(minDist / dist)
  return [w.look[0] + scratch.x, w.look[1] + scratch.y, w.look[2] + scratch.z]
}

function frameOf(w: Waypoint, aspect: number): [number, number] {
  if (!w.frame) return [0, 0]
  return aspect >= 1 ? w.frame.landscape : w.frame.portrait
}

/**
 * Drives the camera from scroll position. Each chapter owns a leg of the journey: the camera
 * travels to that chapter's waypoint over the TRAVEL_VH before its section reaches the top of
 * the viewport, then holds while the chapter's own program runs (which may move the camera
 * between stops). Motion is damped, and pointer parallax is mixed in while the hero is up.
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

    // Chapter programs run every frame: they own the exploded parts, whatever leg we are on.
    const pAbout = chapterLocalProgress(y, vh, ABOUT)
    const pExperience = chapterLocalProgress(y, vh, EXPERIENCE)
    runAboutProgram(pAbout, pExperience)
    const experiencePose = runExperienceProgram(pExperience, aspect)
    const projectsPose = runProjectsProgram(chapterLocalProgress(y, vh, PROJECTS), aspect)
    // The pose a chapter leaves the camera in, which the next leg departs from.
    const endPose = (i: number) => (i === EXPERIENCE ? EXPERIENCE_FINALE : points[i])

    // Which leg are we on? The last chapter whose travel window has started.
    let k = 0
    for (let i = 1; i < points.length; i++) {
      if (y >= (CHAPTER_STARTS_VH[i] / 100) * vh - travel) k = i
    }
    let fx = 0
    let fy = 0
    if (k === 0) {
      targetPos.current.set(...hero.pos)
      targetLook.current.set(...hero.look)
    } else {
      const start = (CHAPTER_STARTS_VH[k] / 100) * vh - travel
      const t = ease(THREE.MathUtils.clamp((y - start) / travel, 0, 1))
      const a = endPose(k - 1)
      const programPose = k === EXPERIENCE ? experiencePose : k === PROJECTS ? projectsPose : null
      const b = t >= 1 && programPose ? programPose : points[k]
      const aPos = fittedPos(a, tanHalfFov, aspect)
      const bPos = fittedPos(b, tanHalfFov, aspect)
      if (b.via) bezier(targetPos.current, aPos, b.via, bPos, t)
      else lerp3(targetPos.current, aPos, bPos, t)
      lerp3(targetLook.current, a.look, b.look, t)
      const fa = frameOf(a, aspect)
      const fb = frameOf(b, aspect)
      fx = fa[0] + (fb[0] - fa[0]) * t
      fy = fa[1] + (fb[1] - fa[1]) * t
    }

    // A slow drift around the open stack while the About tour runs; zero at both ends.
    const drift = Math.sin(pAbout * Math.PI)
    targetPos.current.x += drift * 0.02
    targetPos.current.y += drift * 0.012

    // Off-centre framing: shift the look target in camera space.
    if (fx !== 0 || fy !== 0) {
      scratch.subVectors(targetLook.current, targetPos.current)
      right.crossVectors(scratch, UP).normalize()
      upv.crossVectors(right, scratch).normalize()
      targetLook.current.addScaledVector(right, fx).addScaledVector(upv, fy)
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
