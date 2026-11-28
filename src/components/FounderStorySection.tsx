"use client";

import Link from "next/link";

const FOUNDER_NAME = "Abdul Wahab (Mina Soda 🥤)";
const FOUNDER_INITIALS = "AW";
const FOUNDER_AVATAR_URL: string | null = null;

export function FounderStorySection() {
  const handleScrollToWorkbench = (
    event: React.MouseEvent<HTMLAnchorElement>
  ) => {
    const target = document.getElementById("workbench-top");
    if (target) {
      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section
      aria-labelledby="founder-story-heading"
      className="border-t border-border"
    >
      <div className="mx-auto max-w-2xl px-4 py-16">
        <h2
          id="founder-story-heading"
          className="font-serif text-4xl tracking-tight text-slate-900 sm:text-5xl"
        >
          Why I built FastCC QR
        </h2>

        <div className="mt-8 space-y-5 text-lg leading-relaxed text-slate-700">
          <div className="flex items-center gap-3">
            {FOUNDER_AVATAR_URL ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={FOUNDER_AVATAR_URL}
                alt={FOUNDER_NAME}
                className="h-10 w-10 shrink-0 rounded-full border border-slate-200 object-cover"
              />
            ) : (
              <span
                aria-hidden="true"
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-900 font-mono text-xs font-semibold text-white"
              >
                {FOUNDER_INITIALS}
              </span>
            )}
            <p className="text-slate-900">
              Hi, I&apos;m{" "}
              <span className="font-semibold">{FOUNDER_NAME}</span>, and I build
              practical software for real-world operations.
            </p>
          </div>

          <p>
            Earlier, I worked at Urban Company, where I learned firsthand how
            strict SOPs and Proof of Work keep ground operations running like
            clockwork. That experience sparked an idea: I wanted to take those
            exact operational standards and make them accessible to every
            factory, kitchen, and facility team.
          </p>

          <p>
            Outside of tech giants, most teams are stuck between two bad
            options: paper registers (where staff fake entries in 5 seconds) or
            enterprise apps like SafetyCulture that charge $24+ per user, every
            month—and still force shop-floor workers to download an app and
            remember passwords.
          </p>

          <p>
            So I built my own. It{" "}
            <span className="font-medium text-slate-900 underline decoration-action-green/60 decoration-2 underline-offset-4">
              costs 90% less
            </span>
            , with zero per-seat tax.
          </p>

          <p>
            Today, FastCC QR comes pre-loaded with{" "}
            <Link
              href="/templates"
              className="font-medium text-slate-900 underline decoration-action-green/60 decoration-2 underline-offset-4 transition-colors hover:text-action-green"
            >
              100+ global B2B compliance templates
            </Link>{" "}
            (OSHA, ISO, HACCP, FSSAI) and works in{" "}
            <span className="font-medium text-slate-900 underline decoration-action-green/60 decoration-2 underline-offset-4">
              5 languages
            </span>{" "}
            out of the box.
          </p>

          <p className="pt-2 font-medium text-slate-900">
            So I built FastCC QR with three things in mind:
          </p>

          <ol className="space-y-4 pl-1">
            <li className="flex gap-3">
              <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white font-mono text-xs font-semibold text-slate-900">
                1
              </span>
              <div>
                <strong className="font-semibold text-slate-900">
                  Zero app, zero login for workers:
                </strong>{" "}
                Stick a QR on the machine. Workers scan it with any phone
                camera, pick their language, and finish the check in 30 seconds.
              </div>
            </li>

            <li className="flex gap-3">
              <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white font-mono text-xs font-semibold text-slate-900">
                2
              </span>
              <div>
                <strong className="font-semibold text-slate-900">
                  Fake-proof audits:
                </strong>{" "}
                Live camera photos with GPS + timestamp watermarks, digital
                signatures, and instant WhatsApp alerts when equipment is marked
                Faulty.
              </div>
            </li>

            <li className="flex gap-3">
              <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white font-mono text-xs font-semibold text-slate-900">
                3
              </span>
              <div>
                <strong className="font-semibold text-slate-900">
                  Flat, honest pricing:
                </strong>{" "}
                Unlimited worker scans without paying $24/seat. Export 1-click
                Audit PDFs whenever an inspector walks in.
              </div>
            </li>
          </ol>

          <div className="pt-4">
            <Link
              href="/#workbench-top"
              onClick={handleScrollToWorkbench}
              className="inline-flex min-h-11 items-center justify-center rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
            >
              Create Your First Machine QR Free →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
