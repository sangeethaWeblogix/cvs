const NAMED: Record<string, string> = {
  nbsp: " ",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  hellip: "…",
  ndash: "–",
  mdash: "—",
  lsquo: "‘",
  rsquo: "’",
  ldquo: "“",
  rdquo: "”",
  times: "×",
};

/** Pure (server + client safe) decoder for the HTML entities WordPress puts in
 * blog titles/excerpts, e.g. "4&#215;4" -> "4×4". */
export function decodeEntities(s = ""): string {
  return s
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&([a-zA-Z]+);/g, (m, n) => NAMED[n] ?? m)
    .replace(/&amp;/g, "&");
}

/** Excerpt text with WordPress's trailing "[…]" shown as a plain "...". */
export function cleanExcerpt(s = ""): string {
  return decodeEntities(s)
    .replace(/\s*\[(?:…|\.\.\.)\]\s*$/, "...")
    .trim();
}
