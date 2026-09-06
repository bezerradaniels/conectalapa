/**
 * Hand-rolled rather than zod-validated on purpose: this file is a
 * dependency of the Supabase client, which every single route imports, so
 * whatever this file pulls in ends up in the app's global bundle rather
 * than a route-level chunk. zod is only actually needed by admin/submit
 * forms — validating two env strings didn't justify shipping it (22KB
 * gzip) to every visitor on every page. See docs/09-POLISH-LAUNCH.md.
 */
function loadEnv() {
  const url = import.meta.env.VITE_SUPABASE_URL
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

  const missing: string[] = []
  if (!url || !isValidUrl(url)) missing.push('VITE_SUPABASE_URL')
  if (!anonKey || typeof anonKey !== 'string') missing.push('VITE_SUPABASE_ANON_KEY')

  if (missing.length > 0) {
    throw new Error(
      `Missing or invalid environment variable(s): ${missing.join(', ')}. ` +
        `Copy .env.example to .env and fill in the values.`,
    )
  }

  return { VITE_SUPABASE_URL: url as string, VITE_SUPABASE_ANON_KEY: anonKey as string }
}

function isValidUrl(value: unknown): boolean {
  if (typeof value !== 'string') return false
  try {
    new URL(value)
    return true
  } catch {
    return false
  }
}

export const env = loadEnv()
