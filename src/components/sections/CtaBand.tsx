import { DimensionLine, Reveal } from "@/components/motion/Reveal";
import { ContactActions } from "@/components/ui/ContactActions";

/** Closing call to action on inner pages: one sentence, then booking, call and WhatsApp. */
export function CtaBand({ title, body, actionLabel }: { title: string; body: string; actionLabel: string }) {
  return (
    <section className="relative overflow-hidden bg-basalt-deep">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(60% 60% at 50% 0%, rgb(176 141 91 / 0.10) 0%, transparent 70%)" }}
      />
      <div className="relative mx-auto max-w-[1600px] px-6 py-24 text-center sm:px-10 md:py-32 lg:px-16">
        <Reveal>
          <h2 className="font-display text-[clamp(2.2rem,5vw,4.5rem)] leading-[1.05] text-travertine" style={{ fontVariationSettings: "'wght' 600, 'opsz' 16" }}>
            {title}
          </h2>
        </Reveal>
        <DimensionLine className="mx-auto mt-10 w-40 md:w-72" />
        <Reveal delay={0.1}>
          <p className="mx-auto mt-10 max-w-[52ch] text-[16px] font-light leading-[1.85] text-limestone md:text-[17px]">{body}</p>
        </Reveal>
        <Reveal delay={0.2} className="mt-10 flex justify-center">
          <ContactActions label={actionLabel} />
        </Reveal>
      </div>
    </section>
  );
}
