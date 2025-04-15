import { NextResponse } from "next/server"

// English greeting responses
const GREETING_RESPONSES = [
  "Hi there! I'm ArtBot. What kind of artwork are you looking for today?",
  "Hello! I'm here to help you find the perfect artwork. What's your style preference?",
  "Welcome to ArtZone! I can help you discover amazing artworks. What interests you?",
]

// Get a random response from an array
function getRandomResponse(responses) {
  return responses[Math.floor(Math.random() * responses.length)]
}

// Fetch artworks from backend
async function fetchArtworks(filters = {}) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
    let url = `${baseUrl}/api/artworks?status=1`

    // Add search parameters if available
    if (filters.category) url += `&category=${filters.category}`
    if (filters.priceRange === "low") url += `&maxPrice=1000`
    if (filters.priceRange === "medium") url += `&minPrice=1000&maxPrice=2000`
    if (filters.priceRange === "high") url += `&minPrice=2000`

    console.log("Fetching artworks from:", url)
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error("Failed to fetch artworks")
    }

    const data = await response.json()
    console.log("Fetched artworks:", data.artworks?.length || 0)

    // If no actual data, return mock data
    if (!data.artworks || data.artworks.length === 0) {
      return getMockArtworks(filters)
    }

    // Sort by price if requested
    const artworks = data.artworks || []
    if (filters.priceRange === "low") {
      artworks.sort((a, b) => a.price - b.price)
    } else if (filters.priceRange === "high") {
      artworks.sort((a, b) => b.price - a.price)
    }

    return artworks
  } catch (error) {
    console.error("Error fetching artworks:", error)
    // Return mock data in case of error
    return getMockArtworks(filters)
  }
}

// Fetch artist information from backend
async function fetchArtists(style = null) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
    const url = `${baseUrl}/api/artists`

    console.log("Fetching artists from:", url)
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error("Failed to fetch artists")
    }

    const data = await response.json()
    console.log("Fetched artists:", data.artists?.length || 0)

    // If no actual data, return mock data
    if (!data.artists || data.artists.length === 0) {
      return getMockArtists(style)
    }

    // Filter artists by style if provided
    let artists = data.artists || []
    if (style) {
      artists = artists.filter(
        (artist) => artist.main_art_style && artist.main_art_style.toLowerCase().includes(style.toLowerCase()),
      )
    }

    return artists
  } catch (error) {
    console.error("Error fetching artists:", error)
    // Return mock data in case of error
    return getMockArtists(style)
  }
}

// Create mock data to ensure there are always artworks to recommend
function getMockArtworks(filters = {}) {
  console.log("Getting mock artworks with filters:", filters)

  const mockArtworks = [
    {
      id: 1,
      title: "Abstract Colors",
      artist_name: "John Smith",
      price: 1200,
      description: "An abstract piece with contrasting colors that create depth and emotion",
      category_name: "Abstract",
      image: "/placeholder.svg?height=400&width=300",
    },
    {
      id: 2,
      title: "Sunrise Over Ocean",
      artist_name: "Emily Johnson",
      price: 950,
      description: "A beautiful sunrise over the ocean with vibrant colors, bringing peace and tranquility",
      category_name: "Impressionism",
      image: "/placeholder.svg?height=400&width=300",
    },
    {
      id: 3,
      title: "City Streets",
      artist_name: "Michael Brown",
      price: 1500,
      description:
        "A realistic depiction of city streets with authentic details, capturing cultural and historical beauty",
      category_name: "Realism",
      image: "/placeholder.svg?height=400&width=300",
    },
    {
      id: 4,
      title: "Minimalist Space",
      artist_name: "Sarah Davis",
      price: 800,
      description: "A minimalist piece with simple lines but deep meaning, expressing profound philosophy about life",
      category_name: "Minimalism",
      image: "/placeholder.svg?height=400&width=300",
    },
    {
      id: 5,
      title: "Dreamscape",
      artist_name: "Robert Wilson",
      price: 1100,
      description: "A surreal artwork with overlapping images, creating a dreamy and mysterious feeling",
      category_name: "Surrealism",
      image: "/placeholder.svg?height=400&width=300",
    },
    {
      id: 6,
      title: "Spring Flowers",
      artist_name: "Jennifer Lee",
      price: 750,
      description: "A vibrant painting of spring flowers with bright colors, bringing the fresh atmosphere of spring",
      category_name: "Impressionism",
      image: "/placeholder.svg?height=400&width=300",
    },
    {
      id: 7,
      title: "Mountain Landscape",
      artist_name: "David Miller",
      price: 1300,
      description: "A majestic mountain landscape with rich colors, showing the grandeur of nature",
      category_name: "Landscape",
      image: "/placeholder.svg?height=400&width=300",
    },
    {
      id: 8,
      title: "Unique Perspective",
      artist_name: "Lisa Anderson",
      price: 1800,
      description: "A unique artwork with a distinctive style, combining various techniques and materials",
      category_name: "Contemporary",
      image: "/placeholder.svg?height=400&width=300",
    },
    {
      id: 9,
      title: "Simple Yet Intriguing",
      artist_name: "Thomas Clark",
      price: 600,
      description: "A simple yet intriguing piece with subtle details that make viewers contemplate",
      category_name: "Minimalism",
      image: "/placeholder.svg?height=400&width=300",
    },
    {
      id: 10,
      title: "Colors of Life",
      artist_name: "Karen White",
      price: 2000,
      description:
        "A colorful painting representing the richness and diversity of life, bringing positive and joyful feelings",
      category_name: "Expressionism",
      image: "/placeholder.svg?height=400&width=300",
    },
    // Additional abstract artworks to ensure enough suggestions
    {
      id: 11,
      title: "Abstract Shapes",
      artist_name: "Daniel Taylor",
      price: 1400,
      description: "An abstract artwork with diverse shapes, creating a unique three-dimensional space",
      category_name: "Abstract",
      image: "/placeholder.svg?height=400&width=300",
    },
    {
      id: 12,
      title: "Emotional Flow",
      artist_name: "Michelle Garcia",
      price: 1600,
      description: "An abstract piece expressing the flow of emotions through moving color fields",
      category_name: "Abstract",
      image: "/placeholder.svg?height=400&width=300",
    },
    {
      id: 13,
      title: "Beautiful Seascape",
      artist_name: "Nancy Wilson",
      price: 1250,
      description: "A stunning seascape with waves and a blue sky",
      category_name: "Landscape",
      image: "/placeholder.svg?height=400&width=300",
    },
    {
      id: 14,
      title: "Unique Creation",
      artist_name: "Paul Martinez",
      price: 1900,
      description: "A unique artwork with a distinctive style that cannot be mistaken",
      category_name: "Contemporary",
      image: "/placeholder.svg?height=400&width=300",
    },
  ]

  // Filter by conditions
  let filteredArtworks = [...mockArtworks]

  // Filter by style/category
  if (filters.category) {
    console.log(`Filtering by category: ${filters.category}`)
    const categoryMap = {
      abstract: "Abstract",
      realism: "Realism",
      impressionism: "Impressionism",
      minimalism: "Minimalism",
      surrealism: "Surrealism",
      landscape: "Landscape",
      contemporary: "Contemporary",
      expressionism: "Expressionism",
      unique: "Unique",
    }

    const categoryName = categoryMap[filters.category] || filters.category
    console.log(`Looking for category: ${categoryName}`)

    filteredArtworks = filteredArtworks.filter((artwork) => {
      const match = artwork.category_name && artwork.category_name.toLowerCase().includes(categoryName.toLowerCase())
      if (match) {
        console.log(`Matched artwork: ${artwork.title} - ${artwork.category_name}`)
      }
      return match
    })

    // If no exact matches found, try searching in descriptions
    if (filteredArtworks.length === 0) {
      console.log(`No exact category matches, searching in descriptions`)
      filteredArtworks = mockArtworks.filter((artwork) =>
        artwork.description.toLowerCase().includes(categoryName.toLowerCase()),
      )
    }

    // Special handling for "unique"
    if (filters.category === "unique" && filteredArtworks.length === 0) {
      console.log(`Looking for unique artworks`)
      filteredArtworks = mockArtworks.filter(
        (artwork) =>
          artwork.description.toLowerCase().includes("unique") ||
          artwork.description.toLowerCase().includes("distinctive") ||
          artwork.category_name.toLowerCase().includes("contemporary"),
      )
    }
  }

  // Filter by special keywords
  if (filters.keywords && filters.keywords.length > 0) {
    console.log(`Filtering by keywords: ${filters.keywords.join(", ")}`)

    for (const keyword of filters.keywords) {
      switch (keyword) {
        case "dreamy":
        case "mysterious":
          filteredArtworks = filteredArtworks.filter(
            (artwork) =>
              artwork.description.toLowerCase().includes("dreamy") ||
              artwork.description.toLowerCase().includes("mysterious") ||
              artwork.category_name.toLowerCase().includes("surrealism"),
          )
          break
        case "flowers":
        case "nature":
          filteredArtworks = filteredArtworks.filter(
            (artwork) =>
              artwork.description.toLowerCase().includes("flower") ||
              artwork.description.toLowerCase().includes("nature"),
          )
          break
        case "landscape":
          filteredArtworks = filteredArtworks.filter(
            (artwork) =>
              artwork.category_name.toLowerCase().includes("landscape") ||
              artwork.description.toLowerCase().includes("landscape"),
          )
          break
        case "colorful":
        case "colors":
          filteredArtworks = filteredArtworks.filter(
            (artwork) =>
              artwork.description.toLowerCase().includes("color") ||
              artwork.description.toLowerCase().includes("vibrant"),
          )
          break
        case "unique":
        case "distinctive":
          filteredArtworks = filteredArtworks.filter(
            (artwork) =>
              artwork.description.toLowerCase().includes("unique") ||
              artwork.description.toLowerCase().includes("distinctive") ||
              artwork.category_name.toLowerCase().includes("contemporary"),
          )
          break
        case "interesting":
        case "simple":
          filteredArtworks = filteredArtworks.filter(
            (artwork) =>
              artwork.description.toLowerCase().includes("simple") ||
              artwork.description.toLowerCase().includes("intriguing") ||
              artwork.category_name.toLowerCase().includes("minimalism"),
          )
          break
      }
    }
  }

  // Filter by price
  if (filters.maxPrice) {
    filteredArtworks = filteredArtworks.filter((artwork) => artwork.price <= filters.maxPrice)
  }
  if (filters.minPrice) {
    filteredArtworks = filteredArtworks.filter((artwork) => artwork.price >= filters.minPrice)
  }

  // Sort by price
  if (filters.priceRange === "low") {
    filteredArtworks.sort((a, b) => a.price - b.price)
  } else if (filters.priceRange === "high") {
    filteredArtworks.sort((a, b) => b.price - a.price)
  }

  console.log(`Found ${filteredArtworks.length} matching artworks after filtering`)

  // If no results after filtering, return all
  return filteredArtworks.length > 0 ? filteredArtworks : mockArtworks
}

// Create mock data about artists
function getMockArtists(style = null) {
  const mockArtists = [
    {
      id: 1,
      fullname: "John Smith",
      pseudonym: "J. Smith",
      main_art_style: "abstract",
      about_me: "Artist specializing in abstract art with a unique and creative style",
      artworks_count: 15,
      nationality: "United States",
    },
    {
      id: 2,
      fullname: "Emily Johnson",
      pseudonym: "E. Johnson",
      main_art_style: "impressionism",
      about_me: "Impressionist artist specializing in nature landscapes",
      artworks_count: 12,
      nationality: "United Kingdom",
    },
    {
      id: 3,
      fullname: "Michael Brown",
      pseudonym: "M. Brown",
      main_art_style: "realism",
      about_me: "Realist artist depicting everyday life",
      artworks_count: 18,
      nationality: "Canada",
    },
    {
      id: 4,
      fullname: "Sarah Davis",
      pseudonym: "S. Davis",
      main_art_style: "minimalism",
      about_me: "Minimalist artist creating simple yet meaningful works",
      artworks_count: 10,
      nationality: "Australia",
    },
    {
      id: 5,
      fullname: "Robert Wilson",
      pseudonym: "R. Wilson",
      main_art_style: "surrealism",
      about_me: "Surrealist artist creating dreamy and mysterious images",
      artworks_count: 8,
      nationality: "France",
    },
  ]

  // Filter by style if provided
  if (style) {
    const styleMap = {
      abstract: "abstract",
      impressionism: "impressionism",
      realism: "realism",
      minimalism: "minimalism",
      surrealism: "surrealism",
      dreamy: "surrealism",
      landscape: "impressionism",
      unique: "surrealism",
      interesting: "minimalism",
      simple: "minimalism",
    }

    const styleKey = styleMap[style.toLowerCase()] || style.toLowerCase()

    const filteredArtists = mockArtists.filter((artist) => artist.main_art_style.toLowerCase().includes(styleKey))

    return filteredArtists.length > 0 ? filteredArtists : mockArtists
  }

  return mockArtists
}

// Analyze user intent
function analyzeIntent(message) {
  message = message.toLowerCase()
  console.log("Analyzing message:", message)

  // Check for art style keywords
  const styleKeywords = {
    abstract: "abstract",
    realism: "realism",
    impressionism: "impressionism",
    minimalism: "minimalism",
    expressionism: "expressionism",
    cubism: "cubism",
    surrealism: "surrealism",
    landscape: "landscape",
    contemporary: "contemporary",
    unique: "unique",
    distinctive: "unique",
  }

  // Check for special keywords
  const specialKeywords = [
    "dreamy",
    "mysterious",
    "flowers",
    "nature",
    "landscape",
    "colorful",
    "colors",
    "unique",
    "distinctive",
    "interesting",
    "simple",
  ]

  // Find art style in message
  let foundStyle = null
  for (const [keyword, style] of Object.entries(styleKeywords)) {
    if (message.includes(keyword)) {
      foundStyle = style
      console.log(`Found style keyword: ${keyword} => ${style}`)
      break
    }
  }

  // Find special keywords in message
  const foundSpecialKeywords = specialKeywords.filter((keyword) => message.includes(keyword))
  if (foundSpecialKeywords.length > 0) {
    console.log("Found special keywords:", foundSpecialKeywords)
  }

  // If message is just a simple greeting
  if (
    (message.includes("hello") || message.includes("hi") || message.includes("hey")) &&
    message.length < 15 &&
    !foundStyle &&
    foundSpecialKeywords.length === 0
  ) {
    return { type: "greeting" }
  }

  // If it's a farewell
  if (message.includes("goodbye") || message.includes("bye") || message.includes("see you later")) {
    return { type: "farewell" }
  }

  // Check for artist search intent
  if (
    (message.includes("artist") || message.includes("painter")) &&
    !message.includes("artwork") &&
    !message.includes("painting")
  ) {
    const intent = { type: "artist_recommendation", filters: {} }

    // Add style if found
    if (foundStyle) {
      intent.filters.style = foundStyle
    }

    return intent
  }

  // Check for artwork search intent
  const artKeywords = ["artwork", "painting", "art", "piece", "like"]
  const hasArtKeyword = artKeywords.some((keyword) => message.includes(keyword))

  // If found keywords about art or style or special keywords
  if (foundStyle || foundSpecialKeywords.length > 0 || hasArtKeyword) {
    const intent = { type: "art_recommendation", filters: {} }

    // Add style if found
    if (foundStyle) {
      intent.filters.category = foundStyle
    }

    // Add special keywords if found
    if (foundSpecialKeywords.length > 0) {
      intent.filters.keywords = foundSpecialKeywords
    }

    // Analyze price range
    if (
      message.includes("cheap") ||
      message.includes("inexpensive") ||
      message.includes("under 1000") ||
      message.includes("below 1000")
    ) {
      intent.filters.priceRange = "low"
      intent.filters.maxPrice = 1000
    } else if (message.includes("mid-range") || message.includes("1000-2000") || message.includes("medium price")) {
      intent.filters.priceRange = "medium"
      intent.filters.minPrice = 1000
      intent.filters.maxPrice = 2000
    } else if (
      message.includes("expensive") ||
      message.includes("high-end") ||
      message.includes("over 2000") ||
      message.includes("above 2000")
    ) {
      intent.filters.priceRange = "high"
      intent.filters.minPrice = 2000
    }

    console.log("Detected art recommendation intent with filters:", intent.filters)
    return intent
  }

  // Default to general conversation
  return { type: "general_conversation" }
}

// Generate response based on intent
async function generateResponse(intent, message) {
  console.log("Generating response for intent:", intent.type, "with filters:", intent.filters || {})

  switch (intent.type) {
    case "greeting":
      return { text: getRandomResponse(GREETING_RESPONSES) }

    case "farewell":
      return {
        text: "Thank you for chatting with me! I look forward to seeing you again soon. If you need to find artwork, come back to ArtZone anytime. Have a wonderful day! 😊",
      }

    case "art_recommendation": {
      // Get artworks based on filters
      const artworks = await fetchArtworks(intent.filters)
      console.log(`Found ${artworks.length} artworks matching filters`)

      if (artworks.length === 0) {
        return {
          text: "I'm sorry, I couldn't find any artworks matching your criteria. Would you like to try different criteria? For example, abstract, realism, or impressionism styles?",
        }
      }

      // Choose up to 5 artworks to recommend
      const recommendCount = Math.min(5, artworks.length)
      const recommendations = []

      // If there's a category filter, prioritize artworks matching that category
      let filteredArtworks = [...artworks]
      if (intent.filters.category) {
        const categoryMap = {
          abstract: "Abstract",
          realism: "Realism",
          impressionism: "Impressionism",
          minimalism: "Minimalism",
          surrealism: "Surrealism",
          landscape: "Landscape",
          contemporary: "Contemporary",
          expressionism: "Expressionism",
          unique: "Unique",
        }

        const categoryName = categoryMap[intent.filters.category] || intent.filters.category

        // Filter artworks by category
        const exactMatches = artworks.filter(
          (artwork) =>
            artwork.category_name && artwork.category_name.toLowerCase().includes(categoryName.toLowerCase()),
        )

        if (exactMatches.length > 0) {
          filteredArtworks = exactMatches
          console.log(`Found ${exactMatches.length} exact matches for category: ${categoryName}`)
        }
      }

      // Randomly sort and get recommended artworks
      const shuffledArtworks = [...filteredArtworks].sort(() => 0.5 - Math.random())
      for (let i = 0; i < recommendCount && i < shuffledArtworks.length; i++) {
        recommendations.push(shuffledArtworks[i])
      }

      // Create response with recommendations
      let responseText = ""

      // Add introduction based on filters
      if (intent.filters.priceRange === "low") {
        responseText += `Here are some artworks under $${intent.filters.maxPrice || 1000} that you might like:\n\n`
      } else if (intent.filters.priceRange === "medium") {
        responseText += `Here are some artworks between $${intent.filters.minPrice || 1000}-$${intent.filters.maxPrice || 2000}:\n\n`
      } else if (intent.filters.priceRange === "high") {
        responseText += `Here are some premium artworks over $${intent.filters.minPrice || 2000}:\n\n`
      } else if (intent.filters.category) {
        const categoryNames = {
          abstract: "abstract",
          realism: "realism",
          impressionism: "impressionism",
          minimalism: "minimalist",
          surrealism: "surreal",
          landscape: "landscape",
          contemporary: "contemporary",
          expressionism: "expressionist",
          unique: "unique",
        }
        const categoryName = categoryNames[intent.filters.category] || intent.filters.category
        responseText += `Here are some ${categoryName} style artworks you might enjoy:\n\n`
      } else if (intent.filters.keywords && intent.filters.keywords.length > 0) {
        responseText += `Based on your interest in "${intent.filters.keywords.join(", ")}":\n\n`
      } else {
        responseText += "Here are some artworks you might like:\n\n"
      }

      recommendations.forEach((artwork, index) => {
        responseText += `${index + 1}. "${artwork.title}" - $${artwork.price} - ${artwork.artist_name || "Unknown artist"}\n`
        if (artwork.category_name) {
          responseText += `   Style: ${artwork.category_name}\n`
        }
        responseText += `\n`
      })

      // Add next suggestion
      responseText +=
        "Which artwork do you like? Or would you like to see more artworks in a specific price range (under $1000, $1000-$2000, over $2000)?"

      return {
        text: responseText,
        recommendations: recommendations,
      }
    }

    case "artist_recommendation": {
      // Get artists based on filters
      const artists = await fetchArtists(intent.filters.style)
      console.log(`Found ${artists.length} artists matching style: ${intent.filters.style || "any"}`)

      if (artists.length === 0) {
        return {
          text: "I'm sorry, I couldn't find any artists matching your criteria. Would you like to try different criteria?",
        }
      }

      // Choose up to 3 artists to recommend
      const recommendCount = Math.min(3, artists.length)
      const recommendations = []

      // Create a copy of the artists array to avoid affecting the original
      const shuffledArtists = [...artists].sort(() => 0.5 - Math.random())

      for (let i = 0; i < recommendCount; i++) {
        recommendations.push(shuffledArtists[i])
      }

      // Create response with recommendations
      let responseText = ""

      if (intent.filters.style) {
        const styleNames = {
          abstract: "abstract",
          realism: "realism",
          impressionism: "impressionism",
          minimalism: "minimalist",
          surrealism: "surreal",
          landscape: "landscape",
          unique: "unique",
        }
        const styleName = styleNames[intent.filters.style] || intent.filters.style
        responseText += `Here are some talented artists specializing in ${styleName} style that you might like:\n\n`
      } else {
        responseText += "Here are some talented artists you might like:\n\n"
      }

      recommendations.forEach((artist, index) => {
        responseText += `${index + 1}. ${artist.fullname}`
        if (artist.pseudonym) {
          responseText += ` (${artist.pseudonym})`
        }
        responseText += `\n   Style: ${getStyleName(artist.main_art_style)}`
        responseText += `\n   Nationality: ${artist.nationality}`
        if (artist.about_me) {
          responseText += `\n   About: ${artist.about_me}`
        }
        responseText += `\n   Artworks: ${artist.artworks_count}\n\n`
      })

      responseText +=
        "You can click on the links to see details about these artists. Which artist interests you? Or would you like to explore different art styles?"

      return {
        text: responseText,
        artists: recommendations,
      }
    }

    case "general_conversation":
    default: {
      // Handle general conversation
      if (message.includes("price") || message.includes("cost")) {
        return {
          text: "We have artworks at various price points:\n\n- Budget-friendly: under $1000\n- Mid-range: $1000-$2000\n- Premium: over $2000\n\nWhich price range interests you?",
        }
      }

      if (message.includes("artist") || message.includes("painter")) {
        return {
          text: "ArtZone features many talented artists with various styles. Are you interested in a specific style like abstract, realism, impressionism, or minimalism?",
        }
      }

      if (message.includes("style") || message.includes("type")) {
        return {
          text: "We offer diverse art styles including:\n\n- Abstract: with non-representational shapes and colors\n- Realism: authentic depictions of life\n- Impressionism: focusing on light and color\n- Minimalism: simple yet meaningful\n- Surrealism: dreamy and mysterious\n\nWhich style interests you most?",
        }
      }

      // Default response
      return {
        text: "I can help you find artwork that matches your preferences. What style are you interested in (abstract, realism, impressionism)? Or do you have a specific price range in mind (under $1000, $1000-$2000, over $2000)?",
      }
    }
  }
}

// Convert style code to display name
function getStyleName(styleCode) {
  const styleMap = {
    abstract: "Abstract",
    realism: "Realism",
    impressionism: "Impressionism",
    minimalism: "Minimalism",
    surrealism: "Surrealism",
    expressionism: "Expressionism",
    cubism: "Cubism",
    contemporary: "Contemporary",
  }

  return styleMap[styleCode] || styleCode
}

export async function POST(req) {
  try {
    const body = await req.json()
    const { message } = body

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    console.log("Received message:", message)

    // Analyze user intent
    const intent = analyzeIntent(message)
    console.log("Detected intent:", intent)

    // Generate response based on intent
    const response = await generateResponse(intent, message)
    console.log("Generated response type:", intent.type)

    if (response.recommendations) {
      console.log(`Included ${response.recommendations.length} artwork recommendations`)
    } else if (response.artists) {
      console.log(`Included ${response.artists.length} artist recommendations`)
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error in art consultation API:", error)
    return NextResponse.json({ error: "Server error: " + error.message }, { status: 500 })
  }
}
