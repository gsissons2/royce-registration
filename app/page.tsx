export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">The Royce Hotel</h1>
        <p className="text-xl text-foreground/70 mb-8">Guest Registration System</p>
        <div className="flex flex-col gap-4">
          <a 
            href="/admin"
            className="px-6 py-3 bg-foreground text-background rounded-lg hover:opacity-90 transition-opacity"
          >
            Admin Dashboard
          </a>
        </div>
      </div>
    </main>
  )
}
