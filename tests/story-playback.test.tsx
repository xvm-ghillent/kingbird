import { describe, it, expect, vi, beforeEach } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useStoryPlayback } from "@/app/lib/use-story-playback";

function fixture() {
  const progress = document.createElement("span");
  const video = {
    duration: 10,
    currentTime: 0,
    ended: false,
    play: vi.fn().mockResolvedValue(undefined),
    pause: vi.fn(),
  } as unknown as HTMLVideoElement;
  return {
    storyKey: "one",
    durationMs: 7000,
    mediaType: "image" as "image" | "video",
    paused: false,
    final: false,
    progressRef: { current: progress },
    videoRef: { current: video },
    onAdvance: vi.fn(),
    onPlayBlocked: vi.fn(),
  };
}
beforeEach(() => vi.useFakeTimers());
describe("story playback clock", () => {
  it("fills an image segment and advances exactly once after its editorial duration", () => {
    const options = fixture();
    renderHook(() => useStoryPlayback(options));
    act(() => vi.advanceTimersByTime(3500));
    const ratio = Number(
      options.progressRef.current.style.transform.match(/[\d.]+/)?.[0],
    );
    expect(ratio).toBeGreaterThan(0.49);
    expect(ratio).toBeLessThan(0.51);
    expect(options.onAdvance).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(3600));
    expect(options.onAdvance).toHaveBeenCalledTimes(1);
    act(() => vi.advanceTimersByTime(20000));
    expect(options.onAdvance).toHaveBeenCalledTimes(1);
  });
  it("preserves remaining image time while paused and resumes without a catch-up jump", () => {
    const options = fixture();
    const { rerender } = renderHook((p) => useStoryPlayback(p), {
      initialProps: options,
    });
    act(() => vi.advanceTimersByTime(3000));
    const before = options.progressRef.current.style.transform;
    rerender({ ...options, paused: true });
    act(() => vi.advanceTimersByTime(60000));
    expect(options.progressRef.current.style.transform).toBe(before);
    expect(options.onAdvance).not.toHaveBeenCalled();
    rerender({ ...options, paused: false });
    act(() => vi.advanceTimersByTime(3900));
    expect(options.onAdvance).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(200));
    expect(options.onAdvance).toHaveBeenCalledTimes(1);
  });
  it("resets the segment when returning to a previous story", () => {
    const options = fixture();
    const { rerender } = renderHook((p) => useStoryPlayback(p), {
      initialProps: options,
    });
    act(() => vi.advanceTimersByTime(4000));
    rerender({ ...options, storyKey: "two" });
    expect(options.progressRef.current.style.transform).toBe("scaleX(0)");
    act(() => vi.advanceTimersByTime(2000));
    rerender({ ...options, storyKey: "one" });
    expect(options.progressRef.current.style.transform).toBe("scaleX(0)");
    act(() => vi.advanceTimersByTime(6000));
    expect(options.onAdvance).not.toHaveBeenCalled();
  });
  it("uses actual video playback time, pauses the media, and respects an editorial cutoff", () => {
    const options = {
      ...fixture(),
      mediaType: "video" as const,
      cutoffSeconds: 8,
    };
    const { rerender } = renderHook((p) => useStoryPlayback(p), {
      initialProps: options,
    });
    expect(options.videoRef.current.play).toHaveBeenCalledTimes(1);
    options.videoRef.current.currentTime = 4;
    act(() => vi.advanceTimersByTime(10000));
    expect(options.progressRef.current.style.transform).toBe("scaleX(0.5)");
    expect(options.onAdvance).not.toHaveBeenCalled();
    rerender({ ...options, paused: true });
    expect(options.videoRef.current.pause).toHaveBeenCalled();
    rerender({ ...options, paused: false });
    options.videoRef.current.currentTime = 8;
    act(() => vi.advanceTimersByTime(20));
    expect(options.onAdvance).toHaveBeenCalledTimes(1);
  });
  it("keeps the final offer on screen indefinitely", () => {
    const options = { ...fixture(), final: true };
    renderHook(() => useStoryPlayback(options));
    act(() => vi.advanceTimersByTime(120000));
    expect(options.progressRef.current.style.transform).toBe("scaleX(1)");
    expect(options.onAdvance).not.toHaveBeenCalled();
  });
  it("does not turn an expected play cancellation into an autoplay-blocked state", async () => {
    const options = { ...fixture(), mediaType: "video" as const };
    options.videoRef.current.play = vi
      .fn()
      .mockRejectedValue(new DOMException("Interrupted", "AbortError"));
    renderHook(() => useStoryPlayback(options));
    await act(async () => {
      await Promise.resolve();
    });
    expect(options.onPlayBlocked).not.toHaveBeenCalled();
  });
});
