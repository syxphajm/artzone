"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import {
  ChevronLeft,
  Palette,
  MapPin,
  GraduationCap,
  Calendar,
  Home,
  Mail,
  Heart,
  ShoppingCart,
  Eye,
  Star,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserAvatar } from "@/components/user-avatar"
import { useCart } from "@/contexts/cart-context"

export default function ArtistDetailPage({ params }) {
  const [artist, setArtist] = useState(null)
  const [artworks, setArtworks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { toast } = useToast()
  const router = useRouter()
  const { addToCart } = useCart()
  const artistId = params.id

  useEffect(() => {
    const fetchArtistData = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/artists/${artistId}`)

        if (!response.ok) {
          if (response.status === 404) {
            router.push("/404")
            return
          }
          throw new Error("Failed to fetch artist data")
        }

        const data = await response.json()
        console.log("Artist data:", data)
        setArtist(data.artist)
        setArtworks(data.artworks || [])
      } catch (error) {
        console.error("Error fetching artist data:", error)
        setError(error.message)
        toast({
          title: "Error",
          description: "Failed to load artist data",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (artistId) {
      fetchArtistData()
    }
  }, [artistId, router, toast])

  // Function to get art style label
  const getArtStyleLabel = (style) => {
    const styles = {
      abstract: "Trừu tượng",
      realism: "Hiện thực",
      impressionism: "Ấn tượng",
      minimalism: "Tối giản",
      expressionism: "Biểu hiện",
      cubism: "Lập thể",
      surrealism: "Siêu thực",
    }
    return styles[style] || style
  }

  // Handle add to cart
  const handleAddToCart = (e, artwork) => {
    e.preventDefault() // Prevent navigation
    e.stopPropagation() // Prevent event bubbling

    // Prepare artwork data for cart
    const cartItem = {
      id: artwork.id,
      title: artwork.title,
      artist: artwork.artist_name || artist.fullname,
      price: artwork.price,
      image: artwork.image,
      quantity: 1,
      artwork_data: artwork, // Store full artwork data for reference
    }

    addToCart(cartItem)
  }

  // Hàm xử lý hiển thị hình ảnh
  const getImageUrl = (imageString) => {
    if (!imageString) return "/placeholder.svg"

    // Tách chuỗi đường dẫn hình ảnh
    const images = imageString.split(",")
    const imagePath = images[0].trim()

    // Nếu đường dẫn bắt đầu bằng http hoặc https, sử dụng trực tiếp
    if (imagePath.startsWith("http")) {
      return imagePath
    }

    // Nếu đường dẫn bắt đầu bằng /uploads/, thêm /api vào trước
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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-10 px-[30px]">
          <div className="container">
            <Skeleton className="h-8 w-32 mb-8" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <Skeleton className="h-64 w-full rounded-lg mb-4" />
                <Skeleton className="h-8 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
              </div>

              <div className="lg:col-span-2">
                <Skeleton className="h-10 w-full mb-6" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((_, index) => (
                    <Skeleton key={index} className="h-[250px] w-full rounded-lg" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!artist) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-10 px-[30px]">
        <div className="container">
          <Button variant="ghost" className="mb-8 pl-0 hover:pl-0" onClick={() => router.push("/artists")}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Artists
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Artist profile */}
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center mb-6">
                    <UserAvatar
                      user={{ profile_picture: artist.profile_picture }}
                      className="h-32 w-32 mb-4 border-4 border-primary/10"
                    />
                    <h1 className="text-2xl font-bold">{artist.fullname}</h1>
                    {artist.pseudonym && <p className="text-muted-foreground">{artist.pseudonym}</p>}
                  </div>

                  <div className="space-y-4">
                    {artist.email && (
                      <div className="flex items-center text-sm">
                        <Mail className="h-4 w-4 mr-3 text-muted-foreground" />
                        <span>{artist.email}</span>
                      </div>
                    )}

                    {artist.nationality && (
                      <div className="flex items-center text-sm">
                        <MapPin className="h-4 w-4 mr-3 text-muted-foreground" />
                        <span>{artist.nationality}</span>
                      </div>
                    )}

                    {artist.year_of_birth && (
                      <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 mr-3 text-muted-foreground" />
                        <span>Born in {artist.year_of_birth}</span>
                      </div>
                    )}

                    {artist.place_of_birth && (
                      <div className="flex items-center text-sm">
                        <Home className="h-4 w-4 mr-3 text-muted-foreground" />
                        <span>{artist.place_of_birth}</span>
                      </div>
                    )}

                    {artist.education_training && (
                      <div className="flex items-center text-sm">
                        <GraduationCap className="h-4 w-4 mr-3 text-muted-foreground" />
                        <span>{artist.education_training}</span>
                      </div>
                    )}

                    {artist.main_art_style && (
                      <div className="flex items-center text-sm">
                        <Palette className="h-4 w-4 mr-3 text-muted-foreground" />
                        <span>{getArtStyleLabel(artist.main_art_style)}</span>
                      </div>
                    )}
                  </div>

                  {artist.about_me && (
                    <div className="mt-6">
                      <h3 className="font-medium mb-2">About</h3>
                      <p className="text-sm text-muted-foreground">{artist.about_me}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Artist artworks */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="artworks">
                <TabsList className="mb-6">
                  <TabsTrigger value="artworks">Artworks ({artworks.length})</TabsTrigger>
                  <TabsTrigger value="exhibitions">Exhibitions</TabsTrigger>
                </TabsList>

                <TabsContent value="artworks">
                  {artworks.length === 0 ? (
                    <div className="text-center py-12 bg-muted/30 rounded-lg">
                      <Palette className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">No artworks yet</h3>
                      <p className="text-muted-foreground">This artist has no approved artworks yet</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {artworks.map((artwork) => (
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

                            <div>
                              <h3 className="text-sm font-medium line-clamp-2 group-hover:underline">
                                {artwork.title}
                              </h3>

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
                              </div>
                            </div>
                          </Link>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="exhibitions">
                  <div className="text-center py-12 bg-muted/30 rounded-lg">
                    <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No exhibitions yet</h3>
                    <p className="text-muted-foreground">This artist hasn't participated in any exhibitions yet</p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
