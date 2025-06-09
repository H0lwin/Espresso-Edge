
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { ContactForm } from '@/components/sections/contact/ContactForm';
import { AnimatedPage } from '@/components/shared/AnimatedPage';
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter, LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import apiClient from '@/lib/apiClient';
import { useToast } from '@/hooks/use-toast';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

type ContactDetailAPI = {
  id: string;
  iconName: 'MapPin' | 'Phone' | 'Mail';
  text: string;
  href?: string;
};

type SocialLinkAPI = {
  id: string;
  platform: 'Facebook' | 'Instagram' | 'Twitter';
  url: string;
};

interface ContactPageContentAPI {
  introText: string;
  contactDetails: ContactDetailAPI[];
  mapEmbedUrl?: string; // Option 1: Embed URL
  mapImageUrl?: string;  // Option 2: Static Image URL
  mapImageHint?: string; // AI hint for static map image
  socialLinks: SocialLinkAPI[];
}

const detailIconMap: Record<string, LucideIcon> = {
  MapPin: MapPin,
  Phone: Phone,
  Mail: Mail,
};

const socialIconMap: Record<string, LucideIcon> = {
  Facebook: Facebook,
  Instagram: Instagram,
  Twitter: Twitter,
};


export default function ContactClient() {
  const [content, setContent] = useState<ContactPageContentAPI | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchContactContent = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await apiClient<ContactPageContentAPI>('/api/content/contact-info/');
        setContent(data);
      } catch (err: any) {
        console.error("Failed to fetch contact page content:", err);
         if (err.message && err.message.includes("404")) {
          setError("محتوای صفحه تماس با ما یافت نشد.");
        } else {
          setError("خطا در بارگذاری محتوای صفحه.");
          toast({
            title: "خطا",
            description: "امکان بارگذاری محتوای صفحه تماس با ما وجود نداشت.",
            variant: "destructive",
          });
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchContactContent();
  }, [toast]);


  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };
  
  const itemVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.1, duration: 0.4 },
    }),
  };

  if (isLoading) {
    return (
      <AnimatedPage>
        <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
          <LoadingSpinner />
        </div>
      </AnimatedPage>
    );
  }

  if (error || !content) {
    return (
      <AnimatedPage>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
          <p className="text-destructive text-xl">{error || "محتوایی برای نمایش یافت نشد."}</p>
        </div>
      </AnimatedPage>
    );
  }


  return (
    <AnimatedPage>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <motion.div variants={sectionVariants} initial="hidden" animate="visible">
          <h1 className="text-4xl md:text-5xl font-headline text-center text-secondary mb-8">
            با ما در تماس باشید
          </h1>
          <p className="text-lg text-center text-muted-foreground max-w-2xl mx-auto mb-16">
            {content.introText || "خوشحال می‌شویم از شما بشنویم! چه سوالی داشته باشید، چه بازخوردی، یا فقط بخواهید سلامی کنید، با ما تماس بگیرید."}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-start">
          <motion.div 
            className="space-y-10 md:order-last" 
            variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount:0.3 }}
          >
            <div>
              <h2 className="text-2xl font-headline text-secondary mb-6 text-right">اطلاعات تماس</h2>
              <ul className="space-y-4">
                {content.contactDetails.map((item, index) => {
                  const Icon = detailIconMap[item.iconName] || MapPin;
                  const DetailLink = item.href ? Link : 'span';
                  return (
                    <motion.li 
                      key={item.id} 
                      className="flex items-center text-muted-foreground text-right"
                      custom={index}
                      variants={itemVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      >
                      <DetailLink href={item.href || '#'} className={`${item.href ? 'hover:text-primary transition-colors' : ''} flex-grow`}>{item.text}</DetailLink>
                      <Icon className="h-6 w-6 text-primary ms-4 flex-shrink-0" />
                    </motion.li>
                  );
                })}
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-headline text-secondary mb-6 text-right">ما را اینجا پیدا کنید</h2>
              <motion.div 
                className="rounded-lg overflow-hidden shadow-lg border border-border aspect-video"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                {content.mapEmbedUrl ? (
                   <iframe
                    src={content.mapEmbedUrl}
                    width="100%"
                    height="100%"
                    style={{ border:0 }}
                    allowFullScreen={false}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="مکان کافی شاپ"
                  ></iframe>
                ) : content.mapImageUrl ? (
                  <Image
                    src={content.mapImageUrl}
                    alt="نقشه نشان‌دهنده مکان کافی شاپ"
                    width={600}
                    height={400}
                    className="w-full h-full object-cover"
                    data-ai-hint={content.mapImageHint || "city map location"}
                  />
                ) : (
                  <Image
                    src="https://placehold.co/600x400.png" // Fallback placeholder
                    alt="نقشه نشان‌دهنده مکان کافی شاپ"
                    width={600}
                    height={400}
                    className="w-full h-full object-cover"
                    data-ai-hint="city map location"
                  />
                )}
              </motion.div>
            </div>
            
            <div>
              <h2 className="text-2xl font-headline text-secondary mb-4 text-right">با ما در ارتباط باشید</h2>
              {content.socialLinks.length > 0 ? (
                <div className="flex space-x-6 space-x-reverse justify-end">
                  {content.socialLinks.map((linkItem, index) => {
                    const SocialIcon = socialIconMap[linkItem.platform] || Facebook; // Default to Facebook
                    return (
                      <motion.div
                        key={linkItem.id}
                        custom={index}
                        variants={itemVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                      >
                        <Link href={linkItem.url} aria-label={linkItem.platform} target="_blank" rel="noopener noreferrer">
                          <motion.div whileHover={{ scale: 1.2, y: -2 }} whileTap={{ scale: 0.9 }}>
                            <SocialIcon className="h-8 w-8 text-secondary hover:text-primary transition-colors" />
                          </motion.div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-right text-muted-foreground">لینک‌های اجتماعی به زودی اضافه خواهند شد.</p>
              )}
            </div>
          </motion.div>
          <motion.div
            className="bg-card p-8 rounded-lg shadow-xl border border-border md:order-first"
            variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount:0.3 }}
          >
            <h2 className="text-2xl font-headline text-secondary mb-6 text-right">برای ما پیام ارسال کنید</h2>
            <ContactForm />
          </motion.div>
        </div>
      </div>
    </AnimatedPage>
  );
}
