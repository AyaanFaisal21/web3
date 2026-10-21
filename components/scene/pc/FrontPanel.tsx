'use client'

import { useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useCursor } from '@react-three/drei'
import * as THREE from 'three'
import { CASE, FRONT_PANEL } from './layout'
import { MAT, GOLD, emissive } from './materials'
import { LINKS, copyEmail, openLink } from '@/lib/content/links'

const RING_IDLE = 1.3
const RING_HOT = 3.4
const PRESS_DEPTH = 0.0015

/** Brand marks and the document icon, as 24-unit SVG paths, drawn in gold on the button caps. */
const ICON_PATHS: Record<string, string> = {
  github:
    'M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12',
  linkedin:
    'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
  x: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.912-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z',
}

function iconCanvas(size = 256) {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = GOLD
  ctx.strokeStyle = GOLD
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  return { canvas, ctx }
}

function toTexture(canvas: HTMLCanvasElement) {
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8
  return tex
}

/** The power symbol: an open ring with a bar through the gap. */
function makePowerIcon(size = 256) {
  const { canvas, ctx } = iconCanvas(size)
  ctx.lineWidth = size * 0.085
  const c = size / 2
  const r = size * 0.3
  ctx.beginPath()
  ctx.arc(c, c, r, -Math.PI / 2 + 0.65, (3 * Math.PI) / 2 - 0.65)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(c, c - r - size * 0.03)
  ctx.lineTo(c, c - r * 0.2)
  ctx.stroke()
  return toTexture(canvas)
}

/** A brand mark from its SVG path, scaled to about 56% of the cap. */
function makePathIcon(path: string, size = 256) {
  const { canvas, ctx } = iconCanvas(size)
  const scale = (size * 0.56) / 24
  ctx.translate((size - 24 * scale) / 2, (size - 24 * scale) / 2)
  ctx.scale(scale, scale)
  ctx.fill(new Path2D(path))
  return toTexture(canvas)
}

/** A generic sheet of paper: a page with a folded corner and three text lines. */
function makePaperIcon(size = 256) {
  const { canvas, ctx } = iconCanvas(size)
  const lw = size * 0.07
  ctx.lineWidth = lw
  const x0 = size * 0.3
  const y0 = size * 0.2
  const w = size * 0.4
  const h = size * 0.6
  const fold = size * 0.13
  ctx.beginPath()
  ctx.moveTo(x0, y0)
  ctx.lineTo(x0 + w - fold, y0)
  ctx.lineTo(x0 + w, y0 + fold)
  ctx.lineTo(x0 + w, y0 + h)
  ctx.lineTo(x0, y0 + h)
  ctx.closePath()
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(x0 + w - fold, y0)
  ctx.lineTo(x0 + w - fold, y0 + fold)
  ctx.lineTo(x0 + w, y0 + fold)
  ctx.stroke()
  ctx.lineWidth = lw * 0.8
  for (const f of [0.42, 0.57, 0.72]) {
    ctx.beginPath()
    ctx.moveTo(x0 + size * 0.09, y0 + h * f)
    ctx.lineTo(x0 + w - size * 0.09, y0 + h * f)
    ctx.stroke()
  }
  return toTexture(canvas)
}

type ButtonProps = {
  y: number
  z: number
  r: number
  icon: THREE.Texture
  onPress: () => void
}

/**
 * A round, backlit button standing proud of the pillar face: a lit bezel that brightens under
 * the pointer and a cap with its icon that sinks while pressed. Pointer events come from the
 * canvas, so the HTML overlay must stay pointer-events-none.
 */
function PanelButton({ y, z, r, icon, onPress }: ButtonProps) {
  const [hover, setHover] = useState(false)
  const pressed = useRef(false)
  const cap = useRef<THREE.Group>(null)
  useCursor(hover)
  const ringMat = useMemo(() => emissive(GOLD, RING_IDLE), [])

  useFrame((_, dt) => {
    const blend = Math.min(1, dt * 12)
    ringMat.emissiveIntensity += ((hover ? RING_HOT : RING_IDLE) - ringMat.emissiveIntensity) * blend
    if (cap.current) cap.current.position.x += ((pressed.current ? -PRESS_DEPTH : 0) - cap.current.position.x) * blend
  })

  return (
    <group
      position={[CASE.w / 2, y, z]}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHover(true)
      }}
      onPointerOut={() => {
        setHover(false)
        pressed.current = false
      }}
      onPointerDown={(e) => {
        e.stopPropagation()
        pressed.current = true
      }}
      onPointerUp={() => {
        pressed.current = false
      }}
      onClick={(e) => {
        e.stopPropagation()
        onPress()
      }}
    >
      <mesh position={[0.0035, 0, 0]} rotation={[0, Math.PI / 2, 0]} material={ringMat}>
        <torusGeometry args={[r + 0.0015, 0.0012, 10, 56]} />
      </mesh>
      <group ref={cap}>
        <mesh position={[0.002, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={MAT.darkMetal}>
          <cylinderGeometry args={[r, r, 0.004, 48]} />
        </mesh>
        <mesh position={[0.0042, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[r * 1.5, r * 1.5]} />
          <meshBasicMaterial map={icon} transparent toneMapped={false} />
        </mesh>
      </group>
    </group>
  )
}

/** The front panel: a column of buttons, the power button on top for the email, the links below. */
export function FrontPanel() {
  const icons = useMemo(
    () => ({
      power: makePowerIcon(),
      github: makePathIcon(ICON_PATHS.github),
      linkedin: makePathIcon(ICON_PATHS.linkedin),
      x: makePathIcon(ICON_PATHS.x),
      resume: makePaperIcon(),
    }),
    [],
  )
  const pressPower = () => {
    void copyEmail()
  }

  const { z, power, links } = FRONT_PANEL
  return (
    <group>
      <PanelButton y={power.y} z={z} r={power.r} icon={icons.power} onPress={pressPower} />
      {LINKS.map((link, i) => {
        const y = links.y0 - i * links.pitchY
        return (
          <PanelButton key={link.key} y={y} z={z} r={links.r} icon={icons[link.key as keyof typeof icons] ?? icons.resume} onPress={() => openLink(link.href)} />
        )
      })}
    </group>
  )
}
