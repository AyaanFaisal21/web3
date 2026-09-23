"use client"

import { LiquidButton } from "@/components/ui/liquid-glass-button"
import { Menu, ChevronLeft, ChevronRight, X } from "lucide-react"
import { motion } from "framer-motion"
import { useState } from "react"

// Landing name, rendered the same way as on ayaan-faisal.com: Italiana, orange,
// anchored to the bottom of the viewport, letters blur-fade in one by one.
const HERO_NAME = "AYAAN"
const NAME_FONT_SIZE = "clamp(3.2rem, 29vw, 26rem)"
const NAME_LINE_HEIGHT = 0.78
// Rendered height of the name block; the rest of the hero UI lives in the band above it
const NAME_BLOCK_HEIGHT = `calc(${NAME_FONT_SIZE} * ${NAME_LINE_HEIGHT})`

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const slides = [
    {
      // Starting image: the center portrait from the ayaan-faisal.com hero
      image: "/images/ayaan/mainBackground.jpg",
      alt: "Ayaan",
      position: "center 42%",
    },
    {
      // Ending image: the contact section background from ayaan-faisal.com
      image: "/ContactMeBackground.webp",
      alt: "Contact section background",
      position: "center",
    },
    {
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-DQ2brNc5Vszxllx17YNA6JqGqiHaRm.png",
      alt: "Male runner leading group",
      position: "center",
    },
  ]

  const navItems = [
    { name: "Home", href: "#hero" },
    { name: "About", href: "#about" },
    { name: "Community", href: "#community" },
    { name: "Testimonials", href: "#testimonials" },
    { name: "Join Us", href: "#join" },
  ]

  // Navigation handlers
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length)
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    setIsMenuOpen(false)
  }

  return (
    <div id="hero" className="relative h-screen w-full overflow-hidden bg-black">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-no-repeat transition-all duration-1000 ease-in-out"
        style={{
          backgroundImage: `url('${slides[currentSlide].image}')`,
          backgroundPosition: slides[currentSlide].position,
        }}
      >
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

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

      {/* Hero Content — centered in the space above the name */}
      <div
        className="relative z-10 flex h-full items-center justify-center px-6"
        style={{ paddingBottom: NAME_BLOCK_HEIGHT }}
      >
        <div className="text-center text-white max-w-4xl">
          {/* Subtitle */}
          <p className="text-xl md:text-2xl font-light tracking-wide mb-8 text-gray-200">Global Running Community</p>

          {/* CTA Button - Now using LiquidButton */}
          <LiquidButton
            size="xxl"
            className="font-semibold text-lg tracking-wide"
            onClick={() => scrollToSection("#join")}
          >
            Join Us
          </LiquidButton>
        </div>
      </div>

      {/* Name — anchored to the bottom, same font, color and size as the ayaan-faisal.com hero */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-10 flex justify-center">
        <h1
          className="m-0 p-0 uppercase"
          style={{
            fontSize: NAME_FONT_SIZE,
            lineHeight: NAME_LINE_HEIGHT,
            color: "#c78347",
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

      {/* Slider Navigation — sits just above the name so the controls never overlap it */}
      <div
        className="absolute left-1/2 transform -translate-x-1/2 z-20"
        style={{ bottom: `calc(${NAME_BLOCK_HEIGHT} + 1.5rem)` }}
      >
        <div className="flex items-center space-x-4">
          {/* Previous Arrow */}
          <button
            onClick={prevSlide}
            className="text-white hover:text-gray-300 transition-colors p-2"
            aria-label="Previous slide"
          >
            <ChevronLeft size={24} />
          </button>

          {/* Slide Indicators */}
          <div className="flex space-x-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentSlide === index ? "bg-white" : "bg-white/40 hover:bg-white/60"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Next Arrow */}
          <button
            onClick={nextSlide}
            className="text-white hover:text-gray-300 transition-colors p-2"
            aria-label="Next slide"
          >
            <ChevronRight size={24} />
          </button>
        </div>
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
