"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

interface QrCodePreviewProps {
  value: string;
  size?: number;
  logoSrc?: string | null;
  showWatermark?: boolean;
  className?: string;
}

/** High-contrast QR code preview using ECC level H with optional centered logo overlay. */
export function QrCodePreview({
  value,
  size = 240,
  logoSrc = null,
  showWatermark = false,
  className = "",
}: QrCodePreviewProps) {
  const [dataUrl, setDataUrl] = useState<string>("");

  useEffect(() => {
    let active = true;
    QRCode.toDataURL(value, {
      errorCorrectionLevel: "H",
      margin: 2,
      width: size * 2,
      color: {
        dark: "#0F172A",
        light: "#FFFFFF",
      },
    })
      .then((url) => {
        if (active) setDataUrl(url);
      })
      .catch(() => {
        if (active) setDataUrl("");
      });

    return () => {
      active = false;
    };
  }, [value, size]);

  return (
    <div
      className={`inline-flex flex-col items-center overflow-hidden rounded-lg border border-border bg-white ${className}`}
    >
      <div
        className="relative flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        {dataUrl ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={dataUrl}
            alt={`QR code for ${value}`}
            width={size}
            height={size}
            className="h-full w-full object-contain"
          />
        ) : (
          <div className="h-full w-full animate-pulse bg-canvas-muted" />
        )}

        {logoSrc ? (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="flex h-[22%] w-[22%] items-center justify-center rounded-md border border-border bg-white p-1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logoSrc}
                alt="QR center logo"
                className="h-full w-full rounded-sm object-contain"
              />
            </div>
          </div>
        ) : null}
      </div>

      {showWatermark ? (
        <div className="w-full px-2 pb-1.5 text-center text-[10px] font-semibold leading-none tracking-tight text-ink-muted">
          Powered by FastCC QR
        </div>
      ) : null}
    </div>
  );
}
