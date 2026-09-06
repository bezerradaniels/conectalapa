import { useCallback, useEffect, useRef } from 'react'
import { useBlocker } from 'react-router-dom'

/**
 * Warns on both an in-app navigation away (React Router blocker) and a tab
 * close/refresh (native beforeunload) whenever `hasUnsavedChanges` is true.
 * Return the blocker to a form page so it can render its own confirm
 * dialog — see UnsavedChangesDialog.
 *
 * Call `allowNavigation()` right before a deliberate post-save `navigate()`.
 * Without it, the form's own success-path navigation gets caught by this
 * same guard — react-hook-form's `isDirty` doesn't clear itself just
 * because the data was persisted, so the blocker (correctly, from its own
 * point of view) still sees unsaved changes at that instant. A ref-based
 * bypass sidesteps the render-timing question entirely: the blocker's
 * check reads it synchronously, with no dependency on a re-render having
 * happened first.
 */
export function useUnsavedChangesWarning(hasUnsavedChanges: boolean) {
  const bypassRef = useRef(false)

  useEffect(() => {
    function handler(e: BeforeUnloadEvent) {
      if (!hasUnsavedChanges || bypassRef.current) return
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [hasUnsavedChanges])

  const blocker = useBlocker(
    useCallback(
      ({ currentLocation, nextLocation }) =>
        !bypassRef.current && hasUnsavedChanges && currentLocation.pathname !== nextLocation.pathname,
      [hasUnsavedChanges]
    )
  )

  const allowNavigation = useCallback(() => {
    bypassRef.current = true
  }, [])

  return { blocker, allowNavigation }
}
