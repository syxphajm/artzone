"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { Search, Palette, AlertCircle, MapPin, GraduationCap, User, RefreshCw } from "lucide-react"
import { Input } from "@/components/ui/input"
import { UserAvatar } from "@/components/user-avatar"

export default function ArtistsPage() {
  const [artists, setArtists] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  const fetchArtists = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log("Fetching artists data...")

      const response = await fetch("/api/artists")

      if (!response.ok) {
        console.error(`Error response status: ${response.status}`)
        const errorText = await response.text()
        console.error(`Error response text: ${errorText}`)
        throw new Error(`Failed to fetch artists: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      console.log(`Successfully fetched artists data: ${data.artists?.length || 0} artists`)
      setArtists(data.artists || [])
    } catch (error) {
      console.error("Error fetching artists:", error)
      setError(error.message)
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchArtists()
  }, [toast])

  // Filter artists based on search term
  const filteredArtists = artists.filter(
    (artist) =>
      artist.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      artist.pseudonym?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      artist.nationality?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      artist.main_art_style?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Function to get art style label
  const getArtStyleLabel = (style) => {
    const styles = {
      abstract: "abstract",
      realism: "realism",
      impressionism: "impressionism",
      minimalism: "minimalism",
      expressionism: "expressionism",
      cubism: "cubism",
      surrealism: "surrealism",
    }
    return styles[style] || style
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-10 px-[30px]">
          <div className="container">
            <div className="flex justify-between items-center mb-8">
              <div>
                <Skeleton className="h-10 w-64 mb-2" />
                <Skeleton className="h-5 w-96" />
              </div>
              <Skeleton className="h-10 w-64" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((_, index) => (
                <Skeleton key={index} className="h-[300px] w-full rounded-lg" />
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
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold">Artist</h1>
              <p className="text-muted-foreground mt-1">Discover talented artists on ArtZone</p>
            </div>
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Looking for artists..."
                className="pl-10 w-full md:w-[300px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-6">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                <p className="font-medium">Error loading artists</p>
              </div>
              <p className="mt-1">{error}</p>
              <Button variant="outline" size="sm" className="mt-2 flex items-center gap-1" onClick={fetchArtists}>
                <RefreshCw className="h-4 w-4" />
                Thử lại
              </Button>
            </div>
          )}

          {filteredArtists.length === 0 && !loading && !error ? (
            <div className="text-center py-12 bg-muted/30 rounded-lg">
              <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No artists found</h3>
              <p className="text-muted-foreground mb-6">
                {searchTerm ? "Thử tìm kiếm với từ khóa khác" : "Hiện chưa có nghệ sĩ nào"}
              </p>
              {searchTerm && (
                <Button variant="outline" onClick={() => setSearchTerm("")}>
                 Clear search
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArtists.map((artist) => (
                <Link key={artist.id} href={`/artists/${artist.id}`}>
                  <Card className="h-full overflow-hidden hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <UserAvatar
                          user={{ profile_picture: artist.profile_picture }}
                          className="h-16 w-16 border-2 border-primary/10"
                        />
                        <div>
                          <h3 className="font-bold text-lg">{artist.fullname}</h3>
                          {artist.pseudonym && <p className="text-muted-foreground text-sm">{artist.pseudonym}</p>}
                        </div>
                      </div>

                      <div className="space-y-3 mb-4">
                        {artist.nationality && (
                          <div className="flex items-center text-sm">
                            <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{artist.nationality}</span>
                          </div>
                        )}
                        {artist.education_training && (
                          <div className="flex items-center text-sm">
                            <GraduationCap className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span className="line-clamp-1">{artist.education_training}</span>
                          </div>
                        )}
                        {artist.main_art_style && (
                          <div className="flex items-center text-sm">
                            <Palette className="h-4 w-4 mr-2 text-muted-foreground" />
                            <span>{getArtStyleLabel(artist.main_art_style)}</span>
                          </div>
                        )}
                      </div>

                      {artist.about_me && (
                        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{artist.about_me}</p>
                      )}

                      <div className="flex justify-between items-center">
                        <Badge variant="outline" className="flex items-center">
                          <Palette className="h-3 w-3 mr-1" />
                          {artist.artworks_count} artworks
                        </Badge>
                        <Button variant="ghost" size="sm" className="text-primary">
                          View details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

