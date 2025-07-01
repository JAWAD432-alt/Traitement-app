import { createClient } from '@supabase/supabase-js'
import { Database } from './types/database.types'

// Helper function to clean env vars from surrounding quotes and whitespace
const cleanEnvVar = (value?: string): string => {
  if (!value) return '';
  return value.trim().replace(/^['"]|['"]$/g, '');
};

const supabaseUrl = cleanEnvVar(import.meta.env?.VITE_SUPABASE_URL);
const supabaseAnonKey = cleanEnvVar(import.meta.env?.VITE_SUPABASE_ANON_KEY);

export const isSupabaseConnected = !!(supabaseUrl && supabaseAnonKey);

if (import.meta.env?.DEV && !isSupabaseConnected) {
  console.warn(
    "Les identifiants Supabase ne sont pas trouvés. L'application utilisera des données locales. Les modifications ne seront pas persistantes."
  );
}

// Using dummy values to prevent the app from crashing if env vars are missing.
// The app will load, but any Supabase functionality will fail gracefully unless isSupabaseConnected is checked.
export const supabase = createClient<Database>(
    supabaseUrl || 'http://localhost:54321',
    supabaseAnonKey || 'dummy-key-to-prevent-crash'
);