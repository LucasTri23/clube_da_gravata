import { LoaderCircle } from 'lucide-react'

export default function PageLoading() {
  return (
    <div role="status" className="min-h-[60vh] flex flex-col items-center justify-center gap-4" style={{ color: 'var(--gold)' }}>
      <LoaderCircle size={32} className="animate-spin" />
      <p>Carregando...</p>
    </div>
  )
}
