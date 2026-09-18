import Navigation from "../homepage/Navigation";
import Footer from "../homepage/Footer";
import { Arrow } from "../homepage/Icons";
import type { Locale } from "../homepage/content";
import shared from "../homepage/homepage.module.css";
import styles from "./use-cases.module.css";
import { copy, groups } from "./content";
import data from "./benchmark-data.json";
import ExplorerInteraction from "./ExplorerInteraction";

type Dataset = (typeof data.datasets)[number];
type Variant = keyof Dataset["scores"];
type Problem = keyof (typeof copy.en.task);
const variants: Variant[] = ["default", "tuned", "tuned_ensemble"];
const comparisonVariant: Variant = "tuned_ensemble";
const metricNames: Record<string, string> = { roc_auc: "ROC AUC", log_loss: "Log Loss", rmse: "RMSE" };

function causiloScore(dataset: Dataset) {
  const baseline = dataset.scores.default.find(score => score.name === "Causilo");
  if (!baseline || !Number.isFinite(baseline.mean) || baseline.mean <= 0) {
    throw new Error(`A positive Causilo score is required to plot results: ${dataset.id}`);
  }
  return baseline.mean;
}

// Compare relative error reductions so units and metric direction do not decide
// which dataset leads a domain. For ROC AUC, the corresponding error is 1 - AUC.
function relativeGain(dataset: Dataset) {
  const error = (score: number) => dataset.metric === "roc_auc" ? 1 - score : score;
  const competitors = dataset.scores[comparisonVariant].filter(score => score.name !== "Causilo");
  const bestError = Math.min(...competitors.map(score => error(score.mean)));
  return (bestError - error(causiloScore(dataset))) / bestError;
}

// Require a strict lead over every competitor in all supplied settings.
const featuredDatasets = data.datasets.filter(dataset => {
  const baseline = causiloScore(dataset);
  return variants.every(variant => dataset.scores[variant].every(score =>
    score.name === "Causilo" || (dataset.metric === "roc_auc" ? score.mean < baseline : score.mean > baseline)
  ));
}).sort((a, b) => relativeGain(b) - relativeGain(a) || a.id.localeCompare(b.id));
const featuredGroups = groups.filter(group => featuredDatasets.some(dataset => dataset.group === group.id));

function formatScore(value: number, metric: string) {
  const digits = metric === "rmse" && value >= 10 ? 2 : 4;
  return value.toLocaleString("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits });
}

function Comparison({ dataset, locale }: { dataset: Dataset; locale: Locale }) {
  const text = copy[locale];
  const higher = dataset.metric === "roc_auc";
  const baseline = causiloScore(dataset);
  const scores = dataset.scores[comparisonVariant];
  const worst = higher ? Math.min(...scores.map(score => score.mean)) : Math.max(...scores.map(score => score.mean));
  // Position dots from the worst result on the left to Causilo on the right.
  // A negative range reverses error metrics so better performance is always right.
  const scoreRange = baseline - worst;
  return (
    <div data-case-chart={comparisonVariant}>
      <div className={styles.chartHeading}>
        <span>{text.modelLabel}</span>
        <span className={styles.direction} aria-hidden="true">{text.better}<Arrow /></span>
        <span className={styles.scoreHeading}>{metricNames[dataset.metric]}<span className={higher ? styles.metricArrowUp : styles.metricArrowDown} aria-hidden="true"><Arrow /></span><span className={shared.srOnly}> · {higher ? text.higher : text.lower}</span></span>
      </div>
      <ol className={styles.chart} aria-label={`${dataset.title[locale]} — ${metricNames[dataset.metric]}, ${higher ? text.higher : text.lower}, ${text.setting}`}>
        {scores.map(score => {
          const position = `${scoreRange === 0 ? 100 : 100 * (score.mean - worst) / scoreRange}%`;
          return (
            <li className={score.name === "Causilo" ? styles.causiloRow : undefined} key={score.name}>
              <span className={styles.modelName}>{score.name}</span>
              <span className={styles.plotTrack} aria-hidden="true">
                <span className={styles.plotFill} style={{ width: position }} />
                <span className={styles.plotDot} style={{ left: position }} />
              </span>
              <data value={score.mean} className={styles.score}><span className={shared.srOnly}>{metricNames[dataset.metric]}: </span>{formatScore(score.mean, dataset.metric)}</data>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export default function UseCasesPage({ locale }: { locale: Locale }) {
  const text = copy[locale];
  const initialGroup = featuredGroups[0].id;
  const firstDataset = featuredDatasets.find(dataset => dataset.group === initialGroup)!;
  return (
    <div className={shared.site} lang={locale}>
      <Navigation locale={locale} page="use-cases" />
      <main id="main" className={`${shared.container} ${shared.pageMain}`}>
        <header className={shared.pageHeading}>
          <h1 className={shared.pageTitle}>{text.title}</h1>
          <p className={shared.prose}>{text.introduction}</p>
        </header>
        <div id="use-case-explorer" className={styles.explorer} data-use-cases>
          <div className={styles.groups} role="group" aria-label={text.domains}>
            {featuredGroups.map(group => (
              <button key={group.id} type="button" data-case-group={group.id} aria-pressed={group.id === initialGroup} aria-controls="use-case-results">
                <span className={styles.groupName}>{group.name[locale]}</span>
                <span className={styles.groupCount}>{text.datasetCount(featuredDatasets.filter(dataset => dataset.group === group.id).length)}</span>
              </button>
            ))}
          </div>
          <section id="use-case-results" className={styles.results} aria-label={text.results}>
            <header>
              {featuredGroups.map(group => {
                const datasets = featuredDatasets.filter(dataset => dataset.group === group.id);
                return <div key={group.id} className={styles.datasetPicker} data-case-picker-wrap hidden={group.id !== initialGroup}>
                  <h2>
                    <button type="button" className={styles.datasetTrigger} data-case-trigger aria-haspopup="listbox" aria-expanded="false" aria-controls={`dataset-menu-${group.id}`}>
                      <span className={styles.datasetTriggerAction}>
                        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 9 6 6 6-6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </span>
                      <span className={styles.datasetTriggerText} data-case-title>{datasets[0].title[locale]}</span>
                    </button>
                  </h2>
                  <div id={`dataset-menu-${group.id}`} className={styles.datasetMenu} data-case-menu role="listbox" aria-label={text.dataset} hidden>
                    {datasets.map((dataset, index) => (
                      <button key={dataset.id} type="button" className={styles.datasetOption} data-case-option={dataset.id} role="option" aria-selected={index === 0} tabIndex={-1}>
                        <span>{dataset.title[locale]}</span>
                        <svg viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="m3.5 8 3 3 6-6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </button>
                    ))}
                  </div>
                  <select id={`dataset-${group.id}`} data-case-picker={group.id} defaultValue={datasets[0].id} disabled={group.id !== initialGroup} hidden>
                    {datasets.map(dataset => <option key={dataset.id} value={dataset.id}>{dataset.title[locale]}</option>)}
                  </select>
                </div>;
              })}
            </header>
            <p className={shared.srOnly} role="status" aria-live="polite" data-case-live />
            {featuredDatasets.map(dataset => (
              <article className={styles.datasetBody} key={dataset.id} data-case-panel={dataset.id} hidden={dataset.id !== firstDataset.id} aria-label={dataset.title[locale]}>
                <div className={styles.datasetIntro}>
                  <p className={styles.description}>{dataset.description[locale]}</p>
                  <dl className={styles.facts}>
                    <div><dt>{text.taskLabel}:</dt><dd>{text.task[dataset.problemType as Problem]}</dd></div>
                    <div><dt>{text.rows}:</dt><dd>{dataset.rows.toLocaleString("en-US")}</dd></div>
                    <div><dt>{text.features}:</dt><dd>{dataset.features.toLocaleString("en-US")}</dd></div>
                    <div>
                      <dt className={shared.srOnly}>{text.sourceLabel}</dt>
                      <dd><a href={dataset.sourceUrl} target="_blank" rel="noopener noreferrer">{text.source}<Arrow diagonal /></a></dd>
                    </div>
                  </dl>
                </div>
                <div className={styles.comparison}>
                  <Comparison dataset={dataset} locale={locale} />
                </div>
              </article>
            ))}
          </section>
          <div className={styles.methodology}>
            {featuredDatasets.map(dataset => (
              <p key={dataset.id} data-case-details={dataset.id} hidden={dataset.id !== firstDataset.id}>
                {text.datasetDetails(dataset.id, dataset.splits, dataset.problemType === "regression")}{" "}{text.methodology}
              </p>
            ))}
          </div>
          <ExplorerInteraction />
        </div>
      </main>
      <Footer locale={locale} />
    </div>
  );
}
