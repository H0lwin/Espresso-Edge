
"use client";

import Link from 'next/link';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { CoffeeCupIcon } from '@/components/shared/CoffeeCupIcon';
import { AnimatedPage } from '@/components/shared/AnimatedPage';
import { motion } from 'framer-motion';

const registerSchema = z.object({
  name: z.string().min(2, { message: "نام باید حداقل ۲ کاراکتر باشد." }),
  email: z.string().email({ message: "لطفاً یک آدرس ایمیل معتبر وارد کنید." }),
  password: z.string().min(6, { message: "رمز عبور باید حداقل ۶ کاراکتر باشد." }),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterClient() {
  const { register: registerUser, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit: SubmitHandler<RegisterFormData> = async (data) => {
    const success = await registerUser(data.name, data.email, data.password);
    if (success) {
      toast({
        title: "ثبت نام موفق",
        description: "حساب کاربری شما ایجاد شد. خوش آمدید!",
      });
      // Redirection is handled by AuthContext
    } else {
      toast({
        title: "خطا در ثبت نام",
        description: "مشکلی پیش آمد. لطفاً دوباره تلاش کنید.",
        variant: "destructive",
      });
    }
  };

  return (
    <AnimatedPage>
      <div className="flex min-h-screen items-center justify-center bg-background p-4 text-right">
        <motion.div 
          className="w-full max-w-md space-y-8 bg-card p-8 sm:p-10 rounded-xl shadow-2xl border"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center">
            <Link href="/" className="inline-block mb-6">
              <CoffeeCupIcon className="h-16 w-16 text-primary mx-auto" />
            </Link>
            <h2 className="text-3xl font-headline font-bold text-secondary">ایجاد حساب کاربری</h2>
            <p className="mt-2 text-muted-foreground">
              یا <Link href="/auth/login" className="font-medium text-primary hover:underline">وارد حساب کاربری خود شوید</Link>
            </p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label htmlFor="name" className="float-right">نام کامل</Label>
              <Input
                id="name"
                type="text"
                autoComplete="name"
                className="text-right mt-1"
                {...register("name")}
              />
              {errors.name && <p className="mt-1 text-sm text-destructive">{errors.name.message}</p>}
            </div>
            <div>
              <Label htmlFor="email" className="float-right">ایمیل</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                className="text-right mt-1"
                {...register("email")}
              />
              {errors.email && <p className="mt-1 text-sm text-destructive">{errors.email.message}</p>}
            </div>

            <div>
              <Label htmlFor="password" className="float-right">رمز عبور</Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                className="text-right mt-1"
                {...register("password")}
              />
              {errors.password && <p className="mt-1 text-sm text-destructive">{errors.password.message}</p>}
            </div>

            <div>
              <Button type="submit" className="w-full text-lg" disabled={isSubmitting || authLoading}>
                {isSubmitting || authLoading ? 'در حال ایجاد حساب...' : 'ثبت نام'}
              </Button>
            </div>
          </form>
          <p className="mt-8 text-center text-sm text-muted-foreground">
            با ثبت نام، با <Link href="/terms" className="underline hover:text-primary">شرایط خدمات</Link> و <Link href="/privacy" className="underline hover:text-primary">سیاست حفظ حریم خصوصی</Link> ما موافقت می‌کنید.
          </p>
        </motion.div>
      </div>
    </AnimatedPage>
  );
}

