import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, Save } from 'lucide-react'
import {
  usePackageAdminDetail,
  usePackageFilterMeta,
  usePackageAmenities,
  useCreatePackageAdmin,
  useUpdatePackageAdmin,
} from '@/features/packages/api/hooks'
import { useBusinessesAdminPaginated } from '@/features/businesses/api/hooks'
import { useApproveSubmission } from '@/features/submissions/api/hooks'
import type { SubmissionPayload } from '@/features/submissions/api/queries'
import { formatPhoneBRInput } from '@/lib/whatsapp'
import { Head } from '@/components/seo/head'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { Spinner } from '@/components/ui/spinner'
import {
  AdminFormShell,
  SlugField,
  StatusControl,
  MultiSelectField,
  ImageUploadField,
  StatusBadge,
  useUnsavedChangesWarning,
  UnsavedChangesDialog,
  useUploadSession,
  useSubmissionPrefill,
} from '@/components/admin'
import { PackageDetailView } from '@/pages/packages/detail-view'
import type { PackageWithRelations } from '@/types'

const schema = z
  .object({
    destination: z.string().min(2, 'Informe o destino.'),
    slug: z.string().min(1, 'Informe o slug.'),
    category_id: z.string().optional(),
    departure_location: z.string().min(1, 'Informe o local de saída.'),
    departure_date: z.string().min(1, 'Informe a data de saída.'),
    return_date: z.string().min(1, 'Informe a data de retorno.'),
    agencyMode: z.enum(['registered', 'unregistered']),
    agency_id: z.string().optional(),
    agency_name: z.string().optional(),
    agency_whatsapp: z.string().optional(),
    price: z.string().optional(),
    information: z.string().optional(),
    status: z.enum(['draft', 'published', 'archived']),
  })
  .refine((data) => data.return_date >= data.departure_date, {
    message: 'O retorno não pode ser antes da saída.',
    path: ['return_date'],
  })
  .refine((data) => data.agencyMode !== 'registered' || Boolean(data.agency_id), {
    message: 'Selecione a agência.',
    path: ['agency_id'],
  })
  .refine((data) => data.agencyMode !== 'unregistered' || Boolean(data.agency_name), {
    message: 'Informe o nome da agência.',
    path: ['agency_name'],
  })

type FormValues = z.infer<typeof schema>

export default function AdminPackageFormPage() {
  const { id } = useParams()
  const isEditing = Boolean(id)
  const navigate = useNavigate()

  const { data: existing, isLoading: isLoadingExisting } = usePackageAdminDetail(id)
  const { data: meta } = usePackageFilterMeta()
  const { data: amenities } = usePackageAmenities()
  const { data: businesses } = useBusinessesAdminPaginated({ status: 'all', sortField: 'name', pageSize: 200 })
  const createMutation = useCreatePackageAdmin()
  const updateMutation = useUpdatePackageAdmin()
  const { submissionId, submission } = useSubmissionPrefill()
  const approveSubmissionMutation = useApproveSubmission()

  const session = useUploadSession()
  const newIdRef = useRef(crypto.randomUUID())
  const entityId = existing?.id || newIdRef.current

  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [amenityIds, setAmenityIds] = useState<string[]>([])
  const [hydrated, setHydrated] = useState(!isEditing && !submissionId)
  const [showPreview, setShowPreview] = useState(false)
  const saveIntentRef = useRef<'stay' | 'new'>('stay')

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      status: 'draft',
      agencyMode: 'registered',
      category_id: '',
      slug: '',
      destination: '',
      departure_location: '',
      departure_date: '',
      return_date: '',
      agency_id: '',
      agency_name: '',
      agency_whatsapp: '',
      price: '',
      information: '',
    },
  })

  // reset() is an imperative external-store call, not pure state — belongs
  // in an effect, not the render body (see businesses/form.tsx for why).
  useEffect(() => {
    if (!existing || hydrated) return
    setHydrated(true)
    reset({
      destination: existing.destination,
      slug: existing.slug,
      category_id: existing.category_id || '',
      departure_location: existing.departure_location,
      departure_date: existing.departure_date,
      return_date: existing.return_date,
      agencyMode: existing.agency_id ? 'registered' : 'unregistered',
      agency_id: existing.agency_id || '',
      agency_name: existing.agency_name || '',
      agency_whatsapp: existing.agency_whatsapp || '',
      price: existing.price != null ? String(existing.price) : '',
      information: existing.information || '',
      status: existing.status as FormValues['status'],
    })
    setImageUrl(existing.image_url)
    setAmenityIds(existing.amenities.map((a) => a.id))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existing, hydrated])

  useEffect(() => {
    if (isEditing || !submission || hydrated) return
    setHydrated(true)
    const payload = submission.payload as unknown as SubmissionPayload
    reset({
      status: 'draft',
      agencyMode: 'unregistered',
      category_id: '',
      slug: '',
      destination: payload.destination || payload.name || '',
      departure_location: '',
      departure_date: '',
      return_date: '',
      agency_id: '',
      agency_name: submission.contact_name,
      agency_whatsapp: formatPhoneBRInput(submission.contact_phone.replace(/^55/, '')),
      price: '',
      information: payload.description || '',
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing, submission, hydrated])

  const { blocker, allowNavigation } = useUnsavedChangesWarning(isDirty)

  const destinationValue = watch('destination')
  const slugValue = watch('slug')
  const statusValue = watch('status')
  const agencyModeValue = watch('agencyMode')
  const agencyIdValue = watch('agency_id')
  const agencyNameValue = watch('agency_name')
  const agencyWhatsappValue = watch('agency_whatsapp')
  const departureLocationValue = watch('departure_location')
  const departureDateValue = watch('departure_date')
  const returnDateValue = watch('return_date')
  const priceValue = watch('price')
  const informationValue = watch('information')
  const categoryIdValue = watch('category_id')

  async function onSubmit(values: FormValues) {
    const input = {
      destination: values.destination,
      slug: values.slug,
      category_id: values.category_id || null,
      departure_location: values.departure_location,
      departure_date: values.departure_date,
      return_date: values.return_date,
      agency_id: values.agencyMode === 'registered' ? values.agency_id || null : null,
      agency_name: values.agencyMode === 'unregistered' ? values.agency_name || null : null,
      agency_whatsapp: values.agencyMode === 'unregistered' ? values.agency_whatsapp || null : null,
      information: values.information || null,
      price: values.price ? Number(values.price) : null,
      image_url: imageUrl,
      status: values.status,
      amenityIds,
    }

    if (isEditing && id) {
      await updateMutation.mutateAsync({ id, input })
    } else {
      await createMutation.mutateAsync({ ...input, id: entityId })
      if (submissionId) {
        await approveSubmissionMutation.mutateAsync({ id: submissionId, table: 'packages', entityId })
      }
    }

    await session.commitAndCleanup()
    allowNavigation()

    if (saveIntentRef.current === 'new') {
      navigate('/admin/pacotes/novo', { replace: true })
      window.location.reload()
    } else {
      navigate('/admin/pacotes')
    }
  }

  const selectedAgency = businesses?.data.find((b) => b.id === agencyIdValue)

  const previewEntity = useMemo<PackageWithRelations | null>(() => {
    if (!showPreview || !departureDateValue || !returnDateValue) return null
    return {
      id: entityId,
      slug: slugValue || 'preview',
      destination: destinationValue || 'Sem destino',
      status: statusValue,
      departure_location: departureLocationValue || '',
      departure_date: departureDateValue,
      return_date: returnDateValue,
      agency_id: agencyModeValue === 'registered' ? agencyIdValue || null : null,
      agency_name: agencyModeValue === 'unregistered' ? agencyNameValue || null : null,
      agency_whatsapp: agencyModeValue === 'unregistered' ? agencyWhatsappValue || null : null,
      information: informationValue || null,
      price: priceValue ? Number(priceValue) : null,
      image_url: imageUrl,
      created_at: existing?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
      category_id: categoryIdValue || null,
      category: meta?.categories.find((c) => c.id === categoryIdValue) || null,
      agency: agencyModeValue === 'registered' && selectedAgency ? (selectedAgency as unknown as PackageWithRelations['agency']) : null,
      amenities: (amenities || []).filter((a) => amenityIds.includes(a.id)),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any
  }, [
    showPreview,
    entityId,
    slugValue,
    destinationValue,
    statusValue,
    departureLocationValue,
    departureDateValue,
    returnDateValue,
    agencyModeValue,
    agencyIdValue,
    agencyNameValue,
    agencyWhatsappValue,
    informationValue,
    priceValue,
    imageUrl,
    existing,
    meta,
    categoryIdValue,
    selectedAgency,
    amenities,
    amenityIds,
  ])

  if (isEditing && isLoadingExisting) {
    return (
      <div className="flex items-center justify-center py-24">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div>
      <Head title={isEditing ? 'Editar pacote' : 'Novo pacote'} />
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <AdminFormShell
          title={isEditing ? existing?.destination || 'Editar pacote' : 'Novo pacote'}
          backTo="/admin/pacotes"
          statusBadge={isEditing && existing ? <StatusBadge status={existing.status as FormValues['status']} /> : undefined}
          actions={
            <>
              <Button type="button" variant="secondary" leadingIcon={<Eye className="w-4 h-4" aria-hidden="true" />} onClick={() => setShowPreview(true)}>
                Pré-visualizar
              </Button>
              {!isEditing && (
                <Button type="submit" variant="secondary" isLoading={isSubmitting && saveIntentRef.current === 'new'} onClick={() => (saveIntentRef.current = 'new')}>
                  Salvar e criar outro
                </Button>
              )}
              <Button type="submit" isLoading={isSubmitting && saveIntentRef.current === 'stay'} leadingIcon={<Save className="w-4 h-4" aria-hidden="true" />} onClick={() => (saveIntentRef.current = 'stay')}>
                Salvar
              </Button>
            </>
          }
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Destino" required error={errors.destination?.message} {...register('destination')} />
                <Controller
                  control={control}
                  name="category_id"
                  render={({ field }) => (
                    <Select
                      label="Categoria"
                      options={[{ value: '', label: 'Sem categoria' }, ...((meta?.categories || []).map((c) => ({ value: c.id, label: c.name })))]}
                      {...field}
                    />
                  )}
                />
              </div>

              <Controller
                control={control}
                name="slug"
                render={({ field }) => (
                  <SlugField
                    table="packages"
                    value={field.value}
                    onChange={field.onChange}
                    sourceText={destinationValue || ''}
                    entityId={id}
                    isPublished={existing?.status === 'published'}
                    originalSlug={existing?.slug}
                    error={errors.slug?.message}
                  />
                )}
              />

              <Input label="Local de saída" required error={errors.departure_location?.message} {...register('departure_location')} />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Data de saída" type="date" required error={errors.departure_date?.message} {...register('departure_date')} />
                <Input label="Data de retorno" type="date" required error={errors.return_date?.message} {...register('return_date')} />
              </div>

              <div className="space-y-3 rounded-lg border border-border-hairline p-4">
                <span className="block text-sm font-medium text-text-primary">Agência</span>
                <Controller
                  control={control}
                  name="agencyMode"
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onChange={field.onChange}
                      options={[
                        { value: 'registered', label: 'Agência já cadastrada em Empresas' },
                        { value: 'unregistered', label: 'Agência ainda não cadastrada' },
                      ]}
                    />
                  )}
                />
                {agencyModeValue === 'registered' ? (
                  <Controller
                    control={control}
                    name="agency_id"
                    render={({ field }) => (
                      <Select
                        label="Selecione a agência"
                        error={errors.agency_id?.message}
                        options={[{ value: '', label: 'Selecione…' }, ...((businesses?.data || []).map((b) => ({ value: b.id, label: b.name })))]}
                        {...field}
                      />
                    )}
                  />
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input label="Nome da agência" error={errors.agency_name?.message} {...register('agency_name')} />
                    <Input label="WhatsApp da agência" placeholder="(77) 99999-9999" {...register('agency_whatsapp')} />
                  </div>
                )}
              </div>

              <Input label="Preço (R$)" type="number" step="0.01" min="0" placeholder="Deixe em branco se a partir de valor variável" {...register('price')} />

              <Textarea label="Informações" rows={4} {...register('information')} />

              <MultiSelectField
                label="O que está incluso"
                options={(amenities || []).map((a) => ({ value: a.id, label: a.name }))}
                values={amenityIds}
                onChange={setAmenityIds}
              />
            </div>

            <div className="space-y-6">
              <ImageUploadField label="Imagem" bucket="galleries" domain="package" entityId={entityId} value={imageUrl} onChange={setImageUrl} session={session} />
              <Controller control={control} name="status" render={({ field }) => <StatusControl value={field.value} onChange={field.onChange} />} />
            </div>
          </div>
        </AdminFormShell>
      </form>

      <UnsavedChangesDialog blocker={blocker} />

      {showPreview && previewEntity && (
        <Dialog isOpen onClose={() => setShowPreview(false)} size="lg" title="Pré-visualização">
          <div className="max-h-[70vh] overflow-y-auto -mx-6 px-6">
            <PackageDetailView pkg={previewEntity} related={[]} />
          </div>
        </Dialog>
      )}
    </div>
  )
}
