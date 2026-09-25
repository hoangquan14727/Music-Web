import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/AuthForms";

export const metadata: Metadata = { title: "Đăng nhập", description: "Đăng nhập Thế giới Âm thanh dành cho giáo viên và phụ huynh." };

export default function LoginPage() {
  return <LoginForm />;
}
