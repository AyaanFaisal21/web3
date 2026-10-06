import * as THREE from 'three'

/** Brand palette: the warm gold of the web2 hero type, plus the white it bleeds into. */
export const GOLD = '#ffb866'
export const GOLD_SOFT = '#ffd199'
export const WARM_WHITE = '#fff1dc'

/**
 * Shared, module-level materials. Creating them once keeps draw calls batched by material
 * and avoids re-allocating GPU programs on every React render.
 */
export const MAT = {
  caseMetal: new THREE.MeshStandardMaterial({ color: '#15171b', metalness: 0.85, roughness: 0.42 }),
  caseInner: new THREE.MeshStandardMaterial({ color: '#0e1013', metalness: 0.6, roughness: 0.62 }),
  aluminum: new THREE.MeshStandardMaterial({ color: '#2b2e34', metalness: 0.95, roughness: 0.32 }),
  plastic: new THREE.MeshStandardMaterial({ color: '#131417', metalness: 0.15, roughness: 0.7 }),
  blade: new THREE.MeshStandardMaterial({
    color: '#30343b',
    metalness: 0.2,
    roughness: 0.55,
    transparent: true,
    opacity: 0.92,
  }),
  heatsink: new THREE.MeshStandardMaterial({ color: '#272a30', metalness: 0.75, roughness: 0.5 }),
  darkMetal: new THREE.MeshStandardMaterial({ color: '#1b1d22', metalness: 0.9, roughness: 0.3 }),
  braided: new THREE.MeshStandardMaterial({ color: '#0e0f12', metalness: 0.2, roughness: 0.85 }),
  pcbSlot: new THREE.MeshStandardMaterial({ color: '#0a0b0d', metalness: 0.1, roughness: 0.8 }),
  glass: new THREE.MeshPhysicalMaterial({
    color: '#0a0c10',
    transparent: true,
    opacity: 0.16,
    roughness: 0.03,
    metalness: 0,
    clearcoat: 1,
    clearcoatRoughness: 0.05,
    envMapIntensity: 1.4,
    side: THREE.DoubleSide,
    depthWrite: false,
  }),
}

/** A self-lit surface. `toneMapped: false` lets its colour exceed 1.0 so bloom catches it. */
export function emissive(color: string, intensity: number) {
  return new THREE.MeshStandardMaterial({
    color,
    emissive: color,
    emissiveIntensity: intensity,
    toneMapped: false,
  })
}
