
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

// Schema updated to use username for login as per API spec
const loginSchema = z.object({
  username: z.string().min(1, { message: "لطفاً نام کاربری خود را وارد کنید." }),
  password: z.string().min(6, { message: "رمز عبور باید حداقل ۶ کاراکتر باشد." }),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginClient() {
  const { login, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    // Call login with username and password
    const success = await login(data.username, data.password);
    if (success) {
      // Toast and redirection are handled by AuthContext now
    } else {
      // Error toast is handled by AuthContext
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
            <h2 className="text-3xl font-headline font-bold text-secondary">ورود به حساب کاربری</h2>
            <p className="mt-2 text-muted-foreground">
              یا <Link href="/auth/register" className="font-medium text-primary hover:underline">یک حساب کاربری جدید بسازید</Link>
            </p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label htmlFor="username" className="float-right">نام کاربری</Label>
              <Input
                id="username"
                type="text"
                autoComplete="username"
                className="text-right mt-1"
                {...register("username")}
              />
              {errors.username && <p className="mt-1 text-sm text-destructive">{errors.username.message}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="float-right">رمز عبور</Label>
                <div className="text-sm">
                  <Link href="/auth/forgot-password" className="font-medium text-primary hover:underline">
                    رمز عبور خود را فراموش کرده‌اید؟
                  </Link>
                </div>
              </div>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                className="text-right mt-1"
                {...register("password")}
              />
              {errors.password && <p className="mt-1 text-sm text-destructive">{errors.password.message}</p>}
            </div>

            <div>
              <Button type="submit" className="w-full text-lg" disabled={isSubmitting || authLoading}>
                {isSubmitting || authLoading ? 'در حال ورود...' : 'ورود'}
              </Button>
            </div>
          </form>
           <p className="mt-8 text-center text-sm text-muted-foreground">
            با ادامه، با <Link href="/terms" className="underline hover:text-primary">شرایط خدمات</Link> و <Link href="/privacy" className="underline hover:text-primary">سیاست حفظ حریم خصوصی</Link> ما موافقت می‌کنید.
          </p>
        </motion.div>
      </div>
    </AnimatedPage>
  );
}
