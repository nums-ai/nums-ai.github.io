type Pattern = "customers" | "finance" | "health" | "operations" | "science" | "pricing" | "people" | "software";

// A shared visual alphabet of rows, columns, and cells. These are abstract
// brand patterns, not charts or benchmark measurements.
export default function DataPattern({ variant, className }: { variant: Pattern; className?: string }) {
  const intensity = (x: number, y: number) => {
    switch (variant) {
      case "customers": return Math.max(0, 1 - Math.hypot(x - 4, y - 3) / 4);
      case "finance": return y >= 6 - Math.floor(x / 2) ? .85 - (6 - y) * .08 : .08;
      case "health": return x >= 4 && x <= 6 || y >= 2 && y <= 4 ? .78 : .06;
      case "operations": return (x + y * 2) % 5 < 2 ? .75 : .08;
      case "science": return Math.abs(Math.hypot(x - 5, (y - 3) * 1.5) - 3) < 1.1 ? .82 : .08;
      case "pricing": return Math.abs(y - (6 - x * .5)) < 1.2 ? .85 : .08;
      case "people": return x % 4 < 2 && y % 4 < 2 ? .8 : .08;
      case "software": return ((x * 7 + y * 11) % 13) < 5 ? .75 : .08;
    }
  };
  return <svg className={className} viewBox="0 0 216 136" fill="currentColor" aria-hidden="true">
    {Array.from({ length: 77 }, (_, index) => {
      const x = index % 11;
      const y = Math.floor(index / 11);
      return <rect key={index} x={x * 20 + 2} y={y * 20 + 2} width="12" height="12" rx="2" opacity={intensity(x, y)} />;
    })}
  </svg>;
}
