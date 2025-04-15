"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import {
  Loader2,
  AlertCircle,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  TruckIcon,
  Package,
  Eye,
  RefreshCw,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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

export default function AdminOrdersPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [orderDetailsOpen, setOrderDetailsOpen] = useState(false)
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [actionType, setActionType] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      setError(null)

      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("No authentication token found")
      }

      const response = await fetch("/api/admin/orders", {
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
        throw new Error(errorData.message || "Failed to fetch orders")
      }

      const data = await response.json()
      setOrders(data.orders || [])
    } catch (error) {
      console.error("Error fetching orders:", error)
      setError(error.message)
      toast({
        title: "Error",
        description: error.message || "Failed to load orders",
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

  const handleViewOrder = (order) => {
    setSelectedOrder(order)
    setOrderDetailsOpen(true)
  }

  const handleUpdateStatus = async (orderId, newStatus) => {
    setIsProcessing(true)
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("No authentication token found")
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
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || "Failed to update order status")
      }

      toast({
        title: "Success",
        description: `Order status updated successfully`,
        variant: "success",
        icon: <CheckCircle className="h-5 w-5 text-green-600" />,
      })

      // Refresh orders list
      fetchOrders()

      // Close dialog if open
      setConfirmDialogOpen(false)

      // Update selected order if details dialog is open
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({
          ...selectedOrder,
          status: newStatus,
        })
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
    }
  }

  const confirmStatusChange = (order, status) => {
    setSelectedOrder(order)
    setActionType(status)
    setConfirmDialogOpen(true)
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
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Pending</Badge>
      case 1:
        return <Badge className="bg-blue-500 hover:bg-blue-600">Processing</Badge>
      case 2:
        return <Badge className="bg-green-500 hover:bg-green-600">Delivered</Badge>
      case 3:
        return <Badge className="bg-red-500 hover:bg-red-600">Canceled</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  // Filter orders based on search and status
  const filteredOrders = orders.filter((order) => {
    // Filter by status
    if (statusFilter !== "all" && order.status !== Number.parseInt(statusFilter)) {
      return false
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      return (
        order.code?.toLowerCase().includes(term) ||
        order.id.toString().includes(term) ||
        order.fullname?.toLowerCase().includes(term) ||
        order.email?.toLowerCase().includes(term) ||
        order.phone?.toLowerCase().includes(term)
      )
    }

    return true
  })

  // Get image URL
  const getImageUrl = (imageString) => {
    if (!imageString) return "/placeholder.svg"

    // Split image string and get first image
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
        <span>Loading orders...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 p-4 rounded-md flex flex-col items-start">
        <div className="flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-semibold">Error loading orders</h3>
            <p>{error}</p>
          </div>
        </div>
        <div className="mt-4">
          <Button variant="outline" size="sm" onClick={fetchOrders} className="mr-2">
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Order Management</h1>
          <p className="text-muted-foreground">Manage and process customer orders</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full sm:w-[200px] md:w-[300px]"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="0">Pending</SelectItem>
              <SelectItem value="1">Processing</SelectItem>
              <SelectItem value="2">Delivered</SelectItem>
              <SelectItem value="3">Canceled</SelectItem>
            </SelectContent>
          </Select>

          
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">{filteredOrders.length} orders found</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Pending: {orders.filter((a) => a.status === 0).length} | Processing:{" "}
            {orders.filter((a) => a.status === 1).length} | Delivered: {orders.filter((a) => a.status === 2).length} |
            Canceled: {orders.filter((a) => a.status === 3).length}
          </span>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="bg-muted/30 dark:bg-muted/10 rounded-lg p-8 text-center">
          <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No orders found</h3>
          <p className="text-muted-foreground">Try adjusting your filters</p>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.code || `#${order.id}`}</TableCell>
                    <TableCell>{formatDate(order.order_date)}</TableCell>
                    <TableCell>
                      <div className="font-medium">{order.fullname}</div>
                      <div className="text-sm text-muted-foreground">{order.email}</div>
                    </TableCell>
                    <TableCell>{order.item_count}</TableCell>
                    <TableCell>${order.total_amount.toLocaleString()}</TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleViewOrder(order)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        {order.status === 0 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-blue-500 hover:text-blue-700"
                            onClick={() => confirmStatusChange(order, 1)}
                          >
                            <TruckIcon className="h-4 w-4" />
                          </Button>
                        )}
                        {order.status === 1 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-green-500 hover:text-green-700"
                            onClick={() => confirmStatusChange(order, 2)}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                        {order.status !== 3 && order.status !== 2 && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-700"
                            onClick={() => confirmStatusChange(order, 3)}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Order Details Dialog */}
      <Dialog open={orderDetailsOpen} onOpenChange={setOrderDetailsOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Order Details - {selectedOrder?.code || `#${selectedOrder?.id}`}</DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div>
                  <h3 className="font-medium">Customer Information</h3>
                  <p className="text-sm">{selectedOrder.fullname}</p>
                  <p className="text-sm">{selectedOrder.email}</p>
                  <p className="text-sm">{selectedOrder.phone}</p>
                </div>
                <div>
                  <h3 className="font-medium">Order Information</h3>
                  <p className="text-sm">Date: {formatDate(selectedOrder.order_date)}</p>
                  <p className="text-sm">Status: {getStatusBadge(selectedOrder.status)}</p>
                  <p className="text-sm">Total: ${selectedOrder.total_amount.toLocaleString()}</p>
                </div>
                <div>
                  <h3 className="font-medium">Shipping Address</h3>
                  <p className="text-sm whitespace-pre-wrap">{selectedOrder.address}</p>
                </div>
              </div>

              <Tabs defaultValue="items">
                <TabsList>
                  <TabsTrigger value="items">Order Items</TabsTrigger>
                  <TabsTrigger value="notes">Notes</TabsTrigger>
                </TabsList>
                <TabsContent value="items" className="space-y-4">
                  {selectedOrder.items?.map((item) => (
                    <div key={item.id} className="flex gap-4 border-b pb-4">
                      <div className="flex-shrink-0">
                        <img
                          src={getImageUrl(item.image) || "/placeholder.svg"}
                          alt={item.title}
                          className="w-20 h-20 object-cover rounded"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{item.title}</h4>
                        <p className="text-sm text-muted-foreground">by {item.artist_name}</p>
                        <div className="flex justify-between mt-2">
                          <span className="text-sm">Quantity: {item.quantity}</span>
                          <span className="font-medium">${item.price.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </TabsContent>
                <TabsContent value="notes">
                  <div className="p-4 bg-muted rounded-md">
                    <p className="text-sm whitespace-pre-wrap">{selectedOrder.note || "No notes provided"}</p>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setOrderDetailsOpen(false)}>
                  Close
                </Button>
                {selectedOrder.status === 0 && (
                  <Button
                    variant="default"
                    className="bg-blue-500 hover:bg-blue-600"
                    onClick={() => confirmStatusChange(selectedOrder, 1)}
                  >
                    <TruckIcon className="mr-2 h-4 w-4" />
                    Mark as Processing
                  </Button>
                )}
                {selectedOrder.status === 1 && (
                  <Button
                    variant="default"
                    className="bg-green-500 hover:bg-green-600"
                    onClick={() => confirmStatusChange(selectedOrder, 2)}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Mark as Delivered
                  </Button>
                )}
                {selectedOrder.status !== 3 && selectedOrder.status !== 2 && (
                  <Button variant="destructive" onClick={() => confirmStatusChange(selectedOrder, 3)}>
                    <XCircle className="mr-2 h-4 w-4" />
                    Cancel Order
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
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
                handleUpdateStatus(selectedOrder.id, actionType)
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
