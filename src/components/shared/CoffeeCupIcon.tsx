import type { SVGProps } from 'react';

export function CoffeeCupIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 5h6M11 5H8M11 5v2M11 7h.5a2.5 2.5 0 1 1 0 5H8M5 8a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2Z" />
      <path d="M17 16v2a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-2" />
      <path d="M17 8h2.5a1.5 1.5 0 0 1 0 3H17" />
    </svg>
  );
}
