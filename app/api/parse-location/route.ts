import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json()

    if (!text || typeof text !== 'string') {
      return NextResponse.json(
        { error: 'No text provided' },
        { status: 400 }
      )
    }

    // Use OpenAI to parse and normalize the location
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `You are a helpful assistant that parses location descriptions for BMCC (Borough of Manhattan Community College) campus.
          
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
          
          Parse the user's input and return a normalized location name. Examples:
          - "I'm at the main door" -> "Main Entrance"
          - "Room 201" -> "Room 201"
          - "Science building, room 305" -> "Science Building Room 305"
          - "the library" -> "Library"
          - "cafeteria" -> "Cafeteria"
          
          Return ONLY the normalized location name, nothing else.`,
        },
        {
          role: 'user',
          content: text,
        },
      ],
      max_tokens: 100,
      temperature: 0.3,
    })

    const parsedLocation =
      response.choices[0]?.message?.content?.trim() || text

    return NextResponse.json({ location: parsedLocation })
  } catch (error: any) {
    console.error('Error parsing location:', error)
    
    // Fallback if API key is not set - use simple text normalization
    if (error.message?.includes('API key')) {
      // Simple fallback normalization
      const normalized = text
        .toLowerCase()
        .replace(/^(i'm|i am|at|in|the)\s+/i, '')
        .trim()
      return NextResponse.json({
        location: normalized.charAt(0).toUpperCase() + normalized.slice(1),
      })
    }

    return NextResponse.json(
      { error: 'Failed to parse location', details: error.message },
      { status: 500 }
    )
  }
}

