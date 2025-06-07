
"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetClose } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { MinusCircle, PlusCircle, Trash2, X, ShoppingBag } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export function ShoppingCart() {
  const { cartItems, isCartOpen, toggleCart, updateItemQuantity, removeItemFromCart, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleCheckout = () => {
    if (!user) {
      toast({
        title: "ورود لازم است",
        description: "لطفاً برای ادامه خرید وارد شوید یا ثبت نام کنید.",
        variant: "destructive",
      });
      // Redirect to login, saving current cart page as redirect target
      const currentPath = '/cart'; // Or dynamically get current path if cart is part of other pages
      router.push(`/auth/login?redirect=${encodeURIComponent(currentPath)}`);
      toggleCart(); // Close cart
    } else {
      router.push('/checkout');
      toggleCart(); // Close cart
    }
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={toggleCart}>
      <SheetContent className="flex flex-col w-full sm:max-w-md text-right" side="left"> {/* RTL: side="left" */}
        <SheetHeader className="text-right border-b pb-4"> {/* RTL: text-right */}
          <SheetTitle>سبد خرید شما</SheetTitle>
          {/* The default SheetClose from SheetContent will be used. If a custom one is needed in header, place it here as a sibling to SheetTitle */}
        </SheetHeader>
        
        {cartItems.length === 0 ? (
          <div className="flex-grow flex flex-col items-center justify-center text-center">
            <ShoppingBag className="h-20 w-20 text-muted-foreground mb-4" />
            <p className="text-xl font-semibold text-muted-foreground">سبد خرید شما خالی است.</p>
            <p className="text-sm text-muted-foreground mt-2">به نظر می‌رسد هنوز چیزی اضافه نکرده‌اید.</p>
            <Button asChild className="mt-6" onClick={toggleCart}>
              <Link href="/menu">شروع خرید</Link>
            </Button>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-grow my-4">
              <div className="space-y-4 pe-2"> {/* RTL: pe-2 for scrollbar */}
                {cartItems.map(item => (
                  <div key={item.id} className="flex items-center gap-4 p-2 border rounded-md">
                    <Image 
                      src={item.imageSrc} 
                      alt={item.name} 
                      width={64} 
                      height={64} 
                      className="rounded-md object-cover h-16 w-16"
                      data-ai-hint={item.imageHint || 'product image'}
                    />
                    <div className="flex-grow">
                      <h4 className="font-semibold">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">{item.price}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => updateItemQuantity(item.id, item.quantity - 1)}>
                          <MinusCircle className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => updateItemQuantity(item.id, item.quantity + 1)}>
                          <PlusCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => removeItemFromCart(item.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <Separator />
            <div className="py-4 space-y-3">
              <div className="flex items-center justify-between font-semibold">
                <span>مجموع:</span>
                <span>{getCartTotal()}</span>
              </div>
              <div className="flex gap-2 items-center">
                <Input type="text" placeholder="کد تخفیف" className="text-right" />
                <Button variant="outline">اعمال</Button>
              </div>
            </div>
            <SheetFooter className="mt-auto border-t pt-4">
              <div className="flex flex-col gap-2 w-full">
                <Button size="lg" className="w-full" onClick={handleCheckout}>
                  ادامه و پرداخت
                </Button>
                <Button variant="outline" size="lg" className="w-full" onClick={toggleCart}>
                  ادامه خرید
                </Button>
                 <Button variant="link" size="sm" className="text-destructive mx-auto" onClick={() => { clearCart(); toast({title: "سبد خرید پاک شد!"}) }}>
                    پاک کردن سبد خرید
                  </Button>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
