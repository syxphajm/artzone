"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import {
  Loader2,
  AlertCircle,
  CheckCircle,
  XCircle,
  Filter,
  ChevronLeft,
  ChevronRight,
  Search,
  SlidersHorizontal,
  Eye,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function AdminArtworks() {
  const [artworks, setArtworks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState("pending")
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("newest")
  const [selectedArtwork, setSelectedArtwork] = useState(null)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)
  const { toast } = useToast()

  useEffect(() => {
    fetchArtworks()
  }, [])

  const fetchArtworks = async () => {
    try {
      setLoading(true)
      setError(null)

      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("No authentication token found")
      }

      const response = await fetch("/api/admin/artworks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || "Failed to fetch artworks")
      }

      const data = await response.json()
      setArtworks(data.artworks || [])
    } catch (error) {
      console.error("Error fetching artworks:", error)
      setError(error.message)
      toast({
        title: "Error",
        description: error.message || "Failed to load artworks",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id) => {
    await updateArtworkStatus(id, 1)
  }

  const handleReject = async (id) => {
    await updateArtworkStatus(id, 2)
  }

  const updateArtworkStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("No authentication token found")
      }

      const response = await fetch(`/api/admin/artworks/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || "Failed to update artwork status")
      }

      toast({
        title: "Success",
        description: `Artwork ${status === 1 ? "approved" : "rejected"} successfully`,
      })

      fetchArtworks() // Refresh the list
    } catch (error) {
      console.error("Error updating artwork status:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to update artwork status",
        variant: "destructive",
      })
    }
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

  // Lấy tất cả hình ảnh của một artwork
  const getAllImages = (imageString) => {
    if (!imageString) return ["/placeholder.svg"]

    return imageString.split(",").map((img) => {
      const imagePath = img.trim()

      if (imagePath.startsWith("http")) {
        return imagePath
      }

      if (imagePath.startsWith("/uploads/")) {
        return `/api${imagePath}`
      }

      if (!imagePath.startsWith("/")) {
        return `/api/uploads/${imagePath}`
      }

      return imagePath
    })
  }

  const openLightbox = (artwork, index = 0) => {
    setSelectedArtwork(artwork)
    setSelectedImage(index)
    setLightboxOpen(true)
  }

  const navigateImage = (direction) => {
    if (!selectedArtwork || !selectedArtwork.image) return

    const images = getAllImages(selectedArtwork.image)
    if (images.length <= 1) return

    if (direction === "next") {
      setSelectedImage((prev) => (prev + 1) % images.length)
    } else {
      setSelectedImage((prev) => (prev - 1 + images.length) % images.length)
    }
  }

  // Filter artworks based on tab and search
  const filteredArtworks = artworks.filter((artwork) => {
    // Filter by status
    if (activeTab === "pending" && artwork.status !== 0) return false
    if (activeTab === "approved" && artwork.status !== 1) return false
    if (activeTab === "rejected" && artwork.status !== 2) return false

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      return (
        artwork.title?.toLowerCase().includes(term) ||
        artwork.artist_name?.toLowerCase().includes(term) ||
        artwork.category_name?.toLowerCase().includes(term)
      )
    }

    return true
  })

  // Sort artworks
  const sortedArtworks = [...filteredArtworks].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.upload_date) - new Date(a.upload_date)
      case "oldest":
        return new Date(a.upload_date) - new Date(b.upload_date)
      case "price_high":
        return b.price - a.price
      case "price_low":
        return a.price - b.price
      case "artist_az":
        return (a.artist_name || "").localeCompare(b.artist_name || "")
      case "artist_za":
        return (b.artist_name || "").localeCompare(a.artist_name || "")
      default:
        return 0
    }
  })

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
        <span>Loading artworks...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 p-4 rounded-md flex items-start">
        <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
        <div>
          <h3 className="font-semibold">Error loading artworks</h3>
          <p>{error}</p>
          <Button variant="outline" size="sm" className="mt-2" onClick={fetchArtworks}>
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Artwork Management</h1>
          <p className="text-muted-foreground">Review and manage all artworks on the platform</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search artworks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full sm:w-[200px] md:w-[300px]"
            />
          </div>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="price_high">Price: High to Low</SelectItem>
              <SelectItem value="price_low">Price: Low to High</SelectItem>
              <SelectItem value="artist_az">Artist: A to Z</SelectItem>
              <SelectItem value="artist_za">Artist: Z to A</SelectItem>
            </SelectContent>
          </Select>

          
        </div>
      </div>

      <Tabs defaultValue="pending" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="pending" className="relative">
            Pending
            <Badge className="ml-2 bg-yellow-500 hover:bg-yellow-600">
              {artworks.filter((a) => a.status === 0).length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="approved" className="relative">
            Approved
            <Badge className="ml-2 bg-green-500 hover:bg-green-600">
              {artworks.filter((a) => a.status === 1).length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="rejected" className="relative">
            Rejected
            <Badge className="ml-2 bg-red-500 hover:bg-red-600">{artworks.filter((a) => a.status === 2).length}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-0">
          {sortedArtworks.length === 0 ? (
            <div className="bg-muted/30 dark:bg-muted/10 rounded-lg p-8 text-center">
              <Filter className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No pending artworks</h3>
              <p className="text-muted-foreground">All artworks have been reviewed</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedArtworks.map((artwork) => (
                <Card key={artwork.id} className="overflow-hidden">
                  <div className="relative aspect-[4/3] group">
                    <img
                      src={getImageUrl(artwork.image) || "/placeholder.svg"}
                      alt={artwork.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button variant="secondary" size="sm" onClick={() => openLightbox(artwork)}>
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </div>

                    {artwork.image && artwork.image.includes(",") && (
                      <Badge className="absolute bottom-2 right-2 bg-black/70">
                        {artwork.image.split(",").length} images
                      </Badge>
                    )}
                  </div>

                  <CardHeader className="p-4 pb-0">
                    <CardTitle className="text-lg">{artwork.title}</CardTitle>
                    <CardDescription>
                      by {artwork.artist_name} • ${artwork.price}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="p-4">
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="outline">{artwork.category_name}</Badge>
                      {artwork.material && <Badge variant="outline">{artwork.material}</Badge>}
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {artwork.description || "No description provided."}
                    </p>

                    <div className="flex gap-2">
                      <Button className="flex-1" onClick={() => handleApprove(artwork.id)}>
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button variant="destructive" className="flex-1" onClick={() => handleReject(artwork.id)}>
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="approved" className="mt-0">
          {sortedArtworks.length === 0 ? (
            <div className="bg-muted/30 dark:bg-muted/10 rounded-lg p-8 text-center">
              <Filter className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No approved artworks</h3>
              <p className="text-muted-foreground">No artworks have been approved yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedArtworks.map((artwork) => (
                <Card key={artwork.id} className="overflow-hidden">
                  <div className="relative aspect-[4/3] group">
                    <img
                      src={getImageUrl(artwork.image) || "/placeholder.svg"}
                      alt={artwork.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button variant="secondary" size="sm" onClick={() => openLightbox(artwork)}>
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </div>

                    {artwork.image && artwork.image.includes(",") && (
                      <Badge className="absolute bottom-2 right-2 bg-black/70">
                        {artwork.image.split(",").length} images
                      </Badge>
                    )}
                  </div>

                  <CardHeader className="p-4 pb-0">
                    <CardTitle className="text-lg">{artwork.title}</CardTitle>
                    <CardDescription>
                      by {artwork.artist_name} • ${artwork.price}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="p-4">
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="outline">{artwork.category_name}</Badge>
                      {artwork.material && <Badge variant="outline">{artwork.material}</Badge>}
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {artwork.description || "No description provided."}
                    </p>

                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1" onClick={() => handleReject(artwork.id)}>
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="rejected" className="mt-0">
          {sortedArtworks.length === 0 ? (
            <div className="bg-muted/30 dark:bg-muted/10 rounded-lg p-8 text-center">
              <Filter className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No rejected artworks</h3>
              <p className="text-muted-foreground">No artworks have been rejected yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedArtworks.map((artwork) => (
                <Card key={artwork.id} className="overflow-hidden">
                  <div className="relative aspect-[4/3] group">
                    <img
                      src={getImageUrl(artwork.image) || "/placeholder.svg"}
                      alt={artwork.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button variant="secondary" size="sm" onClick={() => openLightbox(artwork)}>
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </div>

                    {artwork.image && artwork.image.includes(",") && (
                      <Badge className="absolute bottom-2 right-2 bg-black/70">
                        {artwork.image.split(",").length} images
                      </Badge>
                    )}
                  </div>

                  <CardHeader className="p-4 pb-0">
                    <CardTitle className="text-lg">{artwork.title}</CardTitle>
                    <CardDescription>
                      by {artwork.artist_name} • ${artwork.price}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="p-4">
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="outline">{artwork.category_name}</Badge>
                      {artwork.material && <Badge variant="outline">{artwork.material}</Badge>}
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {artwork.description || "No description provided."}
                    </p>

                    <div className="flex gap-2">
                      <Button className="flex-1" onClick={() => handleApprove(artwork.id)}>
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Lightbox for viewing artwork images */}
      {lightboxOpen && selectedArtwork && (
        <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
          <DialogContent className="max-w-4xl p-0 overflow-hidden bg-white dark:bg-gray-950">
            <DialogHeader className="p-4 border-b border-gray-200 dark:border-gray-800">
              <DialogTitle>{selectedArtwork.title}</DialogTitle>
              <DialogDescription>
                by {selectedArtwork.artist_name} • {selectedArtwork.category_name}
              </DialogDescription>
            </DialogHeader>

            <div className="relative">
              <div className="flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
                <img
                  src={getAllImages(selectedArtwork.image)[selectedImage] || "/placeholder.svg"}
                  alt={selectedArtwork.title}
                  className="max-h-[60vh] object-contain"
                />
              </div>

              {selectedArtwork.image && selectedArtwork.image.includes(",") && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white/90 dark:bg-black/50 dark:hover:bg-black/70 rounded-full"
                    onClick={() => navigateImage("prev")}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white/90 dark:bg-black/50 dark:hover:bg-black/70 rounded-full"
                    onClick={() => navigateImage("next")}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>

            {selectedArtwork.image && selectedArtwork.image.includes(",") && (
              <div className="p-4 border-t border-gray-200 dark:border-gray-800 overflow-x-auto">
                <div className="flex gap-2">
                  {getAllImages(selectedArtwork.image).map((image, index) => (
                    <button
                      key={index}
                      className={`relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-md ${
                        selectedImage === index ? "ring-2 ring-primary" : "ring-1 ring-gray-200 dark:ring-gray-800"
                      }`}
                      onClick={() => setSelectedImage(index)}
                    >
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`${selectedArtwork.title} - Image ${index + 1}`}
                        className="h-full w-full object-cover object-center"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="p-4 border-t border-gray-200 dark:border-gray-800">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <h3 className="text-sm font-medium">Price</h3>
                  <p className="text-sm text-muted-foreground">${selectedArtwork.price}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Dimensions</h3>
                  <p className="text-sm text-muted-foreground">{selectedArtwork.dimensions || "Not specified"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Material</h3>
                  <p className="text-sm text-muted-foreground">{selectedArtwork.material || "Not specified"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Upload Date</h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedArtwork.upload_date).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <h3 className="text-sm font-medium mb-1">Description</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedArtwork.description || "No description provided."}
                </p>
              </div>

              <div className="flex gap-2">
                {selectedArtwork.status === 0 && (
                  <>
                    <Button
                      className="flex-1"
                      onClick={() => {
                        handleApprove(selectedArtwork.id)
                        setLightboxOpen(false)
                      }}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      className="flex-1"
                      onClick={() => {
                        handleReject(selectedArtwork.id)
                        setLightboxOpen(false)
                      }}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  </>
                )}
                {selectedArtwork.status === 1 && (
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={() => {
                      handleReject(selectedArtwork.id)
                      setLightboxOpen(false)
                    }}
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                )}
                {selectedArtwork.status === 2 && (
                  <Button
                    className="flex-1"
                    onClick={() => {
                      handleApprove(selectedArtwork.id)
                      setLightboxOpen(false)
                    }}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

