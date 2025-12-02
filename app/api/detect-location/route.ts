import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('image') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      )
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64Image = buffer.toString('base64')

    // Use OpenAI Vision API to analyze the image
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Analyze this image and identify the location within BMCC (Borough of Manhattan Community College) campus. 
              Look for:
              - Room numbers (e.g., Room 201, N-123, S-456)
              - Building names or signs
              - Landmarks (library, cafeteria, main entrance, etc.)
              - Floor numbers or level indicators
              - Any text or signs that indicate location
              
              Respond with ONLY the location name in a clear, concise format (e.g., "Room 201", "Main Entrance", "Library", "Science Building Room 305").
              If you cannot identify a specific BMCC location, respond with "Unknown location - please describe where you are".`,
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`,
              },
            },
          ],
        },
      ],
      max_tokens: 150,
    })

    const detectedLocation =
      response.choices[0]?.message?.content?.trim() ||
      'Unknown location - please describe where you are'

    return NextResponse.json({ location: detectedLocation })
  } catch (error: any) {
    console.error('Error detecting location:', error)
    
    // Fallback if API key is not set
    if (error.message?.includes('API key')) {
      return NextResponse.json(
        {
          location:
            'API key not configured. Please set OPENAI_API_KEY in your environment variables. For now, using fallback: Main Entrance',
        },
        { status: 200 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to detect location', details: error.message },
      { status: 500 }
    )
  }
}

