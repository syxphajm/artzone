import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-10 px-[30px]">
        <div className="container">
          <h1 className="text-3xl font-bold mb-6 text-center">About Us</h1>

          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
              <p className="mb-4">
                Artisan Souk was born out of a passion for Middle Eastern art and a desire to share its beauty with the world.
                We are the bridge between talented artists and art lovers, providing a unique online gallery space for contemporary
                and traditional artworks from the Middle East.
              </p>
              <p>
                With a combination of modern technology and a deep appreciation for cultural heritage, we are proud to present
                a diverse collection, ranging from paintings and sculptures to digital art, reflecting the richness and diversity
                of Middle Eastern art.
              </p>
            </div>

            <Card>
              <CardContent className="p-4">
                <Image
                  src="/placeholder.svg?height=400&width=600"
                  alt="Artisan Souk Gallery"
                  width={600}
                  height={400}
                  className="rounded-lg"
                />
              </CardContent>
            </Card>
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Promote and preserve Middle Eastern art globally</li>
              <li>Support local and contemporary artists in reaching international audiences</li>
              <li>Provide a safe and reliable platform for buying and selling art online</li>
              <li>Educate and inspire about the beauty and significance of Middle Eastern art</li>
            </ul>
          </div>

          <div className="mt-12">
            <h2 className="text-2xl font-semibold mb-4">Our Team</h2>
            <p className="mb-4">
              The Artisan Souk team consists of experts passionate about art, technology, and Middle Eastern culture. We work tirelessly
              to provide the best art shopping experience for our customers and support artists in sharing their works with the world.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
