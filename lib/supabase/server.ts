/**
 * Server-side Supabase client.
 *
 * Use inside Server Components, Server Actions, and Route Handlers.
 *
 * Next.js 16 note: cookies() is fully async — we must await it before
 * passing the cookie store to createServerClient.
 */
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  // Next.js 16: cookies() is a Promise — always await it
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            )
          } catch {
            // setAll is called from a Server Component — cookie writes are
            // only possible in Proxy / Server Actions / Route Handlers.
            // The try/catch keeps reads working everywhere else.
          }
        },
      },
    },
  )
}
