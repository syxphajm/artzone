"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useCart } from "@/contexts/cart-context"
import { Minus, Plus, Trash2, ShoppingBag, Loader2, CheckCircle2, AlertCircle, ClipboardList } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function CartPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { cartItems, updateQuantity, removeItem, subtotal, shipping, total, clearCart } = useCart()
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isOrderComplete, setIsOrderComplete] = useState(false)
  const [orderCode, setOrderCode] = useState("")
  const [orderId, setOrderId] = useState(null)
  const [user, setUser] = useState(null)
  const [checkoutForm, setCheckoutForm] = useState({
    phone: "",
    address: "",
    note: "",
  })

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) return

        const response = await fetch("/api/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
          // Pre-fill phone from user data
          setCheckoutForm((prev) => ({
            ...prev,
            phone: data.user.phone || "",
          }))
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
      }
    }

    fetchUserData()
  }, [])

  const handleCheckoutFormChange = (e) => {
    const { name, value } = e.target
    setCheckoutForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleCheckout = () => {
    // Check if user is logged in
    const token = localStorage.getItem("token")
    if (!token) {
      toast({
        title: "Please log in",
        description: "You need to log in to continue checkout",
        variant: "destructive",
        icon: <AlertCircle className="h-5 w-5" />,
      })
      router.push("/login?redirect=/cart")
      return
    }

    setIsCheckoutOpen(true)
  }

  // Generate random order code (2 uppercase letters + 2 numbers)
  const generateOrderCode = () => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    const numbers = "0123456789"

    let code = ""

    // Add 2 random uppercase letters
    for (let i = 0; i < 2; i++) {
      code += letters.charAt(Math.floor(Math.random() * letters.length))
    }

    // Add 2 random numbers
    for (let i = 0; i < 2; i++) {
      code += numbers.charAt(Math.floor(Math.random() * numbers.length))
    }

    return code
  }

  const handlePlaceOrder = async () => {
    // Validate form
    if (!checkoutForm.phone || !checkoutForm.address) {
      toast({
        title: "Missing information",
        description: "Please fill in your phone number and shipping address",
        variant: "destructive",
        icon: <AlertCircle className="h-5 w-5" />,
      })
      return
    }

    setIsSubmitting(true)

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        throw new Error("No authentication token")
      }

      // Generate a random order code
      const code = generateOrderCode()
      setOrderCode(code)
      console.log("Generated order code:", code)

      // Prepare order data - convert price from string to number
      const orderData = {
        items: cartItems.map((item) => ({
          artwork_id: item.id,
          quantity: item.quantity,
          price: Number.parseFloat(item.price),
        })),
        total_amount: total,
        phone: checkoutForm.phone,
        address: checkoutForm.address,
        note: checkoutForm.note || "",
        code: code, // Add the order code
      }

      console.log("Sending order data:", orderData)

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      })

      // Check response before parsing JSON
      if (!response.ok) {
        const errorText = await response.text()
        console.error("Server response error:", errorText)

        let errorMessage
        try {
          const errorData = JSON.parse(errorText)
          errorMessage = errorData.message || "An error occurred while placing your order"
        } catch (e) {
          errorMessage = "Could not connect to server"
        }

        throw new Error(errorMessage)
      }

      const data = await response.json()
      setOrderId(data.order_id)

      // Show success message
      setIsOrderComplete(true)

      // Clear cart
      clearCart()
    } catch (error) {
      console.error("Error placing order:", error)
      toast({
        title: "Order error",
        description: error.message || "An error occurred while placing your order",
        variant: "destructive",
        icon: <AlertCircle className="h-5 w-5" />,
      })
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-10 px-[30px]">
        <div className="container">
          <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                <ShoppingBag className="h-8 w-8 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground mb-6">Explore our collection and add some artworks to your cart.</p>
              <div className="flex flex-col gap-4 items-center">
                <Button asChild>
                  <Link href="/artworks">Continue Shopping</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/orders">
                    <ClipboardList className="mr-2 h-4 w-4" />
                    View All Orders
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="rounded-lg border">
                  <div className="p-4 md:p-6">
                    <h2 className="text-xl font-semibold mb-4">Products</h2>

                    <div className="space-y-6">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex flex-col sm:flex-row gap-4">
                          <div className="flex-shrink-0">
                            <img
                              src={item.image || "/placeholder.svg"}
                              alt={item.title}
                              className="w-24 h-24 object-cover rounded-md"
                            />
                          </div>
                          <div className="flex-1 flex flex-col">
                            <div className="flex-1">
                              <h3 className="font-medium">{item.title}</h3>
                              <p className="text-sm text-muted-foreground">by {item.artist}</p>
                            </div>
                            <div className="flex justify-between items-end">
                              <div className="flex items-center border rounded-md">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 rounded-none"
                                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="w-8 text-center">{item.quantity}</span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 rounded-none"
                                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                              <div className="flex items-center gap-4">
                                <span className="font-medium">${Number.parseFloat(item.price).toLocaleString()}</span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-muted-foreground hover:text-destructive"
                                  onClick={() => removeItem(item.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>${subtotal.toLocaleString()}</span>
                      </div>
                      {shipping > 0 && (
                        <div className="flex justify-between">
                          <span>Shipping (2%)</span>
                          <span>${shipping.toLocaleString()}</span>
                        </div>
                      )}
                      <Separator />
                      <div className="flex justify-between font-medium">
                        <span>Total</span>
                        <span>${total.toLocaleString()}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col gap-4">
                    <Button className="w-full" onClick={handleCheckout}>
                      Checkout
                    </Button>

                  </CardFooter>
                </Card>
                <div className="mt-6">
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/orders">
                      <ClipboardList className="mr-2 h-4 w-4" />
                      View All Orders
                    </Link>
                  </Button>
                </div>
                <div className="mt-6">
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/artworks">Continue Shopping</Link>
                  </Button>
                </div>

              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />

      {/* Checkout Dialog */}
      <Dialog open={isCheckoutOpen && !isOrderComplete} onOpenChange={setIsCheckoutOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Checkout Information</DialogTitle>
            <DialogDescription>Please fill in your shipping information to complete your order.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                value={checkoutForm.phone}
                onChange={handleCheckoutFormChange}
                placeholder="Enter your phone number"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Shipping Address</Label>
              <Textarea
                id="address"
                name="address"
                value={checkoutForm.address}
                onChange={handleCheckoutFormChange}
                placeholder="Enter your detailed shipping address"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="note">Notes (optional)</Label>
              <Textarea
                id="note"
                name="note"
                value={checkoutForm.note}
                onChange={handleCheckoutFormChange}
                placeholder="Any special instructions for delivery"
              />
            </div>

            <div className="bg-muted p-4 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>${subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Shipping (2%):</span>
                <span>${shipping.toLocaleString()}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-medium">
                <span>Total:</span>
                <span>${total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCheckoutOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={handlePlaceOrder} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Place Order"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Order Complete Dialog */}
      <Dialog
        open={isOrderComplete}
        onOpenChange={(open) => {
          if (!open) {
            setIsOrderComplete(false)
            setIsCheckoutOpen(false)
            router.push(`/orders/${orderId}`)
          }
        }}
      >
        <DialogContent className="sm:max-w-[500px]">
          <div className="flex flex-col items-center justify-center py-6">
            <div className="rounded-full bg-green-100 p-3 mb-4">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Thank You!</h2>
            <p className="text-center mb-6">Your order has been placed successfully.</p>
            <p className="text-center mb-6">
              Order Code: <span className="font-bold">{orderCode}</span>
            </p>

            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => {
                  setIsOrderComplete(false)
                  setIsCheckoutOpen(false)
                  router.push("/artworks")
                }}
              >
                Continue Shopping
              </Button>
              <Button
                onClick={() => {
                  setIsOrderComplete(false)
                  setIsCheckoutOpen(false)
                  router.push(`/orders/${orderId}`)
                }}
              >
                View Order
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
