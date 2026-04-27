/**
 * Browser (client-component) Supabase client.
 *
 * Call this inside 'use client' components. It re-uses a single instance
 * per browser tab so you never have duplicate GoTrue sessions.
 */
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  )
}
