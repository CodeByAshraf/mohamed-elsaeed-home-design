"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Dictionary } from "./dictionaries/en";
import type { Locale } from "./config";

type LocaleValue = { lang: Locale; dict: Dictionary };

const LocaleContext = createContext<LocaleValue | null>(null);

/** Gives client components the page's language and its copy (set once by the root layout). */
export function LocaleProvider({ lang, dict, children }: LocaleValue & { children: ReactNode }) {
  return <LocaleContext.Provider value={{ lang, dict }}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const value = useContext(LocaleContext);
  if (!value) throw new Error("useLocale must be used inside <LocaleProvider>");
  return value;
}
