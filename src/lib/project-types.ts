/** Values sent by the booking form and shown in the studio's email (labels per language live in the dictionaries). */
export const projectTypes = [
  "Apartment",
  "Villa",
  "Duplex or penthouse",
  "Office",
  "Commercial space",
  "Renovation",
  "Other",
] as const;

export type ProjectType = (typeof projectTypes)[number];
