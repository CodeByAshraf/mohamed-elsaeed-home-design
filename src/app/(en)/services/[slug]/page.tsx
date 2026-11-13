import { ServicePage, serviceMetadata, serviceStaticParams, type ServiceParams } from "@/components/pages/ServicePage";

export const dynamicParams = false;
export const generateStaticParams = serviceStaticParams;

export async function generateMetadata({ params }: ServiceParams) {
  return serviceMetadata((await params).slug, "en");
}

export default async function Page({ params }: ServiceParams) {
  return <ServicePage slug={(await params).slug} lang="en" />;
}
