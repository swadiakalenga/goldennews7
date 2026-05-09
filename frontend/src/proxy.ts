import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Only these paths (and their sub-paths) require an authenticated admin.
// /admin/login is intentionally absent — it must never be guarded.
const PROTECTED_PREFIXES = [
  "/admin/dashboard",
  "/admin/articles",
  "/admin/categories",
  "/admin/authors",
  "/admin/media",
  "/admin/settings",
];

function isProtected(pathname: string) {
  return PROTECTED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
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

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || profile.role !== "admin") {
      return NextResponse.redirect(
        new URL("/admin/login?error=unauthorized", request.url)
      );
    }
  }

  // Already-authenticated admin on the login page → go to dashboard.
  if (pathname === "/admin/login" && user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role === "admin") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/admin/:path*"],
};
