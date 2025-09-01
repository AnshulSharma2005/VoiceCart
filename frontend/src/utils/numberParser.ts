export function extractQuantity(raw: string): number {
  const text = raw.toLowerCase();

  // special cases
  if (text.includes("half a dozen")) return 6;
  if (text.includes("dozen")) {
    const digitMatch = text.match(/\b\d+\b/);
    if (digitMatch) {
      return parseInt(digitMatch[0], 10) * 12; // e.g. "2 dozen" = 24
    }
    // word-based dozen (e.g. "one dozen", "three dozen")
    const words = text.split(/\s+/);
    const numberWords: Record<string, number> = {
      one: 1, two: 2, three: 3, four: 4, five: 5,
      six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
      eleven: 11, twelve: 12
    };
    for (const w of words) {
      if (numberWords[w] !== undefined) {
        return numberWords[w] * 12;
      }
    }
    return 12; // default "dozen" = 12
  }

  if (text.includes("couple")) return 2;
  if (text.includes("few")) return 3;

  // digit numbers
  const digitMatch = text.match(/\b\d+\b/);
  if (digitMatch) {
    return parseInt(digitMatch[0], 10);
  }

  // word-based numbers
  const numberWords: Record<string, number> = {
    zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5,
    six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
    eleven: 11, twelve: 12, thirteen: 13, fourteen: 14,
    fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18,
    nineteen: 19, twenty: 20, thirty: 30, forty: 40,
    fifty: 50, sixty: 60, seventy: 70, eighty: 80,
    ninety: 90, hundred: 100, thousand: 1000
  };

  const words = text.split(/\s+/);
  let total = 0;
  let current = 0;

  for (const word of words) {
    if (numberWords[word] !== undefined) {
      const value = numberWords[word];
      if (value === 100 || value === 1000) {
        current = (current || 1) * value;
      } else {
        current += value;
      }
      continue;
    }
    if (current > 0) {
      total += current;
      current = 0;
    }
  }
  total += current;

  return total > 0 ? total : 1;
}
