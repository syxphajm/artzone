"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserAvatar } from "@/components/user-avatar"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import ProfileForm from "./profile-form"
import PasswordForm from "./password-form"
import ArtistProfileForm from "./artist-profile-form"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import AvatarSelector from "./avatar-selector"

export default function ProfilePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [avatarDialogOpen, setAvatarDialogOpen] = useState(false)

  useEffect(() => {
    // Check if there is a token
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }

    // Fetch user data from API
    const fetchUserData = async () => {
      try {
        console.log("Fetching user data for profile page")
        const response = await fetch("/api/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        console.log("Profile page user data response status:", response.status)

        if (response.ok) {
          const data = await response.json()
          console.log("Profile page user data received:", data)
          setUser(data.user)
        } else {
          console.error("Failed to fetch user data for profile page:", response.status)
          // If the token is invalid, remove the token and redirect to login page
          localStorage.removeItem("token")
          router.push("/login")
          toast({
            title: "Session Expired",
            description: "Please log in again",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
        toast({
          title: "Error",
          description: "Unable to fetch user data",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [router, toast])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p>Loading information...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Cannot Access</CardTitle>
              <CardDescription>You need to log in to view this page</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => router.push("/login")}>Log In</Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    )
  }

  const isArtist = user.role_id === 3

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-1/4">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="relative group cursor-pointer" onClick={() => setAvatarDialogOpen(true)}>
                    <UserAvatar user={user} className="h-24 w-24 mb-4" />
                    <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <span className="text-white text-xs">Change</span>
                    </div>
                  </div>
                  <h2 className="text-xl font-bold">{user.fullname}</h2>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{user.phone}</p>
                  <div className="mt-2 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                    {user.role_id === 1 ? "Admin" : user.role_id === 3 ? "Artist" : "Buyer"}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main content */}
          <div className="flex-1">
            
            <h1 className="text-3xl font-bold mb-8">My Profile</h1>
            <Tabs defaultValue="profile">
              
              <TabsList className="mb-4">
                <TabsTrigger value="profile">Personal Information</TabsTrigger>
                <TabsTrigger value="password">Change Password</TabsTrigger>
                {isArtist && <TabsTrigger value="artist-profile">Artist Profile</TabsTrigger>}
              </TabsList>
              <TabsContent value="profile">
                
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your personal information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ProfileForm user={user} setUser={setUser} />
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="password">
                
                <Card>
                  <CardHeader>
                    <CardTitle>Change Password</CardTitle>
                    <CardDescription>Update your password</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <PasswordForm />
                  </CardContent>
                </Card>
              </TabsContent>
              
              {isArtist && (
                <TabsContent value="artist-profile">
                  <Card>
                    <CardHeader>
                      <CardTitle>Artist Profile</CardTitle>
                      <CardDescription>Update your artist information</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ArtistProfileForm user={user} setUser={setUser} />
                    </CardContent>
                  </Card>
                </TabsContent>
              )}
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />

      {/* Avatar selection dialog */}
      <Dialog open={avatarDialogOpen} onOpenChange={setAvatarDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <AvatarSelector user={user} setUser={setUser} onClose={() => setAvatarDialogOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
