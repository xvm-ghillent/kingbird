"use client";
import { useEffect, useRef } from "react";
import type { RefObject } from "react";
type PlaybackOptions = {
  storyKey: string;
  durationMs: number;
  mediaType: "image" | "video";
  cutoffSeconds?: number;
  paused: boolean;
  final: boolean;
  videoRef: RefObject<HTMLVideoElement | null>;
  progressRef: RefObject<HTMLSpanElement | null>;
  onAdvance: () => void;
  onPlayBlocked: () => void;
};
/** Image time counts only active viewing; video time comes from playback itself. */
export function useStoryPlayback({
  storyKey,
  durationMs,
  mediaType,
  cutoffSeconds,
  paused,
  final,
  videoRef,
  progressRef,
  onAdvance,
  onPlayBlocked,
}: PlaybackOptions) {
  const elapsed = useRef(0),
    advanced = useRef(false);
  useEffect(() => {
    elapsed.current = 0;
    advanced.current = false;
    if (progressRef.current)
      progressRef.current.style.transform = `scaleX(${final ? 1 : 0})`;
  }, [storyKey, final, progressRef]);
  useEffect(() => {
    const video = videoRef.current;
    if (mediaType !== "video" || !video) return;
    if (paused || final) {
      video.pause();
      return;
    }
    let cancelled = false;
    video.play()?.catch((error: DOMException) => {
      if (!cancelled && error?.name !== "AbortError") onPlayBlocked();
    });
    return () => {
      cancelled = true;
      video.pause();
    };
  }, [storyKey, mediaType, paused, final, videoRef, onPlayBlocked]);
  useEffect(() => {
    if (paused || final) return;
    let previous = performance.now();
    const interval = window.setInterval(() => {
      const now = performance.now(),
        delta = Math.max(0, now - previous);
      previous = now;
      if (advanced.current) return;
      let ratio = 0;
      if (mediaType === "video") {
        const video = videoRef.current;
        if (!video || !Number.isFinite(video.duration) || video.duration <= 0)
          return;
        const end = Math.min(video.duration, cutoffSeconds ?? video.duration);
        ratio = video.ended ? 1 : video.currentTime / end;
      } else {
        elapsed.current += delta;
        ratio = elapsed.current / Math.max(1000, durationMs);
      }
      if (progressRef.current)
        progressRef.current.style.transform = `scaleX(${Math.min(1, Math.max(0, ratio))})`;
      if (ratio >= 1) {
        advanced.current = true;
        onAdvance();
      }
    }, 16);
    return () => window.clearInterval(interval);
  }, [
    storyKey,
    durationMs,
    mediaType,
    cutoffSeconds,
    paused,
    final,
    videoRef,
    progressRef,
    onAdvance,
  ]);
}
