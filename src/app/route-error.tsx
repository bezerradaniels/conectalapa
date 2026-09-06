import { Link, isRouteErrorResponse, useRouteError } from 'react-router-dom'

export function RouteError() {
  const error = useRouteError()

  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : error instanceof Error
      ? error.message
      : 'Erro inesperado.'

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="text-2xl font-semibold text-slate-900">
        Algo deu errado
      </h1>
      <p className="text-slate-600">{message}</p>
      <Link to="/" className="font-medium text-sky-600 underline">
        Voltar para o início
      </Link>
    </div>
  )
}
