import type { Metadata, Viewport } from "next";
import { Baloo_2, Nunito } from "next/font/google";
import { Intro } from "@/components/Loader";
import NavPending from "@/components/NavPending";
import AuthGuard from "@/components/AuthGuard";
import { AUTH_KEY, HOME, PUBLIC_PATHS, loginUrl } from "@/lib/auth-paths";
import "./globals.css";

// Both fonts ship a Vietnamese subset (Comic Neue does not). next/font
// self-hosts them at build time, so no request goes to Google at runtime.
const baloo = Baloo_2({ subsets: ["latin", "vietnamese"], variable: "--font-baloo", display: "swap" });
const nunito = Nunito({ subsets: ["latin", "vietnamese"], variable: "--font-nunito", display: "swap" });

export const metadata: Metadata = {
  title: { default: "Thế giới Âm thanh", template: "%s | Thế giới Âm thanh" },
  description:
    "Một không gian học tập và trải nghiệm âm thanh đầy màu sắc dành cho trẻ mầm non và giáo viên: nghe, nhận biết, phân biệt và chơi cùng âm thanh.",
  // Link previews (Discord, Facebook, Zalo…): the image is app/opengraph-image.jpg and
  // needs an absolute URL. Vercel sets the production domain at build time.
  metadataBase: new URL(`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL ?? "music-web-theta-ashy.vercel.app"}`),
  openGraph: { type: "website", locale: "vi_VN", siteName: "Thế giới Âm thanh" },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#fcf8f9",
};

// Before first paint:
// - the login gate (lib/auth-paths; also on a Back/Forward cache restore): a guest on
//   a non-public page goes to /dang-nhap/?next=…, a logged-in visitor on / to HOME.
//   The page is hidden meanwhile and nothing below runs; the "tgat-hop" flag lets the
//   intro still play on the page it lands on (its referrer is then our own site);
// - the "Tắt hiệu ứng" setting (data-motion="off", see lib/motion; the observer
//   re-adds it when React resets <html> attributes, e.g. the dev Strict Mode remount);
// - lazy content images (motion/loading.css): html.img-fx + data-loaded on load/error;
// - lazy images: each skeleton pulse re-checks .complete (Safari may load a cached
//   image before React inserts it, so no load event reaches us);
// - the brand intro: first visit of a tab only — not with effects off, not in a tab
//   opened from inside the site or in the background, and not if storage fails
//   (fails closed; without this script it never shows). html.intro-js shows it,
//   html.intro-on holds page animations until the curtain lifts, html.intro-font
//   releases the wordmark once Baloo 2 is ready. The bar (--p) follows real steps
//   (parsed, fonts, hero image decoded, window load), shown ≥ 0.95 s, done by ~2.4 s.
//   A tap, key, wheel or swipe skips; the click that follows a skip tap is swallowed.
const HEAD_SCRIPT = `(function(){var d=document.documentElement;
function gate(){var p=location.pathname,s,to="";p=p.slice(-1)==="/"?p:p+"/";try{s=JSON.parse(localStorage.getItem(${JSON.stringify(AUTH_KEY)}))}catch(e){}
if(!(s&&s.refresh_token)){if(${JSON.stringify(PUBLIC_PATHS)}.indexOf(p)<0)to=${JSON.stringify(loginUrl(""))}+encodeURIComponent(location.pathname+location.search+location.hash)}else if(p==="/")to=${JSON.stringify(HOME)};
if(!to)return;d.style.visibility="hidden";try{sessionStorage.setItem("tgat-hop","1")}catch(e){}location.replace(to);return 1}
if(gate())return;function sync(){try{if(localStorage.getItem("tgat-motion")==="off"&&!d.dataset.motion)d.dataset.motion="off"}catch(e){}}
sync();new MutationObserver(sync).observe(d,{attributeFilter:["data-motion"]});
function apply(){try{if(localStorage.getItem("tgat-motion")==="off")d.dataset.motion="off";else delete d.dataset.motion}catch(e){}}
addEventListener("pageshow",function(e){e.persisted&&(gate()||apply())});addEventListener("storage",function(e){(e.key==="tgat-motion"||e.key===null)&&apply()});
d.classList.add("img-fx");function lazy(t){return t.tagName==="IMG"&&t.loading==="lazy"&&!t.closest("[aria-hidden]")}
function mark(t,f){t.dataset.loaded=f?"in":"";f&&setTimeout(function(){t.dataset.loaded=""},450)}
function img(e){lazy(e.target)&&mark(e.target,1)}document.addEventListener("load",img,true);document.addEventListener("error",img,true);
addEventListener("DOMContentLoaded",function(){[].forEach.call(document.querySelectorAll("img[loading=lazy]:not([data-loaded])"),function(t){t.complete&&lazy(t)&&mark(t)})});
addEventListener("animationiteration",function(e){e.animationName==="img-wait"&&e.target.complete&&mark(e.target,1)});
var skip=1;try{var hop=sessionStorage.getItem("tgat-hop");sessionStorage.removeItem("tgat-hop");skip=d.dataset.motion||document.hidden||sessionStorage.getItem("tgat-intro")||(!hop&&document.referrer&&new URL(document.referrer).origin===location.origin);skip||sessionStorage.setItem("tgat-intro","1")}catch(e){}
if(skip)return;d.classList.add("intro-js","intro-on");setTimeout(function(){exit();d.classList.remove("intro-on")},3200);
var t0=performance.now(),n=0,out=0,I,C={capture:true,passive:false},SKIP=["pointerdown","keydown","wheel","touchmove"];
function el(){return I||(I=document.querySelector(".intro"))}function step(){n++}function font(){d.classList.add("intro-font")}
function eat(c){c.preventDefault();c.stopPropagation();removeEventListener("click",eat,true)}
function exit(e){if(out||!el())return;out=1;clearInterval(k);font();SKIP.forEach(function(t){removeEventListener(t,exit,C)});
if(e&&e.type==="pointerdown"){addEventListener("click",eat,true);setTimeout(function(){removeEventListener("click",eat,true)},800)}
if(e&&e.cancelable&&(e.type==="wheel"||e.type==="touchmove"))e.preventDefault();I.style.setProperty("--p","1");I.classList.add("intro-out")}
var k=setInterval(function(){var e=performance.now()-t0,p=e>2150?1:Math.min(.1+.9*n/4,.1+.9*e/950);if(!el())return;I.style.setProperty("--p",p);if(p>=1){clearInterval(k);setTimeout(exit,250)}},100);
addEventListener("DOMContentLoaded",function(){step();document.body.offsetWidth;document.fonts?document.fonts.ready.then(function(){step();font()}):(step(),font());
Promise.all([].map.call(document.querySelectorAll("img[fetchpriority=high]"),function(i){return i.decode().catch(function(){})})).then(step)});addEventListener("load",step);
SKIP.forEach(function(t){addEventListener(t,exit,C)});
addEventListener("animationstart",function(e){/^intro-up/.test(e.animationName)&&d.classList.remove("intro-on")});
addEventListener("animationend",function(e){/^intro-up/.test(e.animationName)&&(e.target.style.display="none")})})()`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="vi" className={`${baloo.variable} ${nunito.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: HEAD_SCRIPT }} />
      </head>
      <body className="min-h-dvh antialiased">
        <Intro />
        {children}
        <NavPending />
        <AuthGuard />
      </body>
    </html>
  );
}
