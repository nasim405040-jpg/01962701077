import React from 'react';
import { useNews } from '../../context/NewsContext.tsx';
import { Share2, Copy, Printer, Check } from 'lucide-react';

interface ShareButtonsProps {
  url?: string;
  title: string;
  excerpt?: string;
  imageUrl?: string;
}

export const ShareButtons: React.FC<ShareButtonsProps> = ({ url, title, excerpt }) => {
  const { showToast } = useNews();
  const [copied, setCopied] = React.useState(false);

  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(title);

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      showToast('সংবাদের লিংক কপি করা হয়েছে!', 'success');
      setTimeout(() => setCopied(false), 3000);
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
  const telegramUrl = `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`;
  const messengerUrl = `fb-messenger://share/?link=${encodedUrl}`;

  return (
    <div className="flex flex-wrap items-center gap-2 py-3 border-y border-slate-200 dark:border-slate-800 my-4">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 mr-2 uppercase tracking-wider">
        <Share2 className="w-3.5 h-3.5" />
        <span>শেয়ার করুন:</span>
      </div>

      {/* Facebook */}
      <a
        id="share-facebook-btn"
        href={facebookUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#1877F2] text-white text-xs font-medium hover:brightness-110 transition shadow-sm"
        title="Facebook-এ শেয়ার করুন"
      >
        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
        <span>ফেসবুক</span>
      </a>

      {/* WhatsApp */}
      <a
        id="share-whatsapp-btn"
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#25D366] text-white text-xs font-medium hover:brightness-110 transition shadow-sm"
        title="WhatsApp-এ শেয়ার করুন"
      >
        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M12.031 0C5.394 0 0 5.394 0 12.031c0 2.12.553 4.103 1.523 5.832L.055 24l6.305-1.463a11.96 11.96 0 005.671 1.494h.005c6.637 0 12.031-5.394 12.031-12.031 0-3.213-1.252-6.234-3.524-8.507C18.266 1.252 15.244 0 12.031 0z" />
        </svg>
        <span>হোয়াটসঅ্যাপ</span>
      </a>

      {/* X / Twitter */}
      <a
        id="share-twitter-btn"
        href={twitterUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-black text-white text-xs font-medium hover:bg-slate-800 transition shadow-sm border border-slate-700"
        title="X-এ পোস্ট করুন"
      >
        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        <span>এক্স</span>
      </a>

      {/* Telegram */}
      <a
        id="share-telegram-btn"
        href={telegramUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#229ED9] text-white text-xs font-medium hover:brightness-110 transition shadow-sm"
        title="Telegram-এ পাঠান"
      >
        <span>টেলিগ্রাম</span>
      </a>

      {/* Copy Link */}
      <button
        id="share-copy-btn"
        onClick={handleCopy}
        className="flex items-center gap-1 px-3 py-1.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition border border-slate-300 dark:border-slate-700"
        title="সংবাদের লিংক কপি করুন"
      >
        {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
        <span>{copied ? 'কপি হয়েছে' : 'লিংক কপি'}</span>
      </button>

      {/* Print */}
      <button
        id="share-print-btn"
        onClick={handlePrint}
        className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition border border-slate-300 dark:border-slate-700"
        title="প্রিন্ট করুন"
      >
        <Printer className="w-3.5 h-3.5" />
        <span>প্রিন্ট</span>
      </button>
    </div>
  );
};
