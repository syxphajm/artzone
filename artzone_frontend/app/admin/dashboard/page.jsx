"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import {
  Users,
  Palette,
  DollarSign,
  ShoppingCart,
  TrendingUp,
  ArrowUpRight,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react"

export default function AdminDashboardPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    totalArtworks: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    recentActivities: [],
    pendingApprovals: [],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("No authentication token found")
      }

      // Fetch dashboard data
      const response = await fetch("/api/admin/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem("token")
          toast({
            title: "Session expired",
            description: "Please log in again to continue",
            variant: "destructive",
            icon: <AlertCircle className="h-5 w-5" />,
          })
          router.push("/login")
          return
        }

        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || "Failed to fetch dashboard data")
      }

      const data = await response.json()
      setDashboardData(data)
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      setError(error.message)
      toast({
        title: "Error",
        description: error.message || "Failed to load dashboard data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleLogoutAndRelogin = () => {
    localStorage.removeItem("token")
    toast({
      title: "Logged out",
      description: "Please log in again to fix token issues",
      variant: "default",
    })
    router.push("/login")
  }

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount)
  }

  // Add or update this function to properly handle comma-separated image paths
  const getImageUrl = (imageString) => {
    if (!imageString) return "/placeholder.svg"

    // Split the image string by commas and take only the first image
    const images = imageString.split(",")
    const imagePath = images[0].trim()

    // Check if path starts with http
    if (imagePath.startsWith("http")) {
      return imagePath
    }

    // If path starts with /uploads, add /api prefix
    if (imagePath.startsWith("/uploads/")) {
      return `/api${imagePath}`
    }

    // If path doesn't start with /, add /api/uploads/
    if (!imagePath.startsWith("/")) {
      return `/api/uploads/${imagePath}`
    }

    return imagePath
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
        <span>Loading dashboard data...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 p-4 rounded-md flex flex-col items-start">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold">Error loading dashboard data</h3>
            <p>{error}</p>
          </div>
        </div>
        <div className="mt-4">
          <Button variant="outline" size="sm" onClick={fetchDashboardData} className="mr-2">
            Try Again
          </Button>
          <Button variant="outline" size="sm" onClick={handleLogoutAndRelogin} className="flex items-center">
            <RefreshCw className="mr-2 h-4 w-4" />
            Log in again to fix
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your admin dashboard</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.totalUsers.toLocaleString()}</div>
            <div className="flex items-center pt-1 text-xs text-green-500">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              <span>+{dashboardData.newUsersPercent || 0}% from last month</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Artworks</CardTitle>
            <Palette className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.totalArtworks.toLocaleString()}</div>
            <div className="flex items-center pt-1 text-xs text-green-500">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              <span>+{dashboardData.newArtworksPercent || 0}% from last month</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(dashboardData.totalRevenue)}</div>
            <div className="flex items-center pt-1 text-xs text-green-500">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              <span>+{dashboardData.revenueGrowthPercent || 0}% from last month</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.pendingOrders.toLocaleString()}</div>
            <div className="flex items-center pt-1 text-xs text-green-500">
              <TrendingUp className="h-3 w-3 mr-1" />
              <span>Active orders</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest actions on the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.recentActivities && dashboardData.recentActivities.length > 0 ? (
                dashboardData.recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className={`h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary`}>
                      {activity.type === "user" && <Users className="h-4 w-4" />}
                      {activity.type === "artwork" && <Palette className="h-4 w-4" />}
                      {activity.type === "order" && <ShoppingCart className="h-4 w-4" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">{activity.description}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground">No recent activities</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pending Approvals</CardTitle>
            <CardDescription>Artworks waiting for review</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dashboardData.pendingApprovals && dashboardData.pendingApprovals.length > 0 ? (
                dashboardData.pendingApprovals.map((artwork, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-md overflow-hidden bg-muted">
                      <img
                        src={getImageUrl(artwork.image) || "/placeholder.svg"}
                        alt="Artwork thumbnail"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{artwork.title}</p>
                      <p className="text-xs text-muted-foreground">by {artwork.artist_name}</p>
                    </div>
                    <div className="text-xs text-muted-foreground">{artwork.time}</div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground">No pending approvals</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
