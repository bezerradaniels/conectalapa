import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://vydymabffpgfrigkbtax.supabase.co'
const SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ5ZHltYWJmZnBnZnJpZ2tidGF4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4ODYyNzgyOCwiZXhwIjoyMTA0MjAzODI4fQ.gn9SPwuDbigZPNTaW7QOprSdj4cLFg2juqR89WjSgEA'

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
})

async function clean() {
  console.log('--- REMOVING MOCKUP CONTENTS ---')

  const tables = ['packages', 'events', 'lodging', 'dining', 'businesses', 'submissions']

  for (const table of tables) {
    // Delete all rows using neq id to 00000000-0000-0000-0000-000000000000
    const { data, error } = await supabase
      .from(table)
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000')
      .select('id')

    if (error) {
      console.error(`Error cleaning table ${table}:`, error.message)
    } else {
      console.log(`✓ Deleted ${data?.length ?? 0} rows from ${table}`)
    }
  }

  // Also clean up uploaded test assets in storage
  for (const bucket of ['logos', 'galleries', 'events']) {
    try {
      const { data: files } = await supabase.storage.from(bucket).list()
      if (files && files.length > 0) {
        for (const file of files) {
          // If it's a folder or file
          const { data: subFiles } = await supabase.storage.from(bucket).list(file.name)
          if (subFiles && subFiles.length > 0) {
            await supabase.storage.from(bucket).remove(subFiles.map((f) => `${file.name}/${f.name}`))
          }
          await supabase.storage.from(bucket).remove([file.name])
        }
        console.log(`✓ Cleaned storage bucket ${bucket}`)
      }
    } catch (e) {
      console.warn(`Could not clean bucket ${bucket}:`, e)
    }
  }

  // Verify counts
  console.log('\n--- VERIFYING TABLE COUNTS ---')
  for (const table of ['businesses', 'events', 'packages', 'lodging', 'dining', 'submissions', 'categories', 'amenities']) {
    const { count } = await supabase.from(table).select('*', { count: 'exact', head: true })
    console.log(`${table}: ${count} rows remaining`)
  }
}

clean().catch((err) => {
  console.error('Clean failed:', err)
  process.exit(1)
})
