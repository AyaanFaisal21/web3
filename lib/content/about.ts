/**
 * The About chapter: one entry per CPU core. The tour visits them in this order, the pump
 * block's LCD shows each entry's photo, and the core tiles on both dies light up to match.
 * Copy is cut from the about section of the previous site. Edit here; nothing else changes.
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
    body: "I've always built things: Legos, technical Minecraft mods, Discord bots for friends, then web apps for paying clients. Two years ago I also had a quiet list of things that were for other people: C++, Linux, systems programming, hardware. I turned out to be wrong about every item, and finding that out became the whole plan.",
    photo: '/images/ayaan/lcd/ramen.jpg',
  },
  {
    key: 'developer',
    title: 'Developer',
    body: 'So I kept going one layer beneath where most people stop. Today my work sits where performance and correctness meet AI: building agentic services, making models run faster at whatever layer the bottleneck actually lives, and asking whether the tests and correctness checks built around them hold.',
    photo: '/images/ayaan/lcd/headshot.jpg',
  },
  {
    key: 'visionary',
    title: 'Visionary',
    body: "Every abstraction is somebody else's decision about what I don't get to touch, and the lower I go, the more of the answer I get to hold myself. That's why most of applied CS pulls at me, from GPU scheduling and backends to ML and security, including the corners where I don't have the most experience yet.",
    photo: '/images/ayaan/lcd/hallway.jpg',
  },
  {
    key: 'collaborator',
    title: 'Collaborator',
    body: "A year ago I joined the founding team of Rutgers' Muslim Tech Collaborative on a whim, and being surrounded by people who built things and expected me to changed my whole trajectory. I help run a hackathon and an accelerator for student founders, and I go to hackathons and conferences more for the rooms than the outcomes.",
    photo: '/images/ayaan/lcd/team.jpg',
  },
  {
    key: 'empath',
    title: 'Empath',
    body: 'The other half is people. I like being early on things, and I especially like being around people who are further along than me. It shapes how I build, too: understanding the people I am building for is the part of engineering I refuse to skip.',
    photo: '/images/ayaan/lcd/presenting.jpg',
  },
  {
    key: 'idealist',
    title: 'Idealist',
    body: "Nearly everything I've built, I built without permission. This summer I rented GPUs and measured how a scheduler behaves under contention on real silicon, clocks locked because I didn't trust the reported numbers. No lab, no supervisor, two papers. If the opportunity isn't there, I'd rather make it than wait for it.",
    photo: '/images/ayaan/lcd/nyc.jpg',
  },
  {
    key: 'tenacity',
    title: 'Tenacity',
    body: '"Somewhere out there, someone is better than me — that means I can definitely still improve." League taught me that. Knowing someone who started where I started has already done it is why I began learning Arabic, why I started working out, and why I go toward the thing I don\'t understand and don\'t accept a result until I\'ve tried to break it.',
    photo: '/images/ayaan/lcd/mosque.jpg',
  },
  {
    key: 'designer',
    title: 'Designer',
    body: "I joined a startup as its first engineer, and I ship a job board that students use every day. I've shipped plenty of frontend too; technically it's a bit boring, but turning ambiguous wants into design insights never is.",
    photo: '/images/ayaan/lcd/desert.jpg',
  },
]

export const LCD_PHOTOS = CORES.map((c) => c.photo)
