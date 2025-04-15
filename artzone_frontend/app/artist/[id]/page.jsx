import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart } from "lucide-react"

export default function ArtistPage({ params }) {
  // In a real app, you would fetch the artist data based on params.id
  const artist = {
    id: params.id,
    name: "Elena Rodriguez",
    specialty: "Abstract Painter",
    bio: "Elena Rodriguez is a contemporary abstract painter known for her vibrant use of color and dynamic compositions. Born in Barcelona, Spain, she studied at the Royal Academy of Fine Arts before moving to New York to pursue her artistic career. Her work has been exhibited in galleries across Europe and North America.",
    location: "New York, USA",
    image: "/placeholder.svg?height=200&width=200",
    artworks: [
      {
        id: 1,
        title: "Abstract Harmony",
        price: "$1,200",
        image: "/placeholder.svg?height=400&width=300",
        category: "Abstract",
      },
      {
        id: 2,
        title: "Urban Dreams",
        price: "$950",
        image: "/placeholder.svg?height=400&width=300",
        category: "Abstract",
      },
      {
        id: 3,
        title: "Cosmic Journey",
        price: "$1,500",
        image: "/placeholder.svg?height=400&width=300",
        category: "Abstract",
      },
      {
        id: 4,
        title: "Emotional Landscape",
        price: "$1,100",
        image: "/placeholder.svg?height=400&width=300",
        category: "Abstract",
      },
    ],
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-10">
        <div className="container">
          <div className="flex flex-col md:flex-row gap-8 mb-12">
            <div className="flex-shrink-0">
              <Avatar className="h-40 w-40">
                <AvatarImage src={artist.image} alt={artist.name} />
                <AvatarFallback>
                  {artist.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">{artist.name}</h1>
              <p className="text-lg text-muted-foreground mb-4">{artist.specialty}</p>
              <p className="mb-4">{artist.bio}</p>
              <p className="text-muted-foreground mb-6">Based in {artist.location}</p>
              <Button>Contact Artist</Button>
            </div>
          </div>

          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-6">Artworks by {artist.name}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {artist.artworks.map((artwork) => (
                <Card key={artwork.id} className="overflow-hidden group">
                  <div className="relative">
                    <img
                      src={artwork.image || "/placeholder.svg"}
                      alt={artwork.title}
                      className="w-full h-[300px] object-cover transition-transform group-hover:scale-105"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 bg-white/80 hover:bg-white/90 dark:bg-black/50 dark:hover:bg-black/70 rounded-full"
                    >
                      <Heart className="h-5 w-5" />
                      <span className="sr-only">Add to favorites</span>
                    </Button>
                    <Badge className="absolute bottom-2 left-2">{artwork.category}</Badge>
                  </div>
                  <CardContent className="pt-4">
                    <h3 className="font-semibold text-lg mb-1">{artwork.title}</h3>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{artwork.price}</span>
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/artworks/${artwork.id}`}>View</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

