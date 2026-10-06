'use client'

import { useMemo, useRef, type RefObject } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { DIE, corePosition } from '../pc/layout'
import { GOLD, emissive } from '../pc/materials'
import { sceneState } from '../state'

/** The close-up die is modelled in millimetres: the board's die is in metres. */
const MM = 1000
const CORE_COUNT = DIE.cols * DIE.rows

/** Faint logic traces drawn once, so the silicon reads as circuitry when the camera is close. */
function makeTraceTexture(seed: number) {
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 256
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = '#12151b'
  ctx.fillRect(0, 0, 256, 256)
  let s = seed
  const rnd = () => {
    s = (s * 16807) % 2147483647
    return s / 2147483647
  }
  ctx.strokeStyle = 'rgba(190,205,225,0.16)'
  ctx.lineWidth = 1
  for (let i = 0; i < 90; i++) {
    let x = rnd() * 256
    let y = rnd() * 256
    ctx.beginPath()
    ctx.moveTo(x, y)
    for (let k = 0; k < 3; k++) {
      if (rnd() > 0.5) x += (rnd() - 0.5) * 90
      else y += (rnd() - 0.5) * 90
      ctx.lineTo(x, y)
    }
    ctx.stroke()
  }
  ctx.fillStyle = 'rgba(190,205,225,0.12)'
  for (let i = 0; i < 24; i++) ctx.fillRect(rnd() * 240, rnd() * 240, 6 + rnd() * 18, 6 + rnd() * 18)
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  return tex
}

/** Die-local core centre in mm, laid flat: board x → x, board y → -z so row 0 is the far row. */
function coreXZ(i: number): [number, number] {
  const [x, y] = corePosition(i)
  return [x * MM, -y * MM]
}

/**
 * The silicon itself: eight cores in two rows, the L3 strip between them, IO at the edges.
 * The camera glides from core to core as the tour advances; the core in focus burns bright.
 */
export function DieModel({ wrap }: { wrap: RefObject<HTMLDivElement | null> }) {
  const { camera } = useThree()
  const traces = useMemo(() => makeTraceTexture(11), [])
  const silicon = useMemo(() => new THREE.MeshStandardMaterial({ color: '#0c0f14', metalness: 0.65, roughness: 0.4 }), [])
  const logic = useMemo(() => new THREE.MeshStandardMaterial({ map: traces, metalness: 0.5, roughness: 0.5 }), [traces])
  const substrate = useMemo(() => new THREE.MeshStandardMaterial({ color: '#1b3328', metalness: 0.2, roughness: 0.65 }), [])
  const cacheMat = useMemo(() => emissive('#ffd9a6', 0.16), [])
  const edgeMats = useMemo(() => Array.from({ length: CORE_COUNT }, () => emissive(GOLD, 0.2)), [])
  const light = useRef<THREE.PointLight>(null)

  const camPos = useRef(new THREE.Vector3(0, 14, 11))
  const camLook = useRef(new THREE.Vector3())
  const wantPos = useRef(new THREE.Vector3())
  const wantLook = useRef(new THREE.Vector3())

  useFrame((state, dt) => {
    const { core, dieOpacity } = sceneState.about
    if (wrap.current) {
      wrap.current.style.opacity = dieOpacity.toFixed(3)
      wrap.current.style.visibility = dieOpacity > 0.004 ? 'visible' : 'hidden'
    }
    const t = state.clock.elapsedTime

    if (core >= 0) {
      const [x, z] = coreXZ(core)
      wantLook.current.set(x - 0.5, 0.4, z + 0.45)
      wantPos.current.set(x + 2.6 + Math.sin(t * 0.35) * 0.4, 5.0, z + 4.4)
      if (light.current) light.current.position.set(x, 3, z)
    } else {
      wantLook.current.set(0, 0, 0)
      wantPos.current.set(Math.sin(t * 0.2) * 1.5, 13, 10)
    }
    const blend = 1 - Math.exp(-dt * 4)
    camPos.current.lerp(wantPos.current, blend)
    camLook.current.lerp(wantLook.current, blend)
    camera.position.copy(camPos.current)
    camera.lookAt(camLook.current)

    const pulse = 2.2 + Math.sin(t * 3.5) * 0.5
    edgeMats.forEach((m, i) => {
      const target = i === core ? pulse : 0.2
      m.emissiveIntensity += (target - m.emissiveIntensity) * Math.min(1, dt * 7)
    })
    if (light.current) light.current.intensity = core >= 0 ? 6 : 0
  })

  const [coreW, coreH] = [DIE.core[0] * MM, DIE.core[1] * MM]

  return (
    <group>
      <mesh position={[0, -0.9, 0]} material={substrate}>
        <boxGeometry args={[DIE.w * MM + 4, 0.6, DIE.h * MM + 4]} />
      </mesh>
      <mesh position={[0, -0.3, 0]} material={silicon}>
        <boxGeometry args={[DIE.w * MM, 0.6, DIE.h * MM]} />
      </mesh>

      {/* L3 between the rows, and IO strips along the far and near edges */}
      <mesh position={[0, 0.15, 0]} material={cacheMat}>
        <boxGeometry args={[DIE.cache[0] * MM, 0.3, DIE.cache[1] * MM]} />
      </mesh>
      {[-1, 1].map((side) => (
        <mesh key={side} position={[0, 0.12, side * (DIE.h * MM) * 0.46]} material={logic}>
          <boxGeometry args={[DIE.w * MM * 0.92, 0.24, 0.5]} />
        </mesh>
      ))}

      {/* cores: a logic plate with a lit edge frame that burns when the core is in focus */}
      {edgeMats.map((edge, i) => {
        const [x, z] = coreXZ(i)
        return (
          <group key={i} position={[x, 0, z]}>
            <mesh position={[0, 0.25, 0]} material={logic}>
              <boxGeometry args={[coreW, 0.5, coreH]} />
            </mesh>
            <mesh position={[0, 0.52, 0]} material={edge}>
              <boxGeometry args={[coreW - 0.3, 0.06, 0.08]} />
            </mesh>
            <mesh position={[0, 0.52, 0]} material={edge}>
              <boxGeometry args={[0.08, 0.06, coreH - 0.3]} />
            </mesh>
            <mesh position={[0, 0.52, (coreH - 0.3) / 2]} material={edge}>
              <boxGeometry args={[coreW - 0.3, 0.06, 0.08]} />
            </mesh>
            <mesh position={[0, 0.52, -(coreH - 0.3) / 2]} material={edge}>
              <boxGeometry args={[coreW - 0.3, 0.06, 0.08]} />
            </mesh>
            <mesh position={[(coreW - 0.3) / 2, 0.52, 0]} material={edge}>
              <boxGeometry args={[0.08, 0.06, coreH - 0.3]} />
            </mesh>
            <mesh position={[-(coreW - 0.3) / 2, 0.52, 0]} material={edge}>
              <boxGeometry args={[0.08, 0.06, coreH - 0.3]} />
            </mesh>
          </group>
        )
      })}

      <ambientLight intensity={0.25} />
      <directionalLight position={[6, 12, 8]} intensity={1.4} color="#e8edf5" />
      <directionalLight position={[-8, 6, -6]} intensity={0.4} color="#9fb4d6" />
      <pointLight ref={light} color={GOLD} intensity={0} distance={14} decay={2} />
    </group>
  )
}
