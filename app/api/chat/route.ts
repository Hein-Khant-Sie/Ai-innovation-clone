import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '')

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const image = formData.get('image') as File | null
    const messageText = formData.get('message') as string | null
    const messagesJson = formData.get('messages') as string | null

    // Check if API key is configured
    if (!process.env.GOOGLE_AI_API_KEY) {
      return NextResponse.json(
        {
          message:
            'Google AI API key is not configured. Please set GOOGLE_AI_API_KEY in your environment variables. Get a free key at https://aistudio.google.com/app/apikey',
        },
        { status: 200 }
      )
    }

    let messages: any[] = []
    if (messagesJson) {
      try {
        messages = JSON.parse(messagesJson)
      } catch (e) {
        // If parsing fails, start fresh
        messages = []
      }
    }

    // If no content, return error
    if (!messageText?.trim() && !image) {
      return NextResponse.json(
        { error: 'No message or image provided' },
        { status: 400 }
      )
    }

    // Use Gemini model (supports both text and images)
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    // Build the prompt with system instructions
    const systemPrompt = `You are a helpful and friendly AI navigation assistant for BMCC (Borough of Manhattan Community College) campus. Your role is to guide students through the navigation process.

IMPORTANT: Guide the conversation to collect:
1. Current location (from text description or image analysis)
2. Destination (where they want to go)

When a user provides:
- An image: Analyze it to identify their current location on BMCC campus. Look for room numbers, building names, signs, landmarks, or any location indicators. Then ask where they want to go.
- Text describing location: Confirm their current location, then ask for their destination.
- A destination: If you already have their current location, provide navigation directions. If not, ask for their current location first.

Common BMCC locations include:
- Main Building (rooms 100-199)
- Science Building (rooms 200-299)
- North Building (rooms N-xxx)
- South Building (rooms S-xxx)
- Library
- Cafeteria
- Main Entrance
- Student Center
- Gymnasium
- Auditorium

Be conversational, friendly, and guide them step-by-step through the navigation process. Once you have both current location and destination, provide clear, step-by-step directions.`

    // Build conversation history
    let fullPrompt = systemPrompt + '\n\n'
    
    // Add conversation history
    if (messages.length > 0) {
      messages.forEach((msg: any) => {
        if (msg.role === 'user') {
          fullPrompt += `User: ${msg.content}\n\n`
        } else if (msg.role === 'assistant') {
          fullPrompt += `Assistant: ${msg.content}\n\n`
        }
      })
    }

    // Add current user message
    if (messageText?.trim()) {
      fullPrompt += `User: ${messageText}\n\nAssistant:`
    } else {
      fullPrompt += `User: [Image provided]\n\nAssistant:`
    }

    // Prepare content parts
    const parts: any[] = [{ text: fullPrompt }]

    // Add image if provided
    if (image) {
      const bytes = await image.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const base64Image = buffer.toString('base64')
      
      parts.push({
        inlineData: {
          data: base64Image,
          mimeType: image.type || 'image/jpeg',
        },
      })
    }

    // Generate response
    const result = await model.generateContent({
      contents: [{ role: 'user', parts }],
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
      },
    })

    const response = await result.response
    const assistantMessage = response.text() || 'Sorry, I could not generate a response.'

    return NextResponse.json({ message: assistantMessage })
  } catch (error: any) {
    console.error('Error in chat API:', error)

    // Handle API key errors
    if (error.message?.includes('API key') || error.status === 401 || error.message?.includes('API_KEY_INVALID')) {
      return NextResponse.json(
        {
          message:
            'Google AI API key is not configured or invalid. Please check your environment variables in Vercel. Get a free key at https://aistudio.google.com/app/apikey',
        },
        { status: 200 }
      )
    }

    // Handle quota/rate limit errors
    if (error.status === 429 || error.message?.includes('quota') || error.message?.includes('rate limit')) {
      return NextResponse.json(
        {
          message:
            '⚠️ Rate limit exceeded. Please wait a moment and try again. Google AI has a generous free tier.',
        },
        { status: 200 }
      )
    }

    // Provide more specific error message
    const errorMessage = error.message || 'Unknown error'
    return NextResponse.json(
      {
        message: `Error: ${errorMessage}. Please try again.`,
      },
      { status: 500 }
    )
  }
}

