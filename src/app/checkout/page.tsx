
import type { Metadata } from 'next';
import CheckoutClient from '@/components/checkout/CheckoutClient';

export const metadata: Metadata = {
  title: 'پرداخت', // Checkout
  description: 'سفارش خود را در اسپرسو اج نهایی کنید.',
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}
