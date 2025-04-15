"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle2, Loader2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UserAvatar } from "@/components/user-avatar"
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

// List of default avatars
const DEFAULT_AVATARS = [
  // New avatars from users
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/9653cdef422295a55df52506fc108e57.jpg-b0YqoycdYYgyqjF9cQKlH2JrRihDmx.jpeg", // Character with short black hair, red background
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/c1e2678fffcde71a14a6856a158b7f62.jpg-DJ9qDwQWbkE0TQ1JvfGUzFHork4LHZ.jpeg", // Character with curly hair, red background
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/00abd9564318bcd03abeeda380f08b19.jpg-2Em6wCURIlkKYop0himKp55YAzhPOa.jpeg", // Cat with glasses
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/330f9833fabd7fc13d9ebe8c1b4016e1.jpg-NgtVa8JGbkyTMDvMzkEZYmoXc2gHpR.jpeg", // Character with a baseball cap
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1ac312780e071afd063527c1c01a529a.jpg-tPMnub1HOSVHAafeFPmWetqEqMQCpf.jpeg", // Female character with brown hair and glasses
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ddd4f480bd5f3ddb561ae1b70ba60f74.jpg-vUVSpHHeLlxmcEvpxk58tlQ0NcjzmJ.jpeg", // Female character with black hair
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/c65b4aa73ee5c8c9ec8bfb641b4175b2.jpg-aQGgn3lkCh3JNvkoJ0fz3roVLqwspd.jpeg", // Character with black hair, white shirt
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/d19c143d61847e8bcfb5983b7af4cf63.jpg-HLiMIOtXvdsdtBYmdkwvfPWRmJ4ro9.jpeg", // Character with curly brown hair
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ec5247c993852fe0ffdfe82102e570c5.jpg-2mtfJCZyOcNCfhqRsHXUEXw0zH8LJF.jpeg", // Character with a blue paper face
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/eed4b615981b421f8a6eb50ee3cd1e12.jpg-IRwpFPHr8eU8VTSsayIinOTDeF07El.jpeg", // Character in a purple hoodie

  // Retain old default avatars if necessary
  "/avatars/avatar-1.png",
  "/avatars/avatar-2.png",
  "/avatars/avatar-3.png",
  "/avatars/avatar-4.png",
]

export default function AvatarSelector({ user, setUser, onClose }) {
  const { toast } = useToast()
  const [selectedAvatar, setSelectedAvatar] = useState(user.profile_picture || null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSelectAvatar = (avatarUrl) => {
    setSelectedAvatar(avatarUrl)
  }

  const handleSaveAvatar = async () => {
    if (!selectedAvatar) {
      toast({
        title: "Error",
        description: "Please select an avatar",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("No authentication token")
      }

      const response = await fetch("/api/user/avatar", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          profile_picture: selectedAvatar,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Unable to update avatar")
      }

      const data = await response.json()

      // Update user state
      setUser({
        ...user,
        profile_picture: selectedAvatar,
      })

      toast({
        title: "Update Successful",
        description: "Avatar has been updated",
        variant: "success",
        icon: <CheckCircle2 className="h-5 w-5 text-green-600" />,
      })

      // Close dialog
      if (onClose) onClose()
    } catch (error) {
      console.error("Error updating avatar:", error)
      toast({
        title: "Error",
        description: error.message || "An error occurred while updating avatar",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Choose Profile Picture</DialogTitle>
        <DialogDescription>Select a profile picture from our collection</DialogDescription>
      </DialogHeader>

      <div className="space-y-6 py-4">
        <div className="flex flex-col items-center">
          <div className="mb-4">
            <UserAvatar user={{ ...user, profile_picture: selectedAvatar }} className="h-24 w-24" />
          </div>
          <p className="text-sm text-muted-foreground mb-2">Selected Avatar</p>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 max-h-[300px] overflow-y-auto p-1">
          {DEFAULT_AVATARS.map((avatar, index) => (
            <div
              key={index}
              className={`relative cursor-pointer rounded-md overflow-hidden transition-all ${
                selectedAvatar === avatar ? "ring-2 ring-primary" : "hover:ring-1 hover:ring-primary/50"
              }`}
              onClick={() => handleSelectAvatar(avatar)}
            >
              <Avatar className="h-16 w-16">
                <AvatarImage src={avatar} alt={`Avatar ${index + 1}`} />
                <AvatarFallback>A{index + 1}</AvatarFallback>
              </Avatar>
              {selectedAvatar === avatar && (
                <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSaveAvatar} disabled={isLoading || selectedAvatar === user.profile_picture}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing
            </>
          ) : (
            "Save Avatar"
          )}
        </Button>
      </div>
    </>
  )
}
