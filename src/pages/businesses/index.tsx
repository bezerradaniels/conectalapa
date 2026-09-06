import { useBusinesses } from '@/features/businesses/api/hooks'
import { Spinner } from '@/components/ui/spinner'
import { Button } from '@/components/ui/button'

export default function BusinessListPage() {
  const { data: businesses, isLoading, isError, error, refetch } = useBusinesses()

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-slate-500" data-testid="loading-state">
        <Spinner size="lg" className="mb-4 text-sky-500" />
        <p className="text-sm font-medium">Carregando empresas de Bom Jesus da Lapa...</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50/50 p-6 text-center text-red-700" data-testid="error-state">
        <h3 className="font-semibold">Erro ao carregar empresas</h3>
        <p className="mt-1 text-sm text-red-600">{error?.message || 'Ocorreu um erro ao buscar as empresas.'}</p>
        <Button variant="secondary" size="sm" onClick={() => refetch()} className="mt-4 border-red-300 hover:bg-red-100">
          Tentar novamente
        </Button>
      </div>
    )
  }

  if (!businesses || businesses.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 p-12 text-center text-slate-500" data-testid="empty-state">
        <p className="text-base font-medium text-slate-700">Nenhuma empresa encontrada.</p>
        <p className="mt-1 text-sm">Nenhuma empresa publicada no momento.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6" data-testid="business-list-page">
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-bold text-slate-900">Empresas e Serviços</h1>
        <p className="text-sm text-slate-600">
          Comércio, serviços e profissionais em Bom Jesus da Lapa ({businesses.length} cadastrados)
        </p>
      </div>

      <ul className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white" data-testid="business-list">
        {businesses.map((biz) => (
          <li key={biz.id} className="p-4 hover:bg-slate-50 transition-colors">
            <div className="flex items-start gap-4">
              {biz.logo_url ? (
                <img
                  src={biz.logo_url}
                  alt={biz.name}
                  className="h-12 w-12 rounded-lg object-cover border border-slate-200 shrink-0"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 text-slate-400 font-semibold shrink-0">
                  {biz.name.slice(0, 2).toUpperCase()}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-semibold text-slate-900 truncate">{biz.name}</h2>
                  {biz.category && (
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600 shrink-0">
                      {biz.category.name}
                    </span>
                  )}
                </div>
                {biz.description && (
                  <p className="mt-1 text-sm text-slate-600 line-clamp-2">{biz.description}</p>
                )}
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                  {biz.address && <span>{biz.address}</span>}
                  {biz.whatsapp && <span>WhatsApp: {biz.whatsapp}</span>}
                  {biz.instagram && <span>Instagram: {biz.instagram}</span>}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
