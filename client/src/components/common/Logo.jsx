import React from 'react';

/**
 * FlashAds Logo Component
 * Combines a digital billboard frame, the geometric 'F' letterform, and an energetic lightning flash.
 * 
 * @param {'sm' | 'md' | 'lg' | 'xl' | '2xl'} size - Size of the logo
 * @param {'full' | 'horizontal' | 'icon-only' | 'stacked'} variant - Visual display layout
 * @param {'auto' | 'dark' | 'light'} theme - Color scheme adaptation
 * @param {boolean} showTagline - Whether to render "Find. Book. Advertise."
 * @param {boolean} animated - Adds hover glow and pulse micro-interaction
 * @param {string} className - Additional CSS class names
 */
export default function Logo({
  size = 'md',
  variant = 'horizontal',
  theme = 'auto',
  showTagline,
  animated = true,
  className = '',
}) {
  // If showTagline isn't explicitly defined, show it for full & stacked variants
  const hasTagline = showTagline !== undefined ? showTagline : (variant === 'full' || variant === 'stacked');

  // Size configurations
  const sizeMap = {
    sm: { icon: 28, text: 'text-lg', tagline: 'text-[9px] tracking-[0.18em]', gap: 'gap-2' },
    md: { icon: 38, text: 'text-2xl', tagline: 'text-[11px] tracking-[0.2em]', gap: 'gap-3' },
    lg: { icon: 48, text: 'text-3xl', tagline: 'text-xs tracking-[0.22em]', gap: 'gap-3.5' },
    xl: { icon: 64, text: 'text-4xl', tagline: 'text-sm tracking-[0.25em]', gap: 'gap-4' },
    '2xl': { icon: 84, text: 'text-5xl', tagline: 'text-base tracking-[0.25em]', gap: 'gap-5' },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  // Text color based on theme
  const flashColor = theme === 'dark' ? 'text-white' : theme === 'light' ? 'text-slate-900' : 'text-slate-900 dark:text-white';
  const taglineColor = theme === 'dark' ? 'text-slate-400' : theme === 'light' ? 'text-slate-500' : 'text-slate-500 dark:text-slate-400';

  // Standalone Icon SVG
  const LogoIcon = (
    <div className={`relative flex items-center justify-center shrink-0 ${animated ? 'group-hover:scale-105 transition-transform duration-300' : ''}`}>
      <svg
        width={currentSize.icon}
        height={currentSize.icon}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible drop-shadow-md"
      >
        <defs>
          <linearGradient id="fa-billboard-blue" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E40AF" />
            <stop offset="50%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
          <linearGradient id="fa-lightning-orange" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FCD34D" />
            <stop offset="40%" stopColor="#FF6B00" />
            <stop offset="100%" stopColor="#EA580C" />
          </linearGradient>
          <linearGradient id="fa-screen-glow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#F97316" stopOpacity="0.18" />
          </linearGradient>
          <filter id="fa-bolt-glow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#FF6B00" floodOpacity="0.6" />
          </filter>
        </defs>

        {/* Billboard Pillar & Ground Base */}
        <rect x="22" y="37" width="4" height="6" rx="1" fill="#64748B" />
        <path d="M15 43h18" stroke="#64748B" strokeWidth="2.5" strokeLinecap="round" />

        {/* Billboard Frame / Outer Housing */}
        <rect
          x="6"
          y="6"
          width="36"
          height="29"
          rx="6"
          fill="#0B0F17"
          stroke="url(#fa-billboard-blue)"
          strokeWidth="2.5"
          className="transition-colors duration-300"
        />

        {/* Inner Digital Screen Display */}
        <rect x="9" y="9" width="30" height="23" rx="4" fill="#030712" />
        <rect x="9" y="9" width="30" height="23" rx="4" fill="url(#fa-screen-glow)" />

        {/* Stylized 'F' Billboard Digital Beams */}
        <rect x="13" y="13" width="4.5" height="15" rx="2" fill="url(#fa-billboard-blue)" />
        <rect x="13" y="13" width="14" height="4" rx="2" fill="url(#fa-billboard-blue)" />
        <rect x="13" y="19" width="9.5" height="3.5" rx="1.75" fill="url(#fa-billboard-blue)" />

        {/* Dynamic Electric Bolt cutting across */}
        <polygon
          points="27,6 18,21 24.5,21 20,34 32,17.5 25.5,17.5"
          fill="url(#fa-lightning-orange)"
          filter="url(#fa-bolt-glow)"
          className={animated ? 'animate-pulse' : ''}
        />

        {/* Live Display LED status indicator */}
        <circle cx="34" cy="12" r="1.2" fill="#22C55E" />
      </svg>
    </div>
  );

  if (variant === 'icon-only') {
    return (
      <div className={`inline-flex items-center justify-center ${className}`}>
        {LogoIcon}
      </div>
    );
  }

  if (variant === 'stacked') {
    return (
      <div className={`group inline-flex flex-col items-center text-center ${currentSize.gap} ${className}`}>
        {LogoIcon}
        <div className="flex flex-col items-center">
          <span className={`${currentSize.text} font-extrabold tracking-tight leading-none`}>
            <span className={flashColor}>Flash</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500">
              Ads
            </span>
          </span>
          {hasTagline && (
            <span className={`mt-1.5 font-bold uppercase ${taglineColor} ${currentSize.tagline}`}>
              Find. Book. Advertise.
            </span>
          )}
        </div>
      </div>
    );
  }

  // Default / Horizontal / Full Layout
  return (
    <div className={`group inline-flex items-center ${currentSize.gap} select-none ${className}`}>
      {LogoIcon}
      <div className="flex flex-col justify-center">
        <span className={`${currentSize.text} font-extrabold tracking-tight leading-none flex items-center`}>
          <span className={flashColor}>Flash</span>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500">
            Ads
          </span>
        </span>
        {hasTagline && (
          <span className={`mt-1 font-bold uppercase ${taglineColor} ${currentSize.tagline}`}>
            Find. Book. Advertise.
          </span>
        )}
      </div>
    </div>
  );
}
