
import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { ShoppingCart } from '@/components/cart/ShoppingCart'; // Import the cart modal/drawer

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
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Consider adding a Persian font like Vazirmatn or IRANSans if Playfair/PT Sans don't have good Persian glyphs */}
        {/* Example for Vazirmatn: <link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;700&display=swap" rel="stylesheet" /> */}
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased flex flex-col min-h-screen bg-background text-foreground">
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <main className="flex-grow pt-20"> {/* Added pt-20 to prevent content overlap with fixed navbar */}
              {children}
            </main>
            <Footer />
            <Toaster />
            <ShoppingCart /> {/* Add the cart component here so it can be triggered globally */}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
