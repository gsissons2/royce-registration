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
  const [mounted, setMounted] = useState(false)

  // Detect dark mode
  useEffect(() => {
    setMounted(true)
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    setIsDark(mediaQuery.matches)

    const handler = (e: MediaQueryListEvent) => setIsDark(e.matches)
    mediaQuery.addEventListener('change', handler)
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])

  // Update pen color when theme changes (WITHOUT re-creating SignaturePad)
  useEffect(() => {
    if (signaturePadRef.current && mounted) {
      signaturePadRef.current.penColor = isDark ? 'rgb(255, 255, 255)' : 'rgb(0, 0, 0)'
    }
  }, [isDark, mounted])

  // Resize canvas
  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const data = signaturePadRef.current?.toData()
    const rect = container.getBoundingClientRect()
    const ratio = Math.max(window.devicePixelRatio || 1, 1)
    
    canvas.width = rect.width * ratio
    canvas.height = rect.height * ratio
    canvas.style.width = `${rect.width}px`
    canvas.style.height = `${rect.height}px`
    
    const ctx = canvas.getContext('2d')
    ctx?.scale(ratio, ratio)
    
    if (data && data.length > 0 && signaturePadRef.current) {
      signaturePadRef.current.fromData(data)
    }
  }, [])

  // Initialize SignaturePad ONCE (no isDark in dependencies)
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current || !mounted) return

    const canvas = canvasRef.current
    resizeCanvas()
    canvas.style.touchAction = 'none'

    const initialDark = window.matchMedia('(prefers-color-scheme: dark)').matches

    signaturePadRef.current = new SignaturePad(canvas, {
      minWidth: 0.5,
      maxWidth: 2.5,
      penColor: initialDark ? 'rgb(255, 255, 255)' : 'rgb(0, 0, 0)',
      velocityFilterWeight: 0.7,
    })

    signaturePadRef.current.addEventListener('beginStroke', () => {
      setIsEmpty(false)
    })

    signaturePadRef.current.addEventListener('endStroke', () => {
      onChange(signaturePadRef.current?.toDataURL() || null)
    })

    window.addEventListener('resize', resizeCanvas)

    return () => {
      signaturePadRef.current?.off()
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [onChange, resizeCanvas, mounted])

  const clear = () => {
    signaturePadRef.current?.clear()
    setIsEmpty(true)
    onChange(null)
  }

  if (!mounted) {
    return <div className={className}><div className="w-full aspect-[3/1] min-h-[120px] bg-neutral-100 dark:bg-neutral-800 rounded-lg" /></div>
  }

  return (
    <div className={className}>
      <div ref={containerRef} className="relative w-full aspect-[3/1] min-h-[120px]">
        {isEmpty && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-neutral-400 dark:text-neutral-500 text-lg italic select-none">
              {placeholder}
            </span>
          </div>
        )}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 cursor-crosshair"
        />
      </div>
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
