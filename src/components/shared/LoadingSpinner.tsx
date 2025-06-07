
"use client";

import { CoffeeCupIcon } from './CoffeeCupIcon';

export default function LoadingSpinner() {
  return (
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-background/95 backdrop-blur-sm">
      <div className="relative flex items-center justify-center h-20 w-20 mb-4">
        <div className="absolute animate-spin rounded-full h-full w-full border-4 border-primary border-t-transparent"></div>
        <CoffeeCupIcon className="h-10 w-10 text-primary" />
      </div>
      <div className="flex items-center text-xl font-headline text-secondary">
        <span className="font-body">در حال بارگذاری اسپرسو اج...</span>
      </div>
    </div>
  );
}
