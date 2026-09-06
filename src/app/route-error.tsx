import { Link, isRouteErrorResponse, useRouteError } from 'react-router-dom'

// A stale tab holding content-hashed chunk URLs from a previous deploy will
// 404 on its next lazy import once a new build replaces those files — the
// fix is a hard reload, not a "try again" that just re-throws the same
// missing-file error. Different browsers phrase this differently.
function isChunkLoadError(error: unknown): boolean {
  if (!(error instanceof Error)) return false
  return /dynamically imported module|Loading chunk|Importing a module script failed/i.test(error.message)
}

export function RouteError() {
  const error = useRouteError()
  const chunkLoadError = isChunkLoadError(error)

  // Raw error.message (stack traces, Supabase error text, etc.) is never
  // shown to end users — only the small set of cases we can meaningfully
  // act on gets a tailored message; everything else gets a generic one.
  const message = chunkLoadError
    ? 'Uma nova versão do site está disponível. Atualize a página para continuar.'
    : isRouteErrorResponse(error) && error.status === 404
      ? 'O endereço acessado não existe ou foi movido.'
      : 'Ocorreu um erro inesperado. Tente novamente em instantes.'

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="text-2xl font-semibold text-text-primary">Algo deu errado</h1>
      <p className="text-text-secondary max-w-sm">{message}</p>
      {chunkLoadError ? (
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="font-medium text-accent-text underline"
        >
          Atualizar página
        </button>
      ) : (
        <Link to="/" className="font-medium text-accent-text underline">
          Voltar para o início
        </Link>
      )}
    </div>
  )
}
