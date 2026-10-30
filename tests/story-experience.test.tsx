import React from "react";
import { describe, it, expect, vi } from "vitest";
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import StoryExperience from "@/app/components/story-experience";
import { commerce } from "@/content/stories";
function accepted() {
  sessionStorage.setItem("kingbird-age-attested", "yes");
  return render(<StoryExperience />);
}
describe("Kingbird story experience", () => {
  it("requires an age attestation and keeps the experience inert on decline", async () => {
    render(<StoryExperience />);
    expect(await screen.findByRole("dialog")).toBeInTheDocument();
    expect(document.querySelector("main")).toHaveAttribute("inert");
    fireEvent.click(screen.getByRole("button", { name: "I’m under 21" }));
    expect(
      screen.getByRole("heading", { name: "We’ll save you a story." }),
    ).toBeInTheDocument();
    expect(sessionStorage.getItem("kingbird-age-attested")).toBeNull();
    expect(window.kingbirdEvents ?? []).toHaveLength(0);
    fireEvent.click(
      screen.getByRole("button", { name: "Return to age confirmation" }),
    );
    fireEvent.click(screen.getByRole("button", { name: "I am 21 or older" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(sessionStorage.getItem("kingbird-age-attested")).toBe("yes");
  });
  it("navigates with keyboard, respects boundaries and updates the shareable story URL", () => {
    accepted();
    fireEvent.keyDown(window, { key: "ArrowLeft" });
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Be the life",
    );
    fireEvent.keyDown(window, { key: "ArrowRight" });
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "American roots",
    );
    expect(location.search).toBe("?story=american-aperitif");
    fireEvent.keyDown(window, { key: "End" });
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Your next great gathering",
    );
    fireEvent.keyDown(window, { key: "ArrowRight" });
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Your next great gathering",
    );
    fireEvent.keyDown(window, { key: "Home" });
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Be the life",
    );
  });
  it("keeps the story position, traps recipe focus and restores the trigger on Escape", async () => {
    const user = userEvent.setup();
    accepted();
    await user.click(
      screen.getByRole("button", { name: "Story 3: Find your aperitif hour" }),
    );
    const trigger = screen.getByRole("button", { name: "Find your pour" });
    await user.click(trigger);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("2.5 oz")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Close drawer" })).toHaveFocus();
    await user.tab({ shift: true });
    expect(
      screen.getByRole("link", { name: "Just add Kingbird" }),
    ).toHaveFocus();
    await user.tab();
    expect(screen.getByRole("button", { name: "Close drawer" })).toHaveFocus();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
    expect(location.search).toBe("?story=aperitif-hour");
  });
  it("switches recipes with accessible tabs and uses verified measurements", async () => {
    const user = userEvent.setup();
    accepted();
    await user.click(
      screen.getByRole("button", { name: "Story 5: Find your favorite" }),
    );
    await user.click(screen.getByRole("button", { name: "Explore cocktails" }));
    await user.click(screen.getByRole("tab", { name: "Garibaldi" }));
    expect(
      screen.getByRole("heading", { name: "Kingbird Garibaldi" }),
    ).toBeInTheDocument();
    expect(screen.getAllByText("3 oz")).toHaveLength(2);
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("tab", { name: "Shandy" })).toHaveFocus();
    expect(screen.getByText("4 oz")).toBeInTheDocument();
    expect(screen.getByText("0.5 oz")).toBeInTheDocument();
    await user.keyboard("{ArrowLeft}");
    expect(screen.getByRole("tab", { name: "Garibaldi" })).toHaveFocus();
  });
  it("focuses the new drawer when switching from ingredients to recipes", async () => {
    const user = userEvent.setup();
    accepted();
    await user.click(
      screen.getByRole("button", {
        name: "Story 2: Meet the American aperitif",
      }),
    );
    const trigger = screen.getByRole("button", {
      name: "Discover what’s inside",
    });
    await user.click(trigger);
    expect(screen.getByText(/Colored with carmine/)).toBeInTheDocument();
    await user.click(
      screen.getByRole("button", { name: "Put it in a Spritz" }),
    );
    expect(screen.getByRole("button", { name: "Close drawer" })).toHaveFocus();
    await user.keyboard("{Escape}");
    expect(trigger).toHaveFocus();
  });
  it("recognizes horizontal touch swipes without turning vertical scrolling into navigation", () => {
    accepted();
    const surface = document.querySelector(".story-viewport")!;
    fireEvent.pointerDown(surface, {
      pointerType: "touch",
      clientX: 300,
      clientY: 400,
    });
    fireEvent.pointerUp(surface, {
      pointerType: "touch",
      clientX: 290,
      clientY: 100,
    });
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Be the life",
    );
    fireEvent.pointerDown(surface, {
      pointerType: "touch",
      clientX: 300,
      clientY: 400,
    });
    fireEvent.pointerUp(surface, {
      pointerType: "touch",
      clientX: 100,
      clientY: 410,
    });
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "American roots",
    );
    fireEvent.pointerDown(surface, {
      pointerType: "touch",
      clientX: 100,
      clientY: 400,
    });
    fireEvent.pointerUp(surface, {
      pointerType: "touch",
      clientX: 300,
      clientY: 410,
    });
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Be the life",
    );
  });
  it("does not report a full sequence for a skipped story, or invent purchase success", async () => {
    accepted();
    fireEvent.click(screen.getByRole("button", { name: "Skip to offer" }));
    expect(window.kingbirdEvents?.some((e) => e.event === "story_skip")).toBe(
      true,
    );
    expect(
      window.kingbirdEvents?.some((e) => e.event === "story_sequence_complete"),
    ).toBe(false);
    const link = document.querySelector<HTMLAnchorElement>("#story-primary")!;
    expect(link.href).toBe(commerce.productUrl);
    expect(link.target).toBe("_blank");
    // Intercept actual navigation while exercising the real tracking handler.
    link.addEventListener("click", (e) => e.preventDefault());
    fireEvent.click(link);
    expect(window.kingbirdEvents?.at(-1)?.event).toBe("purchase_handoff");
    expect(window.kingbirdEvents?.at(-1)?.destination).toBe(
      commerce.productUrl,
    );
    expect(
      window.kingbirdEvents?.some(
        (e) =>
          String(e.event) === "purchase" || String(e.event) === "add_to_cart",
      ),
    ).toBe(false);
    fireEvent.keyDown(window, { key: "Home" });
    for (let i = 0; i < 8; i++)
      fireEvent.keyDown(window, { key: "ArrowRight" });
    await waitFor(() =>
      expect(
        window.kingbirdEvents?.filter(
          (e) => e.event === "story_sequence_complete",
        ),
      ).toHaveLength(1),
    );
  });
  it("restores deep links and opens legacy recipe links without exposing the stories before age confirmation", async () => {
    history.replaceState(null, "", "/?story=possibilities&recipe=spritz");
    render(<StoryExperience />);
    expect(await screen.findByRole("dialog")).toHaveAccessibleName(
      "Good company. Grown-up company.",
    );
    fireEvent.click(screen.getByRole("button", { name: "I am 21 or older" }));
    expect(screen.getByRole("dialog")).toHaveAccessibleName(
      "A few good ideas.",
    );
    fireEvent.click(screen.getByRole("button", { name: "Close drawer" }));
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "One bottle. A few good ideas.",
    );
  });
});

describe("automatic story interaction pauses", () => {
  it("pauses on a long hold, suppresses the release tap, then resumes the remaining duration", () => {
    vi.useFakeTimers();
    accepted();
    act(() => vi.advanceTimersByTime(3000));
    const surface = document.querySelector(".story-viewport")!;
    fireEvent.pointerDown(surface, {
      pointerType: "touch",
      clientX: 280,
      clientY: 300,
    });
    act(() => vi.advanceTimersByTime(30000));
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Be the life",
    );
    fireEvent.pointerUp(surface, {
      pointerType: "touch",
      clientX: 280,
      clientY: 300,
    });
    fireEvent.click(screen.getByRole("button", { name: "Next story" }));
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Be the life",
    );
    act(() => vi.advanceTimersByTime(4100));
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "American roots",
    );
  });
  it("excludes inactive-tab time rather than jumping ahead when the tab returns", () => {
    vi.useFakeTimers();
    const visibility = vi
      .spyOn(document, "visibilityState", "get")
      .mockReturnValue("visible");
    accepted();
    act(() => vi.advanceTimersByTime(3000));
    visibility.mockReturnValue("hidden");
    fireEvent(document, new Event("visibilitychange"));
    act(() => vi.advanceTimersByTime(60000));
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Be the life",
    );
    visibility.mockReturnValue("visible");
    fireEvent(document, new Event("visibilitychange"));
    act(() => vi.advanceTimersByTime(3900));
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Be the life",
    );
    act(() => vi.advanceTimersByTime(200));
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "American roots",
    );
  });
  it("freezes the story while a recipe drawer is open", () => {
    vi.useFakeTimers();
    accepted();
    fireEvent.click(
      screen.getByRole("button", { name: "Story 3: Find your aperitif hour" }),
    );
    fireEvent.click(screen.getByRole("button", { name: "Find your pour" }));
    act(() => vi.advanceTimersByTime(30000));
    expect(location.search).toBe("?story=aperitif-hour");
    fireEvent.click(screen.getByRole("button", { name: "Close drawer" }));
    act(() => vi.advanceTimersByTime(7100));
    expect(location.search).toBe("?story=easy-company");
  });
});
