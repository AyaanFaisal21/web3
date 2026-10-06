'use client'

import { useMemo } from 'react'
import * as THREE from 'three'
import { BOARD_FACE_Z, COOLER, CPU, RADIATOR } from './layout'
import { MAT, GOLD, emissive } from './materials'
import { tube } from './geometry'

/** Small readout on the pump block, like the temperature display on the reference build. */
function makeReadoutTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 256
  canvas.height = 128
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = '#05060a'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = '#ffd9a6'
  ctx.font = '600 64px ui-monospace, Consolas, monospace'
  ctx.fillText('42°', 128, 56)
  ctx.fillStyle = 'rgba(255,217,166,0.55)'
  ctx.font = '500 22px ui-monospace, Consolas, monospace'
  ctx.fillText('CPU', 128, 104)
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

export function Cooling() {
  const readout = useMemo(() => makeReadoutTexture(), [])
  const readoutMat = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        map: readout,
        toneMapped: false,
        color: new THREE.Color(1.6, 1.5, 1.3),
      }),
    [readout],
  )
  const ringMat = useMemo(() => emissive(GOLD, 1.8), [])

  const blockFace = COOLER.faceZ
  const blockTopY = CPU.y + COOLER.size / 2
  const fitY = RADIATOR.y - RADIATOR.thick / 2

  // Two braided tubes leave the top of the block, pass in front of the RAM and the VRM
  // heatsink, run under the top fans and rise into the radiator's front tank.
  const tubes = useMemo(
    () => [
      tube(
        [
          [CPU.x - 0.013, blockTopY - 0.01, blockFace - 0.016],
          [CPU.x - 0.013, blockTopY + 0.02, blockFace - 0.004],
          [-0.06, 0.156, -0.055],
          [0.04, 0.152, -0.04],
          [0.13, 0.153, -0.022],
          [0.17, 0.166, -0.014],
          [RADIATOR.tankX, fitY - 0.006, -0.012],
          [RADIATOR.tankX, fitY + 0.004, -0.012],
        ],
        0.0065,
      ),
      tube(
        [
          [CPU.x + 0.013, blockTopY - 0.01, blockFace - 0.016],
          [CPU.x + 0.013, blockTopY + 0.02, blockFace - 0.004],
          [-0.04, 0.148, -0.045],
          [0.05, 0.144, -0.028],
          [0.135, 0.146, -0.008],
          [0.172, 0.16, 0.008],
          [RADIATOR.tankX, fitY - 0.006, 0.012],
          [RADIATOR.tankX, fitY + 0.004, 0.012],
        ],
        0.0065,
      ),
    ],
    [blockTopY, blockFace, fitY],
  )

  return (
    <group>
      {/* radiator core, end tank and its two fittings */}
      <mesh position={[RADIATOR.x, RADIATOR.y, RADIATOR.z]} material={MAT.darkMetal}>
        <boxGeometry args={[RADIATOR.length, RADIATOR.thick, RADIATOR.width]} />
      </mesh>
      <mesh position={[RADIATOR.tankX, RADIATOR.y, RADIATOR.z]} material={MAT.darkMetal}>
        <boxGeometry args={[RADIATOR.tankLength, RADIATOR.thick, RADIATOR.width - 0.01]} />
      </mesh>
      {[-0.012, 0.012].map((dz) => (
        <mesh key={dz} position={[RADIATOR.tankX, fitY - 0.005, dz]} material={MAT.aluminum}>
          <cylinderGeometry args={[0.0085, 0.0085, 0.012, 20]} />
        </mesh>
      ))}

      {/* pump block over the CPU: brushed body, glass face, lit ring, readout */}
      <group position={[CPU.x, CPU.y, BOARD_FACE_Z + COOLER.depth / 2]}>
        <mesh material={MAT.darkMetal}>
          <boxGeometry args={[COOLER.size, COOLER.size, COOLER.depth]} />
        </mesh>
        <mesh position={[0, 0, COOLER.depth / 2 + 0.001]} rotation={[Math.PI / 2, 0, 0]} material={MAT.plastic}>
          <cylinderGeometry args={[0.031, 0.031, 0.003, 48]} />
        </mesh>
        <mesh position={[0, 0, COOLER.depth / 2 + 0.0028]} material={ringMat}>
          <torusGeometry args={[0.029, 0.0018, 8, 64]} />
        </mesh>
        <mesh position={[0, 0, COOLER.depth / 2 + 0.0027]} material={readoutMat}>
          <planeGeometry args={[0.034, 0.017]} />
        </mesh>
      </group>

      {tubes.map((geo, i) => (
        <mesh key={i} geometry={geo} material={MAT.braided} />
      ))}
    </group>
  )
}
