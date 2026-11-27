import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — FastCC QR",
  description:
    "How FastCC Corp. collects, processes, and protects account data, QR inspection logs, GPS-stamped photos, and Razorpay billing information on FastCC QR.",
};

export default function PrivacyPage() {
  return (
    <main className="bg-surface">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="mb-6 flex items-center gap-2 text-xs text-ink-muted">
          <Link href="/" className="hover:text-ink hover:underline">
            FastCC QR
          </Link>
          <span>/</span>
          <span className="font-medium text-ink">Privacy Policy</span>
        </div>

        <header className="border-b border-border pb-8">
          <p className="font-mono text-xs font-semibold uppercase tracking-wider text-ink-muted">
            Legal
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Privacy Policy
          </h1>
          <p className="mt-3 text-sm text-ink-muted">
            Effective Date: January 1, 2026 &middot; Operated by{" "}
            <strong className="font-medium text-ink">FastCC Corp.</strong>{" "}
            (Hyderabad, Telangana, India)
          </p>
        </header>

        <article className="mt-8 space-y-8 text-sm leading-relaxed text-ink-muted sm:text-base">
          <section className="space-y-2.5">
            <h2 className="text-lg font-semibold text-ink">
              1. Overview &amp; Scope
            </h2>
            <p>
              This Privacy Policy explains how FastCC Corp. (&ldquo;we&rdquo;,
              &ldquo;us&rdquo;, or &ldquo;our&rdquo;) collects, uses, and
              safeguards information when you use{" "}
              <strong className="font-medium text-ink">FastCC QR</strong>. By
              creating an account or submitting inspection records through our
              service, you agree to the practices described below.
            </p>
          </section>

          <section className="space-y-2.5">
            <h2 className="text-lg font-semibold text-ink">
              2. Information We Collect
            </h2>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong className="font-medium text-ink">
                  Account &amp; Authentication Data:
                </strong>{" "}
                We use Supabase Auth to manage user accounts. When you sign up
                or log in, we collect your email address, authentication
                identifiers, and subscription tier metadata.
              </li>
              <li>
                <strong className="font-medium text-ink">
                  Equipment QR Records &amp; Inspection Logs:
                </strong>{" "}
                We store the SOP checklists, equipment labels, asset
                identifiers, and inspection submissions created by you and your
                team.
              </li>
              <li>
                <strong className="font-medium text-ink">
                  GPS Coordinates &amp; Watermarked Photos:
                </strong>{" "}
                When a worker performs an inspection scan that includes photo
                proof or location verification, we collect and store the
                uploaded images (including embedded timestamp/location
                watermarks) and GPS coordinates solely to provide verifiable
                audit trails for your organization.
              </li>
            </ul>
          </section>

          <section className="space-y-2.5">
            <h2 className="text-lg font-semibold text-ink">
              3. Payment Processing (Razorpay)
            </h2>
            <p>
              Paid subscriptions for FastCC QR are processed securely through{" "}
              <strong className="font-medium text-ink">Razorpay</strong>. FastCC
              Corp. does not collect, process, or store your credit/debit card
              numbers, CVV, bank account details, or UPI PINs on our servers.
              We only retain payment references, order IDs, and subscription
              status needed to provision your plan.
            </p>
          </section>

          <section className="space-y-2.5">
            <h2 className="text-lg font-semibold text-ink">
              4. How We Use Your Data
            </h2>
            <p>
              We use your data strictly to operate, maintain, and improve FastCC
              QR—including generating QR labels, translating worker SOPs,
              storing inspection logs, producing audit PDFs, and providing
              customer support. We do not sell your personal data or operational
              records to third parties.
            </p>
          </section>

          <section className="space-y-2.5">
            <h2 className="text-lg font-semibold text-ink">
              5. Data Retention
            </h2>
            <p>
              We retain your account data, QR records, and inspection logs for
              as long as your account remains active or as needed to fulfill
              operational, billing, and legal obligations.
            </p>
          </section>

          <section className="space-y-2.5">
            <h2 className="text-lg font-semibold text-ink">
              6. Data Deletion &amp; Contact
            </h2>
            <p>
              You may request access to, correction of, or permanent deletion of
              your account and associated inspection data at any time by
              emailing{" "}
              <a
                href="mailto:mawahab2786@gmail.com"
                className="font-medium text-utility-blue hover:underline"
              >
                mawahab2786@gmail.com
              </a>
              . We will process verified deletion requests promptly.
            </p>
          </section>
        </article>
      </div>
    </main>
  );
}
