import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy — FastCC QR",
  description:
    "Subscription billing, cancellation terms, 7-day refund eligibility, and 5–7 business day processing timeline for FastCC QR via Razorpay.",
};

export default function RefundPolicyPage() {
  return (
    <main className="bg-surface">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="mb-6 flex items-center gap-2 text-xs text-ink-muted">
          <Link href="/" className="hover:text-ink hover:underline">
            FastCC QR
          </Link>
          <span>/</span>
          <span className="font-medium text-ink">
            Refund &amp; Cancellation Policy
          </span>
        </div>

        <header className="border-b border-border pb-8">
          <p className="font-mono text-xs font-semibold uppercase tracking-wider text-ink-muted">
            Billing &amp; Compliance
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            Refund &amp; Cancellation Policy
          </h1>
          <p className="mt-3 text-sm text-ink-muted">
            Effective Date: January 1, 2026 &middot;{" "}
            <strong className="font-medium text-ink">FastCC Corp.</strong>{" "}
            (FastCC QR)
          </p>
        </header>

        <article className="mt-8 space-y-8 text-sm leading-relaxed text-ink-muted sm:text-base">
          <section className="space-y-2.5">
            <h2 className="text-lg font-semibold text-ink">
              1. Subscription Billing
            </h2>
            <p>
              Paid plans on FastCC QR (Pro and Business) are billed on a{" "}
              <strong className="font-medium text-ink">30-day cycle</strong> and
              processed securely via{" "}
              <strong className="font-medium text-ink">Razorpay</strong>. Plan
              access is activated immediately upon successful payment
              verification.
            </p>
          </section>

          <section className="space-y-2.5">
            <h2 className="text-lg font-semibold text-ink">
              2. Cancellation Policy
            </h2>
            <p>
              You may cancel your paid subscription at any time. When you
              cancel, your paid plan features remain active until the end of
              your current 30-day billing period, after which your account will
              revert to the Free tier with no further charges.
            </p>
          </section>

          <section className="space-y-2.5">
            <h2 className="text-lg font-semibold text-ink">
              3. 7-Day Refund Window
            </h2>
            <p>
              We offer a{" "}
              <strong className="font-medium text-ink">
                7-day refund window
              </strong>{" "}
              from the date of transaction for:
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Accidental duplicate charges for the same billing cycle.</li>
              <li>
                Unresolved technical billing issues where your paid plan was not
                provisioned after payment.
              </li>
            </ul>
            <p>
              To request a refund, please email{" "}
              <a
                href="mailto:mawahab2786@gmail.com"
                className="font-medium text-utility-blue hover:underline"
              >
                mawahab2786@gmail.com
              </a>{" "}
              within 7 days of the charge with your account email and Razorpay
              payment or order ID.
            </p>
          </section>

          <section className="space-y-2.5">
            <h2 className="text-lg font-semibold text-ink">
              4. Refund Processing Timeline
            </h2>
            <p>
              Once a refund request is verified and approved, the refund is
              initiated promptly and typically takes{" "}
              <strong className="font-medium text-ink">
                5–7 business days
              </strong>{" "}
              to reflect in your original payment method, depending on your bank
              or card issuer.
            </p>
          </section>
        </article>
      </div>
    </main>
  );
}
