import type { Metadata } from 'next';
import Image from 'next/image';
import { AnimatedPage } from '@/components/shared/AnimatedPage';
import { motion } from 'framer-motion'; // Import motion for client components
import { Users, Coffee, Milestone } from 'lucide-react';

// Client component for sections requiring Framer Motion
function AboutClientContent() {
  const timelineEvents = [
    { year: '2020', title: 'Our Humble Beginnings', description: 'Espresso Edge was born from a shared passion for exceptional coffee and a dream to create a welcoming space for our community.', icon: Coffee },
    { year: '2021', title: 'Growing Together', description: 'We expanded our menu, sourcing the finest beans and local ingredients, quickly becoming a beloved local spot.', icon: Milestone },
    { year: '2023', title: 'A Hub for Coffee Lovers', description: 'Recognized for our quality and service, we continued to innovate, hosting workshops and community events.', icon: Users },
    { year: 'Today', title: 'Brewing the Future', description: 'We remain committed to our craft, our customers, and our community, always striving to perfect your coffee experience.', icon: Coffee },
  ];

  const teamMembers = [
    { id: '1', name: 'Alice Wonderland', role: 'Founder & Head Barista', imageSrc: 'https://placehold.co/300x300.png', imageHint: 'female barista smiling' },
    { id: '2', name: 'Bob The Builder', role: 'Operations Manager', imageSrc: 'https://placehold.co/300x300.png', imageHint: 'male manager professional' },
    { id: '3', name: 'Charlie Brown', role: 'Pastry Chef', imageSrc: 'https://placehold.co/300x300.png', imageHint: 'chef smiling pastry' },
  ];

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -30 },
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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 pt-28 md:pt-32"> {/* Added pt for navbar */}
        <motion.div variants={sectionVariants} initial="hidden" animate="visible">
          <h1 className="text-4xl md:text-5xl font-headline text-center text-secondary mb-8">
            Our Story: Brewing with Passion
          </h1>
          <p className="text-lg text-center text-muted-foreground max-w-3xl mx-auto mb-16">
            At Espresso Edge, we believe that a great cup of coffee can change your day. Our journey started with a simple idea: to create a haven where quality, community, and craftsmanship meet.
          </p>
        </motion.div>

        {/* Timeline Section */}
        <motion.section 
          className="mb-16 md:mb-24"
          variants={sectionVariants} 
          initial="hidden" 
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <h2 className="text-3xl md:text-4xl font-headline text-center text-secondary mb-12">Our Journey</h2>
          <div className="relative max-w-3xl mx-auto">
            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-primary/30 rounded-full transform -translate-x-1/2 hidden md:block"></div>
            {timelineEvents.map((event, index) => {
              const Icon = event.icon;
              return (
                <motion.div
                  key={event.year}
                  className="mb-10 md:mb-12 flex md:items-center w-full"
                  custom={index}
                  variants={itemVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <div className={`w-full md:w-1/2 ${index % 2 === 0 ? 'md:pr-8 md:text-right' : 'md:pl-8 md:text-left md:order-2'}`}>
                    <div className="bg-card p-6 rounded-lg shadow-lg border border-border">
                      <div className="flex items-center mb-2">
                        {index % 2 !== 0 && <Icon className="h-6 w-6 text-primary mr-3 md:hidden" />}
                        <h3 className="text-xl font-headline text-primary">{event.year} - {event.title}</h3>
                        {index % 2 === 0 && <Icon className="h-6 w-6 text-primary ml-3 md:hidden" />}
                      </div>
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                    </div>
                  </div>
                  <div className="hidden md:flex w-1/2 items-center justify-center md:order-1">
                    <div className="absolute left-1/2 transform -translate-x-1/2 z-10 bg-background p-2 rounded-full border-2 border-primary">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* Team Section */}
        <motion.section
          variants={sectionVariants} 
          initial="hidden" 
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <h2 className="text-3xl md:text-4xl font-headline text-center text-secondary mb-12">Meet Our Team</h2>
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
                    layout="fill"
                    objectFit="cover"
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

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about the story, passion, and team behind Espresso Edge.',
};

export default function AboutPage() {
  return <AboutClientContent />;
}
