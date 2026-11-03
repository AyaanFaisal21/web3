# Ayaan Faisal, portfolio

A portfolio told through a gaming PC. The site is one screen: a running build seen through its glass side panel, with the name lit on the graphics card and the links as buttons down the front. The PC is the navigation. Click a part, or a link in the header, and the camera flies in while the part opens:

| Chapter    | Part        | What happens                                                                                                                                       |
| ---------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| About me   | CPU         | The pump block lifts off the CPU and the heat spreader lifts off the die. A second canvas shows the die close up and tours its cores, one entry each. |
| Experience | RAM         | The sticks rise out of their slots, turn to the glass and fan out. The camera visits the DRAM chips that hold the entries, most recent first.          |
| Projects   | GPU         | The card slides out and turns to the glass, the shroud and heatsink lift away, and the camera visits the blocks on the bared die, one project each.  |
| Connect    | Front panel | The buttons on the front pillar. The power button copies the email; the others open GitHub, LinkedIn and the resume.                                 |

Every part is built from primitives in React Three Fiber. There are no model files, so each part can be animated, lit and opened.

## Stack

Next.js 15 (App Router), React 19, three.js through `@react-three/fiber`, `@react-three/drei` and `@react-three/postprocessing`, Tailwind CSS.

## Run it

```sh
pnpm install
pnpm dev
```

Then open <http://localhost:3000>.

## Where things are

- `lib/journey.ts`: the chapter list. The header and the camera read it.
- `lib/content/about.ts`, `experience.ts`, `projects.ts`, `links.ts`: the content. Edit these; nothing else changes.
- `components/scene/state.ts`: the chapter on screen, how far each chapter has opened, and the entry in focus. The DOM subscribes to it; the frame loops read it.
- `components/scene/programs.ts`: each chapter's program, from its drive to the part poses and the camera stop for the entry in focus.
- `components/scene/CameraRig.tsx` and `waypoints.ts`: where the camera sits for each chapter, and how it gets there.
- `components/scene/Callouts.tsx`: the labelled boxes with leader lines to the parts and the buttons.
- `components/scene/pc/layout.ts`: every dimension of the PC, in metres.
- `components/scene/pc/`: the parts, assembled in `PC.tsx`. `materials.ts` holds the shared materials and the glow colour.
- `components/scene/die/`: the second canvas with the die close-up for About.
- `components/scene/Scene.tsx`: canvas, lights, environment and bloom.
- `components/overlay/`: the HTML layer. `Terminal.tsx` renders every text box as a shell session; `ChapterCopy.tsx` builds the lines for each chapter.
