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
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export function ContactForm() {
  const { toast } = useToast();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit: SubmitHandler<ContactFormData> = async (data) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(data);
    toast({
      title: "Message Sent!",
      description: "Thanks for reaching out. We'll get back to you soon.",
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <motion.div variants={inputFieldVariants} initial="hidden" animate="visible" custom={0} className="relative space-y-1">
        <Label htmlFor="name" className={errors.name ? "text-destructive" : "text-muted-foreground"}>Full Name</Label>
        <Input
          id="name"
          placeholder="Jane Doe"
          aria-invalid={errors.name ? "true" : "false"}
          className={errors.name ? "border-destructive focus:ring-destructive" : "border-border focus:ring-primary"}
          {...register("name")}
        />
        {errors.name && <p className="text-sm text-destructive pt-1">{errors.name.message}</p>}
      </motion.div>

      <motion.div variants={inputFieldVariants} initial="hidden" animate="visible" custom={1} className="relative space-y-1">
        <Label htmlFor="email" className={errors.email ? "text-destructive" : "text-muted-foreground"}>Email Address</Label>
        <Input
          id="email"
          type="email"
          placeholder="jane.doe@example.com"
          aria-invalid={errors.email ? "true" : "false"}
          className={errors.email ? "border-destructive focus:ring-destructive" : "border-border focus:ring-primary"}
          {...register("email")}
        />
        {errors.email && <p className="text-sm text-destructive pt-1">{errors.email.message}</p>}
      </motion.div>

      <motion.div variants={inputFieldVariants} initial="hidden" animate="visible" custom={2} className="relative space-y-1">
        <Label htmlFor="message" className={errors.message ? "text-destructive" : "text-muted-foreground"}>Your Message</Label>
        <Textarea
          id="message"
          placeholder="Tell us how we can help..."
          rows={5}
          aria-invalid={errors.message ? "true" : "false"}
          className={errors.message ? "border-destructive focus:ring-destructive" : "border-border focus:ring-primary"}
          {...register("message")}
        />
        {errors.message && <p className="text-sm text-destructive pt-1">{errors.message.message}</p>}
      </motion.div>

      <motion.div variants={inputFieldVariants} initial="hidden" animate="visible" custom={3}>
        <Button type="submit" className="w-full text-lg" size="lg" disabled={isSubmitting}>
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </Button>
      </motion.div>
    </form>
  );
}
