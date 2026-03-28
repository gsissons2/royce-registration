export interface RegistrationData {
  id: string
  guestName: string
  contactNumber: string
  email: string
  reservationNumber: string
  arrivalDate: string
  departureDate: string
  nights: number
  roomType: string
  roomNumber: string
  adults: number
  children: number
  createdAt: string
  status: 'pending' | 'signed'
}

export interface SignedRegistration extends RegistrationData {
  status: 'signed'
  signedAt: string
  signature: string
  marketingOptOut: boolean
}

export interface ParsedPDFResult {
  success: boolean
  data?: RegistrationData
  error?: string
}
