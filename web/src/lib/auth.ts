import { useSyncExternalStore } from "react";
import type { GoTrueClient, Session } from "@supabase/auth-js";
import { AUTH_KEY } from "./auth-paths";

// Supabase Auth, browser only (the site is static). Public values, inlined at build.
const URL_ = process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
export const configured = Boolean(URL_ && KEY);

const listeners = new Set<() => void>();
const notify = () => listeners.forEach((f) => f());

let client: Promise<GoTrueClient | null> | undefined;

// A password-reset link (?token_hash… or an old #access_token…, both with type=recovery)
// never logs this client in: ResetForm checks it with a client of its own (resetAuth).
const RECOVERY = /type=recovery/;

// The SDK loads on first use only (kept out of every page's first load).
// Null when not configured (or on the server); rejects if the chunk can't load.
export function getAuth(): Promise<GoTrueClient | null> {
  if (!configured || typeof window === "undefined") return Promise.resolve(null);
  client ??= import("@supabase/auth-js").then(
    ({ AuthClient }) => {
      const c = new AuthClient({
        url: `${URL_}/auth/v1`,
        headers: { apikey: KEY! },
        storageKey: AUTH_KEY,
        persistSession: true,
        autoRefreshToken: true,
        // Links from emails land with #access_token=… (app/layout sends reset links away first).
        detectSessionInUrl: (url, p) => !RECOVERY.test(url.search + url.hash) && Boolean(p.access_token || p.error || p.error_description || p.error_code),
        flowType: "implicit",
      });
      c.onAuthStateChange(notify); // useSession re-reads storage, whatever the event says
      return c;
    },
    (e) => {
      client = undefined; // retry on the next call
      throw e;
    },
  );
  return client;
}

// One reset link's client: persistSession false keeps its session in memory (never in
// localStorage, never broadcast to other tabs), so it is gone with the page.
export async function resetAuth(): Promise<GoTrueClient> {
  const { AuthClient } = await import("@supabase/auth-js");
  return new AuthClient({
    url: `${URL_}/auth/v1`,
    headers: { apikey: KEY! },
    storageKey: "tgat-reset",
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
    flowType: "implicit",
  });
}

let raw: string | null = null;
let cached: Session | null = null;

// Logged in = a stored session with a refresh token. Read from storage, not from
// the SDK: offline it reports null while the session is still there. Cached by the
// raw string so useSyncExternalStore gets the same object until storage changes.
export function readSession(): Session | null {
  if (!configured) return null;
  let r: string | null = null;
  try {
    r = localStorage.getItem(AUTH_KEY);
  } catch {}
  if (r !== raw) {
    raw = r;
    try {
      const s = r ? JSON.parse(r) : null;
      cached = s?.refresh_token ? s : null;
    } catch {
      cached = null;
    }
  }
  return cached;
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  const onStorage = (e: StorageEvent) => (e.key === AUTH_KEY || e.key === null) && onChange(); // other tabs
  addEventListener("storage", onStorage);
  // The client refreshes tokens and reads email links; a guest elsewhere doesn't need it yet.
  const h = location.hash;
  if (readSession() || (/access_token|error_description/.test(h) && !RECOVERY.test(h))) getAuth().catch(() => {});
  return () => {
    listeners.delete(onChange);
    removeEventListener("storage", onStorage);
  };
}

// undefined = not known yet (server render, hydration); null = guest.
export function useSession(): Session | null | undefined {
  return useSyncExternalStore(subscribe, readSession, () => undefined);
}

// This browser only; a slow or missing network must not keep anyone in.
export async function signOut() {
  listeners.clear(); // the page stays still until the full reload below
  const timeout = new Promise((r) => setTimeout(r, 3000));
  await Promise.race([getAuth().then((a) => a?.signOut({ scope: "local" })), timeout]).catch(() => {});
  try {
    localStorage.removeItem(AUTH_KEY);
  } catch {}
  location.replace("/");
}

const MESSAGES: Record<string, string> = {
  invalid_credentials: "Email hoặc mật khẩu chưa đúng.",
  email_not_confirmed: "Email này chưa được xác nhận. Bạn mở hộp thư và bấm vào link xác nhận nhé.",
  user_already_exists: "Email này đã có tài khoản. Bạn hãy đăng nhập.",
  email_exists: "Email này đã có tài khoản. Bạn hãy đăng nhập.",
  weak_password: "Mật khẩu chưa đủ mạnh. Hãy dùng ít nhất 8 ký tự, có cả chữ và số.",
  same_password: "Mật khẩu mới phải khác mật khẩu cũ.",
  over_email_send_rate_limit: "Đã gửi quá nhiều email. Bạn đợi một lúc rồi thử lại nhé.",
  over_request_rate_limit: "Bạn thử quá nhiều lần. Đợi vài phút rồi thử lại nhé.",
  email_address_not_authorized: "Hệ thống chưa gửi được email tới địa chỉ này. Bạn liên hệ người quản lý trang nhé.",
  email_address_invalid: "Địa chỉ email không hợp lệ.",
  otp_expired: "Link đã hết hạn hoặc đã được dùng. Bạn hãy gửi lại link mới.",
  signup_disabled: "Hiện chưa mở đăng ký tài khoản mới.",
};

// Supabase error (AuthError: code, status) → one Vietnamese sentence.
export function authMessage(error: unknown): string {
  const e = (error ?? {}) as { code?: string; status?: number };
  if (e.status === 0 || (typeof navigator !== "undefined" && !navigator.onLine))
    return "Không kết nối được máy chủ. Bạn kiểm tra mạng rồi thử lại nhé.";
  return MESSAGES[e.code ?? ""] ?? "Có lỗi xảy ra. Bạn thử lại sau ít phút nhé.";
}

// Stored in user_metadata.role at sign-up.
export const ROLE: Record<"giao-vien" | "phu-huynh", string> = { "giao-vien": "Giáo viên", "phu-huynh": "Phụ huynh" };

export const displayName = (session: Session): string => session.user.user_metadata?.full_name || session.user.email || "";

// Avatar letter: first letter of the given name (last word in Vietnamese names).
export const initials = (name: string): string => (Array.from(name.normalize("NFC").trim().split(/\s+/).pop() ?? "")[0] ?? "").toUpperCase();
