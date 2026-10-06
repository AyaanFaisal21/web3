'use client'

import { Case } from './Case'
import { Motherboard } from './Motherboard'
import { Cooling } from './Cooling'
import { Ram } from './Ram'
import { Gpu } from './Gpu'
import { Cables } from './Cables'
import { Fan } from './Fan'
import { BOTTOM_FANS_X, BOTTOM_FAN_Y, CASE, CPU, FRONT_IO, REAR_FAN, TOP_FANS_X, TOP_FAN_Y } from './layout'
import { GOLD, GOLD_SOFT } from './materials'

export function PC({ nameFont }: { nameFont: string }) {
  return (
    <group>
      <Case />
      <Motherboard />
      <Cooling />
      <Ram />
      <Gpu fontFamily={nameFont} />
      <Cables />

      {/* radiator fans blow up through the top; the viewer sees their undersides */}
      {TOP_FANS_X.map((x, i) => (
        <Fan
          key={`top${i}`}
          position={[x, TOP_FAN_Y, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          strips={['py']}
          speed={8 + i * 0.7}
          color={GOLD}
        />
      ))}
      {/* floor intake fans, faces up */}
      {BOTTOM_FANS_X.map((x, i) => (
        <Fan
          key={`bottom${i}`}
          position={[x, BOTTOM_FAN_Y, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          strips={['ny']}
          speed={7.5 + i * 0.6}
          color={GOLD_SOFT}
        />
      ))}
      {/* rear exhaust */}
      <Fan
        position={[REAR_FAN.x, REAR_FAN.y, REAR_FAN.z]}
        rotation={[0, Math.PI / 2, 0]}
        strips={['nx']}
        ringIntensity={1.3}
        speed={9.5}
        color={GOLD}
      />

      {/* the lit parts light the interior: warm, short-range, kept clear of the panels */}
      <pointLight position={[-0.015, 0.11, 0.03]} color={GOLD} intensity={0.32} distance={0.55} decay={2} />
      <pointLight position={[0, -0.14, 0.03]} color={GOLD_SOFT} intensity={0.26} distance={0.55} decay={2} />
      <pointLight position={[CPU.x, CPU.y, -0.03]} color="#ffdcb0" intensity={0.18} distance={0.4} decay={2} />
      <pointLight position={[-0.03, -0.03, 0.05]} color="#ffe6c8" intensity={0.22} distance={0.5} decay={2} />
      {/* a soft light outside the front, so the brushed pillar and its IO read in the Connect chapter */}
      <pointLight position={[CASE.w / 2 + 0.22, FRONT_IO.y + 0.12, 0.26]} color="#ffd6ae" intensity={0.5} distance={0.9} decay={2} />
    </group>
  )
}
