"use client"

import { useScroll, useTransform, motion } from "framer-motion"
import { useRef } from "react"
import { cn } from "@/lib/utils"

export interface TimelineEntry {
  id: number
  /** Role or headline. */
  title: string
  /** Organization. */
  subtitle?: string
  dates?: string
  description: string
  layout: "left" | "right"
}

interface TimelineProps {
  entries: TimelineEntry[]
  className?: string
}

export function Timeline({ entries, className }: TimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {/* Central Timeline Line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gray-300 transform -translate-x-1/2 hidden md:block" />

      {entries.map((entry, index) => (
        <TimelineItem key={entry.id} entry={entry} index={index} scrollProgress={scrollYProgress} />
      ))}
    </div>
  )
}

interface TimelineItemProps {
  entry: TimelineEntry
  index: number
  scrollProgress: any
}

function TimelineItem({ entry }: TimelineItemProps) {
  const itemRef = useRef<HTMLDivElement>(null)
  // Entries are short, so they stay at full strength through most of the viewport and only
  // fade and shrink near its top and bottom edges.
  const { scrollYProgress: itemProgress } = useScroll({
    target: itemRef,
    offset: ["start 92%", "end 8%"],
  })

  const opacity = useTransform(itemProgress, [0, 0.2, 0.8, 1], [0.3, 1, 1, 0.3])
  const scale = useTransform(itemProgress, [0, 0.2, 0.8, 1], [0.8, 1, 1, 0.8])

  const isLeft = entry.layout === "left"

  return (
    <motion.div ref={itemRef} style={{ opacity, scale }} className="relative mb-12 md:mb-16">
      {/* Timeline Dot */}
      <div className="absolute left-1/2 top-1/2 w-4 h-4 bg-gray-900 rounded-full transform -translate-x-1/2 -translate-y-1/2 z-10 hidden md:block" />

      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-16 items-center">
          {/* Dates sit across the line from the entry on wide screens. */}
          {entry.dates && (
            <div
              className={cn("hidden md:block text-sm font-semibold uppercase tracking-widest text-gray-500", {
                "md:order-2 md:text-left": isLeft,
                "md:order-1 md:text-right": !isLeft,
              })}
            >
              {entry.dates}
            </div>
          )}

          {/* Content */}
          <div
            className={cn("relative", {
              "md:order-1 md:text-right": isLeft,
              "md:order-2 md:text-left": !isLeft,
            })}
          >
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className={cn("space-y-2", { "md:ml-auto": isLeft })}
            >
              {entry.dates && (
                <p className="md:hidden text-xs font-semibold uppercase tracking-widest text-gray-500">{entry.dates}</p>
              )}
              <h3 className="text-2xl md:text-3xl font-black tracking-wide text-gray-900">{entry.title}</h3>
              {entry.subtitle && <p className="text-base md:text-lg font-semibold text-gray-600">{entry.subtitle}</p>}
              <p
                className={cn("text-base md:text-lg leading-relaxed text-gray-700 max-w-md", {
                  "md:ml-auto": isLeft,
                })}
              >
                {entry.description}
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
