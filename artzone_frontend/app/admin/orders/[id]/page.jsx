"use client"

import React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { Loader2, AlertCircle, ChevronLeft, Package, MapPin, XCircle, CheckCircle, TruckIcon } from "lucide-react"
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

export default function AdminOrderDetailPage({ params }) {
  // Unwrap params Promise
  const unwrappedParams = React.use(params)
  const orderId = unwrappedParams.id

  const router = useRouter()
  const { toast } = useToast()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showActionDialog, setShowActionDialog] = useState(false)
  const [actionType, setActionType] = useState(null)

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem("token")

        if (!token) {
          router.push("/login")
          return
        }

        const response = await fetch(`/api/admin/orders/${orderId}`, {
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

  // Handle order status update
  const handleUpdateStatus = async (newStatus) => {
    setIsProcessing(true)
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        router.push("/login")
        return
      }

      const response = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to update order status")
      }

      toast({
        title: "Status updated",
        description: "Order status has been updated successfully",
        variant: "success",
      })

      // Refresh order data
      const updatedResponse = await fetch(`/api/admin/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (updatedResponse.ok) {
        const data = await updatedResponse.json()
        setOrder(data.order)
      }
    } catch (error) {
      console.error("Error updating order status:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to update order status",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
      setShowActionDialog(false)
    }
  }

  const confirmStatusChange = (status) => {
    setActionType(status)
    setShowActionDialog(true)
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
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
        <span>Loading order details...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 p-4 rounded-md flex flex-col items-start">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold">Error loading order</h3>
            <p>{error}</p>
          </div>
        </div>
        <div className="mt-4">
          <Button variant="outline" size="sm" onClick={() => router.push("/admin/orders")}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Button>
        </div>
      </div>
    )
  }

  if (!order) {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => router.push("/admin/orders")}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Orders
        </Button>
        <div className="flex items-center gap-2">
          {order.status === 0 && (
            <Button
              variant="default"
              className="bg-blue-500 hover:bg-blue-600"
              onClick={() => confirmStatusChange(1)}
              disabled={isProcessing}
            >
              <TruckIcon className="mr-2 h-4 w-4" />
              Mark as Processing
            </Button>
          )}
          {order.status === 1 && (
            <Button
              variant="default"
              className="bg-green-500 hover:bg-green-600"
              onClick={() => confirmStatusChange(2)}
              disabled={isProcessing}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Mark as Delivered
            </Button>
          )}
          {order.status !== 3 && order.status !== 2 && (
            <Button variant="destructive" onClick={() => confirmStatusChange(3)} disabled={isProcessing}>
              <XCircle className="mr-2 h-4 w-4" />
              Cancel Order
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Order {order.code || `#${order.id}`}</h1>
          <p className="text-muted-foreground">Placed on {formatDate(order.order_date)}</p>
        </div>
        <div className="flex items-center">
          <div className="mr-2">Status:</div>
          {getStatusBadge(order.status)}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {order.items?.map((item) => (
                  <div key={item.id} className="flex flex-col sm:flex-row gap-4 border-b pb-4">
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
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">Name</h3>
                  <p className="text-sm">{order.fullname}</p>
                </div>
                <div>
                  <h3 className="font-medium">Email</h3>
                  <p className="text-sm">{order.email}</p>
                </div>
                <div>
                  <h3 className="font-medium">Phone</h3>
                  <p className="text-sm">{order.phone}</p>
                </div>
              </div>
            </CardContent>
          </Card>

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
                  <MapPin className="h-5 w-5 mr-3 text-muted-foreground mt-0.5" />
                  <div>
                    <h4 className="font-medium">Shipping Address</h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{order.address}</p>
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
        </div>
      </div>

      {/* Status Change Confirmation Dialog */}
      <AlertDialog open={showActionDialog} onOpenChange={setShowActionDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionType === 1 && "Process Order"}
              {actionType === 2 && "Mark as Delivered"}
              {actionType === 3 && "Cancel Order"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionType === 1 && "Are you sure you want to mark this order as processing?"}
              {actionType === 2 && "Are you sure you want to mark this order as delivered?"}
              {actionType === 3 && "Are you sure you want to cancel this order? This action cannot be undone."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>No, go back</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault()
                handleUpdateStatus(actionType)
              }}
              disabled={isProcessing}
              className={
                actionType === 1
                  ? "bg-blue-500 hover:bg-blue-600"
                  : actionType === 2
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-red-500 hover:bg-red-600"
              }
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Yes, confirm"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
