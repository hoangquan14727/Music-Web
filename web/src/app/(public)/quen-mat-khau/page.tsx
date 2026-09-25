import type { Metadata } from "next";
import { ForgotForm } from "@/components/auth/AuthForms";

export const metadata: Metadata = { title: "Quên mật khẩu" };

export default function ForgotPage() {
  return <ForgotForm />;
}
