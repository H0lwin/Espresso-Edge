"use client";

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Coffee, CakeSlice, Sandwich } from 'lucide-react'; // Example icons

interface ProductCardProps {
  name: string;
  description: string;
  price: string;
  imageSrc: string;
  imageHint: string;
  category: 'Coffee' | 'Pastries' | 'Snacks';
}

const categoryIcons = {
  Coffee: Coffee,
  Pastries: CakeSlice,
  Snacks: Sandwich,
};

export function ProductCard({ name, description, price, imageSrc, imageHint, category }: ProductCardProps) {
  const IconComponent = categoryIcons[category] || Coffee;

  return (
    <motion.div
      className="bg-card text-card-foreground rounded-lg shadow-lg overflow-hidden flex flex-col h-full border border-border"
      whileHover={{ y: -8, boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)" }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative w-full h-48 sm:h-56">
        <Image
          src={imageSrc}
          alt={name}
          layout="fill"
          objectFit="cover"
          data-ai-hint={imageHint}
        />
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-headline text-secondary">{name}</h3>
          <IconComponent className="h-6 w-6 text-primary flex-shrink-0 ml-2" />
        </div>
        <p className="text-sm text-muted-foreground mb-4 flex-grow">{description}</p>
        <div className="flex justify-between items-center mt-auto">
          <p className="text-lg font-semibold text-primary">{price}</p>
          <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
            Add to Order
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
