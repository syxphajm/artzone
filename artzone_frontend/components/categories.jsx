"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function Categories() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/categories")

        if (!response.ok) {
          throw new Error("Failed to fetch categories")
        }

        const data = await response.json()

        // Flatten the categories structure if needed
        let flattenedCategories = []
        if (Array.isArray(data) && data.length > 0 && data[0].items) {
          // If the API returns a nested structure like [{title: "...", items: [...]}]
          flattenedCategories = data[0].items || []
        } else {
          // If the API returns a flat array
          flattenedCategories = data
        }

        setCategories(flattenedCategories)
      } catch (error) {
        console.error("Error fetching categories:", error)
        setError(error.message)
        toast({
          title: "Error",
          description: "Failed to load categories",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [toast])

  if (loading) {
    return (
      <section className="py-16 bg-muted">
        <div className="container">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-2">Browse by Category</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our diverse collection of artworks across various styles and mediums
            </p>
          </div>
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-16 bg-muted">
        <div className="container">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-2">Browse by Category</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our diverse collection of artworks across various styles and mediums
            </p>
          </div>
          <div className="text-center py-12 text-red-500">
            <p>Failed to load categories. Please try again later.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-muted">
      <div className="container">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-2">Browse by Category</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore our diverse collection of artworks across various styles and mediums
          </p>
        </div>
        {categories.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
            {categories.map((category) => (
              <Link key={category.id} href={`/categories/${category.id}`}>
                <Card className="overflow-hidden h-full transition-transform hover:scale-105">
                  <div className="relative h-40">
                    <img
                      src={category.image || "/placeholder.svg?height=300&width=300"}
                      alt={category.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="text-center text-white">
                        <h3 className="font-semibold text-lg">{category.name}</h3>
                        <p className="text-sm">{category.count || 0} artworks</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No categories available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  )
}
