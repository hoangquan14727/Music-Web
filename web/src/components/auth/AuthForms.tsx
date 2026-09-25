"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import type { GoTrueClient } from "@supabase/auth-js";
import Icon from "@/components/Icon";
import { authMessage, configured, getAuth, resetAuth, ROLE, useSession } from "@/lib/auth";
import { HOME } from "@/lib/auth-paths";

// Account pages. Forms are uncontrolled and submit in onSubmit (a <form action>
// would reset the fields in React 19); the browser does the field validation.

type Msg = { text: React.ReactNode; ok?: boolean } | null;
type Vars = React.CSSProperties & Record<`--${string}`, string | number>;

const OFF: Msg = { text: "Đăng nhập chưa được cấu hình. Bạn liên hệ người quản lý trang nhé." };
const INPUT =
  "mt-1 block min-h-12 w-full rounded-xl border-2 border-[#7c8798] bg-white px-4 text-ink transition-[border-color,box-shadow] duration-300 ease-soft focus:border-blue focus:shadow-[0_0_0_6px_rgb(47_111_176/0.14)]";
const LINK = "inline-flex min-h-11 items-center font-bold text-blue underline underline-offset-2 hover:text-navy";
const GHOST =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full border-2 border-blue bg-white px-5 font-bold text-blue transition-[translate,scale] duration-300 ease-bounce hover:-translate-y-0.5 active:scale-95";

// Notes around the mascot: [position, glyph, colour, --rise-x].
const NOTES: [string, string, string, string][] = [
  ["-left-1 top-1/4", "♪", "#d6336c", "-10px"],
  ["right-0 top-[10%]", "♫", "#2f6fb0", "12px"],
  ["right-[12%] top-1/2", "♪", "#7a4fc4", "8px"],
];

// Split card: decorative mascot panel + the form under the page's only h1.
function AuthCard({ title, lead, mascot, side, children }: { title: string; lead: string; mascot: string; side: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:py-12">
      <div className="grid animate-rise-in overflow-hidden rounded-card border-4 border-white bg-white shadow-md md:grid-cols-[2fr_3fr]">
        <div aria-hidden className="flex items-center gap-4 bg-gradient-to-b from-[#bfe9fb] to-[#fbdcea] p-5 md:flex-col md:justify-center md:p-8 md:text-center">
          <span className="relative block w-24 shrink-0 md:w-52">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/images/mascot/${mascot}.webp`} alt="" width={512} height={512} draggable={false} className="block h-auto w-full animate-float select-none [--float-y:-8px]" />
            {NOTES.map(([pos, glyph, color, dx], i) => (
              <span
                key={pos}
                className={`pointer-events-none absolute animate-rise-fade font-display text-xl font-bold leading-none md:text-3xl ${pos}`}
                style={{ color, "--i": i, "--rise-x": dx, "--rise-y": "-40px" } as Vars}
              >
                {glyph}
              </span>
            ))}
          </span>
          <p className="font-display text-lg font-bold leading-snug text-navy md:text-2xl">{side}</p>
        </div>
        <div className="p-5 sm:p-8 md:p-10">
          <h1 className="text-3xl font-bold text-navy md:text-4xl">{title}</h1>
          <p className="mt-1 text-muted">{lead}</p>
          <div className="mt-6">{children}</div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, hint, ...input }: { label: string; hint?: string } & React.ComponentProps<"input">) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="font-bold text-ink">
        {label}
      </label>
      <input id={id} aria-describedby={hint && `${id}-h`} className={INPUT} {...input} />
      {hint && (
        <p id={`${id}-h`} className="mt-1 text-sm text-muted">
          {hint}
        </p>
      )}
    </div>
  );
}

function Check({ children, ...input }: React.ComponentProps<"input">) {
  return (
    <label className="flex min-h-11 cursor-pointer items-center gap-3 text-ink">
      <input type="checkbox" className="size-5 shrink-0 cursor-pointer accent-pink" {...input} />
      <span>{children}</span>
    </label>
  );
}

// The page's one message line (errors and "sent" notes).
function Alert({ msg }: { msg: Msg }) {
  return (
    <p role="alert" className={`min-h-6 font-semibold ${msg?.ok ? "text-[#2e7d6b]" : "text-pink-ink"}`}>
      {msg?.text}
    </p>
  );
}

// Keeps its label while pending (a spinner shows instead) and stays focusable.
function Submit({ pending, children }: { pending: boolean; children: string }) {
  return (
    <button
      type="submit"
      disabled={!configured}
      aria-disabled={pending || undefined}
      className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-pink px-6 font-display text-lg font-bold text-white shadow-md transition-[translate,scale,background-color] duration-300 ease-bounce hover:-translate-y-0.5 hover:bg-pink-dark active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 aria-disabled:cursor-progress aria-disabled:opacity-80"
    >
      {pending && <span aria-hidden className="size-5 animate-spin rounded-full border-3 border-white/40 border-t-white" />}
      {children}
    </button>
  );
}

// Replaces the form once it's done; focus moves here so keyboard users stay in place.
const focus = (el: HTMLElement | null) => el?.focus();
function Done({ children }: { children: React.ReactNode }) {
  return (
    <div ref={focus} tabIndex={-1} role="alert" className="animate-pop-in space-y-3 rounded-2xl bg-[#e6f8ff] p-5 text-ink">
      <Icon name="check" className="size-10 rounded-full bg-white p-1.5 text-[#2e7d6b]" />
      {children}
    </div>
  );
}

const Redirecting = () => (
  <p role="status" className="font-semibold text-ink">
    Bạn đã đăng nhập. Đang chuyển vào trang học…
  </p>
);

const noop = () => () => {};
// ?next=… carried across the login ↔ sign-up links (read after hydration, no Suspense needed).
const useSearch = () => useSyncExternalStore(noop, () => location.search, () => "");

// Error an email link came back with (#error_code=otp_expired…) as a sentence, "" if none.
function linkError() {
  const p = new URLSearchParams(`${location.search.slice(1)}&${location.hash.slice(1)}`);
  return p.get("error_code") || p.get("error") ? authMessage({ code: p.get("error_code") }) : "";
}

const field = (f: FormData, k: string) => String(f.get(k) ?? "").trim();
const password = (f: FormData) => String(f.get("password") ?? "");

// Shared submit plumbing: one request at a time; SDK errors are thrown and shown in Vietnamese.
function useAuthAction() {
  const [msg, setMsg] = useState<Msg>(configured ? null : OFF);
  const [pending, setPending] = useState(false);
  const busy = useRef(false); // a second click before the re-render must not send twice
  const run = async (fn: (auth: GoTrueClient) => Promise<void>) => {
    if (busy.current || !configured) return;
    busy.current = true;
    setPending(true);
    setMsg(null);
    try {
      const auth = await getAuth();
      if (auth) await fn(auth);
    } catch (e) {
      setMsg({ text: authMessage(e) });
    }
    busy.current = false;
    setPending(false);
  };
  return { msg, setMsg, pending, run };
}

// "Nhập lại mật khẩu" must match; checked on every keystroke and autofill.
function matchPasswords(form: HTMLFormElement) {
  const pw = form.elements.namedItem("password") as HTMLInputElement;
  const again = form.elements.namedItem("confirm") as HTMLInputElement;
  again.setCustomValidity(again.value && again.value !== pw.value ? "Mật khẩu nhập lại chưa khớp" : "");
}

function ShowPassword({ show, setShow }: { show: boolean; setShow: (v: boolean) => void }) {
  return (
    <Check checked={show} onChange={(e) => setShow(e.target.checked)}>
      Hiện mật khẩu
    </Check>
  );
}

function NewPasswords({ show }: { show: boolean }) {
  const type = show ? "text" : "password";
  return (
    <>
      <Field label="Mật khẩu" name="password" type={type} autoComplete="new-password" required minLength={8} maxLength={72} hint="Ít nhất 8 ký tự, nên có cả chữ và số." />
      <Field label="Nhập lại mật khẩu" name="confirm" type={type} autoComplete="new-password" required />
    </>
  );
}

const redirectTo = (path: string) => location.origin + path;

export function LoginForm() {
  const session = useSession();
  const search = useSearch();
  const { msg, setMsg, pending, run } = useAuthAction();
  const [show, setShow] = useState(false);
  const [unconfirmed, setUnconfirmed] = useState(""); // email that can get the confirmation again

  useEffect(() => {
    const err = linkError(); // e.g. an expired confirmation link
    getAuth()
      .catch(() => {})
      .then(() => err && setMsg({ text: err }));
  }, [setMsg]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const email = field(f, "email");
    setUnconfirmed("");
    // On success the session appears and AuthGuard moves on to ?next= or HOME.
    run(async (auth) => {
      const { error } = await auth.signInWithPassword({ email, password: password(f) });
      if (error?.code === "email_not_confirmed") setUnconfirmed(email);
      if (error) throw error;
    });
  };

  const resend = () =>
    run(async (auth) => {
      const { error } = await auth.resend({ type: "signup", email: unconfirmed, options: { emailRedirectTo: redirectTo("/dang-nhap/") } });
      if (error) throw error;
      setMsg({ text: `Đã gửi lại email xác nhận tới ${unconfirmed}. Bạn xem cả mục Spam nhé.`, ok: true });
      setUnconfirmed("");
    });

  return (
    <AuthCard title="Đăng nhập" lead="Dành cho giáo viên và phụ huynh." mascot="strip" side="Chào cô và ba mẹ! Mình cùng bé nghe tiếp nhé.">
      {session ? (
        <Redirecting />
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          <Field label="Email" name="email" type="email" autoComplete="email" required />
          <Field label="Mật khẩu" name="password" type={show ? "text" : "password"} autoComplete="current-password" required />
          <div className="flex flex-wrap items-center justify-between gap-x-4">
            <ShowPassword show={show} setShow={setShow} />
            <Link href="/quen-mat-khau/" className={LINK}>
              Quên mật khẩu?
            </Link>
          </div>
          <Alert msg={msg} />
          {unconfirmed && (
            <button type="button" onClick={resend} className={GHOST}>
              Gửi lại email xác nhận
            </button>
          )}
          <Submit pending={pending}>Đăng nhập</Submit>
          <p className="text-center text-ink">
            Chưa có tài khoản?{" "}
            <Link href={`/dang-ky/${search}`} className={LINK}>
              Đăng ký
            </Link>
          </p>
        </form>
      )}
    </AuthCard>
  );
}

export function RegisterForm() {
  const session = useSession();
  const search = useSearch();
  const { msg, setMsg, pending, run } = useAuthAction();
  const [show, setShow] = useState(false);
  const [sent, setSent] = useState(""); // email waiting for its confirmation click

  useEffect(() => {
    getAuth().catch(() => {}); // preload the SDK while the form is filled in
  }, []);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const email = field(f, "email");
    run(async (auth) => {
      const { data, error } = await auth.signUp({
        email,
        password: password(f),
        options: { data: { full_name: field(f, "full_name"), role: f.get("role") }, emailRedirectTo: redirectTo("/dang-nhap/") },
      });
      if (error) throw error;
      if (data.session) return; // "Confirm email" off: AuthGuard takes it from here
      // With confirmation on, Supabase answers an existing email with a user that has no identities.
      if (data.user?.identities?.length === 0)
        setMsg({
          text: (
            <>
              Email này đã có tài khoản.{" "}
              <Link href={`/dang-nhap/${search}`} className={LINK}>
                Đăng nhập
              </Link>
            </>
          ),
        });
      else setSent(email);
    });
  };

  return (
    <AuthCard
      title="Đăng ký tài khoản"
      lead="Miễn phí cho giáo viên và phụ huynh. Bé không cần tài khoản."
      mascot="happy"
      side="Nghe – Thấy – Hiểu – Thêm yêu thế giới!"
    >
      {sent ? (
        <Done>
          <p>
            Kiểm tra email <b className="break-all">{sent}</b> (cả mục Spam) để xác nhận tài khoản. Bấm link trong email là vào học được ngay.
          </p>
          <Link href="/dang-nhap/" className={LINK}>
            Về trang đăng nhập
          </Link>
        </Done>
      ) : session ? (
        <Redirecting />
      ) : (
        <form onSubmit={onSubmit} onInput={(e) => matchPasswords(e.currentTarget)} className="space-y-4">
          <Field label="Họ và tên" name="full_name" autoComplete="name" required maxLength={80} />
          <fieldset>
            <legend className="font-bold text-ink">Bạn là</legend>
            <div className="mt-1 flex flex-wrap gap-2">
              {Object.entries(ROLE).map(([value, label]) => (
                // Native radios styled as chips; the radio sits inside the chip so the
                // browser's "please choose" bubble points at it.
                <label key={value} className="group relative cursor-pointer">
                  <input type="radio" name="role" value={value} required className="peer sr-only" />
                  <span className="inline-flex min-h-12 items-center gap-2 rounded-full border-2 border-[#7c8798] bg-white px-5 font-semibold text-ink transition-[scale,translate] duration-200 ease-bounce hover:-translate-y-0.5 active:scale-90 peer-checked:animate-chrome-pop peer-checked:border-pink peer-checked:bg-pink-soft peer-checked:text-pink-ink peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-blue">
                    <Icon name="check" className="hidden size-5 group-has-checked:block" />
                    {label}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
          <Field label="Email" name="email" type="email" autoComplete="email" required />
          <NewPasswords show={show} />
          <ShowPassword show={show} setShow={setShow} />
          <Check name="consent" required>
            Tôi là giáo viên hoặc phụ huynh (từ 18 tuổi) và đồng ý{" "}
            <a href="/gioi-thieu/#chinh-sach" target="_blank" rel="noopener" className="font-bold text-blue underline underline-offset-2 hover:text-navy">
              Chính sách bảo mật
            </a>
          </Check>
          <Alert msg={msg} />
          <Submit pending={pending}>Tạo tài khoản</Submit>
          <p className="text-center text-ink">
            Đã có tài khoản?{" "}
            <Link href={`/dang-nhap/${search}`} className={LINK}>
              Đăng nhập
            </Link>
          </p>
        </form>
      )}
    </AuthCard>
  );
}

export function ForgotForm() {
  const { msg, pending, run } = useAuthAction();
  const [sent, setSent] = useState("");

  useEffect(() => {
    getAuth().catch(() => {});
  }, []);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = field(new FormData(e.currentTarget), "email");
    run(async (auth) => {
      const { error } = await auth.resetPasswordForEmail(email, { redirectTo: redirectTo("/dat-lai-mat-khau/") });
      if (error) throw error; // network, rate limit…: Supabase gives no hint whether the account exists
      setSent(email);
    });
  };

  return (
    <AuthCard title="Quên mật khẩu" lead="Nhập email đã đăng ký, chúng tôi gửi link để đặt mật khẩu mới." mascot="listening" side="Đừng lo, mình lấy lại mật khẩu nhé!">
      {sent ? (
        <Done>
          <p>
            Nếu <b className="break-all">{sent}</b> đã có tài khoản, email có link đặt lại mật khẩu sẽ tới trong vài phút. Bạn xem cả mục Spam nhé.
          </p>
          <Link href="/dang-nhap/" className={LINK}>
            Về trang đăng nhập
          </Link>
        </Done>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4">
          <Field label="Email" name="email" type="email" autoComplete="email" required />
          <Alert msg={msg} />
          <Submit pending={pending}>Gửi link đặt lại</Submit>
          <p className="text-center text-ink">
            Nhớ ra rồi?{" "}
            <Link href="/dang-nhap/" className={LINK}>
              Đăng nhập
            </Link>
          </p>
        </form>
      )}
    </AuthCard>
  );
}

const OLD_LINK = "Link này đã cũ hoặc hết hạn. Bạn hãy gửi lại link mới.";
const NO_LINK = "Link đặt lại mật khẩu không còn dùng được. Bạn hãy gửi lại link mới.";

// From the reset email (?token_hash=…&type=recovery) or "Đổi mật khẩu" when logged in.
// A link's session is never stored: the token only lives in this component (the address
// bar loses it at once) and is checked on save, in a client that keeps its session in
// memory (resetAuth). Password changed, that session is revoked and a normal login with
// the new password is the one stored. Old #access_token links are refused (app/layout).
export function ResetForm() {
  const router = useRouter();
  const session = useSession();
  const { msg, setMsg, pending, run } = useAuthAction();
  const [show, setShow] = useState(false);
  // null until the URL is read; "email": a link's token is held; "done": changed, log in
  // again; anything else is what's wrong with the link ("" = no link came with the visit).
  const [link, setLink] = useState<string | null>(null);
  const token = useRef<string | null>(null);
  const reset = useRef<GoTrueClient>(null); // the link's client once verified: a retry doesn't verify again

  useEffect(() => {
    const q = new URLSearchParams(location.search);
    if (q.get("type") === "recovery" && q.get("token_hash")) {
      token.current = q.get("token_hash");
      history.replaceState(history.state, "", location.pathname); // a reload or Back finds no token (the state is Next's)
    }
    setLink(token.current ? "email" : q.get("link") === "cu" ? OLD_LINK : linkError());
    // Leaving the page drops the link: a tab restored from the Back/Forward cache doesn't get it back.
    const drop = () => {
      token.current = reset.current = null;
      setLink((l) => (l === "email" ? "" : l));
    };
    addEventListener("pagehide", drop);
    return () => removeEventListener("pagehide", drop);
  }, []);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const pw = password(new FormData(e.currentTarget));
    run(async (auth) => {
      if (link !== "email") {
        const { error } = await auth.updateUser({ password: pw });
        if (error) throw error;
      } else {
        if (!reset.current) {
          const c = await resetAuth();
          const { data, error } = await c.verifyOtp({ token_hash: token.current!, type: "recovery" });
          if (error && (!error.status || error.status === 429 || error.status >= 500)) throw error; // offline, busy: try again
          if (error || !data.session) return setLink(authMessage({ code: "otp_expired" }));
          reset.current = c;
        }
        const { data, error } = await reset.current.updateUser({ password: pw });
        if (error) throw error; // e.g. too weak: fix it and save again
        await reset.current.signOut({ scope: "local" }).catch(() => {}); // the link's session ends here
        const { error: again } = await auth.signInWithPassword({ email: data.user.email ?? "", password: pw });
        if (again) return setLink("done");
      }
      setMsg({ text: "Đã lưu mật khẩu mới. Đang chuyển vào trang học…", ok: true });
      router.replace(HOME);
    });
  };

  const error = link === "email" ? "" : link || (session === null && configured ? NO_LINK : ""); // not configured: the form says so

  return (
    <AuthCard title="Đặt mật khẩu mới" lead="Chọn mật khẩu mới cho tài khoản của bạn." mascot="listening" side="Một mật khẩu mới, thật dễ nhớ nhé!">
      {link === null || session === undefined ? (
        <p role="status" className="font-semibold text-ink">
          Đang kiểm tra link…
        </p>
      ) : link === "done" ? (
        <Done>
          <p>Đã đổi mật khẩu. Bạn hãy đăng nhập lại bằng mật khẩu mới.</p>
          <Link href="/dang-nhap/" className={LINK}>
            Đăng nhập
          </Link>
        </Done>
      ) : !error ? (
        <form onSubmit={onSubmit} onInput={(e) => matchPasswords(e.currentTarget)} className="space-y-4">
          {link === "email" && <p className="text-muted">Link trong email được kiểm tra khi bạn bấm “Lưu mật khẩu mới”.</p>}
          <NewPasswords show={show} />
          <ShowPassword show={show} setShow={setShow} />
          <Alert msg={msg} />
          <Submit pending={pending}>Lưu mật khẩu mới</Submit>
        </form>
      ) : (
        <div className="space-y-4">
          <p role="alert" className="font-semibold text-pink-ink">
            {error}
          </p>
          <Link href="/quen-mat-khau/" className={GHOST}>
            Gửi lại link <Icon name="arrow-right" className="size-5" />
          </Link>
        </div>
      )}
    </AuthCard>
  );
}
