import * as THREE from 'three'

/**
 * Silkscreen-style text drawn once to a canvas: a title line and a smaller second line,
 * centred on a transparent background so the part's own colour shows through.
 */
export function makeLabel(lines: string[], width: number, height: number, opts: { size?: number; color?: string; secondary?: string } = {}) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')!
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  const size = opts.size ?? Math.round(height * 0.3)
  const color = opts.color ?? 'rgba(236,230,214,0.92)'
  const secondary = opts.secondary ?? 'rgba(200,206,218,0.6)'
  const total = lines.length
  lines.forEach((text, i) => {
    const s = i === 0 ? size : Math.round(size * 0.5)
    ctx.font = `${i === 0 ? 600 : 500} ${s}px ui-monospace, Consolas, monospace`
    ctx.fillStyle = i === 0 ? color : secondary
    const y = total === 1 ? height / 2 : height * (0.42 + (i - (total - 1) / 2) * 0.3)
    ctx.fillText(text, width / 2, y, width * 0.92)
  })
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8
  return tex
}
