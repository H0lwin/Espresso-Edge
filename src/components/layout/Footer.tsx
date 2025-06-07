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
  email: z.string().email({ message: "Invalid email address" }),
});
type NewsletterFormData = z.infer<typeof NewsletterSchema>;


export function Footer() {
  const { toast } = useToast();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<NewsletterFormData>({
    resolver: zodResolver(NewsletterSchema),
  });

  const onSubmit: SubmitHandler<NewsletterFormData> = async (data) => {
    // Placeholder for newsletter signup logic
    console.log('Newsletter signup:', data.email);
    toast({
      title: "Subscribed!",
      description: "Thanks for joining our newsletter.",
    });
    reset();
  };

  const socialLinks = [
    { href: '#', icon: Facebook, label: 'Facebook' },
    { href: '#', icon: Instagram, label: 'Instagram' },
    { href: '#', icon: Twitter, label: 'Twitter' },
  ];

  return (
    <footer className="bg-secondary text-secondary-foreground py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="flex flex-col items-center md:items-start"
          >
            <Link href="/" className="flex items-center gap-2 text-2xl font-headline font-bold mb-4">
              <CoffeeCupIcon className="h-8 w-8" />
              Espresso Edge
            </Link>
            <p className="text-sm text-center md:text-left">&copy; {new Date().getFullYear()} Espresso Edge. All rights reserved.</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-center md:text-left"
          >
            <h3 className="text-xl font-headline mb-3 flex items-center justify-center md:justify-start"><Clock className="mr-2 h-5 w-5" />Operating Hours</h3>
            <p className="text-sm">Mon - Fri: 7:00 AM - 7:00 PM</p>
            <p className="text-sm">Sat - Sun: 8:00 AM - 6:00 PM</p>
            <div className="flex justify-center md:justify-start space-x-4 mt-4">
              {socialLinks.map((link) => (
                <Link key={link.label} href={link.href} aria-label={link.label} target="_blank" rel="noopener noreferrer">
                  <motion.div whileHover={{ scale: 1.2, rotate: 5 }} whileTap={{ scale: 0.9 }}>
                    <link.icon className="h-6 w-6 hover:text-primary transition-colors" />
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-center md:text-left"
          >
            <h3 className="text-xl font-headline mb-3">Stay Updated</h3>
            <p className="text-sm mb-3">Sign up for our newsletter to get the latest news and offers.</p>
            <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-secondary-foreground text-secondary placeholder:text-muted-foreground border-border focus:ring-primary"
                {...register("email")}
                aria-invalid={errors.email ? "true" : "false"}
              />
              <Button type="submit" variant="default" size="icon" aria-label="Subscribe to newsletter">
                <Send className="h-5 w-5" />
              </Button>
            </form>
            {errors.email && <p className="text-sm text-destructive mt-1">{errors.email.message}</p>}
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
