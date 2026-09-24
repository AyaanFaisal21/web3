"use client"

import HeroSection from "../hero-section"
import { Timeline } from "@/components/ui/timeline"
import "./globals.css"
import { StaggerTestimonials } from "@/components/ui/stagger-testimonials"
import { motion } from "framer-motion"
import SmoothScrollHero from "@/components/ui/smooth-scroll-hero"
import { AboutSection } from "@/components/about-section"

export default function Page() {
  // Work entries from the experience reference: dates, stack, and a short description each.
  const timelineEntries = [
    {
      id: 1,
      title: "Software Engineering Intern",
      subtitle: "Universal Selfcare",
      dates: "Sep 2026 – Present",
      stack: ["Go", "PostgreSQL", "pgvector", "GCP", "REST", "TF-IDF", "MMR"],
      description:
        "Healthcare startup building drug-free mental health care plans. Built the provider-facing analyst endpoint that turns a dormant symptom matcher into one ranked report per patient, and own the TF-IDF + pgvector recommendation service.",
      layout: "left" as const,
    },
    {
      id: 2,
      title: "Founding Software Engineer",
      subtitle: "Shortlist",
      dates: "Jul 2026 – Present",
      stack: ["Python", "React", "TypeScript", "PostgreSQL", "Docker", "Caddy", "AWS EC2", "AWS SES", "GitHub Actions"],
      description:
        "Student job board at short-list.app with 102+ unique daily users. Built the REST API, cut cloud database costs 97% with an in-memory listing cache, capped LLM spend with a daily budget, and shipped a CI deploy over SSH.",
      layout: "right" as const,
    },
    {
      id: 3,
      title: "Open Source Contributor",
      subtitle: "PyTorch, NVIDIA CUTLASS, Sentry, Vercel AI SDK, Supabase",
      dates: "May 2026 – Present",
      stack: ["CUDA C++", "Python", "TypeScript", "Rust", "compute-sanitizer"],
      description:
        "Fixed out-of-bounds and integer-overflow paths in PyTorch and CUTLASS CUDA code, removed a duplicate JSON serialization on Sentry's AI tracing path (33.3% peak memory), and stopped Supabase's edge runtime from replacing the system TLS store.",
      layout: "left" as const,
    },
    {
      id: 4,
      title: "Independent Researcher",
      subtitle: "GPU systems, self-directed",
      dates: "Jun 2026 – Aug 2026",
      stack: ["CUDA", "C++", "Python", "Ampere (A100, 4x A10)", "Nsight", "compute-sanitizer"],
      description:
        "Rebuilt ExpertPlex's tile-level preemption for MoE serving on Ampere with a device-scope atomic flag in place of Hopper-only clusters and TMA multicast. Cut an urgent task's wait from 957us to 17.4us, reproduced across five GPUs on rented hardware.",
      layout: "right" as const,
    },
    {
      id: 5,
      title: "Founding Engineer",
      subtitle: "Privet",
      dates: "Mar 2026 – Jun 2026",
      stack: ["Rust", "Hyper", "Tokio", "ONNX Runtime", "INT8 quantization", "SQLCipher", "HMAC-SHA256"],
      description:
        "Privacy startup redacting sensitive data from LLM traffic before it leaves the machine. Built the concurrent Rust proxy, quantized the NER model to INT8 (266MB to 67MB, P95 7.08ms to 2.47ms), and kept a hash-chained, HMAC-signed audit log.",
      layout: "left" as const,
    },
    {
      id: 6,
      title: "Freelance Frontend Engineer",
      subtitle: "Remote",
      dates: "Jul 2025 – Feb 2026",
      stack: ["React", "TypeScript", "WebGL", "Three.js", "Chrome DevTools"],
      description:
        "Interactive 3D web applications for paying clients. Cut Three.js tick self-time 722ms to 255ms by tying rendering to scroll progress, drove layout shift from 1.49 to 0.00, and cut asset payload 6.7MB to 716KB.",
      layout: "right" as const,
    },
    {
      id: 7,
      title: "Learning Assistant, Calculus II",
      subtitle: "Rutgers University",
      dates: "Sep 2026 – Present",
      stack: ["Teaching", "Pedagogy"],
      description:
        "Lead two weekly sections of 25+ students and cover peers' sections on short notice. Meet with four instructors and TAs to review sections and incorporate feedback.",
      layout: "left" as const,
    },
    {
      id: 8,
      title: "Founding Board Member, Head of Projects",
      subtitle: "Muslim Tech Collaborative, Rutgers",
      dates: "Dec 2025 – Present",
      stack: ["Event strategy", "Outreach", "Cross-team coordination"],
      description:
        "Joined the founding team; Head of Projects since Jul 2026. Secured $4,000+ in hackathon funding through professional outreach and run programs moving students from interest in tech to hands-on work with industry mentors.",
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

      {/* Contact Section — smooth scroll reveal with the form overlay */}
      <section id="contact" className="relative">
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
