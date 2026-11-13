"use client";

import dynamic from "next/dynamic";
import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

/**
 * The booking dialog (form, validation library, animations) is split into its own file and
 * only downloaded when a visitor shows intent: hovering, focusing or touching a booking
 * button calls `preload()`, so it is usually ready before the click completes.
 */
const loadDialog = () => import("@/components/consultation/ConsultationDialog");
const ConsultationDialog = dynamic(() => loadDialog().then((m) => m.ConsultationDialog), { ssr: false });

type ConsultationContextValue = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  preload: () => void;
};

const ConsultationContext = createContext<ConsultationContextValue | null>(null);

export function ConsultationProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  /** Mount the dialog on first open and keep it mounted, so its closing animation can play. */
  const [mounted, setMounted] = useState(false);
  const open = useCallback(() => {
    setMounted(true);
    setIsOpen(true);
  }, []);
  const close = useCallback(() => setIsOpen(false), []);
  const preload = useCallback(() => {
    void loadDialog();
  }, []);
  const value = useMemo(() => ({ isOpen, open, close, preload }), [isOpen, open, close, preload]);

  return (
    <ConsultationContext.Provider value={value}>
      {children}
      {mounted ? <ConsultationDialog open={isOpen} onClose={close} /> : null}
    </ConsultationContext.Provider>
  );
}

export function useConsultation() {
  const ctx = useContext(ConsultationContext);
  if (!ctx) throw new Error("useConsultation must be used inside <ConsultationProvider>");
  return ctx;
}
