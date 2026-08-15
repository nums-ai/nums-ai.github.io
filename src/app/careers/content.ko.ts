// Original Korean Careers page copy.
// Page structure and styling live in [[...locale]]/page.tsx and careers.module.css.

export const careersContentKo = {
  metadata: {
    title: "Careers — Nums AI",
    description:
      "넘즈에이아이와 함께 정형 데이터 파운데이션 모델을 만들 동료를 찾습니다.",
  },
  navigation: {
    home: "Home",
  },
  hero: {
    kicker: "Careers / Nums AI",
    title: "Build the future of prediction.",
    subtitle:
      "Join our first team expansion as we build a foundation model for tables and numbers.",
    cta: "Apply",
  },
  outline: {
    label: "Open positions",
    items: [
      ["00", "About Nums AI", "about"],
      ["01", "Machine Learning Engineer", "machine-learning-engineer"],
      ["02", "Business Development", "business-development"],
      ["03", "Open Application", "open-application"],
      ["04", "Working Conditions & Benefits", "conditions"],
      ["05", "How to Apply", "application"],
    ],
  },
  about: {
    title: "About Nums AI",
    paragraphs: [
      "넘즈에이아이는 표와 숫자를 위한 정형 데이터 파운데이션 모델(TFM)을 만드는 AI 스타트업입니다. 세계적인 AI 연구를 선도할 수 있는 전문성을 갖추고, 수치 예측을 위한 글로벌 프론티어 모델을 직접 개발합니다.",
      "TFM은 기존 수치 예측 모델의 근본적인 한계를 해결합니다. 기존에는 새로운 데이터셋과 문제가 주어질 때마다 별도의 예측 모델을 학습하고 튜닝해야 했습니다. 반면 TFM은 수백만 개의 데이터셋으로 사전학습되어 하나의 모델이 다양한 도메인의 예측 문제에 적용됩니다. 제품 불량 예측, 물류 및 재고 최적화, 가격 및 마케팅 최적화, 금융 상품의 대출 심사, 환자 건강 관리까지 하나의 모델로 수행합니다. TFM은 이미 개별 데이터셋에 대해 완전히 튜닝된 예측 모델을 뛰어넘는 성능을 보이고 있으며, 앞으로 다양한 예측 작업의 새로운 표준이 될 것입니다.",
      "시장의 많은 기업들이 외부의 대형언어모델 API를 활용해 AI 제품을 만드는 것과 달리, 저희는 프론티어 모델을 직접 개발합니다. 수백만 개의 표 데이터로 TFM을 직접 사전학습하고, 수십 개의 새로운 아이디어를 실험하며, 이를 시장에서 바로 쓰일 수 있는 기술과 제품으로 발전시키고 있습니다.",
      "이 여정을 함께할 인재를 찾고 있습니다. 글로벌 프론티어 모델을 직접 연구하고, 사전학습하며, 실제 환경에 배포하고, 제품화하는 전 과정을 함께하게 됩니다. 저희는 기업의 데이터베이스를 통째로 이해하는 새로운 형태의 AI 솔루션을 만들고, 데이터 기반 의사결정이 이루어지는 방식 자체를 바꾸고자 합니다.",
    ],
  },
  roleLabels: {
    responsibilities: "합류하면 이런 일을 합니다",
    qualifications: "이런 분을 찾습니다",
    preferred: "이런 경험이 있다면 더 좋습니다",
  },
  roles: [
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
      id: "business-development",
      title: "Business Development",
      introduction:
        "제품과 시장을 연결해 고객이 가지고 있는 실제 문제를 해결하는 역할입니다. 고객의 데이터와 업무를 깊이 이해하고, 문제를 정의하고, 목표를 수립하고, TFM이 최적의 결과를 낼 수 있도록 설계합니다.",
      responsibilities: [
        "제조, 금융, 커머스, 헬스케어 등 TFM이 가치를 만들 수 있는 고객과 사용 사례를 발굴합니다.",
        "고객의 업무, 핵심 문제, 예산, 의사결정 구조 및 도입 조건을 구체적으로 파악합니다.",
        "고객 문제를 PoC로 구조화하고 목표, 성공 기준, 일정 및 필요한 자원을 정의합니다.",
        "연구자 및 엔지니어와 협업해 PoC가 일정과 목표에 맞게 진행되도록 조율합니다.",
        "고객 피드백과 영업 과정에서 얻은 정보를 제품 방향 및 세일즈 자료에 반영합니다.",
      ],
      qualifications: [
        "B2B 영업, 사업개발, 컨설팅 또는 초기 스타트업 운영에서 직접 결과를 만들어 본 분",
        "복잡한 고객 문제를 빠르게 구조화하고 명확한 실행 계획으로 전환할 수 있는 분",
        "다양한 이해관계자와 신뢰를 형성하고 기술의 가치를 고객의 언어로 설명할 수 있는 분",
        "데이터와 머신러닝의 기본 개념을 이해하고 연구자 및 엔지니어와 원활하게 협업할 수 있는 분",
        "정해진 답이나 프로세스가 없는 상황에서 직접 우선순위를 정하고 실행하는 분",
      ],
      preferred: [
        "초기 B2B AI 또는 엔터프라이즈 소프트웨어 기업에서 GTM을 처음부터 만들어 본 경험",
        "기술 PoC를 설계하고 유료 계약 또는 장기 고객으로 전환한 경험",
        "CRM, 영업 파이프라인, 제안서, 세일즈 자료 및 고객 운영 프로세스를 구축한 경험",
        "Python이나 SQL로 고객 데이터를 직접 살펴볼 수 있거나 영어로 고객 업무를 진행한 경험",
      ],
    },
  ],
  openApplication: {
    id: "open-application",
    title: "Open Application",
    paragraphs: [
      "넘즈에이아이에 필요한 역할을 스스로 정의할 수 있는 분을 기다립니다. 정해진 직무, 경력, 전공이나 자격 요건은 없습니다. 저희가 아직 발견하지 못한 중요한 문제와 본인이 그 문제를 해결할 수 있는 이유를 알려 주세요. 다음 내용을 중심으로 자유롭게 제안해 주시면 됩니다.",
    ],
    bullets: [
      "지금 넘즈에이아이에 어떤 역할이 필요하다고 생각하는지",
      "그 역할을 맡아 어떤 문제를 해결하고 어떤 결과를 만들고 싶은지",
      "본인이 그 일을 잘할 수 있다고 생각하는 이유와 이를 보여주는 경험 또는 결과물",
      "합류 후 첫 3개월 동안 무엇을 시도하고 싶은지",
    ],
  },
  conditions: {
    id: "conditions",
    title: "Working Conditions & Benefits",
    paragraphs: [
      "모든 채용은 3개월 계약직을 전제로 합니다. 이 기간은 넘즈에이아이가 개인과의 적합성을 판단하는 동시에 개인 역시 넘즈에이아이 팀을 평가하는 상호 탐색 기간으로, 서로에게 꼭 필요하다고 생각합니다.",
    ],
    bullets: [
      "회사는 강남역 4번 출구 패스트파이브 강남 1호점에 위치해 있습니다.",
      "모델 개발에 필요한 GPU 클라우드 및 업무를 위한 AI 구독을 최대한 지원합니다.",
      "급여 및 스톡옵션 등 구체적인 처우는 협의 가능합니다.",
    ],
  },
  application: {
    id: "application",
    title: "How to Apply",
    email: "hiring@nums.world",
    bullets: [
      "CV와 자유 형식의 Cover Letter를 보내주세요. 형식과 분량에는 제한이 없습니다.",
      "서류 접수 이후 영업일 5일 이내에 결과를 안내합니다.",
      "이후 1-2회의 인터뷰를 통해 직무 적합성을 확인하고 최종 채용 여부를 결정합니다.",
    ],
  },
  footer: "© 2026 Nums AI Inc.",
} as const;
