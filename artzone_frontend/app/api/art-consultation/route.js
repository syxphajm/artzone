import { NextResponse } from "next/server"

const anthropicKey = process.env.ANTHROPIC_API_KEY;

// Fetch artworks from your database
async function fetchArtworks(filters = {}) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
    let url = `${baseUrl}/api/artworks?status=1`

    // Add search parameters if available
    if (filters.category) url += `&category=${filters.category}`
    if (filters.maxPrice) url += `&maxPrice=${filters.maxPrice}`
    if (filters.minPrice) url += `&minPrice=${filters.minPrice}`

    console.log("Fetching artworks from:", url)
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error("Failed to fetch artworks")
    }

    const data = await response.json()
    console.log("Fetched artworks:", data.artworks?.length || 0)
    return data.artworks || []
  } catch (error) {
    console.error("Error fetching artworks:", error)
    return []
  }
}

// Format artworks for prompt
function formatArtworksForPrompt(artworks) {
  if (!artworks || artworks.length === 0) {
    return "No artworks available in the database."
  }

  return artworks
    .map(
      (artwork) => `
ID: ${artwork.id}
Title: ${artwork.title}
Artist: ${artwork.artist_name || "Unknown"}
Price: $${artwork.price}
Category: ${artwork.category_name || "Uncategorized"}
Image: ${artwork.image || "No image available"}
`,
    )
    .join("\n")
}

// Extract artwork recommendations from response
function extractArtworkRecommendations(response, availableArtworks) {
  // Look for artwork IDs in the response
  const idMatches = response.match(/ID: (\d+)/g) || []
  const ids = idMatches.map((match) => Number.parseInt(match.replace("ID: ", ""), 10))

  // Find matching artworks
  const recommendations = ids
    .map((id) => availableArtworks.find((artwork) => artwork.id === id))
    .filter((artwork) => artwork !== undefined)

  return recommendations
}

// Mock response function (fallback if API call fails)
function generateMockResponse(message, artworks) {
  // Simple keyword matching for demonstration
  const lowerMessage = message.toLowerCase()

  // Default response
  let response =
    "Hello! I'm ArtBot. I can help you find artwork that matches your preferences. What style are you interested in or what price range are you looking for?"

  // Extract recommended artworks based on simple rules
  let recommendedArtworks = []

  // Check for price mentions
  let maxPrice = null
  if (
    lowerMessage.includes("under $1000") ||
    lowerMessage.includes("below $1000") ||
    lowerMessage.includes("less than $1000")
  ) {
    maxPrice = 1000
  } else if (lowerMessage.includes("under $2000") || lowerMessage.includes("below $2000")) {
    maxPrice = 2000
  }

  // Filter by price if mentioned
  let filteredArtworks = [...artworks]
  if (maxPrice) {
    filteredArtworks = filteredArtworks.filter((artwork) => Number(artwork.price) <= maxPrice)
    response = `Here are some artworks under ${maxPrice} that you might like:`
  }

  // Check for style mentions
  const styles = {
    abstract: "Abstract",
    landscape: "Landscape",
    portrait: "Portrait",
    modern: "Modern",
    contemporary: "Contemporary",
    minimalist: "Minimalist",
  }

  let mentionedStyle = null
  for (const [keyword, style] of Object.entries(styles)) {
    if (lowerMessage.includes(keyword)) {
      mentionedStyle = style
      break
    }
  }

  // Filter by style if mentioned
  if (mentionedStyle) {
    filteredArtworks = filteredArtworks.filter(
      (artwork) =>
        artwork.category_name?.toLowerCase().includes(mentionedStyle.toLowerCase()) ||
        artwork.description?.toLowerCase().includes(mentionedStyle.toLowerCase()),
    )

    if (maxPrice) {
      response = `Here are some ${mentionedStyle.toLowerCase()} artworks under ${maxPrice}:`
    } else {
      response = `Here are some ${mentionedStyle.toLowerCase()} artworks you might enjoy:`
    }
  }

  // Select up to 5 recommendations
  recommendedArtworks = filteredArtworks.slice(0, 5)

  // Add artwork details to response
  if (recommendedArtworks.length > 0) {
    recommendedArtworks.forEach((artwork, index) => {
      response += `\n\nID: ${artwork.id}\n"${artwork.title}" by ${artwork.artist_name || "Unknown"}\nPrice: ${artwork.price}\n${artwork.description || ""}`
    })

    response += "\n\nWhich artwork interests you? Or would you like to see more options?"
  } else if (maxPrice || mentionedStyle) {
    response =
      "I'm sorry, I couldn't find any artworks matching your criteria. Would you like to try different criteria?"
  }

  return { text: response, recommendations: recommendedArtworks }
}

export async function POST(req) {
  try {
    const body = await req.json()
    const { message } = body

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    console.log("Received message:", message)

    // Fetch artworks from your database
    const artworks = await fetchArtworks()

    // If no artworks found, return a simple response
    if (!artworks || artworks.length === 0) {
      return NextResponse.json({
        text: "I'm sorry, I couldn't find any artworks in our database. Please try again later.",
        recommendations: [],
      })
    }

    // Format artworks for prompt
    const artworksText = formatArtworksForPrompt(artworks)

    // Create prompt for Claude
    const systemPrompt = `You are ArtBot, an AI assistant for an art gallery called ArtZone. Your job is to help users find artworks they might like based on their preferences.

AVAILABLE ARTWORKS:
${artworksText}

Based on the user's query and the available artworks, recommend appropriate artworks. If the user mentions a price range (like "under $1000"), ONLY recommend artworks within that price range. If the user mentions a style (like "abstract" or "landscape"), prioritize artworks in that category.

Format your response in a friendly, helpful manner. For each artwork you recommend, start with "ID: [artwork_id]" on a separate line, then provide details about the artwork (maximum 5 recommendations).

If the user is just saying hello or asking a general question about art styles or pricing, respond appropriately without specific artwork recommendations.

IMPORTANT RULES:
1. If the user asks for artworks under a specific price (e.g., "under $1000"), NEVER recommend artworks above that price.
2. Always respond in the same language the user used in their query.
3. If the user asks in Vietnamese, respond in Vietnamese.
4. If the user asks in English, respond in English.
5. Always include the ID for each artwork you recommend.`

    try {
      // Call Claude API directly
      console.log("Calling Claude API...")
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-3-haiku-20240307",
          max_tokens: 1000,
          temperature: 0.7,
          system: systemPrompt,
          messages: [
            {
              role: "user",
              content: message,
            },
          ],
        }),
      })

      if (!response.ok) {
        const errorData = await response.text()
        console.error("Claude API error:", errorData)
        throw new Error(`Claude API error: ${response.status} ${errorData}`)
      }

      const data = await response.json()
      console.log("Claude response received")

      // Extract the text from Claude's response
      const text = data.content[0].text

      // Extract recommendations
      const recommendations = extractArtworkRecommendations(text, artworks)

      return NextResponse.json({
        text,
        recommendations,
      })
    } catch (error) {
      console.error("Error calling Claude API:", error)

      // Fall back to mock response
      console.log("Using mock response generator after API error")
      const mockResponse = generateMockResponse(message, artworks)
      return NextResponse.json(mockResponse)
    }
  } catch (error) {
    console.error("Error in art consultation API:", error)
    return NextResponse.json({ error: "Server error: " + error.message }, { status: 500 })
  }
}
