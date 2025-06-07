import type { Metadata } from 'next';
import { MenuClientContent } from '@/components/sections/menu/MenuClientContent';
import { AnimatedPage } from '@/components/shared/AnimatedPage';

export const metadata: Metadata = {
  title: 'Our Menu',
  description: 'Explore the delicious offerings at Espresso Edge. From signature coffees to delightful pastries and snacks.',
};

// Define product data structure
export type MenuItem = {
  id: string;
  name: string;
  category: 'Coffee' | 'Pastries' | 'Snacks';
  description: string;
  price: string;
  imageSrc: string;
  imageHint: string;
};

const menuItemsData: MenuItem[] = [
  // Coffee
  { id: 'c1', name: 'Classic Espresso', category: 'Coffee', description: 'A concentrated shot of rich, aromatic coffee.', price: '$3.00', imageSrc: 'https://placehold.co/400x300.png', imageHint: 'espresso shot' },
  { id: 'c2', name: 'Silky Latte', category: 'Coffee', description: 'Espresso with steamed milk and a thin layer of foam.', price: '$4.50', imageSrc: 'https://placehold.co/400x300.png', imageHint: 'latte coffee' },
  { id: 'c3', name: 'Frothy Cappuccino', category: 'Coffee', description: 'Equal parts espresso, steamed milk, and milk foam.', price: '$4.50', imageSrc: 'https://placehold.co/400x300.png', imageHint: 'cappuccino coffee' },
  { id: 'c4', name: 'Bold Americano', category: 'Coffee', description: 'Espresso shots diluted with hot water.', price: '$3.50', imageSrc: 'https://placehold.co/400x300.png', imageHint: 'americano coffee' },
  // Pastries
  { id: 'p1', name: 'Butter Croissant', category: 'Pastries', description: 'Flaky, golden, and irresistibly buttery.', price: '$3.50', imageSrc: 'https://placehold.co/400x300.png', imageHint: 'croissant pastry' },
  { id: 'p2', name: 'Blueberry Muffin', category: 'Pastries', description: 'Moist and bursting with fresh blueberries.', price: '$3.00', imageSrc: 'https://placehold.co/400x300.png', imageHint: 'blueberry muffin' },
  { id: 'p3', name: 'Chocolate Chip Scone', category: 'Pastries', description: 'A delightful scone packed with chocolate chips.', price: '$3.25', imageSrc: 'https://placehold.co/400x300.png', imageHint: 'chocolate scone' },
  { id: 'p4', name: 'Almond Danish', category: 'Pastries', description: 'Sweet pastry with an almond filling and glaze.', price: '$4.00', imageSrc: 'https://placehold.co/400x300.png', imageHint: 'almond danish' },
  // Snacks
  { id: 's1', name: 'Turkey Club Sandwich', category: 'Snacks', description: 'Classic club with turkey, bacon, lettuce, and tomato.', price: '$8.50', imageSrc: 'https://placehold.co/400x300.png', imageHint: 'club sandwich' },
  { id: 's2', name: 'Caprese Salad', category: 'Snacks', description: 'Fresh mozzarella, tomatoes, basil, and balsamic glaze.', price: '$7.00', imageSrc: 'https://placehold.co/400x300.png', imageHint: 'caprese salad' },
  { id: 's3', name: 'Spinach & Feta Quiche', category: 'Snacks', description: 'Savory quiche with spinach and feta cheese.', price: '$6.50', imageSrc: 'https://placehold.co/400x300.png', imageHint: 'quiche slice' },
];


export default function MenuPage() {
  return (
    <AnimatedPage>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 pt-28 md:pt-32"> {/* Added pt for navbar */}
        <h1 className="text-4xl md:text-5xl font-headline text-center text-secondary mb-12 md:mb-16">
          Our Delicious Menu
        </h1>
        <MenuClientContent initialItems={menuItemsData} />
      </div>
    </AnimatedPage>
  );
}
