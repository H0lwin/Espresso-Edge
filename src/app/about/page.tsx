
import type { Metadata } from 'next';
import AboutClient from '@/components/page-specific/AboutClient';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about the story, passion, and team behind Espresso Edge.',
};

export default function AboutPage() {
  return <AboutClient />;
}
