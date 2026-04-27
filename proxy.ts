/**
 * Supabase session refresher — runs before every matched request.
 *
 * Next.js 16 renamed middleware → proxy. The exported function must be
 * called `proxy` (or be the default export). The Node.js runtime is used
 * automatically; setting `runtime` here would throw an error.
 *
 * Why this file exists:
 *   Supabase auth tokens expire. Without refreshing them in the proxy layer,
 *   a Server Component that reads cookies would see a stale/expired session
 *   even though the browser still has valid refresh-token cookies.
 */
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  // Start with a plain "pass-through" response so we can attach cookies to it.
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // 1. Write the refreshed cookies back onto the request so downstream
          //    Server Components can read them in the same render pass.
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          )

          // 2. Re-create the response so it inherits the updated request cookies,
          //    then also stamp them onto the response so the browser saves them.
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  // IMPORTANT: do not add any logic between createServerClient and getUser().
  // A seemingly innocent early-return can stop the session from being refreshed.
  await supabase.auth.getUser()

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Run on every path except:
     * - _next/static  (static assets)
     * - _next/image   (image optimisation)
     * - favicon.ico, sitemap.xml, robots.txt (metadata)
     */
    '/((?!_next/static|_next/image|favicon\\.ico|sitemap\\.xml|robots\\.txt).*)',
  ],
}
