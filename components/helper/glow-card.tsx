"use client"
import { useEffect, ReactNode } from 'react';

interface GlowCardProps {
  children: ReactNode;
  identifier: string;
}

const GlowCard = ({ children, identifier }: GlowCardProps) => {
  useEffect(() => {
    const CONTAINER = document.querySelector(`.glow-container-${identifier}`) as HTMLElement | null;
    const CARDS = document.querySelectorAll(`.glow-card-${identifier}`) as NodeListOf<HTMLElement>;

    const CONFIG = {
      proximity: 40,
      spread: 80,
      blur: 12,
      gap: 32,
      vertical: false,
      opacity: 0,
    };

    const UPDATE = (event?: PointerEvent) => {
      for (const CARD of CARDS) {
        const CARD_BOUNDS = CARD.getBoundingClientRect();
        const x = event?.x ?? 0;
        const y = event?.y ?? 0;

        if (
          x > CARD_BOUNDS.left - CONFIG.proximity &&
          x < CARD_BOUNDS.left + CARD_BOUNDS.width + CONFIG.proximity &&
          y > CARD_BOUNDS.top - CONFIG.proximity &&
          y < CARD_BOUNDS.top + CARD_BOUNDS.height + CONFIG.proximity
        ) {
          CARD.style.setProperty('--active', '1');
        } else {
          CARD.style.setProperty('--active', CONFIG.opacity.toString());
        }

        const CARD_CENTER = [
          CARD_BOUNDS.left + CARD_BOUNDS.width * 0.5,
          CARD_BOUNDS.top + CARD_BOUNDS.height * 0.5,
        ];

        let ANGLE =
          (Math.atan2(y - CARD_CENTER[1], x - CARD_CENTER[0]) *
            180) /
          Math.PI;

        ANGLE = ANGLE < 0 ? ANGLE + 360 : ANGLE;

        CARD.style.setProperty('--start', (ANGLE + 90).toString());
      }
    };

    document.body.addEventListener('pointermove', UPDATE as (e: PointerEvent) => void);

    const RESTYLE = () => {
      if (!CONTAINER) return;
      
      CONTAINER.style.setProperty('--gap', `${CONFIG.gap}px`);
      CONTAINER.style.setProperty('--blur', `${CONFIG.blur}px`);
      CONTAINER.style.setProperty('--spread', `${CONFIG.spread}px`);
      CONTAINER.style.setProperty(
        '--direction',
        CONFIG.vertical ? 'column' : 'row'
      );
    };

    RESTYLE();
    UPDATE();

    // Cleanup event listener
    return () => {
      document.body.removeEventListener('pointermove', UPDATE as (e: PointerEvent) => void);
    };
  }, [identifier]);

  return (
    <div className={`glow-container-${identifier} glow-container`}>
      <article className={`glow-card glow-card-${identifier} h-fit cursor-pointer border border-[#2a2e5a] transition-all duration-300 relative bg-[#101123] text-gray-200 rounded-xl hover:border-transparent w-full`}>
        <div className="glows"></div>
        {children}
      </article>
    </div>
  );
};

export default GlowCard;
