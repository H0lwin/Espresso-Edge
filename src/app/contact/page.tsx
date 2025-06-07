
import type { Metadata } from 'next';
import ContactClient from '@/components/page-specific/ContactClient';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with Espresso Edge. Find our location, contact details, or send us a message.',
};

export default function ContactPage() {
  return <ContactClient />;
}
