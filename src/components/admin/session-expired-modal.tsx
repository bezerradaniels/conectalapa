import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ShieldAlert } from 'lucide-react'
import { useAuth } from '@/app/use-auth'
import { Dialog } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const schema = z.object({
  email: z.string().min(1, 'Informe o e-mail.').email('E-mail inválido.'),
  password: z.string().min(1, 'Informe a senha.'),
})

type Values = z.infer<typeof schema>

/**
 * Shown in place of a hard redirect when the session dies mid-use (refresh
 * token expired/revoked). The page underneath stays mounted — an
 * in-progress form keeps its unsaved values — while this blocks further
 * action until the admin re-authenticates.
 */
export function SessionExpiredModal() {
  const { user, signIn, clearSessionExpired } = useAuth()
  const [formError, setFormError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { email: user?.email || '', password: '' },
  })

  async function onSubmit(values: Values) {
    setFormError(null)
    const { error } = await signIn(values.email, values.password)
    if (error) {
      setFormError(error)
      return
    }
    clearSessionExpired()
  }

  return (
    <Dialog isOpen onClose={() => {}} size="sm" title="Sessão expirada">
      <div className="flex items-start gap-3 mb-4">
        <ShieldAlert className="w-5 h-5 text-warning-text shrink-0 mt-0.5" aria-hidden="true" />
        <p className="text-sm text-text-secondary">
          Sua sessão expirou. Suas alterações não foram perdidas — faça login novamente para continuar.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-3">
        <Input label="E-mail" type="email" autoComplete="username" error={errors.email?.message} {...register('email')} />
        <Input label="Senha" type="password" autoComplete="current-password" error={errors.password?.message} {...register('password')} />

        {formError && (
          <p role="alert" className="text-sm text-danger-text bg-danger-bg border border-danger-border rounded-lg px-3 py-2">
            {formError}
          </p>
        )}

        <Button type="submit" className="w-full" isLoading={isSubmitting}>
          Entrar novamente
        </Button>
      </form>
    </Dialog>
  )
}
