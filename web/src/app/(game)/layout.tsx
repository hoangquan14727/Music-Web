import StopMusic from "@/components/StopMusic";

// Game screens: focus layout (no site header/footer); library music stops so
// it never talks over the game's sounds.
export default function GameLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <StopMusic />
      {children}
    </>
  );
}
