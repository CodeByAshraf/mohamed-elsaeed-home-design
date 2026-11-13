"use client";

import { LazyMotion, MotionConfig } from "framer-motion";
import type { ReactNode } from "react";
import { ConsultationProvider } from "@/components/consultation/ConsultationProvider";

/**
 * Motion is loaded lazily: components use the lightweight `m.*` elements, and the animation features
 * arrive in a separate file once the page is running. Scroll-linked styles (hero depth, ruler) need no
 * features and work straight away; the photo viewer adds drag on its own (Lightbox.tsx).
 */
const loadFeatures = () => import("@/components/motion/features").then((mod) => mod.default);

export function Providers({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion="user">
        <ConsultationProvider>{children}</ConsultationProvider>
      </MotionConfig>
    </LazyMotion>
  );
}
