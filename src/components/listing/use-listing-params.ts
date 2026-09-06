import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { type ZodType } from 'zod'

export interface UseListingParamsOptions<T extends Record<string, unknown>> {
  schema: ZodType<T>
  defaultValues: T
}

export function useListingParams<T extends Record<string, unknown>>({
  schema,
  defaultValues,
}: UseListingParamsOptions<T>) {
  const [searchParams, setSearchParams] = useSearchParams()

  // Parse current URL params using the schema with fallback to defaults
  const params = useMemo<T>(() => {
    const raw: Record<string, unknown> = {}

    // Extract all search params as strings or arrays (for comma-separated / repeated params)
    searchParams.forEach((value, key) => {
      if (raw[key] === undefined) {
        raw[key] = value
      } else if (Array.isArray(raw[key])) {
        ;(raw[key] as string[]).push(value)
      } else {
        raw[key] = [raw[key] as string, value]
      }
    })

    const parsed = schema.safeParse(raw)
    if (parsed.success) {
      return { ...defaultValues, ...parsed.data }
    }

    // On malformed or partial params, fallback to defaults
    return defaultValues
  }, [searchParams, schema, defaultValues])

  // Helper to update one or more params
  const setParams = useCallback(
    (updates: Partial<Record<keyof T, unknown>>, options?: { resetPage?: boolean }) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          const shouldResetPage = options?.resetPage ?? true

          for (const [key, value] of Object.entries(updates)) {
            const paramKey = String(key)

            if (value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0)) {
              next.delete(paramKey)
            } else if (Array.isArray(value)) {
              next.delete(paramKey)
              value.forEach((v) => {
                if (v !== undefined && v !== null && v !== '') {
                  next.append(paramKey, String(v))
                }
              })
            } else {
              next.set(paramKey, String(value))
            }
          }

          // Reset page to 1 on filter criteria changes unless explicitly updating page
          if (shouldResetPage && !('page' in updates)) {
            next.delete('page')
          }

          return next
        },
        { replace: true }
      )
    },
    [setSearchParams]
  )

  const setParam = useCallback(
    <K extends keyof T>(key: K, value: T[K] | undefined | null) => {
      setParams({ [key]: value } as unknown as Partial<Record<keyof T, unknown>>)
    },
    [setParams]
  )

  const toggleArrayParam = useCallback(
    <K extends keyof T>(key: K, item: string) => {
      const current = (params[key] as unknown as string[]) || []
      const next = current.includes(item)
        ? current.filter((i) => i !== item)
        : [...current, item]
      setParam(key, (next.length > 0 ? next : undefined) as unknown as T[K])
    },
    [params, setParam]
  )

  const clearParams = useCallback(
    (preserveKeys: (keyof T)[] = []) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams()
          for (const key of preserveKeys) {
            const paramKey = String(key)
            const values = prev.getAll(paramKey)
            values.forEach((v) => next.append(paramKey, v))
          }
          return next
        },
        { replace: true }
      )
    },
    [setSearchParams]
  )

  return {
    params,
    setParam,
    setParams,
    toggleArrayParam,
    clearParams,
    rawSearchParams: searchParams,
  }
}
