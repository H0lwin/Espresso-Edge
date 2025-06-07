
"use client";

import { MenuClientContent } from '@/components/sections/menu/MenuClientContent';
import { AnimatedPage } from '@/components/shared/AnimatedPage';
import type { MenuItem } from '@/app/menu/page';

interface MenuClientProps {
  menuItems: MenuItem[];
}

export default function MenuClient({ menuItems }: MenuClientProps) {
  return (
    <AnimatedPage>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <h1 className="text-4xl md:text-5xl font-headline text-center text-secondary mb-12 md:mb-16">
          منوی خوشمزه ما
        </h1>
        <MenuClientContent initialItems={menuItems} />
      </div>
    </AnimatedPage>
  );
}
