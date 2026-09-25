// Which pages need login. No imports: the <head> script (app/layout) embeds these
// values and tests import this file directly. Paths use the site's trailing slash.
export const AUTH_KEY = "tgat-auth"; // localStorage key of the Supabase session
export const HOME = "/trang-chu/"; // app home once logged in
export const RESET_PATH = "/dat-lai-mat-khau/"; // new password, from the email link or the account menu

// Everything else, unknown URLs included, needs login.
export const PUBLIC_PATHS: readonly string[] = ["/", "/gioi-thieu/", "/dang-nhap/", "/dang-ky/", "/quen-mat-khau/", "/dat-lai-mat-khau/"];

// Logged-in visitors skip these (to ?next= or HOME).
export const ENTRY_PATHS: readonly string[] = ["/", "/dang-nhap/", "/dang-ky/"];

export const norm = (p: string) => (p.endsWith("/") ? p : `${p}/`);

export const isPublicPath = (p: string) => PUBLIC_PATHS.includes(norm(p));

export const loginUrl = (next: string) => `/dang-nhap/?next=${encodeURIComponent(next)}`;

// Where to go after login: a same-origin, non-public page from ?next=, else HOME.
// Parsing (not prefix checks) catches //evil.com, /\evil.com, /\t/evil.com…;
// a path that still starts with // (e.g. from /.//evil.com) would leave the site.
export function safeNext(next: string | null | undefined, origin: string): string {
  if (!next) return HOME;
  try {
    const u = new URL(next, origin);
    if (u.origin === origin && !u.pathname.startsWith("//") && !isPublicPath(u.pathname)) return u.pathname + u.search + u.hash;
  } catch {}
  return HOME;
}
