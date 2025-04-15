"use client"

import { Hero } from "@/components/hero"
import { FeaturedArtworks } from "@/components/featured-artworks"
import { Categories } from "@/components/categories"
import { Artists } from "@/components/artists"
import { Newsletter } from "@/components/newsletter"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <div className="px-[30px]">
        <FeaturedArtworks />
        <Categories />
        <Artists />
        <Newsletter />
      </div>
      <Footer />
    </div>
  )
}
