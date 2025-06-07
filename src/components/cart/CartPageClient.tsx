
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { MinusCircle, PlusCircle, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { AnimatedPage } from '@/components/shared/AnimatedPage';
import { motion } from 'framer-motion';

export default function CartPageClient() {
  const { cartItems, updateItemQuantity, removeItemFromCart, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleCheckout = () => {
    if (!user) {
      toast({
        title: "ورود لازم است",
        description: "لطفاً برای ادامه خرید وارد شوید یا ثبت نام کنید.",
        variant: "destructive",
      });
      router.push(`/auth/login?redirect=${encodeURIComponent('/cart')}`);
    } else {
      router.push('/checkout');
    }
  };

  if (cartItems.length === 0) {
    return (
      <AnimatedPage>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
          <ShoppingBag className="h-32 w-32 text-muted-foreground mx-auto mb-6" />
          <h1 className="text-3xl font-headline text-secondary mb-4">سبد خرید شما خالی است</h1>
          <p className="text-muted-foreground mb-8">به نظر می‌رسد هنوز چیزی به سبد خرید خود اضافه نکرده‌اید.</p>
          <Button asChild size="lg">
            <Link href="/menu">
              <ArrowLeft className="ms-2 h-5 w-5" /> {/* RTL */}
              بازگشت به منو و شروع خرید
            </Link>
          </Button>
        </div>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-right">
        <motion.h1 
          className="text-4xl md:text-5xl font-headline text-center text-secondary mb-12"
          initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5}}
        >
          سبد خرید شما
        </motion.h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          <motion.div 
            className="lg:col-span-2 space-y-6"
            initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
          >
            {cartItems.map(item => (
              <div key={item.id} className="flex items-start gap-4 p-4 border rounded-lg shadow-sm bg-card">
                <Image 
                  src={item.imageSrc} 
                  alt={item.name} 
                  width={100} 
                  height={100} 
                  className="rounded-md object-cover w-24 h-24 sm:w-32 sm:h-32"
                  data-ai-hint={item.imageHint || 'product image'}
                />
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold text-secondary">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">{item.category}</p>
                  <p className="text-md font-medium text-primary mt-1">{item.price}</p>
                  <div className="flex items-center gap-2 mt-3">
                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateItemQuantity(item.id, item.quantity - 1)}>
                      <MinusCircle className="h-4 w-4" />
                    </Button>
                    <span className="w-10 text-center text-lg font-medium">{item.quantity}</span>
                    <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => updateItemQuantity(item.id, item.quantity + 1)}>
                      <PlusCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive self-start" onClick={() => removeItemFromCart(item.id)}>
                  <Trash2 className="h-5 w-5" />
                  <span className="sr-only">حذف آیتم</span>
                </Button>
              </div>
            ))}
             <Button variant="link" size="sm" className="text-destructive mt-4" onClick={() => { clearCart(); toast({title: "سبد خرید پاک شد!"}) }}>
              پاک کردن کل سبد خرید
            </Button>
          </motion.div>

          <motion.div 
            className="lg:col-span-1 space-y-6 bg-card p-6 rounded-lg shadow-lg border h-fit sticky top-24"
            initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h2 className="text-2xl font-headline text-secondary border-b pb-3">خلاصه سفارش</h2>
            <div className="space-y-2">
              <div className="flex justify-between text-muted-foreground">
                <span>جمع جزء:</span>
                <span>{getCartTotal()}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>هزینه ارسال:</span>
                <span>محاسبه در مرحله بعد</span>
              </div>
            </div>
            <Separator />
            <div className="flex justify-between text-xl font-bold text-secondary">
              <span>مجموع کل:</span>
              <span>{getCartTotal()}</span>
            </div>
            <div className="pt-2">
              <Label htmlFor="discountCode" className="float-right mb-1">کد تخفیف</Label>
              <div className="flex gap-2">
                <Input id="discountCode" type="text" placeholder="کد خود را وارد کنید" className="text-right flex-grow" />
                <Button variant="outline">اعمال</Button>
              </div>
            </div>
            <Button size="lg" className="w-full mt-4 text-lg" onClick={handleCheckout}>
              ادامه و پرداخت
            </Button>
            <Button asChild variant="outline" className="w-full mt-2">
              <Link href="/menu">
                <ArrowLeft className="ms-2 h-4 w-4" /> {/* RTL */}
                بازگشت به خرید
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </AnimatedPage>
  );
}
