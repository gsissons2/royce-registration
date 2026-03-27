export default function SignPage({ params }: { params: { id: string } }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Guest Registration</h1>
        <p className="text-foreground/70 mb-4">Registration ID: {params.id}</p>
        <p className="text-foreground/50">Signature capture coming soon...</p>
      </div>
    </main>
  )
}
