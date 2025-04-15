"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Loader2, ShoppingCart, Eye } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useCart } from "@/contexts/cart-context"

export function FeaturedArtworks() {
  const [artworks, setArtworks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { toast } = useToast()
  const { addToCart } = useCart()

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        setLoading(true)
        // Fetch all artworks without limit since we'll filter by ID
        const response = await fetch("/api/artworks")

        console.log("Fetching artworks for featured section")

        if (!response.ok) {
          throw new Error("Failed to fetch artworks")
        }

        const data = await response.json()
        console.log(`Received ${data.artworks?.length || 0} artworks from API`)

        // Filter artworks to only include those with IDs 17-20
        const filteredArtworks = (data.artworks || []).filter((artwork) =>
          [17, 18, 19, 20].includes(Number(artwork.id)),
        )

        console.log(`Filtered to ${filteredArtworks.length} artworks with IDs 17-20`)
        setArtworks(filteredArtworks)
      } catch (error) {
        console.error("Error fetching artworks:", error)
        setError(error.message)
        toast({
          title: "Error",
          description: "Failed to load featured artworks",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchArtworks()
  }, [toast])

  // Function to get image URL
  const getImageUrl = (imageString) => {
    if (!imageString) return "/placeholder.svg?height=400&width=300"

    // Split image string and get first image
    const images = imageString.split(",")
    const imagePath = images[0].trim()

    // Check if path starts with http
    if (imagePath.startsWith("http")) {
      return imagePath
    }

    // If path starts with /uploads, add /api prefix
    if (imagePath.startsWith("/uploads/")) {
      return `/api${imagePath}`
    }

    // If path doesn't start with /, add /api/uploads/
    if (!imagePath.startsWith("/")) {
      return `/api/uploads/${imagePath}`
    }

    return imagePath
  }

  // Handle add to cart
  const handleAddToCart = (e, artwork) => {
    e.preventDefault() // Prevent navigation
    e.stopPropagation() // Prevent event bubbling

    // Prepare artwork data for cart
    const cartItem = {
      id: artwork.id,
      title: artwork.title,
      artist: artwork.artist_name,
      price: artwork.price,
      image: artwork.image,
      quantity: 1,
      artwork_data: artwork, // Store full artwork data for reference
    }

    addToCart(cartItem)
  }

  if (loading) {
    return (
      <section className="py-16 container">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold mb-2">Featured Artworks</h2>
            <p className="text-muted-foreground">Discover our handpicked selection of exceptional pieces</p>
          </div>
          <Button asChild>
            <Link href="/artworks">View All</Link>
          </Button>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-16 container">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold mb-2">Featured Artworks</h2>
            <p className="text-muted-foreground">Discover our handpicked selection of exceptional pieces</p>
          </div>
          <Button asChild>
            <Link href="/artworks">View All</Link>
          </Button>
        </div>
        <div className="text-center py-12 text-red-500">
          <p>Failed to load artworks. Please try again later.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 container">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-3xl font-bold mb-2">Featured Artworks</h2>
          <p className="text-muted-foreground">Discover our handpicked selection of exceptional pieces</p>
        </div>
        <Button asChild>
          <Link href="/artworks">View All</Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {artworks.length > 0 ? (
          artworks.map((artwork) => (
            <Card key={artwork.id} className="overflow-hidden group">
              <Link href={`/artworks/${artwork.id}`}>
                <div className="relative">
                  <img
                    src={getImageUrl(artwork.image) || "/placeholder.svg"}
                    alt={artwork.title}
                    className="w-full h-[300px] object-cover transition-transform group-hover:scale-105"
                  />

                  {/* Action buttons that appear on hover */}
                  <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="bg-white/80 hover:bg-white/90 dark:bg-black/50 dark:hover:bg-black/70 rounded-full h-8 w-8"
                      onClick={(e) => handleAddToCart(e, artwork)}
                    >
                      <ShoppingCart className="h-4 w-4" />
                      <span className="sr-only">Add to cart</span>
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="bg-white/80 hover:bg-white/90 dark:bg-black/50 dark:hover:bg-black/70 rounded-full h-8 w-8"
                    >
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View</span>
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="bg-white/80 hover:bg-white/90 dark:bg-black/50 dark:hover:bg-black/70 rounded-full h-8 w-8"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        toast({
                          title: "Added to favorites",
                          description: "Artwork has been added to your favorites",
                        })
                      }}
                    >
                      <Heart className="h-4 w-4" />
                      <span className="sr-only">Add to favorites</span>
                    </Button>
                  </div>

                  <Badge className="absolute top-2 left-2">{artwork.category_name}</Badge>
                </div>
              </Link>
              <CardContent className="pt-4">
                <h3 className="font-semibold text-lg mb-1">{artwork.title}</h3>
                <p className="text-muted-foreground text-sm">by {artwork.artist_name}</p>
              </CardContent>
              <CardFooter className="flex justify-between pt-0">
                <span className="font-medium">${artwork.price}</span>
                <Button size="sm" variant="outline" onClick={(e) => handleAddToCart(e, artwork)}>
                  Add to Cart
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-muted-foreground">No featured artworks available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  )
}
