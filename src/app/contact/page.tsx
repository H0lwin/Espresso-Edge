
import type { Metadata } from 'next';
import ContactClient from '@/components/page-specific/ContactClient';

export const metadata: Metadata = {
  title: 'تماس با ما', // Contact Us
  description: 'با اسپرسو اج در تماس باشید. مکان، اطلاعات تماس ما را بیابید یا برای ما پیام ارسال کنید.',
};

export default function ContactPage() {
  return <ContactClient />;
}
