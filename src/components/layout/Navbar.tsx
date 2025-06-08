
"use client";

import Link from 'next/link';
import { Menu, X, User, LogOut, ShoppingCart as ShoppingCartIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { CoffeeCupIcon } from '@/components/shared/CoffeeCupIcon';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navItems = [
  { href: '/', label: 'خانه' },
  { href: '/menu', label: 'منو' },
  { href: '/about', label: 'درباره ما' },
  { href: '/contact', label: 'تماس با ما' },
];

export function Navbar() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const { user, logout } = useAuth();
  const { cartItems, toggleCart: openCartDrawer } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsSticky(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const totalCartItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <motion.header
      className={`fixed top-0 start-0 end-0 z-50 transition-all duration-300 ${
        isSticky ? 'bg-background/80 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 120, damping: 20 }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          
          {/* Actions: Cart, Auth, Mobile Menu Trigger - Visual Left */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Button variant="ghost" size="icon" onClick={openCartDrawer} className="relative">
              <ShoppingCartIcon className="h-6 w-6 text-secondary hover:text-primary transition-colors" />
              {mounted && totalCartItems > 0 && (
                <span className="absolute -top-1 -start-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalCartItems}
                </span>
              )}
              <span className="sr-only">سبد خرید</span>
            </Button>

            <div className="hidden md:flex items-center gap-3">
              {mounted && user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={user.avatarUrl || `https://placehold.co/100x100.png?text=${user.name?.charAt(0) || 'ک'}`} alt={user.name || "کاربر"} data-ai-hint="user avatar" />
                        <AvatarFallback>{user.name?.charAt(0).toUpperCase() || 'ک'}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 text-right">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">سلام، {user.name || 'کاربر گرامی'}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout}>
                      <LogOut className="ms-2 h-4 w-4" />
                      <span>خروج از حساب</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : mounted ? (
                <>
                  <Button asChild variant="ghost"><Link href="/auth/login">ورود</Link></Button>
                  <Button asChild><Link href="/auth/register">ثبت نام</Link></Button>
                </>
              ) : (
                 <div className="h-10 w-28" /> 
              )}
            </div>
            
            <div className="md:hidden">
              <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="باز کردن منو">
                    <Menu className="h-7 w-7 text-secondary" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[280px] bg-background p-6 flex flex-col">
                  <SheetHeader className="flex flex-row justify-end items-center mb-8 text-right pr-10">
                     <SheetTitle asChild>
                        <Link href="/" className="flex items-center gap-2 text-xl font-headline font-bold text-secondary mt-4" onClick={() => setIsSheetOpen(false)}>
                          <CoffeeCupIcon className="h-7 w-7" />
                          اسپرسو اج
                        </Link>
                      </SheetTitle>
                  </SheetHeader>
                  
                  <nav className="flex flex-col space-y-6 text-right mb-auto">
                    {navItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="text-xl font-medium text-secondary hover:text-primary transition-colors"
                        onClick={() => setIsSheetOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </nav>

                  <div className="mt-auto pt-6 border-t border-border">
                    {mounted && user ? (
                      <div className="flex flex-col space-y-3">
                        <span className="text-secondary font-medium text-center">سلام، {user.name || 'کاربر گرامی'}!</span>
                        <Button variant="outline" onClick={() => { logout(); setIsSheetOpen(false); }} className="w-full">خروج از حساب</Button>
                      </div>
                    ) : mounted ? (
                      <div className="flex flex-col space-y-3">
                        <Button asChild className="w-full" onClick={() => setIsSheetOpen(false)}><Link href="/auth/login">ورود</Link></Button>
                        <Button asChild variant="outline" className="w-full" onClick={() => setIsSheetOpen(false)}><Link href="/auth/register">ثبت نام</Link></Button>
                      </div>
                    ) : null}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Navigation Links - Centered */}
          <nav className="hidden md:flex flex-grow justify-center items-center mx-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-lg font-medium text-secondary hover:text-primary transition-colors mx-3"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          
          {/* Logo - Visual Right */}
          <div> 
            <Link href="/" className="flex items-center gap-2 text-2xl font-headline font-bold text-secondary hover:text-primary transition-colors">
              <CoffeeCupIcon className="h-8 w-8" />
              اسپرسو اج
            </Link>
          </div>

        </div>
      </div>
    </motion.header>
  );
}
