/** Shared keyboard-focus helpers for the site's overlays (mobile menu, booking dialog, photo viewer). */

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]):not([tabindex="-1"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Focusable elements inside `root`, skipping any that are not displayed (e.g. phone-only controls on desktop). */
export function focusableWithin(root: HTMLElement): HTMLElement[] {
  return [...root.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((el) => el.getClientRects().length > 0);
}

/** Keeps Tab / Shift+Tab cycling within `nodes`. Call from a keydown handler. */
export function trapTab(e: KeyboardEvent, nodes: HTMLElement[]) {
  if (e.key !== "Tab" || nodes.length === 0) return;
  const first = nodes[0];
  const last = nodes[nodes.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
}
