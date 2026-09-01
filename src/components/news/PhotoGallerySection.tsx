import React, { useState } from 'react';
import { Camera, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { toBanglaNumeral } from '../../utils/banglaUtils.ts';

interface PhotoStory {
  id: string;
  title: string;
  image: string;
  caption: string;
  photographer: string;
}

const SAMPLE_PHOTOS: PhotoStory[] = [
  {
    id: 'p1',
    title: 'শরতের কাশবন ও নীল আকাশের মেলবন্ধন',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80',
    caption: 'নদীর তীরে শরতের কাশফুল এবং শুভ্র মেঘের মায়াবী আবহ। ঋতু পরিবর্তনের এই অপরূপ রূপ মুগ্ধ করেছে দর্শনার্থীদের।',
    photographer: 'তানভীর আহমেদ / সত্যবাণী',
  },
  {
    id: 'p2',
    title: 'ঐতিহাসিক লালবাগ কেল্লায় সূর্যাস্তের রক্তিম আভা',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1200&auto=format&fit=crop&q=80',
    caption: 'মুঘল স্থাপত্যের ঐতিহাসিক নিদর্শন লালবাগ কেল্লায় গোধূলিলগ্নের মনোমুগ্ধকর দৃশ্য।',
    photographer: 'মাহমুদুল হাসান',
  },
  {
    id: 'p3',
    title: 'সুন্দরবনের গভীর অরণ্যে চিত্রল হরিণের দল',
    image: 'https://images.unsplash.com/photo-1484406566174-9da000fda645?w=1200&auto=format&fit=crop&q=80',
    caption: 'ম্যানগ্রোভ বনাঞ্চলে মিষ্টি পানির উৎসের সন্ধানে হরিণের অবাধ বিচরণ।',
    photographer: 'ফারহানা ইসলাম',
  },
  {
    id: 'p4',
    title: 'চা বাগানের সবুজ গালিচায় সকালের শিশিরবিন্দু',
    image: 'https://images.unsplash.com/photo-1544717302-de2939b7ef71?w=1200&auto=format&fit=crop&q=80',
    caption: 'শ্রীমঙ্গলের সবুজে ঘেরা চা বাগানে সকালের প্রথম আলো ও পাতা তোলার ব্যস্ততা।',
    photographer: 'রাকিবুল হাসান',
  },
];

export const PhotoGallerySection: React.FC = () => {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const nextPhoto = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % SAMPLE_PHOTOS.length);
    }
  };

  const prevPhoto = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + SAMPLE_PHOTOS.length) % SAMPLE_PHOTOS.length);
    }
  };

  return (
    <section className="my-10 bg-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-rose-900 text-white">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-2xl font-bold font-serif text-white">
              ছবির গল্প (Photo Feature)
            </h3>
            <p className="text-xs text-slate-400">
              ক্যামেরার লেন্সে দেশ ও প্রকৃতির বহুমাত্রিক রূপ
            </p>
          </div>
        </div>
      </div>

      {/* Photos Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {SAMPLE_PHOTOS.map((photo, index) => (
          <div
            key={photo.id}
            onClick={() => openLightbox(index)}
            className="group cursor-pointer rounded-xl overflow-hidden bg-slate-800 border border-slate-700/80 hover:border-rose-700 transition flex flex-col justify-between"
          >
            <div className="relative aspect-4/3 overflow-hidden">
              <img
                src={photo.image}
                alt={photo.title}
                className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
              <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 text-[11px] text-white">
                ছবি {toBanglaNumeral(index + 1)}
              </span>
            </div>
            <div className="p-3.5">
              <h5 className="text-sm font-bold font-serif text-white group-hover:text-rose-400 transition-colors line-clamp-2 mb-1">
                {photo.title}
              </h5>
              <p className="text-[11px] text-slate-400">
                ছবি: {photo.photographer}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <button
            onClick={closeLightbox}
            className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-white z-10"
            aria-label="Close photo"
          >
            <X className="w-6 h-6" />
          </button>

          <button
            onClick={prevPhoto}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-black/80 text-white z-10"
            aria-label="Previous photo"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={nextPhoto}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/60 hover:bg-black/80 text-white z-10"
            aria-label="Next photo"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="max-w-4xl w-full flex flex-col items-center">
            <img
              src={SAMPLE_PHOTOS[lightboxIndex].image}
              alt={SAMPLE_PHOTOS[lightboxIndex].title}
              className="max-h-[70vh] w-auto object-contain rounded-lg shadow-2xl mb-4"
            />
            <div className="text-center max-w-2xl">
              <h4 className="text-xl font-bold font-serif text-white mb-2">
                {SAMPLE_PHOTOS[lightboxIndex].title}
              </h4>
              <p className="text-sm text-slate-300 mb-2 leading-relaxed">
                {SAMPLE_PHOTOS[lightboxIndex].caption}
              </p>
              <span className="text-xs text-rose-400 font-semibold">
                ছবি: {SAMPLE_PHOTOS[lightboxIndex].photographer}
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
