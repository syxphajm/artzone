"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function Artists() {
  const [artists, setArtists] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { toast } = useToast()

  useEffect(() => {
    // Đảm bảo chỉ lấy 4 nghệ sĩ từ API
    const fetchArtists = async () => {
      try {
        setLoading(true)
        // Fetch artists from API with limit=4 to get only 4 featured artists
        console.log("Fetching featured artists with limit=4")
        const response = await fetch("/api/artists?limit=4")

        if (!response.ok) {
          throw new Error("Failed to fetch artists")
        }

        const data = await response.json()
        console.log(`Received ${data.artists?.length || 0} featured artists`)

        // Ensure we only display exactly 4 artists
        const limitedArtists = data.artists?.slice(0, 4) || []
        console.log(`Displaying ${limitedArtists.length} artists after limiting`)

        setArtists(limitedArtists)
      } catch (error) {
        console.error("Error fetching artists:", error)
        setError(error.message)
        toast({
          title: "Error",
          description: "Failed to load featured artists",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchArtists()
  }, [toast])

  if (loading) {
    return (
      <section className="py-16 container">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold mb-2">Featured Artists</h2>
            <p className="text-muted-foreground">Meet the talented creators behind our collection</p>
          </div>
          <Button asChild>
            <Link href="/artists">View All Artists</Link>
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
            <h2 className="text-3xl font-bold mb-2">Featured Artists</h2>
            <p className="text-muted-foreground">Meet the talented creators behind our collection</p>
          </div>
          <Button asChild>
            <Link href="/artists">View All Artists</Link>
          </Button>
        </div>
        <div className="text-center py-12 text-red-500">
          <p>Failed to load artists. Please try again later.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 container">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-3xl font-bold mb-2">Featured Artists</h2>
          <p className="text-muted-foreground">Meet the talented creators behind our collection</p>
        </div>
        <Button asChild>
          <Link href="/artists">View All Artists</Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {artists.length > 0 ? (
          artists.map((artist) => (
            <Card key={artist.id} className="text-center">
              <CardContent className="pt-6">
                <Avatar className="h-24 w-24 mx-auto mb-4">
                  <AvatarImage src={artist.profile_picture || "/placeholder.svg"} alt={artist.fullname} />
                  <AvatarFallback>
                    {artist.fullname
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-semibold text-lg">{artist.fullname}</h3>
                <p className="text-muted-foreground text-sm mb-2">
                  {artist.Artist?.main_art_style ? getStyleName(artist.Artist.main_art_style) : "Artist"}
                </p>
                <p className="text-sm mb-4">{artist.artworks_count || 0} artworks</p>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/artists/${artist.Artist?.id || artist.id}`}>View Profile</Link>
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-muted-foreground">No featured artists available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  )
}

// Helper function to convert style code to display name
function getStyleName(styleCode) {
  const styleMap = {
    abstract: "Abstract Painter",
    realism: "Realism Artist",
    impressionism: "Impressionist Painter",
    minimalism: "Minimalist Artist",
    surrealism: "Surrealist Artist",
    expressionism: "Expressionist Artist",
    cubism: "Cubist Artist",
    contemporary: "Contemporary Artist",
    digital: "Digital Artist",
  }

  return styleMap[styleCode] || "Visual Artist"
}
