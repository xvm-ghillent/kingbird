# Kingbird round two refinements

Updated October 29, 2026. This iteration preserves the original story viewer, photographs, palette, recipe drawers and Shopify offer.

## Experience

The outer website header, introductory heading and shopping sidebars are removed. The centered desktop card is limited to 430 px and maintains a 9:16 aspect ratio. Mobile uses the available viewport and safe-area insets. The only top-of-story controls are the original Kingbird logo, segmented progress and “Skip to offer.” Each story has one compact contextual CTA; the final purchase CTA remains prominent.

Image stories advance after seven seconds; the recognition story gets ten seconds. Video progress uses actual playback time, capped by each story's configured editorial duration. The final offer has no timer and cannot automatically loop away. Back navigation resets the returning story's segment. Pointer holds, open recipe/ingredient/source/index drawers, keyboard focus, a manual pause control and inactive tabs pause progression; reopening a tab does not consume the paused time. Reduced-motion users start paused and retain manual controls.

## Typography

Only Obviously and Della Respira are used for authored type. Actual files were downloaded from the supplied Fonts folder:

- Obviously Condensed / `ObviouslyDemo-CondensedBold.otf`, converted to local WOFF2; actual bold face, uppercase, normal tracking, no synthetic weight.
- Obviously Narrow Bold is also preserved as a converted local source, but the Condensed Bold face is selected for the viewer.
- `DellaRespira-Regular.ttf`, converted to local WOFF2 for all other type, including buttons, supporting copy, recipe details, captions and product information.

The supplied display files identify themselves as Demo fonts and have limited punctuation coverage. Display copy avoids unsupported glyphs rather than substituting a different font. No hosted Google Fonts request or variable-font approximation is needed. Embedded original typography within artwork or footage is part of that source media.

Fonts source: https://drive.google.com/drive/folders/1iIGubW9z4NbWApM1n_va7lI_gRyUFJjI

## Media choices

The supplied Creator Content folder was inventoried, and three candidate creator clips plus three archival clips were downloaded and visually reviewed with frame contact sheets. Only selected files are bundled with the site. This is a focused media selection, rather than a claim that every historical file was viewed in full.

| Story        | Selected source                                                                                | Editorial treatment                                                                                                                                                                                                                                  |
| ------------ | ---------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Easy company | `IG_reel_luisaurabites_2026-08-02.mp4`                                                         | Original portrait serving moment, about 7.7 seconds, credited to @luisaurabites. It is serving inspiration, not asserted to show the precise official Spritz recipe.                                                                                 |
| Made here    | `PXL_20201220_200233105.mp4`; `PXL_20230606_124636723.TS.mp4`; `PXL_20230606_150149315.TS.mp4` | Straight-cut montage of actual early ingredient development, the facility and production-equipment installation, about 8.9 seconds. Explicitly captioned as 2020–2023 archive footage rather than a claim that these are current factory conditions. |
| Real people  | `IG_reel_privatechefli_2026-06-22(1).mp4`                                                      | A 12-second portrait excerpt from 00:03–00:15, credited to @privatechefli; keeps the spontaneous opening-bottle moment. No invented testimonial or spoken quote is added.                                                                            |

Video derivatives are 720 × 1280 H.264 MP4, without audio, with fast-start metadata and local WebP posters. Playback is muted and inline; only the active story mounts a video element. Inactive videos pause and unmount. Failed video loads fall back to their real source poster with an image-story clock; blocked autoplay exposes a play control. No stock, generated imagery or artificial slow motion is used.

The user explicitly confirmed that the creator clips are cleared for website use, including visible faces and handles, in this chat on October 29, 2026.

Creator source: https://drive.google.com/drive/folders/159LWhgj5TyQ0D_L9KeejBYPf9EtYv1wM

Making-of source: https://drive.google.com/drive/folders/1mUHU8j4AGGQpoGqaIO8ck_7YRpcrL2-Z

## Recognition sources

- [The Wall Street Journal 2025 food and drink holiday gift guide](https://www.wsj.com/arts-culture/food-cooking/best-food-and-drink-holiday-gifts-2025-18913072), “21 Food and Drink Gifts to Please Every Palate on Your List,” WSJ Off Duty Staff. The user confirmed the 2025 gift-guide placement; the canonical article and indexed Kingbird entry corroborate it. No editorial photograph or pull quote is reproduced.
- [Esquire American-made drinks feature](https://www.esquire.com/food-drink/drinks/a71613623/best-american-made-international-spirits-tariff-free/), Chris Hatler, July 3, 2026. The actual page includes a Kingbird Aperitif entry. No quotation or formal endorsement is claimed.
- [Gramercy Tavern's current cocktail menu](https://www.gramercytavern.com/menu/seasonal-cocktails/) lists Kingbird Aperitif in the NY Spritz, checked October 29, 2026.
- [Kingbird's own shop](https://shop.kingbird.fyi/) lists The Polo Bar under “On the menu.” The sources drawer attributes this to Kingbird's venue list; it does not claim an independently checked current Polo Bar menu or use a restaurant logo.

Publication and venue names are rendered as plain text in Della Respira, with a dedicated source drawer. Recognition is not represented as paid sponsorship, a rating, an award or a formal endorsement.

## Commerce and remaining launch facts

The existing, tested Shopify two-bottle cart handoff remains unchanged: $72 USD for two 750 mL bottles, variant `49350975029530`, verified October 29, 2026. Shipping eligibility and final pricing remain controlled by the merchant.

The supplied info sheet still conflicts between an approximately 18% test result and a 20% label; the live product title uses 20%. The third story therefore remains a serving-occasion story, without an unverified lower-ABV comparison or health claim. That question still needs an authoritative current product specification.

Analytics hooks continue to distinguish a shopping handoff from a confirmed cart/checkout/purchase event. Hosted analytics and merchant purchase-event configuration remain separate launch work. No GitHub push or deployment has been performed.


## Subsequent offer and photography refinement

At the user’s request, the offer now links to https://shop.kingbird.fyi/products/kingbird?variant=49350975029530 instead of the cart permalink. Both the product introduction and the final offer use the actual KINGBIRD-BOTTLE-FASHION photograph, downloaded at full resolution from Press Ready Images and exported as a local WebP crop. The old duplicated bottle-render arrangement and decorative overlay stamp were removed so the photograph remains natural. This supersedes the earlier cart-handoff and rendered-bottle details above.
