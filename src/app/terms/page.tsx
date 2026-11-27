import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms & Conditions — FastCC QR",
  description:
    "Terms and Conditions governing Free, Pro, and Business SaaS usage of FastCC QR operated by FastCC Corp., Hyderabad, Telangana, India.",
};

export default function TermsPage() {
  return (
    <main className="bg-surface">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="mb-6 flex items-center gap-2 text-xs text-ink-muted">
          <Link href="/" className="hover:text-ink hover:underline">
            FastCC QR
          </Link>
          <span>/</span>
          <span className="font-medium text-ink">Terms &amp; Conditions</span>
        </div>

        <header className="border-b border-border pb-8">
          <p className="font-mono text-xs font-semibold uppercase tracking-wider text-ink-muted">
            Legal
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Terms &amp; Conditions
          </h1>
          <p className="mt-3 text-sm text-ink-muted">
            Effective Date: January 1, 2026 &middot; Operated by{" "}
            <strong className="font-medium text-ink">FastCC Corp.</strong>
          </p>
        </header>

        <article className="mt-8 space-y-8 text-sm leading-relaxed text-ink-muted sm:text-base">
          <section className="space-y-2.5">
            <h2 className="text-lg font-semibold text-ink">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using{" "}
              <strong className="font-medium text-ink">FastCC QR</strong>,
              operated by{" "}
              <strong className="font-medium text-ink">FastCC Corp.</strong>{" "}
              (founded by Abdul Wahab), you agree to be bound by these Terms
              &amp; Conditions. If you are using the service on behalf of an
              organization, you represent that you have authority to bind that
              organization.
            </p>
          </section>

          <section className="space-y-2.5">
            <h2 className="text-lg font-semibold text-ink">
              2. Free vs. Pro &amp; Business SaaS Plans
            </h2>
            <p>
              FastCC QR offers a Free tier with baseline QR label and inspection
              capabilities, as well as paid Pro and Business subscription plans
              billed on 30-day cycles via Razorpay. Plan limits, features, and
              pricing are displayed on our{" "}
              <Link
                href="/pricing"
                className="font-medium text-utility-blue hover:underline"
              >
                Pricing
              </Link>{" "}
              page and may be updated with prior notice.
            </p>
          </section>

          <section className="space-y-2.5">
            <h2 className="text-lg font-semibold text-ink">
              3. Acceptable Use
            </h2>
            <p>
              You agree to use FastCC QR solely for lawful operational, safety,
              maintenance, and inspection workflows. You must not misuse the
              service, attempt unauthorized access to other accounts or
              infrastructure, upload malicious or unlawful content, or
              interfere with platform availability.
            </p>
          </section>

          <section className="space-y-2.5">
            <h2 className="text-lg font-semibold text-ink">
              4. Account Responsibility
            </h2>
            <p>
              You are responsible for maintaining the confidentiality of your
              login credentials and for all activities occurring under your
              account. You must ensure that QR codes, SOPs, and inspection logs
              shared with frontline workers are accurate and appropriate for your
              operational environment.
            </p>
          </section>

          <section className="space-y-2.5">
            <h2 className="text-lg font-semibold text-ink">
              5. Intellectual Property
            </h2>
            <p>
              All software, user interface designs, branding, and documentation
              associated with FastCC QR remain the intellectual property of
              FastCC Corp. You retain full ownership of the SOP content,
              equipment records, photos, and inspection logs you upload to the
              platform.
            </p>
          </section>

          <section className="space-y-2.5">
            <h2 className="text-lg font-semibold text-ink">
              6. Service Availability
            </h2>
            <p>
              We strive to keep FastCC QR reliable and accessible, but the
              service is provided on an &ldquo;as is&rdquo; and &ldquo;as
              available&rdquo; basis. Scheduled maintenance, updates, or
              upstream infrastructure outages may occasionally affect access.
            </p>
          </section>

          <section className="space-y-2.5">
            <h2 className="text-lg font-semibold text-ink">
              7. Limitation of Liability
            </h2>
            <p>
              To the maximum extent permitted by applicable law, FastCC Corp.
              and its founder shall not be liable for any indirect, incidental,
              special, consequential, or punitive damages, or any loss of
              profits, data, or operational uptime arising out of your use of
              FastCC QR.
            </p>
          </section>

          <section className="space-y-2.5">
            <h2 className="text-lg font-semibold text-ink">
              8. Governing Law &amp; Jurisdiction
            </h2>
            <p>
              These Terms &amp; Conditions are governed by and construed in
              accordance with the laws of India. Any disputes arising out of or
              relating to these terms or the use of FastCC QR shall be subject
              to the exclusive jurisdiction of the courts in{" "}
              <strong className="font-medium text-ink">
                Hyderabad, Telangana, India
              </strong>
              .
            </p>
          </section>

          <section className="space-y-2.5">
            <h2 className="text-lg font-semibold text-ink">9. Contact</h2>
            <p>
              For legal notices or questions regarding these Terms, contact{" "}
              <a
                href="mailto:mawahab2786@gmail.com"
                className="font-medium text-utility-blue hover:underline"
              >
                mawahab2786@gmail.com
              </a>
              .
            </p>
          </section>
        </article>
      </div>
    </main>
  );
}
