
"use client"; // This is a client component

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AnimatedPage } from '@/components/shared/AnimatedPage';
import { CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function OrderConfirmationPlaceholderPage() {
  return (
    <AnimatedPage>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.5,
            delay: 0.2,
            ease: [0, 0.71, 0.2, 1.01]
          }}
          className="max-w-md mx-auto bg-card p-8 sm:p-10 rounded-xl shadow-2xl border"
        >
          <CheckCircle2 className="h-20 w-20 text-green-500 mx-auto mb-6" />
          <h1 className="text-3xl md:text-4xl font-headline text-secondary mb-4">
            سفارش شما با موفقیت ثبت شد!
          </h1>
          <p className="text-muted-foreground mb-8">
            از خرید شما سپاسگزاریم. جزئیات سفارش به ایمیل شما ارسال شد (شبیه‌سازی شده).
          </p>
          <div className="space-y-3">
            <Button asChild size="lg" className="w-full">
              <Link href="/menu">ادامه خرید</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full">
              <Link href="/">بازگشت به صفحه اصلی</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatedPage>
  );
}
