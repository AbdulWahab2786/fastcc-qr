import { Suspense } from "react";
import type { Metadata } from "next";
import { HomeWorkbench } from "@/components/HomeWorkbench";
import { LandingShowcase } from "@/components/LandingShowcase";

export const metadata: Metadata = {
  title:
    "FastCC QR — Industrial QR SOP, Audit & Equipment Inspection Platform",
  description:
    "QR SOPs, live GPS-watermarked photo proof, 5-language worker checklists, WhatsApp faulty alerts, A4 sticker sheets, and 1-click FSSAI/ISO audit PDFs for Indian factories, cloud kitchens, and warehouses.",
};

interface HomePageProps {
  searchParams: Promise<{ template?: string }>;
}

async function HomeContent({ searchParams }: HomePageProps) {
  const { template } = await searchParams;
  return <HomeWorkbench initialTemplateId={template} />;
}

export default function HomePage({ searchParams }: HomePageProps) {
  return (
    <main>
      <Suspense
        fallback={
          <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
            <div className="h-96 animate-pulse rounded-xl border border-border bg-surface" />
          </div>
        }
      >
        <HomeContent searchParams={searchParams} />
      </Suspense>
      <LandingShowcase />
    </main>
  );
}
