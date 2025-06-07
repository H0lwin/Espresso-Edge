
"use client";

import { useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true); // Assume online by default
  const { toast, dismiss } = useToast();
  const offlineToastIdRef = useRef<string | null>(null);

  useEffect(() => {
    // Set initial state based on navigator.onLine
    if (typeof window !== "undefined" && typeof navigator !== "undefined") {
      setIsOnline(navigator.onLine);
      if (!navigator.onLine && !offlineToastIdRef.current) {
        // If initially offline, show the toast
        const { id } = toast({
          title: "اتصال قطع است",
          description: "شما آفلاین هستید. برخی از امکانات ممکن است به درستی کار نکنند.",
          variant: "destructive",
        });
        offlineToastIdRef.current = id;
      }
    }

    const handleOnline = () => {
      setIsOnline(true);
      if (offlineToastIdRef.current) {
        dismiss(offlineToastIdRef.current);
        offlineToastIdRef.current = null;
      }
      toast({
        title: "اتصال برقرار شد",
        description: "شما دوباره آنلاین شدید!",
        variant: 'default',
        duration: 5000, // Auto-dismiss after 5 seconds
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      // Only show toast if not already shown
      if (!offlineToastIdRef.current) {
        const { id } = toast({
          title: "اتصال قطع شد",
          description: "شما آفلاین هستید. برخی از امکانات ممکن است در دسترس نباشند.",
          variant: "destructive",
          // Default duration is long, will be dismissed programmatically
        });
        offlineToastIdRef.current = id;
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      // Do not dismiss here, as it might be an important ongoing status
      // if (offlineToastIdRef.current) {
      //   dismiss(offlineToastIdRef.current);
      // }
    };
  }, [toast, dismiss]);

  return null; // This component only renders toasts and does not have its own UI
}
