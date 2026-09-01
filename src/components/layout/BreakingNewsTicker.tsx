import React, { useState, useEffect } from 'react';
import { useNews } from '../../context/NewsContext.tsx';
import { ChevronLeft, ChevronRight, Flame, Volume2 } from 'lucide-react';

export const BreakingNewsTicker: React.FC = () => {
  const { breakingNews, navigate } = useNews();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const activeNews = breakingNews.filter((b) => b.isActive);

  useEffect(() => {
    if (activeNews.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeNews.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [activeNews.length, isPaused]);

  if (activeNews.length === 0) return null;

  const currentItem = activeNews[currentIndex] || activeNews[0];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % activeNews.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + activeNews.length) % activeNews.length);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (currentItem.link) {
      navigate(currentItem.link);
    }
  };

  return (
    <div
      id="breaking-news-bar"
      className="bg-gradient-to-r from-rose-900 via-red-800 to-rose-950 text-white border-y border-rose-950 shadow-sm"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-2 flex items-center justify-between gap-3 text-sm">
        {/* Breaking Badge */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-yellow-300"></span>
          </span>
          <div className="flex items-center gap-1 bg-black/30 px-2.5 py-1 rounded text-xs font-bold uppercase tracking-wider text-yellow-300 border border-white/10">
            <Flame className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
            <span>ব্রেকিং নিউজ</span>
          </div>
        </div>

        {/* Headline Ticker Item */}
        <div className="flex-1 overflow-hidden min-w-0">
          <a
            href={currentItem.link || '#'}
            onClick={handleClick}
            className="block truncate font-medium text-white hover:text-yellow-200 transition text-sm sm:text-base leading-snug cursor-pointer"
          >
            {currentItem.category && (
              <span className="inline-block mr-2 px-1.5 py-0.5 bg-white/20 text-[11px] font-semibold rounded text-white">
                {currentItem.category}
              </span>
            )}
            {currentItem.title}
          </a>
        </div>

        {/* Navigation arrows */}
        {activeNews.length > 1 && (
          <div className="flex items-center gap-1 shrink-0">
            <span className="text-xs text-white/70 hidden sm:inline mr-1">
              {currentIndex + 1} / {activeNews.length}
            </span>
            <button
              onClick={handlePrev}
              className="p-1 rounded bg-black/20 hover:bg-black/40 text-white transition"
              aria-label="Previous breaking news"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="p-1 rounded bg-black/20 hover:bg-black/40 text-white transition"
              aria-label="Next breaking news"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
