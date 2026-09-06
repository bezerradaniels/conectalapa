import { useParams, useLocation } from 'react-router-dom'
import { PageHeader } from '@/components/layout/page-header'
import { Breadcrumbs } from '@/components/layout/breadcrumbs'
import { Head } from '@/components/seo/head'
import { Card, CardContent } from '@/components/ui/card'

interface Props {
  name: string
  description?: string
}

/**
 * Route placeholder rendering with PageHeader, SEO Head, and breadcrumbs
 * inside the AppShell.
 */
export function RoutePlaceholder({ name, description }: Props) {
  const params = useParams()
  const location = useLocation()

  const isHome = location.pathname === '/'
  const breadcrumbs = isHome ? undefined : (
    <Breadcrumbs
      items={[
        { label: 'Início', to: '/' },
        { label: name },
      ]}
    />
  )

  return (
    <>
      <Head title={name} description={description} />
      <PageHeader
        title={name}
        description={
          description ??
          'Guia oficial e diretório comercial e turístico de Bom Jesus da Lapa.'
        }
        breadcrumbs={breadcrumbs}
      />
      {Object.keys(params).length > 0 && (
        <Card className="mt-4">
          <CardContent className="pt-5">
            <span className="text-xs font-semibold text-text-muted uppercase tracking-wider block mb-2">
              Parâmetros da Rota
            </span>
            <pre className="text-xs font-mono bg-bg-subtle p-3 rounded-md text-text-secondary overflow-x-auto">
              {JSON.stringify(params, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </>
  )
}
