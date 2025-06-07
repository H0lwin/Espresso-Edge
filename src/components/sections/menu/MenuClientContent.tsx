
"use client";

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ProductCard } from './ProductCard';
import type { MenuItem } from '@/app/menu/page';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface MenuClientContentProps {
  initialItems: MenuItem[];
}

const categoriesData: Array<{ value: 'All' | MenuItem['category'], label: string }> = [
  { value: 'All', label: 'همه' },
  { value: 'Coffee', label: 'قهوه' },
  { value: 'Pastries', label: 'شیرینی‌ها' },
  { value: 'Snacks', label: 'میان‌وعده‌ها' },
];

export function MenuClientContent({ initialItems }: MenuClientContentProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<'All' | MenuItem['category']>('All');

  const filteredItems = useMemo(() => {
    return initialItems.filter(item => {
      const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            item.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [initialItems, searchTerm, activeCategory]);

  const cardVariants = {
    initial: { opacity: 0, y: 20, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -20, scale: 0.95 },
  };

  return (
    <div>
      <div className="mb-10 md:mb-12 flex flex-col sm:flex-row-reverse justify-between items-center gap-6">
        <div className="relative w-full sm:w-auto min-w-[250px]">
          <Input
            type="text"
            placeholder="جستجوی آیتم‌های منو..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="ps-10 pe-4 py-2 border-border focus:ring-primary text-right"
            aria-label="جستجوی آیتم‌های منو"
          />
          <Search className="absolute end-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        </div>
        <div className="flex flex-wrap justify-center sm:justify-start gap-3">
          {categoriesData.map(category => (
            <Button
              key={category.value}
              variant={activeCategory === category.value ? 'default' : 'outline'}
              onClick={() => setActiveCategory(category.value)}
              className={`transition-all duration-200 ${activeCategory === category.value ? 'shadow-md' : 'hover:shadow-sm'}`}
            >
              {category.label}
            </Button>
          ))}
        </div>
      </div>

      {filteredItems.length > 0 ? (
        <ScrollArea className="h-[calc(100vh-26rem)] sm:h-[calc(100vh-22rem)]"> {/* Adjust height as needed, added different height for sm screens */}
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10 p-1" // Added p-1 for scrollbar clearance
          >
            <AnimatePresence>
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  layout
                  variants={cardVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <ProductCard {...item} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </ScrollArea>
      ) : (
        <motion.p 
          className="text-center text-muted-foreground text-lg py-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          موردی با جستجو یا فیلتر شما مطابقت ندارد. لطفاً عبارت دیگری را امتحان کنید!
        </motion.p>
      )}
    </div>
  );
}
