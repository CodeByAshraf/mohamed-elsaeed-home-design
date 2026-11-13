import type { ReactNode } from "react";
import { LocaleRoot, rootMetadata } from "@/components/pages/LocaleRoot";

export { viewport } from "@/components/pages/LocaleRoot";
export const metadata = rootMetadata("en");

export default function Layout({ children }: { children: ReactNode }) {
  return <LocaleRoot lang="en">{children}</LocaleRoot>;
}
