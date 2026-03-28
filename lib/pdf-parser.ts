import { RegistrationData, ParsedPDFResult } from '@/types/registration'
import { extractText } from 'unpdf'

function extractField(text: string, patterns: RegExp[]): string | null {
  for (const pattern of patterns) {
    const match = text.match(pattern)
    if (match && match[1]) {
      return match[1].trim()
    }
  }
  return null
}

function extractNumber(text: string, patterns: RegExp[]): number {
  const value = extractField(text, patterns)
  if (value) {
    const num = parseInt(value, 10)
    return isNaN(num) ? 0 : num
  }
  return 0
}

export async function parsePDF(buffer: Buffer): Promise<ParsedPDFResult> {
  try {
    const { text } = await extractText(buffer, { mergePages: true })
    const normalizedText = text.replace(/\s+/g, ' ')
    
    console.log('Extracted text:', normalizedText.substring(0, 500))
    
    const guestName = extractField(normalizedText, [
      /(?:Guest\s*Name|Name)\s*[:\-]?\s*([A-Za-z\s\.]+?)(?=\s*(?:Mobile|Phone|Email|Contact|$))/i,
      /(?:Mr|Mrs|Ms|Dr|Miss)\.?\s+([A-Za-z\s]+?)(?=\s*(?:Mobile|Phone|Email|$))/i,
    ]) || ''
    
    const contactNumber = extractField(normalizedText, [
      /(?:Mobile|Phone|Contact)\s*[:\-]?\s*([\d\s\+\-\(\)]+?)(?=\s*(?:Email|$|\s{2,}))/i,
    ]) || ''
    
    const email = extractField(normalizedText, [
      /(?:Email|E-mail)\s*[:\-]?\s*([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i,
      /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i,
    ]) || ''
    
    const reservationNumber = extractField(normalizedText, [
      /(?:Reservation\s*(?:No|Number|#)?|Res\.?\s*No\.?)\s*[:\-]?\s*(\w+)/i,
    ]) || ''
    
    const arrivalDate = extractField(normalizedText, [
      /(?:Arrival|Check[\s-]?in)\s*(?:Date)?\s*[:\-]?\s*(\d{1,2}[\s\/\-]\w+[\s\/\-]\d{2,4}|\w+\s+\d{1,2},?\s+\d{4})/i,
    ]) || ''
    
    const departureDate = extractField(normalizedText, [
      /(?:Departure|Check[\s-]?out)\s*(?:Date)?\s*[:\-]?\s*(\d{1,2}[\s\/\-]\w+[\s\/\-]\d{2,4}|\w+\s+\d{1,2},?\s+\d{4})/i,
    ]) || ''
    
    const nights = extractNumber(normalizedText, [/(?:Nights?)\s*[:\-]?\s*(\d+)/i])
    const roomType = extractField(normalizedText, [/(?:Room\s*Type|Category)\s*[:\-]?\s*([A-Za-z\s]+?)(?=\s*(?:Room|$))/i]) || ''
    const roomNumber = extractField(normalizedText, [/(?:Room\s*(?:No|Number)?|Bed)\s*[:\-]?\s*(\d+[A-Za-z]?)/i]) || ''
    const adults = extractNumber(normalizedText, [/(?:Adults?)\s*[:\-]?\s*(\d+)/i])
    const children = extractNumber(normalizedText, [/(?:Children)\s*[:\-]?\s*(\d+)/i])
    
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
  const { text } = await extractText(buffer, { mergePages: true })
  return text
}
