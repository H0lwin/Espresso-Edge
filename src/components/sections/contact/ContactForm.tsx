
"use client";

import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from "@/hooks/use-toast";
import { motion } from 'framer-motion';

const contactFormSchema = z.object({
  name: z.string().min(2, { message: "نام باید حداقل ۲ حرف باشد." }),
  email: z.string().email({ message: "لطفاً یک آدرس ایمیل معتبر وارد کنید." }),
  message: z.string().min(10, { message: "پیام باید حداقل ۱۰ حرف باشد." }),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export function ContactForm() {
  const { toast } = useToast();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit: SubmitHandler<ContactFormData> = async (data) => {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    console.log(data);
    toast({
      title: "پیام ارسال شد!",
      description: "از تماس شما متشکریم. به زودی پاسخ خواهیم داد.",
    });
    reset();
  };

  const inputFieldVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({ 
      opacity: 1, 
      y: 0, 
      transition: { delay: i * 0.1, duration: 0.3 } 
    }),
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-right"> {/* RTL: text-right */}
      <motion.div variants={inputFieldVariants} initial="hidden" animate="visible" custom={0} className="relative space-y-1">
        <Label htmlFor="name" className={`float-right ${errors.name ? "text-destructive" : "text-muted-foreground"}`}>نام کامل</Label> {/* RTL: float-right */}
        <Input
          id="name"
          placeholder="مثلا: سارا رضایی"
          aria-invalid={errors.name ? "true" : "false"}
          className={`text-right ${errors.name ? "border-destructive focus:ring-destructive" : "border-border focus:ring-primary"}`} // RTL: text-right
          {...register("name")}
        />
        {errors.name && <p className="text-sm text-destructive pt-1 text-right">{errors.name.message}</p>} {/* RTL: text-right */}
      </motion.div>

      <motion.div variants={inputFieldVariants} initial="hidden" animate="visible" custom={1} className="relative space-y-1">
        <Label htmlFor="email" className={`float-right ${errors.email ? "text-destructive" : "text-muted-foreground"}`}>آدرس ایمیل</Label> {/* RTL: float-right */}
        <Input
          id="email"
          type="email"
          placeholder="sara.rezaei@example.com"
          aria-invalid={errors.email ? "true" : "false"}
          className={`text-right ${errors.email ? "border-destructive focus:ring-destructive" : "border-border focus:ring-primary"}`} // RTL: text-right
          {...register("email")}
        />
        {errors.email && <p className="text-sm text-destructive pt-1 text-right">{errors.email.message}</p>} {/* RTL: text-right */}
      </motion.div>

      <motion.div variants={inputFieldVariants} initial="hidden" animate="visible" custom={2} className="relative space-y-1">
        <Label htmlFor="message" className={`float-right ${errors.message ? "text-destructive" : "text-muted-foreground"}`}>پیام شما</Label> {/* RTL: float-right */}
        <Textarea
          id="message"
          placeholder="بفرمایید چطور می‌توانیم کمکتان کنیم..."
          rows={5}
          aria-invalid={errors.message ? "true" : "false"}
          className={`text-right ${errors.message ? "border-destructive focus:ring-destructive" : "border-border focus:ring-primary"}`} // RTL: text-right
          {...register("message")}
        />
        {errors.message && <p className="text-sm text-destructive pt-1 text-right">{errors.message.message}</p>} {/* RTL: text-right */}
      </motion.div>

      <motion.div variants={inputFieldVariants} initial="hidden" animate="visible" custom={3}>
        <Button type="submit" className="w-full text-lg" size="lg" disabled={isSubmitting}>
          {isSubmitting ? 'در حال ارسال...' : 'ارسال پیام'}
        </Button>
      </motion.div>
    </form>
  );
}
