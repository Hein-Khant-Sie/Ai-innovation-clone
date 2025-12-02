// BMCC Campus data and navigation logic

export interface NavigationStep {
  instruction: string
  details?: string
}

export interface NavigationRoute {
  steps: NavigationStep[]
  estimatedTime: string
  distance: string
  buildings?: string[]
}

// Common BMCC locations
const BMCC_LOCATIONS: Record<string, { building: string; floor?: number; room?: string }> = {
  'main entrance': { building: 'Main Building', floor: 1 },
  'entrance': { building: 'Main Building', floor: 1 },
  'library': { building: 'Library', floor: 1 },
  'cafeteria': { building: 'Cafeteria', floor: 1 },
  'science building': { building: 'Science Building', floor: 1 },
  'gym': { building: 'Gymnasium', floor: 1 },
  'auditorium': { building: 'Auditorium', floor: 1 },
  'student center': { building: 'Student Center', floor: 1 },
}

// Extract room number from text (e.g., "Room 201", "201", "Room N-201")
function extractRoomNumber(text: string): { building: string; room: string } | null {
  const roomMatch = text.match(/(?:room\s*)?([A-Z]?[-]?\d{3,4})/i)
  if (roomMatch) {
    const roomNum = roomMatch[1]
    // Determine building based on room prefix
    if (roomNum.startsWith('N') || roomNum.startsWith('n')) {
      return { building: 'North Building', room: roomNum }
    } else if (roomNum.startsWith('S') || roomNum.startsWith('s')) {
      return { building: 'South Building', room: roomNum }
    } else if (parseInt(roomNum) >= 100 && parseInt(roomNum) < 200) {
      return { building: 'Main Building', room: roomNum }
    } else if (parseInt(roomNum) >= 200 && parseInt(roomNum) < 300) {
      return { building: 'Science Building', room: roomNum }
    } else {
      return { building: 'Main Building', room: roomNum }
    }
  }
  return null
}

// Normalize location text
function normalizeLocation(text: string): string {
  return text.toLowerCase().trim()
}

// Get building from location text
function getBuildingFromLocation(location: string): string {
  const normalized = normalizeLocation(location)
  
  // Check for room numbers first
  const roomInfo = extractRoomNumber(normalized)
  if (roomInfo) {
    return roomInfo.building
  }

  // Check known locations
  for (const [key, value] of Object.entries(BMCC_LOCATIONS)) {
    if (normalized.includes(key)) {
      return value.building
    }
  }

  // Default fallback
  if (normalized.includes('science') || normalized.includes('lab')) {
    return 'Science Building'
  } else if (normalized.includes('north') || normalized.includes('n-')) {
    return 'North Building'
  } else if (normalized.includes('south') || normalized.includes('s-')) {
    return 'South Building'
  } else {
    return 'Main Building'
  }
}

// Generate navigation steps
function generateSteps(
  fromBuilding: string,
  toBuilding: string,
  destination: string
): NavigationStep[] {
  const steps: NavigationStep[] = []

  if (fromBuilding === toBuilding) {
    steps.push({
      instruction: `You're already in the ${toBuilding}`,
      details: 'Look for room signs or ask for directions to your specific room.',
    })
  } else {
    // Building transitions
    if (fromBuilding === 'Main Building' && toBuilding === 'Science Building') {
      steps.push({
        instruction: 'Exit the Main Building through the east exit',
        details: 'Head towards the main hallway on the first floor',
      })
      steps.push({
        instruction: 'Walk straight across the courtyard',
        details: 'The Science Building will be directly ahead',
      })
      steps.push({
        instruction: 'Enter the Science Building through the main entrance',
        details: 'Look for the building labeled "Science"',
      })
    } else if (fromBuilding === 'Main Building' && toBuilding === 'North Building') {
      steps.push({
        instruction: 'Exit the Main Building through the north exit',
        details: 'Head towards the north side of the building',
      })
      steps.push({
        instruction: 'Cross the walkway to the North Building',
        details: 'Follow the covered walkway',
      })
      steps.push({
        instruction: 'Enter the North Building',
        details: 'The entrance will be on your right',
      })
    } else if (fromBuilding === 'Main Building' && toBuilding === 'South Building') {
      steps.push({
        instruction: 'Exit the Main Building through the south exit',
        details: 'Head towards the south side of the building',
      })
      steps.push({
        instruction: 'Cross the walkway to the South Building',
        details: 'Follow the covered walkway',
      })
      steps.push({
        instruction: 'Enter the South Building',
        details: 'The entrance will be on your left',
      })
    } else if (fromBuilding === 'Science Building' && toBuilding === 'Main Building') {
      steps.push({
        instruction: 'Exit the Science Building through the main entrance',
        details: 'Head towards the west side of the building',
      })
      steps.push({
        instruction: 'Walk straight across the courtyard',
        details: 'The Main Building will be directly ahead',
      })
      steps.push({
        instruction: 'Enter the Main Building through the east entrance',
        details: 'Look for the main entrance doors',
      })
    } else {
      // Generic building transition
      steps.push({
        instruction: `Exit the ${fromBuilding}`,
        details: 'Head towards the main exit',
      })
      steps.push({
        instruction: `Walk to the ${toBuilding}`,
        details: 'Follow the campus pathways and signs',
      })
      steps.push({
        instruction: `Enter the ${toBuilding}`,
        details: 'Look for the main entrance',
      })
    }
  }

  // Add final step for specific room
  const roomInfo = extractRoomNumber(destination)
  if (roomInfo) {
    steps.push({
      instruction: `Find Room ${roomInfo.room}`,
      details: `Check the room numbers on each floor. Room ${roomInfo.room} should be clearly marked.`,
    })
  } else {
    steps.push({
      instruction: `Locate your destination: ${destination}`,
      details: 'Look for signs or ask for directions if needed',
    })
  }

  return steps
}

// Main navigation function
export function getNavigationRoute(
  currentLocation: string,
  destination: string
): NavigationRoute {
  const fromBuilding = getBuildingFromLocation(currentLocation)
  const toBuilding = getBuildingFromLocation(destination)

  const steps = generateSteps(fromBuilding, toBuilding, destination)

  // Calculate estimated time (rough estimate: 2 minutes per step + building distance)
  const baseTime = steps.length * 2
  const buildingTime = fromBuilding === toBuilding ? 0 : 3
  const estimatedMinutes = baseTime + buildingTime

  // Calculate distance (rough estimate)
  const distance =
    fromBuilding === toBuilding
      ? 'Same building'
      : '~200-500 meters between buildings'

  return {
    steps,
    estimatedTime: `${estimatedMinutes} min`,
    distance,
    buildings: [fromBuilding, toBuilding],
  }
}

// Helper function to check if location is recognized
export function isLocationRecognized(location: string): boolean {
  const normalized = normalizeLocation(location)
  return (
    extractRoomNumber(normalized) !== null ||
    Object.keys(BMCC_LOCATIONS).some((key) => normalized.includes(key)) ||
    normalized.includes('building') ||
    normalized.includes('room')
  )
}

