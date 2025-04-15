"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle2, Loader2 } from "lucide-react"

export default function ArtistProfileForm({ user, setUser }) {
  const { toast } = useToast()
  const artist = user.Artist || {}

  const [formData, setFormData] = useState({
    pseudonym: artist.pseudonym || "",
    year_of_birth: artist.year_of_birth || "",
    place_of_birth: artist.place_of_birth || "",
    nationality: artist.nationality || "",
    education_training: artist.education_training || "",
    main_art_style: artist.main_art_style || "",
    about_me: artist.about_me || "",
  })

  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("No authentication token")
      }

      const response = await fetch("/api/user/artist", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Could not update artist information")
      }

      const data = await response.json()

      // Update the user state
      setUser({
        ...user,
        Artist: data.artist,
      })

      toast({
        title: "Update Successful",
        description: "The artist information has been updated",
        variant: "success",
        icon: <CheckCircle2 className="h-5 w-5 text-green-600" />,
      })
    } catch (error) {
      console.error("Error updating artist information:", error)
      toast({
        title: "Error",
        description: error.message || "An error occurred while updating artist information",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="pseudonym">Pseudonym (if any)</Label>
        <Input id="pseudonym" name="pseudonym" value={formData.pseudonym} onChange={handleChange} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="year_of_birth">Year of Birth</Label>
          <Input id="year_of_birth" name="year_of_birth" value={formData.year_of_birth} onChange={handleChange} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="nationality">Nationality</Label>
          <Input id="nationality" name="nationality" value={formData.nationality} onChange={handleChange} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="place_of_birth">Place of Birth</Label>
        <Input id="place_of_birth" name="place_of_birth" value={formData.place_of_birth} onChange={handleChange} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="education_training">Education & Training</Label>
        <Input
          id="education_training"
          name="education_training"
          placeholder="University, art courses, self-taught, etc."
          value={formData.education_training}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="main_art_style">Main Art Style</Label>
        <Select value={formData.main_art_style} onValueChange={(value) => handleSelectChange("main_art_style", value)}>
          <SelectTrigger id="main_art_style">
            <SelectValue placeholder="Select art style" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="abstract">Abstract</SelectItem>
            <SelectItem value="realism">Realism</SelectItem>
            <SelectItem value="impressionism">Impressionism</SelectItem>
            <SelectItem value="minimalism">Minimalism</SelectItem>
            <SelectItem value="expressionism">Expressionism</SelectItem>
            <SelectItem value="cubism">Cubism</SelectItem>
            <SelectItem value="surrealism">Surrealism</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="about_me">About Me</Label>
        <Textarea
          id="about_me"
          name="about_me"
          placeholder="Introduce yourself and your artistic style..."
          value={formData.about_me}
          onChange={handleChange}
          className="min-h-[120px]"
        />
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing
          </>
        ) : (
          "Save Changes"
        )}
      </Button>
    </form>
  )
}
