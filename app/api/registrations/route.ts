import { NextResponse } from 'next/server'
import { listRegistrations, saveRegistration } from '@/lib/storage'
import { RegistrationData } from '@/types/registration'

export async function GET() {
  try {
    const registrations = await listRegistrations()
    return NextResponse.json(registrations)
  } catch (error) {
    console.error('Failed to list registrations:', error)
    return NextResponse.json(
      { error: 'Failed to list registrations' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const data: RegistrationData = await request.json()
    await saveRegistration(data)
    return NextResponse.json({ success: true, id: data.id })
  } catch (error) {
    console.error('Failed to save registration:', error)
    return NextResponse.json(
      { error: 'Failed to save registration' },
      { status: 500 }
    )
  }
}
