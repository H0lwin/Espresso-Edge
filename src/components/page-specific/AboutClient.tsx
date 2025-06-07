
"use client";

import Image from 'next/image';
import { AnimatedPage } from '@/components/shared/AnimatedPage';
import { motion } from 'framer-motion';
import { Users, Coffee, Milestone } from 'lucide-react';

export default function AboutClient() {
  const timelineEvents = [
    { year: '۱۳۹۹', title: 'شروع فروتنانه ما', description: 'اسپرسو اج از یک اشتیاق مشترک برای قهوه استثنایی و رویای ایجاد فضایی پذیرا برای جامعه ما متولد شد.', icon: Coffee },
    { year: '۱۴۰۰', title: 'رشد با هم', description: 'ما منوی خود را گسترش دادیم، بهترین دانه‌ها و مواد اولیه محلی را تهیه کردیم و به سرعت به یک مکان محبوب محلی تبدیل شدیم.', icon: Milestone },
    { year: '۱۴۰۲', title: 'مرکزی برای عاشقان قهوه', description: 'با شناخته شدن برای کیفیت و خدماتمان، به نوآوری ادامه دادیم و کارگاه‌ها و رویدادهای اجتماعی برگزار کردیم.', icon: Users },
    { year: 'امروز', title: 'دم کردن آینده', description: 'ما به هنر، مشتریان و جامعه خود متعهد باقی می‌مانیم و همیشه در تلاش برای تکمیل تجربه قهوه شما هستیم.', icon: Coffee },
  ];

  const teamMembers = [
    { id: 't1', name: 'آلیس در سرزمین عجایب', role: 'موسس و باریستای ارشد', imageSrc: 'https://placehold.co/300x300.png', imageHint: 'female barista smiling' },
    { id: 't2', name: 'باب معمار', role: 'مدیر عملیات', imageSrc: 'https://placehold.co/300x300.png', imageHint: 'male manager professional' },
    { id: 't3', name: 'چارلی براون', role: 'سرآشپز شیرینی‌پزی', imageSrc: 'https://placehold.co/300x300.png', imageHint: 'chef smiling pastry' },
  ];

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

  return (
    <AnimatedPage>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <motion.div variants={sectionVariants} initial="hidden" animate="visible">
          <h1 className="text-4xl md:text-5xl font-headline text-center text-secondary mb-8">
            داستان ما: دم کردن با اشتیاق
          </h1>
          <p className="text-lg text-center text-muted-foreground max-w-3xl mx-auto mb-16">
            در اسپرسو اج، ما معتقدیم که یک فنجان قهوه عالی می‌تواند روز شما را تغییر دهد. سفر ما با یک ایده ساده آغاز شد: ایجاد پناهگاهی که در آن کیفیت، جامعه و صنعتگری به هم می‌رسند.
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
            {timelineEvents.map((event, index) => {
              const Icon = event.icon;
              const isTextLeft = index % 2 === 0;
              return (
                <motion.div
                  key={event.year}
                  className="mb-10 md:mb-12 flex md:items-stretch w-full" // Use items-stretch for equal height
                  custom={index}
                  variants={itemVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  {/* Text Block */}
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
                  {/* Icon Centering Gizmo */}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {teamMembers.map((member, index) => (
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
                    src={member.imageSrc}
                    alt={member.name}
                    fill
                    style={{objectFit:"cover"}}
                    data-ai-hint={member.imageHint}
                  />
                </div>
                <h3 className="text-xl font-headline text-secondary">{member.name}</h3>
                <p className="text-primary font-medium">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </AnimatedPage>
  );
}
