import type { CSSProperties } from "react";
import benchmark from "./benchmark-data.json";
import { content, type Locale } from "./content";
import EloChartInteraction from "./EloChartInteraction";
import styles from "./elo-chart.module.css";

const variants = ["default", "tuned", "tuned_ensemble"] as const;
const colors = { default: "#d6d6d6", tuned: "#a3a3a3", tuned_ensemble: "#707070" };
const names: Record<string, string> = { RandomForest: "Random Forest" };
// Keep the source results intact while selecting the compact homepage comparison.
const displayedModels = new Set(["RandomForest", "XGBoost", "CatBoost", "LightGBM", "Causilo"]);
const families = benchmark.plottedFamilies.filter(family => displayedModels.has(family.name));
const chartCopy = {
  en: {
    variants: { default: "Default", tuned: "Tuned (4 hours)", tuned_ensemble: "Tuned + Ensembled (4 hours)" },
    controls: "Baseline model configurations. Causilo remains visible with its default configuration.",
    instructions: "Use arrow keys to move between bars and hear their Elo scores.",
    caption: "Elo scores on TabArena, officially provided on September 14. Higher is better.",
    keepOne: "Keep at least one baseline configuration visible.",
  },
  ko: {
    variants: { default: "기본 설정", tuned: "튜닝 (4시간)", tuned_ensemble: "튜닝 + 앙상블 (4시간)" },
    controls: "비교 모델 설정. Causilo는 기본 설정으로 항상 표시됩니다.",
    instructions: "화살표 키로 막대를 이동하면 Elo 점수를 들을 수 있습니다.",
    caption: "9월 14일 공식 제공된 TabArena Elo 점수입니다. 높을수록 좋습니다.",
    keepOne: "비교 모델 설정을 하나 이상 표시해야 합니다.",
  },
};

// Preserve the static plot's fixed scale and family order when filtering series.
const geometry = { width: 620, height: 350, left: 54, right: 10, top: 38, bottom: 292, min: 900, max: 2000 };
const y = (elo: number) => geometry.bottom - (elo - geometry.min) / (geometry.max - geometry.min) * (geometry.bottom - geometry.top);
const format = (value: number) => value.toLocaleString("en-US", { useGrouping: false, minimumFractionDigits: 1, maximumFractionDigits: 1 });

export default function EloChart({ locale }: { locale: Locale }) {
  const copy = chartCopy[locale];
  const page = content[locale];
  const groupWidth = (geometry.width - geometry.left - geometry.right) / families.length;

  return <figure className={styles.figure} data-elo-chart data-locale={locale} data-keep-one={copy.keepOne}>
    <div className={styles.panel} data-elo-panel>
      <div className={styles.legend} role="group" aria-label={copy.controls}>
        {variants.map(variant => <button type="button" key={variant} data-elo-toggle={variant} aria-pressed="true" className={styles.legendButton} style={{ "--series-color": colors[variant] } as CSSProperties}>
          <span aria-hidden="true" />{copy.variants[variant]}
        </button>)}
      </div>
      <p id="elo-instructions" className={styles.srOnly}>{copy.instructions}</p>
      <div className={styles.viewport} data-elo-viewport role="region" aria-label={page.benchmarkPlotLabel} aria-describedby="elo-instructions">
        <svg className={styles.chart} viewBox={`0 ${geometry.top} ${geometry.width} ${geometry.height - geometry.top}`} role="group" aria-label={page.benchmarkPlotLabel}>
          <g aria-hidden="true" className={styles.axis}>
            {[900, 1100, 1300, 1500, 1700, 1900].map(tick => <g key={tick}>
              <line x1={geometry.left} x2={geometry.width - geometry.right} y1={y(tick)} y2={y(tick)} />
              <text x={geometry.left - 13} y={y(tick) + 4} textAnchor="end">{tick}</text>
            </g>)}
          </g>
          {families.map((family, index) => {
            const x = geometry.left + groupWidth * (index + .5);
            const name = names[family.name] ?? family.name;
            const isCausilo = family.name === "Causilo";
            const rows = variants.flatMap(variant => family.variants.filter(row => row.variant === variant));
            const best = Math.max(...rows.map(row => row.elo));
            const labelY = y(best) - 13;
            return <g key={family.name} data-elo-family={family.name}>
              {rows.map((row, rowIndex) => {
                const variant = row.variant as typeof variants[number];
                const offset = isCausilo ? 0 : (rowIndex - 1) * 27;
                const center = x + offset;
                const width = isCausilo ? 44 : 23;
                const top = y(row.elo);
                return <g key={row.method} className={styles.barGroup} role="img" tabIndex={0}
                  aria-label={`${name}, ${copy.variants[variant]}, Elo ${format(row.elo)}`}
                  data-elo-bar data-model={name} data-variant={variant}
                  data-elo={row.elo} data-label-y={top - 13} data-original-offset={offset} data-reference={isCausilo ? "true" : undefined}>
                  <rect x={center - width / 2 - 6} y={top - 6} width={width + 12} height={geometry.bottom - top + 12} fill="transparent" />
                  <rect className={styles.bar} x={center - width / 2} y={top} width={width} height={geometry.bottom - top} rx="1" fill={isCausilo ? "#171717" : colors[variant]} />
                  <rect className={styles.focusRing} x={center - width / 2 - 4} y={top - 4} width={width + 8} height={geometry.bottom - top + 8} rx="3" />
                </g>;
              })}
              <text className={`${styles.scoreLabel} ${isCausilo ? styles.referenceLabel : ""}`} data-elo-score x={x} y={labelY} textAnchor="middle" aria-hidden="true">{format(best)}</text>
              <text className={`${styles.familyLabel} ${isCausilo ? styles.referenceLabel : ""}`} x={x} y={geometry.bottom + 33} textAnchor="middle" aria-hidden="true">{name}</text>
            </g>;
          })}
        </svg>
      </div>
    </div>
    <figcaption className={styles.caption}>{copy.caption}</figcaption>
    <EloChartInteraction />
  </figure>;
}
