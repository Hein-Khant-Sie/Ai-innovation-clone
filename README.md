# Vibe Shift Navigate

AI-powered navigation assistant for BMCC (Borough of Manhattan Community College) campus. Help students navigate to their classes by taking a picture or describing their current location.

## Features

- 📸 **Image Recognition**: Take a photo or upload an image to automatically detect your current location
- 💬 **Text Input**: Type or describe where you are in natural language
- 🗺️ **Step-by-Step Navigation**: Get detailed directions to your destination
- 🎯 **Smart Route Planning**: AI-powered route calculation between BMCC buildings
- 📱 **Modern UI**: Beautiful, responsive interface built with Next.js and Tailwind CSS

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

1. **Set Your Location**:
   - Take a photo of your surroundings, or
   - Type where you are (e.g., "Main entrance", "Room 201", "Library")

2. **Enter Destination**:
   - Type where you want to go (e.g., "Room 305", "Science Building", "Cafeteria")

3. **Follow Directions**:
   - View the step-by-step navigation guide
   - Use the Previous/Next buttons to navigate through steps

## Technology Stack

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **OpenAI API** - Image recognition and text parsing
- **Lucide React** - Icons

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── detect-location/  # Image recognition endpoint
│   │   └── parse-location/   # Text parsing endpoint
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── LocationInput.tsx      # Location input UI
│   └── NavigationInterface.tsx # Navigation display
├── lib/
│   └── bmcc-data.ts          # Campus data and routing logic
└── package.json
```

## Notes

- The app uses OpenAI's GPT-4 Vision API for image recognition
- If no API key is provided, the app will use fallback logic
- BMCC campus data is stored in `lib/bmcc-data.ts` and can be customized

## License

MIT

