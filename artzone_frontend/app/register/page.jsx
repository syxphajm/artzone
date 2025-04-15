"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { AlertCircle, CheckCircle2 } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [userRole, setUserRole] = useState("buyer")
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    // Artist specific fields
    pseudonym: "",
    year_of_birth: "",
    place_of_birth: "",
    nationality: "",
    education_training: "",
    main_art_style: "",
    about_me: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Reset error state
    setError("")

    // Validate form
    if (formData.password !== formData.confirmPassword) {
      setError("Password confirmation does not match")
      toast({
        title: "Password confirmation error",
        description: "Password and password confirmation do not match",
        variant: "destructive",
        icon: <AlertCircle className="h-5 w-5" />,
      })
      return
    }

    setIsLoading(true)

    try {
      // Prepare data for API
      const userData = {
        fullname: formData.fullname,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role_id: userRole === "buyer" ? 2 : 3, // 2 for buyer, 3 for artist
      }

      // Add artist data if role is artist
      if (userRole === "artist") {
        userData.artist = {
          pseudonym: formData.pseudonym,
          year_of_birth: formData.year_of_birth,
          place_of_birth: formData.place_of_birth,
          nationality: formData.nationality,
          education_training: formData.education_training,
          main_art_style: formData.main_art_style,
          about_me: formData.about_me,
        }
      }

      console.log("Sending registration data:", userData)

      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })

      // Check response before parsing JSON
      if (!response.ok) {
        const errorText = await response.text()
        console.error("Server response error:", errorText)

        let errorMessage
        try {
          const errorData = JSON.parse(errorText)
          errorMessage = errorData.message || "An error occurred during registration"
        } catch (e) {
          errorMessage = "Unable to connect to the server"
        }

        setError(errorMessage)
        toast({
          title: "Registration failed",
          description: errorMessage,
          variant: "destructive",
          icon: <AlertCircle className="h-5 w-5" />,
        })
        return
      }

      const data = await response.json()

      // Show success message
      toast({
        title: "Registration successful",
        description: "You can log in now",
        variant: "success",
        icon: <CheckCircle2 className="h-5 w-5 text-green-600" />,
      })

      // Redirect to login page after 2 seconds
      setTimeout(() => {
        router.push("/login")
      }, 2000)
    } catch (error) {
      console.error("Registration error:", error)
      setError("An error occurred while connecting to the server")
      toast({
        title: "Connection error",
        description: "An error occurred while connecting to the server",
        variant: "destructive",
        icon: <AlertCircle className="h-5 w-5" />,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center py-10 px-[30px]">
        <div className="w-full max-w-2xl">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">Create Account</CardTitle>
              <CardDescription className="text-center">Create a new account to experience ArtZone</CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="fullname">Full Name</Label>
                      <Input id="fullname" name="fullname" value={formData.fullname} onChange={handleChange} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} required />
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Role</Label>
                    <RadioGroup
                      defaultValue="buyer"
                      value={userRole}
                      onValueChange={setUserRole}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="buyer" id="buyer" />
                        <Label htmlFor="buyer">Buyer</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="artist" id="artist" />
                        <Label htmlFor="artist">Artist</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {userRole === "artist" && (
                    <div className="space-y-4 border-t pt-4">
                      <h3 className="font-medium">Artist Information</h3>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="pseudonym">Pseudonym (if any)</Label>
                          <Input id="pseudonym" name="pseudonym" value={formData.pseudonym} onChange={handleChange} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="year_of_birth">Year of Birth</Label>
                          <Input
                            id="year_of_birth"
                            name="year_of_birth"
                            value={formData.year_of_birth}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="place_of_birth">Place of Birth</Label>
                          <Input
                            id="place_of_birth"
                            name="place_of_birth"
                            value={formData.place_of_birth}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="nationality">Nationality</Label>
                          <Input
                            id="nationality"
                            name="nationality"
                            value={formData.nationality}
                            onChange={handleChange}
                          />
                        </div>
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
                        <Select
                          value={formData.main_art_style}
                          onValueChange={(value) => handleSelectChange("main_art_style", value)}
                        >
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
                          placeholder="Introduce yourself and your art style..."
                          value={formData.about_me}
                          onChange={handleChange}
                          className="min-h-[120px]"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Processing..." : "Register"}
                </Button>
              </form>

              <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <Link href="/login" className="text-primary hover:underline">
                  Log in
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}
