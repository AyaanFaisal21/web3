/**
 * The About chapter: two entries, one paragraph each. The tour visits them in this order and a
 * core lights up on both dies to match. Edit here; nothing else changes.
 */
export type CoreEntry = {
  key: string
  title: string
  body: string
}

export const CORES: CoreEntry[] = [
  {
    key: 'curious',
    title: 'Curious first',
    body: "As a kid I asked a lot of questions, and the answer I remember best is being told to stop. Nobody was being mean. The person I was asking just didn't know, and “stop asking” was easier to say than “I don't know.” It didn't work on me. I came away convinced that whatever people won't explain is exactly the part worth looking at, and I've been curious first ever since.",
  },
  {
    key: 'one-layer-below',
    title: 'One layer below',
    body: "That followed me into software. I started where everyone starts, Minecraft mods, Discord bots, web apps for people who paid me, and kept noticing the same thing: every abstraction is someone else's decision about what I don't get to touch. So I keep going one layer below where most people stop. Right now that's where performance and correctness meet AI: agentic services, making models run faster at whatever layer is actually the bottleneck, and asking whether the tests around them hold. I'm also building with FPGA boards and exploring robotics as I keep working toward lower and lower abstractions. The lower I go, the more of the answer I get back.",
  },
]
