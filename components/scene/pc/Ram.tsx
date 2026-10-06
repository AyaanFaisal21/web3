'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { RAM } from './layout'
import { MAT, GOLD, WARM_WHITE, emissive } from './materials'
import { STICK, chipLocal, stickPose } from './ramExplode'
import { sceneState } from '../state'
import { EXPERIENCES } from '@/lib/content/experience'

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

/** Light bar: a breathing gold glow plus a brighter pulse travelling up the stick, phased per stick. */
const fragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uPhase;
  uniform vec3 uColor;
  uniform vec3 uPeak;
  varying vec2 vUv;
  void main() {
    float t = fract(uTime * 0.32 + uPhase);
    float d = vUv.y - t;
    float band = exp(-d * d * 70.0) + exp(-(d + 1.0) * (d + 1.0) * 70.0);
    float breathe = 0.5 + 0.2 * sin(uTime * 1.6 + uPhase * 6.2832);
    gl_FragColor = vec4(uColor * breathe + uPeak * band * 1.8, 1.0);
  }
`

/** Package markings: a company for an entry chip, a part number for the rest. */
function makeChipLabel(lines: [string, string, string], strong: boolean) {
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 332
  const ctx = canvas.getContext('2d')!
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = strong ? 'rgba(236,230,214,0.92)' : 'rgba(200,206,218,0.55)'
  ctx.font = `${strong ? 600 : 500} ${strong ? 44 : 34}px ui-monospace, Consolas, monospace`
  ctx.fillText(lines[0], 128, 118)
  ctx.fillStyle = 'rgba(200,206,218,0.6)'
  ctx.font = '500 24px ui-monospace, Consolas, monospace'
  ctx.fillText(lines[1], 128, 184)
  ctx.fillText(lines[2], 128, 224)
  ctx.beginPath()
  ctx.arc(40, 292, 7, 0, Math.PI * 2)
  ctx.fill()
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8
  return tex
}

const entryAt = (stick: number, slot: number) => EXPERIENCES.findIndex((e) => e.stick === stick && e.slot === slot)

export function Ram() {
  const sticks = useRef<(THREE.Group | null)[]>([])
  const fronts = useRef<(THREE.Group | null)[]>([])
  const barMats = useMemo(
    () =>
      Array.from({ length: RAM.count }, (_, i) =>
        new THREE.ShaderMaterial({
          uniforms: { uTime: { value: 0 }, uPhase: { value: -i * 0.13 }, uColor: { value: new THREE.Color(GOLD) }, uPeak: { value: new THREE.Color(WARM_WHITE) } },
          vertexShader,
          fragmentShader,
        })),
    [],
  )
  const pcbMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#10181a', metalness: 0.3, roughness: 0.7 }), [])
  const chipMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#0a0b0e', metalness: 0.3, roughness: 0.5 }), [])
  const frontMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#1b1d22', metalness: 0.9, roughness: 0.3, transparent: true }), [])
  const genericLabel = useMemo(() => new THREE.MeshBasicMaterial({ map: makeChipLabel(['H5CG48MEBD', 'AXCB 2401', 'KOREA'], false), transparent: true }), [])
  const entryLabels = useMemo(
    () => EXPERIENCES.map((e) => new THREE.MeshBasicMaterial({ map: makeChipLabel([e.chip[0], e.chip[1], 'AF·DDR5'], true), transparent: true })),
    [],
  )
  const frameMats = useMemo(() => EXPERIENCES.map(() => emissive(GOLD, 0.12)), [])

  useFrame(({ clock }, dt) => {
    const { open, bare, chip } = sceneState.ram
    for (let i = 0; i < RAM.count; i++) {
      const g = sticks.current[i]
      if (!g) continue
      const p = stickPose(i, open[i])
      g.position.set(p.x, p.y, p.z)
      g.rotation.y = p.rotY
      const f = fronts.current[i]
      if (f) f.position.y = STICK.bareSlide * bare
      barMats[i].uniforms.uTime.value = clock.elapsedTime
    }
    frontMat.opacity = 1 - bare
    frontMat.visible = bare < 0.995
    const blend = Math.min(1, dt * 8)
    frameMats.forEach((m, i) => {
      const target = i === chip ? 2 : 0.12
      m.emissiveIntensity += (target - m.emissiveIntensity) * blend
    })
  })

  const faceX = STICK.pcb / 2 + STICK.chip.w + STICK.spreader / 2
  const body = STICK.height - 0.002

  return (
    <group>
      {Array.from({ length: RAM.count }, (_, i) => (
        <group key={i} ref={(el) => { sticks.current[i] = el }}>
          <mesh material={pcbMat}>
            <boxGeometry args={[STICK.pcb, STICK.length, body]} />
          </mesh>
          {/* back heat spreader and the light bar along the top edge: these stay when the stick opens */}
          <mesh position={[-(STICK.pcb / 2 + STICK.spreader / 2), 0, 0]} material={MAT.darkMetal}>
            <boxGeometry args={[STICK.spreader, STICK.length, body]} />
          </mesh>
          <mesh position={[0.0005, 0, STICK.height / 2 - 0.0015]} material={barMats[i]}>
            <boxGeometry args={[0.0062, STICK.length * 0.95, 0.004]} />
          </mesh>
          {/* eight DRAM packages on the front face, each with its markings; entry chips get a lit frame */}
          {Array.from({ length: STICK.chip.count }, (_, slot) => {
            const entry = entryAt(i, slot)
            return (
              <group key={slot} position={chipLocal(slot)}>
                <mesh material={chipMat}>
                  <boxGeometry args={[STICK.chip.w, STICK.chip.len, STICK.chip.h]} />
                </mesh>
                <mesh position={[STICK.chip.w / 2 + 0.00005, 0, 0]} rotation={[0, Math.PI / 2, 0]} material={entry >= 0 ? entryLabels[entry] : genericLabel}>
                  <planeGeometry args={[STICK.chip.h, STICK.chip.len]} />
                </mesh>
                {entry >= 0 && (
                  <mesh position={[-STICK.chip.w / 2 + 0.0001, 0, 0]} rotation={[0, Math.PI / 2, 0]} material={frameMats[entry]}>
                    <planeGeometry args={[STICK.chip.h + 0.003, STICK.chip.len + 0.003]} />
                  </mesh>
                )}
              </group>
            )
          })}
          {/* front heat spreader: slides up and fades to bare the chips */}
          <group ref={(el) => { fronts.current[i] = el }}>
            <mesh position={[faceX, 0, 0]} material={frontMat}>
              <boxGeometry args={[STICK.spreader, STICK.length, body]} />
            </mesh>
          </group>
        </group>
      ))}
    </group>
  )
}
