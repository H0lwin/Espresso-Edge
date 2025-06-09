
"use client";

import Image from 'next/image';
import { AnimatedPage } from '@/components/shared/AnimatedPage';
import { motion } from 'framer-motion';
import { Users, Coffee, Milestone, LucideIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import apiClient from '@/lib/apiClient';
import { useToast } from '@/hooks/use-toast';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

type TimelineEventAPI = {
  year: string;
  title: string;
  description: string;
  iconName: 'Coffee' | 'Milestone' | 'Users'; // Names matching Lucide icons
};

type TeamMemberAPI = {
  id: string;
  name: string;
  role: string;
  imageSrc: string;
  imageHint: string;
};

interface AboutPageContentAPI {
  introText: string;
  timelineEvents: TimelineEventAPI[];
  teamMembers: TeamMemberAPI[];
}

const iconMap: Record<string, LucideIcon> = {
  Coffee: Coffee,
  Milestone: Milestone,
  Users: Users,
};

export default function AboutClient() {
  const [content, setContent] = useState<AboutPageContentAPI | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAboutContent = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await apiClient<AboutPageContentAPI>('/api/content/about/');
        setContent(data);
      } catch (err: any) {
        console.error("Failed to fetch about page content:", err);
        if (err.message && err.message.includes("404")) {
          setError("محتوای صفحه درباره ما یافت نشد.");
        } else {
          setError("خطا در بارگذاری محتوای صفحه.");
          toast({
            title: "خطا",
            description: "امکان بارگذاری محتوای صفحه درباره ما وجود نداشت.",
            variant: "destructive",
          });
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchAboutContent();
  }, [toast]);

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 30 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.5,
      },
    }),
  };
  
  const teamCardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: i * 0.15,
        duration: 0.4,
      },
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
            داستان ما: دم کردن با اشتیاق
          </h1>
          <p className="text-lg text-center text-muted-foreground max-w-3xl mx-auto mb-16">
            {content.introText || "در اسپرسو اج، ما معتقدیم که یک فنجان قهوه عالی می‌تواند روز شما را تغییر دهد. سفر ما با یک ایده ساده آغاز شد: ایجاد پناهگاهی که در آن کیفیت، جامعه و صنعتگری به هم می‌رسند."}
          </p>
        </motion.div>

        <motion.section 
          className="mb-16 md:mb-24"
          variants={sectionVariants} 
          initial="hidden" 
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <h2 className="text-3xl md:text-4xl font-headline text-center text-secondary mb-12">سفر ما</h2>
          <div className="relative max-w-3xl mx-auto">
            <div className="absolute end-1/2 top-0 bottom-0 w-1 bg-primary/30 rounded-full transform translate-x-1/2 hidden md:block"></div>
            {content.timelineEvents.map((event, index) => {
              const Icon = iconMap[event.iconName] || Coffee; // Default to Coffee if iconName is invalid
              const isTextLeft = index % 2 === 0;
              return (
                <motion.div
                  key={event.year + event.title} // Ensure unique key
                  className="mb-10 md:mb-12 flex md:items-stretch w-full" 
                  custom={index}
                  variants={itemVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <div 
                    className={`w-full md:w-1/2 flex flex-col justify-center ${isTextLeft ? 'md:ps-8 md:text-left md:order-1' : 'md:pe-8 md:text-right md:order-2'}`}
                  >
                    <div className="bg-card p-6 rounded-lg shadow-lg border border-border">
                      <div className={`flex items-center mb-2 ${isTextLeft ? 'md:justify-start' : 'md:justify-end'}`}>
                        {!isTextLeft && <Icon className="h-6 w-6 text-primary me-3 md:hidden" />}
                        <h3 className="text-xl font-headline text-primary">{event.year} - {event.title}</h3>
                        {isTextLeft && <Icon className="h-6 w-6 text-primary ms-3 md:hidden" />}
                      </div>
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                    </div>
                  </div>
                  <div 
                    className={`hidden md:flex w-1/2 items-center justify-center relative ${isTextLeft ? 'md:order-2' : 'md:order-1'}`}
                  >
                    <div className="absolute end-1/2 transform translate-x-1/2 z-10 bg-background p-2 rounded-full border-2 border-primary">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        <motion.section
          variants={sectionVariants} 
          initial="hidden" 
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <h2 className="text-3xl md:text-4xl font-headline text-center text-secondary mb-12">تیم ما را ملاقات کنید</h2>
          {content.teamMembers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
              {content.teamMembers.map((member, index) => (
                <motion.div
                  key={member.id}
                  className="bg-card text-card-foreground rounded-lg shadow-lg p-6 text-center border border-border"
                  custom={index}
                  variants={teamCardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden mb-4 ring-2 ring-primary ring-offset-2 ring-offset-background">
                    <Image
                      src={member.imageSrc || 'https://placehold.co/300x300.png'}
                      alt={member.name}
                      fill
                      style={{objectFit:"cover"}}
                      data-ai-hint={member.imageHint || 'team member photo'}
                    />
                  </div>
                  <h3 className="text-xl font-headline text-secondary">{member.name}</h3>
                  <p className="text-primary font-medium">{member.role}</p>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">اطلاعات تیم در حال حاضر موجود نیست.</p>
          )}
        </motion.section>
      </div>
    </AnimatedPage>
  );
}
