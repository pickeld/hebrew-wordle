// Validates constants/words.ts: every answer/valid word is exactly 5 Hebrew
// letters and the answer pool has no duplicates. Run: node scripts/check-words.mjs
// Exits non-zero on any problem so it can gate CI.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = readFileSync(join(root, 'constants', 'words.ts'), 'utf8');

// Pull the literal words out of each array (works without a TS toolchain).
function arrayWords(name) {
  const m = src.match(new RegExp(`${name}[^=]*=\\s*_clean\\(\\[([\\s\\S]*?)\\]\\)`));
  if (!m) throw new Error(`Could not find array ${name}`);
  return [...m[1].matchAll(/'([^']+)'/g)].map((x) => x[1]);
}

const HEBREW_5 = /^[א-ת]{5}$/;
let problems = 0;
const report = (label, words) => {
  const seen = new Set();
  const dupes = new Set();
  const badLen = [];
  for (const w of words) {
    if (!HEBREW_5.test(w)) badLen.push(w);
    if (seen.has(w)) dupes.add(w);
    seen.add(w);
  }
  console.log(`${label}: ${words.length} raw, ${seen.size} unique`);
  if (badLen.length) {
    problems += badLen.length;
    console.error(`  ✗ not 5 Hebrew letters (${badLen.length}): ${badLen.join(', ')}`);
  }
  if (dupes.size) {
    problems += dupes.size;
    console.error(`  ✗ duplicates (${dupes.size}): ${[...dupes].join(', ')}`);
  }
};

report('ANSWER_WORDS_CLEAN', arrayWords('ANSWER_WORDS_CLEAN'));
report('EXTRA_VALID_WORDS', arrayWords('EXTRA_VALID_WORDS'));

if (problems) {
  console.error(`\nFAILED with ${problems} problem(s).`);
  process.exit(1);
}
console.log('\nOK — all words are 5 Hebrew letters with no duplicates.');
