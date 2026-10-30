"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  commerce,
  recipes,
  stories,
  type Action,
  type RecipeId,
} from "@/content/stories";
import { track } from "@/app/lib/analytics";
import { useStoryPlayback } from "@/app/lib/use-story-playback";

type Drawer = "recipes" | "ingredients" | "index" | "sources" | null;
const recipeIds: RecipeId[] = ["spritz", "garibaldi", "shandy"];
function Arrow({ direction = "right" }: { direction?: "left" | "right" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={direction === "left" ? "arrow flipped" : "arrow"}
    >
      <path d="M4 12h15M13 5l7 7-7 7" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
function Wordmark({ className = "" }: { className?: string }) {
  return (
    <img
      className={`wordmark ${className}`}
      src="/assets/kingbird-wordmark.svg"
      alt="Kingbird"
      width="1446"
      height="207"
    />
  );
}
function useModalFocus(
  open: boolean,
  ref: React.RefObject<HTMLDivElement | null>,
  close?: () => void,
) {
  useEffect(() => {
    if (!open || !ref.current) return;
    const trigger =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const modal = ref.current;
    const selector =
      'button:not(:disabled), a[href], input, select, [tabindex="0"]';
    const first = modal.querySelector<HTMLElement>(selector);
    (first ?? modal).focus();
    const keydown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && close) {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== "Tab") return;
      const focusable = Array.from(
        modal.querySelectorAll<HTMLElement>(selector),
      ).filter((el) => el.getClientRects().length > 0);
      const first = focusable[0],
        last = focusable.at(-1);
      if (!first) {
        e.preventDefault();
        modal.focus();
        return;
      }
      if (
        e.shiftKey &&
        (document.activeElement === first || document.activeElement === modal)
      ) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", keydown);
    return () => {
      document.removeEventListener("keydown", keydown);
      if (trigger?.isConnected) trigger.focus();
    };
  }, [open, ref, close]);
}

export default function StoryExperience() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const [drawer, setDrawer] = useState<Drawer>(null);
  const [recipe, setRecipe] = useState<RecipeId>("spritz");
  const [age, setAge] = useState<"checking" | "ask" | "accepted" | "declined">(
    "checking",
  );
  const [hydrated, setHydrated] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null),
    ageRef = useRef<HTMLDivElement>(null);
  const impressionStart = useRef(0),
    visited = useRef(new Set<number>()),
    sequenceTracked = useRef(false);
  const pointer = useRef<{ x: number; y: number; type: string } | null>(null),
    swiped = useRef(false);
  const story = stories[current];
  const progressRef = useRef<HTMLSpanElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [manualPaused, setManualPaused] = useState(false);
  const [held, setHeld] = useState(false);
  const [tabInactive, setTabInactive] = useState(false);
  const [keyboardFocus, setKeyboardFocus] = useState(false);
  const [videoBlocked, setVideoBlocked] = useState(false);
  const holdStart = useRef(0);
  const onPlayBlocked = useCallback(() => setVideoBlocked(true), []);
  useEffect(() => {
    const visibility = () =>
      setTabInactive(document.visibilityState === "hidden");
    visibility();
    document.addEventListener("visibilitychange", visibility);
    const release = () => setHeld(false);
    window.addEventListener("pointerup", release);
    window.addEventListener("pointercancel", release);
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (reduced?.matches) setManualPaused(true);
    return () => {
      document.removeEventListener("visibilitychange", visibility);
      window.removeEventListener("pointerup", release);
      window.removeEventListener("pointercancel", release);
    };
  }, []);
  const closeDrawer = useCallback(() => setDrawer(null), []);
  useModalFocus(drawer !== null, drawerRef, closeDrawer);
  useModalFocus(hydrated && age !== "accepted", ageRef);

  useEffect(() => {
    let accepted = false;
    try {
      accepted = sessionStorage.getItem("kingbird-age-attested") === "yes";
    } catch {}
    setAge(accepted ? "accepted" : "ask");
    setHydrated(true);
    const params = new URLSearchParams(window.location.search);
    const requested = params.get("story");
    if (requested) {
      const index = stories.findIndex((s) => s.id === requested);
      if (index >= 0) setCurrent(index);
    }
    if (params.get("recipe") === "spritz") {
      setRecipe("spritz");
      setDrawer("recipes");
    }
  }, []);
  useEffect(() => {
    if (age !== "accepted") return;
    impressionStart.current = performance.now();
    visited.current.add(current);
    track("story_impression", stories[current], {
      media: stories[current].media,
    });
    if (visited.current.size === stories.length && !sequenceTracked.current) {
      track("story_sequence_complete", stories[current]);
      sequenceTracked.current = true;
    }
    const url = new URL(window.location.href);
    url.searchParams.set("story", stories[current].id);
    url.searchParams.delete("recipe");
    history.replaceState(null, "", url);
    setImageFailed(false);
    setVideoBlocked(false);
    setHeld(false);
    const next = stories[current + 1];
    if (next) {
      const image = new Image();
      image.src = next.mediaType === "video" ? (next.poster ?? "") : next.media;
    }
  }, [age, current]);
  useEffect(() => {
    if (drawer && age === "accepted")
      drawerRef.current?.querySelector<HTMLElement>("button")?.focus();
  }, [drawer, age]);
  useEffect(() => {
    if (hydrated && age !== "accepted")
      ageRef.current?.querySelector<HTMLElement>("button")?.focus();
  }, [age, hydrated]);
  const navigate = useCallback(
    (next: number, method: string) => {
      if (next < 0 || next >= stories.length || next === current) return;
      const active = stories[current];
      track("story_completed", active, {
        elapsed_ms: Math.round(performance.now() - impressionStart.current),
      });
      track("story_navigation", active, {
        direction: next > current ? "forward" : "backward",
        method,
        destination: stories[next].id,
      });
      if (Math.abs(next - current) > 1)
        track("story_skip", active, { destination: stories[next].id, method });
      setDirection(next > current ? "forward" : "backward");
      setCurrent(next);
    },
    [current],
  );
  useEffect(() => {
    if (drawer || age !== "accepted") return;
    const handler = (e: KeyboardEvent) => {
      if (
        e.altKey ||
        e.ctrlKey ||
        e.metaKey ||
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLSelectElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        navigate(current + 1, "keyboard");
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        navigate(current - 1, "keyboard");
      }
      if (e.key === "Home") {
        e.preventDefault();
        navigate(0, "keyboard");
      }
      if (e.key === "End") {
        e.preventDefault();
        navigate(stories.length - 1, "keyboard");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [age, current, drawer, navigate]);
  function acceptAge() {
    try {
      sessionStorage.setItem("kingbird-age-attested", "yes");
    } catch {}
    setAge("accepted");
  }
  function purchase(source: string, destination = commerce.productUrl) {
    track("cta_click", story, { label: "Bring Kingbird Home", source });
    track("purchase_handoff", story, {
      variant_id: commerce.variantId,
      destination,
      source,
    });
  }
  function openRecipe(id: RecipeId) {
    setRecipe(id);
    setDrawer("recipes");
    track("recipe_open", story, { recipe_id: id });
  }
  function action(action: Action) {
    track("cta_click", story, { label: story.cta.label, action });
    if (action === "next") navigate(current + 1, "cta");
    else if (action === "shop") {
      if (current === stories.length - 1) {
        purchase("story");
      } else navigate(stories.length - 1, "shop-cta");
    } else if (action === "sources") {
      setDrawer("sources");
    } else if (action === "flavor") navigate(5, "cta");
    else if (action === "ingredients") {
      setDrawer("ingredients");
      track("ingredient_open", story);
    } else openRecipe(action === "recipes" ? "spritz" : action);
  }
  const final = current === stories.length - 1;
  const light = story.theme === "light";
  const activeRecipe = recipes[recipe];
  const modalOpen = drawer !== null || age !== "accepted";
  const playbackPaused =
    modalOpen ||
    manualPaused ||
    held ||
    tabInactive ||
    keyboardFocus ||
    videoBlocked;
  const advanceAutomatically = useCallback(
    () => navigate(current + 1, "automatic"),
    [current, navigate],
  );
  useStoryPlayback({
    storyKey: story.id,
    durationMs: story.durationMs ?? 7000,
    mediaType: imageFailed ? "image" : story.mediaType,
    cutoffSeconds: story.cutoffSeconds,
    paused: playbackPaused,
    final,
    videoRef,
    progressRef,
    onAdvance: advanceAutomatically,
    onPlayBlocked,
  });
  function togglePlayback() {
    setKeyboardFocus(false);
    if (videoBlocked && videoRef.current) {
      videoRef.current
        .play()
        ?.then(() => setVideoBlocked(false))
        .catch(() => setVideoBlocked(true));
      setManualPaused(false);
    } else setManualPaused((value) => !value);
  }

  return (
    <>
      <div
        className="ambient"
        aria-hidden="true"
        style={{
          backgroundImage: `url(${story.layout === "photo" ? (story.poster ?? story.media) : "/assets/kingbird-cheers-pizzaparty.webp"})`,
        }}
      />
      <main className="experience" inert={modalOpen}>
        <div className="stage">
          <section
            className={`story-panel ${light ? "light" : "dark"}`}
            aria-label="Kingbird stories"
            aria-roledescription="story viewer"
            onPointerDownCapture={() => {
              setHeld(true);
              setKeyboardFocus(false);
            }}
            onPointerUpCapture={() => setHeld(false)}
            onPointerCancelCapture={() => setHeld(false)}
            onFocusCapture={(e) =>
              setKeyboardFocus(
                e.target.matches(":focus-visible") &&
                  !e.target.closest("[data-playback-toggle]"),
              )
            }
            onBlurCapture={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node))
                setKeyboardFocus(false);
            }}
          >
            <nav className="story-progress" aria-label="Story progression">
              {stories.map((s, i) => (
                <button
                  key={s.id}
                  aria-label={`Story ${i + 1}: ${s.chapter}`}
                  aria-current={i === current ? "step" : undefined}
                  onClick={() => navigate(i, "progress")}
                >
                  <span className="progress-track">
                    <span
                      className="progress-fill"
                      ref={i === current ? progressRef : undefined}
                      style={{
                        transform: `scaleX(${i < current || final ? 1 : 0})`,
                      }}
                    />
                  </span>
                </button>
              ))}
            </nav>
            <header className="story-header">
              <button
                className="story-brand"
                aria-label="Back to the first Kingbird story"
                onClick={() => navigate(0, "brand")}
              >
                <Wordmark />
              </button>
              <button
                className="skip-offer"
                onClick={() => {
                  if (!final) navigate(stories.length - 1, "skip-to-shop");
                  else {
                    document.getElementById("story-primary")?.focus();
                  }
                }}
              >
                Skip to offer
              </button>
            </header>
            <div
              className="story-viewport"
              onPointerDown={(e) => {
                pointer.current = {
                  x: e.clientX,
                  y: e.clientY,
                  type: e.pointerType,
                };
                swiped.current = false;
                holdStart.current = performance.now();
                setHeld(true);
                setKeyboardFocus(false);
              }}
              onPointerUp={(e) => {
                setHeld(false);
                if (!pointer.current) return;
                const dx = e.clientX - pointer.current.x,
                  dy = e.clientY - pointer.current.y;
                const longPress = performance.now() - holdStart.current > 220;
                if (
                  pointer.current.type === "touch" &&
                  Math.abs(dx) > 55 &&
                  Math.abs(dx) > Math.abs(dy) * 1.3
                ) {
                  swiped.current = true;
                  navigate(current + (dx < 0 ? 1 : -1), "swipe");
                } else if (longPress) swiped.current = true;
                pointer.current = null;
              }}
              onPointerCancel={() => {
                pointer.current = null;
                setHeld(false);
              }}
              onPointerLeave={() => {
                setHeld(false);
              }}
            >
              <article
                key={story.id}
                className={`story-slide layout-${story.layout} enter-${direction} ${story.animation}`}
                aria-roledescription="slide"
                aria-label={`${current + 1} of ${stories.length}: ${story.chapter}`}
              >
                {story.layout === "photo" ? (
                  <>
                    {story.mediaType === "video" && !imageFailed ? (
                      <video
                        ref={videoRef}
                        className="story-video"
                        src={story.media}
                        poster={story.poster}
                        aria-label={story.alt}
                        muted
                        playsInline
                        preload="metadata"
                        autoPlay={false}
                        onPlay={() => setVideoBlocked(false)}
                        onError={() => setImageFailed(true)}
                        style={{ objectPosition: story.mediaPosition }}
                      />
                    ) : (
                      <picture className="story-photo">
                        <source
                          media="(max-width: 600px)"
                          srcSet={(story.poster ?? story.media).replace(
                            ".webp",
                            "-sm.webp",
                          )}
                        />
                        <img
                          src={story.poster ?? story.media}
                          alt={story.alt}
                          style={{ objectPosition: story.mediaPosition }}
                          fetchPriority={current === 0 ? "high" : "auto"}
                          onError={() => setImageFailed(true)}
                        />
                      </picture>
                    )}
                    <div className="photo-shade" />
                  </>
                ) : (
                  <div className="product-canvas" aria-hidden="true">
                    <div className="canvas-circle" />
                    <span className="canvas-word">
                      {story.layout === "flavor" ? "TROPICAL" : "KINGBIRD"}
                    </span>
                  </div>
                )}
                <div className="story-copy">
                  <p className="story-kicker">
                    <svg
                      className="tiny-star"
                      viewBox="0 0 16 16"
                      aria-hidden="true"
                    >
                      <path
                        d="M8 0v16M0 8h16M2 2l12 12M2 14L14 2"
                        stroke="currentColor"
                        strokeWidth="1.2"
                      />
                    </svg>{" "}
                    {story.chapter}
                  </p>
                  <h1>{story.headline}</h1>
                  <p className="story-description">{story.copy}</p>
                  {story.detail && (
                    <p className="story-detail">{story.detail}</p>
                  )}
                </div>
                {story.id === "good-company" && (
                  <div className="recognition">
                    <p>Featured in</p>
                    <strong>The Wall Street Journal</strong>
                    <span>2025 food & drink gift guide</span>
                    <strong>Esquire</strong>
                    <span>American-made drinks feature</span>
                    <div className="recognition-rule" />
                    <p>On the menu at</p>
                    <strong>Gramercy Tavern</strong>
                    <span>Kingbird in the NY Spritz</span>
                  </div>
                )}
                {story.layout === "product" && (
                  <>
                    <div className="bottle-composition">
                      <img
                        className="product-bottle"
                        src={story.media}
                        alt={story.alt}
                        width="448"
                        height="656"
                      />
                    </div>
                    <div className="product-facts">
                      <span>Wine based</span>
                      <span>Fruit infused</span>
                      <span>American made</span>
                    </div>
                  </>
                )}
                {story.layout === "flavor" && (
                  <div className="flavor-composition">
                    <div className="flavor-words">
                      <span>PINEAPPLE</span>
                      <span>CITRUS</span>
                      <span>WARM SPICE</span>
                      <span>BOTANICALS</span>
                    </div>
                    <img
                      src={story.media}
                      alt={story.alt}
                      width="480"
                      height="1650"
                    />
                  </div>
                )}
                {story.layout === "purchase" && (
                  <div className="purchase-composition">
                    <div className="offer-photograph">
                      <img
                        src={story.media}
                        alt={story.alt}
                        width="448"
                        height="656"
                      />
                    </div>
                    <div className="purchase-offer">
                      <p>The two-bottle invitation</p>
                      <strong>
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: commerce.currency,
                          maximumFractionDigits: 0,
                        }).format(commerce.price)}
                        <span>{commerce.currency}</span>
                      </strong>
                      <p>
                        {commerce.bottles} × {commerce.bottleSizeMl} mL bottles
                      </p>
                    </div>
                  </div>
                )}
                {imageFailed && (
                  <p className="media-fallback">
                    Kingbird American Aperitif · Dry & Tropical
                  </p>
                )}
              </article>
              <button
                className="tap-zone tap-left"
                aria-label="Previous story"
                tabIndex={-1}
                disabled={current === 0}
                onClick={() => {
                  if (!swiped.current) navigate(current - 1, "tap");
                }}
              />
              <button
                className="tap-zone tap-right"
                aria-label="Next story"
                tabIndex={-1}
                disabled={final}
                onClick={() => {
                  if (!swiped.current) navigate(current + 1, "tap");
                }}
              />
            </div>
            <footer className="story-footer">
              {final ? (
                <a
                  id="story-primary"
                  className="primary-cta"
                  href={commerce.productUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => purchase("final-story", commerce.productUrl)}
                >
                  {story.cta.label}
                  <Arrow />
                </a>
              ) : (
                <button
                  id="story-primary"
                  className="primary-cta"
                  onClick={() => action(story.cta.action)}
                >
                  {story.cta.label}
                  <Arrow />
                </button>
              )}
              {final && (
                <p className="shipping-note">
                  Choose your bottles on Kingbird’s shop. Delivery eligibility
                  checked there.
                </p>
              )}
              <div className="story-bottom-row">
                {!final && (
                  <button
                    className="playback-toggle"
                    data-playback-toggle
                    aria-label={
                      videoBlocked
                        ? "Play video"
                        : manualPaused
                          ? "Resume stories"
                          : "Pause stories"
                    }
                    aria-pressed={manualPaused}
                    onClick={togglePlayback}
                  >
                    {manualPaused || videoBlocked ? (
                      <svg viewBox="0 0 16 16" aria-hidden="true">
                        <path d="M5 3l8 5-8 5z" fill="currentColor" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 16 16" aria-hidden="true">
                        <path
                          d="M5 3v10M11 3v10"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                      </svg>
                    )}
                  </button>
                )}
                <button
                  className="round-button"
                  aria-label="Go to previous story"
                  disabled={current === 0}
                  onClick={() => navigate(current - 1, "button")}
                >
                  <Arrow direction="left" />
                </button>
                <button
                  className="story-count"
                  aria-label={`Story ${current + 1} of ${stories.length}. Open story index`}
                  onClick={() => setDrawer("index")}
                >
                  <span>{String(current + 1).padStart(2, "0")}</span>
                  <i>/</i>
                  {String(stories.length).padStart(2, "0")}
                  <span className="index-icon">▦</span>
                </button>
                <button
                  className="round-button"
                  aria-label={final ? "Replay the stories" : "Go to next story"}
                  onClick={() =>
                    navigate(
                      final ? 0 : current + 1,
                      final ? "replay" : "button",
                    )
                  }
                >
                  {final ? <span className="replay-symbol">↻</span> : <Arrow />}
                </button>
              </div>
              <p className="responsibility">21+ · Enjoy responsibly</p>
            </footer>
            <span role="status" aria-live="polite" className="sr-only">
              Story {current + 1} of {stories.length}. {story.headline}
            </span>
          </section>
        </div>
      </main>

      {drawer && age === "accepted" && (
        <div
          className="modal-backdrop"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeDrawer();
          }}
        >
          <div
            className={`drawer drawer-${drawer}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="drawer-title"
            tabIndex={-1}
            ref={drawerRef}
          >
            <div className="drawer-handle" aria-hidden="true" />
            <div className="drawer-top">
              <span className="eyebrow">
                {drawer === "recipes"
                  ? "Your kind of Kingbird"
                  : drawer === "sources"
                    ? "A little recognition"
                    : drawer === "ingredients"
                      ? "A little more about the pour"
                      : "A few good stories"}
              </span>
              <button
                className="close-button"
                onClick={closeDrawer}
                aria-label="Close drawer"
              >
                ×
              </button>
            </div>
            {drawer === "sources" && (
              <>
                <h2 id="drawer-title">In very good company.</h2>
                <div className="source-list">
                  <a
                    href="https://www.wsj.com/arts-culture/food-cooking/best-food-and-drink-holiday-gifts-2025-18913072"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <strong>The Wall Street Journal</strong>
                    <span>2025 food & drink holiday gift guide</span>
                    <small>
                      21 Food and Drink Gifts to Please Every Palate on Your
                      List · WSJ Off Duty Staff
                    </small>
                    <span>Read the feature ↗</span>
                  </a>
                  <a
                    href="https://www.esquire.com/food-drink/drinks/a71613623/best-american-made-international-spirits-tariff-free/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <strong>Esquire</strong>
                    <span>American-made drinks feature</span>
                    <small>
                      The 4 Best Bottles of Booze That Are Totally Tariff-Proof
                      · Chris Hatler · July 3, 2026
                    </small>
                    <span>Read the feature ↗</span>
                  </a>
                  <a
                    href="https://www.gramercytavern.com/menu/seasonal-cocktails/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <strong>Gramercy Tavern</strong>
                    <span>Kingbird Aperitif in the NY Spritz</span>
                    <small>
                      Listed on the restaurant’s current cocktail menu, checked
                      October 29, 2026.
                    </small>
                    <span>See the menu ↗</span>
                  </a>
                </div>
                <p className="source-note">
                  Kingbird’s own{" "}
                  <a
                    href="https://shop.kingbird.fyi/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    venue list
                  </a>{" "}
                  also includes The Polo Bar, New York. Editorial coverage and
                  menu listings do not imply sponsorship or endorsement.
                </p>
              </>
            )}
            {drawer === "recipes" && (
              <>
                <h2 id="drawer-title">
                  A few good <em>ideas.</em>
                </h2>
                <div
                  className="recipe-tabs"
                  role="tablist"
                  aria-label="Cocktail recipes"
                >
                  {recipeIds.map((id) => (
                    <button
                      key={id}
                      role="tab"
                      id={`tab-${id}`}
                      aria-selected={recipe === id}
                      aria-controls={`recipe-${id}`}
                      tabIndex={recipe === id ? 0 : -1}
                      onKeyDown={(e) => {
                        if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
                          e.preventDefault();
                          const index =
                            (recipeIds.indexOf(id) +
                              (e.key === "ArrowRight" ? 1 : -1) +
                              recipeIds.length) %
                            recipeIds.length;
                          const next = recipeIds[index];
                          setRecipe(next);
                          track("recipe_open", story, { recipe_id: next });
                          document.getElementById(`tab-${next}`)?.focus();
                        }
                      }}
                      onClick={() => {
                        setRecipe(id);
                        track("recipe_open", story, { recipe_id: id });
                      }}
                    >
                      {recipes[id].name.replace("Kingbird ", "")}
                    </button>
                  ))}
                </div>
                <div
                  role="tabpanel"
                  id={`recipe-${recipe}`}
                  aria-labelledby={`tab-${recipe}`}
                  className="recipe-panel"
                >
                  <div className="recipe-intro">
                    <div>
                      <p className="eyebrow">The official Kingbird recipe</p>
                      <h3>{activeRecipe.name}</h3>
                      <p>{activeRecipe.note}</p>
                      <span className="recipe-serve">
                        One serve <span>✳</span> Over ice
                      </span>
                    </div>
                    <img
                      src={activeRecipe.image}
                      alt="Kingbird cocktail serving inspiration"
                      width="160"
                      height="200"
                    />
                  </div>
                  <p className="photo-caption">{activeRecipe.imageCaption}</p>
                  <h4>What goes in</h4>
                  <ul className="ingredients">
                    {activeRecipe.ingredients.map((ingredient) => (
                      <li key={ingredient.name}>
                        <span>{ingredient.name}</span>
                        <strong>{ingredient.amount}</strong>
                      </li>
                    ))}
                    <li>
                      <span>Garnish</span>
                      <strong>{activeRecipe.garnish}</strong>
                    </li>
                  </ul>
                  <h4>Make it yours</h4>
                  <ol className="recipe-steps">
                    {activeRecipe.steps.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ol>
                </div>
                <a
                  href={commerce.productUrl}
                  className="drawer-cta"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => purchase("recipe-drawer")}
                >
                  Just add Kingbird <Arrow />
                </a>
              </>
            )}
            {drawer === "ingredients" && (
              <>
                <h2 id="drawer-title">
                  A taste of <em>the unexpected.</em>
                </h2>
                <p className="drawer-lead">
                  White wine from New York’s Finger Lakes, fortified and infused
                  with fruit, herbs and botanicals in Accord, New York.
                </p>
                <dl className="botanical-list">
                  <div>
                    <dt>The fruit</dt>
                    <dd>Fresh pineapple, lemon zest & grapefruit</dd>
                  </div>
                  <div>
                    <dt>The warmth</dt>
                    <dd>Allspice & cardamom</dd>
                  </div>
                  <div>
                    <dt>The bitter finish</dt>
                    <dd>Gentian root & cinchona bark</dd>
                  </div>
                </dl>
                <p className="ingredient-note">
                  Colored with carmine (cochineal); Kingbird is not vegan.
                  Contains alcohol. See the current bottle label and merchant
                  product information before purchasing.
                </p>
                <button
                  className="drawer-cta"
                  onClick={() => openRecipe("spritz")}
                >
                  Put it in a Spritz <Arrow />
                </button>
              </>
            )}
            {drawer === "index" && (
              <>
                <h2 id="drawer-title">
                  Every story.
                  <br /> <em>Another reason.</em>
                </h2>
                <nav className="chapter-list" aria-label="All stories">
                  {stories.map((s, i) => (
                    <button
                      key={s.id}
                      aria-current={i === current ? "step" : undefined}
                      onClick={() => {
                        navigate(i, "index");
                        closeDrawer();
                      }}
                    >
                      <span>{String(i + 1).padStart(2, "0")}</span>
                      <div>
                        <small>{s.chapter}</small>
                        <strong>{s.headline}</strong>
                      </div>
                      <Arrow />
                    </button>
                  ))}
                </nav>
              </>
            )}
          </div>
        </div>
      )}

      {hydrated && age !== "accepted" && (
        <div className="age-backdrop">
          <div
            className="age-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="age-title"
            aria-describedby="age-description"
            tabIndex={-1}
            ref={ageRef}
          >
            <img
              className="age-emblem"
              src="/assets/kingbird-emblem.svg"
              alt="Kingbird bird emblem"
              width="100"
              height="100"
            />
            <p className="eyebrow">An American aperitif</p>
            <h2 id="age-title">
              {age === "declined" ? (
                <>
                  We’ll save you
                  <br /> a story.
                </>
              ) : (
                <>
                  Good company.
                  <br /> <em>Grown-up company.</em>
                </>
              )}
            </h2>
            <p id="age-description">
              {age === "declined"
                ? "This experience is for adults aged 21 and over. We look forward to welcoming you when the time is right."
                : "Kingbird contains alcohol. Please confirm that you are 21 or older to explore."}
            </p>
            {age !== "declined" ? (
              <>
                <button className="drawer-cta" onClick={acceptAge}>
                  I am 21 or older <Arrow />
                </button>
                <button className="age-no" onClick={() => setAge("declined")}>
                  I’m under 21
                </button>
              </>
            ) : (
              <button className="text-button" onClick={() => setAge("ask")}>
                Return to age confirmation
              </button>
            )}
            <p className="age-legal">Please enjoy responsibly.</p>
          </div>
        </div>
      )}
      <noscript>
        <div className="noscript">
          <h1>Kingbird American Aperitif</h1>
          <p>This story experience needs JavaScript. For adults 21 and over.</p>
          <a href={commerce.productUrl}>Visit the Kingbird shop</a>
        </div>
      </noscript>
    </>
  );
}
