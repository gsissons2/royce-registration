import { NextResponse } from 'next/server'
import { signRegistration } from '@/lib/storage'

interface RouteContext {
  params: Promise<{ id: string }>
}

interface SignRequest {
  signature: string
  marketingOptOut: boolean
}

export async function POST(
  request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params
    const body: SignRequest = await request.json()
    
    if (!body.signature) {
      return NextResponse.json(
        { error: 'Signature is required' },
        { status: 400 }
      )
    }
    
    const signed = await signRegistration(
      id,
      body.signature,
      body.marketingOptOut ?? false
    )
    
    if (!signed) {
      return NextResponse.json(
        { error: 'Registration not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(signed)
  } catch (error) {
    console.error('Failed to sign registration:', error)
    return NextResponse.json(
      { error: 'Failed to sign registration' },
      { status: 500 }
    )
  }
}
