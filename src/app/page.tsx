import { Suspense } from "react";
import { HomeWorkbench } from "@/components/HomeWorkbench";

interface HomePageProps {
  searchParams: Promise<{ template?: string }>;
}

async function HomeContent({ searchParams }: HomePageProps) {
  const { template } = await searchParams;
  return <HomeWorkbench initialTemplateId={template} />;
}

export default function HomePage({ searchParams }: HomePageProps) {
  return (
    <Suspense
      fallback={
        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
          <div className="h-96 animate-pulse rounded-xl border border-border bg-surface" />
        </main>
      }
    >
      <HomeContent searchParams={searchParams} />
    </Suspense>
  );
}
