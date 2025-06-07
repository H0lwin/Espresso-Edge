"use client";

import { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ProductCard } from './ProductCard';
import type { MenuItem } from '@/app/menu/page'; // Import type from page.tsx
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';

interface MenuClientContentProps {
  initialItems: MenuItem[];
}

const categories: Array<'All' | MenuItem['category']> = ['All', 'Coffee', 'Pastries', 'Snacks'];

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
      <div className="mb-10 md:mb-12 flex flex-col sm:flex-row justify-between items-center gap-6">
        <div className="flex flex-wrap justify-center sm:justify-start gap-3">
          {categories.map(category => (
            <Button
              key={category}
              variant={activeCategory === category ? 'default' : 'outline'}
              onClick={() => setActiveCategory(category)}
              className={`transition-all duration-200 ${activeCategory === category ? 'shadow-md' : 'hover:shadow-sm'}`}
            >
              {category}
            </Button>
          ))}
        </div>
        <div className="relative w-full sm:w-auto min-w-[250px]">
          <Input
            type="text"
            placeholder="Search menu items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border-border focus:ring-primary"
            aria-label="Search menu items"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        </div>
      </div>

      {filteredItems.length > 0 ? (
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10"
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
      ) : (
        <motion.p 
          className="text-center text-muted-foreground text-lg py-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          No items match your search or filter. Try something else!
        </motion.p>
      )}
    </div>
  );
}
