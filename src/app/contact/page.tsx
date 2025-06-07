import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ContactForm } from '@/components/sections/contact/ContactForm';
import { AnimatedPage } from '@/components/shared/AnimatedPage';
import { MapPin, Phone, Mail, Facebook, Instagram, Twitter } from 'lucide-react';
import { motion } from 'framer-motion'; // Import motion for client components

// Client component for sections requiring Framer Motion
function ContactClientContent() {
  const contactDetails = [
    { icon: MapPin, text: '123 Coffee Lane, Brewville, CA 90210', href: '#' },
    { icon: Phone, text: '(555) 123-4567', href: 'tel:5551234567' },
    { icon: Mail, text: 'hello@espressoedge.com', href: 'mailto:hello@espressoedge.com' },
  ];

  const socialLinks = [
    { href: '#', icon: Facebook, label: 'Facebook' },
    { href: '#', icon: Instagram, label: 'Instagram' },
    { href: '#', icon: Twitter, label: 'Twitter' },
  ];

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };
  
  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.1, duration: 0.4 },
    }),
  };

  return (
    <AnimatedPage>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 pt-28 md:pt-32"> {/* Added pt for navbar */}
        <motion.div variants={sectionVariants} initial="hidden" animate="visible">
          <h1 className="text-4xl md:text-5xl font-headline text-center text-secondary mb-8">
            Get In Touch
          </h1>
          <p className="text-lg text-center text-muted-foreground max-w-2xl mx-auto mb-16">
            We'd love to hear from you! Whether you have a question, feedback, or just want to say hi, feel free to reach out.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-start">
          <motion.div
            className="bg-card p-8 rounded-lg shadow-xl border border-border"
            variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount:0.3 }}
          >
            <h2 className="text-2xl font-headline text-secondary mb-6">Send Us a Message</h2>
            <ContactForm />
          </motion.div>

          <motion.div 
            className="space-y-10"
            variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount:0.3 }}
          >
            <div>
              <h2 className="text-2xl font-headline text-secondary mb-6">Contact Information</h2>
              <ul className="space-y-4">
                {contactDetails.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.li 
                      key={index} 
                      className="flex items-center text-muted-foreground"
                      custom={index}
                      variants={itemVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      >
                      <Icon className="h-6 w-6 text-primary mr-4 flex-shrink-0" />
                      <Link href={item.href} className="hover:text-primary transition-colors">{item.text}</Link>
                    </motion.li>
                  );
                })}
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-headline text-secondary mb-6">Find Us Here</h2>
              <motion.div 
                className="rounded-lg overflow-hidden shadow-lg border border-border aspect-video"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <Image
                  src="https://placehold.co/600x400.png"
                  alt="Map showing coffee shop location"
                  width={600}
                  height={400}
                  className="w-full h-full object-cover"
                  data-ai-hint="city map location"
                />
              </motion.div>
            </div>
            
            <div>
              <h2 className="text-2xl font-headline text-secondary mb-4">Connect With Us</h2>
              <div className="flex space-x-6">
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
        </div>
      </div>
    </AnimatedPage>
  );
}

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with Espresso Edge. Find our location, contact details, or send us a message.',
};

export default function ContactPage() {
  return <ContactClientContent />;
}
