"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { AlertCircle, Palette } from "lucide-react"

export default function CategoriesPage() {
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
          throw new Error("Không thể lấy danh sách danh mục")
        }

        const data = await response.json()
        setCategories(data)
      } catch (err) {
        console.error("Lỗi khi lấy danh mục:", err)
        setError(err.message)
        toast({
          title: "Lỗi",
          description: err.message,
          variant: "destructive",
          icon: <AlertCircle className="h-5 w-5" />,
        })
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [toast])

  // Loading skeleton
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-10 px-[30px]">
          <div className="container">
            <Skeleton className="h-10 w-64 mb-8" />

            <div className="space-y-12">
              {[1, 2].map((_, index) => (
                <div key={index}>
                  <Skeleton className="h-8 w-48 mb-4" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((_, itemIndex) => (
                      <Skeleton key={itemIndex} className="h-40 w-full" />
                    ))}
                  </div>
                </div>
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
          <h1 className="text-3xl font-bold mb-8">Danh Mục Nghệ Thuật</h1>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                <span>Có lỗi xảy ra: {error}</span>
              </div>
            </div>
          )}

          {categories.length === 0 && !loading && !error ? (
            <div className="text-center py-12 bg-muted/30 rounded-lg">
              <Palette className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Không có danh mục nào</h3>
              <p className="text-muted-foreground">Hiện chưa có danh mục nghệ thuật nào trong hệ thống</p>
            </div>
          ) : (
            <div className="space-y-12">
              {categories.map((category, index) => (
                <div key={index}>
                  <h2 className="text-2xl font-semibold mb-6">{category.title}</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {category.items.map((item, itemIndex) => (
                      <Link key={itemIndex} href={`/categories/${item.id}`}>
                        <Card className="overflow-hidden h-full transition-transform hover:scale-105">
                          <div className="relative h-40">
                            <img
                              src={item.image || "/placeholder.svg?height=300&width=300"}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                              <div className="text-center text-white">
                                <h3 className="font-semibold text-lg">{item.name}</h3>
                                <p className="text-sm">{item.count || 0} artworks</p>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
