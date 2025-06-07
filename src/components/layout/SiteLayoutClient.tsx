
"use client";

import type { ReactNode } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Toaster } from "@/components/ui/toaster";
import { ShoppingCart } from '@/components/cart/ShoppingCart';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import OfflineIndicator from '@/components/shared/OfflineIndicator'; // Import OfflineIndicator

export default function SiteLayoutClient({ children }: { children: ReactNode }) {
  const { user, isLoading: isAuthLoading } = useAuth();

  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <head>
        <meta name="application-name" content="Espresso Edge" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Espresso Edge" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/icons/browserconfig.xml" /> 
        <meta name="msapplication-TileColor" content="#6F4E37" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#6F4E37" />

        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        {/* Add other apple touch icons for different sizes if needed */}
        {/* <link rel="apple-touch-icon" sizes="152x152" href="/icons/touch-icon-ipad.png" /> */}
        {/* <link rel="apple-touch-icon" sizes="180x180" href="/icons/touch-icon-iphone-retina.png" /> */}
        {/* <link rel="apple-touch-icon" sizes="167x167" href="/icons/touch-icon-ipad-retina.png" /> */}

        <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
        
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
        <OfflineIndicator /> {/* Add OfflineIndicator here */}
      </body>
    </html>
  );
}
