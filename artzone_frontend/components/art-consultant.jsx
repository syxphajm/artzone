"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Bot, Send, User, X, Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

export function ArtConsultant({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      role: "bot",
      content:
        "Hello! I'm ArtBot, the virtual assistant of ArtZone. I can help you find artwork that matches your preferences. What style are you interested in or what price range are you looking for?",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const [suggestedPrompts, setSuggestedPrompts] = useState([
    "I like abstract paintings",
    "Realistic works",
    "Paintings for the living room",
    "I want landscapes",
    "Modern paintings, do you have them?",
    "I like black and white",
    "Do you have portraits?",
    "I'm looking for nature paintings",
    "Minimalist paintings, please suggest",
  ])

  // Scroll to the latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Handle sending messages
  const handleSend = async () => {
    if (!input.trim()) return

    // Add user message to the list
    const userMessage = { role: "user", content: input }
    setMessages((prev) => [...prev, userMessage])

    // Save current message and clear input
    const currentMessage = input
    setInput("")
    setIsLoading(true)

    try {
      // Send message to API
      const response = await fetch("/api/art-consultation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: currentMessage }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log("Bot response:", data)

      // Add bot message to the list
      const botMessage = {
        role: "bot",
        content: data.text,
        recommendations: data.recommendations || [],
      }

      setMessages((prev) => [...prev, botMessage])

      // Update suggested prompts based on context
      updateSuggestedPrompts(data, currentMessage)
    } catch (error) {
      console.error("Error getting consultation:", error)

      // Add error message
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          content: "Sorry, an error occurred while processing your request. Please try again later.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  // Update suggested prompts based on context
  const updateSuggestedPrompts = (data, lastMessage) => {
    if (data.recommendations?.length > 0) {
      setSuggestedPrompts([
        "Do you have anything more subtle?",
        "I like this but the color isn't right",
        "Do you have similar artworks?",
        "Show me a few more options",
      ])
    } else if (
      lastMessage.toLowerCase().includes("cheap") ||
      lastMessage.toLowerCase().includes("inexpensive") ||
      lastMessage.toLowerCase().includes("giá rẻ")
    ) {
      setSuggestedPrompts([
        "I want to see more affordable options",
        "Show me paintings under $800",
        "Are there any discounts available?",
        "What's your cheapest artwork?",
      ])
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // Process image URL
  const getImageUrl = (imageString) => {
    if (!imageString) return "/placeholder.svg"

    // Split image string
    const images = imageString.split(",")
    const imagePath = images[0].trim()

    // If path starts with http or https, use directly
    if (imagePath.startsWith("http")) {
      return imagePath
    }

    // If path starts with /uploads/, add /api prefix
    if (imagePath.startsWith("/uploads/")) {
      return `/api${imagePath}`
    }

    // If path doesn't start with /, add /api/uploads/
    if (!imagePath.startsWith("/")) {
      return `/api/uploads/${imagePath}`
    }

    // Otherwise, return original path
    return imagePath
  }

  const handleSuggestedPrompt = (prompt) => {
    setInput(prompt)
    // Optional: automatically send the message
    // setTimeout(() => handleSend(), 100)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-lg shadow-lg w-full max-w-md flex flex-col h-[600px] max-h-[90vh]">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center">
            <Bot className="h-5 w-5 mr-2 text-primary" />
            <h2 className="font-semibold">ArtBot - Art Assistant</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`flex max-w-[80%] ${
                    message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                  } rounded-lg px-3 py-2`}
                >
                  <div className="flex-shrink-0 mr-2 mt-1">
                    {message.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </div>
                  <div>
                    <div className="whitespace-pre-line text-sm">{message.content}</div>

                    {/* Display artwork recommendations if available */}
                    {message.recommendations && message.recommendations.length > 0 && (
                      <div className="mt-2 space-y-2">
                        {message.recommendations.map((artwork) => (
                          <Card key={artwork.id} className="overflow-hidden">
                            <CardContent className="p-2">
                              <div className="flex gap-2">
                                <div className="flex-shrink-0">
                                  <img
                                    src={getImageUrl(artwork.image) || "/placeholder.svg"}
                                    alt={artwork.title}
                                    className="h-16 w-16 object-cover rounded"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <Link
                                    href={`/artworks/${artwork.id}`}
                                    className="text-xs font-medium hover:underline line-clamp-1"
                                  >
                                    {artwork.title}
                                  </Link>
                                  <p className="text-xs text-muted-foreground line-clamp-1">
                                    {artwork.artist_name || "Unknown artist"}
                                  </p>
                                  <p className="text-xs font-medium">${artwork.price}</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg px-3 py-2 flex items-center">
                  <Bot className="h-4 w-4 mr-2" />
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <Separator />

        <div className="p-4 flex flex-col gap-2">
          {messages.length <= 2 && (
            <div className="mb-2">
              <p className="text-sm text-muted-foreground mb-2">Try asking:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedPrompts.map((prompt, index) => (
                  <Button key={index} variant="outline" size="sm" onClick={() => handleSuggestedPrompt(prompt)}>
                    {prompt}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Input
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
            />
            <Button size="icon" onClick={handleSend} disabled={isLoading || !input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
