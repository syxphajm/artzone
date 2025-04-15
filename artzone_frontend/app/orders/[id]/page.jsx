"use client"

import React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { Loader2, AlertCircle, ChevronLeft, Package, Clock, MapPin, Phone, XCircle } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function OrderConfirmationPage({ params }) {
  // Unwrap params Promise
  const unwrappedParams = React.use(params)
  const orderId = unwrappedParams.id

  const router = useRouter()
  const { toast } = useToast()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isCanceling, setIsCanceling] = useState(false)
  const [showCancelDialog, setShowCancelDialog] = useState(false)

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem("token")

        if (!token) {
          router.push("/login")
          return
        }

        const response = await fetch(`/api/orders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          if (response.status === 404) {
            router.push("/404")
            return
          }
          throw new Error("Failed to fetch order data")
        }

        const data = await response.json()
        setOrder(data.order)
      } catch (error) {
        console.error("Error fetching order:", error)
        setError(error.message)
        toast({
          title: "Error",
          description: "Failed to load order details",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (orderId) {
      fetchOrderData()
    }
  }, [orderId, router, toast])

  // Fixed image URL function to handle comma-separated paths correctly
  const getImageUrl = (imageString) => {
    if (!imageString) return "/placeholder.svg"

    // Split the image string by commas and take only the first image
    const images = imageString.split(",")
    const imagePath = images[0].trim()

    // Loại bỏ khoảng trắng
    const trimmedPath = imagePath.trim()

    // Nếu đường dẫn bắt đầu bằng http hoặc https, sử dụng trực tiếp
    if (trimmedPath.startsWith("http")) {
      return trimmedPath
    }

    // Nếu đường dẫn bắt đầu bằng /uploads/, thêm /api vào trước
    if (trimmedPath.startsWith("/uploads/")) {
      return `/api${trimmedPath}`
    }

    // Nếu đường dẫn không có / ở đầu, thêm /api/uploads/
    if (!trimmedPath.startsWith("/")) {
      return `/api/uploads/${trimmedPath}`
    }

    // Trường hợp khác, trả về đường dẫn gốc
    return trimmedPath
  }

  // Handle order cancellation
  const handleCancelOrder = async () => {
    setIsCanceling(true)
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        router.push("/login")
        return
      }

      const response = await fetch(`/api/orders/${orderId}/cancel`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || "Failed to cancel order")
      }

      toast({
        title: "Order canceled",
        description: "Your order has been canceled successfully",
        variant: "success",
      })

      // Redirect to orders page after successful cancellation
      router.push("/orders")
    } catch (error) {
      console.error("Error canceling order:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to cancel order",
        variant: "destructive",
      })
    } finally {
      setIsCanceling(false)
      setShowCancelDialog(false)
    }
  }

  // Format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" }
    return new Date(dateString).toLocaleDateString("en-US", options)
  }

  // Get status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case 0:
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">Pending</span>
      case 1:
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">Processing</span>
      case 2:
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Delivered</span>
      case 3:
        return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">Canceled</span>
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">Unknown</span>
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Loading order details...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 py-10 px-[30px]">
          <div className="container">
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-6">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 mr-2" />
                <p className="font-medium">Error loading order</p>
              </div>
              <p className="mt-1">{error}</p>
            </div>
            <Button variant="outline" onClick={() => router.push("/")}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to home
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!order) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-10 px-[30px]">
        <div className="container">
          <Button variant="outline" onClick={() => router.push("/orders")} className="mb-4">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Button>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Order {order.code ? `${order.code}` : `#${order.id}`}</h1>
              <p className="text-muted-foreground">Placed on {formatDate(order.order_date)}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="mr-2">Status:</div>
              {getStatusBadge(order.status)}

              {order.status === 0 && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setShowCancelDialog(true)}
                  disabled={isCanceling}
                >
                  {isCanceling ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <XCircle className="h-4 w-4 mr-2" />
                  )}
                  Cancel Order
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Order Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-shrink-0">
                          <img
                            src={getImageUrl(item.image) || "/placeholder.svg"}
                            alt={item.title}
                            className="w-24 h-24 object-cover rounded-md"
                          />
                        </div>
                        <div className="flex-1 flex flex-col">
                          <div className="flex-1">
                            <h3 className="font-medium">{item.title}</h3>
                            <p className="text-sm text-muted-foreground">by {item.artist_name}</p>
                          </div>
                          <div className="flex justify-between items-end">
                            <span className="text-sm">Quantity: {item.quantity}</span>
                            <span className="font-medium">${item.price.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${(order.total_amount * 0.98).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping (2%)</span>
                      <span>${(order.total_amount * 0.02).toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-medium">
                      <span>Total</span>
                      <span>${order.total_amount.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Shipping Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <Phone className="h-5 w-5 mr-3 text-muted-foreground mt-0.5" />
                      <div>
                        <h4 className="font-medium">Phone Number</h4>
                        <p className="text-sm text-muted-foreground">{order.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 mr-3 text-muted-foreground mt-0.5" />
                      <div>
                        <h4 className="font-medium">Shipping Address</h4>
                        <p className="text-sm text-muted-foreground">{order.address}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Clock className="h-5 w-5 mr-3 text-muted-foreground mt-0.5" />
                      <div>
                        <h4 className="font-medium">Estimated Delivery Time</h4>
                        <p className="text-sm text-muted-foreground">5-7 business days</p>
                      </div>
                    </div>
                    {order.note && (
                      <div className="flex items-start">
                        <Package className="h-5 w-5 mr-3 text-muted-foreground mt-0.5" />
                        <div>
                          <h4 className="font-medium">Notes</h4>
                          <p className="text-sm text-muted-foreground">{order.note}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <div className="flex flex-col gap-4">
                <Button asChild>
                  <Link href="/orders">View All Orders</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/artworks">Continue Shopping</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {/* Cancel Order Confirmation Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Order</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this order? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isCanceling}>No, keep order</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault()
                handleCancelOrder()
              }}
              disabled={isCanceling}
              className="bg-red-500 hover:bg-red-600"
            >
              {isCanceling ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Canceling...
                </>
              ) : (
                "Yes, cancel order"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
