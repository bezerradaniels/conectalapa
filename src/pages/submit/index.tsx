import { useEffect, useRef, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CheckCircle2, Send } from 'lucide-react'
import { Head } from '@/components/seo/head'
import { PageHeader } from '@/components/layout/page-header'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { normalizePhoneToE164BR, formatPhoneBRInput } from '@/lib/whatsapp'
import { isLikelySpam, HONEYPOT_FIELD_NAME } from '@/lib/spam'
import { useCreateSubmission } from '@/features/submissions/api/hooks'
import type { ContentDomain } from '@/types'
import type { SubmissionPayload } from '@/features/submissions/api/queries'

const DRAFT_KEY = 'conectalapa:submit-draft'

const DOMAIN_OPTIONS: { value: ContentDomain; label: string }[] = [
  { value: 'business', label: 'Empresa ou serviço' },
  { value: 'event', label: 'Evento' },
  { value: 'package', label: 'Pacote de viagem' },
  { value: 'lodging', label: 'Hospedagem' },
  { value: 'dining', label: 'Restaurante ou bar' },
]

const NAME_LABEL: Record<ContentDomain, string> = {
  business: 'Nome da empresa',
  event: 'Nome do evento',
  package: 'Destino do pacote',
  lodging: 'Nome da hospedagem',
  dining: 'Nome do restaurante ou bar',
}

const schema = z.object({
  contact_name: z.string().trim().min(2, 'Informe seu nome.'),
  contact_phone: z.string().refine((v) => Boolean(normalizePhoneToE164BR(v)), 'Informe um WhatsApp válido com DDD.'),
  contact_email: z.string().trim().email('E-mail inválido.').optional().or(z.literal('')),
  target_domain: z.enum(['business', 'event', 'package', 'lodging', 'dining']),
  name: z.string().trim().min(2, 'Informe o nome.'),
  description: z.string().trim().min(10, 'Conte um pouco mais (pelo menos 10 caracteres).'),
  address: z.string().optional(),
  instagram: z.string().optional(),
  website: z.string().optional(),
  event_date: z.string().optional(),
  destination: z.string().optional(),
  [HONEYPOT_FIELD_NAME]: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

const DEFAULT_VALUES: FormValues = {
  contact_name: '',
  contact_phone: '',
  contact_email: '',
  target_domain: 'business',
  name: '',
  description: '',
  address: '',
  instagram: '',
  website: '',
  event_date: '',
  destination: '',
  [HONEYPOT_FIELD_NAME]: '',
}

export default function SubmitPage() {
  const mountedAtRef = useRef(Date.now())
  const [isSuccess, setIsSuccess] = useState(false)
  const createMutation = useCreateSubmission()
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    defaultValues: DEFAULT_VALUES,
  })

  // Restore an in-progress draft — a dropped connection or an accidental
  // tab close shouldn't cost someone their submission.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY)
      if (saved) reset({ ...DEFAULT_VALUES, ...JSON.parse(saved) })
    } catch {
      // Corrupted or inaccessible storage — start fresh, no big deal.
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const watchedValues = watch()
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const draftable = { ...watchedValues }
        delete draftable[HONEYPOT_FIELD_NAME]
        localStorage.setItem(DRAFT_KEY, JSON.stringify(draftable))
      } catch {
        // Storage full/blocked — the draft is a convenience, not a requirement.
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [watchedValues])

  const targetDomain = watch('target_domain')

  async function onSubmit(values: FormValues) {
    setSubmitError(null)

    const spam = isLikelySpam({
      contactName: values.contact_name,
      entityName: values.name,
      description: values.description,
      honeypot: values[HONEYPOT_FIELD_NAME],
      formMountedAtMs: mountedAtRef.current,
    })

    if (spam) {
      // Fail quietly: a blocked bot sees the exact same success screen a
      // real submitter would, so it never learns anything was caught.
      finishSuccessfully()
      return
    }

    const payload: SubmissionPayload = {
      name: values.name,
      description: values.description,
      address: values.address || undefined,
      instagram: values.instagram || undefined,
      website: values.website || undefined,
      event_date: values.target_domain === 'event' ? values.event_date || undefined : undefined,
      destination: values.target_domain === 'package' ? values.destination || undefined : undefined,
    }

    try {
      await createMutation.mutateAsync({
        contact_name: values.contact_name,
        contact_phone: normalizePhoneToE164BR(values.contact_phone) || values.contact_phone,
        contact_email: values.contact_email || null,
        target_domain: values.target_domain,
        payload,
      })
      finishSuccessfully()
    } catch (err) {
      // The Phase 3 rate-limit trigger (P0001) is itself a spam layer —
      // it fails quietly too, same as the client-side checks above.
      const code = (err as { code?: string })?.code
      if (code === 'P0001') {
        finishSuccessfully()
        return
      }
      setSubmitError('Não foi possível enviar sua solicitação. Verifique sua conexão e tente novamente.')
    }
  }

  function finishSuccessfully() {
    try {
      localStorage.removeItem(DRAFT_KEY)
    } catch {
      // Nothing to do if storage isn't available.
    }
    setIsSuccess(true)
  }

  if (isSuccess) {
    return (
      <div className="max-w-lg mx-auto py-12 text-center">
        <Head title="Solicitação enviada" />
        <div className="w-14 h-14 rounded-full bg-success-bg border border-success-border text-success-text flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-7 h-7" aria-hidden="true" />
        </div>
        <h1 className="text-xl font-bold text-text-primary mb-2">Recebemos sua solicitação!</h1>
        <p className="text-sm text-text-secondary">
          Vamos entrar em contato pelo WhatsApp em até 2 dias úteis para confirmar os detalhes e publicar seu cadastro.
        </p>
        <Button
          type="button"
          variant="secondary"
          className="mt-6"
          onClick={() => {
            setIsSuccess(false)
            reset(DEFAULT_VALUES)
          }}
        >
          Enviar outra solicitação
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto">
      <Head
        title="Solicitar cadastro"
        description="Peça para incluir sua empresa, evento, pacote, hospedagem ou restaurante no ConectaLapa."
      />
      <PageHeader
        title="Solicitar cadastro"
        description="Conte um pouco sobre o que você quer anunciar. Nós entramos em contato pelo WhatsApp para confirmar os detalhes e publicar."
      />

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        {/* Honeypot — invisible to real visitors, irresistible to naive bots. */}
        <div className="absolute left-[-9999px] w-px h-px overflow-hidden" aria-hidden="true">
          <label htmlFor={HONEYPOT_FIELD_NAME}>Deixe este campo em branco</label>
          <input id={HONEYPOT_FIELD_NAME} type="text" tabIndex={-1} autoComplete="off" {...register(HONEYPOT_FIELD_NAME)} />
        </div>

        <Controller
          control={control}
          name="target_domain"
          render={({ field }) => (
            <Select label="O que você quer anunciar?" required options={DOMAIN_OPTIONS} {...field} />
          )}
        />

        <Input
          label={NAME_LABEL[targetDomain]}
          required
          error={errors.name?.message}
          inputMode="text"
          {...register('name')}
        />

        {targetDomain === 'event' && (
          <Input label="Data do evento (se já souber)" type="date" {...register('event_date')} />
        )}
        {targetDomain === 'package' && (
          <Input label="Saída de onde?" placeholder="Ex: Bom Jesus da Lapa" {...register('destination')} />
        )}

        <Textarea
          label="Conte o que você gostaria de anunciar"
          required
          rows={4}
          placeholder="Ex: restaurante de comida caseira, aberto de terça a domingo, no Centro..."
          error={errors.description?.message}
          {...register('description')}
        />

        <Input label="Seu nome" required inputMode="text" error={errors.contact_name?.message} {...register('contact_name')} />

        <Controller
          control={control}
          name="contact_phone"
          render={({ field }) => (
            <Input
              label="WhatsApp"
              required
              type="tel"
              inputMode="tel"
              placeholder="(77) 99999-9999"
              error={errors.contact_phone?.message}
              value={field.value}
              onChange={(e) => field.onChange(formatPhoneBRInput(e.target.value))}
              onBlur={field.onBlur}
            />
          )}
        />

        <Input label="Endereço (opcional)" {...register('address')} />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Instagram (opcional)" placeholder="@perfil" {...register('instagram')} />
          <Input label="Site (opcional)" placeholder="https://…" {...register('website')} />
        </div>

        <Input label="E-mail (opcional)" type="email" inputMode="email" error={errors.contact_email?.message} {...register('contact_email')} />

        {submitError && (
          <p role="alert" className="text-sm text-danger-text bg-danger-bg border border-danger-border rounded-lg px-3 py-2">
            {submitError}
          </p>
        )}

        <p className="text-xs text-text-muted">
          Seus dados são usados apenas para entrarmos em contato sobre este pedido de cadastro e não são publicados.
        </p>

        <Button type="submit" size="lg" className="w-full" isLoading={isSubmitting} leadingIcon={<Send className="w-4 h-4" aria-hidden="true" />}>
          Enviar solicitação
        </Button>
      </form>
    </div>
  )
}
