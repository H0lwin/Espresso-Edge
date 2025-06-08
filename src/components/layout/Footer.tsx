
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


const NewsletterSchema = z.object({
  email: z.string().email({ message: "آدرس ایمیل نامعتبر است" }),
});
type NewsletterFormData = z.infer<typeof NewsletterSchema>;


export function Footer() {
  const { toast } = useToast();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<NewsletterFormData>({
    resolver: zodResolver(NewsletterSchema),
  });

  const onSubmit: SubmitHandler<NewsletterFormData> = async (data) => {
    console.log('عضویت در خبرنامه:', data.email);
    toast({
      title: "عضو شدید!",
      description: "از اینکه به خبرنامه ما پیوستید متشکریم.",
    });
    reset();
  };

  const socialLinks = [
    { href: '#', icon: Facebook, label: 'فیسبوک' },
    { href: '#', icon: Instagram, label: 'اینستاگرام' },
    { href: '#', icon: Twitter, label: 'توییتر' },
  ];

  // This button is actually in src/components/page-specific/HomeClient.tsx
  // The footer structure is different.
  // The footer itself IS bg-secondary. The buttons inside it need to be styled.
  // The "داستان ما را بخوانید" button IS NOT in the footer based on current code.
  // The footer has newsletter and social links.

  // Re-checking the user's request. The user said "داستان ما را بخوانید در فوتر"
  // Let's check HomeClient.tsx for a section that might be visually *like* a footer but is on the home page.
  // In HomeClient.tsx, there is:
  // <section className="py-20 md:py-32 bg-secondary text-secondary-foreground">
  //   ...
  //   <Button asChild variant="outline" size="lg" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-secondary rounded-md shadow-lg transition-transform duration-300 hover:scale-105">
  //     <Link href="/about">
  //       داستان ما را بخوانید
  //     </Link>
  //   </Button>
  //  ...
  // </section>
  // This section has `bg-secondary text-secondary-foreground`. This is likely what the user refers to as "in the footer" because of its dark background, even if it's not the literal `<footer>` element.

  // So, the change needs to be in /src/components/page-specific/HomeClient.tsx

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
              />
              <Button type="submit" variant="default" size="icon" aria-label="عضویت در خبرنامه" className="bg-primary hover:bg-primary/80">
                <Send className="h-5 w-5" />
              </Button>
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
              اسپرسو اج
              <CoffeeCupIcon className="h-8 w-8" />
            </Link>
            <p className="text-sm">&copy; {new Date().getFullYear()} اسپرسو اج. تمامی حقوق محفوظ است.</p> 
          </motion.div>

        </div>
      </div>
    </footer>
  );
}
