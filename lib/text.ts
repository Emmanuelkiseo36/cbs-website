export function splitWords(text: string, perLine = 3): string[][] {
  const words = text.trim().split(/\s+/).filter(Boolean);
  const lines: string[][] = [];
  for (let i = 0; i < words.length; i += perLine) {
    lines.push(words.slice(i, i + perLine));
  }
  return lines.length ? lines : [['']];
}