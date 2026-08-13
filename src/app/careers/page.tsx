import type { Metadata } from "next";
import styles from "./careers.module.css";

export const metadata: Metadata = {
  title: "Careers — Nums AI",
  description:
    "넘즈에이아이와 함께 정형 데이터 파운데이션 모델을 만들 동료를 찾습니다.",
  openGraph: {
    title: "Careers — Nums AI",
    description:
      "넘즈에이아이와 함께 정형 데이터 파운데이션 모델을 만들 동료를 찾습니다.",
    type: "website",
    siteName: "Nums AI",
  },
};

const roles = [
  {
    id: "machine-learning-engineer",
    title: "Machine Learning Engineer",
    introduction:
      "TFM을 빠르고 효과적으로 서빙할 수 있는 제품을 만드는 역할입니다. 다양한 데이터와 실행 환경을 지원하는 추론 시스템을 만들고, 고객 현장에서 발견한 문제를 다시 제품과 연구로 연결합니다.",
    responsibilities: [
      "사전학습된 TFM의 추론 파이프라인을 설계하고 고도화합니다.",
      "TFM이 더 다양한 종류의 데이터 및 질의 유형에 대해 동작할 수 있도록 확장합니다.",
      "API, 온프레미스 등 고객 환경에 맞는 다양한 형태로 모델을 서빙합니다.",
      "모델 성능과 추론 속도를 측정하고 확장성, 안정성 및 사용성을 검증합니다.",
      "반복적으로 발견되는 고객 요구와 실패 사례를 연구해 제품에 탑재합니다.",
    ],
    qualifications: [
      "PyTorch 등 딥러닝 프레임워크를 활용해 모델을 개발한 경험이 있는 분",
      "Python을 능숙하게 사용하고 테스트와 유지보수가 가능한 코드를 작성할 수 있는 분",
      "머신러닝 학습, 추론 파이프라인과 데이터 처리 과정에 대한 이해가 있는 분",
      "실험 결과를 체계적으로 분석하고 재현 가능한 코드로 구현할 수 있는 분",
      "정답이 정해지지 않은 문제를 주도적으로 정의하고 끝까지 해결하는 분",
    ],
    preferred: [
      "트랜스포머, 정형 데이터 모델, 그래프 신경망 또는 인컨텍스트 러닝 경험",
      "분산 학습, GPU 프로파일링 및 추론 최적화 경험",
      "모델 서빙, API 또는 데이터 파이프라인을 구축하고 운영한 경험",
      "클라우드 또는 온프레미스 환경에서 머신러닝 시스템을 배포한 경험",
      "최신 논문을 빠르게 이해하고 실제 시스템에 적용한 경험",
    ],
  },
  {
    id: "solutions-engineer",
    title: "Solutions Engineer",
    introduction:
      "시장과 고객을 발굴하는 일부터 고객의 문제를 해결하고 계약으로 전환하는 일까지 전 과정을 책임집니다. 고객의 데이터와 업무를 깊이 이해하고 엔지니어와 함께 TFM의 가치를 증명하는 역할을 맡습니다.",
    responsibilities: [
      "제조, 금융, 커머스, 헬스케어 등 TFM이 가치를 만들 수 있는 고객과 사용 사례를 발굴합니다.",
      "고객사와 만나 현재 업무, 핵심 문제 및 도입 조건을 구체적으로 파악합니다.",
      "고객 문제를 구체적인 PoC 형태로 전환하고 데이터 준비, 기술 검증, 결과 발표까지 전 과정을 주도합니다.",
      "연구자 및 엔지니어와 함께 고객 데이터를 분석하고 TFM의 성능과 운영 가능성을 검증합니다.",
      "PoC 후 고객 피드백을 반영해 제품을 개선하고, 제안과 협상을 주도해 PoC를 유료 계약으로 전환합니다.",
    ],
    qualifications: [
      "기업 고객의 비즈니스 문제와 기술적 요구를 함께 이해하고 해결책을 제안할 수 있는 분",
      "고객 발굴, 컨설팅, 사업개발, 기술 영업 또는 B2B 제품 운영 중 하나 이상의 영역에서 성과를 만들어 본 분",
      "데이터와 머신러닝의 기본 개념을 이해하고 Python 또는 SQL을 활용해 데이터를 살펴볼 수 있는 분",
      "복잡한 기술을 고객의 언어로 명확하게 설명하고 다양한 이해관계자를 설득할 수 있는 분",
      "정해진 답이나 프로세스가 없는 상황에서 가설을 세우고 실행하며 결과에 끝까지 책임지는 분",
    ],
    preferred: [
      "초기 B2B AI 또는 엔터프라이즈 소프트웨어 기업에서 GTM을 처음부터 만들어 본 경험",
      "기업 고객을 대상으로 기술 PoC를 설계하고 유료 계약까지 전환한 경험",
      "고객 환경에서 데이터 파이프라인, API 또는 온프레미스 솔루션을 구축하거나 운영한 경험",
      "제조, 금융, 커머스 또는 헬스케어 산업 경험이나 영어로 고객 업무를 진행한 경험",
    ],
  },
];

const navigation = [
  ["00", "About Nums AI", "about"],
  ["01", "Machine Learning Engineer", "machine-learning-engineer"],
  ["02", "Solutions Engineer", "solutions-engineer"],
  ["03", "Open Application", "open-application"],
  ["04", "Working Conditions & Benefits", "conditions"],
  ["05", "How to Apply", "application"],
];

function List({ children }: { children: string[] }) {
  return (
    <ul className={styles.list}>
      {children.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export default function CareersPage() {
  return (
    <>
      <nav className={styles.nav} aria-label="Careers navigation">
        <a className="brand" href="/" aria-label="Nums AI — home">
          <span className="brand-mark" aria-hidden="true"></span>
          <span className="brand-word" role="img" aria-label="nums ai"></span>
        </a>
        <a className={styles.homeLink} href="/">
          Home
          <span aria-hidden="true">↗</span>
        </a>
      </nav>

      <main className={styles.page} lang="ko">
        <header className={styles.hero}>
          <span className={styles.kicker}>Careers / Nums AI</span>
          <h1>Build the future of prediction.</h1>
          <p className={styles.heroLead}>
            Join our first team expansion as we build a foundation model for
            tables and numbers.
          </p>
          <a className={styles.primaryCta} href="mailto:hiring@nums.world">
            Apply <span aria-hidden="true">↗</span>
          </a>
        </header>

        <div className={styles.contentGrid}>
          <aside className={styles.index} aria-label="페이지 목차">
            <span className={styles.indexLabel}>Open positions</span>
            <ol>
              {navigation.map(([number, label, id], index) => (
                <li
                  className={index >= 1 && index <= 3 ? styles.roleOutlineItem : undefined}
                  key={id}
                >
                  <a href={`#${id}`}>
                    <span>{number}</span>
                    {label}
                  </a>
                </li>
              ))}
            </ol>
          </aside>

          <article className={styles.article}>
            <section className={styles.section} id="about">
              <h2>About Nums AI</h2>
              <div className={styles.prose}>
                <p>
                  주식회사 넘즈에이아이는 표와 숫자를 위한 정형 데이터 파운데이션
                  모델(TFM)을 만드는 AI 스타트업입니다.
                  팀 빌딩 직후 2026년 7월에 40억 원 투자를 받았고 이미 후속 투자를
                  논의하고 있을 만큼 시장의 많은 관심을 받고 있습니다. 5명의 작은
                  팀이지만 국내에서 가장 뛰어난 수준의 AI 및 ML 전문성을 지니고
                  있습니다.
                </p>
                <p>
                  TFM은 기존의 수치 모델이 가진 한계, 즉 모든 새로운
                  데이터셋과 문제에 대해 모델을 새로
                  학습해야 한다는 근본적인 문제를 해결합니다. 수백만 개의
                  데이터셋으로 사전학습된 하나의 수치 모델이 모든 도메인의 다양한
                  예측 문제에 적용됩니다. 제품의 불량 예측, 물류 및 재고
                  최적화, 상품 가격 및 마케팅 최적화, 금융 상품의 대출 심사, 병원
                  환자의 건강 관리까지 하나의 모델이 수행합니다. TFM은 이미
                  개별 데이터셋에 완전히 튜닝된 예측 모델을 상회하는 성능을 보이고
                  있습니다. 앞으로 모든 예측 작업의 표준이 될 것입니다.
                </p>
                <p>
                  시장의 많은 기업들은 AI 기술이라는 포장지 아래 외부 LLM을 호출하는 형태에 그칩니다.
                  저희는 프론티어 모델을 직접 개발합니다. 매주 수백만 개의 표
                  데이터로부터 TFM을 직접 사전학습하고, 수십 개의 새로운 아이디어를
                  실험하고, 시장에서의 가치를 직접 만드는 과정을 수행합니다.
                </p>
                <p>
                  설립 이후 첫 인재 영입을 현재 진행하고 있습니다. 최고의 팀과 함께, 시장의 어떤 AI 기업에서도 하기 어려운 프론티어 모델의 개발, 배포, 그리고 제품화 경험을 할 수 있을 거라 자신합니다.
                </p>
              </div>
            </section>

            {roles.map((role) => (
              <section className={styles.section} id={role.id} key={role.id}>
                <h2>{role.title}</h2>
                <p className={styles.roleIntroduction}>{role.introduction}</p>

                <div className={styles.requirementBlock}>
                  <h3>합류하면 이런 일을 합니다</h3>
                  <List>{role.responsibilities}</List>
                </div>
                <div className={styles.requirementBlock}>
                  <h3>이런 분을 찾습니다</h3>
                  <List>{role.qualifications}</List>
                </div>
                <div className={styles.requirementBlock}>
                  <h3>이런 경험이 있다면 더 좋습니다</h3>
                  <List>{role.preferred}</List>
                </div>
              </section>
            ))}

            <section className={styles.section} id="open-application">
              <h2>Open Application</h2>
              <div className={styles.prose}>
                <p>
                  넘즈에이아이에 필요한 역할을 스스로 정의할 수 있는 분을 기다립니다.
                  정해진 직무, 경력, 전공이나 자격 요건은 없습니다.
                  저희가 아직 발견하지 못한 중요한 문제와 본인이 그 문제를 해결할 수 있는 이유를 알려 주세요.
                  다음 내용을 중심으로 자유롭게 제안해 주시면 됩니다.
                </p>
              </div>
              <List>
                {[
                  "지금 넘즈에이아이에 어떤 역할이 필요하다고 생각하는지",
                  "그 역할을 맡아 어떤 문제를 해결하고 어떤 결과를 만들고 싶은지",
                  "본인이 그 일을 잘할 수 있다고 생각하는 이유와 이를 보여주는 경험 또는 결과물",
                  "합류 후 첫 3개월 동안 무엇을 시도하고 싶은지",
                ]}
              </List>
            </section>

            <section className={styles.section} id="conditions">
              <h2>Working Conditions &amp; Benefits</h2>
              <List>
                {[
                  "회사는 강남역 4번 출구 패스트파이브 강남 1호점에 위치해 있습니다.",
                  "주 5일, 대면, 40시간 근무를 기반으로 하며 코어타임은 오전 10시부터 오후 5시까지입니다.",
                  "모델 개발에 필요한 GPU 클라우드 및 업무를 위한 AI 구독을 최대 한도로 지원합니다.",
                  "급여 및 스톡옵션에 대한 협의는 완전히 열려 있습니다.",
                  "모든 채용은 3개월 기간제 인턴 기간을 전제로 합니다. 꼭 필요한 탐색 기간이라고 생각합니다.",
                ]}
              </List>
            </section>

            <section className={styles.section} id="application">
              <h2>How to Apply</h2>
              <List>
                {[
                  "CV와 자유 형식의 Cover Letter를 보내주세요. 형식과 분량에는 제한이 없습니다.",
                  "서류 접수 이후 영업일 5일 이내에 결과를 안내합니다.",
                  "이후 1-2회의 인터뷰를 통해 직무 적합성을 확인하고 최종 채용 여부를 결정합니다.",
                ]}
              </List>
              <a className={styles.applicationCta} href="mailto:hiring@nums.world">
                hiring@nums.world <span aria-hidden="true">↗</span>
              </a>
            </section>
          </article>
        </div>
      </main>

      <footer className={styles.footer}>
        <div className="wrap foot">
          <a className="brand" href="/" aria-label="Nums AI — home">
            <span className="brand-mark" aria-hidden="true"></span>
            <span className="brand-word" role="img" aria-label="nums ai"></span>
          </a>
          <span className="copy">© 2026 Nums AI Inc.</span>
        </div>
      </footer>
    </>
  );
}
