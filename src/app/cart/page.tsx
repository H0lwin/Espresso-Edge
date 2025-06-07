
import type { Metadata } from 'next';
import CartPageClient from '@/components/cart/CartPageClient';

export const metadata: Metadata = {
  title: 'سبد خرید', // Shopping Cart
  description: 'سبد خرید خود را در اسپرسو اج مشاهده و مدیریت کنید.',
};

export default function CartPage() {
  return <CartPageClient />;
}
