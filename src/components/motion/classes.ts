/**
 * Class-name recipes shared by server and client components.
 *
 * These live in a plain module (no "use client") on purpose: a non-component value exported
 * from a client module reaches server components as a reference stub, not as the string,
 * which silently broke the classes wherever a server component used them.
 */

/** Press feedback for buttons and button-like links. */
export const press =
  "transition-[color,background-color,border-color,transform] active:scale-[0.97] active:duration-150";

/**
 * Directional underline: add to an absolutely positioned 1px span inside a `group`. It draws in
 * from where reading starts and leaves where it ends (left to right in English, right to left in
 * Arabic). Defined in globals.css ("Directional underline").
 */
export const underline = "draw-line";
