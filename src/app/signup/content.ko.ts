// Korean sign-up page copy.
// Page structure and styling live in [locale]/page.tsx, SignupForm.tsx and signup.module.css.

import type { SignupContent } from "./content.en";

export const signupContentKo: SignupContent = {
  metadata: {
    title: "Sign up — Nums AI",
    description:
      "Causilo API 무료 계정을 만듭니다. API 키를 한 번만 보여 주는 링크를 이메일로 보내 드립니다.",
  },
  navigation: {
    home: "Home",
  },
  hero: {
    kicker: "Causilo API / Sign up",
    title: "API 키 받기",
    lead: "키를 보내 드릴 곳을 알려 주세요. 무료 계정으로도 직접 가진 표에 Causilo를 써 볼 수 있고, Python 클라이언트 외에 따로 설치할 것은 없습니다.",
  },
  form: {
    email: "이메일",
    emailHint: "키를 여는 링크를 이 주소로 보내 드립니다.",
    name: "이름",
    organization: "소속",
    useCase: "예측하고 싶은 것",
    useCasePlaceholder: "예: 다음 분기에 이탈할 고객",
    optional: "선택",
    termsBefore: "",
    termsLink: "이용약관",
    termsAfter: "을 읽었으며 이에 동의합니다.",
    submit: "키 요청하기",
    submitting: "보내는 중…",
    success:
      "받은편지함을 확인해 주세요. API 키를 한 번만 보여 주는 링크를 보내 드렸습니다.",
    retry: "지금은 요청을 받지 못했습니다. 잠시 후 다시 시도해 주세요.",
    rejected:
      "요청이 접수되지 않았습니다. 이메일 주소를 확인하고 다시 시도해 주세요.",
    network:
      "가입 서비스에 연결하지 못했습니다. 잠시 후 다시 시도해 주세요.",
  },
  tier: {
    title: "무료 계정에 포함되는 것",
    rows: [
      ["월 셀 수", "25,000,000"],
      ["일 셀 수", "6,250,000"],
      ["분당 요청 수", "60"],
    ],
    cellNote:
      "셀 수는 요청마다 문맥 표와 질의 표의 행 수에 열 수를 곱해 셉니다.",
    commercialBefore:
      "이 범위를 넘는 상업적 이용은 별도 협의로 진행합니다. ",
    commercialEmail: "contact@nums.world",
    commercialAfter: "로 어떤 작업을 하시는지 알려 주세요.",
  },
  footer: "© 2026 Nums AI Inc.",
};
