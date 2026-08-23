import React from 'react';
import Link from 'next/link';

export const BrandLogo: React.FC<{ className?: string; showText?: boolean }> = ({ 
  className = "h-8", 
  showText = true 
}) => {
  return (
    <Link href="/" className={`flex items-center gap-2.5 ${className}`}>
      <svg 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-8 w-auto text-blue-500 shrink-0"
      >
        <path 
          d="M50 8L88 22V50C88 74 50 92 50 92C50 92 12 74 12 50V22L50 8Z" 
          stroke="#2563EB" 
          strokeWidth="7" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="stroke-blue-500 fill-blue-950/20"
        />
        <path 
          d="M20 50H36L44 32L54 68L64 42L72 50H80" 
          stroke="#38BDF8" 
          strokeWidth="7" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
      </svg>
      {showText && (
        <span className="font-extrabold tracking-tight text-xl text-white font-sans">
          Bid<span className="text-blue-500">Pulse</span>
        </span>
      )}
    </Link>
  );
};
