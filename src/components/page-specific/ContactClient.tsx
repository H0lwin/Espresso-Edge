
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { ContactForm } from '@/components/sections/contact/ContactForm';
import { AnimatedPage } from '@/components/shared/AnimatedPage';
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ContactClient() {
  const contactDetails = [
    { icon: MapPin, text: 'خیابان قهوه ۱۲۳، برشته‌شهر، کالیفرنیا ۹۰۲۱۰', href: '#' },
    { icon: Phone, text: '۱۲۳۴-۵۶۷ (۵۵۵)', href: 'tel:5551234567' },
    { icon: Mail, text: 'hello@espressoedge.com', href: 'mailto:hello@espressoedge.com' },
  ];

  const socialLinks = [
    { href: '#', icon: Facebook, label: 'فیسبوک' },
    { href: '#', icon: Instagram, label: 'اینستاگرام' },
    { href: '#', icon: Twitter, label: 'توییتر' },
  ];

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };
  
  const itemVariants = {
    hidden: { opacity: 0, x: 20 }, // RTL: x:20 (from left)
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.1, duration: 0.4 },
    }),
  };

  return (
    <AnimatedPage>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <motion.div variants={sectionVariants} initial="hidden" animate="visible">
          <h1 className="text-4xl md:text-5xl font-headline text-center text-secondary mb-8">
            با ما در تماس باشید
          </h1>
          <p className="text-lg text-center text-muted-foreground max-w-2xl mx-auto mb-16">
            خوشحال می‌شویم از شما بشنویم! چه سوالی داشته باشید، چه بازخوردی، یا فقط بخواهید سلامی کنید، با ما تماس بگیرید.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-start">
          <motion.div 
            className="space-y-10 md:order-last" // RTL: Contact info on the left, form on the right
            variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount:0.3 }}
          >
            <div>
              <h2 className="text-2xl font-headline text-secondary mb-6 text-right">اطلاعات تماس</h2> {/* RTL: text-right */}
              <ul className="space-y-4">
                {contactDetails.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.li 
                      key={index} 
                      className="flex items-center text-muted-foreground text-right" // RTL: text-right
                      custom={index}
                      variants={itemVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      >
                      <Link href={item.href} className="hover:text-primary transition-colors flex-grow">{item.text}</Link>
                      <Icon className="h-6 w-6 text-primary ms-4 flex-shrink-0" /> {/* RTL: ms-4 */}
                    </motion.li>
                  );
                })}
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-headline text-secondary mb-6 text-right">ما را اینجا پیدا کنید</h2> {/* RTL: text-right */}
              <motion.div 
                className="rounded-lg overflow-hidden shadow-lg border border-border aspect-video"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <Image
                  src="https://placehold.co/600x400.png"
                  alt="نقشه نشان‌دهنده مکان کافی شاپ"
                  width={600}
                  height={400}
                  className="w-full h-full object-cover"
                  data-ai-hint="city map location"
                />
              </motion.div>
            </div>
            
            <div>
              <h2 className="text-2xl font-headline text-secondary mb-4 text-right">با ما در ارتباط باشید</h2> {/* RTL: text-right */}
              <div className="flex space-x-6 space-x-reverse justify-end"> {/* RTL: space-x-reverse, justify-end */}
                {socialLinks.map((link, index) => (
                  <motion.div
                    key={link.label}
                    custom={index}
                    variants={itemVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                  >
                    <Link href={link.href} aria-label={link.label} target="_blank" rel="noopener noreferrer">
                       <motion.div whileHover={{ scale: 1.2, y: -2 }} whileTap={{ scale: 0.9 }}>
                        <link.icon className="h-8 w-8 text-secondary hover:text-primary transition-colors" />
                      </motion.div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
          <motion.div
            className="bg-card p-8 rounded-lg shadow-xl border border-border md:order-first" // RTL: Form on the right
            variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount:0.3 }}
          >
            <h2 className="text-2xl font-headline text-secondary mb-6 text-right">برای ما پیام ارسال کنید</h2> {/* RTL: text-right */}
            <ContactForm />
          </motion.div>
        </div>
      </div>
    </AnimatedPage>
  );
}
