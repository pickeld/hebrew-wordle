// Curated Hebrew word pools for the daily Wordle.
//
// Every entry is exactly 5 Hebrew letters (no nikud, no spaces/maqaf). Final
// letter forms (ך ם ן ף ץ) count as one letter each. The list is deduped and
// length-checked by scripts/check-words.mjs — run `node scripts/check-words.mjs`
// after editing to confirm no word slipped in at the wrong length or twice.
//
// ANSWER_WORDS_CLEAN is the daily-answer pool: words common enough to be a fair
// guess target. With several hundred entries the daily cycle (one word per
// Israel calendar day, see getDailyWord) is no longer noticeable. VALID_WORDS
// is the superset accepted as a *guess* — answers plus extra real words a
// player might reasonably try.

/** Keep only entries that are exactly 5 Hebrew letters, and drop duplicates. */
const _clean = (arr: string[]): string[] => {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const w of arr) {
    if ([...w].length !== 5) continue;
    if (!/^[א-ת]{5}$/.test(w)) continue;
    if (seen.has(w)) continue;
    seen.add(w);
    out.push(w);
  }
  return out;
};

// The daily-answer pool. Grouped by theme only for readability — selection is a
// flat deterministic index over the whole deduped array.
export const ANSWER_WORDS_CLEAN: string[] = _clean([
  // Feminine nouns & abstracts ending in ה
  'תפילה', 'מדינה', 'נגינה', 'מלוכה', 'ממלכה', 'משפחה', 'בחורה', 'בחינה',
  'מסעדה', 'חולצה', 'מנורה', 'מזוזה', 'מצודה', 'תרופה', 'מרפאה', 'בדיחה',
  'קדושה', 'קהילה', 'מלאכה', 'ידיעה', 'בריאה', 'אמונה', 'הצלחה', 'חבילה',
  'שכונה', 'גבינה', 'עוגיה', 'חליפה', 'מערכה', 'ארוחה', 'מנוחה', 'שמועה',
  'תקווה', 'בריכה', 'מדרגה', 'מגירה', 'כורסה', 'מטריה', 'חגורה', 'תמונה',
  'תשובה', 'מחשבה', 'חוכמה', 'גאווה', 'שלווה', 'גלידה', 'חביתה', 'פגישה',
  'ישיבה', 'עמידה', 'הליכה', 'קפיצה', 'נשיקה', 'בחירה', 'חגיגה', 'מסיבה',
  'הפתעה', 'ספינה', 'נסיכה', 'ממשלה', 'מלחמה', 'מצווה', 'כלכלה', 'שמיכה',
  'דבורה', 'ארנבת', 'מדליה', 'גיטרה', 'תרבות', 'אמנות', 'חירות', 'שכירה',
  'נסיעה', 'שתילה',

  // Feminine nouns ending in construct/segolate ת
  'מחברת', 'מסגרת', 'מקלחת', 'מרפסת', 'חצאית', 'מטפחת', 'מגבעת', 'שרשרת',

  // Adjectives — feminine
  'גדולה', 'גבוהה', 'רגילה', 'מהירה', 'נחמדה', 'צעירה', 'עשירה', 'ענייה',
  'פשוטה', 'מוזרה', 'נפלאה', 'עצובה', 'מנוסה', 'אדומה', 'כחולה', 'ירוקה',
  'צהובה', 'שחורה', 'כתומה', 'סגולה', 'ורודה', 'אפורה', 'ארוכה', 'עמוקה',
  'נמוכה', 'רטובה', 'חשובה', 'ברורה', 'נוראה', 'גרועה', 'חמודה', 'אהובה',
  'נקייה', 'טיפשה', 'עייפה', 'כועסת', 'פנויה',

  // Adjectives — masculine / mixed
  'מסובך', 'מיוחד', 'מדהים', 'מפחיד', 'מצחיק', 'משעמם', 'מצוין', 'מכוער',
  'שונים', 'דומים', 'שלמים', 'טובים', 'חדשים', 'ישנים', 'קצרים', 'קטנים',
  'יקרים', 'חזקות', 'חלשות',

  // People & family (plurals and roles)
  'חדרים', 'בגדים', 'פרחים', 'עופות', 'בעלים', 'חברים', 'ילדים', 'אנשים',
  'גברים', 'זקנים', 'שכנים', 'חברות', 'אחיות', 'דודים', 'דודות', 'נכדים',
  'מלכים', 'חכמים', 'מורים', 'טבחים', 'אופים', 'זמרים', 'נהגים', 'גיבור',
  'תינוק', 'מהנדס', 'חקלאי', 'תלמיד', 'מלכות', 'ילדות',

  // Food & drink
  'לחמים', 'ביצים', 'אגסים', 'תותים', 'ענבים', 'בצלים', 'גזרים', 'מרקים',
  'סלטים', 'עוגות', 'אבטיח', 'לימון',

  // Animals
  'כלבים', 'סוסים', 'כבשים', 'אריות', 'זאבים', 'דובים', 'נחשים', 'יונים',
  'גמלים', 'פילים', 'קופים', 'נשרים', 'תוכים', 'נמלים', 'צפרדע', 'ברווז',

  // Nature & weather
  'שמיים', 'עננים', 'גשמים', 'שלגים', 'רוחות', 'ברקים', 'רעמים', 'גבעות',
  'עמקים', 'נהרות', 'אגמים', 'יערות', 'ענפים', 'חולות', 'אבנים', 'סלעים',
  'חופים', 'כוחות', 'גשרים', 'עונות',

  // Body
  'עצמות', 'דמעות', 'ראשים', 'צוואר', 'ידיים',

  // Places, buildings & transport
  'שדרות', 'תחנות', 'חניות', 'גינות', 'בניין', 'ארמון', 'וילון', 'מנעול',
  'רכבות', 'סירות', 'קירות', 'דלתות', 'מדפים', 'בנקים', 'כפרים', 'יישוב',

  // Home, objects & tools
  'שולחן', 'בקבוק', 'כריות', 'מאפרה', 'שמשיה', 'אגרטל', 'מיטות', 'נורות',
  'סירים', 'כפיות', 'מגבות', 'שמלות', 'כפפות', 'תיקים', 'מברשת', 'סוודר',
  'כפתור', 'רמקול', 'מצלמה', 'מדפסת', 'מקלדת', 'טלפון', 'עיתון', 'ספרים',
  'לוחות', 'מסכים',

  // School, work & ideas
  'כיתות', 'שאלות', 'שיעור', 'לימוד', 'ילקוט', 'תיכון', 'פתרון', 'רעיון',
  'בעיות', 'מדעים', 'ערכים', 'חוקים',

  // Activities, arts & abstract
  'סיפור', 'ספורט', 'ריקוד', 'שירים', 'קריאה', 'כתיבה', 'בישול', 'שתייה',
  'אכילה', 'שירות', 'חזרות', 'כינור', 'פסנתר', 'תופים', 'צעצוע', 'בובות',
  'סרטים', 'הצגות', 'קלפים', 'שיחות', 'חובות', 'שקרים', 'פחדים', 'דאגות',
  'מתנות', 'שמחות', 'ברכות', 'חולים', 'ערבים',
]);

// Words accepted as a guess but not used as daily answers (less common, plurals,
// variants). Answers are always valid guesses too, via isValidWord below.
const EXTRA_VALID_WORDS: string[] = _clean([
  'כוסות', 'צלחות', 'תנורי', 'מקררי', 'מתוקה', 'חמוצה', 'מרירה', 'חריפה',
  'טעימה', 'מזינה', 'טבעית', 'טרייה', 'קפואה', 'אפויה', 'חדשות', 'מגזין',
  'מסכים', 'עכברי', 'רביעי', 'חמישי', 'שישית', 'שבועי', 'חודשי', 'שנתית',
  'יומית', 'שעתית', 'ראשון', 'שניות', 'שלשום', 'אתמול', 'שלישי', 'מצוין',
  'נוראה', 'אורחת', 'אלופה', 'ברורה', 'גרושה', 'דירות', 'הרגלי', 'זריזה',
  'חלומו', 'טבעות', 'יבשות', 'כתמים', 'לבבות', 'מסכות', 'נקודה', 'סודות',
  'עכשיו', 'פעמים', 'צבעים', 'קולות', 'רגעים', 'תקופה', 'אורות', 'בגדיה',
]);

export const VALID_WORDS: string[] = _clean([
  ...ANSWER_WORDS_CLEAN,
  ...EXTRA_VALID_WORDS,
]);

// Day 0 of the puzzle calendar. Must match PUZZLE_EPOCH in lib/time.ts so the
// word, the puzzle number, and the leaderboard all key off the same day index.
const PUZZLE_EPOCH_UTC = Date.UTC(2024, 0, 1);
const MS_PER_DAY = 86_400_000;

/** Whole days from the puzzle epoch to YYYY-MM-DD, or null if unparseable. */
const dayNumber = (dateStr: string): number | null => {
  const [y, m, d] = dateStr.split('-').map(Number);
  if ([y, m, d].some((n) => !Number.isFinite(n))) return null;
  return Math.floor((Date.UTC(y, m - 1, d) - PUZZLE_EPOCH_UTC) / MS_PER_DAY);
};

/** Tiny stable hash of a string — only the date-string fallback path uses it. */
const hashStr = (s: string): number => {
  let hash = 0;
  for (let i = 0; i < s.length; i++) hash = (hash * 31 + s.charCodeAt(i)) >>> 0;
  return hash;
};

/** Deterministic PRNG seeded from a 32-bit integer (mulberry32). */
const mulberry32 = (seed: number): (() => number) => {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

/** A deterministic shuffle of [0..n) for a given cycle, via Fisher–Yates. */
const cyclePermutation = (n: number, cycle: number): number[] => {
  const idx = Array.from({ length: n }, (_, i) => i);
  const rnd = mulberry32((Math.imul(cycle, 2654435761) ^ 0x9e3779b9) >>> 0);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  return idx;
};

/**
 * Returns a deterministic word for a given date string (YYYY-MM-DD).
 * Same date always returns the same word, so every player gets the same daily
 * puzzle (keyed off israelDateStr()).
 *
 * Words are walked as a shuffled permutation of the whole pool: each cycle of
 * `pool.length` days plays every word exactly once (in a per-cycle reshuffled
 * order) before any repeats. That guarantees full coverage — every curated word
 * is reachable, with the minimum gap between repeats ~pool.length days — instead
 * of a raw modulo hash, which clustered onto a fraction of the pool and left
 * many words permanently unreachable. Expanding ANSWER_WORDS_CLEAN lengthens the
 * cycle but does not change this contract.
 */
export function getDailyWord(dateStr: string): string {
  const words = ANSWER_WORDS_CLEAN.length > 0 ? ANSWER_WORDS_CLEAN : ['תפילה'];
  const n = words.length;
  const day = dayNumber(dateStr);
  // Unparseable date: fall back to a stable hash so we still return a word.
  if (day === null) return words[hashStr(dateStr) % n];
  const cycle = Math.floor(day / n);
  const within = ((day % n) + n) % n; // non-negative even for pre-epoch dates
  return words[cyclePermutation(n, cycle)[within]];
}

export function isValidWord(word: string): boolean {
  return VALID_WORDS.includes(word) || ANSWER_WORDS_CLEAN.includes(word);
}
