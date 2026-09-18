import type { CSSProperties } from "react";
import type { Locale } from "./content";
import styles from "./tabular-explainer.module.css";

const content = {
  en: {
    description: "Causilo is a foundation model pretrained across millions of tasks. No fine-tuning. Predict instantly. Three illustrative examples show regression from area, rooms, and age to price; classification from temperature, vibration, and load to failure risk; and forecasting from month, past sales, and promotion to next sales. Outlined target cells fill with predictions.",
    tasks: ["Regression", "Classification", "Forecasting"],
    predictions: ["Price", "Failure risk", "Next sales"],
    features: [["Area", "Rooms", "Age"], ["Temp", "Vibration", "Load"], ["Month", "Past sales", "Promo"]],
    pretraining: "Pretraining", pretrainingTitle: "Learned across\nMillions of tasks",
    inference: "Inference", inferenceTitle: "No fine-tuning.\nPredict instantly.",
    modelLabel: "FOUNDATION MODEL", newRows: ["New rows", "New rows", "Future rows"],
  },
  ko: {
    description: "Causilo 파운데이션 모델의 회귀, 분류, 시계열 예측 예시입니다. 면적, 방 수, 연식으로 가격을, 센서 값으로 고장 위험을, 과거 판매 기록으로 미래 판매량을 예측합니다. 각 테이블의 비어 있는 예측 셀이 차례로 채워집니다.",
    tasks: ["회귀", "분류", "시계열 예측"],
    predictions: ["가격", "고장 위험", "미래 판매"],
    features: [["면적", "방 수", "연식"], ["온도", "진동", "부하"], ["월", "과거 판매", "프로모션"]],
    pretraining: "사전학습", pretrainingTitle: "수백만 과제에서 학습",
    inference: "추론", inferenceTitle: "미세조정 없이.\n즉시 예측합니다.",
    modelLabel: "파운데이션 모델", newRows: ["새로운 행", "새로운 행", "미래 행"],
  },
} as const;

function Model({ label }: { label: string }) {
  const layers = [
    { x: 20, nodes: [27, 50, 73] },
    { x: 78, nodes: [12, 31, 50, 69, 88] },
    { x: 136, nodes: [12, 31, 50, 69, 88] },
    { x: 194, nodes: [12, 31, 50, 69, 88] },
    { x: 252, nodes: [27, 50, 73] },
  ];
  const edge = (x1: number, y1: number, x2: number, y2: number) =>
    `M${x1} ${y1}C${x1 + 26} ${y1} ${x2 - 26} ${y2} ${x2} ${y2}`;
  const routes = [[50, 31, 50, 69, 50], [27, 69, 31, 31, 73]];

  return <div className={styles.model}>
    <svg className={styles.network} viewBox="0 0 272 100" fill="none">
      {layers.slice(1, -1).map(({ x }) =>
        <rect key={x} className={styles.networkLayer} x={x - 15} y="1" width="30" height="98" rx="12" />
      )}
      <g className={styles.networkEdges}>
        {layers.slice(0, -1).flatMap((layer, index) =>
          layer.nodes.flatMap((y1) => layers[index + 1].nodes.map((y2) =>
            <path key={`${index}-${y1}-${y2}`} d={edge(layer.x, y1, layers[index + 1].x, y2)} />
          ))
        )}
      </g>
      {routes.map((route, routeIndex) =>
        <path key={routeIndex} className={styles.networkSignal}
          d={layers.slice(0, -1).map((layer, index) => edge(layer.x, route[index], layers[index + 1].x, route[index + 1])).join(" ")}
          pathLength="100" style={{ "--pulse-delay": `${routeIndex * 0.4}s` } as CSSProperties} />
      )}
      {layers.map(({ x, nodes }, index) =>
        <g key={x} style={{ "--pulse-delay": `${index * 0.3}s` } as CSSProperties}>
          {nodes.map((y) => <g key={y}>
            <circle className={styles.nodeHalo} cx={x} cy={y} r="7" />
            <circle className={styles.node} cx={x} cy={y} r="3.2" />
          </g>)}
        </g>
      )}
    </svg>
    <span className={styles.modelIdentity}><span className={styles.modelName}>Causilo</span><span className={styles.modelLabel}>{label}</span></span>
  </div>;
}

function Insight({ kind, label, title }: { kind: "pretraining" | "inference"; label: string; title: string }) {
  return <div className={styles.insight}>
    <div className={styles.insightLabel}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
        {kind === "pretraining" ? <><path d="m3 7 9-4 9 4-9 4ZM3 12l9 4 9-4M3 17l9 4 9-4" /></> : <><rect x="5" y="10" width="14" height="11" rx="3" /><path d="M8 10V7a4 4 0 0 1 8 0v3m-4 4v3" /></>}
      </svg>
      <span>{label}</span>
    </div>
    <p className={styles.insightTitle}>{title}</p>
  </div>;
}

function Connections() {
  const paths = ["M100 0C100 58 0 42 0 100", "M50 0V100", "M0 0C0 58 100 42 100 100"];
  return <div className={styles.connections}>
    {paths.map((path, index) =>
      <svg key={path} className={styles.connection} viewBox="0 0 100 100" preserveAspectRatio="none" fill="none" style={{ "--delay": `${index * 4}s` } as CSSProperties}>
        <path className={styles.connector} d={path} vectorEffect="non-scaling-stroke" />
        <path className={styles.signal} d={path} pathLength="100" vectorEffect="non-scaling-stroke" />
      </svg>
    )}
  </div>;
}

function Table({ variant, locale }: { variant: number; locale: Locale }) {
  const copy = content[locale];
  const tones = ["#e4e4e4", "#d7d7d7", "#ececec", "#c8c8c8"];
  const cells = (rows: number, predict: boolean) => Array.from({ length: 4 * rows }, (_, index) => {
    const row = Math.floor(index / 4);
    const isTarget = index % 4 === 3;
    const cellClass = isTarget ? (predict ? styles.target : styles.known) : "";
    return <i key={index} className={`${styles.cell} ${cellClass}`} style={{
      "--tone": tones[(index * 3 + row + variant) % tones.length],
      "--row-delay": `${row * 0.1}s`,
    } as CSSProperties} />;
  });
  return <div className={styles.sheet}>
    <div className={styles.sheetTop}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round">
        {variant === 0 ? <><path d="M4 4v16h16M7 16l11-9" /><circle cx="8" cy="10" r="1" /><circle cx="16" cy="15" r="1" /></> : variant === 1 ? <><circle cx="7" cy="7" r="2" /><circle cx="5" cy="14" r="2" /><circle cx="12" cy="9" r="2" /><rect x="14" y="15" width="4" height="4" rx=".6" /><rect x="18" y="7" width="4" height="4" rx=".6" /></> : <><path d="M3 4v16h18M6 16l4-5 4 2" /><path d="m14 13 3-6 4 2" strokeDasharray="2 2" /></>}
      </svg>
      <span>{copy.tasks[variant]}</span>
    </div>
    <div className={styles.featureHeaders}>
      {copy.features[variant].map((feature) => <span key={feature}>{feature}</span>)}
      <span className={styles.targetHeader}>{copy.predictions[variant]}</span>
    </div>
    <div className={`${styles.grid} ${styles.contextCells}`}>{cells(3, false)}</div>
    <div className={styles.newRowsLabel}><span>{copy.newRows[variant]}</span></div>
    <div className={styles.grid}>{cells(2, true)}</div>
    <div className={styles.tableFooter}>
      <span>{copy.predictions[variant]}</span>
      <svg className={styles.resultGlyph} viewBox="0 0 66 22" fill="none">
        {variant === 0 ? <><path className={styles.resultGuide} d="M1 20H65" /><path className={styles.resultStroke} d="m2 17 10-3 10 2 10-8 10 3 10-6 10-2" /><circle cx="62" cy="3" r="2" fill="currentColor" /></> : variant === 2 ? <><path className={styles.resultGuide} d="M1 20H65M38 1V20" /><path className={styles.resultStroke} d="m2 17 9-5 9 3 9-8 9 3" /><g fill="currentColor"><circle cx="46" cy="5" r="1.8" /><circle cx="54" cy="7" r="1.8" /><circle cx="63" cy="2" r="1.8" /></g></> : <>
          {[7, 19, 31, 43, 55].map((x, index) => <circle key={x} cx={x} cy={index % 2 ? 8 : 14} r="3" fill={index < 2 ? "currentColor" : "#d4d4d4"} />)}
        </>}
      </svg>
    </div>
  </div>;
}

export default function TabularExplainer({ locale }: { locale: Locale }) {
  const copy = content[locale];
  return <figure id="model-figure" className={`${styles.figure} ${styles.stage}`}>
      <div role="img" aria-label={copy.description}>
        <div aria-hidden="true">
          <div className={styles.modelRow}>
            <Insight kind="pretraining" label={copy.pretraining} title={copy.pretrainingTitle} />
            <Model label={copy.modelLabel} />
            <Insight kind="inference" label={copy.inference} title={copy.inferenceTitle} />
          </div>
          <Connections />
          <div className={styles.tables}>
            {copy.tasks.map((task, index) => <div key={task} className={styles.table}>
              <Table variant={index} locale={locale} />
            </div>)}
          </div>
        </div>
      </div>
  </figure>;
}
