"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { AlertCircle, CheckCircle2, Loader2, Upload, X } from "lucide-react"

export default function AddArtworkPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [selectedFiles, setSelectedFiles] = useState([])
  const [previews, setPreviews] = useState([])
  const [categoriesDebug, setCategoriesDebug] = useState(null) // For debugging

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    dimensions: "",
    material: "",
    category_id: "",
  })

  useEffect(() => {
    // Check if there is a token
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }

    // Fetch categories
    const fetchCategories = async () => {
      try {
        setIsLoading(true)
        const response = await fetch("/api/categories")

        if (!response.ok) {
          throw new Error("Unable to fetch categories list")
        }

        const data = await response.json()
        console.log("Categories data:", data) // Debug log
        setCategoriesDebug(data) // Store full data for debugging

        // Find art style categories - try both English and Vietnamese titles
        const artStyleCategories = data.find(
          (cat) => cat.title === "Art Style" || cat.title === "Phong Cách Nghệ Thuật",
        )

        if (artStyleCategories && artStyleCategories.items) {
          console.log("Found art style categories:", artStyleCategories.items.length)
          setCategories(artStyleCategories.items)
        } else {
          // If no specific category found, use all categories
          console.log("No specific art style category found, using all categories")
          const allCategories = data.flatMap((category) => category.items || [])
          setCategories(allCategories)
        }
      } catch (err) {
        console.error("Error fetching categories:", err)
        setError(err.message)
        toast({
          title: "Error",
          description: err.message,
          variant: "destructive",
          icon: <AlertCircle className="h-5 w-5" />,
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [router, toast])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files)

      // Limit number of files
      if (filesArray.length > 5) {
        toast({
          title: "Too many files",
          description: "You can upload a maximum of 5 images",
          variant: "destructive",
          icon: <AlertCircle className="h-5 w-5" />,
        })
        return
      }

      setSelectedFiles(filesArray)

      // Generate previews
      const newPreviews = filesArray.map((file) => URL.createObjectURL(file))
      setPreviews(newPreviews)
    }
  }

  const removeFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index))
    setPreviews((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate form
    if (!formData.title || !formData.price || !formData.category_id || selectedFiles.length === 0) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
        icon: <AlertCircle className="h-5 w-5" />,
      })
      return
    }

    setIsSubmitting(true)

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        router.push("/login")
        return
      }

      // Create FormData to send the file
      const submitFormData = new FormData()
      submitFormData.append("title", formData.title)
      submitFormData.append("description", formData.description)
      submitFormData.append("price", formData.price)
      submitFormData.append("dimensions", formData.dimensions)
      submitFormData.append("material", formData.material)
      submitFormData.append("category_id", formData.category_id)

      // Add files to FormData
      selectedFiles.forEach((file) => {
        submitFormData.append("images", file)
      })

      const response = await fetch("/api/artist/artworks", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: submitFormData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Unable to add artwork")
      }

      const data = await response.json()

      toast({
        title: "Success",
        description: "Artwork added successfully",
        variant: "success",
        icon: <CheckCircle2 className="h-5 w-5 text-green-600" />,
      })

      // Redirect to gallery page
      router.push("/artist/gallery")
    } catch (err) {
      console.error("Error adding artwork:", err)
      setError(err.message)
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
        icon: <AlertCircle className="h-5 w-5" />,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center py-10 px-4">
        <div className="w-full max-w-3xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Add New Artwork</CardTitle>
              <CardDescription>Fill in the information and upload your artwork images</CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                  An error occurred: {error}
                </div>
              )}

              {/* Debug information */}
              {categories.length === 0 && !isLoading && (
                <div className="bg-blue-50 border border-blue-200 text-blue-700 p-4 rounded-md mb-6">
                  <p className="font-medium">No categories found</p>
                  <p>Check the API response format or ensure categories are available in the database.</p>
                  {categoriesDebug && (
                    <details>
                      <summary className="cursor-pointer mt-2">View API Response</summary>
                      <pre className="text-xs mt-2 overflow-auto max-h-40 bg-blue-100 p-2 rounded">
                        {JSON.stringify(categoriesDebug, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">
                    Artwork Title <span className="text-red-500">*</span>
                  </Label>
                  <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="min-h-[120px]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">
                      Price <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      value={formData.price}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category_id">
                      Category <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.category_id}
                      onValueChange={(value) => handleSelectChange("category_id", value)}
                      required
                    >
                      <SelectTrigger id="category_id">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id.toString()}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dimensions">Dimensions</Label>
                    <Input
                      id="dimensions"
                      name="dimensions"
                      value={formData.dimensions}
                      onChange={handleChange}
                      placeholder="e.g., 60x80 cm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="material">Material</Label>
                    <Input
                      id="material"
                      name="material"
                      value={formData.material}
                      onChange={handleChange}
                      placeholder="e.g., Oil on canvas"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>
                    Images <span className="text-red-500">*</span>
                  </Label>
                  <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center">
                    <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">Drag and drop or click to upload images</p>
                    <p className="text-xs text-muted-foreground mb-4">Max 5 images, each no larger than 5MB</p>
                    <Input
                      id="images"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <Button type="button" variant="outline" onClick={() => document.getElementById("images").click()}>
                      Select Images
                    </Button>
                  </div>

                  {previews.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mt-4">
                      {previews.map((preview, index) => (
                        <div key={index} className="relative">
                          <img
                            src={preview || "/placeholder.svg"}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-md"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute -top-2 -right-2 bg-white rounded-full h-6 w-6 p-1 shadow-md"
                            onClick={() => removeFile(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.push("/artist/gallery")}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing
                      </>
                    ) : (
                      "Add Artwork"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
