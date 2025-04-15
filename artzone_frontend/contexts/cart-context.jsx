"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle2 } from "lucide-react"

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const { toast } = useToast()
  const [cartItems, setCartItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Load cart from localStorage on initial render
  useEffect(() => {
    const storedCart = localStorage.getItem("artzone-cart")
    if (storedCart) {
      try {
        setCartItems(JSON.parse(storedCart))
      } catch (error) {
        console.error("Error parsing cart from localStorage:", error)
      }
    }
    setIsLoading(false)
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("artzone-cart", JSON.stringify(cartItems))
    }
  }, [cartItems, isLoading])

  // Hàm xử lý hiển thị hình ảnh
  const getFirstImageUrl = (imageString) => {
    if (!imageString) return "/placeholder.svg?height=200&width=200"

    // Nếu có nhiều hình ảnh (phân tách bằng dấu phẩy), chỉ lấy hình đầu tiên
    const firstImage = imageString.split(",")[0].trim()

    // Nếu đường dẫn đã là URL đầy đủ, trả về nguyên dạng
    if (firstImage.startsWith("http")) {
      return firstImage
    }

    // Nếu đường dẫn bắt đầu bằng /api, trả về nguyên dạng
    if (firstImage.startsWith("/api")) {
      return firstImage
    }

    // Nếu đường dẫn bắt đầu bằng /uploads, thêm /api vào trước
    if (firstImage.startsWith("/uploads/")) {
      return `/api${firstImage}`
    }

    // Trường hợp còn lại, giả định là đường dẫn tương đối
    return `/api/uploads/${firstImage}`
  }

  // Add item to cart
  const addToCart = (artwork) => {
    // Xử lý hình ảnh trước khi thêm vào giỏ hàng
    const processedArtwork = {
      ...artwork,
      image: getFirstImageUrl(artwork.image),
    }

    setCartItems((prevItems) => {
      // Check if item already exists in cart
      const existingItemIndex = prevItems.findIndex((item) => item.id === processedArtwork.id)

      if (existingItemIndex !== -1) {
        // Item exists, update quantity
        const updatedItems = [...prevItems]
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + 1,
        }
        return updatedItems
      } else {
        // Item doesn't exist, add new item
        return [...prevItems, { ...processedArtwork, quantity: 1 }]
      }
    })

    toast({
      title: "Added to cart",
      description: `${artwork.title} has been added to your cart`,
      variant: "success",
      icon: <CheckCircle2 className="h-5 w-5 text-green-600" />,
    })
  }

  // Update item quantity
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return

    setCartItems((prevItems) => prevItems.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)))
  }

  // Remove item from cart
  const removeItem = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id))
  }

  // Clear cart
  const clearCart = () => {
    setCartItems([])
  }

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + Number.parseFloat(item.price) * item.quantity, 0)
  const shipping = subtotal > 0 ? subtotal * 0.02 : 0 // 2% of subtotal
  const total = subtotal + shipping

  const value = {
    cartItems,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    subtotal,
    shipping,
    total,
    isLoading,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === null) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
