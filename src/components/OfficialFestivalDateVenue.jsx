import React from 'react';

/**
 * FINAL APPROVED OFFICIAL DALENZIA FEST 2K26 DATE & VENUE COMPONENT
 *
 * Line 1: 2026 DECEMBER 21, 22, 23
 * Line 2: Thaqwa Juma Masjid Ayiroor
 * Line 3: Venue : Masjidul Liwah, Kandu Bazaar, Puthanpalli, Ayiroor.
 *
 * Strict Rule: Preserve exact wording, capitalization, 3-line order, and crimson red hierarchy.
 */
export default function OfficialFestivalDateVenue({
  align = 'left',
  size = 'md',
  className = '',
  withBorder = false
}) {
  const alignClass = align === 'center' ? 'text-center items-center' : align === 'right' ? 'text-right items-end' : 'text-left items-start';

  const sizeConfig = {
    sm: {
      l1: 'text-xs sm:text-sm font-bold tracking-[0.14em]',
      l2: 'text-[11px] sm:text-xs font-semibold tracking-wider mt-0.5',
      l3: 'text-[10px] sm:text-[11px] font-medium tracking-normal mt-0.5'
    },
    md: {
      l1: 'text-sm sm:text-base md:text-lg font-bold tracking-[0.14em]',
      l2: 'text-xs sm:text-sm md:text-base font-semibold tracking-wider mt-1',
      l3: 'text-[11px] sm:text-xs md:text-sm font-medium tracking-normal mt-0.5'
    },
    lg: {
      l1: 'text-base sm:text-xl md:text-2xl font-bold tracking-[0.16em]',
      l2: 'text-sm sm:text-base md:text-lg font-semibold tracking-wider mt-1',
      l3: 'text-xs sm:text-sm md:text-base font-medium tracking-normal mt-1'
    }
  }[size] || sizeConfig.md;

  return (
    <div
      className={`flex flex-col text-[#A91F35] ${alignClass} ${
        withBorder ? 'border-t border-[#E6A916]/50 pt-3 mt-3' : ''
      } ${className}`}
    >
      {/* Line 1: Date */}
      <p className={`m-0 uppercase font-serif text-[#A91F35] leading-snug ${sizeConfig.l1}`}>
        2026 DECEMBER 21, 22, 23
      </p>

      {/* Line 2: Institution / Mahal */}
      <p className={`m-0 font-sans text-[#A91F35] leading-snug ${sizeConfig.l2}`}>
        Thaqwa Juma Masjid Ayiroor
      </p>

      {/* Line 3: Exact Venue Specification */}
      <p className={`m-0 font-sans text-[#A91F35]/90 leading-snug ${sizeConfig.l3}`}>
        Venue : Masjidul Liwah, Kandu Bazaar, Puthanpalli, Ayiroor.
      </p>
    </div>
  );
}
