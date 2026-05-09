import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Only these paths (and their sub-paths) require an authenticated admin.
// /admin/login is intentionally absent — it must never be guarded.
const PROTECTED_PREFIXES = [
  "/admin/dashboard",
  "/admin/homepage",
  "/admin/articles",
  "/admin/categories",
  "/admin/authors",
  "/admin/media",
  "/admin/subscribers",
  "/admin/settings",
  "/admin/pages",
  "/admin/activity",
  "/admin/analytics",
];

function isProtected(pathname: string) {
  return PROTECTED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
}

async function getAdminRole(
  supabase: ReturnType<typeof createServerClient>,
  userId: string
): Promise<string | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();
  if (error || !data) return null;
  // data is untyped (no Database generic) — safe string access
  return (data as { role: string }).role ?? null;
}

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: never run logic between createServerClient and getUser().
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // /admin or /admin/ → /admin/dashboard
  if (pathname === "/admin" || pathname === "/admin/") {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  // Protected routes: must be an authenticated admin.
  if (isProtected(pathname)) {
    if (!user) {
      const url = new URL("/admin/login", request.url);
      url.searchParams.set("redirectTo", pathname);
      return NextResponse.redirect(url);
    }

    const role = await getAdminRole(supabase, user.id);

    // Only redirect to unauthorized when we positively know role ≠ admin.
    // If the query failed (role === null due to an error), pass through and
    // let the shell layout's server-side check handle it — avoids a false
    // redirect on transient network errors.
    if (role !== null && role !== "admin") {
      return NextResponse.redirect(
        new URL("/admin/login?error=unauthorized", request.url)
      );
    }
  }

  // Already-authenticated admin on the login page → go to dashboard.
  if (pathname === "/admin/login" && user) {
    const role = await getAdminRole(supabase, user.id);
    if (role === "admin") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/admin/:path*"],
};
