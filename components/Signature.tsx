'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import SignaturePad from 'signature_pad'

interface SignatureProps {
  onChange: (dataUrl: string | null) => void
  className?: string
  placeholder?: string
}

export function Signature({ 
  onChange, 
  className,
  placeholder = 'Sign here'
}: SignatureProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const signaturePadRef = useRef<SignaturePad | null>(null)
  const [isEmpty, setIsEmpty] = useState(true)
  const [isDark, setIsDark] = useState(false)

  // Detect dark mode
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    setIsDark(mediaQuery.matches)

    const handler = (e: MediaQueryListEvent) => setIsDark(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  // Update pen color when theme changes
  useEffect(() => {
    if (signaturePadRef.current) {
      signaturePadRef.current.penColor = isDark ? 'rgb(255, 255, 255)' : 'rgb(0, 0, 0)'
    }
  }, [isDark])

  // Resize canvas to match container
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    // Save current signature data
    const data = signaturePadRef.current?.toData()
    
    // Get container dimensions
    const rect = container.getBoundingClientRect()
    
    // High-DPI support
    const ratio = Math.max(window.devicePixelRatio || 1, 1)
    canvas.width = rect.width * ratio
    canvas.height = rect.height * ratio
    canvas.style.width = `${rect.width}px`
    canvas.style.height = `${rect.height}px`
    
    const ctx = canvas.getContext('2d')
    ctx?.scale(ratio, ratio)
    
    // Restore signature data if any
    if (data && data.length > 0 && signaturePadRef.current) {
      signaturePadRef.current.fromData(data)
    }
  }, [])

  // Initialize SignaturePad
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return

    const canvas = canvasRef.current
    
    // Initial resize
    resizeCanvas()
    
    // Prevent touch scroll/zoom
    canvas.style.touchAction = 'none'

    signaturePadRef.current = new SignaturePad(canvas, {
      minWidth: 0.5,
      maxWidth: 2.5,
      penColor: isDark ? 'rgb(255, 255, 255)' : 'rgb(0, 0, 0)',
      velocityFilterWeight: 0.7,
    })

    // Handle stroke begin - hide placeholder
    signaturePadRef.current.addEventListener('beginStroke', () => {
      setIsEmpty(false)
    })

    // Handle stroke end - emit signature data
    signaturePadRef.current.addEventListener('endStroke', () => {
      onChange(signaturePadRef.current?.toDataURL() || null)
    })

    // Handle window resize
    window.addEventListener('resize', resizeCanvas)

    return () => {
      signaturePadRef.current?.off()
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [onChange, resizeCanvas, isDark])

  const clear = () => {
    signaturePadRef.current?.clear()
    setIsEmpty(true)
    onChange(null)
  }

  return (
    <div className={className}>
      <div 
        ref={containerRef}
        className="relative w-full aspect-[3/1] min-h-[120px]"
      >
        {/* Placeholder text */}
        {isEmpty && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-neutral-400 dark:text-neutral-500 text-lg italic select-none">
              {placeholder}
            </span>
          </div>
        )}
        
        {/* Signature canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 cursor-crosshair"
        />
      </div>
      
      {/* Clear button */}
      <button
        type="button"
        onClick={clear}
        className="mt-2 px-3 py-1 text-sm text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded transition-colors"
      >
        Clear signature
      </button>
    </div>
  )
}
