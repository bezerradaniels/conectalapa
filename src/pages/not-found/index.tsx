import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="text-2xl font-semibold text-slate-900">
        Página não encontrada
      </h1>
      <p className="text-slate-600">
        O endereço acessado não existe ou foi movido.
      </p>
      <Link to="/" className="font-medium text-sky-600 underline">
        Voltar para o início
      </Link>
    </div>
  )
}
