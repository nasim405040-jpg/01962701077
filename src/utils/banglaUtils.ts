/**
 * Utility functions for Bengali date, numerals, relative time, and text formatting.
 */

const banglaDigits: { [key: string]: string } = {
  '0': '০',
  '1': '১',
  '2': '২',
  '3': '৩',
  '4': '৪',
  '5': '৫',
  '6': '৬',
  '7': '৭',
  '8': '৮',
  '9': '৯',
};

const banglaDays = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];

const banglaMonths = [
  'জানুয়ারি',
  'ফেব্রুয়ারি',
  'মার্চ',
  'এপ্রিল',
  'মে',
  'জুন',
  'জুলাই',
  'আগস্ট',
  'সেপ্টেম্বর',
  'অক্টোবর',
  'নভেম্বর',
  'ডিসেম্বর',
];

const traditionalBanglaMonths = [
  'বৈশাখ',
  'জ্যৈষ্ঠ',
  'আষাঢ়',
  'শ্রাবণ',
  'ভাদ্র',
  'আশ্বিন',
  'কার্তিক',
  'অগ্রহায়ণ',
  'পৌষ',
  'মাঘ',
  'ফাল্গুন',
  'চৈত্র',
];

/**
 * Converts English number/digits string to Bengali numerals
 */
export function toBanglaNumber(num: number | string | undefined | null): string {
  if (num === undefined || num === null) return '';
  return num.toString().replace(/\d/g, (match) => banglaDigits[match] || match);
}

export const toBanglaNumeral = toBanglaNumber;

/**
 * Returns formatted Gregorian date in Bengali (e.g., "০১ সেপ্টেম্বর ২০২৬, মঙ্গলবার")
 */
export function formatBanglaDate(dateInput?: string | Date | null): string {
  if (!dateInput) return '';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return '';

  const day = toBanglaNumber(date.getDate().toString().padStart(2, '0'));
  const month = banglaMonths[date.getMonth()] || '';
  const year = toBanglaNumber(date.getFullYear());
  const dayName = banglaDays[date.getDay()] || '';

  return `${day} ${month} ${year}, ${dayName}`.trim();
}

/**
 * Returns formatted Gregorian time in Bengali (e.g., "বিকাল ০৪:২৫")
 */
export function formatBanglaTime(dateInput?: string | Date | null): string {
  if (!dateInput) return '';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return '';

  let hours = date.getHours();
  const minutes = toBanglaNumber(date.getMinutes().toString().padStart(2, '0'));
  let period = 'সকাল';

  if (hours >= 12 && hours < 16) {
    period = 'দুপুর';
  } else if (hours >= 16 && hours < 19) {
    period = 'বিকাল';
  } else if (hours >= 19 && hours < 24) {
    period = 'রাত';
  } else if (hours >= 0 && hours < 5) {
    period = 'রাত';
  } else if (hours >= 5 && hours < 12) {
    period = 'সকাল';
  }

  if (hours > 12) hours -= 12;
  if (hours === 0) hours = 12;

  const banglaHour = toBanglaNumber(hours.toString().padStart(2, '0'));

  return `${period} ${banglaHour}:${minutes}`;
}


/**
 * Calculates current Bengali calendar date (Bengali Solar Calendar approx)
 */
export function getTraditionalBanglaCalendarDate(dateInput?: Date): string {
  const date = dateInput || new Date();
  const month = date.getMonth(); // 0-11
  const day = date.getDate();
  const year = date.getFullYear();

  // Approximate Bangla calendar converter (Bangladesh official solar calendar)
  // Boishakh starts on April 14
  // Boishakh to Bhadro = 31 days each (months 0 to 4 in Bangla)
  // Ashwin to Chaitra = 30 days each (Falgun has 29 or 30 in leap year)
  
  let banglaYear = year - 593;
  if (month < 3 || (month === 3 && day < 14)) {
    banglaYear -= 1;
  }

  let banglaMonthIndex = 0;
  let banglaDay = 1;

  // Simple calendar mapping for standard display
  if (month === 3 && day >= 14) {
    banglaMonthIndex = 0; // Boishakh
    banglaDay = day - 13;
  } else if (month === 4) {
    if (day <= 14) {
      banglaMonthIndex = 0;
      banglaDay = day + 17;
    } else {
      banglaMonthIndex = 1; // Joishtho
      banglaDay = day - 14;
    }
  } else if (month === 5) {
    if (day <= 14) {
      banglaMonthIndex = 1;
      banglaDay = day + 17;
    } else {
      banglaMonthIndex = 2; // Asharh
      banglaDay = day - 14;
    }
  } else if (month === 6) {
    if (day <= 15) {
      banglaMonthIndex = 2;
      banglaDay = day + 16;
    } else {
      banglaMonthIndex = 3; // Srabon
      banglaDay = day - 15;
    }
  } else if (month === 7) {
    if (day <= 15) {
      banglaMonthIndex = 3;
      banglaDay = day + 16;
    } else {
      banglaMonthIndex = 4; // Bhadro
      banglaDay = day - 15;
    }
  } else if (month === 8) {
    if (day <= 15) {
      banglaMonthIndex = 4;
      banglaDay = day + 16;
    } else {
      banglaMonthIndex = 5; // Ashwin
      banglaDay = day - 15;
    }
  } else if (month === 9) {
    if (day <= 15) {
      banglaMonthIndex = 5;
      banglaDay = day + 15;
    } else {
      banglaMonthIndex = 6; // Kartik
      banglaDay = day - 15;
    }
  } else if (month === 10) {
    if (day <= 14) {
      banglaMonthIndex = 6;
      banglaDay = day + 15;
    } else {
      banglaMonthIndex = 7; // Ogrohayon
      banglaDay = day - 14;
    }
  } else if (month === 11) {
    if (day <= 14) {
      banglaMonthIndex = 7;
      banglaDay = day + 16;
    } else {
      banglaMonthIndex = 8; // Poush
      banglaDay = day - 14;
    }
  } else if (month === 0) {
    if (day <= 13) {
      banglaMonthIndex = 8;
      banglaDay = day + 17;
    } else {
      banglaMonthIndex = 9; // Magh
      banglaDay = day - 13;
    }
  } else if (month === 1) {
    if (day <= 12) {
      banglaMonthIndex = 9;
      banglaDay = day + 18;
    } else {
      banglaMonthIndex = 10; // Falgun
      banglaDay = day - 12;
    }
  } else if (month === 2) {
    if (day <= 14) {
      banglaMonthIndex = 10;
      banglaDay = day + 16;
    } else {
      banglaMonthIndex = 11; // Choitro
      banglaDay = day - 14;
    }
  } else {
    banglaMonthIndex = 11;
    banglaDay = day + 17;
  }

  const bDay = toBanglaNumber(banglaDay);
  const bMonth = traditionalBanglaMonths[banglaMonthIndex];
  const bYear = toBanglaNumber(banglaYear);

  return `${bDay} ${bMonth} ${bYear} বঙ্গাব্দ`;
}

/**
 * Returns humanized relative time in Bengali (e.g., "৫ মিনিট আগে", "২ ঘণ্টা আগে", "গতকাল")
 */
export function getRelativeTimeBangla(dateInput?: string | Date | null): string {
  if (!dateInput) return '';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return '';

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 0) {
    return 'এইমাত্র';
  }

  if (diffInSeconds < 60) {
    return 'এইমাত্র';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${toBanglaNumber(diffInMinutes)} মিনিট আগে`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${toBanglaNumber(diffInHours)} ঘণ্টা আগে`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) {
    return 'গতকাল';
  }
  if (diffInDays < 7) {
    return `${toBanglaNumber(diffInDays)} দিন আগে`;
  }

  return formatBanglaDate(date);
}

/**
 * Estimates reading time in Bengali
 */
export function getReadingTimeBangla(text?: string | null): string {
  if (!text || typeof text !== 'string') return '১ মিনিট পাঠ';
  const cleanText = text.replace(/<[^>]*>/g, '');
  const wordCount = cleanText.split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(wordCount / 180));
  return `${toBanglaNumber(minutes)} মিনিট পাঠ`;
}


/**
 * Generates clean URL slug
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s\u0980-\u09FF-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}
