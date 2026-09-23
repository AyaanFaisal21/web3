"use client"

import { useEffect, useRef, useState, type CSSProperties } from "react"

// Sparse to dense. Bright pixels pick dense characters, so a dark photo renders like a
// terminal print on a dark panel. Pass `invert` for dark-on-light output instead.
export const ASCII_RAMP = " .'`^\",:;Il!i><~+_-?][}{1)(|\\/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$"

const MONO_STACK = "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', monospace"

interface AsciiImageProps {
  src: string
  alt: string
  /** Natural image size. Sets the panel's aspect ratio before the image has loaded. */
  width: number
  height: number
  /** Characters per row. More columns means finer detail and a smaller glyph. */
  cols?: number
  /** Below 1 lifts the midtones, above 1 deepens them. */
  gamma?: number
  /** Luminance below this (after the percentile stretch) becomes a blank cell, which keeps sensor noise out of dark areas. */
  floor?: number
  ramp?: string
  invert?: boolean
  color?: string
  background?: string
  className?: string
  style?: CSSProperties
}

/**
 * Shows the photo by default and crossfades to an ASCII rendering while the cursor hovers
 * over it. On touch devices a tap toggles the two. The ASCII grid is built once on mount:
 * the image is sampled on an offscreen canvas at `cols` x `rows`, luminance is stretched
 * across the 2nd..98th percentile so exposure does not matter, and each cell picks a glyph
 * from `ramp`. Glyph size is fitted to the container width, so the art scales with layout.
 */
export function AsciiImage({
  src,
  alt,
  width,
  height,
  cols = 110,
  gamma = 0.85,
  floor = 0.08,
  ramp = ASCII_RAMP,
  invert = false,
  color = "#e4e4e7",
  background = "#000000",
  className = "",
  style,
}: AsciiImageProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [text, setText] = useState("")
  const [fontSize, setFontSize] = useState(0)
  const [active, setActive] = useState(false)
  // Advance width of one glyph relative to the font size, for the resolved monospace font.
  const [advance, setAdvance] = useState(0.6)

  // Measure the resolved font once so the row count matches the real cell shape.
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ctx = document.createElement("canvas").getContext("2d")
    if (!ctx) return
    ctx.font = `100px ${getComputedStyle(el).fontFamily}`
    const measured = ctx.measureText("M").width / 100
    if (measured > 0) setAdvance(measured)
  }, [])

  // Fit exactly `cols` glyphs across the container width.
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const fit = () => setFontSize(el.clientWidth / (cols * advance))
    fit()
    const observer = new ResizeObserver(fit)
    observer.observe(el)
    return () => observer.disconnect()
  }, [cols, advance])

  // Sample the image and map luminance to glyphs.
  useEffect(() => {
    let cancelled = false
    const img = new Image()
    img.src = src
    img
      .decode()
      .then(() => {
        if (cancelled) return
        const rows = Math.max(1, Math.round(cols * (img.naturalHeight / img.naturalWidth) * advance))
        const canvas = document.createElement("canvas")
        canvas.width = cols
        canvas.height = rows
        const ctx = canvas.getContext("2d", { willReadFrequently: true })
        if (!ctx) return
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = "high"
        ctx.drawImage(img, 0, 0, cols, rows)
        const { data } = ctx.getImageData(0, 0, cols, rows)

        const lum = new Float32Array(cols * rows)
        for (let i = 0; i < lum.length; i++) {
          lum[i] = (0.2126 * data[i * 4] + 0.7152 * data[i * 4 + 1] + 0.0722 * data[i * 4 + 2]) / 255
        }
        const sorted = Float32Array.from(lum).sort()
        const lo = sorted[Math.floor(sorted.length * 0.02)]
        const hi = sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * 0.98))]
        const range = Math.max(hi - lo, 1e-6)
        const floorRange = Math.max(1 - floor, 1e-6)

        const last = ramp.length - 1
        const lines: string[] = []
        for (let y = 0; y < rows; y++) {
          let line = ""
          for (let x = 0; x < cols; x++) {
            let v = Math.min(1, Math.max(0, (lum[y * cols + x] - lo) / range))
            v = v < floor ? 0 : (v - floor) / floorRange
            v = Math.pow(v, gamma)
            if (invert) v = 1 - v
            line += ramp[Math.round(v * last)]
          }
          lines.push(line)
        }
        setText(lines.join("\n"))
      })
      .catch(() => {
        // Leave the ASCII layer blank if the image cannot be decoded; the photo still shows.
      })
    return () => {
      cancelled = true
    }
  }, [src, cols, gamma, floor, ramp, invert, advance])

  const showAscii = active && text.length > 0

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden ${className}`}
      style={{ aspectRatio: `${width} / ${height}`, background, fontFamily: MONO_STACK, ...style }}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onClick={() => {
        // No hover on touch screens, so a tap toggles the render there.
        if (window.matchMedia("(hover: none)").matches) setActive((value) => !value)
      }}
    >
      <img
        src={src}
        alt={alt}
        draggable={false}
        className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ease-out"
        style={{ opacity: showAscii ? 0 : 1 }}
      />
      <pre
        aria-hidden="true"
        className="absolute inset-0 m-0 select-none transition-opacity duration-500 ease-out"
        style={{
          fontFamily: "inherit",
          fontSize: fontSize || 1,
          lineHeight: 1,
          letterSpacing: 0,
          whiteSpace: "pre",
          color,
          opacity: showAscii ? 1 : 0,
        }}
      >
        {text}
      </pre>
    </div>
  )
}
