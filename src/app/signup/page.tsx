import LocalizedSignupPage, {
  generateMetadata as generateLocalizedMetadata,
} from "./[locale]/page";

const englishParams = Promise.resolve({ locale: "en" });

export function generateMetadata() {
  return generateLocalizedMetadata({ params: englishParams });
}

export default function SignupPage() {
  return <LocalizedSignupPage params={englishParams} />;
}
