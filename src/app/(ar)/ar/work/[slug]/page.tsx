import { ProjectPage, projectMetadata, projectStaticParams, type ProjectParams } from "@/components/pages/ProjectPage";

export const dynamicParams = false;
export const generateStaticParams = projectStaticParams;

export async function generateMetadata({ params }: ProjectParams) {
  return projectMetadata((await params).slug, "ar");
}

export default async function Page({ params }: ProjectParams) {
  return <ProjectPage slug={(await params).slug} lang="ar" />;
}
