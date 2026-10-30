import type { Story } from "@/content/stories";
export type StoryEventName =
  | "story_impression"
  | "story_navigation"
  | "story_completed"
  | "story_skip"
  | "story_sequence_complete"
  | "recipe_open"
  | "ingredient_open"
  | "cta_click"
  | "purchase_handoff";
export type AnalyticsEvent = Record<string, string | number> & {
  event: StoryEventName;
};
declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    kingbirdEvents?: AnalyticsEvent[];
  }
}
// No tracking service or network request is enabled here. A consent-managed
// first-party listener can subscribe to kingbird:analytics in production.
export function track(
  event: StoryEventName,
  story: Story,
  extra: Record<string, string | number> = {},
) {
  const payload: AnalyticsEvent = {
    event,
    story_id: story.id,
    story_position: story.sequence,
    creative: story.analytics.creative,
    experiment: story.analytics.experiment,
    variant: story.analytics.variant,
    ...extra,
  };
  window.kingbirdEvents = [
    ...(window.kingbirdEvents ?? []).slice(-199),
    payload,
  ];
  window.dispatchEvent(
    new CustomEvent("kingbird:analytics", { detail: payload }),
  );
}
