"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSession } from "@/lib/auth";
import { ENTRY_PATHS, isPublicPath, loginUrl, norm, safeNext } from "@/lib/auth-paths";

// Login gate for in-app navigations and sign-in/out while a page is open. The
// <head> script (app/layout) does the same on full page loads, before first paint.
// Reads location, not the route: on the 404 page the route isn't the URL.
export default function AuthGuard() {
  const session = useSession();
  const path = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (session === undefined) return;
    const p = location.pathname;
    if (!session && !isPublicPath(p)) router.replace(loginUrl(p + location.search + location.hash));
    else if (session && ENTRY_PATHS.includes(norm(p))) router.replace(safeNext(new URLSearchParams(location.search).get("next"), location.origin));
  }, [session, path, router]);

  return null;
}
