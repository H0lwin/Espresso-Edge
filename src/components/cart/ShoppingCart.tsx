
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
  const { 
    cartItems, 
    isCartOpen, 
    toggleCart, 
    updateItemQuantity, 
    removeItemFromCart, 
    getCartTotal, 
    clearCart,
    isLoading: isCartLoading 
  } = useCart();
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
      const currentPath = '/cart';
      router.push(`/auth/login?redirect=${encodeURIComponent(currentPath)}`);
      toggleCart();
    } else {
      if (cartItems.length === 0) {
        toast({
          title: "سبد خرید خالی",
          description: "لطفاً ابتدا محصولی به سبد خرید خود اضافه کنید.",
        });
        return;
      }
      router.push('/checkout');
      toggleCart();
    }
  };

  const handleUpdateQuantity = async (id: string | number, newQuantity: number) => {
    await updateItemQuantity(id, newQuantity);
  };

  const handleRemoveItem = async (id: string | number) => {
    await removeItemFromCart(id);
  };
  
  const handleClearCart = async () => {
    await clearCart();
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={toggleCart}>
      <SheetContent className="flex flex-col w-full sm:max-w-md text-right" side="left">
        <SheetHeader className="text-right border-b pb-4">
          <SheetTitle>سبد خرید شما</SheetTitle>
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
              <div className="space-y-4 pe-2">
                {cartItems.map(item => (
                  <div key={item.id} className="flex items-center gap-4 p-2 border rounded-md">
                    <Image
                      src={item.imageSrc || 'https://placehold.co/64x64.png'}
                      alt={item.name}
                      width={64}
                      height={64}
                      className="rounded-md object-cover h-16 w-16"
                      data-ai-hint={item.imageHint || 'product image'}
                    />
                    <div className="flex-grow">
                      <h4 className="font-semibold">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {typeof item.price === 'number' ? item.price.toLocaleString('fa-IR') + ' تومان' : item.price}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)} disabled={isCartLoading}>
                          <MinusCircle className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)} disabled={isCartLoading}>
                          <PlusCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleRemoveItem(item.id)} disabled={isCartLoading}>
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
              {/* <div className="flex gap-2 items-center">
                <Input type="text" placeholder="کد تخفیف" className="text-right" />
                <Button variant="outline">اعمال</Button>
              </div> */}
            </div>
            <SheetFooter className="mt-auto border-t pt-4">
              <div className="flex flex-col gap-2 w-full">
                <Button size="lg" className="w-full" onClick={handleCheckout} disabled={isCartLoading || cartItems.length === 0}>
                  ادامه و پرداخت
                </Button>
                <Button variant="outline" size="lg" className="w-full" onClick={toggleCart}>
                  ادامه خرید
                </Button>
                 <Button variant="link" size="sm" className="text-destructive mx-auto" onClick={handleClearCart} disabled={isCartLoading}>
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
