'use client'

import { useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { CARD, FLOORPLAN, GDDR, GDDR_SIZE, GPU_DIE, PACKAGE, PCB_FACE_Y, mcPosition, smPosition, tensorPosition } from './gpuLayout'
import { makeLabel } from './labels'
import { sceneState } from '../state'
import { CATEGORIES, PROJECTS, type BlockKind } from '@/lib/content/projects'

const SM_COUNT = FLOORPLAN.sm.cols * FLOORPLAN.sm.rows
const projectAt = (kind: BlockKind, index: number) => PROJECTS.findIndex((p) => p.block.kind === kind && p.block.index === index)
const DOWN: [number, number, number] = [Math.PI / 2, 0, 0]

/** A dark part that glows: only the emissive term shows, so lighting never pushes it to white. */
function glow(color: string, intensity: number) {
  return new THREE.MeshStandardMaterial({ color: '#0f1116', emissive: color, emissiveIntensity: intensity, metalness: 0.2, roughness: 0.6, toneMapped: false })
}

/**
 * The card's PCB with everything on its underside: the GPU package and die with its
 * floorplan (SM tiles, tensor-core sub-blocks, L2, memory controllers), twelve GDDR packages,
 * the VRM, the PCIe fingers and the power connector. Project blocks carry their title and
 * burn bright when the tour reaches them.
 */
export function GpuBoard() {
  const mats = useMemo(
    () => ({
      pcb: new THREE.MeshStandardMaterial({ color: '#0b0f12', metalness: 0.3, roughness: 0.7 }),
      substrate: new THREE.MeshStandardMaterial({ color: '#13241c', metalness: 0.2, roughness: 0.7 }),
      silicon: new THREE.MeshStandardMaterial({ color: '#0c0f14', metalness: 0.7, roughness: 0.35 }),
      chip: new THREE.MeshStandardMaterial({ color: '#0a0b0e', metalness: 0.3, roughness: 0.5 }),
      tile: new THREE.MeshStandardMaterial({ color: '#171a22', metalness: 0.6, roughness: 0.5 }),
      tensorDim: glow('#6fd3c6', 0.08),
      stage: new THREE.MeshStandardMaterial({ color: '#141618', metalness: 0.4, roughness: 0.5 }),
      inductor: new THREE.MeshStandardMaterial({ color: '#2a2d33', metalness: 0.9, roughness: 0.4 }),
      gold: new THREE.MeshStandardMaterial({ color: '#c9a24a', metalness: 1, roughness: 0.35 }),
      l2: glow('#ffd9a6', 0.15),
      trace: glow('#ffd9a6', 0.35),
    }),
    [],
  )
  const projectMats = useMemo(() => PROJECTS.map((p) => glow(CATEGORIES[p.category].color, 0.5)), [])
  const labelMats = useMemo(
    () =>
      PROJECTS.map((p) => {
        const [w, h] = p.block.kind === 'sm' ? [512, 216] : p.block.kind === 'tensor' ? [256, 164] : [512, 440]
        return new THREE.MeshBasicMaterial({ map: makeLabel([p.title.toUpperCase(), CATEGORIES[p.category].short], w, h, { color: 'rgba(14,17,24,0.92)', secondary: 'rgba(14,17,24,0.6)' }), transparent: true })
      }),
    [],
  )

  useFrame((_, dt) => {
    const focus = sceneState.gpu.project
    const blend = Math.min(1, dt * 8)
    projectMats.forEach((m, i) => {
      const target = i === focus ? 1.6 : 0.5
      m.emissiveIntensity += (target - m.emissiveIntensity) * blend
    })
  })

  const dieY = PCB_FACE_Y - PACKAGE.t - GPU_DIE.t
  const label = (kind: BlockKind, index: number, size: [number, number], drop: number) => {
    const i = projectAt(kind, index)
    return i < 0 ? null : (
      <mesh position={[0, -drop, 0]} rotation={DOWN} material={labelMats[i]}>
        <planeGeometry args={size} />
      </mesh>
    )
  }

  return (
    <group>
      <mesh position={[0, CARD.pcbY, 0]} material={mats.pcb}>
        <boxGeometry args={[CARD.length - 0.02, CARD.pcbT, CARD.height - 0.012]} />
      </mesh>
      <mesh position={[PACKAGE.x, PCB_FACE_Y - PACKAGE.t / 2, PACKAGE.z]} material={mats.substrate}>
        <boxGeometry args={[PACKAGE.size, PACKAGE.t, PACKAGE.size]} />
      </mesh>
      <mesh position={[PACKAGE.x, PCB_FACE_Y - PACKAGE.t - GPU_DIE.t / 2, PACKAGE.z]} material={mats.silicon}>
        <boxGeometry args={[GPU_DIE.size, GPU_DIE.t, GPU_DIE.size]} />
      </mesh>

      {/* floorplan on the die's underside */}
      <group position={[PACKAGE.x, dieY, PACKAGE.z]}>
        <mesh position={[0, -0.0002, 0]} material={mats.l2}>
          <boxGeometry args={[FLOORPLAN.l2.w, 0.0004, FLOORPLAN.l2.h]} />
        </mesh>
        {Array.from({ length: SM_COUNT }, (_, i) => {
          const [x, z] = smPosition(i)
          const [tx, tz] = tensorPosition(i)
          const sm = projectAt('sm', i)
          const tc = projectAt('tensor', i)
          return (
            <group key={i}>
              <mesh position={[x, -0.0002, z]} material={sm >= 0 ? projectMats[sm] : mats.tile}>
                <boxGeometry args={[FLOORPLAN.sm.w, 0.0004, FLOORPLAN.sm.h]} />
                {label('sm', i, [0.0078, 0.0032], 0.00025)}
              </mesh>
              <mesh position={[tx, -0.0005, tz]} material={tc >= 0 ? projectMats[tc] : mats.tensorDim}>
                <boxGeometry args={[FLOORPLAN.tensor.w, 0.0005, FLOORPLAN.tensor.h]} />
                {label('tensor', i, [0.0026, 0.0016], 0.0003)}
              </mesh>
            </group>
          )
        })}
        {Array.from({ length: FLOORPLAN.mc.count }, (_, i) => {
          const [x, z] = mcPosition(i)
          const p = projectAt('mc', i)
          const [gx, gz] = GDDR[i]
          const dx = gx - PACKAGE.x - x
          const dz = gz - PACKAGE.z - GDDR_SIZE[2] / 2 - z
          const len = Math.hypot(dx, dz)
          return (
            <group key={i}>
              <mesh position={[x, -0.0002, z]} material={p >= 0 ? projectMats[p] : mats.tile}>
                <boxGeometry args={[FLOORPLAN.mc.w, 0.0004, FLOORPLAN.mc.h]} />
              </mesh>
              {p >= 0 && (
                <mesh position={[x + dx / 2, -0.0001, z + dz / 2]} rotation={[0, Math.atan2(dx, dz), 0]} material={mats.trace}>
                  <boxGeometry args={[0.0005, 0.0002, len]} />
                </mesh>
              )}
            </group>
          )
        })}
      </group>

      {/* GDDR packages; the first four pair with the memory controllers above the die */}
      {GDDR.map(([x, z], i) => {
        const p = i < FLOORPLAN.mc.count ? projectAt('mc', i) : -1
        return (
          <mesh key={i} position={[x, PCB_FACE_Y - GDDR_SIZE[1] / 2, z]} material={p >= 0 ? projectMats[p] : mats.chip}>
            <boxGeometry args={GDDR_SIZE} />
            {p >= 0 && label('mc', i, [0.012, 0.0103], GDDR_SIZE[1] / 2 + 0.00005)}
          </mesh>
        )
      })}

      {/* VRM: power stages and inductors, PCIe fingers, power connector */}
      {Array.from({ length: 8 }, (_, i) => (
        <group key={i}>
          <mesh position={[0.062 + i * 0.0105, PCB_FACE_Y - 0.00075, 0.024]} material={mats.stage}>
            <boxGeometry args={[0.006, 0.0015, 0.006]} />
          </mesh>
          <mesh position={[0.062 + i * 0.0105, PCB_FACE_Y - 0.004, 0]} material={mats.inductor}>
            <boxGeometry args={[0.008, 0.008, 0.008]} />
          </mesh>
        </group>
      ))}
      <mesh position={[-0.0925, PCB_FACE_Y - 0.0002, -0.064]} material={mats.gold}>
        <boxGeometry args={[0.105, 0.0004, 0.006]} />
      </mesh>
      <mesh position={[0.125, PCB_FACE_Y - 0.006, 0.058]} material={mats.stage}>
        <boxGeometry args={[0.025, 0.012, 0.01]} />
      </mesh>
    </group>
  )
}
