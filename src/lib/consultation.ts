import { z } from "zod";
import { projectTypes } from "@/lib/project-types";

/** Arabic-Indic (٠-٩) and Persian (۰-۹) digits to ASCII, so "٠١٠ ١٢٣٤ ٥٦٧٨" is a valid number. */
export function toAsciiDigits(value: string) {
  return value.replace(/[٠-٩۰-۹]/g, (d) => String(d.charCodeAt(0) & 0xf));
}

const asciiDigits = (v: unknown) => (typeof v === "string" ? toAsciiDigits(v) : v);

/**
 * Shared by the form (instant feedback) and the API route (the real gate).
 * The messages are English (they are also what the API returns); the form shows its own
 * translated message for each field (see `form.errors` in the dictionaries).
 */
export const consultationSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, "Enter your full name.")
    .max(100, "Keep your name under 100 characters."),
  phone: z.preprocess(
    asciiDigits,
    z
      .string()
      .trim()
      .regex(/^\+?[\d\s()-]{8,20}$/, "Enter a mobile number, for example 010 1234 5678.")
      .refine((v) => {
        const digits = v.replace(/\D/g, "").length;
        return digits >= 8 && digits <= 15;
      }, "Enter a mobile number, for example 010 1234 5678."),
  ),
  email: z.preprocess(asciiDigits, z.string().trim().toLowerCase().email("Enter an email address like name@example.com.")),
  projectType: z.enum(projectTypes, { message: "Choose the type of project." }),
  notes: z.string().trim().max(2000, "Keep notes under 2,000 characters.").optional().default(""),
  /** The language the visitor used, so the reply can be in the same language. */
  locale: z.enum(["ar", "en"]).optional().default("en"),
  /** Honeypot: real visitors never see or fill this field. */
  website: z.string().max(0).optional().default(""),
});

export type ConsultationInput = z.infer<typeof consultationSchema>;
export type ConsultationField = keyof ConsultationInput;
