'use client'

import { useMemo } from 'react'
import * as THREE from 'three'
import { BOARD, BOARD_FACE_Z, CPU, INNER, RAM } from './layout'
import { MAT, GOLD, emissive } from './materials'

/** Procedural PCB: a dark board with faint traces, a few chips and solder pads, drawn once. */
function makeBoardTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 1280
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = '#0b0e12'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // seeded so the board looks the same on every load
  let seed = 7
  const rnd = () => {
    seed = (seed * 16807) % 2147483647
    return seed / 2147483647
  }

  ctx.strokeStyle = 'rgba(140,160,180,0.09)'
  ctx.lineWidth = 2
  for (let i = 0; i < 160; i++) {
    let x = rnd() * canvas.width
    let y = rnd() * canvas.height
    ctx.beginPath()
    ctx.moveTo(x, y)
    for (let s = 0; s < 4; s++) {
      if (rnd() > 0.5) x += (rnd() - 0.5) * 300
      else y += (rnd() - 0.5) * 300
      ctx.lineTo(x, y)
    }
    ctx.stroke()
  }
  ctx.fillStyle = '#161a20'
  for (let i = 0; i < 40; i++) ctx.fillRect(rnd() * 980, rnd() * 1240, 10 + rnd() * 40, 10 + rnd() * 40)
  ctx.fillStyle = 'rgba(200,170,90,0.25)'
  for (let i = 0; i < 400; i++) ctx.fillRect(rnd() * 1020, rnd() * 1276, 3, 3)

  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8
  return tex
}

type HeatsinkProps = {
  position: [number, number, number]
  size: [number, number, number]
  fins: number
  axis: 'x' | 'y'
}

/** A base plate with evenly spaced fins standing off the board. */
function Heatsink({ position, size, fins, axis }: HeatsinkProps) {
  const [w, h, depth] = size
  const base = 0.008
  return (
    <group position={position}>
      <mesh position={[0, 0, base / 2]} material={MAT.heatsink}>
        <boxGeometry args={[w, h, base]} />
      </mesh>
      {Array.from({ length: fins }, (_, i) => {
        const t = (i + 0.5) / fins - 0.5
        const z = base + (depth - base) / 2
        return axis === 'x' ? (
          <mesh key={i} position={[t * w, 0, z]} material={MAT.heatsink}>
            <boxGeometry args={[(w / fins) * 0.45, h, depth - base]} />
          </mesh>
        ) : (
          <mesh key={i} position={[0, t * h, z]} material={MAT.heatsink}>
            <boxGeometry args={[w, (h / fins) * 0.45, depth - base]} />
          </mesh>
        )
      })}
    </group>
  )
}

export function Motherboard() {
  const texture = useMemo(() => makeBoardTexture(), [])
  const boardMat = useMemo(
    () => new THREE.MeshStandardMaterial({ map: texture, roughness: 0.72, metalness: 0.25 }),
    [texture],
  )
  const accent = useMemo(() => emissive(GOLD, 0.6), [])
  const z = BOARD_FACE_Z
  const rearX = BOARD.x - BOARD.w / 2
  const trayZ = INNER.zMin + 0.0005

  return (
    <group>
      <mesh position={[BOARD.x, BOARD.y, BOARD.z]} material={boardMat}>
        <boxGeometry args={[BOARD.w, BOARD.h, BOARD.t]} />
      </mesh>

      {/* rear IO shroud, top-left, with a lit accent line */}
      <mesh position={[rearX + 0.024, CPU.y + 0.025, z + 0.0175]} material={MAT.darkMetal}>
        <boxGeometry args={[0.046, 0.105, 0.035]} />
      </mesh>
      <mesh position={[rearX + 0.024, CPU.y + 0.025, z + 0.0355]} material={accent}>
        <boxGeometry args={[0.03, 0.0015, 0.001]} />
      </mesh>

      {/* VRM heatsinks above and to the left of the socket */}
      <Heatsink position={[CPU.x + 0.012, CPU.y + 0.064, z]} size={[0.1, 0.022, 0.03]} fins={6} axis="x" />
      <Heatsink position={[CPU.x - 0.058, CPU.y + 0.005, z]} size={[0.02, 0.095, 0.03]} fins={9} axis="y" />


      {/* DIMM slots */}
      {Array.from({ length: RAM.count }, (_, i) => (
        <mesh key={i} position={[RAM.x0 + i * RAM.pitch, RAM.y, z + 0.004]} material={MAT.pcbSlot}>
          <boxGeometry args={[0.0075, 0.147, 0.008]} />
        </mesh>
      ))}

      {/* M.2 heatsink between the socket and the card; chipset heatsink below the card */}
      <mesh position={[BOARD.x + 0.02, BOARD.y - 0.003, z + 0.004]} material={MAT.darkMetal}>
        <boxGeometry args={[0.095, 0.02, 0.008]} />
      </mesh>
      <mesh position={[BOARD.x + 0.07, BOARD.y - 0.115, z + 0.006]} material={MAT.darkMetal}>
        <boxGeometry args={[0.06, 0.055, 0.012]} />
      </mesh>
      <mesh position={[BOARD.x + 0.07, BOARD.y - 0.115, z + 0.0125]} material={accent}>
        <boxGeometry args={[0.012, 0.012, 0.001]} />
      </mesh>

      {/* spare PCIe slots below the card */}
      <mesh position={[BOARD.x - 0.02, BOARD.y - 0.0925, z + 0.005]} material={MAT.pcbSlot}>
        <boxGeometry args={[0.09, 0.008, 0.01]} />
      </mesh>
      <mesh position={[BOARD.x - 0.042, BOARD.y - 0.1125, z + 0.005]} material={MAT.pcbSlot}>
        <boxGeometry args={[0.025, 0.008, 0.01]} />
      </mesh>

      {/* cable grommets on the tray, where the cables disappear behind it */}
      <mesh position={[0.112, 0.05, trayZ]} material={MAT.pcbSlot}>
        <boxGeometry args={[0.03, 0.055, 0.002]} />
      </mesh>
      <mesh position={[0.13, 0, trayZ]} material={MAT.pcbSlot}>
        <boxGeometry args={[0.03, 0.045, 0.002]} />
      </mesh>
    </group>
  )
}
