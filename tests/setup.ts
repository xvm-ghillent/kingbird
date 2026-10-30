import "@testing-library/jest-dom/vitest";
import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";
afterEach(() => {
  cleanup();
  sessionStorage.clear();
  window.kingbirdEvents = [];
  window.history.replaceState(null, "", "/");
  vi.restoreAllMocks();
  vi.useRealTimers();
});
// JSDOM has no layout; the modal's visibility filter uses this browser API.
Object.defineProperty(HTMLElement.prototype, "getClientRects", {
  value() {
    return [{ width: 10, height: 10 }];
  },
});
if (!window.PointerEvent) {
  class TestPointerEvent extends MouseEvent {
    pointerType: string;
    constructor(type: string, params: PointerEventInit = {}) {
      super(type, params);
      this.pointerType = params.pointerType ?? "mouse";
    }
  }
  Object.defineProperty(window, "PointerEvent", { value: TestPointerEvent });
}

HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(undefined);
HTMLMediaElement.prototype.pause = vi.fn();
