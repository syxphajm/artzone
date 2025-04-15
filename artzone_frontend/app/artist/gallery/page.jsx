"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { Plus, Pencil, Trash2, AlertCircle, Filter, RefreshCw } from "lucide-react"
import Link from "next/link"

export default function ArtistGalleryPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [artworks, setArtworks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState("all") // "all", "approved", "pending", "rejected"
  const [debug, setDebug] = useState(null) // For debugging

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          router.push("/login")
          return
        }

        setLoading(true)
        const response = await fetch("/api/artist/artworks", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            // Invalid token, show message and redirect to login page
            localStorage.removeItem("token")
            toast({
              title: "Session expired",
              description: "Please log in again to continue",
              variant: "destructive",
              icon: <AlertCircle className="h-5 w-5" />,
            })
            router.push("/login")
            return
          }
          const errorData = await response.json()
          throw new Error(errorData.message || "Unable to fetch artworks list")
        }

        const data = await response.json()
        console.log("Artworks data received:", data) // Debug log
        setArtworks(data.artworks || [])
        setDebug({
          totalArtworks: data.artworks?.length || 0,
          artworksData: data.artworks,
        })
      } catch (err) {
        console.error("Error fetching artworks:", err)
        setError(err.message)
        toast({
          title: "Error",
          description: err.message,
          variant: "destructive",
          icon: <AlertCircle className="h-5 w-5" />,
        })
      } finally {
        setLoading(false)
      }
    }

    fetchArtworks()
  }, [router, toast])

  // Handle logout and re-login
  const handleLogoutAndRelogin = () => {
    localStorage.removeItem("token")
    toast({
      title: "Logged out",
      description: "Please log in again to fix the token error",
      variant: "default",
    })
    router.push("/login")
  }

  // Filter artworks based on status
  const filteredArtworks = artworks.filter((artwork) => {
    if (filter === "all") return true
    if (filter === "approved") return artwork.status === 1
    if (filter === "pending") return artwork.status === 0
    if (filter === "rejected") return artwork.status === 2
    return true
  })

  // Handle image display
  const getFirstImage = (imageString) => {
    if (!imageString) return "/placeholder.svg?height=400&width=300"

    // Split image path string
    const images = imageString.split(",")
    const imagePath = images[0].trim()

    // If the path starts with http or https, use it directly
    if (imagePath.startsWith("http")) {
      return imagePath
    }

    // If the path starts with /uploads/, add /api before it
    if (imagePath.startsWith("/uploads/")) {
      return `/api${imagePath}`
    }

    // If the path does not start with /, add /api/uploads/
    if (!imagePath.startsWith("/")) {
      return `/api/uploads/${imagePath}`
    }

    // Default case, return original path
    return imagePath
  }

  // Handle status display
  const getStatusBadge = (status) => {
    switch (status) {
      case 0:
        return (
          <Badge variant="secondary" className="absolute top-2 right-2">
            Pending Approval
          </Badge>
        )
      case 1:
        return (
          <Badge variant="success" className="absolute top-2 right-2">
            Approved
          </Badge>
        )
      case 2:
        return (
          <Badge variant="destructive" className="absolute top-2 right-2">
            Rejected
          </Badge>
        )
      default:
        return <Badge className="absolute top-2 right-2">Undefined</Badge>
    }
  }

  // Loading skeleton
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-10 px-[30px]">
          <div className="container">
            <div className="flex justify-between items-center mb-8">
              <Skeleton className="h-10 w-64" />
              <Skeleton className="h-10 w-40" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((_, index) => (
                <Skeleton key={index} className="h-[400px] w-full" />
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-10 px-[30px]">
        <div className="container">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold">My Art Gallery</h1>
              <p className="text-muted-foreground mt-1">Manage your artworks</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex gap-2">
                <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>
                  All
                </Button>
                <Button
                  variant={filter === "approved" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter("approved")}
                >
                  Approved
                </Button>
                <Button
                  variant={filter === "pending" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter("pending")}
                >
                  Pending
                </Button>
                <Button
                  variant={filter === "rejected" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilter("rejected")}
                >
                  Rejected
                </Button>
              </div>
              <Button asChild>
                <Link href="/artist/gallery/add">
                  <Plus className="mr-2 h-4 w-4" /> Add Artwork
                </Link>
              </Button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              <div className="flex">
                <AlertCircle className="h-5 w-5 mr-2" />
                <span>Error: {error}</span>
              </div>
              <div className="mt-2">
                <Button variant="outline" size="sm" onClick={handleLogoutAndRelogin} className="flex items-center">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Log in again to fix
                </Button>
              </div>
            </div>
          )}

          {filteredArtworks.length === 0 && !loading && !error ? (
            <div className="text-center py-12 bg-muted/30 rounded-lg">
              <Filter className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No artworks found</h3>
              <p className="text-muted-foreground mb-6">
                {filter !== "all"
                  ? `You don't have any ${filter} artworks yet.`
                  : "You haven't added any artworks yet."}
              </p>
              {filter !== "all" ? (
                <Button variant="outline" onClick={() => setFilter("all")}>
                  View all artworks
                </Button>
              ) : (
                <Button asChild>
                  <Link href="/artist/gallery/add">
                    <Plus className="mr-2 h-4 w-4" /> Add your first artwork
                  </Link>
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArtworks.map((artwork) => (
                <Card key={artwork.id} className="overflow-hidden group">
                  <div className="relative">
                    <img
                      src={getFirstImage(artwork.image) || "/placeholder.svg"}
                      alt={artwork.title}
                      className="w-full h-[300px] object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute top-2 right-2 flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="bg-white/80 hover:bg-white/90 dark:bg-black/50 dark:hover:bg-black/70 rounded-full"
                        onClick={() => router.push(`/artist/gallery/edit/${artwork.id}`)}
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="bg-white/80 hover:bg-white/90 dark:bg-black/50 dark:hover:bg-black/70 rounded-full"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                    <Badge className="absolute bottom-2 left-2">{artwork.category_name}</Badge>
                    {getStatusBadge(artwork.status)}
                  </div>
                  <CardContent className="pt-4">
                    <h3 className="font-semibold text-lg mb-1">{artwork.title}</h3>
                    <p className="text-muted-foreground text-sm line-clamp-2">{artwork.description}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="font-medium">${artwork.price}</span>
                      <Link href={`/artworks/${artwork.id}`}>
                        <Button variant="outline" size="sm">
                          View
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
