import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, Save } from 'lucide-react'
import { useEventAdminDetail, useEventFilterMeta, useCreateEventAdmin, useUpdateEventAdmin } from '@/features/events/api/hooks'
import { useApproveSubmission } from '@/features/submissions/api/hooks'
import type { SubmissionPayload } from '@/features/submissions/api/queries'
import { formatPhoneBRInput } from '@/lib/whatsapp'
import type { AdditionalLink } from '@/types'
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
  TagListField,
  LinkListField,
  MultiSelectField,
  ImageUploadField,
  GalleryUploadField,
  StatusBadge,
  useUnsavedChangesWarning,
  UnsavedChangesDialog,
  useUploadSession,
  useSubmissionPrefill,
  type GalleryItemDraft,
} from '@/components/admin'
import { EventDetailView } from '@/pages/events/detail-view'
import type { EventWithRelations } from '@/types'

const schema = z
  .object({
    name: z.string().min(2, 'Informe o nome.'),
    slug: z.string().min(1, 'Informe o slug.'),
    category_id: z.string().min(1, 'Selecione uma categoria.'),
    venue_name: z.string().optional(),
    address: z.string().optional(),
    whatsapp: z.string().optional(),
    instagram: z.string().optional(),
    description: z.string().optional(),
    start_datetime: z.string().min(1, 'Informe a data e hora de início.'),
    end_datetime: z.string().optional(),
    image_aspect_ratio: z.enum(['1:1', '4:5', '16:9']),
    priceMode: z.enum(['unset', 'free', 'paid']),
    ticket_price: z.string().optional(),
    ticket_price_description: z.string().optional(),
    status: z.enum(['draft', 'published', 'archived']),
  })
  .refine((data) => !data.end_datetime || data.end_datetime >= data.start_datetime, {
    message: 'O fim não pode ser antes do início.',
    path: ['end_datetime'],
  })
  .refine((data) => data.priceMode !== 'paid' || Boolean(data.ticket_price), {
    message: 'Informe o valor do ingresso.',
    path: ['ticket_price'],
  })

type FormValues = z.infer<typeof schema>

export default function AdminEventFormPage() {
  const { id } = useParams()
  const isEditing = Boolean(id)
  const navigate = useNavigate()

  const { data: existing, isLoading: isLoadingExisting } = useEventAdminDetail(id)
  const { data: meta } = useEventFilterMeta()
  const createMutation = useCreateEventAdmin()
  const updateMutation = useUpdateEventAdmin()
  const { submissionId, submission } = useSubmissionPrefill()
  const approveSubmissionMutation = useApproveSubmission()

  const session = useUploadSession()
  const newIdRef = useRef(crypto.randomUUID())
  const entityId = existing?.id || newIdRef.current

  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [restrictions, setRestrictions] = useState<string[]>([])
  const [amenityIds, setAmenityIds] = useState<string[]>([])
  const [links, setLinks] = useState<AdditionalLink[]>([])
  const [gallery, setGallery] = useState<GalleryItemDraft[]>([])
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
      image_aspect_ratio: '1:1',
      priceMode: 'unset',
      category_id: '',
      slug: '',
      name: '',
      venue_name: '',
      address: '',
      whatsapp: '',
      instagram: '',
      description: '',
      start_datetime: '',
      end_datetime: '',
      ticket_price: '',
      ticket_price_description: '',
    },
  })

  // reset() is an imperative external-store call, not pure state — belongs
  // in an effect, not the render body (see businesses/form.tsx for why).
  useEffect(() => {
    if (!existing || hydrated) return
    setHydrated(true)
    const priceMode = existing.ticket_price_description ? 'paid' : existing.ticket_price === 0 ? 'free' : existing.ticket_price ? 'paid' : 'unset'
    reset({
      name: existing.name,
      slug: existing.slug,
      category_id: existing.category_id || '',
      venue_name: existing.venue_name || '',
      address: existing.address || '',
      whatsapp: existing.whatsapp || '',
      instagram: existing.instagram || '',
      description: existing.description || '',
      start_datetime: existing.start_datetime?.slice(0, 16) || '',
      end_datetime: existing.end_datetime?.slice(0, 16) || '',
      image_aspect_ratio: (existing.image_aspect_ratio as FormValues['image_aspect_ratio']) || '1:1',
      priceMode,
      ticket_price: existing.ticket_price != null ? String(existing.ticket_price) : '',
      ticket_price_description: existing.ticket_price_description || '',
      status: existing.status as FormValues['status'],
    })
    setImageUrl(existing.promotional_image_url)
    setRestrictions(existing.restrictions || [])
    setAmenityIds(existing.amenities.map((a) => a.id))
    setLinks(existing.links || [])
    setGallery(existing.gallery.map((g) => ({ key: g.id, image_url: g.image_url, caption: g.caption || '', aspect_ratio: g.aspect_ratio })))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existing, hydrated])

  useEffect(() => {
    if (isEditing || !submission || hydrated) return
    setHydrated(true)
    const payload = submission.payload as unknown as SubmissionPayload
    reset({
      status: 'draft',
      image_aspect_ratio: '1:1',
      priceMode: 'unset',
      category_id: '',
      slug: '',
      name: payload.name || submission.contact_name,
      venue_name: '',
      address: payload.address || '',
      whatsapp: formatPhoneBRInput(submission.contact_phone.replace(/^55/, '')),
      instagram: payload.instagram || '',
      description: payload.description || '',
      // Only a date was collected, not a time — left for the admin to set precisely.
      start_datetime: payload.event_date ? `${payload.event_date}T18:00` : '',
      end_datetime: '',
      ticket_price: '',
      ticket_price_description: '',
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing, submission, hydrated])

  const { blocker, allowNavigation } = useUnsavedChangesWarning(isDirty)

  const nameValue = watch('name')
  const slugValue = watch('slug')
  const statusValue = watch('status')
  const priceModeValue = watch('priceMode')
  const startValue = watch('start_datetime')
  const endValue = watch('end_datetime')
  const addressValue = watch('address')
  const venueValue = watch('venue_name')
  const whatsappValue = watch('whatsapp')
  const instagramValue = watch('instagram')
  const descriptionValue = watch('description')
  const categoryIdValue = watch('category_id')
  const aspectRatioValue = watch('image_aspect_ratio')

  async function onSubmit(values: FormValues) {
    const ticketPrice = values.priceMode === 'free' ? 0 : values.priceMode === 'paid' ? Number(values.ticket_price) : null

    const input = {
      name: values.name,
      slug: values.slug,
      category_id: values.category_id || null,
      promotional_image_url: imageUrl,
      image_aspect_ratio: values.image_aspect_ratio,
      start_datetime: new Date(values.start_datetime).toISOString(),
      end_datetime: values.end_datetime ? new Date(values.end_datetime).toISOString() : null,
      venue_name: values.venue_name || null,
      address: values.address || null,
      whatsapp: values.whatsapp || null,
      instagram: values.instagram || null,
      description: values.description || null,
      ticket_price: ticketPrice,
      ticket_price_description: values.ticket_price_description || null,
      restrictions,
      links,
      status: values.status,
      amenityIds,
      gallery: gallery.map((g) => ({ image_url: g.image_url, caption: g.caption, aspect_ratio: g.aspect_ratio })),
    }

    if (isEditing && id) {
      await updateMutation.mutateAsync({ id, input })
    } else {
      await createMutation.mutateAsync({ ...input, id: entityId })
      if (submissionId) {
        await approveSubmissionMutation.mutateAsync({ id: submissionId, table: 'events', entityId })
      }
    }

    await session.commitAndCleanup()
    allowNavigation()

    if (saveIntentRef.current === 'new') {
      navigate('/admin/eventos/novo', { replace: true })
      window.location.reload()
    } else {
      navigate('/admin/eventos')
    }
  }

  const previewEntity = useMemo<EventWithRelations | null>(() => {
    if (!showPreview || !startValue) return null
    return {
      id: entityId,
      slug: slugValue || 'preview',
      name: nameValue || 'Sem nome',
      status: statusValue,
      promotional_image_url: imageUrl,
      image_aspect_ratio: aspectRatioValue,
      start_datetime: new Date(startValue).toISOString(),
      end_datetime: endValue ? new Date(endValue).toISOString() : null,
      venue_name: venueValue || null,
      address: addressValue || null,
      whatsapp: whatsappValue || null,
      instagram: instagramValue || null,
      description: descriptionValue || null,
      ticket_price: priceModeValue === 'free' ? 0 : priceModeValue === 'paid' ? Number(watch('ticket_price')) : null,
      ticket_price_description: watch('ticket_price_description') || null,
      restrictions,
      links,
      created_at: existing?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString(),
      category_id: categoryIdValue || null,
      category: meta?.categories.find((c) => c.id === categoryIdValue) || null,
      amenities: (meta?.amenities || []).filter((a) => amenityIds.includes(a.id)),
      gallery: gallery.map((g, i) => ({
        id: g.key,
        image_url: g.image_url,
        caption: g.caption || null,
        aspect_ratio: g.aspect_ratio || null,
        display_order: i,
        event_id: entityId,
        business_id: null,
        dining_id: null,
        lodging_id: null,
        created_at: new Date().toISOString(),
      })),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any
  }, [
    showPreview,
    entityId,
    slugValue,
    nameValue,
    statusValue,
    imageUrl,
    aspectRatioValue,
    startValue,
    endValue,
    venueValue,
    addressValue,
    whatsappValue,
    instagramValue,
    descriptionValue,
    priceModeValue,
    restrictions,
    links,
    existing,
    meta,
    categoryIdValue,
    amenityIds,
    gallery,
    watch,
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
      <Head title={isEditing ? 'Editar evento' : 'Novo evento'} />
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <AdminFormShell
          title={isEditing ? existing?.name || 'Editar evento' : 'Novo evento'}
          backTo="/admin/eventos"
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
                <Input label="Nome" required error={errors.name?.message} {...register('name')} />
                <Controller
                  control={control}
                  name="category_id"
                  render={({ field }) => (
                    <Select
                      label="Categoria"
                      required
                      error={errors.category_id?.message}
                      options={[{ value: '', label: 'Selecione…' }, ...((meta?.categories || []).map((c) => ({ value: c.id, label: c.name })))]}
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
                    table="events"
                    value={field.value}
                    onChange={field.onChange}
                    sourceText={nameValue || ''}
                    entityId={id}
                    isPublished={existing?.status === 'published'}
                    originalSlug={existing?.slug}
                    error={errors.slug?.message}
                  />
                )}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Início" type="datetime-local" required error={errors.start_datetime?.message} {...register('start_datetime')} />
                <Input label="Fim (opcional)" type="datetime-local" error={errors.end_datetime?.message} {...register('end_datetime')} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Local" placeholder="Ex: Santuário do Bom Jesus" {...register('venue_name')} />
                <Input label="Endereço" {...register('address')} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="WhatsApp" placeholder="(77) 99999-9999" {...register('whatsapp')} />
                <Input label="Instagram" placeholder="@perfil" {...register('instagram')} />
              </div>

              <Textarea label="Descrição" rows={4} {...register('description')} />

              <div className="space-y-2 rounded-lg border border-border-hairline p-4">
                <span className="block text-sm font-medium text-text-primary">Ingresso</span>
                <Controller
                  control={control}
                  name="priceMode"
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onChange={field.onChange}
                      options={[
                        { value: 'unset', label: 'A confirmar (ainda não definido)' },
                        { value: 'free', label: 'Gratuito' },
                        { value: 'paid', label: 'Pago' },
                      ]}
                    />
                  )}
                />
                {priceModeValue === 'paid' && (
                  <Input label="Valor (R$)" type="number" step="0.01" min="0" error={errors.ticket_price?.message} {...register('ticket_price')} />
                )}
                <Input label="Texto alternativo (opcional)" placeholder='Ex: "R$ 20 (1º lote)"' {...register('ticket_price_description')} />
              </div>

              <TagListField label="Restrições" values={restrictions} onChange={setRestrictions} placeholder="Ex: Proibida entrada de coolers" />

              <LinkListField label="Links adicionais" values={links} onChange={setLinks} />

              <MultiSelectField
                label="O que o local oferece"
                options={(meta?.amenities || []).map((a) => ({ value: a.id, label: a.name }))}
                values={amenityIds}
                onChange={setAmenityIds}
              />

              <GalleryUploadField label="Galeria de fotos" bucket="galleries" domain="event" entityId={entityId} value={gallery} onChange={setGallery} session={session} />
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Controller
                  control={control}
                  name="image_aspect_ratio"
                  render={({ field }) => (
                    <Select
                      label="Proporção da imagem"
                      value={field.value}
                      onChange={field.onChange}
                      options={[
                        { value: '1:1', label: 'Quadrada (1080×1080)' },
                        { value: '4:5', label: 'Retrato (1080×1350)' },
                        { value: '16:9', label: 'Paisagem (16:9)' },
                      ]}
                    />
                  )}
                />
                <p className="text-2xs text-text-muted">Use uma imagem de pelo menos 1080px no lado mais largo para evitar perda de qualidade.</p>
              </div>
              <ImageUploadField label="Imagem promocional" bucket="events" domain="event" entityId={entityId} value={imageUrl} onChange={setImageUrl} session={session} />
              <Controller control={control} name="status" render={({ field }) => <StatusControl value={field.value} onChange={field.onChange} />} />
            </div>
          </div>
        </AdminFormShell>
      </form>

      <UnsavedChangesDialog blocker={blocker} />

      {showPreview && previewEntity && (
        <Dialog isOpen onClose={() => setShowPreview(false)} size="lg" title="Pré-visualização">
          <div className="max-h-[70vh] overflow-y-auto -mx-6 px-6">
            <EventDetailView event={previewEntity} related={[]} />
          </div>
        </Dialog>
      )}
    </div>
  )
}
