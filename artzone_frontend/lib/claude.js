import { anthropic } from "@ai-sdk/anthropic"

export async function getArtConsultation(question, artworks = []) {
  try {
    const artworksContext =
      artworks.length > 0
        ? `Here are some artworks you might be considering: ${artworks
            .map((art) => `"${art.title}" by ${art.artist} (${art.category}, ${art.medium}, ${art.price})`)
            .join(", ")}.`
        : ""

    const { text } = await anthropic("claude-3-haiku-20240307").generateText({
      prompt: `You are an art consultant for ArtZone, an online art marketplace. 
      ${artworksContext}
      
      Please provide helpful, friendly advice about art selection, art styles, artists, or any art-related questions.
      
      User question: ${question}`,
      max_tokens: 1000,
      temperature: 0.7,
    })

    return text
  } catch (error) {
    console.error("Error consulting Claude:", error)
    return "I'm sorry, I couldn't process your request at the moment. Please try again later."
  }
}

