"use client";

/**
 * The site's interaction language. Every clickable element draws from the same five gestures:
 *
 * 1. Magnetic  — primary actions lean gently toward the cursor and spring back when it leaves.
 * 2. RollText  — on hover, each word lifts away and an identical copy rises into its place.
 * 3. ArrowSwap — an arrow leaves in its own direction while a fresh one arrives behind it.
 * 4. Directional underline (CSS, `underline` in ./classes.ts) — draws in from the reading start, exits at the end.
 * 5. Press     — a small, quick scale-down on click or tap (`press` in ./classes.ts).
 *
 * All hover effects use Tailwind's `hover:` / `group-hover:`, which v4 limits to devices that can
 * really hover, so nothing gets "stuck" on touch screens. Keyboard focus triggers the same motion.
 */

import { useRef, type PointerEvent, type ReactNode } from "react";
import { m, useMotionValue, useSpring } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/* ------------------------------------------------------------------ Magnetic */

type MagneticProps = {
  children: ReactNode;
  /** Largest distance, in px, the element may travel toward the cursor. */
  reach?: number;
  className?: string;
};

export function Magnetic({ children, reach = 8, className = "" }: MagneticProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = usePrefersReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const spring = { stiffness: 180, damping: 16, mass: 0.5 };
  const sx = useSpring(x, spring);
  const sy = useSpring(y, spring);

  const onPointerMove = (e: PointerEvent<HTMLSpanElement>) => {
    if (reduce || e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    // Position of the cursor relative to the centre, normalised to -1…1 on each axis.
    const nx = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (r.width / 2)));
    const ny = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / (r.height / 2)));
    x.set(nx * reach);
    y.set(ny * reach * 0.6);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <m.span
      ref={ref}
      className={`inline-flex ${className}`}
      style={{ x: sx, y: sy }}
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
    >
      {children}
    </m.span>
  );
}

/* ------------------------------------------------------------------ RollText */

/**
 * Word-by-word text roll. Words (not letters) keep their kerning intact.
 * The visible copies are hidden from assistive tech; one clean copy is read instead.
 */
export function RollText({ children, className = "" }: { children: string; className?: string }) {
  const words = children.split(" ");
  const roll =
    "block transition-transform duration-[600ms] ease-architect group-hover:-translate-y-full group-focus-visible:-translate-y-full";

  return (
    <span className={`relative inline-flex leading-[1.4] ${className}`}>
      <span className="sr-only">{children}</span>
      <span aria-hidden className="inline-flex whitespace-pre">
        {words.map((word, i) => (
          <span key={`${word}-${i}`} className="relative inline-block overflow-hidden">
            <span className={roll} style={{ transitionDelay: `${i * 45}ms` }}>
              {word}
              {i < words.length - 1 ? " " : ""}
            </span>
            <span className={`absolute inset-x-0 top-full ${roll}`} style={{ transitionDelay: `${i * 45}ms` }}>
              {word}
              {i < words.length - 1 ? " " : ""}
            </span>
          </span>
        ))}
      </span>
    </span>
  );
}

/* ------------------------------------------------------------------ ArrowSwap */

export function ArrowSwap({
  direction = "right",
  size = 18,
  strokeWidth = 1.5,
  className = "",
}: {
  direction?: "right" | "left" | "up-right";
  size?: number;
  strokeWidth?: number;
  className?: string;
}) {
  const Icon = direction === "right" ? ArrowRight : direction === "left" ? ArrowLeft : ArrowUpRight;
  const out = {
    right: "group-hover:translate-x-[160%] group-focus-visible:translate-x-[160%]",
    left: "group-hover:-translate-x-[160%] group-focus-visible:-translate-x-[160%]",
    "up-right":
      "group-hover:translate-x-[160%] group-hover:-translate-y-[160%] group-focus-visible:translate-x-[160%] group-focus-visible:-translate-y-[160%]",
  }[direction];
  const incoming = {
    right: "-translate-x-[160%] group-hover:translate-x-0 group-focus-visible:translate-x-0",
    left: "translate-x-[160%] group-hover:translate-x-0 group-focus-visible:translate-x-0",
    "up-right":
      "-translate-x-[160%] translate-y-[160%] group-hover:translate-x-0 group-hover:translate-y-0 group-focus-visible:translate-x-0 group-focus-visible:translate-y-0",
  }[direction];
  const base = "transition-transform duration-500 ease-architect";

  return (
    // Mirrored on right-to-left pages, so "next" points the way an Arabic reader moves (and its motion follows).
    <span aria-hidden className={`relative inline-flex overflow-hidden rtl:-scale-x-100 ${className}`} style={{ width: size, height: size }}>
      <Icon size={size} strokeWidth={strokeWidth} className={`${base} ${out}`} />
      <Icon size={size} strokeWidth={strokeWidth} className={`absolute inset-0 ${base} delay-75 ${incoming}`} />
    </span>
  );
}
