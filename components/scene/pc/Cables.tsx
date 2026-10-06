'use client'

import { useMemo } from 'react'
import { BOARD, BOARD_FACE_Z, GPU, GPU_BOX, INNER } from './layout'
import { MAT } from './materials'
import { tube } from './geometry'

/** A tidy build: the 24-pin and the GPU power leads run straight into grommets on the tray. */
export function Cables() {
  const geometries = useMemo(() => {
    const tray = INNER.zMin
    const boardEdgeX = BOARD.x + BOARD.w / 2
    const gpuFrontX = GPU.xMin + GPU.length
    const gpuTopY = GPU_BOX.cy + GPU.thickness / 2
    return [
      tube(
        [
          [boardEdgeX - 0.004, BOARD.y + 0.045, BOARD_FACE_Z + 0.012],
          [boardEdgeX + 0.03, BOARD.y + 0.045, BOARD_FACE_Z + 0.02],
          [0.1, BOARD.y + 0.042, tray + 0.02],
          [0.114, BOARD.y + 0.042, tray - 0.01],
        ],
        0.009,
      ),
      ...[-0.006, 0.006].map((dz) =>
        tube(
          [
            [gpuFrontX - 0.04, gpuTopY - 0.006, GPU_BOX.cz + 0.02 + dz],
            [gpuFrontX - 0.03, gpuTopY + 0.02, GPU_BOX.cz + 0.012 + dz],
            [0.125, gpuTopY + 0.016, tray + 0.02 + dz],
            [0.13, gpuTopY + 0.016, tray - 0.01 + dz],
          ],
          0.0045,
        ),
      ),
    ]
  }, [])

  return (
    <group>
      {geometries.map((geo, i) => (
        <mesh key={i} geometry={geo} material={MAT.braided} />
      ))}
    </group>
  )
}
