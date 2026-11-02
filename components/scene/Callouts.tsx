'use client'

import { useEffect, useId, useRef, useSyncExternalStore } from 'react'
import { useFrame } from '@react-three/fiber'
import { Line } from '@react-three/drei'
import * as THREE from 'three'
import type { ChapterId } from '@/lib/journey'
import { BOARD_FACE_Z, COOLER, CPU, GPU_BOX, RAM, RAM_CENTER_X } from './pc/layout'
import { sceneState } from './state'

export type Vec = [number, number, number]

type LineObject = THREE.Object3D & { material: THREE.Material }

/**
 * A callout is a leader line in the scene and a box in the DOM. The boxes are plain nodes laid
 * over the canvas, not drei's Html: that opens a React root per box, and under React 19 strict
 * mode the root is unmounted in a race that can leave a box empty. Each Callout registers here,
 * CalloutBoxes renders the list beside the canvas, and CalloutProjector moves every box to its
 * tip and fades it with its line once the camera rig has run for the frame.
 */
type Entry = {
  id: string
  label: string
  tip: Vec
  chapters: ChapterId[]
  line: LineObject | null
  node: HTMLDivElement | null
  fade: number
}

const entries = new Map<string, Entry>()
let snapshot: Entry[] = []
const listeners = new Set<() => void>()

function publish() {
  snapshot = [...entries.values()]
  listeners.forEach((fn) => fn())
}
function subscribe(fn: () => void) {
  listeners.add(fn)
  return () => {
    listeners.delete(fn)
  }
}
const getSnapshot = () => snapshot

/**
 * A small box with a label, tied by a leader line to a point on the hardware. The box is not
 * clickable; the part it points to is. It shows in the given chapters and fades otherwise.
 */
export function Callout({ anchor, tip, label, chapters }: { anchor: Vec; tip: Vec; label: string; chapters: ChapterId[] }) {
  const id = useId()
  const line = useRef<LineObject | null>(null)

  useEffect(() => {
    const entry = entries.get(id) ?? { id, label, tip, chapters, line: null, node: null, fade: 1 }
    Object.assign(entry, { label, tip, chapters, line: line.current })
    entries.set(id, entry)
    publish()
  }, [id, label, tip, chapters])

  useEffect(
    () => () => {
      entries.delete(id)
      publish()
    },
    [id],
  )

  return (
    <Line
      ref={(el) => {
        line.current = el as unknown as LineObject | null
      }}
      points={[anchor, tip]}
      color="#d9b77a"
      lineWidth={1}
      transparent
      opacity={0.85}
      depthTest={false}
      renderOrder={10}
    />
  )
}

const v = new THREE.Vector3()

/** Mount it inside the Canvas after the camera rig, so it projects with this frame's camera. */
export function CalloutProjector() {
  useFrame(({ camera, size }, dt) => {
    camera.updateMatrixWorld()
    const blend = Math.min(1, dt * 6)
    for (const entry of entries.values()) {
      const target = entry.chapters.includes(sceneState.chapter) ? 1 : 0
      entry.fade += (target - entry.fade) * blend
      const o = entry.fade
      const shown = o > 0.01
      if (entry.line) {
        entry.line.material.opacity = o * 0.85
        entry.line.visible = shown
      }
      if (entry.node) {
        v.set(entry.tip[0], entry.tip[1], entry.tip[2]).project(camera)
        const x = ((v.x + 1) / 2) * size.width
        const y = ((1 - v.y) / 2) * size.height
        entry.node.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0) translate(-50%,-50%)`
        entry.node.style.opacity = o.toFixed(3)
        entry.node.style.visibility = shown && v.z < 1 ? 'visible' : 'hidden'
      }
    }
  })
  return null
}

/** The DOM side of the callouts: one box per registered Callout, laid over the canvas. */
export function CalloutBoxes() {
  const list = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
  return (
    <div className="callout-layer">
      {list.map((entry) => (
        <div
          key={entry.id}
          ref={(node) => {
            entry.node = node
          }}
          className="callout"
          style={{ visibility: 'hidden' }}
        >
          {entry.label}
        </div>
      ))}
    </div>
  )
}

/** The chapter names, each beside the part that holds its content. Home view only. */
const CHAPTER_CALLOUTS: { id: string; label: string; anchor: Vec; tip: Vec }[] = [
  { id: 'about', label: 'About me', anchor: [CPU.x, CPU.y, COOLER.faceZ], tip: [-0.31, 0.2, 0.1] },
  { id: 'experience', label: 'Experience', anchor: [RAM_CENTER_X, RAM.y + 0.04, BOARD_FACE_Z + RAM.height / 2], tip: [-0.02, 0.31, 0.02] },
  { id: 'projects', label: 'Projects', anchor: [GPU_BOX.cx - 0.09, GPU_BOX.cy, GPU_BOX.faceZ], tip: [-0.31, -0.17, 0.1] },
]

export function ChapterCallouts() {
  return (
    <group>
      {CHAPTER_CALLOUTS.map((c) => (
        <Callout key={c.id} anchor={c.anchor} tip={c.tip} label={c.label} chapters={['hero']} />
      ))}
    </group>
  )
}
