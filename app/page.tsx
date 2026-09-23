"use client"

import HeroSection from "../hero-section"
import { Timeline } from "@/components/ui/timeline"
import "./globals.css"
import { StaggerTestimonials } from "@/components/ui/stagger-testimonials"
import { motion } from "framer-motion"
import SmoothScrollHero from "@/components/ui/smooth-scroll-hero"
import { AboutSection } from "@/components/about-section"

export default function Page() {
  // Brief work entries, carried over from the ayaan-faisal.com experience list.
  const timelineEntries = [
    {
      id: 1,
      title: "Lead Software Engineer",
      subtitle: "Privet",
      dates: "Mar 2026 – Present",
      description:
        "A local privacy layer for professionals who use LLMs with sensitive data. Built the Rust/Tokio HTTPS proxy and an on-device sanitization pipeline that runs in under 150ms.",
      layout: "left" as const,
    },
    {
      id: 2,
      title: "Learning Assistant, Calculus II",
      subtitle: "Rutgers University New Brunswick",
      dates: "Apr 2026 – Apr 2027",
      description:
        "Lead collaborative problem-solving sessions and turn abstract calculus into intuitive frameworks, aligned with course pacing.",
      layout: "right" as const,
    },
    {
      id: 3,
      title: "Executive Board Member",
      subtitle: "Muslim Tech Collaborative, Rutgers",
      dates: "Dec 2025 – Present",
      description:
        "Founding-year board. Co-ran a hackathon with $4,000+ in prizes and a networking event that connected 70 students with 10 professionals.",
      layout: "left" as const,
    },
    {
      id: 4,
      title: "Frontend Software Engineer",
      subtitle: "Freelance",
      dates: "Jul 2025 – Feb 2026",
      description:
        "Premium web experiences scoring over 90 on Lighthouse. Cut CPU render load by 65% and layout shift by 99% with compositor-only animation.",
      layout: "right" as const,
    },
    {
      id: 5,
      title: "Officer & Fundraiser Lead",
      subtitle: "Muslim Student Association, WWP-HSN",
      dates: "Sept 2023 – June 2024",
      description:
        "Turned a rejected fundraiser into an approved one, then engaged 100+ donors and raised $1,000 for humanitarian aid.",
      layout: "left" as const,
    },
    {
      id: 6,
      title: "Varsity Team Captain",
      subtitle: "Esports Club (League of Legends), WWP-HSN",
      dates: "Oct 2022 – June 2024",
      description:
        "Primary shot-caller for a Bronze-to-Diamond roster. Third place in the Garden State Esports League of Legends Championship, Fall 2022.",
      layout: "right" as const,
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <HeroSection />

      {/* About Section */}
      <AboutSection />

      {/* Timeline Section */}
      <section id="experience" className="relative py-20 bg-white">
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 bg-grid-subtle opacity-30 pointer-events-none" />

        <div className="relative z-10">
          <div className="container mx-auto px-6 mb-16">
            <div className="text-center">
              <h2 className="text-4xl md:text-6xl font-black tracking-wider mb-6 text-gray-900">EXPERIENCE</h2>
              <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
                {"Where I've worked and what I've led, kept brief on purpose."}
              </p>
            </div>
          </div>

          <Timeline entries={timelineEntries} />
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="relative py-20 bg-white">
        {/* Subtle Grid Pattern */}
        <div className="absolute inset-0 bg-grid-subtle opacity-30 pointer-events-none" />

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-6xl font-black tracking-wider text-gray-900 mb-6">
              See what our{" "}
              <span className="bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">RUNNERS</span>{" "}
              say.
            </h2>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-12">
              Real stories from real runners who found their stride with Wadada Run Club.
            </p>
          </motion.div>

          <StaggerTestimonials />
        </div>
      </section>

      {/* Smooth Scroll Hero with CTA Overlay */}
      <section id="join" className="relative">
        <SmoothScrollHero
          scrollHeight={2500}
          desktopImage="/ContactMeBackground.webp"
          mobileImage="/ContactMeBackground.webp"
          initialClipPercentage={30}
          finalClipPercentage={70}
        />
      </section>
    </div>
  )
}
