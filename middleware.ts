import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { HOME_URL, LOGIN_URL } from "./constants/app-routes";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            res.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const pathname = req.nextUrl.pathname;

  // 🚫 Not logged in → go to login
  if (!session && pathname !== LOGIN_URL) {
    return NextResponse.redirect(new URL(LOGIN_URL, req.url));
  }

  // 🔁 Logged in but accessing login → go home
  if (session && pathname === LOGIN_URL) {
    return NextResponse.redirect(new URL(HOME_URL, req.url));
  }

  return res;
}

export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"],
};
