
"use client";

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Coffee, CakeSlice, Sandwich, PlusCircle } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useToast } from "@/hooks/use-toast";
import type { MenuItem } from '@/app/menu/page';

interface ProductCardProps extends MenuItem {}

const categoryIcons = {
  Coffee: Coffee,
  Pastries: CakeSlice,
  Snacks: Sandwich,
};

export function ProductCard({ id, name, description, price, imageSrc, imageHint, category }: ProductCardProps) {
  const IconComponent = categoryIcons[category] || Coffee;
  const { addItemToCart, openCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    const itemToAdd = { id, name, price, imageSrc, quantity: 1, category, description, imageHint };
    addItemToCart(itemToAdd);
    toast({
      title: "اضافه شد!",
      description: `«${name}» به سبد خرید شما اضافه شد.`,
    });
    openCart();
  };

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
          fill
          style={{objectFit:"cover"}}
          data-ai-hint={imageHint}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>
      <div className="p-6 flex flex-col flex-grow text-right">
        <div className="flex flex-row-reverse justify-start items-center mb-2 gap-2"> {/* Changed to flex-row-reverse and justify-start */}
          <IconComponent className="h-6 w-6 text-primary flex-shrink-0" /> {/* Icon will be on the left of its container (visually) */}
          <h3 className="text-xl font-headline text-secondary text-right flex-grow">{name}</h3> {/* Title on the right, takes space */}
        </div>
        <p className="text-sm text-muted-foreground mb-4 flex-grow">{description}</p>
        <div className="flex justify-between items-center mt-auto">
          <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground" onClick={handleAddToCart}>
            <PlusCircle className="ms-2 h-4 w-4" />
            افزودن به سبد
          </Button>
          <p className="text-lg font-semibold text-primary">{price}</p>
        </div>
      </div>
    </motion.div>
  );
}
