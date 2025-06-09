
"use client";

import Link from 'next/link';
import { Facebook, Instagram, Twitter, Send, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CoffeeCupIcon } from '@/components/shared/CoffeeCupIcon';
import { motion } from 'framer-motion';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from "@/hooks/use-toast";
import apiClient from '@/lib/apiClient';


const NewsletterSchema = z.object({
  email: z.string().email({ message: "آدرس ایمیل نامعتبر است" }),
});
type NewsletterFormData = z.infer<typeof NewsletterSchema>;

interface NewsletterResponse {
  message: string;
}


export function Footer() {
  const { toast } = useToast();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<NewsletterFormData>({
    resolver: zodResolver(NewsletterSchema),
  });

  const onSubmit: SubmitHandler<NewsletterFormData> = async (data) => {
    try {
      const response = await apiClient<NewsletterResponse>('/api/newsletter/subscribe/', {
        method: 'POST',
        body: data,
      });
      toast({
        title: "عضو شدید!",
        description: response.message || "از اینکه به خبرنامه ما پیوستید متشکریم.",
      });
      reset();
    } catch (error: any) {
      console.error("Newsletter subscription error:", error);
      toast({
        title: "خطا در عضویت",
        description: error.message || "مشکلی در عضویت شما در خبرنامه پیش آمد. لطفاً دوباره تلاش کنید.",
        variant: "destructive",
      });
    }
  };

  const socialLinks = [
    { href: '#', icon: Facebook, label: 'فیسبوک' },
    { href: '#', icon: Instagram, label: 'اینستاگرام' },
    { href: '#', icon: Twitter, label: 'توییتر' },
  ];

  return (
    <footer className="bg-secondary text-secondary-foreground py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 items-start">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
            className="flex flex-col items-center md:items-start text-center md:text-right" 
          >
            <h3 className="text-xl font-headline mb-3">به روز بمانید</h3>
            <p className="text-sm mb-3 text-right w-full">برای دریافت آخرین اخبار و پیشنهادات در خبرنامه ما ثبت نام کنید.</p>
            <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2 w-full max-w-sm">
              <Input
                type="email"
                placeholder="ایمیل خود را وارد کنید"
                className="bg-secondary-foreground text-secondary placeholder:text-muted-foreground border-border focus:ring-primary text-right flex-grow" 
                {...register("email")}
                aria-invalid={errors.email ? "true" : "false"}
                disabled={isSubmitting}
              />
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button type="submit" variant="default" size="icon" aria-label="عضویت در خبرنامه" className="bg-primary hover:bg-primary/80" disabled={isSubmitting}>
                  {isSubmitting ? <span className="animate-spin h-5 w-5 border-2 border-t-transparent rounded-full"></span> : <Send className="h-5 w-5" />}
                </Button>
              </motion.div>
            </form>
            {errors.email && <p className="text-sm text-destructive mt-1 text-right w-full max-w-sm">{errors.email.message}</p>} 
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex flex-col items-center md:items-end text-center md:text-right" 
          >
            <h3 className="text-xl font-headline mb-3 flex items-center">
                <Clock className="ms-2 h-5 w-5" />ساعات کاری
            </h3>
            <p className="text-sm">دوشنبه - جمعه: ۷:۰۰ صبح - ۷:۰۰ عصر</p>
            <p className="text-sm">شنبه - یکشنبه: ۸:۰۰ صبح - ۶:۰۰ عصر</p>
            <div className="flex justify-center md:justify-end space-x-4 space-x-reverse mt-4"> 
              {socialLinks.map((link) => (
                <Link key={link.label} href={link.href} aria-label={link.label} target="_blank" rel="noopener noreferrer">
                  <motion.div whileHover={{ scale: 1.2, rotate: -5 }} whileTap={{ scale: 0.9 }}> 
                    <link.icon className="h-6 w-6 hover:text-primary transition-colors" />
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="flex flex-col items-center md:items-end text-center md:text-right"
          >
            <Link href="/" className="flex items-center gap-2 text-2xl font-headline font-bold mb-4 hover:text-primary transition-colors">
              <motion.div whileHover={{ scale: 1.1, rotate: 5 }} whileTap={{ scale: 0.95 }}>
                <CoffeeCupIcon className="h-8 w-8" />
              </motion.div>
              اسپرسو اج
            </Link>
            <p className="text-sm">&copy; {new Date().getFullYear()} اسپرسو اج. تمامی حقوق محفوظ است.</p> 
            <p className="text-sm mt-2">
              <a href="https://github.com/heroinsh/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                Developed by Shayan
              </a>
            </p>
          </motion.div>

        </div>
      </div>
    </footer>
  );
}
