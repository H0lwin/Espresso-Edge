
"use client";

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Coffee, CakeSlice, Sandwich, PlusCircle } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useToast } from "@/hooks/use-toast";
import type { MenuItem } from '@/app/menu/page'; // Ensure this path is correct

interface ProductCardProps extends MenuItem {} // Use MenuItem type and expect 'id'

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
    const itemToAdd = { id, name, price, imageSrc, quantity: 1, category };
    addItemToCart(itemToAdd);
    toast({
      title: "اضافه شد!",
      description: `${name} به سبد خرید شما اضافه شد.`,
    });
    openCart(); // Open cart drawer/modal
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
          fill // Changed from layout="fill" to fill
          style={{objectFit:"cover"}} // Changed from objectFit="cover" to style
          data-ai-hint={imageHint}
        />
      </div>
      <div className="p-6 flex flex-col flex-grow text-right"> {/* RTL: text-right */}
        <div className="flex justify-between items-start mb-2">
          <IconComponent className="h-6 w-6 text-primary flex-shrink-0 me-2 order-first" /> {/* RTL: me-2, order-first */}
          <h3 className="text-xl font-headline text-secondary order-last">{name}</h3> {/* RTL: order-last */}
        </div>
        <p className="text-sm text-muted-foreground mb-4 flex-grow">{description}</p>
        <div className="flex justify-between items-center mt-auto">
          <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground" onClick={handleAddToCart}>
            <PlusCircle className="ms-2 h-4 w-4" /> {/* RTL: ms-2 */}
            افزودن به سبد
          </Button>
          <p className="text-lg font-semibold text-primary">{price}</p>
        </div>
      </div>
    </motion.div>
  );
}
