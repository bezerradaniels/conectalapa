import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { LogIn } from 'lucide-react'
import { useAuth } from '@/app/use-auth'
import { Head } from '@/components/seo/head'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const loginSchema = z.object({
  email: z.string().min(1, 'Informe o e-mail.').email('E-mail inválido.'),
  password: z.string().min(1, 'Informe a senha.'),
})

type LoginValues = z.infer<typeof loginSchema>

export default function AdminLoginPage() {
  const { session, isAdmin, loading, signIn } = useAuth()
  const [formError, setFormError] = useState<string | null>(null)
  const navigate = useNavigate()
  const location = useLocation()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) })

  if (!loading && session && isAdmin) {
    const from = (location.state as { from?: string } | null)?.from || '/admin'
    return <Navigate to={from} replace />
  }

  async function onSubmit(values: LoginValues) {
    setFormError(null)
    const { error } = await signIn(values.email, values.password)
    if (error) {
      setFormError(error)
      return
    }
    const from = (location.state as { from?: string } | null)?.from || '/admin'
    navigate(from, { replace: true })
  }

  return (
    <div className="min-h-svh flex items-center justify-center bg-slate-950 px-4">
      <Head title="Login administrativo" />
      <div className="w-full max-w-sm bg-bg-surface border border-border-hairline rounded-2xl p-6 sm:p-8 shadow-none">
        <div className="flex items-center gap-2.5 mb-6">
          <span className="w-9 h-9 rounded-lg bg-accent-subtle border border-accent-border text-accent-text flex items-center justify-center shrink-0">
            <LogIn className="w-4.5 h-4.5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">ConectaLapa</p>
            <h1 className="text-lg font-bold text-text-primary leading-tight">Painel administrativo</h1>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          <Input
            label="E-mail"
            type="email"
            autoComplete="username"
            error={errors.email?.message}
            {...register('email')}
          />
          <Input
            label="Senha"
            type="password"
            autoComplete="current-password"
            error={errors.password?.message}
            {...register('password')}
          />

          {formError && (
            <p role="alert" className="text-sm text-danger-text bg-danger-bg border border-danger-border rounded-lg px-3 py-2">
              {formError}
            </p>
          )}

          <Button type="submit" className="w-full" isLoading={isSubmitting}>
            Entrar
          </Button>
        </form>
      </div>
    </div>
  )
}
