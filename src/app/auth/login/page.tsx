
import type { Metadata } from 'next';
import LoginClient from '@/components/auth/LoginClient';

export const metadata: Metadata = {
  title: 'ورود', // Login
  description: 'وارد حساب کاربری اسپرسو اج خود شوید.',
};

export default function LoginPage() {
  return <LoginClient />;
}
