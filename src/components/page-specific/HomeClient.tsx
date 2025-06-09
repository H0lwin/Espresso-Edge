
"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/sections/menu/ProductCard';
import { AnimatedPage } from '@/components/shared/AnimatedPage';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import type { MenuItem } from '@/app/menu/page';
import { useEffect, useState } from 'react';
import apiClient from '@/lib/apiClient';
import LoadingSpinner from '@/components/shared/LoadingSpinner';
import { useToast } from '@/hooks/use-toast';

interface HeroContentAPI {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  imageSrc: string;
  imageHint: string;
}

interface ExperienceContentAPI {
  title: string;
  text: string;
  ctaText: string;
  ctaLink: string;
}

interface HomePageContentAPI {
  hero: HeroContentAPI;
  featuredProducts: MenuItem[];
  experienceSection: ExperienceContentAPI;
}

const defaultHeroContent: HeroContentAPI = {
  title: 'به اسپرسو اج خوش آمدید',
  subtitle: 'دوز روزانه کمال شما، با اشتیاق ساخته شده.',
  ctaText: 'مشاهده منوی ما',
  ctaLink: '/menu',
  imageSrc: 'https://placehold.co/1920x1080.png',
  imageHint: 'coffee shop interior',
};

const defaultExperienceContent: ExperienceContentAPI = {
  title: 'تفاوت را تجربه کنید',
  text: 'در اسپرسو اج، ما چیزی بیشتر از یک کافی شاپ هستیم. ما یک مرکز اجتماعی هستیم که در آن دانه‌های با کیفیت، مهارت تخصصی و فضایی گرم گرد هم می‌آیند.',
  ctaText: 'داستان ما را بخوانید',
  ctaLink: '/about',
};


export default function HomeClient() {
  const [pageContent, setPageContent] = useState<HomePageContentAPI | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchHomePageContent = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await apiClient<HomePageContentAPI>('/api/content/homepage/');
        setPageContent(data);
      } catch (err: any) {
        console.error("Failed to fetch homepage content:", err);
        if (err.message && err.message.includes("404")) {
          setError("محتوای صفحه اصلی یافت نشد. از مقادیر پیش‌فرض استفاده می‌شود.");
          // Use default content if API returns 404, but don't toast
          setPageContent({ 
            hero: defaultHeroContent, 
            featuredProducts: [], 
            experienceSection: defaultExperienceContent 
          });
        } else {
          setError("خطا در بارگذاری محتوای صفحه اصلی.");
          toast({
            title: "خطا",
            description: "امکان بارگذاری محتوای صفحه اصلی وجود نداشت. لطفاً بعداً دوباره تلاش کنید.",
            variant: "destructive",
          });
          setPageContent({ 
            hero: defaultHeroContent, 
            featuredProducts: [], 
            experienceSection: defaultExperienceContent 
          });
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchHomePageContent();
  }, [toast]);


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
  
  const heroData = pageContent?.hero || defaultHeroContent;
  const featuredProductsData = pageContent?.featuredProducts || [];
  const experienceData = pageContent?.experienceSection || defaultExperienceContent;


  if (isLoading) {
    return (
      <AnimatedPage>
        <div className="flex items-center justify-center min-h-[calc(100vh-5rem)]">
          <LoadingSpinner />
        </div>
      </AnimatedPage>
    );
  }


  return (
    <AnimatedPage>
      {/* Hero Section */}
      <section className="relative h-[calc(100vh-5rem)] min-h-[600px] flex items-center justify-center text-center text-white overflow-hidden">
        <Image
          src={heroData.imageSrc}
          alt={heroData.imageHint || "فضای داخلی دنج کافی شاپ"}
          fill
          style={{objectFit:"cover"}}
          priority
          sizes="100vw"
          className="z-0"
          data-ai-hint={heroData.imageHint}
        />
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        <motion.div
          className="relative z-20 p-4 container mx-auto"
          variants={heroVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-headline mb-6 drop-shadow-lg">
            {heroData.title}
          </motion.h1>
          <motion.p variants={itemVariants} className="text-xl md:text-2xl font-body mb-10 max-w-2xl mx-auto drop-shadow-md">
            {heroData.subtitle}
          </motion.p>
          <motion.div variants={itemVariants}>
            <Button asChild size="lg" className="bg-secondary hover:bg-secondary/80 text-secondary-foreground text-lg px-8 py-6 rounded-md shadow-xl transition-transform duration-300 hover:scale-105">
              <Link href={heroData.ctaLink}>
                {heroData.ctaText} <ArrowLeft className="ms-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            className="text-4xl md:text-5xl font-headline text-center text-primary mb-12 md:mb-16"
            initial={{ opacity: 0, y:20 }}
            whileInView={{ opacity: 1, y:0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            نوشیدنی‌های ویژه ما
          </motion.h2>
          {/* Error message for general loading failure, specific 404 handled by showing no products */}
          {error && !error.includes("یافت نشد") && <p className="text-center text-destructive mb-4">{error}</p>}
          
          {featuredProductsData.length === 0 && !isLoading && (
            <p className="text-center text-muted-foreground">محصول ویژه‌ای برای نمایش وجود ندارد.</p>
          )}
          {featuredProductsData.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
              {featuredProductsData.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <ProductCard
                    id={product.id}
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
          )}
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
            <h3 className="text-3xl md:text-4xl font-headline mb-6">{experienceData.title}</h3>
            <p className="text-lg md:text-xl font-body max-w-3xl mx-auto mb-8">
              {experienceData.text}
            </p>
            <Button asChild variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground rounded-md shadow-lg transition-transform duration-300 hover:scale-105">
              <Link href={experienceData.ctaLink}>
                {experienceData.ctaText}
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </AnimatedPage>
  );
}
