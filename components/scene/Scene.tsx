'use client'

import { Suspense, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import { Bloom, EffectComposer, ToneMapping, Vignette } from '@react-three/postprocessing'
import { ToneMappingMode } from 'postprocessing'
import { PC } from './pc/PC'
import { CameraRig } from './CameraRig'
import { bindSceneState } from './state'

export default function Scene({ nameFont }: { nameFont: string }) {
  useEffect(() => bindSceneState(), [])

  return (
    <div className="fixed inset-0 z-0" aria-hidden>
      <Canvas
        dpr={[1, 1.75]}
        camera={{ fov: 46, near: 0.02, far: 12, position: [0, 0, 0.9] }}
        gl={{ antialias: false, powerPreference: 'high-performance', stencil: false }}
      >
        <color attach="background" args={['#000000']} />

        <Suspense fallback={null}>
          <PC nameFont={nameFont} />
          {/*
            Procedural studio environment: a soft overhead panel and two side strips give the
            glass and brushed metal something to reflect, with no HDR file to download.
          */}
          <Environment resolution={256} frames={1}>
            <Lightformer form="rect" intensity={1.6} color="#ffffff" scale={[4, 1.5, 1]} position={[0, 3, 2]} target={[0, 0, 0]} />
            <Lightformer form="rect" intensity={0.7} color="#ffe2bd" scale={[0.4, 4, 1]} position={[3.5, 0.5, 1.5]} target={[0, 0, 0]} />
            <Lightformer form="rect" intensity={0.45} color="#c9dcff" scale={[0.4, 4, 1]} position={[-3.5, 0.5, 1.5]} target={[0, 0, 0]} />
            <Lightformer form="rect" intensity={0.25} color="#ffffff" scale={[4, 4, 1]} position={[0, 0, -4]} target={[0, 0, 0]} />
          </Environment>
        </Suspense>

        <directionalLight position={[0.5, 0.8, 1.6]} intensity={1.3} color="#e3e9f2" />
        <ambientLight intensity={0.12} />

        <CameraRig />

        <EffectComposer multisampling={4}>
          <Bloom mipmapBlur intensity={0.8} luminanceThreshold={1} luminanceSmoothing={0.3} radius={0.6} />
          <Vignette offset={0.2} darkness={0.6} />
          <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
        </EffectComposer>
      </Canvas>
    </div>
  )
}
