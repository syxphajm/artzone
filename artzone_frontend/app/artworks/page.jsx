"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Heart, Loader2, Search, Filter, Star, Eye, ShoppingCart } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCart } from "@/contexts/cart-context"

export default function ArtworksPage() {
  const [artworks, setArtworks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const { toast } = useToast()
  const { addToCart } = useCart()

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/artworks")

        if (!response.ok) {
          throw new Error("Failed to fetch artworks")
        }

        const data = await response.json()
        console.log("Artworks data:", data) // Debug log
        setArtworks(data.artworks || [])
      } catch (error) {
        console.error("Error fetching artworks:", error)
        setError(error.message)
        toast({
          title: "Error",
          description: "Failed to load artworks",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchArtworks()
  }, [toast])

  // Cập nhật hàm getImageUrl để xử lý đường dẫn hình ảnh đúng cách
  const getImageUrl = (imageString) => {
    if (!imageString) return "/placeholder.svg"

    // Tách chuỗi đường dẫn hình ảnh
    const images = imageString.split(",")
    const imagePath = images[0].trim()

    // Kiểm tra xem đường dẫn đã có tiền tố http hoặc https chưa
    if (imagePath.startsWith("http")) {
      return imagePath
    }

    // Nếu đường dẫn bắt đầu bằng /uploads, thêm /api vào trước
    if (imagePath.startsWith("/uploads/")) {
      return `/api${imagePath}`
    }

    // Nếu đường dẫn không có / ở đầu, thêm /api/uploads/
    if (!imagePath.startsWith("/")) {
      return `/api/uploads/${imagePath}`
    }

    // Trường hợp khác, trả về đường dẫn gốc
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

  // Filter artworks based on search term
  const filteredArtworks = artworks.filter(
    (artwork) =>
      artwork.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      artwork.artist_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      artwork.category_name?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Sort artworks
  const sortedArtworks = [...filteredArtworks].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.upload_date) - new Date(a.upload_date)
      case "oldest":
        return new Date(a.upload_date) - new Date(b.upload_date)
      case "price_low":
        return a.price - b.price
      case "price_high":
        return b.price - a.price
      default:
        return 0
    }
  })

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Loading artworks...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-8 px-4 md:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          {/* Search and filter section */}
          <div className="mb-8 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search artworks, artists, or categories..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground whitespace-nowrap">Sort by:</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="oldest">Oldest</SelectItem>
                    <SelectItem value="price_low">Price: Low to High</SelectItem>
                    <SelectItem value="price_high">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                
                <div className="text-sm text-muted-foreground">{filteredArtworks.length} results</div>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-6">
              <p className="font-medium">Error loading artworks</p>
              <p>{error}</p>
            </div>
          )}

          {/* Debug information */}
          {artworks.length === 0 && !loading && !error && (
            <div className="bg-blue-50 border border-blue-200 text-blue-700 p-4 rounded-md mb-6">
              <p className="font-medium">No artworks found</p>
              <p>The API returned an empty array. Make sure there are approved artworks in the database.</p>
            </div>
          )}

          {/* Artworks grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {sortedArtworks.map((artwork) => (
              <div key={artwork.id} className="group">
                <Link href={`/artworks/${artwork.id}`} className="block">
                  <div className="relative aspect-square mb-2 overflow-hidden rounded-lg bg-gray-100">
                    <img
                      src={getImageUrl(artwork.image) || "/placeholder.svg"}
                      alt={artwork.title}
                      className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
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
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          // This button just navigates to the artwork page
                        }}
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
                  </div>

                  <div>
                    <h3 className="text-sm font-medium line-clamp-2 group-hover:underline">{artwork.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">by {artwork.artist_name}</p>

                    <div className="flex items-center mt-1">
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-3 w-3 ${star <= 5 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground ml-1">(24)</span>
                    </div>

                    <div className="mt-1.5 flex items-center justify-between">
                      <p className="text-sm font-medium">${artwork.price}</p>
                      {artwork.free_shipping && (
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                          FREE shipping
                        </Badge>
                      )}
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {sortedArtworks.length === 0 && !loading && (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">No artworks found</h3>
              <p className="text-muted-foreground mb-6">Try adjusting your search or filters</p>
              <Button onClick={() => setSearchTerm("")}>Clear search</Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
