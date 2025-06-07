
import type { Metadata } from 'next';
import RegisterClient from '@/components/auth/RegisterClient';

export const metadata: Metadata = {
  title: 'ثبت نام', // Register
  description: 'یک حساب کاربری جدید در اسپرسو اج ایجاد کنید.',
};

export default function RegisterPage() {
  return <RegisterClient />;
}
