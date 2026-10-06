'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { BOARD_FACE_Z, CPU, DIE, corePosition } from './layout'
import { MAT, GOLD, emissive } from './materials'
import { sceneState } from '../state'

/** How far the heat spreader lifts off the die when the About chapter opens the CPU. */
export const IHS_LIFT = 0.035

/**
 * The processor in its socket: retention bracket, substrate, the die with its eight core
 * tiles and cache strip, and the nickel heat spreader on top. Normally hidden under the pump
 * block; the About chapter lifts the block, then the spreader, and lights cores in turn.
 */
export function Cpu() {
  const lid = useRef<THREE.Group>(null)
  const coreMats = useMemo(() => Array.from({ length: DIE.cols * DIE.rows }, () => emissive(GOLD, 0.25)), [])
  const cacheMat = useMemo(() => emissive('#ffd9a6', 0.12), [])
  const nickel = useMemo(() => new THREE.MeshStandardMaterial({ color: '#4f5359', metalness: 0.85, roughness: 0.55 }), [])
  const substrate = useMemo(() => new THREE.MeshStandardMaterial({ color: '#142a20', metalness: 0.2, roughness: 0.65 }), [])
  const silicon = useMemo(() => new THREE.MeshStandardMaterial({ color: '#0b0d12', metalness: 0.7, roughness: 0.35 }), [])

  useFrame((_, dt) => {
    if (lid.current) lid.current.position.z = sceneState.about.lid * IHS_LIFT
    const active = sceneState.about.core
    const blend = Math.min(1, dt * 8)
    coreMats.forEach((m, i) => {
      const target = i === active ? 2.4 : 0.25
      m.emissiveIntensity += (target - m.emissiveIntensity) * blend
    })
  })

  return (
    <group position={[CPU.x, CPU.y, BOARD_FACE_Z]}>
      {/* retention bracket and socket */}
      <mesh position={[0, 0, 0.002]} material={MAT.aluminum}>
        <boxGeometry args={[0.08, 0.08, 0.004]} />
      </mesh>
      <mesh position={[0, 0, 0.006]} material={MAT.pcbSlot}>
        <boxGeometry args={[0.05, 0.05, 0.004]} />
      </mesh>

      {/* package: substrate, die, cache strip, cores */}
      <mesh position={[0, 0, 0.0086]} material={substrate}>
        <boxGeometry args={[0.04, 0.04, 0.0012]} />
      </mesh>
      <mesh position={[0, 0, 0.0096]} material={silicon}>
        <boxGeometry args={[DIE.w, DIE.h, 0.0008]} />
      </mesh>
      <mesh position={[0, 0, 0.0102]} material={cacheMat}>
        <boxGeometry args={[DIE.cache[0], DIE.cache[1], 0.0004]} />
      </mesh>
      {coreMats.map((mat, i) => {
        const [x, y] = corePosition(i)
        return (
          <mesh key={i} position={[x, y, 0.0102]} material={mat}>
            <boxGeometry args={[DIE.core[0], DIE.core[1], 0.0004]} />
          </mesh>
        )
      })}

      {/* integrated heat spreader: lifts off in the About chapter */}
      <group ref={lid}>
        <mesh position={[0, 0, 0.0116]} material={nickel}>
          <boxGeometry args={[0.036, 0.036, 0.0025]} />
        </mesh>
        <mesh position={[0, 0, 0.0099]} material={nickel}>
          <boxGeometry args={[0.03, 0.03, 0.001]} />
        </mesh>
      </group>
    </group>
  )
}
