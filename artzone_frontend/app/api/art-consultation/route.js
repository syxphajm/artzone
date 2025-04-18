import { NextResponse } from "next/server"

// Improved keyword detection for price ranges
const PRICE_KEYWORDS = {
  low: ["cheap", "inexpensive", "affordable", "budget", "low price", "low cost", "under 1000", "below 1000"],
  medium: ["mid-range", "medium", "moderate", "1000-2000", "medium price", "average"],
  high: ["expensive", "high-end", "premium", "luxury", "over 2000", "above 2000", "high price"]
}

// Improved language support for both English and Vietnamese
const LANGUAGE_KEYWORDS = {
  // Art styles
  styles: {
    abstract: ["abstract", "trừu tượng"],
    realism: ["realism", "hiện thực"],
    impressionism: ["impressionism", "ấn tượng"],
    minimalism: ["minimalism", "tối giản"],
    surrealism: ["surrealism", "siêu thực"],
    landscape: ["landscape", "phong cảnh"],
    cityscape: ["cityscape", "city", "thành phố", "đô thị"],
    night: ["night", "đêm", "tối"],
    portrait: ["portrait", "chân dung"],
    nature: ["nature", "thiên nhiên"],
    contemporary: ["contemporary", "modern", "hiện đại"]
  },
  // Room types
  rooms: {
    living: ["living room", "phòng khách"],
    bedroom: ["bedroom", "phòng ngủ"],
    office: ["office", "phòng làm việc", "văn phòng"],
    cafe: ["cafe", "coffee shop", "quán cà phê"]
  },
  // Moods and feelings
  moods: {
    calm: ["calm", "gentle", "nhẹ nhàng", "êm dịu"],
    dreamy: ["dreamy", "romantic", "thơ mộng", "mộng mơ"],
    colorful: ["colorful", "vibrant", "màu mè", "sặc sỡ"],
    similar: ["similar", "like", "tương tự", "giống"]
  }
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
    // Additional artworks
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
  if (filters.priceRange === "low" || filters.maxPrice) {
    const maxPrice = filters.maxPrice || 1000;
    console.log(`Filtering by max price: ${maxPrice}`);
    filteredArtworks = filteredArtworks.filter((artwork) => artwork.price <= maxPrice);
  }
  
  if (filters.priceRange === "medium") {
    console.log(`Filtering by medium price range: 1000-2000`);
    filteredArtworks = filteredArtworks.filter((artwork) => artwork.price >= 1000 && artwork.price <= 2000);
  }
  
  if (filters.priceRange === "high" || filters.minPrice) {
    const minPrice = filters.minPrice || 2000;
    console.log(`Filtering by min price: ${minPrice}`);
    filteredArtworks = filteredArtworks.filter((artwork) => artwork.price >= minPrice);
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
// Analyze user intent
function analyzeIntent(message) {
  message = message.toLowerCase()
  console.log("Analyzing message:", message)

  // Initialize intent object
  const intent = { 
    type: "general_conversation", 
    filters: {} 
  }

  // Check for specific price ranges with numbers
  const specificPriceRegex = /(\$?\d+)/g;
  const priceMatches = message.match(specificPriceRegex);
  
  if (priceMatches) {
    // Check for "under X" or "below X" or "dưới X" patterns
    if (message.includes("under") || message.includes("below") || 
        message.includes("dưới") || message.includes("ít hơn")) {
      const price = parseInt(priceMatches[0].replace('$', ''));
      if (!isNaN(price)) {
        intent.type = "art_recommendation";
        intent.filters.priceRange = "low";
        intent.filters.maxPrice = price;
        console.log(`Found specific max price: ${price}`);
      }
    }
    // Check for "over X" or "above X" or "trên X" patterns
    else if (message.includes("over") || message.includes("above") || 
             message.includes("trên") || message.includes("hơn")) {
      const price = parseInt(priceMatches[0].replace('$', ''));
      if (!isNaN(price)) {
        intent.type = "art_recommendation";
        intent.filters.priceRange = "high";
        intent.filters.minPrice = price;
        console.log(`Found specific min price: ${price}`);
      }
    }
    // Check for price range "X-Y" or "X to Y" or "từ X đến Y" patterns
    else if (priceMatches.length >= 2 && 
            (message.includes("-") || message.includes("to") || 
             message.includes("đến") || message.includes("tới"))) {
      const price1 = parseInt(priceMatches[0].replace('$', ''));
      const price2 = parseInt(priceMatches[1].replace('$', ''));
      if (!isNaN(price1) && !isNaN(price2)) {
        intent.type = "art_recommendation";
        intent.filters.minPrice = Math.min(price1, price2);
        intent.filters.maxPrice = Math.max(price1, price2);
        console.log(`Found specific price range: ${intent.filters.minPrice}-${intent.filters.maxPrice}`);
      }
    }
  }

  // If no specific price range was found, check for general price keywords
  if (intent.type === "general_conversation") {
    // Check for art style keywords
    for (const [style, keywords] of Object.entries(LANGUAGE_KEYWORDS.styles)) {
      if (keywords.some(keyword => message.includes(keyword))) {
        intent.filters.category = style;
        intent.type = "art_recommendation";
        console.log(`Found style: ${style}`);
        break;
      }
    }

    // Check for room keywords
    for (const [room, keywords] of Object.entries(LANGUAGE_KEYWORDS.rooms)) {
      if (keywords.some(keyword => message.includes(keyword))) {
        intent.filters.room = room;
        intent.type = "art_recommendation";
        console.log(`Found room: ${room}`);
        break;
      }
    }

    // Check for mood keywords
    for (const [mood, keywords] of Object.entries(LANGUAGE_KEYWORDS.moods)) {
      if (keywords.some(keyword => message.includes(keyword))) {
        intent.filters.mood = mood;
        intent.type = "art_recommendation";
        console.log(`Found mood: ${mood}`);
        break;
      }
    }

    // Check for general price range keywords
    for (const [range, keywords] of Object.entries(PRICE_KEYWORDS)) {
      if (keywords.some(keyword => message.includes(keyword))) {
        intent.filters.priceRange = range;
        intent.type = "art_recommendation";
        
        // Set price limits based on range
        if (range === "low") {
          intent.filters.maxPrice = 1000;
        } else if (range === "medium") {
          intent.filters.minPrice = 1000;
          intent.filters.maxPrice = 2000;
        } else if (range === "high") {
          intent.filters.minPrice = 2000;
        }
        
        console.log(`Found price range: ${range}`);
        break;
      }
    }
  }

  // Check for artist-related queries
  if (message.includes("artist") || message.includes("painter") || 
      message.includes("nghệ sĩ") || message.includes("họa sĩ")) {
    if (intent.type !== "art_recommendation") {
      intent.type = "artist_recommendation";
    }
  }

  // Check for simple greetings
  if ((message.includes("hello") || message.includes("hi") || message.includes("hey") || 
       message.includes("xin chào") || message.includes("chào")) && 
      message.length < 20 && intent.type === "general_conversation") {
    intent.type = "greeting";
  }

  // Check for farewells
  if (message.includes("goodbye") || message.includes("bye") || 
      message.includes("tạm biệt") || message.includes("gặp lại sau")) {
    intent.type = "farewell";
  }

  console.log("Final intent:", intent);
  return intent;
}

// Generate response based on intent
async function generateResponse(intent, message) {
  console.log("Generating response for intent:", intent.type, "with filters:", intent.filters || {})

  switch (intent.type) {
    case "greeting":
      return { 
        text: "Hello! I'm ArtBot. I can help you find artwork that matches your preferences. What style are you interested in, or are you looking for something specific like 'cheap paintings' or 'landscape art'?" 
      }

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
        responseText += `Here are some affordable artworks under $${intent.filters.maxPrice || 1000} that you might like:\n\n`
      } else if (intent.filters.priceRange === "medium") {
        responseText += `Here are some mid-range artworks between $${intent.filters.minPrice || 1000}-$${intent.filters.maxPrice || 2000}:\n\n`
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
      } else if (intent.filters.room) {
        const roomNames = {
          living: "living room",
          bedroom: "bedroom",
          office: "office or workspace",
          cafe: "café or coffee shop"
        }
        const roomName = roomNames[intent.filters.room] || intent.filters.room
        responseText += `Here are some artworks that would look great in a ${roomName}:\n\n`
      } else if (intent.filters.mood) {
        const moodNames = {
          calm: "calm and gentle",
          dreamy: "dreamy and romantic",
          colorful: "colorful and vibrant"
        }
        const moodName = moodNames[intent.filters.mood] || intent.filters.mood
        responseText += `Here are some ${moodName} artworks you might enjoy:\n\n`
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
      if (message.includes("price") || message.includes("cost") || 
          message.includes("giá") || message.includes("tiền")) {
        return {
          text: "We have artworks at various price points:\n\n- Budget-friendly: under $1000\n- Mid-range: $1000-$2000\n- Premium: over $2000\n\nWhich price range interests you?",
        }
      }

      if (message.includes("artist") || message.includes("painter") || 
          message.includes("nghệ sĩ") || message.includes("họa sĩ")) {
        return {
          text: "ArtZone features many talented artists with various styles. Are you interested in a specific style like abstract, realism, impressionism, or minimalism?",
        }
      }

      if (message.includes("style") || message.includes("type") || 
          message.includes("phong cách") || message.includes("kiểu")) {
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