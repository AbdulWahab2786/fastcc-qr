"use client";

import { useEffect, useState } from "react";

interface CompetitorItem {
  pct: string;
  name: string;
  domain: string;
  fallbackBg: string;
  fallbackLetter: string;
}

const COMPETITORS: readonly CompetitorItem[] = [
  {
    pct: "80% cheaper",
    name: "SafetyCulture",
    domain: "safetyculture.com",
    fallbackBg: "bg-indigo-600",
    fallbackLetter: "S",
  },
  {
    pct: "85% cheaper",
    name: "UpKeep",
    domain: "upkeep.com",
    fallbackBg: "bg-blue-600",
    fallbackLetter: "U",
  },
  {
    pct: "90% cheaper",
    name: "MaintainX",
    domain: "getmaintainx.com",
    fallbackBg: "bg-emerald-600",
    fallbackLetter: "M",
  },
];

const ROTATION_INTERVAL_MS = 3000;

export function LandingHero() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [failedLogos, setFailedLogos] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % COMPETITORS.length);
    }, ROTATION_INTERVAL_MS);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="mx-auto mb-10 max-w-4xl pt-2 text-center sm:mb-12">
      <h1 className="font-serif-display text-5xl font-normal tracking-tight leading-[1.08] text-neutral-950 md:text-7xl">
        <span className="block">Run QR inspections</span>
        <span className="mt-1 grid justify-items-center">
          {COMPETITORS.map((item, idx) => {
            const isActive = idx === activeIndex;
            const hasLogoError = Boolean(failedLogos[item.domain]);

            return (
              <span
                key={item.domain}
                aria-hidden={!isActive}
                className={`col-start-1 row-start-1 block transition-all duration-500 ease-out ${
                  isActive
                    ? "translate-y-0 opacity-100"
                    : "pointer-events-none translate-y-2 opacity-0 select-none"
                }`}
              >
                <span className="relative z-0 inline-block">
                  {item.pct}
                  <span
                    aria-hidden="true"
                    className="absolute right-0 bottom-1 left-0 -z-10 h-[36%] bg-neutral-200/85"
                  />
                </span>{" "}
                than
                <span className="mx-2 inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-neutral-200/80 bg-white p-1.5 align-middle shadow-sm md:h-12 md:w-12">
                  {hasLogoError ? (
                    <span
                      aria-hidden="true"
                      className={`flex h-full w-full items-center justify-center rounded-lg font-sans text-base font-bold text-white md:text-lg ${item.fallbackBg}`}
                    >
                      {item.fallbackLetter}
                    </span>
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={`https://www.google.com/s2/favicons?domain=${item.domain}&sz=128`}
                      alt={`${item.name} logo`}
                      className="h-full w-full object-contain"
                      onError={() =>
                        setFailedLogos((prev) =>
                          prev[item.domain]
                            ? prev
                            : { ...prev, [item.domain]: true },
                        )
                      }
                    />
                  )}
                </span>
                <span>{item.name}</span>
              </span>
            );
          })}
        </span>
      </h1>

      <p className="mx-auto mt-6 max-w-xl font-sans text-base text-neutral-500 md:text-lg">
        Create permanent machine QR codes in seconds. Workers scan with zero app
        or login, capture GPS-stamped photos, and you export 1-click audit PDFs.
      </p>
    </div>
  );
}
