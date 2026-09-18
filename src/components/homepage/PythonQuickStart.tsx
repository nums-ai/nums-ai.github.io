import { links, type Locale } from "./content";
import { Arrow } from "./Icons";
import PythonQuickStartInteraction from "./PythonQuickStartInteraction";
import layout from "./homepage.module.css";
import styles from "./python-quick-start.module.css";

const copy = {
  en: {
    title: "Start with Python",
    description: "Run Causilo locally with a familiar scikit-learn interface. Get the code and pretrained weights, then try it on your own data.",
    copy: "Copy",
    copied: "Copied",
    failed: "Try again",
    installLabel: "Copy install command",
    installSuccess: "Install command copied to clipboard.",
    copyError: "Copy failed. You can select and copy the code directly.",
  },
  ko: {
    title: "Python으로 시작하세요",
    description: "익숙한 scikit-learn 인터페이스로 Causilo를 로컬에서 실행하세요. 코드와 사전 학습된 가중치를 받아 자신의 데이터에 직접 적용해 보세요.",
    copy: "복사",
    copied: "복사 완료",
    failed: "다시 시도",
    installLabel: "설치 명령어 복사",
    installSuccess: "설치 명령어를 클립보드에 복사했습니다.",
    copyError: "복사하지 못했습니다. 코드를 선택해 직접 복사할 수 있습니다.",
  },
} as const;

function CopyIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <rect x="8" y="8" width="12" height="12" rx="2" />
      <path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" />
    </svg>
  );
}

export default function PythonQuickStart({ locale }: { locale: Locale }) {
  const text = copy[locale];

  return (
    <section
      id="research"
      className={`${layout.container} ${layout.editorialSection} ${styles.section}`}
      aria-labelledby="quick-start-title"
      data-python-quick-start
      data-copy-label={text.copy}
      data-copied-label={text.copied}
      data-failed-label={text.failed}
      data-copy-error={text.copyError}
    >
      <div className={styles.introduction}>
        <h2 id="quick-start-title" className={layout.sectionTitle}>{text.title}</h2>
        <p className={layout.prose}>{text.description}</p>
        <div className={layout.resourceLinks}>
          <a href={links.github} target="_blank" rel="noopener noreferrer">GitHub<Arrow diagonal /></a>
          <a href={links.model} target="_blank" rel="noopener noreferrer">Hugging Face<Arrow diagonal /></a>
        </div>
      </div>

      <div className={styles.codePanel}>
        <div className={styles.installRow}>
          <div className={styles.installCommand}>
            <span className={styles.prompt} aria-hidden="true">$</span>
            <code data-copy-source="install">pip install causilo</code>
          </div>
          <button type="button" className={styles.copyButton} data-copy-target="install" data-copy-success={text.installSuccess} aria-label={text.installLabel}>
            <CopyIcon /><span data-copy-label>{text.copy}</span>
          </button>
        </div>
        <div className={styles.example}>
          <span className={styles.lineNumbers} aria-hidden="true">{"1\n2\n3\n4\n5"}</span>
          <pre tabIndex={0} aria-label={locale === "ko" ? "Causilo 회귀 예제" : "Causilo regression example"}>
            <code data-copy-source="example"><span className={styles.keyword}>from</span>{" causilo "}<span className={styles.keyword}>import</span>{" "}<span className={styles.className}>CausiloRegressor</span>{"\n\nmodel = "}<span className={styles.className}>CausiloRegressor</span>{"()\nmodel."}<span className={styles.method}>fit</span>{"(X_train, y_train)\npredictions = model."}<span className={styles.method}>predict</span>{"(X_test)"}</code>
          </pre>
        </div>
      </div>
      <span className={layout.srOnly} role="status" data-copy-status />
      <PythonQuickStartInteraction />
    </section>
  );
}
