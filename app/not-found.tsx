import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <div className="text-center p-8">
        <h1 className="font-serif text-6xl mb-4">404</h1>
        <h2 className="font-serif text-2xl mb-2">Page not found</h2>
        <p className="text-muted mb-6">The page you&apos;re looking for doesn&apos;t exist.</p>
        <Link
          href="/"
          className="px-6 py-3 bg-accent text-white rounded-lg hover:opacity-90 transition-opacity inline-block"
        >
          Return home
        </Link>
      </div>
    </div>
  )
}
