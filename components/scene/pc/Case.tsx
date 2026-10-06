'use client'

import { useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { CASE, FRONT_IO } from './layout'
import { MAT, GOLD, emissive } from './materials'
import { sceneState } from '../state'

const GLASS_OPACITY = 0.16
const FEET: [number, number][] = [
  [-1, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
]

export function Case() {
  const { w, h, d, panel, front, glass } = CASE
  const hw = w / 2
  const hh = h / 2
  const hd = d / 2
  const border = 0.014
  const glassZ = hd - glass / 2

  const stripMat = useMemo(() => emissive(GOLD, 1.0), [])
  const ledMat = useMemo(() => emissive(GOLD, 2), [])
  const insetMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#07080a', roughness: 0.9 }), [])

  // The glass fades away as the camera comes inside, so a dive isn't a plane clipping the lens.
  useFrame(() => {
    const t = THREE.MathUtils.clamp((sceneState.cameraZ - 0.22) / 0.25, 0, 1)
    MAT.glass.opacity = GLASS_OPACITY * t
    MAT.glass.visible = t > 0.001
  })

  return (
    <group>
      {/* top, bottom, rear panels */}
      <mesh position={[0, hh - panel / 2, 0]} material={MAT.caseMetal}>
        <boxGeometry args={[w, panel, d]} />
      </mesh>
      <mesh position={[0, -hh + panel / 2, 0]} material={MAT.caseMetal}>
        <boxGeometry args={[w, panel, d]} />
      </mesh>
      <mesh position={[-hw + panel / 2, 0, 0]} material={MAT.caseMetal}>
        <boxGeometry args={[panel, h, d]} />
      </mesh>

      {/* brushed front pillar */}
      <mesh position={[hw - front / 2, 0, 0]} material={MAT.aluminum}>
        <boxGeometry args={[front, h, d]} />
      </mesh>

      {/* motherboard tray: the far wall */}
      <mesh position={[0, 0, -hd + 0.005]} material={MAT.caseInner}>
        <boxGeometry args={[w, h, 0.01]} />
      </mesh>

      {/* tempered glass side panel with its painted border */}
      <mesh position={[0, 0, glassZ]} material={MAT.glass}>
        <planeGeometry args={[w - 0.004, h - 0.004]} />
      </mesh>
      <mesh position={[0, hh - 0.002 - border / 2, glassZ + 0.0005]} material={MAT.plastic}>
        <boxGeometry args={[w - 0.004, border, glass]} />
      </mesh>
      <mesh position={[0, -hh + 0.002 + border / 2, glassZ + 0.0005]} material={MAT.plastic}>
        <boxGeometry args={[w - 0.004, border, glass]} />
      </mesh>
      <mesh position={[-hw + 0.002 + border / 2, 0, glassZ + 0.0005]} material={MAT.plastic}>
        <boxGeometry args={[border, h - 0.004, glass]} />
      </mesh>
      <mesh position={[hw - 0.002 - border / 2, 0, glassZ + 0.0005]} material={MAT.plastic}>
        <boxGeometry args={[border, h - 0.004, glass]} />
      </mesh>

      {/* RGB strip down the front face, just in from the glass corner */}
      <mesh position={[hw + 0.0008, 0, hd - 0.03]} material={stripMat}>
        <boxGeometry args={[0.0016, h - 0.05, 0.004]} />
      </mesh>

      {/* feet */}
      {FEET.map(([sx, sz]) => (
        <mesh
          key={`${sx}${sz}`}
          position={[sx * (hw - 0.04), -hh - 0.01, sz * (hd - 0.045)]}
          material={MAT.plastic}
        >
          <cylinderGeometry args={[0.014, 0.017, 0.02, 24]} />
        </mesh>
      ))}

      {/* front IO on the outer face of the pillar: power button, two USB-A, USB-C, audio */}
      <group position={[hw, FRONT_IO.y, FRONT_IO.z]}>
        <mesh position={[0.001, 0.07, 0]} rotation={[0, 0, Math.PI / 2]} material={MAT.darkMetal}>
          <cylinderGeometry args={[0.0075, 0.0075, 0.003, 32]} />
        </mesh>
        <mesh position={[0.0026, 0.07, 0]} rotation={[0, Math.PI / 2, 0]} material={ledMat}>
          <torusGeometry args={[0.0082, 0.0008, 6, 40]} />
        </mesh>
        <mesh position={[0, 0.035, 0]} material={insetMat}>
          <boxGeometry args={[0.003, 0.006, 0.014]} />
        </mesh>
        <mesh position={[0, 0.015, 0]} material={insetMat}>
          <boxGeometry args={[0.003, 0.006, 0.014]} />
        </mesh>
        <mesh position={[0, -0.005, 0]} material={insetMat}>
          <boxGeometry args={[0.003, 0.0035, 0.0095]} />
        </mesh>
        <mesh position={[0.001, -0.025, 0]} rotation={[0, 0, Math.PI / 2]} material={insetMat}>
          <cylinderGeometry args={[0.0032, 0.0032, 0.003, 20]} />
        </mesh>
      </group>
    </group>
  )
}
