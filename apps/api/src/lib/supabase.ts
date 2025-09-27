import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { env } from '../config/env.js';

let client: SupabaseClient | null = null;

export function getSupabaseClient() {
  if (!env.supabase) {
    throw new Error('Supabase is not configured for this environment');
  }

  if (!client) {
    client = createClient(env.supabase.url, env.supabase.serviceRoleKey, {
      auth: { persistSession: false },
    });
  }
  return client;
}
