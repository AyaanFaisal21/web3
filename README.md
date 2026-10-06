# Ayaan Faisal — portfolio

A portfolio told through a gaming PC. The site opens on a straight-on view through the glass
side panel of a running build: fans turning, RGB memory pulsing, the name lit on the side of
the graphics card. Scrolling flies the camera into the components, one chapter per part:

| Chapter    | What happens                                                                                   |
| ---------- | ---------------------------------------------------------------------------------------------- |
| About me   | the cooler lifts off the CPU, the heat spreader lifts off the die, and a close-up view tours the eight cores — one descriptor each — while the pump block's LCD cycles photos |
| Experience | the four RAM sticks rise out of their slots, turn to the glass and fan out; the front heat spreaders slide off and the camera visits the six DRAM chips that hold entries (one stick per era, most recent first); then the sticks reseat, the lid closes and the block drops |
| Projects   | the GPU comes apart: agentic/full-stack projects in the SMs, data/ML in the Tensor Cores, low-level in the memory controllers (not built yet) |
| Connect    | the front-panel IO                                                                              |

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
- `lib/content/about.ts`, `lib/content/experience.ts` — the chapter content: eight cores, six experience entries with their stick/chip.
- `components/scene/programs.ts` — each chapter's scroll program: what pulls apart when, which core/chip is in focus, where the camera stops.
- `components/scene/pc/ramExplode.ts` — the stick poses shared by the RAM model and the camera.
- `components/scene/die/` — the second canvas: the die close-up on one side of the screen during About.
- `components/scene/pc/` — the parts: `Case`, `Motherboard`, `Cpu`, `Cooling`, `Ram`, `Gpu`,
  `Cables`, `Fan`, assembled in `PC.tsx`.
- `components/scene/CameraRig.tsx` + `waypoints.ts` — scroll → camera.
- `components/scene/Scene.tsx` — canvas, lighting, environment, bloom.
- `components/overlay/Overlay.tsx` — the HTML layer: header, chapter copy, social links.
- `components/ui/` — shadcn primitives kept from the starter template for later forms.
