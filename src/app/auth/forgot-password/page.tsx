
import type { Metadata } from 'next';
import ForgotPasswordClient from '@/components/auth/ForgotPasswordClient';

export const metadata: Metadata = {
  title: 'فراموشی رمز عبور', // Forgot Password
  description: 'رمز عبور حساب اسپرسو اج خود را بازیابی کنید.',
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordClient />;
}
