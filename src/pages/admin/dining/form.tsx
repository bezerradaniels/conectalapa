import { useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, Save } from 'lucide-react'
import { useDiningAdminDetail, useDiningFilterMeta, useCreateDiningAdmin, useUpdateDiningAdmin } from '@/features/dining/api/hooks'
import type { OpeningHourInterval } from '@/types'
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
  OpeningHoursEditor,
  GalleryUploadField,
  StatusBadge,
  useUnsavedChangesWarning,
  UnsavedChangesDialog,
  useUploadSession,
  type GalleryItemDraft,
} from '@/components/admin'
import { DiningDetailView } from '@/pages/dining/detail-view'
import type { DiningWithRelations } from '@/types'

const PRICE_RANGES = [
  { value: '', label: 'Não informado' },
  { value: '$', label: '$ — Econômico' },
  { value: '$$', label: '$$ — Moderado' },
  { value: '$$$', label: '$$$ — Alto' },
  { value: '$$$$', label: '$$$$ — Premium' },
]

const RESTAURANT_TYPES = [
  { value: 'churrascaria', label: 'Churrascaria' },
  { value: 'peixaria', label: 'Peixaria / Frutos do Rio' },
  { value: 'pizzeria', label: 'Pizzaria' },
  { value: 'lanchonete', label: 'Lanchonete' },
  { value: 'cafeteria', label: 'Café & Doceria' },
  { value: 'bar', label: 'Bar & Petiscaria' },
  { value: 'restaurante', label: 'Restaurante Típico' },
]

const schema = z.object({
  name: z.string().min(2, 'Informe o nome.'),
  slug: z.string().min(1, 'Informe o slug.'),
  category_id: z.string().optional(),
  restaurant_type: z.string().min(1, 'Selecione o tipo.'),
  address: z.string().optional(),
  whatsapp: z.string().optional(),
  instagram: z.string().optional(),
  description: z.string().optional(),
  price_range: z.string().optional(),
  status: z.enum(['draft', 'published', 'archived']),
})

type FormValues = z.infer<typeof schema>

export default function AdminDiningFormPage() {
  const { id } = useParams()
  const isEditing = Boolean(id)
  const navigate = useNavigate()

  const { data: existing, isLoading: isLoadingExisting } = useDiningAdminDetail(id)
  const { data: meta } = useDiningFilterMeta()
  const createMutation = useCreateDiningAdmin()
  const updateMutation = useUpdateDiningAdmin()

  const session = useUploadSession()
  const newIdRef = useRef(crypto.randomUUID())
  const entityId = existing?.id || newIdRef.current

  const [openingHours, setOpeningHours] = useState<OpeningHourInterval[]>([])
  const [amenityIds, setAmenityIds] = useState<string[]>([])
  const [gallery, setGallery] = useState<GalleryItemDraft[]>([])
  const [hydrated, setHydrated] = useState(!isEditing)
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
      restaurant_type: 'restaurante',
      category_id: '',
      slug: '',
      name: '',
      address: '',
      whatsapp: '',
      instagram: '',
      description: '',
      price_range: '',
    },
  })

  if (existing && !hydrated) {
    setHydrated(true)
    reset({
      name: existing.name,
      slug: existing.slug,
      category_id: existing.category_id || '',
      restaurant_type: existing.restaurant_type,
      address: existing.address || '',
      whatsapp: existing.whatsapp || '',
      instagram: existing.instagram || '',
      description: existing.description || '',
      price_range: existing.price_range || '',
      status: existing.status as FormValues['status'],
    })
    setOpeningHours(existing.opening_hours || [])
    setAmenityIds(existing.amenities.map((a) => a.id))
    setGallery(existing.gallery.map((g) => ({ key: g.id, image_url: g.image_url, caption: g.caption || '', aspect_ratio: g.aspect_ratio })))
  }

  const { blocker, allowNavigation } = useUnsavedChangesWarning(isDirty)

  const nameValue = watch('name')
  const slugValue = watch('slug')
  const statusValue = watch('status')
  const restaurantTypeValue = watch('restaurant_type')
  const addressValue = watch('address')
  const whatsappValue = watch('whatsapp')
  const instagramValue = watch('instagram')
  const descriptionValue = watch('description')
  const priceRangeValue = watch('price_range')
  const categoryIdValue = watch('category_id')

  async function onSubmit(values: FormValues) {
    const input = {
      name: values.name,
      slug: values.slug,
      category_id: values.category_id || null,
      restaurant_type: values.restaurant_type,
      address: values.address || null,
      whatsapp: values.whatsapp || null,
      instagram: values.instagram || null,
      opening_hours: openingHours,
      price_range: values.price_range || null,
      description: values.description || null,
      status: values.status,
      amenityIds,
      gallery: gallery.map((g) => ({ image_url: g.image_url, caption: g.caption, aspect_ratio: g.aspect_ratio })),
    }

    if (isEditing && id) {
      await updateMutation.mutateAsync({ id, input })
    } else {
      await createMutation.mutateAsync({ ...input, id: entityId })
    }

    await session.commitAndCleanup()
    allowNavigation()

    if (saveIntentRef.current === 'new') {
      navigate('/admin/gastronomia/novo', { replace: true })
      window.location.reload()
    } else {
      navigate('/admin/gastronomia')
    }
  }

  const previewEntity = useMemo<DiningWithRelations | null>(() => {
    if (!showPreview) return null
    return {
      id: entityId,
      slug: slugValue || 'preview',
      name: nameValue || 'Sem nome',
      status: statusValue,
      restaurant_type: restaurantTypeValue,
      address: addressValue || null,
      whatsapp: whatsappValue || null,
      instagram: instagramValue || null,
      opening_hours: openingHours,
      price_range: priceRangeValue || null,
      description: descriptionValue || null,
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
        dining_id: entityId,
        business_id: null,
        event_id: null,
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
    restaurantTypeValue,
    addressValue,
    whatsappValue,
    instagramValue,
    openingHours,
    priceRangeValue,
    descriptionValue,
    existing,
    meta,
    categoryIdValue,
    amenityIds,
    gallery,
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
      <Head title={isEditing ? 'Editar restaurante' : 'Novo restaurante'} />
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <AdminFormShell
          title={isEditing ? existing?.name || 'Editar restaurante' : 'Novo restaurante'}
          backTo="/admin/gastronomia"
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
                  name="restaurant_type"
                  render={({ field }) => <Select label="Tipo" required error={errors.restaurant_type?.message} options={RESTAURANT_TYPES} {...field} />}
                />
              </div>

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

              <Controller
                control={control}
                name="slug"
                render={({ field }) => (
                  <SlugField
                    table="dining"
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

              <Input label="Endereço" {...register('address')} />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="WhatsApp" placeholder="(77) 99999-9999" {...register('whatsapp')} />
                <Input label="Instagram" placeholder="@perfil" {...register('instagram')} />
              </div>

              <Textarea label="Descrição" rows={4} {...register('description')} />

              <MultiSelectField
                label="Comodidades"
                options={(meta?.amenities || []).map((a) => ({ value: a.id, label: a.name }))}
                values={amenityIds}
                onChange={setAmenityIds}
              />

              <OpeningHoursEditor value={openingHours} onChange={setOpeningHours} />

              <GalleryUploadField label="Galeria de fotos" bucket="galleries" domain="dining" entityId={entityId} value={gallery} onChange={setGallery} session={session} />
            </div>

            <div className="space-y-6">
              <Controller
                control={control}
                name="price_range"
                render={({ field }) => <Select label="Faixa de preço" options={PRICE_RANGES} {...field} />}
              />
              <Controller control={control} name="status" render={({ field }) => <StatusControl value={field.value} onChange={field.onChange} />} />
            </div>
          </div>
        </AdminFormShell>
      </form>

      <UnsavedChangesDialog blocker={blocker} />

      {showPreview && previewEntity && (
        <Dialog isOpen onClose={() => setShowPreview(false)} size="lg" title="Pré-visualização">
          <div className="max-h-[70vh] overflow-y-auto -mx-6 px-6">
            <DiningDetailView dining={previewEntity} related={[]} />
          </div>
        </Dialog>
      )}
    </div>
  )
}
