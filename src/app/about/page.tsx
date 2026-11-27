import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us — FastCC QR",
  description:
    "FastCC QR by FastCC Corp. — instant QR SOPs, multilingual worker scans, GPS-stamped photo audits, and 1-click audit PDFs for global frontline operations.",
};

export default function AboutPage() {
  return (
    <main className="bg-surface">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="mb-6 flex items-center gap-2 text-xs text-ink-muted">
          <Link href="/" className="hover:text-ink hover:underline">
            FastCC QR
          </Link>
          <span>/</span>
          <span className="font-medium text-ink">About Us</span>
        </div>

        <header className="border-b border-border pb-8">
          <p className="font-mono text-xs font-semibold uppercase tracking-wider text-action-green">
            Company
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            About FastCC QR
          </h1>
          <p className="mt-4 text-base leading-relaxed text-ink-muted">
            FastCC QR is a B2B frontline operations platform built by{" "}
            <strong className="font-semibold text-ink">FastCC Corp.</strong> and
            founded by{" "}
            <strong className="font-semibold text-ink">Abdul Wahab</strong> in
            Hyderabad, Telangana, India.
          </p>
        </header>

        <article className="mt-8 space-y-8 text-sm leading-relaxed text-ink-muted sm:text-base">
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-ink">Why We Built It</h2>
            <p>
              Industrial teams, factories, and multi-site operators shouldn&apos;t
              have to wrestle with bloated enterprise inspection software or
              clipboards that get lost on the shop floor. FastCC QR replaces
              legacy paperwork and heavy compliance suites with permanent,
              scannable QR labels that any worker can use in seconds—no app
              install required.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-ink">
              Built for Global Frontline Teams
            </h2>
            <p>
              From shop floors and manufacturing plants to hospitality,
              healthcare, and commercial facilities worldwide, FastCC QR equips
              supervisors and technicians with practical tools that work in real
              field conditions:
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong className="font-medium text-ink">
                  Instant QR SOPs:
                </strong>{" "}
                Turn equipment manuals, safety protocols, and maintenance
                checklists into permanent QR-linked digital SOPs.
              </li>
              <li>
                <strong className="font-medium text-ink">
                  Multilingual Worker Scans:
                </strong>{" "}
                Deliver checklists and instructions in the languages your
                frontline workforce actually reads.
              </li>
              <li>
                <strong className="font-medium text-ink">
                  GPS-Stamped Photo Audits:
                </strong>{" "}
                Capture verifiable proof-of-work with watermarked inspection
                photos, timestamps, and location coordinates.
              </li>
              <li>
                <strong className="font-medium text-ink">
                  1-Click Audit PDFs:
                </strong>{" "}
                Export clean, inspection-ready compliance reports for internal
                reviews, ISO, or safety audits in a single click.
              </li>
            </ul>
          </section>

          <section className="rounded-xl border border-border bg-canvas p-6">
            <h2 className="text-base font-semibold text-ink">
              Operating Entity &amp; Contact
            </h2>
            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-ink-muted">
                  Product
                </dt>
                <dd className="mt-0.5 font-medium text-ink">FastCC QR</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-ink-muted">
                  Company
                </dt>
                <dd className="mt-0.5 font-medium text-ink">FastCC Corp.</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-ink-muted">
                  Founder
                </dt>
                <dd className="mt-0.5 font-medium text-ink">Abdul Wahab</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-ink-muted">
                  Headquarters
                </dt>
                <dd className="mt-0.5 font-medium text-ink">
                  Hyderabad, Telangana, India
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-xs font-medium uppercase tracking-wide text-ink-muted">
                  Support &amp; Legal Email
                </dt>
                <dd className="mt-0.5">
                  <a
                    href="mailto:mawahab2786@gmail.com"
                    className="font-medium text-utility-blue hover:underline"
                  >
                    mawahab2786@gmail.com
                  </a>
                </dd>
              </div>
            </dl>
          </section>
        </article>
      </div>
    </main>
  );
}
