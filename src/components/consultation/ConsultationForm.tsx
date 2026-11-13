"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, m } from "framer-motion";
import { Check, LoaderCircle } from "lucide-react";
import { consultationSchema, type ConsultationField } from "@/lib/consultation";
import { projectTypes } from "@/lib/project-types";
import { useLocale } from "@/i18n/LocaleProvider";
import { fill, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/en";
import { trackLead } from "@/lib/analytics";
import { RollText } from "@/components/motion/Interactions";
import { press } from "@/components/motion/classes";

type Values = {
  fullName: string;
  phone: string;
  email: string;
  projectType: string;
  notes: string;
  website: string;
};
type Status = "idle" | "sending" | "sent" | "failed";

const empty: Values = { fullName: "", phone: "", email: "", projectType: "", notes: "", website: "" };
const ease = [0.22, 1, 0.36, 1] as const;

type ErrorText = Dictionary["form"]["errors"];

/** The visitor-facing message for a field, in the page's language (the schema's own messages are English). */
function messageFor(field: ConsultationField, t: ErrorText, code?: string): string | undefined {
  switch (field) {
    case "fullName":
      return code === "too_big" ? t.fullNameLong : t.fullNameShort;
    case "phone":
      return t.phone;
    case "email":
      return t.email;
    case "projectType":
      return t.projectType;
    case "notes":
      return t.notes;
    default:
      return undefined;
  }
}

function validate(values: Values, t: ErrorText) {
  const result = consultationSchema.safeParse(values);
  const errors: Partial<Record<ConsultationField, string>> = {};
  if (!result.success) {
    for (const issue of result.error.issues) {
      const key = issue.path[0] as ConsultationField;
      if (!errors[key]) errors[key] = messageFor(key, t, issue.code);
    }
  }
  return errors;
}

/** What went wrong, from the API's status code, in the page's language. */
function serverMessage(status: number, t: Dictionary["form"]["server"]) {
  if (status === 422) return t.checkFields;
  if (status === 429) return t.tooMany;
  if (status === 413) return t.tooLarge;
  if (status === 400) return t.unreadable;
  if (status === 503) return t.unavailable;
  return t.failed;
}

export function ConsultationForm({ onDone }: { onDone: () => void }) {
  const [values, setValues] = useState<Values>(empty);
  const [touched, setTouched] = useState<Partial<Record<ConsultationField, boolean>>>({});
  const [serverErrors, setServerErrors] = useState<Partial<Record<ConsultationField, string>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [formMessage, setFormMessage] = useState("");
  const { lang, dict } = useLocale();
  const t = dict.form;

  const clientErrors = validate(values, t.errors);
  const errorFor = (field: ConsultationField) =>
    serverErrors[field] ?? (touched[field] ? clientErrors[field] : undefined);

  const set = (field: keyof Values) => (value: string) => {
    setValues((v) => ({ ...v, [field]: value }));
    setServerErrors((e) => ({ ...e, [field]: undefined }));
  };
  const touch = (field: ConsultationField) => () => setTouched((t) => ({ ...t, [field]: true }));

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setTouched({ fullName: true, phone: true, email: true, projectType: true, notes: true });
    const firstInvalid = (["fullName", "phone", "email", "projectType", "notes"] as const).find(
      (f) => clientErrors[f],
    );
    if (firstInvalid) {
      document.getElementById(`field-${firstInvalid}`)?.focus();
      return;
    }

    setStatus("sending");
    setFormMessage("");
    try {
      const res = await fetch("/api/consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, locale: lang satisfies Locale }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        message?: string;
        fieldErrors?: Partial<Record<ConsultationField, string>>;
      };
      if (res.ok && data.ok) {
        trackLead("form");
        setStatus("sent");
        return;
      }
      const fieldErrors: Partial<Record<ConsultationField, string>> = {};
      for (const key of Object.keys(data.fieldErrors ?? {}) as ConsultationField[]) {
        fieldErrors[key] = messageFor(key, t.errors);
      }
      setServerErrors(fieldErrors);
      setFormMessage(serverMessage(res.status, t.server));
      setStatus("failed");
    } catch {
      setFormMessage(t.server.offline);
      setStatus("failed");
    }
  }

  if (status === "sent") {
    const firstName = values.fullName.trim().split(/\s+/)[0];
    return (
      <m.div
        className="flex flex-1 flex-col px-6 pb-10 pt-10 sm:px-12"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease }}
        role="status"
      >
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-bronze/60 text-bronze">
          <Check size={24} strokeWidth={1.25} />
        </span>
        <h3 className="mt-8 font-display text-3xl text-travertine">{t.sentTitle}</h3>
        <p className="mt-4 max-w-[44ch] font-light leading-[1.75] text-limestone">
          {fill(t.sentBody, { name: firstName, phone: "\u2068" + values.phone + "\u2069" })}
        </p>
        <button
          type="button"
          onClick={onDone}
          className={`group relative mt-10 inline-flex h-14 w-full items-center justify-center overflow-hidden rounded-full border border-travertine/40 text-[15px] tracking-[0.04em] text-travertine duration-500 ease-architect hover:border-travertine hover:text-basalt sm:w-auto sm:px-10 ${press}`}
        >
          <span
            aria-hidden
            className="absolute inset-0 origin-bottom scale-y-0 bg-travertine transition-transform duration-500 ease-architect group-hover:scale-y-100"
          />
          <RollText className="relative">{t.back}</RollText>
        </button>
      </m.div>
    );
  }

  const sending = status === "sending";

  return (
    <form noValidate onSubmit={onSubmit} className="flex flex-1 flex-col px-6 pb-10 pt-6 sm:px-12" aria-busy={sending}>
      <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
        <TextField
          id="fullName"
          label={t.fullName}
          autoComplete="name"
          value={values.fullName}
          onChange={set("fullName")}
          onBlur={touch("fullName")}
          error={errorFor("fullName")}
          className="sm:col-span-2"
        />
        <TextField
          id="phone"
          label={t.phone}
          type="tel"
          dir="ltr"
          inputMode="tel"
          autoComplete="tel"
          value={values.phone}
          onChange={set("phone")}
          onBlur={touch("phone")}
          error={errorFor("phone")}
        />
        <TextField
          id="email"
          label={t.email}
          type="email"
          dir="ltr"
          inputMode="email"
          autoComplete="email"
          value={values.email}
          onChange={set("email")}
          onBlur={touch("email")}
          error={errorFor("email")}
        />
      </div>

      <fieldset className="mt-9" aria-describedby={errorFor("projectType") ? "error-projectType" : undefined}>
        <legend className="text-[14px] tracking-[0.02em] text-limestone">{t.projectType}</legend>
        <div className="mt-4 flex flex-wrap gap-2.5">
          {projectTypes.map((type, i) => {
            const checked = values.projectType === type;
            return (
              <label key={type} className="relative cursor-pointer">
                <input
                  type="radio"
                  name="projectType"
                  value={type}
                  checked={checked}
                  id={i === 0 ? "field-projectType" : undefined}
                  onChange={() => {
                    set("projectType")(type);
                    touch("projectType")();
                  }}
                  className="peer sr-only"
                />
                <span
                  className={`inline-flex h-11 items-center rounded-full border px-4 text-[14px] transition-[color,background-color,border-color,transform] duration-300 active:scale-95 peer-focus-visible:outline peer-focus-visible:outline-1 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-bronze ${
                    checked
                      ? "border-travertine bg-travertine text-basalt"
                      : "border-travertine/20 text-travertine/85 hover:border-travertine/50"
                  }`}
                >
                  {t.projectTypes[type]}
                </span>
              </label>
            );
          })}
        </div>
        <FieldError id="projectType" message={errorFor("projectType")} />
      </fieldset>

      <div className="mt-9">
        <label htmlFor="field-notes" className="text-[14px] tracking-[0.02em] text-limestone">
          {t.notes} <span className="text-smoke">{t.optional}</span>
        </label>
        <textarea
          id="field-notes"
          rows={4}
          value={values.notes}
          onChange={(e) => set("notes")(e.target.value)}
          onBlur={touch("notes")}
          placeholder={t.notesPlaceholder}
          aria-invalid={!!errorFor("notes")}
          aria-describedby={errorFor("notes") ? "error-notes" : undefined}
          className="mt-3 w-full resize-y border border-travertine/20 bg-transparent px-4 py-3 text-[16px] font-light leading-[1.6] text-travertine placeholder:text-smoke focus:border-travertine/60 focus:outline-none aria-[invalid=true]:border-[#d9876f]"
        />
        <FieldError id="notes" message={errorFor("notes")} />
      </div>

      {/* Honeypot */}
      <div aria-hidden className="absolute -start-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="field-website">Website</label>
        <input
          id="field-website"
          tabIndex={-1}
          autoComplete="off"
          value={values.website}
          onChange={(e) => set("website")(e.target.value)}
        />
      </div>

      <AnimatePresence>
        {status === "failed" && formMessage && (
          <m.p
            role="alert"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-8 border-s border-[#d9876f] ps-4 text-[14px] leading-[1.6] text-[#e7b3a3]"
          >
            {formMessage}
          </m.p>
        )}
      </AnimatePresence>

      <div className="mt-auto pt-10">
        <button
          type="submit"
          disabled={sending}
          className={`group relative inline-flex h-14 w-full items-center justify-center gap-3 overflow-hidden rounded-full bg-travertine text-[15px] font-semibold tracking-[0.04em] text-basalt duration-500 ease-architect hover:text-travertine disabled:cursor-wait disabled:hover:text-basalt ${press}`}
        >
          <span
            aria-hidden
            className="absolute inset-0 origin-bottom scale-y-0 bg-basalt-deep transition-transform duration-500 ease-architect group-hover:scale-y-100 group-disabled:scale-y-0"
          />
          {sending && <LoaderCircle size={18} strokeWidth={1.5} className="relative animate-spin" />}
          {sending ? (
            <span className="relative">{t.sending}</span>
          ) : (
            <RollText className="relative">{t.send}</RollText>
          )}
        </button>
        <p className="mt-4 text-center text-[13px] text-smoke">
          {t.privacy}
        </p>
      </div>
    </form>
  );
}

type TextFieldProps = {
  id: ConsultationField;
  label: string;
  value: string;
  onChange: (v: string) => void;
  onBlur: () => void;
  error?: string;
  type?: string;
  inputMode?: "text" | "tel" | "email";
  autoComplete?: string;
  /** "ltr" for numbers and email addresses, so they read correctly on Arabic pages. */
  dir?: "ltr";
  className?: string;
};

function TextField({ id, label, value, onChange, onBlur, error, type = "text", inputMode, autoComplete, dir, className = "" }: TextFieldProps) {
  return (
    <div className={className}>
      <label htmlFor={`field-${id}`} className="text-[14px] tracking-[0.02em] text-limestone">
        {label}
      </label>
      <input
        id={`field-${id}`}
        name={id}
        type={type}
        inputMode={inputMode}
        autoComplete={autoComplete}
        dir={dir}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        aria-invalid={!!error}
        aria-describedby={error ? `error-${id}` : undefined}
        className="mt-2 h-12 w-full border-b border-travertine/25 bg-transparent text-[17px] rtl:text-right font-light text-travertine transition-colors placeholder:text-smoke focus:border-travertine focus:outline-none aria-[invalid=true]:border-[#d9876f]"
      />
      <FieldError id={id} message={error} />
    </div>
  );
}

function FieldError({ id, message }: { id: string; message?: string }) {
  return message ? (
    <p id={`error-${id}`} className="mt-2 text-[13px] leading-snug text-[#e7b3a3]">
      {message}
    </p>
  ) : null;
}
