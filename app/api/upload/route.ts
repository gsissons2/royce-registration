import { NextRequest, NextResponse } from 'next/server'
import { parsePDF, extractPDFText } from '@/lib/pdf-parser'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      )
    }
    
    // Validate file type
    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { success: false, error: 'File must be a PDF' },
        { status: 400 }
      )
    }
    
    // Validate file size (max 10MB)
    const MAX_SIZE = 10 * 1024 * 1024
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { success: false, error: 'File size exceeds 10MB limit' },
        { status: 400 }
      )
    }
    
    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    
    // Parse the PDF
    const result = await parsePDF(buffer)
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 422 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: result.data,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    )
  }
}

// Debug endpoint to extract raw PDF text
export async function PUT(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    
    if (!file || file.type !== 'application/pdf') {
      return NextResponse.json(
        { success: false, error: 'Valid PDF file required' },
        { status: 400 }
      )
    }
    
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    
    const text = await extractPDFText(buffer)
    
    return NextResponse.json({
      success: true,
      text,
    })
  } catch (error) {
    console.error('Extract error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to extract PDF text' },
      { status: 500 }
    )
  }
}
