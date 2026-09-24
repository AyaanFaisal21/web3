"use client"

import { Menu, X } from "lucide-react"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"

// Landing name, rendered the same way as on ayaan-faisal.com: Italiana, per-slide color,
// anchored to the bottom of the viewport, letters blur-fade in one by one.
const HERO_NAME = "AYAAN"
const NAME_FONT_SIZE = "clamp(3.2rem, 29vw, 26rem)"
const NAME_LINE_HEIGHT = 0.78

// Slides rotate on their own; each image crossfades into the next.
const SLIDE_INTERVAL_MS = 6000
const FADE_MS = 1125

// Each slide carries its own name color so "AYAAN" always sits well on the photo behind it.
const slides = [
  {
    // Starting image: the center portrait from the ayaan-faisal.com hero
    image: "/images/ayaan/mainBackground.jpg",
    alt: "Ayaan",
    position: "center 42%",
    nameColor: "#c78347",
  },
  {
    // Ending image: the contact section background from ayaan-faisal.com
    image: "/ContactMeBackground.webp",
    alt: "Ayaan in the desert at sunset",
    position: "center",
    nameColor: "#2f405c",
  },
  {
    image: "/images/landing/landing4.jpg",
    alt: "Ayaan overlooking a floodlit plant at night",
    position: "center",
    nameColor: "#d8d3c8",
  },
  {
    image: "/images/landing/landing3.jpg",
    alt: "Ayaan at the San Francisco waterfront at sunset",
    position: "center 45%",
    nameColor: "#f7ba7f",
  },
]

const navItems = [
  { name: "Home", href: "#hero" },
  { name: "About", href: "#about" },
  { name: "Experience", href: "#experience" },
  { name: "Projects", href: "#projects" },
  { name: "Contact", href: "#contact" },
]

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Advance on a timer. Picking a slide by hand restarts the countdown, and visitors who
  // prefer reduced motion keep whichever slide they are on.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const id = setInterval(() => setCurrentSlide((prev) => (prev + 1) % slides.length), SLIDE_INTERVAL_MS)
    return () => clearInterval(id)
  }, [currentSlide])

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    setIsMenuOpen(false)
  }

  return (
    <div id="hero" className="relative h-screen w-full overflow-hidden bg-black">
      {/* Background Images — every slide is mounted so it is preloaded, only the active one is visible */}
      {slides.map((slide, index) => (
        <div
          key={slide.image}
          role="img"
          aria-label={slide.alt}
          aria-hidden={index !== currentSlide}
          className="absolute inset-0 bg-cover bg-no-repeat transition-opacity ease-in-out"
          style={{
            backgroundImage: `url('${slide.image}')`,
            backgroundPosition: slide.position,
            opacity: index === currentSlide ? 1 : 0,
            transitionDuration: `${FADE_MS}ms`,
          }}
        />
      ))}
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Navigation */}
      <nav className="relative z-20 flex items-center justify-between p-6 md:p-8">
        {/* Logo/Brand */}
        <div className="text-white font-bold text-xl tracking-wider">WADADA</div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => scrollToSection(item.href)}
              className="relative text-white hover:text-gray-300 transition-colors duration-300 font-medium tracking-wide pb-1 group"
            >
              {item.name}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white transition-all duration-300 ease-out group-hover:w-full"></span>
            </button>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white hover:text-gray-300 transition-colors"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          <span className="sr-only">Toggle menu</span>
        </button>
      </nav>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="absolute top-0 left-0 w-full h-full bg-black/90 z-30 md:hidden">
          <div className="flex flex-col items-center justify-center h-full space-y-8">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.href)}
                className="text-white text-2xl font-bold tracking-wider hover:text-gray-300 transition-colors duration-300"
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Name — anchored to the bottom, same font and size as the ayaan-faisal.com hero, color follows the slide */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 flex justify-center">
        <h1
          className="m-0 p-0 uppercase"
          style={{
            fontSize: NAME_FONT_SIZE,
            lineHeight: NAME_LINE_HEIGHT,
            color: slides[currentSlide].nameColor,
            transition: `color ${FADE_MS}ms ease-in-out`,
            fontFamily: "var(--font-italiana)",
            whiteSpace: "nowrap",
          }}
        >
          {HERO_NAME.split("").map((letter, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, filter: "blur(12px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.7, delay: 1.0 + i * 0.15, ease: "easeOut" }}
              style={{ display: "inline-block" }}
            >
              {letter}
            </motion.span>
          ))}
        </h1>
      </div>

      {/* Side Navigation Indicators */}
      <div className="absolute right-8 top-1/2 transform -translate-y-1/2 z-20 hidden md:block">
        <div className="flex flex-col space-y-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-1 h-8 transition-all duration-300 ${
                currentSlide === index ? "bg-white" : "bg-white/40 hover:bg-white/60"
              }`}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
