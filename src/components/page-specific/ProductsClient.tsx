
"use client";

import { ProductCard } from '@/components/sections/menu/ProductCard';
import { AnimatedPage } from '@/components/shared/AnimatedPage';
import type { MenuItem } from '@/app/menu/page';
import { motion } from 'framer-motion';

interface ProductsClientProps {
  products: MenuItem[];
}

export default function ProductsClient({ products }: ProductsClientProps) {
  const cardVariants = {
    initial: { opacity: 0, y: 20, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -20, scale: 0.95 },
  };
  
  return (
    <AnimatedPage>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <motion.h1 
          className="text-4xl md:text-5xl font-headline text-center text-secondary mb-12 md:mb-16"
          initial={{ opacity: 0, y:20 }}
          animate={{ opacity: 1, y:0 }}
          transition={{ duration: 0.5 }}
        >
          محصولات ویژه ما
        </motion.h1>
        
        {products.length > 0 ? (
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10"
          >
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                layout
                variants={cardVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <ProductCard {...product} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.p 
            className="text-center text-muted-foreground text-lg py-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            در حال حاضر محصولی برای نمایش وجود ندارد. لطفاً بعداً دوباره بررسی کنید!
          </motion.p>
        )}
      </div>
    </AnimatedPage>
  );
}
