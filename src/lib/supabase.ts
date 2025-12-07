import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Do not log secret values, only whether they exist and which VITE_ keys are available
  // eslint-disable-next-line no-console
  console.error('Supabase env vars missing or invalid', {
    hasUrl: !!supabaseUrl,
    hasAnonKey: !!supabaseAnonKey,
    availableViteKeys: Object.keys(import.meta.env).filter((key) => key.startsWith('VITE_')),
  });

  throw new Error('Missing Supabase configuration. Please define VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env or .env.local file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: 'conectalapa-auth',
  },
});
