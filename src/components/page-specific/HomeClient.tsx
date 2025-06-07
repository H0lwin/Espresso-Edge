
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/sections/menu/ProductCard'; // Assuming ProductCard can be reused
import { AnimatedPage } from '@/components/shared/AnimatedPage';
import { ArrowLeft } from 'lucide-react'; // For RTL "next" icon
import { motion } from 'framer-motion';

export default function HomeClient() {
  const featuredProducts = [
    { id: 'hc1', name: 'اسپرسو ویژه', description: 'غنی و پررنگ، یک کلاسیک واقعی برای شروع روز شما.', price: '۱۲۰،۰۰۰ تومان', imageSrc: 'https://placehold.co/400x300.png', imageHint: 'espresso coffee', category: 'Coffee' as const },
    { id: 'hc2', name: 'لاته هنری', description: 'اسپرسوی نرم با شیر کاملاً بخارپز شده و کمی هنر.', price: '۱۸۰،۰۰۰ تومان', imageSrc: 'https://placehold.co/400x300.png', imageHint: 'latte art', category: 'Coffee' as const },
    { id: 'hc3', name: 'کروسان تازه پخته شده', description: 'پفکی، کره‌ای و روزانه تازه پخته می‌شود. کاملاً با هر قهوه‌ای ست می‌شود.', price: '۹۰،۰۰۰ تومان', imageSrc: 'https://placehold.co/400x300.png', imageHint: 'croissant pastry', category: 'Pastries' as const },
  ];

  const heroVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { staggerChildren: 0.2, delayChildren: 0.3, duration: 0.5 }
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <AnimatedPage>
      {/* Hero Section */}
      <section className="relative h-[calc(100vh-5rem)] min-h-[600px] flex items-center justify-center text-center text-white overflow-hidden">
        <Image
          src="https://placehold.co/1920x1080.png"
          alt="فضای داخلی دنج کافی شاپ" // Comfortable coffee shop interior
          fill
          objectFit="cover"
          priority
          className="z-0"
          data-ai-hint="coffee shop interior"
        />
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        <motion.div 
          className="relative z-20 p-4 container mx-auto"
          variants={heroVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-headline mb-6 drop-shadow-lg">
            به اسپرسو اج خوش آمدید
          </motion.h1>
          <motion.p variants={itemVariants} className="text-xl md:text-2xl font-body mb-10 max-w-2xl mx-auto drop-shadow-md">
            دوز روزانه کمال شما، با اشتیاق ساخته شده.
          </motion.p>
          <motion.div variants={itemVariants}>
            <Button asChild size="lg" className="bg-primary hover:bg-opacity-80 text-primary-foreground text-lg px-8 py-6 rounded-md shadow-xl transition-transform duration-300 hover:scale-105">
              <Link href="/menu">
                مشاهده منوی ما <ArrowLeft className="ms-2 h-5 w-5" /> {/* RTL: ArrowLeft, ms-2 */}
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 
            className="text-4xl md:text-5xl font-headline text-center text-secondary mb-12 md:mb-16"
            initial={{ opacity: 0, y:20 }}
            whileInView={{ opacity: 1, y:0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            نوشیدنی‌های ویژه ما
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ProductCard
                  id={product.id} // Pass id for cart functionality
                  name={product.name}
                  description={product.description}
                  price={product.price}
                  imageSrc={product.imageSrc}
                  imageHint={product.imageHint}
                  category={product.category}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Parallax/Scroll-based Visual Element */}
      <section className="py-20 md:py-32 bg-secondary text-secondary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h3 className="text-3xl md:text-4xl font-headline mb-6">تفاوت را تجربه کنید</h3>
            <p className="text-lg md:text-xl font-body max-w-3xl mx-auto mb-8">
              در اسپرسو اج، ما چیزی بیشتر از یک کافی شاپ هستیم. ما یک مرکز اجتماعی هستیم که در آن دانه‌های با کیفیت، مهارت تخصصی و فضایی گرم گرد هم می‌آیند.
            </p>
            <Button asChild variant="outline" size="lg" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-secondary rounded-md shadow-lg transition-transform duration-300 hover:scale-105">
              <Link href="/about">
                داستان ما را بخوانید
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </AnimatedPage>
  );
}
