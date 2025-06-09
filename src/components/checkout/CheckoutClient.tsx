
"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { AnimatedPage } from '@/components/shared/AnimatedPage';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import apiClient from '@/lib/apiClient';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

const checkoutSchema = z.object({
  fullName: z.string().min(3, { message: "نام کامل باید حداقل ۳ کاراکتر باشد." }),
  phone: z.string().regex(/^09[0-9]{9}$/, { message: "شماره تلفن معتبر ایرانی وارد کنید (مثال: 09123456789)." }),
  address: z.string().min(10, { message: "آدرس باید حداقل ۱۰ کاراکتر باشد." }),
  buildingNumber: z.string().optional(),
  postalCode: z.string().optional(),
  notes: z.string().optional(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function CheckoutClient() {
  const { cartItems, getCartTotal, clearCart, getTotalNumeric } = useCart();
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [isPageLoading, setIsPageLoading] = useState(true);


  const { register, handleSubmit, formState: { errors, isSubmitting: isFormSubmitting }, setValue } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  });

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        toast({
          title: "نیاز به ورود",
          description: "برای دسترسی به صفحه پرداخت، لطفاً ابتدا وارد شوید.",
          variant: "destructive",
        });
        router.replace(`/auth/login?redirect=${encodeURIComponent('/checkout')}`);
      } else if (cartItems.length === 0) {
        toast({
            title: "سبد خرید خالی",
            description: "سبد خرید شما خالی است. لطفاً ابتدا محصولی اضافه کنید.",
        });
        router.replace('/menu');
      } else {
        setValue('fullName', user.name || '');
        // Potentially prefill other fields if available in user object
        // e.g. if you store phone/address on user model and fetch it.
        setIsPageLoading(false);
      }
    }
  }, [user, authLoading, router, toast, setValue, cartItems]);


  const onSubmit: SubmitHandler<CheckoutFormData> = async (data) => {
    if (!user) {
        toast({ title: "خطا", description: "کاربر وارد نشده است.", variant: "destructive"});
        return;
    }
    try {
      const orderData = {
        customer_details: { // Structure this as your backend expects
          name: data.fullName,
          phone: data.phone,
          email: user.email, // Assuming user email is the customer email
        },
        shipping_address: {
          address_line1: data.address,
          building_number: data.buildingNumber,
          postal_code: data.postalCode,
        },
        items: cartItems.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          price_at_purchase: item.price, // Send numeric price
        })),
        total_amount: getTotalNumeric(),
        notes: data.notes,
      };

      // Replace with your actual order creation endpoint
      await apiClient('/api/orders/create/', {
        method: 'POST',
        body: orderData,
      });

      toast({
        title: "پرداخت موفق (شبیه‌سازی شده)",
        description: "سفارش شما ثبت شد! به زودی به صفحه تایید هدایت می‌شوید.",
      });

      await clearCart(); // Clear cart after successful order
      router.push('/order-confirmation-placeholder');
    } catch (error: any) {
      console.error("Failed to create order:", error);
      toast({
        title: "خطا در ثبت سفارش",
        description: error.message || "مشکلی در هنگام ثبت سفارش شما پیش آمد. لطفاً دوباره تلاش کنید.",
        variant: "destructive",
      });
    }
  };

  if (isPageLoading || authLoading) {
    return (
      <AnimatedPage>
        <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
           <LoadingSpinner />
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
          نهایی کردن سفارش
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Order Summary - Right column in RTL */}
          <motion.div
            className="lg:col-span-1 lg:order-last space-y-6 bg-card p-6 rounded-lg shadow-lg border h-fit sticky top-24"
            initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h2 className="text-2xl font-headline text-secondary border-b pb-3">خلاصه سفارش</h2>
            <div className="max-h-60 overflow-y-auto space-y-3 pe-1">
              {cartItems.map(item => (
                <div key={item.id} className="flex items-center gap-3">
                  <Image 
                    src={item.imageSrc || 'https://placehold.co/48x48.png'} 
                    alt={item.name} 
                    width={48} height={48} 
                    className="rounded object-cover h-12 w-12" 
                    data-ai-hint={item.imageHint} 
                  />
                  <div className="flex-grow">
                    <p className="text-sm font-medium">{item.name} (×{item.quantity})</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {typeof item.price === 'number' ? item.price.toLocaleString('fa-IR') + ' تومان' : item.price}
                  </p>
                </div>
              ))}
            </div>
            <Separator />
            <div className="space-y-1">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>جمع جزء:</span>
                <span>{getCartTotal()}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>هزینه ارسال:</span>
                <span>رایگان (فعلاً)</span>
              </div>
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-bold text-secondary">
              <span>مجموع کل:</span>
              <span>{getCartTotal()}</span>
            </div>
             <Button asChild variant="link" size="sm" className="text-primary px-0">
              <Link href="/cart">
                <ArrowLeft className="ms-1 h-4 w-4" />
                بازگشت به سبد خرید
              </Link>
            </Button>
          </motion.div>

          {/* Checkout Form - Left column in RTL */}
          <motion.form
            onSubmit={handleSubmit(onSubmit)}
            className="lg:col-span-2 lg:order-first space-y-6 bg-card p-6 sm:p-8 rounded-lg shadow-lg border"
            initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div>
              <h2 className="text-2xl font-headline text-secondary mb-1">اطلاعات ارسال</h2>
              <p className="text-sm text-muted-foreground mb-4">لطفاً اطلاعات خود را برای ارسال سفارش وارد کنید.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              <div>
                <Label htmlFor="fullName" className="float-right">نام و نام خانوادگی</Label>
                <Input id="fullName" {...register("fullName")} className="mt-1 text-right" />
                {errors.fullName && <p className="mt-1 text-sm text-destructive">{errors.fullName.message}</p>}
              </div>
              <div>
                <Label htmlFor="phone" className="float-right">شماره تلفن همراه</Label>
                <Input id="phone" type="tel" {...register("phone")} className="mt-1 text-right" placeholder="09123456789" />
                {errors.phone && <p className="mt-1 text-sm text-destructive">{errors.phone.message}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="address" className="float-right">آدرس کامل</Label>
              <Textarea id="address" rows={3} {...register("address")} className="mt-1 text-right" placeholder="استان، شهر، خیابان اصلی، کوچه، پلاک..." />
              {errors.address && <p className="mt-1 text-sm text-destructive">{errors.address.message}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
              <div>
                <Label htmlFor="buildingNumber" className="float-right">پلاک (اختیاری)</Label>
                <Input id="buildingNumber" {...register("buildingNumber")} className="mt-1 text-right" />
              </div>
              <div>
                <Label htmlFor="postalCode" className="float-right">کد پستی (اختیاری)</Label>
                <Input id="postalCode" {...register("postalCode")} className="mt-1 text-right" />
              </div>
            </div>

            <div>
              <Label htmlFor="notes" className="float-right">توضیحات سفارش (اختیاری)</Label>
              <Textarea id="notes" rows={2} {...register("notes")} className="mt-1 text-right" placeholder="مثلا: زنگ واحد ۲ را بزنید." />
            </div>

            <Separator className="my-6" />

            <div>
                <h3 className="text-xl font-headline text-secondary mb-3">روش پرداخت</h3>
                <p className="text-sm text-muted-foreground mb-4">در حال حاضر فقط پرداخت آنلاین شبیه‌سازی شده است.</p>
                {/* Add payment method selection here if needed in future */}
            </div>

            <Button type="submit" size="lg" className="w-full text-lg" disabled={isFormSubmitting}>
              {isFormSubmitting ? 'در حال پردازش...' : `پرداخت ${getCartTotal()}`}
            </Button>
          </motion.form>
        </div>
      </div>
    </AnimatedPage>
  );
}
