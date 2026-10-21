'use client'

import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { HERO_DIR, WAYPOINTS, type Waypoint } from './waypoints'
import { sceneState } from './state'
import { runAboutProgram, runExperienceProgram, runProjectsProgram } from './programs'

type Vec = [number, number, number]

const UP = new THREE.Vector3(0, 1, 0)
const scratch = new THREE.Vector3()
const right = new THREE.Vector3()
const upv = new THREE.Vector3()

/** Seconds a chapter takes to open its parts, and to close them when it is left. */
const OPEN_SECONDS = 1.8
const CLOSE_SECONDS = 1.0

/** A waypoint's position, pushed back along its line of sight until its `fit` width and `fitH` height fit the viewport. */
function fittedPos(w: Waypoint, tanHalfFov: number, aspect: number): Vec {
  if (!w.fit && !w.fitH) return w.pos
  const minW = w.fit ? (w.fit * 1.1) / (2 * tanHalfFov * aspect) : 0
  const minH = w.fitH ? (w.fitH * 1.1) / (2 * tanHalfFov) : 0
  const minDist = Math.max(minW, minH)
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
 * Drives the camera and the chapter programs from the selected chapter. Each chapter's drive
 * eases open while it is up and closes when it is left; the camera glides to the chapter's
 * waypoint, or to the entry in focus once the chapter's parts have opened. Pointer parallax is
 * mixed in on the home view.
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
    const aspect = size.width / size.height
    const tanHalfFov = Math.tan(THREE.MathUtils.degToRad(cam.fov) / 2)
    const { chapter, drive } = sceneState

    // Drives move linearly toward open or closed; the programs ease the parts themselves.
    for (const id of ['about', 'experience', 'projects'] as const) {
      const target = chapter === id ? 1 : 0
      const step = dt / (target ? OPEN_SECONDS : CLOSE_SECONDS)
      drive[id] = target ? Math.min(1, drive[id] + step) : Math.max(0, drive[id] - step)
    }
    runAboutProgram(drive.about)
    const experiencePose = runExperienceProgram(drive.experience, sceneState.ram.chip, aspect)
    const projectsPose = runProjectsProgram(drive.projects, sceneState.gpu.project, aspect)

    // The home view sits on HERO_DIR at whatever distance fits the whole case.
    const home = WAYPOINTS.hero
    const hero: Waypoint = {
      ...home,
      pos: [home.look[0] + HERO_DIR[0] * 0.2, home.look[1] + HERO_DIR[1] * 0.2, home.look[2] + HERO_DIR[2] * 0.2],
    }

    let w: Waypoint = hero
    if (chapter === 'about') w = WAYPOINTS.about
    else if (chapter === 'experience') w = experiencePose ?? WAYPOINTS.experience
    else if (chapter === 'projects') w = projectsPose ?? WAYPOINTS.projects
    else if (chapter === 'connect') w = WAYPOINTS.connect

    targetPos.current.set(...fittedPos(w, tanHalfFov, aspect))
    targetLook.current.set(...w.look)

    // Off-centre framing: shift the look target in camera space.
    const [fx, fy] = frameOf(w, aspect)
    if (fx !== 0 || fy !== 0) {
      scratch.subVectors(targetLook.current, targetPos.current)
      right.crossVectors(scratch, UP).normalize()
      upv.crossVectors(right, scratch).normalize()
      targetLook.current.addScaledVector(right, fx).addScaledVector(upv, fy)
    }

    // Pointer parallax on the home view only.
    if (chapter === 'hero') {
      targetPos.current.x += sceneState.pointer.x * 0.07
      targetPos.current.y += sceneState.pointer.y * 0.045
    }

    if (!initialised.current) {
      pos.current.copy(targetPos.current)
      look.current.copy(targetLook.current)
      initialised.current = true
    }
    // Exponential smoothing: frame-rate independent and settles without overshoot.
    const blend = 1 - Math.exp(-dt * 3)
    pos.current.lerp(targetPos.current, blend)
    look.current.lerp(targetLook.current, blend)
    cam.position.copy(pos.current)
    cam.lookAt(look.current)
    sceneState.cameraZ = pos.current.z
  })

  return null
}
