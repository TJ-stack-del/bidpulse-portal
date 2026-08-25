import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
  textSize?: string;
}

/**
 * Shield + Pulse Waveform Brand Icon
 * Colors: Electric Cobalt (#2563EB) & Institutional Blue
 */
export function BidPulseIcon({ size = 32, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Shield Outline */}
      <path
        d="M50 10L82 22V50C82 72 50 90 50 90C50 90 18 72 18 50V22L50 10Z"
        stroke="#2563EB"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* EKG / Pulse Line Through Shield */}
      <path
        d="M10 52H34L42 34L54 68L64 42L70 52H90"
        stroke="#2563EB"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Full Brand Logo (Icon + Wordmark)
 */
export function BidPulseLogo({
  size = 36,
  showText = true,
  textSize = 'text-2xl',
  className = '',
}: LogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <BidPulseIcon size={size} />
      {showText && (
        <span className={`font-black tracking-tight text-white ${textSize}`}>
          Bid<span className="text-[#2563EB]">Pulse</span>
        </span>
      )}
    </div>
  );
}

/**
 * BP Monogram / App Icon Variant
 */
export function BPMonogram({ size = 40 }: { size?: number }) {
  return (
    <div
      style={{ width: size, height: size }}
      className="rounded-xl bg-white border border-[#2563EB]/40 flex items-center justify-center shadow-md select-none"
    >
      <div className="flex items-center font-black text-xl leading-none">
        <span className="text-[#0F172A]">B</span>
        <span className="text-[#2563EB] relative -ml-0.5">
          P
          <span className="absolute left-[-2px] top-1/2 -translate-y-1/2 h-[2px] w-[6px] bg-[#2563EB]" />
        </span>
      </div>
    </div>
  );
}

/**
 * Signature 5-Tab Precision Bar Anchor Component
 */
export function FiveTabPrecisionBar({ activeTab = 'Transmittal' }: { activeTab?: string }) {
  const tabs = [
    { name: 'Transmittal', color: 'bg-[#0F172A]' },
    { name: 'Scope', color: 'bg-[#1E293B]' },
    { name: 'Staffing', color: 'bg-[#2563EB]' },
    { name: 'Cost Matrix', color: 'bg-[#059669]' },
    { name: 'Statutory Compliance', color: 'bg-[#0D9488]' },
  ];

  return (
    <div className="w-full rounded-t-xl overflow-hidden border-b border-slate-800 shadow-md">
      <div className="grid grid-cols-5 text-[10px] sm:text-xs font-bold text-center text-white">
        {tabs.map((tab) => {
          const isActive = tab.name === activeTab;
          return (
            <div
              key={tab.name}
              className={`${tab.color} py-2.5 px-1 truncate transition-opacity ${
                isActive ? 'opacity-100 ring-1 ring-white/30' : 'opacity-85 hover:opacity-100'
              }`}
            >
              {tab.name}
            </div>
          );
        })}
      </div>
    </div>
  );
}