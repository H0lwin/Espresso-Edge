
import type { Metadata } from 'next';
import AboutClient from '@/components/page-specific/AboutClient';

export const metadata: Metadata = {
  title: 'درباره ما', // About Us
  description: 'با داستان، اشتیاق و تیم پشت اسپرسو اج آشنا شوید.',
};

export default function AboutPage() {
  return <AboutClient />;
}
