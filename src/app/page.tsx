
import type { Metadata } from 'next';
import HomeClient from '@/components/page-specific/HomeClient';

export const metadata: Metadata = {
  title: 'Home',
  description: 'Welcome to Espresso Edge - your destination for the finest coffee, pastries, and a warm atmosphere.',
};

export default function HomePage() {
  return <HomeClient />;
}
