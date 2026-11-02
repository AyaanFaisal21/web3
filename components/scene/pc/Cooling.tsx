'use client'

import { useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useCursor } from '@react-three/drei'
import * as THREE from 'three'
import { BOARD_FACE_Z, COOLER, CPU, RADIATOR } from './layout'
import { MAT, GLOW, emissive } from './materials'
import { tube } from './geometry'
import { sceneState, selectChapter } from '../state'

/** How far the pump block lifts off the CPU when the About chapter pulls the stack apart. */
export const COOLER_LIFT = 0.09

type Vec = [number, number, number]

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
  const [hover, setHover] = useState(false)
  useCursor(hover)
  const block = useRef<THREE.Group>(null)
  const tubeA = useRef<THREE.Mesh>(null)
  const tubeB = useRef<THREE.Mesh>(null)
  const builtLift = useRef(0)
  const initialTubes = useMemo(() => tubePaths(0).map((pts) => tube(pts, 0.0065)), [])

  // At rest the LCD is a dark lens; the ring and the callout box carry the chapter's name.
  const readoutMat = useMemo(() => new THREE.MeshBasicMaterial({ color: '#05060a' }), [])
  const ringMat = useMemo(() => emissive(GLOW, 1.8), [])
  const copper = useMemo(() => new THREE.MeshStandardMaterial({ color: '#b87333', metalness: 1, roughness: 0.35 }), [])

  useFrame((_, dt) => {
    const lift = sceneState.about.explode * COOLER_LIFT
    // The block sits on the CPU; the lift is on top of its seated depth, not instead of it.
    if (block.current) block.current.position.z = BOARD_FACE_Z + COOLER.depth / 2 + lift
    if (Math.abs(lift - builtLift.current) > 0.0004) {
      const paths = tubePaths(lift)
      ;[tubeA.current, tubeB.current].forEach((mesh, i) => {
        if (!mesh) return
        mesh.geometry.dispose()
        mesh.geometry = tube(paths[i], 0.0065)
      })
      builtLift.current = lift
    }

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

      {/* pump block over the CPU: body, cold plate, glass face, lit ring, round LCD. Click to open About. */}
      <group
        ref={block}
        position={[CPU.x, CPU.y, BOARD_FACE_Z + COOLER.depth / 2]}
        onPointerOver={(e) => {
          e.stopPropagation()
          setHover(true)
        }}
        onPointerOut={() => setHover(false)}
        onClick={(e) => {
          e.stopPropagation()
          selectChapter('about')
        }}
      >
        <mesh material={MAT.darkMetal}>
          <boxGeometry args={[COOLER.size, COOLER.size, COOLER.depth]} />
        </mesh>
        <mesh position={[0, 0, -face - 0.0015]} material={copper}>
          <boxGeometry args={[0.04, 0.04, 0.003]} />
        </mesh>
        <mesh position={[0, 0, face + 0.001]} rotation={[Math.PI / 2, 0, 0]} material={MAT.plastic}>
          <cylinderGeometry args={[0.031, 0.031, 0.003, 48]} />
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
