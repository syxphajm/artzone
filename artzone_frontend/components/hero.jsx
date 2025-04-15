"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Hero() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const backgroundImages = [
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/screenshot_1744143258-eeSFpH7e1p2pOzpy2YkPLQCP9mzYRw.png", // Starry night swirl with people
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/screenshot_1744143216-UUb9Dp9RUegi7siY735ojtS0DqxUTf.png", // Blue immersive Van Gogh room
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/screenshot_1744143236-DFcTOeSB7hbUeUxIxBLHuEknygAYhX.png", // Yellow wheat field
  ]

  useEffect(() => {
    // Set up the image rotation every 3 seconds
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length)
    }, 3000)

    // Clean up the interval when component unmounts
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative">
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50 z-10" />

      {/* Background images with fade transition */}
      {backgroundImages.map((image, index) => (
        <div
          key={index}
          className="absolute inset-0 h-[600px] bg-cover bg-center transition-opacity duration-1000"
          style={{
            backgroundImage: `url('${image}')`,
            opacity: currentImageIndex === index ? 1 : 0,
            zIndex: 0,
          }}
        />
      ))}

      <div className="h-[600px] flex items-center justify-center relative z-10">
        <div className="container relative flex flex-col items-center justify-center h-full text-white text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 max-w-2xl">Welcome to our platform</h1>
          <p className="text-lg md:text-xl mb-8 max-w-xl">
            Explore our curated collection of unique artworks from talented artists across the globe.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" asChild>
              <Link href="/artworks">Explore Artworks</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent text-white border-white hover:bg-white/10"
              asChild
            >
              <Link href="/artists">Meet the Artists</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
