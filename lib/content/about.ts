/**
 * The About chapter: one entry per CPU core. The tour visits them in this order, the pump
 * block's LCD shows each entry's photo, and the core tiles on both dies light up to match.
 * Edit copy here; nothing else needs to change.
 */
export type CoreEntry = {
  key: string
  title: string
  body: string
  /** Square photo under public/, shown on the cooler's round LCD while this core is in focus. */
  photo: string
}

export const CORES: CoreEntry[] = [
  {
    key: 'builder',
    title: 'Builder',
    body: 'I started with Legos. I liked how scattered, incomplete pieces could become something whole — software gave me that same feeling, just without a messy floor to clean up.',
    photo: '/images/ayaan/lcd/ramen.jpg',
  },
  {
    key: 'developer',
    title: 'Developer',
    body: "CS, Data Science and Math at the Rutgers University Honors College, focused on how intelligent systems should be designed and used: how they manage memory, make decisions under uncertainty, stay accurate at scale, and work with modern tools in ways they couldn't before.",
    photo: '/images/ayaan/lcd/headshot.jpg',
  },
  {
    key: 'visionary',
    title: 'Visionary',
    body: "I'm drawn to the abstractions that make hard things elegant: vector databases that turn meaning into math, embedding spaces where similarity is geometry, memory architectures that let a system remember selectively.",
    photo: '/images/ayaan/lcd/hallway.jpg',
  },
  {
    key: 'collaborator',
    title: 'Collaborator',
    body: "I've worked across the stack — training and deploying ML models in PyTorch and ONNX, building concurrent real-time backends with WebSockets and AsyncIO, shipping frontends like this one — and almost always with other people, from hackathon teams to a founding board.",
    photo: '/images/ayaan/lcd/team.jpg',
  },
  {
    key: 'empath',
    title: 'Empath',
    body: "No amount of focus on the system matters if the person using it doesn't benefit. I track how it feels to use something, and how much I can really help the people I'm building for — that doesn't just drive my work, it defines it.",
    photo: '/images/ayaan/lcd/presenting.jpg',
  },
  {
    key: 'idealist',
    title: 'Idealist',
    body: "I'm drawn to problems where the right answer isn't obvious — where prudent judgment, good architecture and a genuine understanding of human decisions all have to show up at once. Those are the problems worth building for.",
    photo: '/images/ayaan/lcd/nyc.jpg',
  },
  {
    key: 'tenacity',
    title: 'Tenacity',
    body: '"Somewhere out there, someone is better than me — that means I can definitely still improve." League of Legends taught me that. It\'s why I started learning Arabic when it looked daunting, why I started training when being in shape felt impossibly far away, and why I keep aiming at goals that look far off.',
    photo: '/images/ayaan/lcd/mosque.jpg',
  },
  {
    key: 'designer',
    title: 'Designer',
    body: "We're all more than our work. Through mine and beyond it, you'll find a highly adaptable, pragmatic idealist — ambitious, realistic and relentless. I think those traits go well together.",
    photo: '/images/ayaan/lcd/desert.jpg',
  },
]

export const LCD_PHOTOS = CORES.map((c) => c.photo)
