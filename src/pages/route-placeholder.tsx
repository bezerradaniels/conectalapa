import { useParams } from 'react-router-dom'

type Props = {
  name: string
}

/**
 * Temporary Phase 1 stand-in for every route's real content. Verifies the
 * route table resolves and params are readable; replaced page by page in
 * later phases.
 */
export function RoutePlaceholder({ name }: Props) {
  const params = useParams()

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold text-slate-900">{name}</h1>
      {Object.keys(params).length > 0 && (
        <pre className="mt-4 text-sm text-slate-500">
          {JSON.stringify(params, null, 2)}
        </pre>
      )}
    </div>
  )
}
