
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

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "لطفاً یک آدرس ایمیل معتبر وارد کنید." }),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordClient() {
  const { sendPasswordResetEmail, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit: SubmitHandler<ForgotPasswordFormData> = async (data) => {
    const success = await sendPasswordResetEmail(data.email);
    if (success) {
      toast({
        title: "ایمیل ارسال شد",
        description: "اگر حساب کاربری با این ایمیل وجود داشته باشد، دستورالعمل‌های بازیابی رمز عبور ارسال خواهد شد.",
      });
    } else {
      toast({
        title: "خطا",
        description: "مشکلی در ارسال ایمیل بازیابی پیش آمد. لطفاً دوباره تلاش کنید.",
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
            <h2 className="text-3xl font-headline font-bold text-secondary">بازیابی رمز عبور</h2>
            <p className="mt-2 text-muted-foreground">
              ایمیل خود را وارد کنید تا لینک بازیابی رمز عبور را برایتان ارسال کنیم.
            </p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
              <Button type="submit" className="w-full text-lg" disabled={isSubmitting || authLoading}>
                {isSubmitting || authLoading ? 'در حال ارسال...' : 'ارسال لینک بازیابی'}
              </Button>
            </div>
          </form>
          <p className="mt-8 text-center text-sm">
            <Link href="/auth/login" className="font-medium text-primary hover:underline">
              بازگشت به صفحه ورود
            </Link>
          </p>
        </motion.div>
      </div>
    </AnimatedPage>
  );
}
