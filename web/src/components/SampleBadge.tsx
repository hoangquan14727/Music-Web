// Marks text written as an example (not yet reviewed by the team's GDMN members).
export default function SampleBadge({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-block rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-900 ${className}`}>
      Nội dung mẫu – cần nhóm GDMN duyệt
    </span>
  );
}
