
import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import SiteLayoutClient from '@/components/layout/SiteLayoutClient'; // Import the new client component

export const metadata: Metadata = {
  title: {
    default: 'اسپرسو اج', // Espresso Edge
    template: '%s | اسپرسو اج',
  },
  description: 'بهترین تجربه قهوه را در اسپرسو اج کشف کنید. نوشیدنی عالی شما منتظر است.', // Discover the finest coffee experience at Espresso Edge. Your perfect brew awaits.
  keywords: ['فروشگاه قهوه', 'اسپرسو', 'کافه', 'شیرینی', 'قهوه محلی'], // ['coffee shop', 'espresso', 'cafe', 'pastries', 'local coffee']
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <CartProvider>
        <SiteLayoutClient>{children}</SiteLayoutClient>
      </CartProvider>
    </AuthProvider>
  );
}
