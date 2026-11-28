export interface ExtractedVideoFrames {
  frames: File[];
  durationSec: number;
}

const DEFAULT_FRAME_COUNT = 5;
const MAX_FRAME_WIDTH = 960;
const FRAME_JPEG_QUALITY = 0.78;

function seekVideo(video: HTMLVideoElement, timeSec: number): Promise<void> {
  return new Promise((resolve, reject) => {
    const onSeeked = () => {
      cleanup();
      resolve();
    };
    const onError = () => {
      cleanup();
      reject(new Error("Failed to seek video while extracting key frames."));
    };
    const cleanup = () => {
      video.removeEventListener("seeked", onSeeked);
      video.removeEventListener("error", onError);
    };

    video.addEventListener("seeked", onSeeked, { once: true });
    video.addEventListener("error", onError, { once: true });
    video.currentTime = timeSec;
  });
}

function canvasToJpegBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Canvas failed to encode key frame."));
        }
      },
      "image/jpeg",
      FRAME_JPEG_QUALITY,
    );
  });
}

/**
 * Extracts evenly spaced JPEG key frames from a client-side video File using
 * an offscreen <video> + <canvas> so Vision APIs can analyze the video without
 * uploading the full video binary.
 */
export async function extractVideoKeyFrames(
  file: File,
  frameCount = DEFAULT_FRAME_COUNT,
): Promise<ExtractedVideoFrames> {
  const objectUrl = URL.createObjectURL(file);
  const video = document.createElement("video");
  video.muted = true;
  video.playsInline = true;
  video.preload = "auto";

  try {
    await new Promise<void>((resolve, reject) => {
      const onLoaded = () => {
        cleanup();
        resolve();
      };
      const onError = () => {
        cleanup();
        reject(new Error("Unable to decode video metadata in browser."));
      };
      const cleanup = () => {
        video.removeEventListener("loadedmetadata", onLoaded);
        video.removeEventListener("error", onError);
      };

      video.addEventListener("loadedmetadata", onLoaded, { once: true });
      video.addEventListener("error", onError, { once: true });
      video.src = objectUrl;
    });

    const durationSec =
      Number.isFinite(video.duration) && video.duration > 0
        ? video.duration
        : 10;

    const srcWidth = video.videoWidth || 640;
    const srcHeight = video.videoHeight || 360;
    const scale = Math.min(1, MAX_FRAME_WIDTH / srcWidth);
    const width = Math.max(1, Math.round(srcWidth * scale));
    const height = Math.max(1, Math.round(srcHeight * scale));

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Canvas 2D context is unavailable.");
    }

    const clampedCount = Math.max(1, Math.min(5, frameCount));
    const timestamps: number[] = [];
    for (let i = 0; i < clampedCount; i += 1) {
      const fraction = (i + 0.5) / clampedCount;
      const t = Math.min(
        Math.max(0, durationSec * fraction),
        Math.max(0, durationSec - 0.1),
      );
      timestamps.push(t);
    }

    const frames: File[] = [];
    for (let i = 0; i < timestamps.length; i += 1) {
      await seekVideo(video, timestamps[i]);
      ctx.drawImage(video, 0, 0, width, height);
      const blob = await canvasToJpegBlob(canvas);
      frames.push(
        new File([blob], `frame-${i + 1}.jpg`, { type: "image/jpeg" }),
      );
    }

    return {
      frames,
      durationSec: Math.round(durationSec),
    };
  } finally {
    video.removeAttribute("src");
    video.load();
    URL.revokeObjectURL(objectUrl);
  }
}
