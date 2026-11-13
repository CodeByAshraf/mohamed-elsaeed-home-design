/**
 * A headline figure. It used to count up from zero, but a number that keeps changing for two
 * seconds holds back the page's Largest Contentful Paint and costs work every frame, so it now
 * arrives with the rest of the stats row (which rises in via CSS).
 */
export function StatCounter({ value, suffix }: { value: number; suffix: string; delay?: number }) {
  return (
    // Always left to right, so "50+" keeps its sign after the number on Arabic pages.
    <span dir="ltr" className="inline-block tabular-nums">
      {value}
      {suffix}
    </span>
  );
}
