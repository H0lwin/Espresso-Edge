
"use client";

import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Toaster } from "@/components/ui/toaster";
import { ShoppingCart } from '@/components/cart/ShoppingCart';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

export default function SiteLayoutClient({ children }: { children: ReactNode }) {
  const { user, isLoading: isAuthLoading } = useAuth();

  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <head>
        {/* Ensure this is the only favicon link and points to public/favicon.png */}
        <link rel="icon" href="/favicon.png" />
        
        {/* Preconnect to Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=PT+Sans:wght@400;700&family=Vazirmatn:wght@300;400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased flex flex-col min-h-screen bg-background text-foreground">
        {(isAuthLoading || user === undefined) && <LoadingSpinner />}
        <Navbar />
        <main className="flex-grow pt-20">
          {children}
        </main>
        <Footer />
        <Toaster />
        <ShoppingCart />
      </body>
    </html>
  );
}
