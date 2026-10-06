'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { BOARD_FACE_Z, COOLER, CPU, RADIATOR } from './layout'
import { MAT, GOLD, emissive } from './materials'
import { tube } from './geometry'
import { sceneState } from '../state'
import { LCD_PHOTOS } from '@/lib/content/about'

/** How far the pump block lifts off the CPU when the About chapter pulls the stack apart. */
export const COOLER_LIFT = 0.09

type Vec = [number, number, number]

/** Small readout on the pump block, like the temperature display on the reference build. */
function makeReadoutTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 256
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = '#05060a'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = '#ffd9a6'
  ctx.font = '600 76px ui-monospace, Consolas, monospace'
  ctx.fillText('42°', 128, 118)
  ctx.fillStyle = 'rgba(255,217,166,0.55)'
  ctx.font = '500 24px ui-monospace, Consolas, monospace'
  ctx.fillText('CPU', 128, 172)
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

/**
 * The two tube paths from the block to the radiator's front tank. The first stretch follows
 * the block as it lifts; the rest stays put under the top fans.
 */
function tubePaths(lift: number): Vec[][] {
  const blockFace = COOLER.faceZ + lift
  const blockTopY = CPU.y + COOLER.size / 2
  const fitY = RADIATOR.y - RADIATOR.thick / 2
  return [
    [
      [CPU.x - 0.013, blockTopY - 0.01, blockFace - 0.016],
      [CPU.x - 0.013, blockTopY + 0.02, blockFace - 0.004],
      [-0.06, 0.156, -0.055 + lift * 0.5],
      [0.04, 0.152, -0.04 + lift * 0.2],
      [0.13, 0.153, -0.022],
      [0.17, 0.166, -0.014],
      [RADIATOR.tankX, fitY - 0.006, -0.012],
      [RADIATOR.tankX, fitY + 0.004, -0.012],
    ],
    [
      [CPU.x + 0.013, blockTopY - 0.01, blockFace - 0.016],
      [CPU.x + 0.013, blockTopY + 0.02, blockFace - 0.004],
      [-0.04, 0.148, -0.045 + lift * 0.5],
      [0.05, 0.144, -0.028 + lift * 0.2],
      [0.135, 0.146, -0.008],
      [0.172, 0.16, 0.008],
      [RADIATOR.tankX, fitY - 0.006, 0.012],
      [RADIATOR.tankX, fitY + 0.004, 0.012],
    ],
  ]
}

export function Cooling() {
  const block = useRef<THREE.Group>(null)
  const tubeA = useRef<THREE.Mesh>(null)
  const tubeB = useRef<THREE.Mesh>(null)
  const builtLift = useRef(0)
  const initialTubes = useMemo(() => tubePaths(0).map((pts) => tube(pts, 0.0065)), [])

  const readout = useMemo(() => makeReadoutTexture(), [])
  const readoutMat = useMemo(
    () => new THREE.MeshBasicMaterial({ map: readout, transparent: true, toneMapped: false, color: new THREE.Color(1.6, 1.5, 1.3) }),
    [readout],
  )
  const ringMat = useMemo(() => emissive(GOLD, 1.8), [])
  const copper = useMemo(() => new THREE.MeshStandardMaterial({ color: '#b87333', metalness: 1, roughness: 0.35 }), [])

  // The round LCD: a photo for the core in focus, cross-faded from the previous one, with
  // the temperature readout showing whenever no core is in focus.
  const photos = useTexture(LCD_PHOTOS)
  useEffect(() => {
    photos.forEach((t) => {
      t.colorSpace = THREE.SRGBColorSpace
      t.anisotropy = 4
    })
  }, [photos])
  const frontMat = useMemo(() => new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 }), [])
  const backMat = useMemo(() => new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 }), [])
  const lcd = useRef({ shown: -1, prev: -1, t: 1 })

  useFrame((_, dt) => {
    const lift = sceneState.about.explode * COOLER_LIFT
    if (block.current) block.current.position.z = lift
    if (Math.abs(lift - builtLift.current) > 0.0004) {
      const paths = tubePaths(lift)
      ;[tubeA.current, tubeB.current].forEach((mesh, i) => {
        if (!mesh) return
        mesh.geometry.dispose()
        mesh.geometry = tube(paths[i], 0.0065)
      })
      builtLift.current = lift
    }

    const s = lcd.current
    const core = sceneState.about.core
    if (core !== s.shown) {
      s.prev = s.shown
      s.shown = core
      s.t = 0
    }
    s.t = Math.min(1, s.t + dt * 2.5)
    const e = s.t * s.t * (3 - 2 * s.t)
    const front = s.shown >= 0 ? photos[s.shown] : null
    const back = s.prev >= 0 ? photos[s.prev] : null
    if (frontMat.map !== front) {
      frontMat.map = front
      frontMat.needsUpdate = true
    }
    if (backMat.map !== back) {
      backMat.map = back
      backMat.needsUpdate = true
    }
    frontMat.opacity = front ? e : 0
    backMat.opacity = back ? 1 - e : 0
    readoutMat.opacity = s.shown < 0 && s.prev < 0 ? 1 : s.shown < 0 ? e : s.prev < 0 ? 1 - e : 0
  })

  const face = COOLER.depth / 2
  const fitY = RADIATOR.y - RADIATOR.thick / 2

  return (
    <group>
      {/* radiator core, end tank and its two fittings */}
      <mesh position={[RADIATOR.x, RADIATOR.y, RADIATOR.z]} material={MAT.darkMetal}>
        <boxGeometry args={[RADIATOR.length, RADIATOR.thick, RADIATOR.width]} />
      </mesh>
      <mesh position={[RADIATOR.tankX, RADIATOR.y, RADIATOR.z]} material={MAT.darkMetal}>
        <boxGeometry args={[RADIATOR.tankLength, RADIATOR.thick, RADIATOR.width - 0.01]} />
      </mesh>
      {[-0.012, 0.012].map((dz) => (
        <mesh key={dz} position={[RADIATOR.tankX, fitY - 0.005, dz]} material={MAT.aluminum}>
          <cylinderGeometry args={[0.0085, 0.0085, 0.012, 20]} />
        </mesh>
      ))}

      {/* pump block over the CPU: body, cold plate, glass face, lit ring, round LCD */}
      <group ref={block} position={[CPU.x, CPU.y, BOARD_FACE_Z + COOLER.depth / 2]}>
        <mesh material={MAT.darkMetal}>
          <boxGeometry args={[COOLER.size, COOLER.size, COOLER.depth]} />
        </mesh>
        <mesh position={[0, 0, -face - 0.0015]} material={copper}>
          <boxGeometry args={[0.04, 0.04, 0.003]} />
        </mesh>
        <mesh position={[0, 0, face + 0.001]} rotation={[Math.PI / 2, 0, 0]} material={MAT.plastic}>
          <cylinderGeometry args={[0.031, 0.031, 0.003, 48]} />
        </mesh>
        <mesh position={[0, 0, face + 0.0026]} material={backMat}>
          <circleGeometry args={[0.0255, 48]} />
        </mesh>
        <mesh position={[0, 0, face + 0.0027]} material={frontMat}>
          <circleGeometry args={[0.0255, 48]} />
        </mesh>
        <mesh position={[0, 0, face + 0.0028]} material={readoutMat}>
          <circleGeometry args={[0.0255, 48]} />
        </mesh>
        <mesh position={[0, 0, face + 0.003]} material={ringMat}>
          <torusGeometry args={[0.029, 0.0018, 8, 64]} />
        </mesh>
      </group>

      <mesh ref={tubeA} geometry={initialTubes[0]} material={MAT.braided} />
      <mesh ref={tubeB} geometry={initialTubes[1]} material={MAT.braided} />
    </group>
  )
}
