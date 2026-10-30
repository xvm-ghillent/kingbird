# Commerce and analytics

## Current offer destination

Per the user's October 29, 2026 refinement, the final offer CTA opens the actual product page:

https://shop.kingbird.fyi/products/kingbird?variant=49350975029530

The selected variant is the two-bottle pack, $72 USD and 750 mL per bottle at the last store verification. The visitor selects or confirms the purchase on Kingbird’s shop. The landing page emits a purchase_handoff event with this product-page destination; it does not create a cart or imply a completed purchase. The earlier UCP cart link was tested successfully in round two, but has now been replaced at the user's request.

The product and offer screens now use a real full-resolution photograph, KINGBIRD-BOTTLE-FASHION.jpg from the supplied Press Ready Images folder, cropped and exported to public/assets/kingbird-bottle-photo.webp. The photographic background is retained; no bottle render or duplicated cutout is used.

## Local event contract

`app/lib/analytics.ts` emits a `kingbird:analytics` CustomEvent and maintains a bounded in-memory `window.kingbirdEvents` list for local QA. It does not send requests to an analytics provider, set tracking cookies, or store personal data. It is deliberately not a production analytics deployment.

| Event                     | Meaning                                                                                                                           |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `story_impression`        | A story is displayed after age confirmation.                                                                                      |
| `story_completed`         | Visitor leaves a story; includes elapsed milliseconds, not a claim that its copy was read.                                        |
| `story_navigation`        | Story changes; includes forward/backward, destination and method.                                                                 |
| `story_skip`              | A jump of more than one story.                                                                                                    |
| `story_sequence_complete` | Every story has been visited once in this tab's mounted experience. Skipping to the last story does not qualify.                  |
| `recipe_open`             | Recipe drawer or a particular recipe tab is opened.                                                                               |
| `ingredient_open`         | Ingredient drawer opens.                                                                                                          |
| `cta_click`               | Story or shopping CTA is activated.                                                                                               |
| `purchase_handoff`        | Visitor follows a shopping link; destination and variant are included. This is not `add_to_cart`, `begin_checkout` or `purchase`. |

Every event includes story ID/position, creative ID, experiment and variant. No event uses email, cart tokens or browser history. To calculate completion and funnel rates across visitors, a consent-managed analytics integration will need a permitted session strategy and event aggregation.

## Production event wiring

1. Configure the merchant's preferred analytics destination and consent management. Subscribe to `kingbird:analytics` only after the relevant consent is granted, or forward permitted events through an approved first-party endpoint.
2. Configure cross-domain attribution between the landing-page host and the Kingbird Shopify shop. Add attribution to the permalink only under the merchant's approved privacy policy and consent rules.
3. Use Shopify Customer Events / an installed app pixel for confirmed `product_added_to_cart`, `checkout_started` and `checkout_completed` events. Keep purchase value, currency and order deduplication in the merchant integration. A landing-page click must never fabricate those events.
4. Verify the complete consented funnel in a merchant-authorized test checkout before public launch. This task did not place an order or change Shopify settings.

## Launch checks still requiring merchant decisions

Final ABV/label approval; eligible shipping territories and delivery terms; current retailer evidence if social proof is added; exact finished-drink photography for Shandy/Garibaldi; analytics destination and consent configuration; campaign/legal review. No reviews, scarcity, health claims or unsupported shipping guarantees are displayed.
