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
      <div className="px-[30px]">
        <Hero />
        <FeaturedArtworks />
        <Categories />
        <Artists />
        <Newsletter />
      </div>
      <Footer />
    </div>
  )
}

