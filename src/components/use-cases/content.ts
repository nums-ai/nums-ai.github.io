export const groups = [
  { id: "customers", name: { en: "Customers", ko: "고객" }, description: { en: "Predict customer churn, purchase intent, and campaign response.", ko: "고객 이탈, 구매 의향, 마케팅 캠페인에 대한 반응을 예측합니다." } },
  { id: "finance", name: { en: "Finance & Insurance", ko: "금융·보험" }, description: { en: "Explore credit defaults, company bankruptcies, and insurance ownership.", ko: "채무 불이행, 기업 파산, 보험 상품 보유에 관한 데이터를 살펴봅니다." } },
  { id: "health", name: { en: "Healthcare", ko: "의료·건강" }, description: { en: "Study patient outcomes, health risk categories, and medical costs.", ko: "환자 예후, 건강 위험도 분류, 의료비에 관한 예측 과제를 살펴봅니다." } },
  { id: "operations", name: { en: "Operations", ko: "운영·제조" }, description: { en: "Predict equipment failures, late deliveries, and product quality.", ko: "설비 고장과 배송 지연을 예측하고 제품 품질을 분류합니다." } },
  { id: "science", name: { en: "Science & Materials", ko: "과학·재료" }, description: { en: "Estimate concrete strength, airfoil noise, and molecular properties.", ko: "콘크리트 강도, 익형의 소음, 분자의 물성을 추정합니다." } },
  { id: "pricing", name: { en: "Pricing", ko: "가격" }, description: { en: "Estimate the value of homes, used cars, and diamonds.", ko: "주택, 중고차, 다이아몬드의 특성을 바탕으로 가격을 추정합니다." } },
  { id: "people", name: { en: "People & Education", ko: "조직·교육" }, description: { en: "Predict academic outcomes and interest in changing jobs.", ko: "학생의 학업 결과와 이직에 대한 관심을 예측합니다." } },
  { id: "software", name: { en: "Software & Security", ko: "소프트웨어·보안" }, description: { en: "Identify software defects, Android malware, and phishing websites.", ko: "소프트웨어 결함, 안드로이드 악성 앱, 피싱 웹사이트를 구분합니다." } },
] as const;

export const copy = {
  en: {
    title: "Explore use cases in real datasets",
    introduction: "Explore TabArena datasets by domain, and compare Causilo with traditional machine learning models on each prediction task.",
    domains: "Dataset domains", dataset: "Dataset", setting: "Tuned + ensemble",
    datasetCount: (count: number) => `${count} ${count === 1 ? "dataset" : "datasets"}`, results: "Dataset results",
    task: { binary: "Binary classification", multiclass: "Multiclass classification", regression: "Regression" },
    rows: "Rows", features: "Features", taskLabel: "Task", source: "Dataset on OpenML", sourceLabel: "Source",
    higher: "Higher is better", lower: "Lower is better", better: "Better", modelLabel: "Model",
    datasetDetails: (id: string, splits: number, isRegression: boolean) => `Scores for ${id} are averaged across ${splits} evaluation splits. Causilo uses its default configuration; CatBoost, LightGBM, XGBoost, Random forest, Extra trees, ${isRegression ? "linear regression" : "logistic regression"}, and k-nearest neighbors are tuned and ensembled.`,
    methodology: "Scores retain their original ROC AUC, log loss, or RMSE values. Dots are positioned on a linear scale within each dataset, from the worst result on the left to the best on the right; higher ROC AUC and lower log loss or RMSE are better. Positions show relative performance within a dataset, not score ratios.",
    home: "Back to Causilo", footer: "Tabular foundation models. Built in Seoul.",
  },
  ko: {
    title: "활용 사례",
    introduction: "TabArena 데이터셋을 분야별로 살펴보고, 각 예측 과제에서 Causilo와 기존 머신러닝 모델의 성능을 비교하세요.",
    domains: "데이터셋 분야", dataset: "데이터셋", setting: "튜닝 + 앙상블",
    datasetCount: (count: number) => `데이터셋 ${count}개`, results: "데이터셋 결과",
    task: { binary: "이진 분류", multiclass: "다중 분류", regression: "회귀" },
    rows: "행", features: "특성", taskLabel: "과제", source: "OpenML 데이터셋", sourceLabel: "출처",
    higher: "높을수록 좋음", lower: "낮을수록 좋음", better: "좋은 성능", modelLabel: "모델",
    datasetDetails: (id: string, splits: number, isRegression: boolean) => `${id}의 점수는 평가 분할 ${splits}개의 평균입니다. Causilo는 기본 설정을 사용하며, CatBoost, LightGBM, XGBoost, Random forest, Extra trees, ${isRegression ? "선형 회귀" : "로지스틱 회귀"}, k-최근접 이웃은 튜닝 및 앙상블을 적용했습니다.`,
    methodology: "수치는 원래 ROC AUC, 로그 손실 또는 RMSE를 그대로 표시합니다. 각 데이터셋에서 가장 낮은 성능을 왼쪽, 가장 높은 성능을 오른쪽에 두고 점을 선형으로 배치합니다. ROC AUC는 높을수록, 로그 손실과 RMSE는 낮을수록 좋은 성능입니다. 점의 위치는 점수의 비율이 아니라 해당 데이터셋 내 상대적 성능을 나타냅니다.",
    home: "Causilo로 돌아가기", footer: "서울에서 만드는 테이블 파운데이션 모델.",
  },
} as const;
