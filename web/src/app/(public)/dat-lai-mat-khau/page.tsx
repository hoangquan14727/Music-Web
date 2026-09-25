import type { Metadata } from "next";
import { ResetForm } from "@/components/auth/AuthForms";

export const metadata: Metadata = { title: "Đặt mật khẩu mới", robots: { index: false } };

export default function ResetPage() {
  return <ResetForm />;
}
