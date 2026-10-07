# Ayaan Faisal — portfolio

A portfolio told through a gaming PC. The site opens on a straight-on view through the glass
side panel of a running build: fans turning, RGB memory pulsing, the name lit on the side of
the graphics card. Scrolling flies the camera into the components, one chapter per part:

| Chapter    | What happens                                                                                   |
| ---------- | ---------------------------------------------------------------------------------------------- |
| About me   | the cooler lifts off the CPU, the heat spreader lifts off the die, and a close-up view tours the eight cores — one descriptor each — while the pump block's LCD cycles photos |
| Experience | the four RAM sticks rise out of their slots, turn to the glass and fan out; the front heat spreaders slide off and the camera visits the six DRAM chips that hold entries (one stick per era, most recent first); then the sticks reseat, the lid closes and the block drops |
| Projects   | the card slides out and turns to the glass, the shroud and heatsink lift away, and the camera visits fourteen blocks on the bared die: kernel and systems work in the SMs, models in the Tensor Cores, products in the memory controllers and the GDDR packages they feed |
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
- `lib/content/about.ts`, `experience.ts`, `projects.ts` — the chapter content: eight cores, ten roles with their stick/chip, fourteen projects with their die block. Recovered from the previous site's history.
- `components/overlay/Terminal.tsx` — every text box is a shell session: title bar, typed command, output revealed line by line.
- `components/scene/programs.ts` — each chapter's scroll program: what pulls apart when, which core/chip is in focus, where the camera stops.
- `components/scene/pc/ramExplode.ts`, `gpuLayout.ts` — the stick poses and the card/die layout, shared by the models and the camera.
- `components/scene/die/` — the second canvas: the die close-up on one side of the screen during About.
- `components/scene/pc/` — the parts: `Case`, `Motherboard`, `Cpu`, `Cooling`, `Ram`, `Gpu`,
  `Cables`, `Fan`, assembled in `PC.tsx`.
- `components/scene/CameraRig.tsx` + `waypoints.ts` — scroll → camera.
- `components/scene/Scene.tsx` — canvas, lighting, environment, bloom.
- `components/overlay/Overlay.tsx` — the HTML layer: header, chapter copy, social links.
- `components/ui/` — shadcn primitives kept from the starter template for later forms.
