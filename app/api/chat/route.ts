import { NextRequest, NextResponse } from 'next/server'
import { HfInference } from '@huggingface/inference'

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY || '')

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const image = formData.get('image') as File | null
    const messageText = formData.get('message') as string | null
    const messagesJson = formData.get('messages') as string | null

    // Check if API key is configured
    if (!process.env.HUGGINGFACE_API_KEY) {
      return NextResponse.json(
        {
          message:
            'Hugging Face API key is not configured. Please set HUGGINGFACE_API_KEY in your environment variables. Get a free key at https://huggingface.co/settings/tokens',
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
    if (image && messageText?.trim()) {
      fullPrompt += `User: [Image provided] ${messageText}\n\nAssistant:`
    } else if (image) {
      fullPrompt += `User: [Image provided - analyze this image to identify the current location on BMCC campus]\n\nAssistant:`
    } else if (messageText?.trim()) {
      fullPrompt += `User: ${messageText}\n\nAssistant:`
    }

    // Use Hugging Face text generation API
    // Using a good free model: meta-llama/Llama-3.1-8B-Instruct
    const response = await hf.textGeneration({
      model: 'meta-llama/Llama-3.1-8B-Instruct',
      inputs: fullPrompt,
      parameters: {
        max_new_tokens: 1000,
        temperature: 0.7,
        return_full_text: false,
      },
    })

    const assistantMessage = response.generated_text?.trim() || 'Sorry, I could not generate a response.'

    return NextResponse.json({ message: assistantMessage })
  } catch (error: any) {
    console.error('Error in chat API:', error)

    // Handle API key errors
    if (error.message?.includes('API key') || error.status === 401 || error.message?.includes('401') || error.message?.includes('Unauthorized')) {
      return NextResponse.json(
        {
          message:
            'Hugging Face API key is not configured or invalid. Please check your environment variables in Vercel. Get a free key at https://huggingface.co/settings/tokens',
        },
        { status: 200 }
      )
    }

    // Handle quota/rate limit errors
    if (error.status === 429 || error.message?.includes('quota') || error.message?.includes('rate limit') || error.message?.includes('429')) {
      return NextResponse.json(
        {
          message:
            '⚠️ Rate limit exceeded. Please wait a moment and try again. Hugging Face has a generous free tier.',
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

