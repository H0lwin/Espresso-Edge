
import type { Metadata } from 'next';
import HomeClient from '@/components/page-specific/HomeClient';

export const metadata: Metadata = {
  title: 'خانه', // Home
  description: 'به اسپرسو اج خوش آمدید - مقصد شما برای بهترین قهوه، شیرینی‌ها و فضایی گرم.',
};

export default function HomePage() {
  return <HomeClient />;
}
