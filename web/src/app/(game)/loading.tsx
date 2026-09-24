import Loader from "@/components/Loader";

// Only seen on slow navigations: fades in after 300 ms so fast ones don't flash it.
export default function Loading() {
  return <Loader className="animate-fade-in [animation-delay:300ms]" caption="Đang mở trò chơi…" />;
}
