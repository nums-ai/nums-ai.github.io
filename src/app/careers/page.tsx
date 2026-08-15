import LocalizedCareersPage, {
  generateMetadata as generateLocalizedMetadata,
} from "./[locale]/page";

const englishParams = Promise.resolve({ locale: "en" });

export function generateMetadata() {
  return generateLocalizedMetadata({ params: englishParams });
}

export default function CareersPage() {
  return <LocalizedCareersPage params={englishParams} />;
}
