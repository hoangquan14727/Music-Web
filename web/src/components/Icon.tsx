import type { ReactNode } from "react";

// Hand-drawn house icon set for menus and buttons (24 grid, 2.5 stroke, round ends).
// Decorative icons are two-tone: a soft currentColor tint behind the outline.
export type IconName =
  | "home" | "topics" | "review" | "music" | "teacher" | "student" | "search" | "menu"
  | "close" | "info" | "arrow-right" | "arrow-left" | "chevron-right" | "play" | "pause"
  | "volume" | "replay" | "headphones" | "ear" | "gamepad" | "soundwave" | "star" | "heart"
  | "lightbulb" | "printer" | "clock" | "users" | "check" | "prev" | "next" | "repeat" | "book" | "logout" | "mail" | "copy";

const tint = { fill: "currentColor", fillOpacity: 0.24 } as const;
const solid = { fill: "currentColor", stroke: "none" } as const;

const ICONS: Record<IconName, ReactNode> = {
  home: (
    <>
      <path {...tint} d="M5.5 9.6 12 4l6.5 5.6v9a1.9 1.9 0 0 1-1.9 1.9H7.4a1.9 1.9 0 0 1-1.9-1.9Z" />
      <path d="M3.2 11.4 12 3.8l8.8 7.6M10.2 20.5V17a1.8 1.8 0 0 1 3.6 0v3.5" />
    </>
  ),
  topics: (
    <path
      {...tint}
      d="M5.5 7.5h2.9a2.3 2.3 0 1 1 3.2 0h2.9a2 2 0 0 1 2 2v2.9a2.3 2.3 0 1 1 0 3.2v2.9a2 2 0 0 1-2 2h-9a2 2 0 0 1-2-2v-2.9a2.3 2.3 0 1 0 0-3.2V9.5a2 2 0 0 1 2-2Z"
    />
  ),
  review: (
    <>
      <path {...tint} d="M9 4.8H7.2A2.2 2.2 0 0 0 5 7v11.8A2.2 2.2 0 0 0 7.2 21h9.6a2.2 2.2 0 0 0 2.2-2.2V7a2.2 2.2 0 0 0-2.2-2.2H15" />
      <rect x="9" y="3" width="6" height="3.6" rx="1.3" />
      <path d="m8.9 13.4 2.3 2.3 4.1-4.4" />
    </>
  ),
  music: (
    <>
      <ellipse {...tint} cx="7.5" cy="17" rx="2.9" ry="2.3" transform="rotate(-20 7.5 17)" />
      <ellipse {...tint} cx="16.7" cy="15" rx="2.9" ry="2.3" transform="rotate(-20 16.7 15)" />
      <path d="M10.2 16.2V6.4m9.2 7.8V4.4" />
      <path {...tint} d="m10.2 6.4 9.2-2v3.2l-9.2 2Z" />
    </>
  ),
  teacher: (
    <>
      <rect {...tint} x="11" y="3.2" width="10" height="8.3" rx="1.6" />
      <path d="M13.6 7.6q1.1-1.8 2.2 0t2.2 0M14.4 11.5l-.6 9.3m5.4-9.3.6 9.3" />
      <circle {...tint} cx="7.3" cy="9.3" r="2.8" />
      <path {...tint} d="M2.8 20.8v-1.6a4.5 4.5 0 0 1 9 0v1.6" />
    </>
  ),
  student: (
    <>
      <path {...tint} d="M12 4.6 21 9l-9 4.4L3 9Z" />
      <path d="M6.4 11.2v4.4c0 1.9 2.7 3.4 5.6 3.4s5.6-1.5 5.6-3.4v-4.4M19.2 9.9v5" />
      <circle {...solid} cx="19.2" cy="16.4" r="1.3" />
    </>
  ),
  search: (
    <>
      <circle cx="10.4" cy="10.4" r="6.3" />
      <path d="m15 15 5 5" />
    </>
  ),
  menu: <path d="M4.5 6.5h15M4.5 12h15M4.5 17.5h15" />,
  close: <path d="m6.5 6.5 11 11m0-11-11 11" />,
  info: (
    <>
      <circle cx="12" cy="12" r="8.8" />
      <circle {...solid} cx="12" cy="7.9" r="1.3" />
      <path d="M12 11.2v5.2" />
    </>
  ),
  "arrow-right": <path d="M4.5 12H19m-5.2-5.2L19 12l-5.2 5.2" />,
  "arrow-left": <path d="M19.5 12H5m5.2-5.2L5 12l5.2 5.2" />,
  "chevron-right": <path d="m9 5.8 6.2 6.2L9 18.2" />,
  play: (
    <path
      fill="currentColor"
      d="M8 6.7c0-1.2 1.3-1.9 2.3-1.3l8.1 5.2c1 .6 1 2.2 0 2.8l-8.1 5.2c-1 .6-2.3-.1-2.3-1.3Z"
    />
  ),
  pause: (
    <>
      <rect {...solid} x="6.5" y="5" width="4.2" height="14" rx="1.8" />
      <rect {...solid} x="13.3" y="5" width="4.2" height="14" rx="1.8" />
    </>
  ),
  volume: (
    <path d="M3.8 10a1 1 0 0 1 1-1h2.5l4.1-3.6v13.2L7.3 15H4.8a1 1 0 0 1-1-1ZM15 9.2a4 4 0 0 1 0 5.6m2.8-8.2a7.6 7.6 0 0 1 0 10.8" />
  ),
  replay: <path d="M5.2 15.5a7.2 7.2 0 1 0 2.7-8.4m3.6 0H7.9l1.2-3.4" />,
  headphones: (
    <>
      <path d="M5.5 12.2v-.5a6.5 7.5 0 0 1 13 0v.5" />
      <rect {...tint} x="3" y="12.2" width="5" height="7.8" rx="2.2" />
      <rect {...tint} x="16" y="12.2" width="5" height="7.8" rx="2.2" />
    </>
  ),
  ear: (
    <>
      <path
        {...tint}
        d="M9.2 9a5.3 5.3 0 0 1 10.6 0c0 3.1-2.4 4.3-3.4 6.2-.9 1.8-1.3 4.2-3.8 4.2-1.6 0-2.7-1-3.1-2.2"
      />
      <path d="M12 9.2a2.5 2.5 0 0 1 5 0c0 1.4-1.3 2-1.9 2.8-.5.6-.5 1.4-1.3 1.8M6.4 9.2q-1.4 2.4 0 4.8M3.6 7.8q-2.2 3.8 0 7.6" />
    </>
  ),
  gamepad: (
    <>
      <path
        {...tint}
        d="M7.5 6.5h9c2.5 0 3.8 2 4.2 4.7l.3 3.2c.2 2.1-1 3.4-2.4 3.4-1.2 0-1.9-.8-2.5-2l-.5-1H8.4l-.5 1c-.6 1.2-1.3 2-2.5 2-1.4 0-2.6-1.3-2.4-3.4l.3-3.2c.4-2.7 1.7-4.7 4.2-4.7Z"
      />
      <path d="M7.8 9.2v3.6M6 11h3.6" />
      <circle {...solid} cx="15.6" cy="10.2" r="1.1" />
      <circle {...solid} cx="17.6" cy="12.2" r="1.1" />
    </>
  ),
  soundwave: (
    <>
      <circle {...tint} stroke="none" cx="12" cy="12" r="9.8" />
      <path d="M4.8 10.6v2.8M8.4 8v8M12 4.8v14.4M15.6 8.8v6.4M19.2 10.4v3.2" />
    </>
  ),
  star: <path {...tint} d="M12 3.5 14.9 8.9 20.9 10 16.7 14.4 17.5 20.5 12 17.8 6.5 20.5 7.3 14.4 3.1 10 9.1 8.9Z" />,
  heart: (
    <path {...tint} d="M12 7c-1.6-3.4-8.5-3.2-8.5 1.9 0 4.6 5.5 8.2 8.5 10.4 3-2.2 8.5-5.8 8.5-10.4 0-5.1-6.9-5.3-8.5-1.9Z" />
  ),
  lightbulb: (
    <>
      <path {...tint} d="M9 14.9c-1.9-1.2-3.2-3.2-3.2-5.5a6.2 6.2 0 0 1 12.4 0c0 2.3-1.3 4.3-3.2 5.5v1.2H9Z" />
      <path d="M9.3 18.6h5.4m-4.1 2.3h2.8M9 9.3a3 3 0 0 1 2.2-2.7" />
    </>
  ),
  printer: (
    <>
      <path d="M7 8.5V5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v3.5M7 16.5H5.5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H17M7 13.5h10V19a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1Z" />
      <circle {...solid} cx="17.2" cy="11.6" r="1.1" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.8" />
      <path d="M12 7.4V12l3 2" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8.4" r="3.4" />
      <circle cx="17.4" cy="9" r="2.6" />
      <path d="M2.8 20.2v-1A5.2 5.2 0 0 1 8 14h2a5.2 5.2 0 0 1 5.2 5.2v1m2-6a4.3 4.3 0 0 1 4 4.3v1.7" />
    </>
  ),
  check: <path d="m5 12.3 4.9 4.8 9.3-10.2" />,
  prev: <path d="M17.8 6.5 9.3 12l8.5 5.5ZM6.2 6v12" />,
  next: <path d="M6.2 6.5 14.7 12l-8.5 5.5ZM17.8 6v12" />,
  repeat: (
    <path d="M4.5 11.5V10a3 3 0 0 1 3-3H19m-2.8-2.8L19 7l-2.8 2.8M19.5 12.5V14a3 3 0 0 1-3 3H5m2.8-2.8L5 17l2.8 2.8" />
  ),
  book: (
    <>
      <path {...tint} d="M12 6.5c-2-1.6-5-2-8.5-1.6v13c3.5-.3 6.5.2 8.5 1.6" />
      <path {...tint} d="M12 6.5c2-1.6 5-2 8.5-1.6v13c-3.5-.3-6.5.2-8.5 1.6Z" />
    </>
  ),
  logout: (
    <>
      <path {...tint} d="M11 4.5H6.9A1.9 1.9 0 0 0 5 6.4v11.2a1.9 1.9 0 0 0 1.9 1.9H11" />
      <path d="M10.5 12h9.5m-3.4-3.6L20 12l-3.4 3.6" />
    </>
  ),
  mail: (
    <>
      <rect {...tint} x="3.5" y="5.5" width="17" height="13" rx="2.4" />
      <path d="m4.3 7.2 7.7 5.8 7.7-5.8" />
    </>
  ),
  copy: (
    <>
      <rect {...tint} x="8.5" y="8.5" width="11.5" height="11.5" rx="2.2" />
      <path d="M15.5 8.5V6.2A2.2 2.2 0 0 0 13.3 4H6.2A2.2 2.2 0 0 0 4 6.2v7.1a2.2 2.2 0 0 0 2.2 2.2h2.3" />
    </>
  ),
};

export default function Icon({ name, className }: { name: IconName; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {ICONS[name]}
    </svg>
  );
}
