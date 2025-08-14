const STOPWORDS = new Set([
  'the','and','or','of','a','an','with','in','on','for','to','from','by','at',
  'oz','lb','lbs','g','kg','ml','l','cup','cups','tsp','tbsp','teaspoon','tablespoon',
  'fresh','organic','best','before','use','by','sell','date','keep','refrigerated'
]);

export function extractIngredients(raw: string) {
  if (!raw) return [];
  const words = raw
    .toLowerCase()
    .replace(/[\u2019']/g, '')     // smart quotes/apostrophes
    .replace(/[^a-z0-9\s-]/g, ' ') // strip punctuation but keep hyphens
    .split(/\s+/)
    .filter(Boolean);

  const tokens = words
    .map(w => w.replace(/^\d+[%a-z]*$/, '')) // drop pure measures like 2%, 12oz
    .filter(Boolean);

  const result = new Set<string>();
  for (let i = 0; i < tokens.length; i++) {
    const w = tokens[i];
    if (STOPWORDS.has(w) || w.length < 2) continue;

    const next = tokens[i + 1];
    const bigram = next && !STOPWORDS.has(next) ? `${w} ${next}` : '';
    if (bigram) {
      result.add(bigram);
      i++; // skip next
    } else {
      result.add(w);
    }
  }

  const normalized = Array.from(result).map(s =>
    s.replace(/bell\s*pepper(s)?/, 'bell pepper')
     .replace(/chiles?/, 'chili')
     .trim()
  );

  return Array.from(new Set(normalized)).sort((a, b) => b.length - a.length).slice(0, 50);
}
