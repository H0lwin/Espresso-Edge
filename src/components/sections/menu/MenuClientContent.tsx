
"use client";

import { useState, useMemo, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ProductCard } from './ProductCard';
import type { MenuItem, MenuItemCategory } from '@/app/menu/page';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Coffee, CakeSlice, Sandwich, GlassWater, Milk } from 'lucide-react';
import apiClient from '@/lib/apiClient';
import { useToast } from '@/hooks/use-toast';
import LoadingSpinner from '@/components/shared/LoadingSpinner';

interface MenuClientContentProps {
  initialItems: MenuItem[];
}

interface CategoryAPI {
  id: string | number;
  name: string;
  slug: string; // Assuming slug might be useful, though name is used for label
}

// Map API category names to MenuItemCategory type, if needed, or ensure consistency
const mapApiCategoryToMenuItemCategory = (apiCategoryName: string): MenuItemCategory => {
  // This mapping depends on how categories are named in your API vs. frontend types
  // For now, assuming they are directly compatible or you adjust this map
  const validCategories: MenuItemCategory[] = [
    'نوشیدنی‌های گرم',
    'نوشیدنی‌های سرد',
    'شیک و اسموتی',
    'کیک و دسر',
    'اسنک و میان‌وعده',
  ];
  if (validCategories.includes(apiCategoryName as MenuItemCategory)) {
    return apiCategoryName as MenuItemCategory;
  }
  console.warn(`Unknown category from API: ${apiCategoryName}. Defaulting or handle error.`);
  return 'نوشیدنی‌های گرم'; // Or a default/fallback category
};


export function MenuClientContent({ initialItems }: MenuClientContentProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<'All' | MenuItemCategory>('All');
  const [categories, setCategories] = useState<Array<{ value: 'All' | MenuItemCategory, label: string }>>([
    { value: 'All', label: 'همه' },
  ]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [categoryError, setCategoryError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoadingCategories(true);
      setCategoryError(null);
      try {
        const apiCategories = await apiClient<CategoryAPI[]>('/api/categories/');
        if (apiCategories && apiCategories.length > 0) {
          const formattedCategories = apiCategories.map(cat => ({
            value: mapApiCategoryToMenuItemCategory(cat.name), // Or just cat.name if type matches
            label: cat.name,
          }));
          setCategories([{ value: 'All', label: 'همه' }, ...formattedCategories]);
        } else {
          setCategories([{ value: 'All', label: 'همه' }]); // Keep 'All' even if no other categories
        }
      } catch (err: any) {
        console.error("Failed to fetch categories:", err);
        setCategoryError("خطا در بارگذاری دسته‌بندی‌ها.");
        // No toast here for 404 on categories, just error message
        if (!err.message || !err.message.includes("404")) {
          toast({
            title: "خطا",
            description: "امکان بارگذاری دسته‌بندی‌ها وجود نداشت. لطفاً بعداً دوباره تلاش کنید.",
            variant: "destructive",
          });
        }
      } finally {
        setIsLoadingCategories(false);
      }
    };
    fetchCategories();
  }, [toast]);


  const filteredItems = useMemo(() => {
    return (initialItems || []).filter(item => {
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
          {isLoadingCategories ? (
            <p className="text-muted-foreground">در حال بارگذاری دسته‌بندی‌ها...</p>
          ) : categoryError ? (
            <p className="text-destructive">{categoryError}</p>
          ) : (
            categories.map(category => (
              <Button
                key={category.value}
                variant={activeCategory === category.value ? 'default' : 'outline'}
                onClick={() => setActiveCategory(category.value)}
                className={`transition-all duration-200 ${activeCategory === category.value ? 'shadow-md' : 'hover:shadow-sm'}`}
              >
                {category.label}
              </Button>
            ))
          )}
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
          موردی با جستجو یا فیلتر شما مطابقت ندارد. لطفاً عبارت دیگری را امتحان کنید!
        </motion.p>
      )}
    </div>
  );
}
