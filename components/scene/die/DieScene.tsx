'use client'

import { useEffect, useRef, useSyncExternalStore } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { Bloom, EffectComposer, ToneMapping } from '@react-three/postprocessing'
import { ToneMappingMode } from 'postprocessing'
import type { ChapterId } from '@/lib/journey'
import { DieModel } from './DieModel'
import { activeChapter } from '../state'

/** Asks for a frame when About opens; DieModel keeps them coming until the view has faded out. */
function Wake() {
  const chapter = useSyncExternalStore(activeChapter.subscribe, activeChapter.get, () => 'hero' as ChapterId)
  const invalidate = useThree((s) => s.invalidate)
  useEffect(() => {
    if (chapter === 'about') invalidate()
  }, [chapter, invalidate])
  return null
}

/**
 * The die close-up: a second, small canvas on one side of the screen during the About
 * chapter. Its own context keeps the millimetre-scale die independent of the PC scene's
 * camera, and lets it fade in and out as a whole. Opacity is driven per frame by DieModel.
 * It renders on demand, only while About is open or the view is still fading, so the hidden
 * canvas costs nothing the rest of the time.
 */
export default function DieScene() {
  const wrap = useRef<HTMLDivElement>(null)
  return (
    <div ref={wrap} className="die-view" aria-hidden>
      <Canvas frameloop="demand" dpr={[1, 1.5]} camera={{ fov: 32, near: 0.1, far: 200, position: [0, 14, 11] }} gl={{ antialias: false, powerPreference: 'high-performance', stencil: false }}>
        <color attach="background" args={['#000000']} />
        <Wake />
        <DieModel wrap={wrap} />
        <EffectComposer multisampling={4}>
          <Bloom mipmapBlur intensity={0.9} luminanceThreshold={1} luminanceSmoothing={0.3} radius={0.6} />
          <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
        </EffectComposer>
      </Canvas>
    </div>
  )
}
