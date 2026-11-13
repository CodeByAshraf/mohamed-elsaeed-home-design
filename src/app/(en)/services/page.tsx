import { ServicesIndexPage, servicesIndexMetadata } from "@/components/pages/ServicesIndexPage";

export const metadata = servicesIndexMetadata("en");

export default function Page() {
  return <ServicesIndexPage lang="en" />;
}
