import { Link } from 'react-router-dom'

const SHORTCUTS = [
  { to: '/empresas', label: 'Empresas' },
  { to: '/eventos', label: 'Eventos' },
  { to: '/pacotes', label: 'Pacotes de viagem' },
  { to: '/hospedagem', label: 'Hospedagem' },
  { to: '/gastronomia', label: 'Gastronomia' },
]

export default function NotFoundPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-5 p-8 text-center">
      <h1 className="text-2xl font-semibold text-text-primary">
        Página não encontrada
      </h1>
      <p className="text-text-secondary max-w-sm">
        O endereço acessado não existe ou foi movido.
      </p>
      <Link
        to="/"
        className="inline-flex items-center justify-center h-10 px-5 rounded-lg bg-accent text-white text-sm font-semibold hover:opacity-90 transition-opacity"
      >
        Voltar para o início
      </Link>
      <nav aria-label="Seções do site" className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 mt-2">
        {SHORTCUTS.map((s) => (
          <Link key={s.to} to={s.to} className="text-sm font-medium text-accent-text underline underline-offset-2">
            {s.label}
          </Link>
        ))}
      </nav>
    </div>
  )
}
