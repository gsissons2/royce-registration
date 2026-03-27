'use client'

interface MarketingOptOutProps {
  checked: boolean
  onChange: (checked: boolean) => void
}

export function MarketingOptOut({ checked, onChange }: MarketingOptOutProps) {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none group min-h-[44px]">
      <div className="relative flex items-center justify-center w-11 h-11">
        <input 
          type="checkbox" 
          className="sr-only peer" 
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <div 
          className={`
            w-6 h-6 border-2 rounded transition-colors flex items-center justify-center
            ${checked 
              ? 'bg-amber-600 border-amber-600' 
              : 'border-neutral-400 dark:border-neutral-500 bg-white dark:bg-neutral-800'
            }
            peer-focus:ring-2 peer-focus:ring-amber-500 peer-focus:ring-offset-2
            dark:peer-focus:ring-offset-neutral-900
          `}
        >
          <svg 
            className={`w-4 h-4 text-white transition-opacity ${checked ? 'opacity-100' : 'opacity-0'}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={3} 
              d="M5 13l4 4L19 7" 
            />
          </svg>
        </div>
      </div>
      <span className="text-sm text-neutral-700 dark:text-neutral-300">
        I do not wish to receive promotional emails from The Royce.
      </span>
    </label>
  )
}
