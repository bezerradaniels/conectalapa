import { useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { deleteStorageObjectByUrl, deleteStorageObjectsByUrls, type StorageBucket } from '@/lib/storage'

export interface UploadSession {
  /** Call right after a successful upload, before setting the field's value. */
  registerUpload: (bucket: StorageBucket, path: string, url: string) => void
  /**
   * Call when a value is being replaced or cleared. A URL uploaded earlier
   * in this same session (never saved) is deleted immediately — nothing
   * references it. A URL that predates this session (the saved DB value)
   * is only queued for deletion, since the DB row still points at it until
   * the save that stops referencing it actually succeeds.
   */
  replaceValue: (previousUrl: string | null | undefined) => void
  /** Call after a successful create/update: flushes queued deletions and disarms unmount cleanup. */
  commitAndCleanup: () => Promise<void>
}

/**
 * Owns the "don't leave orphaned uploads behind" guarantee for a single
 * admin form. Images upload to storage as soon as they're picked (so the
 * admin sees progress immediately), which means an abandoned form can
 * leave files nobody references — this hook tracks every upload made
 * during the form's lifetime and removes whatever wasn't ultimately saved.
 */
export function useUploadSession(): UploadSession {
  const pendingByUrlRef = useRef<Map<string, { bucket: StorageBucket; path: string }>>(new Map())
  const toDeleteOnSaveRef = useRef<Set<string>>(new Set())
  const committedRef = useRef(false)

  const registerUpload: UploadSession['registerUpload'] = (bucket, path, url) => {
    pendingByUrlRef.current.set(url, { bucket, path })
  }

  const replaceValue: UploadSession['replaceValue'] = (previousUrl) => {
    if (!previousUrl) return
    const freshEntry = pendingByUrlRef.current.get(previousUrl)
    if (freshEntry) {
      pendingByUrlRef.current.delete(previousUrl)
      void deleteStorageObjectByUrl(previousUrl)
    } else {
      toDeleteOnSaveRef.current.add(previousUrl)
    }
  }

  const commitAndCleanup: UploadSession['commitAndCleanup'] = async () => {
    committedRef.current = true
    pendingByUrlRef.current.clear()
    const urls = Array.from(toDeleteOnSaveRef.current)
    toDeleteOnSaveRef.current.clear()
    await deleteStorageObjectsByUrls(urls)
  }

  useEffect(
    () => () => {
      if (committedRef.current) return
      const orphans = Array.from(pendingByUrlRef.current.values())
      orphans.forEach(({ bucket, path }) => {
        void supabase.storage.from(bucket).remove([path])
      })
    },
    []
  )

  return { registerUpload, replaceValue, commitAndCleanup }
}
