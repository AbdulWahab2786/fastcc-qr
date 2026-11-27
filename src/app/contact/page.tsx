import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact Us — FastCC QR",
  description:
    "Reach FastCC Corp. support and legal team for FastCC QR assistance, billing inquiries, or data requests.",
};

export default function ContactPage() {
  return (
    <main className="bg-surface">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="mb-6 flex items-center gap-2 text-xs text-ink-muted">
          <Link href="/" className="hover:text-ink hover:underline">
            FastCC QR
          </Link>
          <span>/</span>
          <span className="font-medium text-ink">Contact Us</span>
        </div>

        <header className="border-b border-border pb-8">
          <p className="font-mono text-xs font-semibold uppercase tracking-wider text-action-green">
            Support
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Contact Us
          </h1>
          <p className="mt-4 text-base leading-relaxed text-ink-muted">
            Have a question about FastCC QR, enterprise onboarding, billing, or
            legal compliance? Reach out directly and we&apos;ll be glad to help.
          </p>
        </header>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <section className="rounded-xl border border-border bg-canvas p-6">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
              Support &amp; Legal Email
            </h2>
            <p className="mt-2">
              <a
                href="mailto:mawahab2786@gmail.com"
                className="text-base font-semibold text-utility-blue hover:underline"
              >
                mawahab2786@gmail.com
              </a>
            </p>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">
              Typical response time:{" "}
              <strong className="font-medium text-ink">
                within 24–48 business hours
              </strong>
              .
            </p>
          </section>

          <section className="rounded-xl border border-border bg-canvas p-6">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-ink-muted">
              Company Details
            </h2>
            <dl className="mt-2 space-y-2 text-sm">
              <div>
                <dt className="inline text-ink-muted">Company: </dt>
                <dd className="inline font-semibold text-ink">FastCC Corp.</dd>
              </div>
              <div>
                <dt className="inline text-ink-muted">Founder: </dt>
                <dd className="inline font-semibold text-ink">Abdul Wahab</dd>
              </div>
              <div>
                <dt className="inline text-ink-muted">Location: </dt>
                <dd className="inline font-semibold text-ink">
                  Hyderabad, Telangana, India
                </dd>
              </div>
            </dl>
          </section>
        </div>
      </div>
    </main>
  );
}
