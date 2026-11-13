"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale } from "@/i18n/LocaleProvider";

type Mode = "default" | "link" | "view" | "open" | "drag";

/**
 * A quiet companion to the pointer on mouse devices: a bronze point that follows exactly and a fine
 * ring that trails it with a little inertia. Over clickable things the ring opens up; over photographs
 * it becomes a solid disc that names the action ("View", "Open", "Drag") in the page's language.
 * Elements opt in with `data-cursor="view" | "open" | "drag"`.
 *
 * Off on touch screens and for visitors who prefer reduced motion (nothing is rendered, the normal
 * cursor stays). While running, each frame writes only `transform` on two fixed elements, and the
 * loop sleeps as soon as the ring has caught up.
 */
export function CustomCursor() {
  const { dict } = useLocale();
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState<Mode>("default");
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setEnabled(fine.matches && !reduce.matches);
    update();
    fine.addEventListener("change", update);
    reduce.addEventListener("change", update);
    return () => {
      fine.removeEventListener("change", update);
      reduce.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const d = document.documentElement;
    d.classList.add("has-cursor");

    const target = { x: -100, y: -100 };
    const pos = { x: -100, y: -100 };
    let frame = 0;
    let visible = false;

    const tick = () => {
      pos.x += (target.x - pos.x) * 0.2;
      pos.y += (target.y - pos.y) * 0.2;
      if (ring.current) ring.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      frame = Math.abs(target.x - pos.x) + Math.abs(target.y - pos.y) > 0.3 ? requestAnimationFrame(tick) : 0;
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      target.x = e.clientX;
      target.y = e.clientY;
      if (dot.current) dot.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      if (!visible) {
        visible = true;
        pos.x = target.x;
        pos.y = target.y;
        d.classList.add("cursor-in");
      }
      if (!frame) frame = requestAnimationFrame(tick);
    };
    const onOver = (e: PointerEvent) => {
      const el = e.target as Element | null;
      const zone = el?.closest<HTMLElement>("[data-cursor]");
      if (zone) return setMode(zone.dataset.cursor as Mode);
      setMode(el?.closest("a, button, [role='button'], label, input, textarea, select") ? "link" : "default");
    };
    const onLeave = () => {
      visible = false;
      d.classList.remove("cursor-in");
    };
    const onDown = () => d.classList.add("cursor-down");
    const onUp = () => d.classList.remove("cursor-down");

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      d.classList.remove("has-cursor", "cursor-in", "cursor-down");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, [enabled]);

  if (!enabled) return null;
  const label = mode === "view" || mode === "open" || mode === "drag" ? dict.cursor[mode] : "";

  return (
    <div aria-hidden className="cursor-layer" data-mode={mode}>
      <div ref={ring} className="cursor-ring">
        <span className="cursor-ring-line" />
        <span className="cursor-disc">
          <span className="cursor-label">{label}</span>
        </span>
      </div>
      <div ref={dot} className="cursor-dot" />
    </div>
  );
}
