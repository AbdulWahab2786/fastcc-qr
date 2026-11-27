"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { PenTool, RotateCcw } from "lucide-react";

interface Point {
  x: number;
  y: number;
}

interface SignaturePadProps {
  onChange: (dataUrl: string | null) => void;
  disabled?: boolean;
  height?: number;
}

const MAX_EXPORT_WIDTH = 400;
const STROKE_COLOR = "#0F172A";
const STROKE_WIDTH = 2.4;

function drawStrokes(
  ctx: CanvasRenderingContext2D,
  strokes: Point[][],
  scale = 1,
): void {
  ctx.strokeStyle = STROKE_COLOR;
  ctx.fillStyle = STROKE_COLOR;
  ctx.lineWidth = STROKE_WIDTH * scale;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  for (const stroke of strokes) {
    if (stroke.length === 0) continue;

    if (stroke.length === 1) {
      ctx.beginPath();
      ctx.arc(
        stroke[0].x * scale,
        stroke[0].y * scale,
        (STROKE_WIDTH * scale) / 2,
        0,
        Math.PI * 2,
      );
      ctx.fill();
      continue;
    }

    ctx.beginPath();
    ctx.moveTo(stroke[0].x * scale, stroke[0].y * scale);
    for (let i = 1; i < stroke.length; i += 1) {
      ctx.lineTo(stroke[i].x * scale, stroke[i].y * scale);
    }
    ctx.stroke();
  }
}

function exportCompactPngDataUrl(
  strokes: Point[][],
  cssWidth: number,
  cssHeight: number,
): string | null {
  if (strokes.length === 0 || cssWidth <= 0 || cssHeight <= 0) {
    return null;
  }

  const targetWidth = Math.min(MAX_EXPORT_WIDTH, Math.max(1, Math.round(cssWidth)));
  const scale = targetWidth / cssWidth;
  const targetHeight = Math.max(1, Math.round(cssHeight * scale));

  const exportCanvas = document.createElement("canvas");
  exportCanvas.width = targetWidth;
  exportCanvas.height = targetHeight;

  const ctx = exportCanvas.getContext("2d");
  if (!ctx) return null;

  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, targetWidth, targetHeight);
  drawStrokes(ctx, strokes, scale);

  return exportCanvas.toDataURL("image/png");
}

export function SignaturePad({
  onChange,
  disabled = false,
  height = 148,
}: SignaturePadProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const strokesRef = useRef<Point[][]>([]);
  const activeStrokeRef = useRef<Point[] | null>(null);
  const activePointerIdRef = useRef<number | null>(null);
  const cssSizeRef = useRef<{ width: number; height: number }>({
    width: 360,
    height,
  });

  const [hasSignature, setHasSignature] = useState(false);

  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 3);
    const { width, height: boxHeight } = cssSizeRef.current;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, boxHeight);

    const allStrokes = activeStrokeRef.current
      ? [...strokesRef.current, activeStrokeRef.current]
      : strokesRef.current;
    drawStrokes(ctx, allStrokes, 1);
  }, []);

  const syncCanvasDimensions = useCallback(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const rect = container.getBoundingClientRect();
    const cssWidth = Math.max(200, Math.floor(rect.width));
    const cssHeight = height;
    const dpr = Math.min(window.devicePixelRatio || 1, 3);

    cssSizeRef.current = { width: cssWidth, height: cssHeight };
    canvas.width = Math.floor(cssWidth * dpr);
    canvas.height = Math.floor(cssHeight * dpr);
    canvas.style.width = `${cssWidth}px`;
    canvas.style.height = `${cssHeight}px`;

    renderCanvas();
  }, [height, renderCanvas]);

  useEffect(() => {
    syncCanvasDimensions();
    const container = containerRef.current;
    if (!container || typeof ResizeObserver === "undefined") {
      return;
    }

    const observer = new ResizeObserver(() => {
      syncCanvasDimensions();
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, [syncCanvasDimensions]);

  function getPointFromEvent(event: ReactPointerEvent<HTMLCanvasElement>): Point {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(rect.width, event.clientX - rect.left)),
      y: Math.max(0, Math.min(rect.height, event.clientY - rect.top)),
    };
  }

  function commitStrokes() {
    const { width, height: boxHeight } = cssSizeRef.current;
    const dataUrl = exportCompactPngDataUrl(strokesRef.current, width, boxHeight);
    setHasSignature(strokesRef.current.length > 0);
    onChange(dataUrl);
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLCanvasElement>) {
    if (disabled) return;
    if (event.button !== 0 && event.pointerType === "mouse") return;

    event.preventDefault();
    const canvas = canvasRef.current;
    if (canvas && canvas.setPointerCapture) {
      try {
        canvas.setPointerCapture(event.pointerId);
      } catch {
        // Ignore capture errors on unsupported browsers.
      }
    }

    activePointerIdRef.current = event.pointerId;
    const startPoint = getPointFromEvent(event);
    activeStrokeRef.current = [startPoint];
    setHasSignature(true);
    renderCanvas();
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLCanvasElement>) {
    if (disabled) return;
    if (
      activePointerIdRef.current !== event.pointerId ||
      !activeStrokeRef.current
    ) {
      return;
    }

    event.preventDefault();
    const nextPoint = getPointFromEvent(event);
    const stroke = activeStrokeRef.current;
    const prevPoint = stroke[stroke.length - 1];
    const dx = nextPoint.x - prevPoint.x;
    const dy = nextPoint.y - prevPoint.y;
    if (dx * dx + dy * dy < 1.5) return;

    stroke.push(nextPoint);
    renderCanvas();
  }

  function finishStroke(event: ReactPointerEvent<HTMLCanvasElement>) {
    if (
      activePointerIdRef.current !== event.pointerId ||
      !activeStrokeRef.current
    ) {
      return;
    }

    const canvas = canvasRef.current;
    if (canvas && canvas.releasePointerCapture) {
      try {
        if (canvas.hasPointerCapture(event.pointerId)) {
          canvas.releasePointerCapture(event.pointerId);
        }
      } catch {
        // Ignore release errors.
      }
    }

    strokesRef.current = [...strokesRef.current, activeStrokeRef.current];
    activeStrokeRef.current = null;
    activePointerIdRef.current = null;
    renderCanvas();
    commitStrokes();
  }

  function handleClear() {
    if (disabled) return;
    strokesRef.current = [];
    activeStrokeRef.current = null;
    activePointerIdRef.current = null;
    setHasSignature(false);
    renderCanvas();
    onChange(null);
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-ink-muted">
          <PenTool className="h-3.5 w-3.5 text-utility-blue" />
          Worker Digital Signature (Optional)
        </span>
        <div className="flex items-center gap-2">
          {hasSignature ? (
            <span className="rounded border border-action-green/30 bg-action-green/10 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase text-action-green">
              Signed
            </span>
          ) : null}
          <button
            type="button"
            onClick={handleClear}
            disabled={disabled || !hasSignature}
            className="inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-border bg-canvas px-3 text-xs font-semibold text-ink transition-colors hover:bg-canvas-muted disabled:cursor-not-allowed disabled:opacity-45"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Clear
          </button>
        </div>
      </div>

      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-lg border border-border bg-white"
        style={{ height }}
      >
        <canvas
          ref={canvasRef}
          aria-label="Worker digital signature pad"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={finishStroke}
          onPointerCancel={finishStroke}
          className={`block h-full w-full touch-none select-none ${
            disabled ? "cursor-not-allowed opacity-60" : "cursor-crosshair"
          }`}
        />
        {!hasSignature ? (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
            <span className="text-xs font-medium text-ink-muted/75">
              Sign here with finger or mouse
            </span>
            <span className="mt-2 h-px w-44 border-b border-dashed border-border" />
          </div>
        ) : null}
      </div>
    </div>
  );
}
