'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { FAN } from './layout'
import { MAT, GOLD, emissive } from './materials'

/** A frame side that carries a light strip, in the fan's local axes (before `rotation`). */
export type StripSide = 'px' | 'nx' | 'py' | 'ny'

type FanProps = {
  position: [number, number, number]
  rotation?: [number, number, number]
  color?: string
  /** Blade speed in rad/s. Real fans spin far faster; this reads as motion at 60 fps. */
  speed?: number
  strips?: StripSide[]
  /** Brightness of the LED rings; lower it for a fan that would otherwise dominate a close-up. */
  ringIntensity?: number
  size?: number
  depth?: number
}

const BLADES = 7

const frameCache = new Map<string, THREE.ExtrudeGeometry>()
const bladeCache = new Map<number, THREE.ExtrudeGeometry>()

/** Square frame with rounded corners and a circular cutout, extruded to the fan's depth. */
function frameGeometry(size: number, depth: number) {
  const key = `${size}:${depth}`
  const cached = frameCache.get(key)
  if (cached) return cached
  const s = size / 2
  const r = size * 0.07
  const shape = new THREE.Shape()
  shape.moveTo(-s + r, -s)
  shape.lineTo(s - r, -s)
  shape.absarc(s - r, -s + r, r, -Math.PI / 2, 0, false)
  shape.lineTo(s, s - r)
  shape.absarc(s - r, s - r, r, 0, Math.PI / 2, false)
  shape.lineTo(-s + r, s)
  shape.absarc(-s + r, s - r, r, Math.PI / 2, Math.PI, false)
  shape.lineTo(-s, -s + r)
  shape.absarc(-s + r, -s + r, r, Math.PI, Math.PI * 1.5, false)
  const hole = new THREE.Path()
  hole.absarc(0, 0, size * 0.48, 0, Math.PI * 2, true)
  shape.holes.push(hole)
  const geo = new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false, curveSegments: 48 })
  geo.translate(0, 0, -depth / 2)
  frameCache.set(key, geo)
  return geo
}

/** One swept blade pointing along +Y from the hub, drawn for a 120 mm fan and scaled. */
function bladeGeometry(size: number) {
  const cached = bladeCache.get(size)
  if (cached) return cached
  const k = size / 0.12
  const shape = new THREE.Shape()
  shape.moveTo(-0.0055 * k, 0.019 * k)
  shape.quadraticCurveTo(-0.027 * k, 0.033 * k, -0.019 * k, 0.05 * k)
  shape.quadraticCurveTo(-0.004 * k, 0.0545 * k, 0.011 * k, 0.05 * k)
  shape.quadraticCurveTo(0.012 * k, 0.03 * k, 0.0065 * k, 0.019 * k)
  shape.closePath()
  const geo = new THREE.ExtrudeGeometry(shape, { depth: 0.0012, bevelEnabled: false, curveSegments: 12 })
  geo.translate(0, 0, -0.0006)
  bladeCache.set(size, geo)
  return geo
}

export function Fan({
  position,
  rotation = [0, 0, 0],
  color = GOLD,
  speed = 9,
  strips = [],
  ringIntensity = 2,
  size = FAN.size,
  depth = FAN.depth,
}: FanProps) {
  const blades = useRef<THREE.Group>(null)
  const frameGeo = useMemo(() => frameGeometry(size, depth), [size, depth])
  const bladeGeo = useMemo(() => bladeGeometry(size), [size])
  const ledMat = useMemo(() => emissive(color, ringIntensity), [color, ringIntensity])
  const stripMat = useMemo(() => emissive(color, 0.8), [color])

  useFrame((_, dt) => {
    if (blades.current) blades.current.rotation.z -= speed * dt
  })

  const half = size / 2
  const ringR = size * 0.455
  const hubR = size * 0.17
  const ringZ = depth / 2 - 0.0015
  const hubRingZ = depth / 2 - 0.0018

  return (
    <group position={position} rotation={rotation}>
      <mesh geometry={frameGeo} material={MAT.plastic} />

      {/* LED rings on both faces */}
      <mesh position={[0, 0, ringZ]} material={ledMat}>
        <torusGeometry args={[ringR, 0.0025, 8, 72]} />
      </mesh>
      <mesh position={[0, 0, -ringZ]} material={ledMat}>
        <torusGeometry args={[ringR, 0.0025, 8, 72]} />
      </mesh>

      {/* hub and its lit centre */}
      <mesh rotation={[Math.PI / 2, 0, 0]} material={MAT.plastic}>
        <cylinderGeometry args={[hubR, hubR, depth - 0.004, 32]} />
      </mesh>
      <mesh position={[0, 0, hubRingZ]} material={ledMat}>
        <torusGeometry args={[hubR * 0.55, 0.0012, 6, 40]} />
      </mesh>
      <mesh position={[0, 0, -hubRingZ]} material={ledMat}>
        <torusGeometry args={[hubR * 0.55, 0.0012, 6, 40]} />
      </mesh>

      {/* blades: pitched about their own radial axis, then placed around the hub */}
      <group ref={blades}>
        {Array.from({ length: BLADES }, (_, i) => (
          <group key={i} rotation={[0, 0, (i / BLADES) * Math.PI * 2]}>
            <mesh geometry={bladeGeo} material={MAT.blade} rotation={[0, 0.55, 0]} />
          </group>
        ))}
      </group>

      {/* light strips let into the frame's sides, so a fan seen edge-on still reads as lit */}
      {strips.map((side) => {
        const horizontal = side === 'py' || side === 'ny'
        const sign = side === 'px' || side === 'py' ? 1 : -1
        const pos: [number, number, number] = horizontal
          ? [0, sign * (half + 0.0008), 0]
          : [sign * (half + 0.0008), 0, 0]
        return (
          <mesh key={side} position={pos} material={stripMat}>
            <boxGeometry args={horizontal ? [size * 0.78, 0.0014, 0.005] : [0.0014, size * 0.78, 0.005]} />
          </mesh>
        )
      })}
    </group>
  )
}
