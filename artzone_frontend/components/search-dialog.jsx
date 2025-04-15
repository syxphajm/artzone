"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Loader2, Search, X } from "lucide-react"
import Link from "next/link"

export function SearchDialog({ open, onOpenChange }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!open) {
      // Reset state when dialog closes
      setSearchTerm("")
      setResults([])
      setLoading(false)
    }
  }, [open])

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm.trim().length >= 2) {
        performSearch()
      } else {
        setResults([])
      }
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [searchTerm])

  const performSearch = async () => {
    setLoading(true)
    try {
      // Simulate search results - in reality you would call an API
      // const response = await fetch(`/api/search?q=${encodeURIComponent(searchTerm)}`)
      // const data = await response.json()

      // Sample data
      const mockResults = [
        {
          type: "artwork",
          id: 1,
          title: "Abstract Harmony",
          artist: "Michael Johnson",
        },
        {
          type: "artist",
          id: 2,
          name: "Sarah Williams",
        },
        {
          type: "category",
          id: 3,
          name: "Impressionism",
        },
      ]

      // Simulate network delay
      setTimeout(() => {
        setResults(mockResults)
        setLoading(false)
      }, 500)
    } catch (error) {
      console.error("Search error:", error)
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0">
        <DialogHeader className="px-4 pt-4 pb-2">
          <DialogTitle>Search</DialogTitle>
        </DialogHeader>
        <div className="px-4 pb-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search for artwork, artist, category..."
              className="pl-10 pr-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7"
                onClick={() => setSearchTerm("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="max-h-[300px] overflow-y-auto px-4 pb-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-4">
              {results.map((result) => (
                <div key={`${result.type}-${result.id}`} className="border-b pb-2">
                  <Link
                    href={
                      result.type === "artwork"
                        ? `/artworks/${result.id}`
                        : result.type === "artist"
                          ? `/artists/${result.id}`
                          : `/categories/${result.id}`
                    }
                    className="block hover:bg-muted p-2 rounded"
                    onClick={() => onOpenChange(false)}
                  >
                    <div className="font-medium">{result.type === "artwork" ? result.title : result.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {result.type === "artwork"
                        ? `Artwork by ${result.artist}`
                        : result.type === "artist"
                          ? "Artist"
                          : "Category"}
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          ) : searchTerm.trim().length >= 2 ? (
            <div className="text-center py-8 text-muted-foreground">No results found for "{searchTerm}"</div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  )
}
