import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, Save } from 'lucide-react'
import { useBusinessAdminDetail, useBusinessFilterMeta, useCreateBusinessAdmin, useUpdateBusinessAdmin } from '@/features/businesses/api/hooks'
import { useApproveSubmission } from '@/features/submissions/api/hooks'
import type { SubmissionPayload } from '@/features/submissions/api/queries'
import { formatPhoneBRInput } from '@/lib/whatsapp'
import type { OpeningHourInterval, AdditionalLink } from '@/types'
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
  OpeningHoursEditor,
  ImageUploadField,
  GalleryUploadField,
  StatusBadge,
  useUnsavedChangesWarning,
  UnsavedChangesDialog,
  useUploadSession,
  useSubmissionPrefill,
  type GalleryItemDraft,
} from '@/components/admin'
import { BusinessDetailView } from '@/pages/businesses/detail-view'
import type { BusinessWithRelations } from '@/types'

const schema = z.object({
  name: z.string().min(2, 'Informe o nome.'),
  slug: z.string().min(1, 'Informe o slug.'),
  category_id: z.string().min(1, 'Selecione uma categoria.'),
  address: z.string().optional(),
  whatsapp: z.string().optional(),
  instagram: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(['draft', 'published', 'archived']),
})

type FormValues = z.infer<typeof schema>

export default function AdminBusinessFormPage() {
  const { id } = useParams()
  const isEditing = Boolean(id)
  const navigate = useNavigate()

  const { data: existing, isLoading: isLoadingExisting } = useBusinessAdminDetail(id)
  const { data: meta } = useBusinessFilterMeta()
  const createMutation = useCreateBusinessAdmin()
  const updateMutation = useUpdateBusinessAdmin()
  const { submissionId, submission } = useSubmissionPrefill()
  const approveSubmissionMutation = useApproveSubmission()

  const session = useUploadSession()
  const newIdRef = useRef(crypto.randomUUID())
  const entityId = existing?.id || newIdRef.current

  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [services, setServices] = useState<string[]>([])
  const [openingHours, setOpeningHours] = useState<OpeningHourInterval[]>([])
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
    defaultValues: { status: 'draft', category_id: '', slug: '', name: '', address: '', whatsapp: '', instagram: '', description: '' },
  })

  // RHF's reset() is an imperative call into an external store, not a pure
  // state update — calling it during render (even guarded, "adjust state
  // during render" style) can update a Controller-wrapped field while this
  // component is still mid-render. Both hydration paths belong in effects.
  useEffect(() => {
    if (!existing || hydrated) return
    setHydrated(true)
    reset({
      name: existing.name,
      slug: existing.slug,
      category_id: existing.category_id || '',
      address: existing.address || '',
      whatsapp: existing.whatsapp || '',
      instagram: existing.instagram || '',
      description: existing.description || '',
      status: existing.status as FormValues['status'],
    })
    setLogoUrl(existing.logo_url)
    setServices(existing.services || [])
    setOpeningHours(existing.opening_hours || [])
    setAmenityIds(existing.amenities.map((a) => a.id))
    setLinks(existing.additional_links || [])
    setGallery(existing.gallery.map((g) => ({ key: g.id, image_url: g.image_url, caption: g.caption || '', aspect_ratio: g.aspect_ratio })))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existing, hydrated])

  useEffect(() => {
    if (isEditing || !submission || hydrated) return
    setHydrated(true)
    const payload = submission.payload as unknown as SubmissionPayload
    reset({
      name: payload.name || submission.contact_name,
      slug: '',
      category_id: '',
      address: payload.address || '',
      whatsapp: formatPhoneBRInput(submission.contact_phone.replace(/^55/, '')),
      instagram: payload.instagram || '',
      description: payload.description || '',
      status: 'draft',
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing, submission, hydrated])

  const hasUnsavedChanges = isDirty
  const { blocker, allowNavigation } = useUnsavedChangesWarning(hasUnsavedChanges)

  const nameValue = watch('name')
  const slugValue = watch('slug')
  const statusValue = watch('status')
  const addressValue = watch('address')
  const whatsappValue = watch('whatsapp')
  const instagramValue = watch('instagram')
  const descriptionValue = watch('description')
  const categoryIdValue = watch('category_id')

  async function onSubmit(values: FormValues) {
    const input = {
      name: values.name,
      slug: values.slug,
      category_id: values.category_id || null,
      logo_url: logoUrl,
      address: values.address || null,
      whatsapp: values.whatsapp || null,
      instagram: values.instagram || null,
      description: values.description || null,
      services,
      opening_hours: openingHours,
      additional_links: links,
      status: values.status,
      amenityIds,
      gallery: gallery.map((g) => ({ image_url: g.image_url, caption: g.caption, aspect_ratio: g.aspect_ratio })),
    }

    if (isEditing && id) {
      await updateMutation.mutateAsync({ id, input })
    } else {
      await createMutation.mutateAsync({ ...input, id: entityId })
      // Only now — the entry actually saved — does the submission move to
      // approved. Opening this form pre-filled never touched its status.
      if (submissionId) {
        await approveSubmissionMutation.mutateAsync({ id: submissionId, table: 'businesses', entityId })
      }
    }

    await session.commitAndCleanup()
    allowNavigation()

    if (saveIntentRef.current === 'new') {
      navigate('/admin/empresas/novo', { replace: true })
      window.location.reload()
    } else {
      navigate('/admin/empresas')
    }
  }

  const previewEntity = useMemo<BusinessWithRelations | null>(() => {
    if (!showPreview) return null
    return {
      id: entityId,
      slug: slugValue || 'preview',
      name: nameValue || 'Sem nome',
      status: statusValue,
      logo_url: logoUrl,
      address: addressValue || null,
      whatsapp: whatsappValue || null,
      instagram: instagramValue || null,
      description: descriptionValue || null,
      services,
      opening_hours: openingHours,
      additional_links: links,
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
        business_id: entityId,
        dining_id: null,
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
    logoUrl,
    addressValue,
    whatsappValue,
    instagramValue,
    descriptionValue,
    services,
    openingHours,
    links,
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
      <Head title={isEditing ? `Editar empresa` : 'Nova empresa'} />
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <AdminFormShell
          title={isEditing ? existing?.name || 'Editar empresa' : 'Nova empresa'}
          backTo="/admin/empresas"
          statusBadge={isEditing && existing ? <StatusBadge status={existing.status as FormValues['status']} /> : undefined}
          actions={
            <>
              <Button type="button" variant="secondary" leadingIcon={<Eye className="w-4 h-4" aria-hidden="true" />} onClick={() => setShowPreview(true)}>
                Pré-visualizar
              </Button>
              {!isEditing && (
                <Button
                  type="submit"
                  variant="secondary"
                  isLoading={isSubmitting && saveIntentRef.current === 'new'}
                  onClick={() => (saveIntentRef.current = 'new')}
                >
                  Salvar e criar outra
                </Button>
              )}
              <Button
                type="submit"
                isLoading={isSubmitting && saveIntentRef.current === 'stay'}
                leadingIcon={<Save className="w-4 h-4" aria-hidden="true" />}
                onClick={() => (saveIntentRef.current = 'stay')}
              >
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
                    table="businesses"
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

              <TagListField label="Serviços" values={services} onChange={setServices} placeholder="Ex: Passagens rodoviárias" />

              <LinkListField label="Links adicionais" values={links} onChange={setLinks} />

              <MultiSelectField
                label="Comodidades"
                options={(meta?.amenities || []).map((a) => ({ value: a.id, label: a.name }))}
                values={amenityIds}
                onChange={setAmenityIds}
              />

              <OpeningHoursEditor value={openingHours} onChange={setOpeningHours} />

              <GalleryUploadField label="Galeria de fotos" bucket="galleries" domain="business" entityId={entityId} value={gallery} onChange={setGallery} session={session} />
            </div>

            <div className="space-y-6">
              <ImageUploadField label="Logo" bucket="logos" domain="business" entityId={entityId} value={logoUrl} onChange={setLogoUrl} session={session} maxDimension={800} />
              <Controller control={control} name="status" render={({ field }) => <StatusControl value={field.value} onChange={field.onChange} />} />
            </div>
          </div>
        </AdminFormShell>
      </form>

      <UnsavedChangesDialog blocker={blocker} />

      {showPreview && previewEntity && (
        <Dialog isOpen onClose={() => setShowPreview(false)} size="lg" title="Pré-visualização">
          <div className="max-h-[70vh] overflow-y-auto -mx-6 px-6">
            <BusinessDetailView business={previewEntity} related={[]} />
          </div>
        </Dialog>
      )}
    </div>
  )
}
