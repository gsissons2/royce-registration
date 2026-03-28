import { NextResponse } from 'next/server'
import { getRegistration, deleteRegistration } from '@/lib/storage'

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function GET(
  request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params
    const registration = await getRegistration(id)
    
    if (!registration) {
      return NextResponse.json(
        { error: 'Registration not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(registration)
  } catch (error) {
    console.error('Failed to get registration:', error)
    return NextResponse.json(
      { error: 'Failed to get registration' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params
    const deleted = await deleteRegistration(id)
    
    if (!deleted) {
      return NextResponse.json(
        { error: 'Registration not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete registration:', error)
    return NextResponse.json(
      { error: 'Failed to delete registration' },
      { status: 500 }
    )
  }
}
