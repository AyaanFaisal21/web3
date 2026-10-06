import * as THREE from 'three'

/** A braided cable or coolant tube: a smooth curve through the given points, swept as a tube. */
export function tube(points: [number, number, number][], radius: number) {
  const curve = new THREE.CatmullRomCurve3(
    points.map((p) => new THREE.Vector3(...p)),
    false,
    'centripetal',
  )
  return new THREE.TubeGeometry(curve, 96, radius, 14, false)
}
