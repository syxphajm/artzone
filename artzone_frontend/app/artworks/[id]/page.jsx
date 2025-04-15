"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useCart } from "@/contexts/cart-context"
import {
  Heart,
  ShoppingCart,
  Loader2,
  Star,
  ChevronRight,
  Minus,
  Plus,
  Check,
  Truck,
  ChevronLeft,
  X,
  ZoomIn,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

export default function ArtworkPage({ params }) {
  const [artwork, setArtwork] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const { addToCart } = useCart()
  const artworkId = params.id

  useEffect(() => {
    const fetchArtwork = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/artworks/${artworkId}`)

        if (!response.ok) {
          if (response.status === 404) {
            router.push("/404")
            return
          }
          throw new Error("Failed to fetch artwork")
        }

        const data = await response.json()
        console.log("Artwork data:", data)
        setArtwork(data.artwork)
      } catch (error) {
        console.error("Error fetching artwork:", error)
        setError(error.message)
        toast({
          title: "Error",
          description: "Failed to load artwork details",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (artworkId) {
      fetchArtwork()
    }
  }, [artworkId, toast, router])

  // Hàm xử lý hiển thị hình ảnh
  const processImageUrl = (imagePath) => {
    if (!imagePath) return "/placeholder.svg"

    // Loại bỏ khoảng trắng
    const trimmedPath = imagePath.trim()

    // Nếu đường dẫn bắt đầu bằng http hoặc https, sử dụng trực tiếp
    if (trimmedPath.startsWith("http")) {
      return trimmedPath
    }

    // Nếu đường dẫn bắt đầu bằng /uploads/, thêm /api vào trước
    if (trimmedPath.startsWith("/uploads/")) {
      return `/api${trimmedPath}`
    }

    // Nếu đường dẫn không có / ở đầu, thêm /api/uploads/
    if (!trimmedPath.startsWith("/")) {
      return `/api/uploads/${trimmedPath}`
    }

    // Trường hợp khác, trả về đường dẫn gốc
    return trimmedPath
  }

  const handleQuantityChange = (value) => {
    const newQuantity = Math.max(1, Math.min(10, value))
    setQuantity(newQuantity)
  }

  const handleAddToCart = () => {
    if (!artwork) return

    // Prepare artwork data for cart
    const cartItem = {
      id: artwork.id,
      title: artwork.title,
      artist: artwork.artist_name,
      price: artwork.price,
      image: processImageUrl(artwork.image),
      quantity: quantity,
      artwork_data: artwork, // Store full artwork data for reference
    }

    addToCart(cartItem)
  }

  const navigateImage = (direction) => {
    if (!artwork || !artwork.image) return

    const imageUrls = artwork.image.split(",")
    if (imageUrls.length <= 1) return

    if (direction === "next") {
      setSelectedImage((prev) => (prev + 1) % imageUrls.length)
    } else {
      setSelectedImage((prev) => (prev - 1 + imageUrls.length) % imageUrls.length)
    }
  }

  const toggleLightbox = () => {
    setLightboxOpen(!lightboxOpen)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Loading artwork details...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!artwork) {
    return null
  }

  // Xử lý danh sách hình ảnh
  const imageUrls = artwork.image
    ? artwork.image.split(",").map((img) => processImageUrl(img.trim()))
    : ["/placeholder.svg"]

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-8 px-4 md:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          {/* Breadcrumbs */}
          <nav className="flex items-center text-sm mb-6">
            <Link href="/" className="text-muted-foreground hover:text-foreground">
              Home
            </Link>
            <ChevronRight className="h-4 w-4 mx-1 text-muted-foreground" />
            <Link href="/artworks" className="text-muted-foreground hover:text-foreground">
              Artworks
            </Link>
            <ChevronRight className="h-4 w-4 mx-1 text-muted-foreground" />
            <span className="text-foreground font-medium truncate">{artwork.title}</span>
          </nav>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {/* Image gallery */}
            <div className="space-y-4">
              <div className="aspect-square overflow-hidden rounded-lg bg-gray-100 relative group">
                <img
                  src={imageUrls[selectedImage] || "/placeholder.svg"}
                  alt={artwork.title}
                  className="h-full w-full object-cover object-center cursor-pointer"
                  onClick={toggleLightbox}
                />

                {/* Zoom icon */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="bg-white/80 hover:bg-white/90 dark:bg-black/50 dark:hover:bg-black/70 rounded-full"
                    onClick={toggleLightbox}
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                </div>

                {/* Navigation buttons */}
                {imageUrls.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white/90 dark:bg-black/50 dark:hover:bg-black/70 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => navigateImage("prev")}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white/90 dark:bg-black/50 dark:hover:bg-black/70 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => navigateImage("next")}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>

              {imageUrls.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {imageUrls.map((image, index) => (
                    <button
                      key={index}
                      className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md ${
                        selectedImage === index ? "ring-2 ring-primary" : "ring-1 ring-gray-200"
                      }`}
                      onClick={() => setSelectedImage(index)}
                    >
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`${artwork.title} - Image ${index + 1}`}
                        className="h-full w-full object-cover object-center"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold">{artwork.title}</h1>
                <div className="mt-1 flex items-center">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${star <= 5 ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground ml-2">(24 reviews)</span>
                </div>
                <Link
                  href={`/artists/${artwork.artists_id}`}
                  className="mt-1 inline-block text-sm text-primary hover:underline"
                >
                  by {artwork.artist_name}
                </Link>
              </div>

              <div>
                <div className="text-3xl font-bold">${artwork.price}</div>
                {/* <div className="mt-1 flex items-center text-sm text-muted-foreground">
                  <Truck className="h-4 w-4 mr-1" />
                  <span>Free shipping</span>
                </div> */}
              </div>

              <div className="space-y-4 border-t border-b py-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Quantity</span>
                  <div className="flex items-center">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center">{quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                      onClick={() => handleQuantityChange(quantity + 1)}
                      disabled={quantity >= 10}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <Button className="w-full" size="lg" onClick={handleAddToCart}>
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Add to cart
                  </Button>
                  <Button variant="secondary" className="w-full" size="lg">
                    <Heart className="mr-2 h-5 w-5" />
                    Add to favorites
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium mb-1">Dimensions</h3>
                    <p className="text-sm text-muted-foreground">{artwork.dimensions || "Not specified"}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-1">Material</h3>
                    <p className="text-sm text-muted-foreground">{artwork.material || "Not specified"}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-1">Category</h3>
                    <Badge variant="secondary">{artwork.category_name}</Badge>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-1">Date</h3>
                    <p className="text-sm text-muted-foreground">
                      {new Date(artwork.upload_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <Tabs defaultValue="description">
                <TabsList className="w-full">
                  <TabsTrigger value="description" className="flex-1">
                    Description
                  </TabsTrigger>
                  <TabsTrigger value="shipping" className="flex-1">
                    Shipping
                  </TabsTrigger>
                  <TabsTrigger value="reviews" className="flex-1">
                    Reviews
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="description" className="pt-4">
                  <div className="prose prose-sm max-w-none">
                    <p>{artwork.description || "No description available."}</p>
                  </div>
                </TabsContent>
                <TabsContent value="shipping" className="pt-4">
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Shipping</h4>
                        <p className="text-sm text-muted-foreground">Estimated delivery: 5-7 business days</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Returns accepted</h4>
                        <p className="text-sm text-muted-foreground">Within 30 days of delivery</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="reviews" className="pt-4">
                  <div className="text-center py-8">
                    <h3 className="font-medium mb-2">No reviews yet</h3>
                    <p className="text-sm text-muted-foreground">Be the first to review this artwork</p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl max-h-[90vh]">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-0 right-0 text-white z-10 hover:bg-white/10"
              onClick={toggleLightbox}
            >
              <X className="h-6 w-6" />
            </Button>

            <div className="relative h-full">
              <img
                src={imageUrls[selectedImage] || "/placeholder.svg"}
                alt={artwork.title}
                className="max-h-[85vh] mx-auto object-contain"
              />

              {imageUrls.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/10 rounded-full"
                    onClick={() => navigateImage("prev")}
                  >
                    <ChevronLeft className="h-8 w-8" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/10 rounded-full"
                    onClick={() => navigateImage("next")}
                  >
                    <ChevronRight className="h-8 w-8" />
                  </Button>
                </>
              )}
            </div>

            {imageUrls.length > 1 && (
              <div className="flex justify-center mt-4 gap-2">
                {imageUrls.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full ${selectedImage === index ? "bg-white" : "bg-white/50"}`}
                    onClick={() => setSelectedImage(index)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

