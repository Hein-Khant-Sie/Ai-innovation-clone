# Ai-innovation-clone

AI-powered navigation assistant for BMCC (Borough of Manhattan Community College) campus. Help students navigate to their classes by taking a picture or describing their current location.

## Features

- 📸 **Image Recognition**: Take a photo or upload an image to automatically detect your current location
- 💬 **Text Input**: Type or describe where you are in natural language
- 🗺️ **Step-by-Step Navigation**: Get detailed directions to your destination
- 🎯 **Smart Route Planning**: AI-powered route calculation between BMCC buildings
- 📱 **Modern UI**: Beautiful, responsive interface built with Next.js and Tailwind CSS
- 🤖 **AI Chat Interface**: ChatGPT-like interface for navigation assistance

## Getting Started

### Prerequisites

- Node.js 18+ installed
- OpenAI API key (for AI features)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file in the root directory:
```env
OPENAI_API_KEY=your_openai_api_key_here
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Share Your Location**:
   - Upload a photo of your surroundings, or
   - Type where you are (e.g., "Main entrance", "Room 201", "Library")

2. **Tell Us Your Destination**:
   - Type where you want to go (e.g., "Room 305", "Science Building", "Cafeteria")

3. **Get Directions**:
   - The AI will guide you step-by-step to your destination

## Technology Stack

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **OpenAI API** - Image recognition and chat (GPT-4o & GPT-3.5-turbo)
- **Lucide React** - Icons

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── chat/              # Chat API endpoint
│   │   ├── detect-location/   # Image recognition endpoint
│   │   └── parse-location/    # Text parsing endpoint
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── ChatInterface.tsx      # Main chat UI
│   ├── LocationInput.tsx      # Location input UI
│   └── NavigationInterface.tsx # Navigation display
├── lib/
│   └── bmcc-data.ts          # Campus data and routing logic
└── package.json
```

## Notes

- The app uses OpenAI's GPT-4o Vision API for image recognition
- Uses GPT-3.5-turbo for text-only conversations
- If no API key is provided, the app will show helpful error messages
- BMCC campus data is stored in `lib/bmcc-data.ts` and can be customized

## License

MIT
