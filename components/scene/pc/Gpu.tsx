'use client'

import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { GPU, GPU_BOX } from './layout'
import { MAT, GOLD, emissive } from './materials'

const NAME = 'AYAAN'

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
      const x = canvas.width / 2 + 8
      const y = canvas.height / 2 + 6
      ctx.shadowColor = 'rgba(255,184,102,0.9)'
      ctx.shadowBlur = 28
      ctx.fillStyle = '#ffe9cc'
      ctx.fillText(NAME, x, y)
      ctx.shadowBlur = 0
      ctx.fillStyle = '#fff6e8'
      ctx.fillText(NAME, x, y)
      texture.needsUpdate = true
    }
    draw()
    let cancelled = false
    document.fonts
      .load(font)
      .then(() => {
        if (!cancelled) draw()
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [canvas, texture, fontFamily])

  return texture
}

export function Gpu({ fontFamily }: { fontFamily: string }) {
  const nameTex = useNameTexture(fontFamily)
  const nameMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        map: nameTex,
        transparent: true,
        toneMapped: false,
        color: new THREE.Color(2.4, 2.1, 1.7),
        depthWrite: false,
      }),
    [nameTex],
  )
  const accent = useMemo(() => emissive(GOLD, 1.6), [])
  const face = GPU.height / 2

  return (
    <group position={[GPU_BOX.cx, GPU_BOX.cy, GPU_BOX.cz]}>
      {/* shroud */}
      <mesh material={MAT.plastic}>
        <boxGeometry args={[GPU.length, GPU.thickness, GPU.height]} />
      </mesh>
      {/* backplate on top */}
      <mesh position={[0, GPU.thickness / 2 + 0.001, 0]} material={MAT.darkMetal}>
        <boxGeometry args={[GPU.length - 0.012, 0.002, GPU.height - 0.008]} />
      </mesh>
      {/* brushed inset on the side edge, carrying the name and a lit accent line */}
      <mesh position={[0, 0, face + 0.0006]} material={MAT.aluminum}>
        <boxGeometry args={[GPU.length - 0.024, GPU.thickness - 0.014, 0.0012]} />
      </mesh>
      <mesh position={[0.018, 0.0045, face + 0.0016]} material={nameMat}>
        <planeGeometry args={[0.2, 0.05]} />
      </mesh>
      <mesh position={[0, -0.0215, face + 0.0014]} material={accent}>
        <boxGeometry args={[GPU.length - 0.07, 0.0014, 0.0008]} />
      </mesh>
      {/* rear bracket */}
      <mesh position={[-GPU.length / 2 + 0.0015, 0.004, -0.02]} material={MAT.aluminum}>
        <boxGeometry args={[0.003, GPU.thickness + 0.01, 0.1]} />
      </mesh>
      {/* fan cutouts on the underside */}
      {[-0.1, 0, 0.1].map((dx) => (
        <mesh
          key={dx}
          position={[dx, -GPU.thickness / 2 - 0.0005, 0.004]}
          material={MAT.darkMetal}
        >
          <cylinderGeometry args={[0.046, 0.046, 0.001, 40]} />
        </mesh>
      ))}
    </group>
  )
}
