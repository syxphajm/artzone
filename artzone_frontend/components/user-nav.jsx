"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { UserAvatar } from "@/components/user-avatar"
import { LogOut, Settings, User, Palette, LayoutDashboard, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function UserNav() {
  const router = useRouter()
  const { toast } = useToast()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Hàm để lấy thông tin người dùng
  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        setLoading(false)
        setUser(null)
        return
      }

      console.log("Fetching user data with token:", token.substring(0, 10) + "...")

      const response = await fetch("/api/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      console.log("User data response status:", response.status)

      if (response.ok) {
        const data = await response.json()
        console.log("User data received:", data)
        setUser(data.user)
      } else {
        console.error("Failed to fetch user data:", response.status)
        // Nếu token không hợp lệ, xóa token
        localStorage.removeItem("token")
        setUser(null)

        // Hiển thị thông báo lỗi token
        toast({
          title: "Session expired",
          description: "Please log in again",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUserData()

    // Thêm event listener để cập nhật khi có thay đổi trong localStorage
    const handleStorageChange = (e) => {
      if (e.key === "token") {
        fetchUserData()
      }
    }

    window.addEventListener("storage", handleStorageChange)

    // Thêm một custom event để cập nhật khi đăng nhập
    const handleLoginEvent = () => {
      console.log("Login event detected, refreshing user data")
      fetchUserData()
    }

    window.addEventListener("login", handleLoginEvent)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("login", handleLoginEvent)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("token")
    setUser(null)
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account",
      variant: "default",
    })
    router.push("/login")
  }

  // Thêm một hàm để xử lý đăng xuất và đăng nhập lại
  const handleLogoutAndRelogin = () => {
    localStorage.removeItem("token")
    toast({
      title: "Logged out",
      description: "Please log in again to fix token issues",
      variant: "default",
    })
    router.push("/login")
  }

  if (loading) {
    return (
      <Button variant="ghost" size="icon" disabled>
        <User className="h-5 w-5" />
      </Button>
    )
  }

  if (!user) {
    return (
      <Button variant="ghost" size="icon" asChild>
        <Link href="/login">
          <User className="h-5 w-5" />
          <span className="sr-only">Account</span>
        </Link>
      </Button>
    )
  }

  const isAdmin = user.role_id === 1
  const isArtist = user.role_id === 3

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <UserAvatar user={user} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.fullname}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile" className="flex items-center">
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </Link>
        </DropdownMenuItem>

        {isAdmin && (
          <DropdownMenuItem asChild>
            <Link href="/admin/dashboard" className="flex items-center">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              <span>Admin Dashboard</span>
            </Link>
          </DropdownMenuItem>
        )}

        {isArtist && (
          <DropdownMenuItem asChild>
            <Link href="/artist/gallery" className="flex items-center">
              <Palette className="mr-2 h-4 w-4" />
              <span>My Art Gallery</span>
            </Link>
          </DropdownMenuItem>
        )}

        
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="flex items-center">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
        
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
