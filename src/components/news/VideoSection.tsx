import React, { useState } from 'react';
import { Play, X, Video } from 'lucide-react';

interface VideoItem {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  youtubeId: string;
  category: string;
}

const SAMPLE_VIDEOS: VideoItem[] = [
  {
    id: 'v1',
    title: 'পদ্মা সেতু ও মেট্রোরেলের পর এবার দেশের প্রথম গভীর সমুদ্র বন্দর: বিশেষ ভিডিও প্রতিবেদন',
    thumbnail: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80',
    duration: '০৫:২৪',
    youtubeId: 'dQw4w9WgXcQ',
    category: 'বিশেষ প্রতিবেদন',
  },
  {
    id: 'v2',
    title: 'বিশ্বকাপ ফুটবলের প্রস্তুতি: তরুণ তুর্কিদের মাঠের লড়াই ও মাঠের বাইরের কৌশল',
    thumbnail: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&auto=format&fit=crop&q=80',
    duration: '০৩:৪৫',
    youtubeId: 'dQw4w9WgXcQ',
    category: 'খেলাধুলা',
  },
  {
    id: 'v3',
    title: 'সুন্দরবনের জীববৈচিত্র্য রক্ষা ও বন্যপ্রাণী সংরক্ষণে অত্যাধুনিক ড্রোনের ব্যবহার',
    thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    duration: '০৪:১২',
    youtubeId: 'dQw4w9WgXcQ',
    category: 'পরিবেশ ও প্রকৃতি',
  },
  {
    id: 'v4',
    title: 'বাংলা কৃত্রিম বুদ্ধিমত্তা মডেল ‘বাণী’ যেভাবে বদলে দিচ্ছে প্রযুক্তি খাত',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    duration: '০৬:১০',
    youtubeId: 'dQw4w9WgXcQ',
    category: 'প্রযুক্তি',
  },
];

export const VideoSection: React.FC = () => {
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);

  return (
    <section className="my-10 bg-slate-950 text-white rounded-2xl p-6 sm:p-8 border border-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-rose-900 text-white">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-2xl font-bold font-serif text-white">
              ভিডিও গ্যালারি
            </h3>
            <p className="text-xs text-slate-400">
              সত্যবাণী মাল্টিমিডিয়া স্পেশাল ভিজ্যুয়াল স্টোরি
            </p>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Video Feature */}
        <div
          onClick={() => setActiveVideo(SAMPLE_VIDEOS[0])}
          className="lg:col-span-7 group cursor-pointer relative aspect-16/9 rounded-xl overflow-hidden bg-slate-900 shadow-xl border border-slate-800"
        >
          <img
            src={SAMPLE_VIDEOS[0].thumbnail}
            alt={SAMPLE_VIDEOS[0].title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85 group-hover:opacity-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-between p-6">
            <span className="self-start px-3 py-1 rounded bg-rose-900 text-white text-xs font-bold shadow">
              {SAMPLE_VIDEOS[0].category}
            </span>
            <div className="flex items-end justify-between gap-4">
              <div>
                <h4 className="text-lg sm:text-2xl font-bold font-serif text-white group-hover:text-rose-400 transition-colors leading-tight mb-2">
                  {SAMPLE_VIDEOS[0].title}
                </h4>
                <span className="text-xs text-slate-300 font-mono">
                  দৈর্ঘ্য: {SAMPLE_VIDEOS[0].duration}
                </span>
              </div>
              <div className="w-14 h-14 rounded-full bg-rose-600 group-hover:bg-rose-500 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform shrink-0">
                <Play className="w-6 h-6 fill-current ml-1" />
              </div>
            </div>
          </div>
        </div>

        {/* Side Video Playlist */}
        <div className="lg:col-span-5 flex flex-col gap-3 justify-between">
          {SAMPLE_VIDEOS.slice(1).map((v) => (
            <div
              key={v.id}
              onClick={() => setActiveVideo(v)}
              className="group cursor-pointer flex gap-3 p-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 hover:border-rose-900 transition items-center"
            >
              <div className="relative w-28 sm:w-32 aspect-16/9 rounded-lg overflow-hidden shrink-0 bg-slate-800">
                <img
                  src={v.thumbnail}
                  alt={v.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                  <div className="w-7 h-7 rounded-full bg-rose-700/90 text-white flex items-center justify-center">
                    <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                  </div>
                </div>
                <span className="absolute bottom-1 right-1 px-1 rounded bg-black/80 text-[10px] font-mono text-white">
                  {v.duration}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] text-rose-400 font-semibold block mb-1">
                  {v.category}
                </span>
                <h5 className="text-xs sm:text-sm font-semibold text-slate-100 group-hover:text-rose-400 transition-colors line-clamp-2 leading-snug">
                  {v.title}
                </h5>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Video Modal Player */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 w-full max-w-4xl rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <h4 className="font-bold text-white text-base truncate pr-4">
                {activeVideo.title}
              </h4>
              <button
                onClick={() => setActiveVideo(null)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="aspect-16/9 bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=1`}
                title={activeVideo.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
