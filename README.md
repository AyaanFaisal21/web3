# Ayaan Faisal — portfolio

A portfolio told through a gaming PC. The site opens on a straight-on view through the glass
side panel of a running build: fans turning, RGB memory pulsing, the name lit on the side of
the graphics card. Scrolling flies the camera into the components, one chapter per part:

| Chapter    | Where the camera goes                                  |
| ---------- | ------------------------------------------------------ |
| About me   | past the CPU cooler, into the CPU                      |
| Projects   | the RAM sticks, down to individual memory blocks       |
| Experience | the GPU: technical work in the SMs, community work in the cache |
| Connect    | the front-panel IO                                     |

The whole PC is built procedurally from primitives in React Three Fiber (no model files),
so every part can be animated, lit and later opened up.

## Stack

Next.js 15 (App Router) · React 19 · three.js via `@react-three/fiber`, `@react-three/drei`
and `@react-three/postprocessing` · Tailwind CSS.

## Running it

This machine's PowerShell blocks the `npm`/`pnpm` script shims, so go through corepack:

```powershell
corepack pnpm install
corepack pnpm dev
```

Then open <http://localhost:3000>.

## Where things live

- `lib/journey.ts` — the chapter table: ids, labels and scroll heights. Both the HTML sections
  and the camera derive from it.
- `components/scene/pc/layout.ts` — every dimension of the PC, in metres. Camera waypoints
  and parts all read from here.
- `components/scene/pc/` — the parts: `Case`, `Motherboard`, `Cooling`, `Ram`, `Gpu`,
  `Cables`, `Fan`, assembled in `PC.tsx`.
- `components/scene/CameraRig.tsx` + `waypoints.ts` — scroll → camera.
- `components/scene/Scene.tsx` — canvas, lighting, environment, bloom.
- `components/overlay/Overlay.tsx` — the HTML layer: header, chapter copy, social links.
- `components/ui/` — shadcn primitives kept from the starter template for later forms.
