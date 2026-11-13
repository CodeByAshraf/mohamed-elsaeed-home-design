"use client";

import { useEffect, useState, type RefObject } from "react";

/**
 * "The cursor is a lamp": on devices with a mouse, a warm pool of light follows the pointer
 * across the hero, and where it falls the room comes into focus (a sharp, brighter copy of the
 * photograph seen through a soft circular window).
 *
 * Built to stay light (measured with a 4x slower CPU):
 * - Nothing re-renders in React while the pointer moves.
 * - Each frame writes only `transform` on three small, pre-drawn layers (the glow, the window and
 *   the photograph inside it). No CSS variables on the section: those are inherited, so changing
 *   them would make the browser restyle every element in the hero, every frame.
 * - Layout is read only when the pointer moves, never inside the animation loop.
 * - The loop stops as soon as the light has caught up with the pointer.
 * - The sharp photograph is only requested on mouse devices, after the page has fully loaded.
 * - Touch devices and visitors who prefer reduced motion never run any of this.
 *
 * Expected markup inside the section (see Hero.tsx):
 *   .hero-lamp-glow > .hero-lamp-dot            the warm glow
 *   .hero-lamp-focus > .hero-lamp-window > .hero-lamp-room   the focus window
 * Visibility: the two layers get the class `lamp-on` while the pointer is over the section
 * (on the layers themselves, not the section, so turning the light on restyles only them).
 */
export function useHeroLamp(
  sectionRef: RefObject<HTMLElement | null>,
  imageRef: RefObject<HTMLElement | null>,
  disabled: boolean,
) {
  const [sharpReady, setSharpReady] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || disabled) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    // Ask for the sharp photograph only once the page has fully loaded.
    let idle = 0;
    const load = () => {
      idle = window.setTimeout(() => setSharpReady(true), 200);
    };
    if (document.readyState === "complete") load();
    else window.addEventListener("load", load, { once: true });

    const dot = section.querySelector<HTMLElement>(".hero-lamp-dot");
    const glow = section.querySelector<HTMLElement>(".hero-lamp-glow");
    let lit = false;
    const setLit = (on: boolean) => {
      if (on === lit) return;
      lit = on;
      glow?.classList.toggle("lamp-on", on);
      section.querySelector<HTMLElement>(".hero-lamp-focus")?.classList.toggle("lamp-on", on);
    };
    let win: HTMLElement | null = null;
    let room: HTMLElement | null = null;

    // Pointer target and current (eased) position, in section pixels.
    let tx = 0;
    let ty = 0;
    let x = 0;
    let y = 0;
    // Geometry of the photograph's box relative to the section, refreshed on pointer moves only.
    let offX = 0;
    let offY = 0;
    let k = 1;
    let started = false;
    let frame = 0;

    const measure = (e: PointerEvent) => {
      const s = section.getBoundingClientRect();
      tx = e.clientX - s.left;
      ty = e.clientY - s.top;
      const box = imageRef.current;
      if (box) {
        const r = box.getBoundingClientRect();
        offX = r.left - s.left;
        offY = r.top - s.top;
        k = box.offsetWidth / (r.width || 1); // the box is scaled; convert to its own pixels
        if (!win) {
          win = section.querySelector<HTMLElement>(".hero-lamp-window");
          room = section.querySelector<HTMLElement>(".hero-lamp-room");
        }
        if (room && room.dataset.w !== String(box.offsetWidth)) {
          room.style.width = `${box.offsetWidth}px`;
          room.style.height = `${box.offsetHeight}px`;
          room.dataset.w = String(box.offsetWidth);
        }
      }
    };

    const write = () => {
      if (dot) dot.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      if (win && room) {
        const lx = (x - offX) * k;
        const ly = (y - offY) * k;
        win.style.transform = `translate3d(${lx}px, ${ly}px, 0)`;
        room.style.transform = `translate3d(${-lx}px, ${-ly}px, 0)`;
      }
    };

    const tick = () => {
      x += (tx - x) * 0.16;
      y += (ty - y) * 0.16;
      write();
      frame = Math.abs(tx - x) + Math.abs(ty - y) > 0.5 ? requestAnimationFrame(tick) : 0;
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      measure(e);
      if (!started) {
        // First movement: place the light under the pointer instead of sweeping in from a corner.
        x = tx;
        y = ty;
        started = true;
      }
      setLit(true);
      if (!frame) frame = requestAnimationFrame(tick);
    };
    const onLeave = () => setLit(false);

    section.addEventListener("pointermove", onMove, { passive: true });
    section.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("load", load);
      window.clearTimeout(idle);
      cancelAnimationFrame(frame);
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerleave", onLeave);
      setLit(false);
    };
  }, [sectionRef, imageRef, disabled]);

  // Decode the sharp photograph ahead of time (off the main thread), so the first time the light
  // falls on the room nothing has to be decoded or drawn from scratch.
  useEffect(() => {
    if (!sharpReady) return;
    const img = sectionRef.current?.querySelector<HTMLImageElement>(".hero-lamp-room img");
    if (!img) return;
    const warm = () => img.decode?.().catch(() => {});
    if (img.complete) warm();
    else img.addEventListener("load", warm, { once: true });
    return () => img.removeEventListener("load", warm);
  }, [sharpReady, sectionRef]);

  return sharpReady;
}
