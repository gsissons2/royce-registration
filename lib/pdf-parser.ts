import { RegistrationData, ParsedPDFResult } from '@/types/registration'
import { extractText } from 'unpdf'

function extractField(text: string, label: string): string {
  // Match "Label: value" up to the next label or end
  const pattern = new RegExp(
    `${label}:\\s*([^«][^:]*?)(?=\\s+(?:Contact|Email|Reservation|Arrival|Departure|Number of|Room|Adults|Children|Policies|$))`,
    'i'
  )
  const match = text.match(pattern)
  if (match && match[1]) {
    const value = match[1].trim()
    // Skip if it's a mail-merge placeholder
    if (value.startsWith('«') || value.startsWith('&lt;')) {
      return ''
    }
    return value
  }
  return ''
}

function extractSimpleField(text: string, label: string): string {
  // Simpler extraction for fields followed by specific next labels
  const pattern = new RegExp(`${label}:\\s*([^«\\n]+?)(?=\\s*(?:[A-Z][a-z]+:|$))`, 'i')
  const match = text.match(pattern)
  if (match && match[1]) {
    const value = match[1].trim()
    if (value.startsWith('«') || value.startsWith('&lt;')) {
      return ''
    }
    return value
  }
  return ''
}

function extractNumber(text: string, label: string): number {
  const pattern = new RegExp(`${label}:\\s*(\\d+)`, 'i')
  const match = text.match(pattern)
  if (match && match[1]) {
    return parseInt(match[1], 10)
  }
  return 0
}

function extractGuestsCount(text: string, type: 'Adults' | 'Children'): number {
  // Handle "Adults: 2, Children: 0" format
  const pattern = new RegExp(`${type}:\\s*(\\d+)`, 'i')
  const match = text.match(pattern)
  if (match && match[1]) {
    return parseInt(match[1], 10)
  }
  return 0
}

export async function parsePDF(buffer: Buffer): Promise<ParsedPDFResult> {
  try {
    const { text } = await extractText(new Uint8Array(buffer), { mergePages: true })
    const normalizedText = text.replace(/\s+/g, ' ').trim()
    
    console.log('Extracted text (first 800 chars):', normalizedText.substring(0, 800))
    
    // Check if this is an unfilled template
    const isTemplate = normalizedText.includes('«') || normalizedText.includes('&lt;&lt;')
    
    if (isTemplate) {
      console.log('Warning: PDF appears to be an unfilled template with placeholders')
    }
    
    // Extract fields based on Royce registration card format
    const guestName = extractField(normalizedText, 'Guest Name')
    const contactNumber = extractSimpleField(normalizedText, 'Contact Number')
    const email = extractSimpleField(normalizedText, 'Email Address')
    const reservationNumber = extractSimpleField(normalizedText, 'Reservation Number')
    const arrivalDate = extractSimpleField(normalizedText, 'Arrival Date')
    const departureDate = extractSimpleField(normalizedText, 'Departure Date')
    const nights = extractNumber(normalizedText, 'Number of Nights')
    const roomType = extractSimpleField(normalizedText, 'Room Type')
    const roomNumber = extractSimpleField(normalizedText, 'Room Number')
    const adults = extractGuestsCount(normalizedText, 'Adults')
    const children = extractGuestsCount(normalizedText, 'Children')
    
    const registrationData: RegistrationData = {
      id: crypto.randomUUID(),
      guestName,
      contactNumber,
      email,
      reservationNumber,
      arrivalDate,
      departureDate,
      nights,
      roomType,
      roomNumber,
      adults,
      children,
      createdAt: new Date().toISOString(),
      status: 'pending',
      isTemplate, // Flag to indicate if this was an unfilled template
    }
    
    return { success: true, data: registrationData }
  } catch (error) {
    console.error('PDF parsing error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to parse PDF',
    }
  }
}

export async function extractPDFText(buffer: Buffer): Promise<string> {
  const { text } = await extractText(new Uint8Array(buffer), { mergePages: true })
  return text
}
