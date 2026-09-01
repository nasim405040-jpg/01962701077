import React, { useEffect, useRef } from 'react';
import { useNews } from '../../context/NewsContext.tsx';
import { AdPlacement } from '../../types.ts';

interface AdSlotProps {
  placement: AdPlacement;
  className?: string;
}

export const AdSlot: React.FC<AdSlotProps> = ({ placement, className = '' }) => {
  const { ads = [], settings } = useNews();
  const containerRef = useRef<HTMLDivElement>(null);

  // Check if global ads enabled or specific ad exists
  const hasAdsArray = Array.isArray(ads);
  const activeAd = hasAdsArray ? ads.find((a) => a?.placement === placement && a?.isActive) : null;

  const isEnabled = settings?.adsConfig?.enableAdsterra || !!activeAd;

  useEffect(() => {
    if (!activeAd || !activeAd.adCode || !containerRef.current) {
      return;
    }

    const createdScripts: HTMLScriptElement[] = [];

    try {
      const code = activeAd.adCode.trim();
      if (code.includes('<script')) {
        // Parse safely in container
        containerRef.current.innerHTML = code;
        const scriptElements = containerRef.current.querySelectorAll('script');
        
        scriptElements.forEach((origScript) => {
          try {
            const newScript = document.createElement('script');
            newScript.type = origScript.type || 'text/javascript';
            if (origScript.src) {
              newScript.src = origScript.src;
              newScript.async = true;
            } else {
              newScript.text = origScript.text || origScript.innerHTML;
            }
            document.body.appendChild(newScript);
            createdScripts.push(newScript);
          } catch (scriptErr) {
            console.warn(`[AdSlot] Failed to inject script for placement ${placement}:`, scriptErr);
          }
        });
      } else {
        containerRef.current.innerHTML = code;
      }
    } catch (err) {
      console.warn(`[AdSlot] Error rendering ad for placement ${placement}:`, err);
    }

    return () => {
      // Clean up injected script tags safely
      createdScripts.forEach((s) => {
        try {
          if (s.parentNode) {
            s.parentNode.removeChild(s);
          }
        } catch (cleanupErr) {
          // ignore
        }
      });
    };
  }, [activeAd, placement]);

  if (!isEnabled || !activeAd) {
    return null;
  }

  return (
    <div
      id={`ad-slot-${placement}`}
      className={`my-4 flex flex-col items-center justify-center overflow-hidden transition-all duration-200 ${className}`}
    >
      <div className="w-full flex items-center justify-center gap-2 mb-1">
        <span className="text-[10px] tracking-wider text-slate-500 dark:text-slate-400 uppercase font-mono">
          বিজ্ঞাপন
        </span>
      </div>
      <div
        ref={containerRef}
        className="w-full flex items-center justify-center min-h-[50px]"
      />
    </div>
  );
};

