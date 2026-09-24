import NavHeader from "@/components/NavHeader";
import Footer from "@/components/Footer";
import MiniAudioPlayer from "@/components/MiniAudioPlayer";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh flex-col">
      <a href="#noi-dung" className="sr-only z-50 rounded-full bg-white px-4 py-2 font-bold focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Bỏ qua điều hướng
      </a>
      <NavHeader />
      <main id="noi-dung" className="flex-1">
        {children}
      </main>
      <Footer />
      <MiniAudioPlayer />
    </div>
  );
}
