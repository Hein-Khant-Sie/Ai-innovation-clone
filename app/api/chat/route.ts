import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const image = formData.get('image') as File | null
    const messageText = formData.get('message') as string | null
    const messagesJson = formData.get('messages') as string | null

    // Check if API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        {
          message:
            'OpenAI API key is not configured. Please set OPENAI_API_KEY in your environment variables.',
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

    // Build the user message content
    const userContent: any[] = []

    // Add image if provided
    if (image) {
      const bytes = await image.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const base64Image = buffer.toString('base64')

      userContent.push({
        type: 'image_url',
        image_url: {
          url: `data:image/jpeg;base64,${base64Image}`,
        },
      })
    }

    // Add text if provided
    if (messageText && messageText.trim()) {
      userContent.push({
        type: 'text',
        text: messageText,
      })
    }

    // If no content, return error
    if (userContent.length === 0) {
      return NextResponse.json(
        { error: 'No message or image provided' },
        { status: 400 }
      )
    }

    // Use GPT-4o for images, GPT-3.5-turbo for text only
    const model = image ? 'gpt-4o' : 'gpt-3.5-turbo'

    // Use OpenAI to generate chat response
    const response = await openai.chat.completions.create({
      model: model,
      messages: [
        {
          role: 'system',
          content: `You are a helpful and friendly AI navigation assistant for BMCC (Borough of Manhattan Community College) campus. Your role is to guide students through the navigation process.

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

Be conversational, friendly, and guide them step-by-step through the navigation process. Once you have both current location and destination, provide clear, step-by-step directions.`,
        },
        ...messages,
        {
          role: 'user',
          content: userContent.length === 1 ? userContent[0] : userContent,
        },
      ],
      max_tokens: 1000,
      temperature: 0.7,
    })

    const assistantMessage =
      response.choices[0]?.message?.content ||
      'Sorry, I could not generate a response.'

    return NextResponse.json({ message: assistantMessage })
  } catch (error: any) {
    console.error('Error in chat API:', error)

    // Handle API key errors
    if (error.message?.includes('API key') || error.status === 401) {
      return NextResponse.json(
        {
          message:
            'OpenAI API key is not configured or invalid. Please check your environment variables in Vercel.',
        },
        { status: 200 }
      )
    }

    // Handle quota/billing errors
    if (error.status === 429 && error.code === 'insufficient_quota') {
      return NextResponse.json(
        {
          message:
            '⚠️ Your OpenAI account has exceeded its quota. Please add credits at https://platform.openai.com/account/billing to continue using the AI features.',
        },
        { status: 200 }
      )
    }

    // Handle rate limit errors
    if (error.status === 429) {
      return NextResponse.json(
        {
          message:
            'Rate limit exceeded. Please wait a moment and try again.',
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

