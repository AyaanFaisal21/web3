'use client'

import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { CARD, cardPose } from './gpuLayout'
import { MAT, GOLD, emissive } from './materials'
import { GpuBoard } from './GpuBoard'
import { sceneState } from '../state'

const NAME = 'AYAAN'
const ease = (t: number) => t * t * (3 - 2 * t)
const smooth = (p: number, a: number, b: number) => ease(Math.min(1, Math.max(0, (p - a) / (b - a))))

/** Draws the name to a transparent canvas, redrawing once the display font has loaded. */
function useNameTexture(fontFamily: string) {
  const { texture, canvas } = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 1024
    canvas.height = 256
    const texture = new THREE.CanvasTexture(canvas)
    texture.colorSpace = THREE.SRGBColorSpace
    texture.anisotropy = 8
    return { texture, canvas }
  }, [])
  useEffect(() => {
    const font = `400 168px ${fontFamily}`
    const draw = () => {
      const ctx = canvas.getContext('2d') as CanvasRenderingContext2D & { letterSpacing?: string }
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.font = font
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.letterSpacing = '0.12em'
      ctx.shadowColor = 'rgba(255,184,102,0.9)'
      ctx.shadowBlur = 28
      ctx.fillStyle = '#ffe9cc'
      ctx.fillText(NAME, canvas.width / 2 + 8, canvas.height / 2 + 6)
      ctx.shadowBlur = 0
      ctx.fillStyle = '#fff6e8'
      ctx.fillText(NAME, canvas.width / 2 + 8, canvas.height / 2 + 6)
      texture.needsUpdate = true
    }
    draw()
    let cancelled = false
    document.fonts.load(font).then(() => { if (!cancelled) draw() }).catch(() => {})
    return () => { cancelled = true }
  }, [canvas, texture, fontFamily])
  return texture
}

/**
 * The graphics card as separable layers. In the Projects chapter it slides out of its slot,
 * turns its fan side to the glass, and the shroud and heatsink lift away to bare the board.
 */
export function Gpu({ fontFamily }: { fontFamily: string }) {
  const card = useRef<THREE.Group>(null)
  const shroud = useRef<THREE.Group>(null)
  const heatsink = useRef<THREE.Group>(null)
  const fans = useRef<(THREE.Group | null)[]>([])
  const nameTex = useNameTexture(fontFamily)
  const m = useMemo(
    () => ({
      shroud: new THREE.MeshStandardMaterial({ color: '#131417', metalness: 0.15, roughness: 0.7, transparent: true }),
      edge: new THREE.MeshStandardMaterial({ color: '#2b2e34', metalness: 0.95, roughness: 0.32, transparent: true }),
      blade: new THREE.MeshStandardMaterial({ color: '#30343b', metalness: 0.2, roughness: 0.55, transparent: true }),
      ring: Object.assign(emissive(GOLD, 1.6), { transparent: true }),
      accent: Object.assign(emissive(GOLD, 1.6), { transparent: true }),
      name: new THREE.MeshBasicMaterial({ map: nameTex, transparent: true, toneMapped: false, color: new THREE.Color(2.4, 2.1, 1.7), depthWrite: false }),
      copper: new THREE.MeshStandardMaterial({ color: '#b87333', metalness: 1, roughness: 0.35, transparent: true }),
      fin: new THREE.MeshStandardMaterial({ color: '#3a3d44', metalness: 0.9, roughness: 0.45, transparent: true }),
    }),
    [nameTex],
  )
  const shroudMats = [m.shroud, m.edge, m.blade, m.ring, m.accent, m.name]
  const heatsinkMats = [m.copper, m.fin]

  useFrame((_, dt) => {
    const { out, bare } = sceneState.gpu
    const p = cardPose(out)
    if (card.current) {
      card.current.position.set(p.x, p.y, p.z)
      card.current.rotation.x = p.rotX
    }
    if (shroud.current) shroud.current.position.y = -CARD.shroudTravel * bare
    if (heatsink.current) heatsink.current.position.y = -CARD.heatsinkTravel * bare
    const shroudOpacity = 1 - smooth(bare, 0.15, 0.75)
    const heatsinkOpacity = 1 - smooth(bare, 0.45, 1)
    shroudMats.forEach((mat) => { mat.opacity = shroudOpacity; mat.visible = shroudOpacity > 0.01 })
    heatsinkMats.forEach((mat) => { mat.opacity = heatsinkOpacity; mat.visible = heatsinkOpacity > 0.01 })
    fans.current.forEach((g, i) => { if (g) g.rotation.y += (8 + i) * dt })
  })

  const edgeZ = CARD.height / 2
  const fanY = CARD.shroudY - CARD.shroudT / 2 - 0.002
  return (
    <group ref={card}>
      <mesh position={[0, CARD.backplateY, 0]} material={MAT.darkMetal}>
        <boxGeometry args={[CARD.length - 0.012, 0.002, CARD.height - 0.008]} />
      </mesh>
      <mesh position={[-CARD.length / 2 + 0.0015, 0.004, -0.02]} material={MAT.aluminum}>
        <boxGeometry args={[0.003, CARD.thickness + 0.01, 0.1]} />
      </mesh>
      <GpuBoard />

      {/* vapor chamber and fin stack */}
      <group ref={heatsink}>
        <mesh position={[-0.02, CARD.heatsinkY + 0.009, 0]} material={m.copper}>
          <boxGeometry args={[0.2, 0.004, 0.1]} />
        </mesh>
        {Array.from({ length: 22 }, (_, i) => (
          <mesh key={i} position={[0, CARD.heatsinkY - 0.003, -0.058 + i * 0.0055]} material={m.fin}>
            <boxGeometry args={[0.27, 0.016, 0.0008]} />
          </mesh>
        ))}
      </group>

      {/* shroud with three fans, and the branded side edge */}
      <group ref={shroud}>
        <mesh position={[0, CARD.shroudY, 0]} material={m.shroud}>
          <boxGeometry args={[CARD.length, CARD.shroudT, CARD.height]} />
        </mesh>
        {[-0.1, 0, 0.1].map((dx, i) => (
          <group key={i} position={[dx, fanY, 0.004]}>
            <mesh rotation={[Math.PI / 2, 0, 0]} material={m.ring}>
              <torusGeometry args={[0.044, 0.0018, 8, 64]} />
            </mesh>
            <mesh material={m.shroud}>
              <cylinderGeometry args={[0.012, 0.012, 0.008, 24]} />
            </mesh>
            <group ref={(el) => { fans.current[i] = el }}>
              {Array.from({ length: 7 }, (_, b) => (
                <group key={b} rotation={[0, (b / 7) * Math.PI * 2, 0]}>
                  <mesh position={[0, 0, 0.026]} rotation={[0, 0, 0.5]} material={m.blade}>
                    <boxGeometry args={[0.011, 0.0012, 0.034]} />
                  </mesh>
                </group>
              ))}
            </group>
          </group>
        ))}
        <mesh position={[0, 0, edgeZ + 0.0006]} material={m.edge}>
          <boxGeometry args={[CARD.length - 0.024, CARD.thickness - 0.014, 0.0012]} />
        </mesh>
        <mesh position={[0.018, 0.0045, edgeZ + 0.0016]} material={m.name}>
          <planeGeometry args={[0.2, 0.05]} />
        </mesh>
        <mesh position={[0, -0.0215, edgeZ + 0.0014]} material={m.accent}>
          <boxGeometry args={[CARD.length - 0.07, 0.0014, 0.0008]} />
        </mesh>
      </group>
    </group>
  )
}
