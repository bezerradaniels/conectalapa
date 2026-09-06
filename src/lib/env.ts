import { z } from 'zod'

const envSchema = z.object({
  VITE_SUPABASE_URL: z.string().url(),
  VITE_SUPABASE_ANON_KEY: z.string().min(1),
})

function loadEnv() {
  const result = envSchema.safeParse(import.meta.env)

  if (!result.success) {
    const missing = result.error.issues
      .map((issue) => issue.path.join('.'))
      .join(', ')

    throw new Error(
      `Missing or invalid environment variable(s): ${missing}. ` +
        `Copy .env.example to .env and fill in the values.`,
    )
  }

  return result.data
}

export const env = loadEnv()
