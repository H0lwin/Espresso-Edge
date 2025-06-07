
"use client";

import type { ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Toaster } from "@/components/ui/toaster";
import { ShoppingCart } from '@/components/cart/ShoppingCart';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

export default function SiteLayoutClient({ children }: { children: ReactNode }) {
  const { isLoading: isAuthLoading } = useAuth();

  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=PT+Sans:wght@400;700&family=Vazirmatn:wght@300;400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased flex flex-col min-h-screen bg-background text-foreground">
        {isAuthLoading && <LoadingSpinner />}
        <Navbar />
        <main className="flex-grow pt-20"> {/* Added pt-20 to prevent content overlap with fixed navbar */}
          {children}
        </main>
        <Footer />
        <Toaster />
        <ShoppingCart /> {/* Add the cart component here so it can be triggered globally */}
      </body>
    </html>
  );
}
