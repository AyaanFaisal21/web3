'use client'

import { useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { BOARD_FACE_Z, RAM } from './layout'
import { MAT, GOLD, WARM_WHITE } from './materials'

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

/**
 * Light bar: a steady gold glow that breathes, plus a brighter pulse travelling up the stick.
 * Each stick gets its own phase, so the pulse sweeps across the four bars like a wave.
 */
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
    vec3 c = uColor * breathe + uPeak * band * 1.8;
    gl_FragColor = vec4(c, 1.0);
  }
`

export function Ram() {
  const materials = useMemo(
    () =>
      Array.from(
        { length: RAM.count },
        (_, i) =>
          new THREE.ShaderMaterial({
            uniforms: {
              uTime: { value: 0 },
              uPhase: { value: -i * 0.13 },
              uColor: { value: new THREE.Color(GOLD) },
              uPeak: { value: new THREE.Color(WARM_WHITE) },
            },
            vertexShader,
            fragmentShader,
          }),
      ),
    [],
  )

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    for (const m of materials) m.uniforms.uTime.value = t
  })

  return (
    <group>
      {materials.map((mat, i) => (
        <group key={i} position={[RAM.x0 + i * RAM.pitch, RAM.y, BOARD_FACE_Z]}>
          {/* heat spreader */}
          <mesh position={[0, 0, RAM.height / 2]} material={MAT.darkMetal}>
            <boxGeometry args={[RAM.thickness, RAM.length, RAM.height]} />
          </mesh>
          {/* light bar on the edge that faces the glass */}
          <mesh position={[0, 0, RAM.height - 0.0015]} material={mat}>
            <boxGeometry args={[RAM.thickness * 0.78, RAM.length * 0.95, 0.004]} />
          </mesh>
        </group>
      ))}
    </group>
  )
}
