import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/AuthForms";

export const metadata: Metadata = { title: "Đăng ký tài khoản", description: "Tạo tài khoản miễn phí cho giáo viên và phụ huynh để cùng bé học với Thế giới Âm thanh." };

export default function RegisterPage() {
  return <RegisterForm />;
}
