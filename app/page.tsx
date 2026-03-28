import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <div className="text-center">
        <svg viewBox="0 0 688 308" className="h-16 mx-auto mb-6 text-foreground" fill="currentColor">
          <path d="M39.06 228.8v-25.27h28.1c9.67 0 14.95 5.4 14.95 12.71 0 7.3-5.28 12.56-14.95 12.56h-28.1zm47.01 29.36c-6.75-7.37-16.96-9.01-22.92-9.29l5.4-.05c24.17 0 36.84-12.13 36.84-32.58 0-20.45-14.66-32.88-37.32-32.88H15.79v107.39h23.27v-41.93h15.11l30.36 41.93h27.2l-25.66-32.59zM209.63 292.94c-32.78 0-58.92-23.08-58.92-56.25 0-33.31 26.14-56.25 58.92-56.25s58.93 22.94 58.93 56.25c0 33.17-26.14 56.25-58.93 56.25m0-92.34c-21.6 0-35.65 14.9-35.65 36.09 0 21.04 14.05 36.09 35.65 36.09 21.61 0 35.66-15.05 35.66-36.09 0-21.19-14.05-36.09-35.66-36.09M365.26 290.75h-23.27v-43.54l-43.51-63.85h26.89s18.56 28.38 20.53 31.18c7.87 11.21 7.73 29.89 7.73 29.89s.72-19.2 7.63-29.45c1.73-2.56 21.07-31.62 21.07-31.62h26.74l-43.81 63.56v43.83zM497.16 292.94c-33.99 0-58.17-23.38-58.17-56.4 0-33.9 25.68-56.1 58.17-56.1 21.91 0 41.7 10.08 50.76 28.79l-19.03 12.13c-4.23-12.13-16.17-20.76-32.03-20.76-20.55 0-34.6 14.32-34.6 36.09 0 21.19 13.45 36.09 34.3 36.09 15.41 0 28.86-8.04 32.93-21.19l19.19 12.13c-9.97 18.85-28.71 29.22-51.52 29.22M593.25 183.36v107.39h77.95v-20.17h-54.69v-23.66h50.31v-19.87h-50.31v-23.52h54.39v-20.17z"/>
        </svg>
        <h1 className="font-serif text-3xl mb-4">The Royce Hotel</h1>
        <p className="text-muted mb-8">Guest Registration System</p>
        <Link 
          href="/admin" 
          className="inline-block px-6 py-3 bg-accent text-white rounded-lg hover:opacity-90 transition-opacity"
        >
          Staff Login
        </Link>
      </div>
    </div>
  )
}
