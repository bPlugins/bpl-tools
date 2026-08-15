# Changelog

Notable changes to `bpl-tools`, newest first.

This library is consumed by **relative import** from a sibling folder rather than by npm, so there are no releases to pin to and no version numbers to compare — every consumer plugin builds against whatever is in the checkout next to it. What a developer actually needs to know is therefore **when** something landed: if a component or prop is missing from your `bpl-tools` clone, find its date below and pull anything newer.

Dates are the dates the change was committed. Entries before 2025 are grouped by month, because the work then was small and iterative.

---

## 2026-08-15

- `Admin/Welcome/GettingStarted` accepts a `docs` URL per tab. When the active tab defines one, the bottom documentation link points at it and the heading becomes "Read the *{tab label}* Documentation" (the generic blurb is hidden); tabs without `docs` fall back to `pages.docs` and the original heading.
- Added a **Read Documentation** button beside the start button in `Admin/Overview` and `Admin/Welcome/Overview`. It renders only when `pages.docs` is set.
- `Components/Badge` gained `icon` and `size` (`'small' | 'regular' | 'medium'`) props, plus a restyle: square corners, lighter weight, and tighter padding on the default size.
- Switched the admin stylesheets from `@import` to `@use ... as *` for `__variables`, which silences the Dart Sass `@import` deprecation warnings.

## 2026-07-29

- Added a `defaultValue` prop to `Components/BtnGroup` and `Components/BButtonGroup`. Clicking the already-selected button now emits `defaultValue` (default `''`) instead of re-emitting its own value, which makes a button group deselectable.
- Added this changelog.

## 2026-07-28

- Added a tutorial button to each Getting Started and Onboarding card.

## 2026-07-22

- Updated the dashboard Pricing page and the Template Library.

## 2026-07-21

- Added favourites to templates.

## 2026-07-18

- Extended the template set.

## 2026-07-15

- Added the **Template Library** (`TemplateLibrary/`).
- Fixed the missing component header in the Template Library.

## 2026-07-12

- Style refresh across admin components.

## 2026-06-25

- Updated the border control.

## 2026-06-24

- Added **multi-plan pricing** to the dashboard Pricing page, with styling to match.

## 2026-06-11

- Components can now be imported from a single entry per component folder.

## 2026-06-10

- Generated CSS is sanitised before being injected.
- Updated the toggle style.

## 2026-06-07

- Corrected admin margin styles.

## 2026-05-23

- Added the guide page to the dashboard.
- Fixed admin dashboard layout issues.

## 2026-05-22

- Added the rebuilt **modern dashboard** (`ModernAdmin/`). `LagacyAdmin/` is kept for plugins still on the older layout — do not use it for new plugins.
- Updated the Blocks and Plugins admin pages.

## 2026-05-19

- Restored the previous admin entry points alongside the new dashboard.

## 2026-05-13

- Added `LICENSE.md` (GPLv2-or-later) and the public `readme.md`.

## 2026-05-09

- Added an `image` prop to the support card and bundled the support image locally.

## 2026-05-06

- Added the community card.
- Styling for deprecated controls.

## 2026-05-05

- Replaced deprecated `@wordpress/components` API usage across controls.

## 2026-05-04

- Added the `PremiumPanel` and `PremiumBadge` components for gating pro-only controls.

## 2026-05-03

- Added SVG icon support to the media control.

## 2026-04-28

- Added the `Notice` and `Badge` components (`Notice` refined 2026-04-29).

## 2026-04-23

- Added the advertise card.

## 2026-03-29

- Fixed label rendering.

## 2026-03-04

- Fixed the B Blocks product name in the dashboard.

## 2026-02-28

- Added a loading state to the Demos tab.

## 2026-02-24

- Added the `HelpTooltip` component.
- Added title props to the Blocks page.

## 2026-02-23

- Reworked license activation in the admin dashboard.

## 2026-02-18

- **Security:** added a nonce to the Overview "Start Now" prefill link.
- Hide the "Buy Now" button when the premium version is active.

## 2026-02-17

- Added the admin dashboard pages.
- Added the pro upsell modal.

## 2026-02-10

- Added the license hook backing the Activation page.
- Design pass over the new dashboard.

## 2026-02-09

- Updated `ItemsPanel`.

## 2025-12-23

- Added new icons; admin updates.

## 2025-11-23

- Fixed the active colour on the Demos tab.

## 2025-09-24

- Updated the feature-comparison and pricing components.
- Updated `Admin/readme.md`.

## 2025-09-11

- Updated `ItemsPanel`.

## 2025-09-06

- Added the **Lucide icon library** alongside the existing icon set.

## 2025-09-03

- Added the pricing check icon to the dashboard.

## 2025-08-20

- Added the dashboard.
- Updated the about-pro modal.
- Fixed the colour button.

## 2025-08-13

- Added flex utility classes.

## 2025-07-23

- Fixed `ItemsPanel`.

## 2025-07-21

- Changed how advanced controls generate their CSS selector.
- Fixed box-shadow CSS output.

## 2025-07-20

- Updated dashboard colours and theme.

## 2025-06-28

- Fixed the solid background label.

## 2025-06-23

- Removed the text domain from shared strings — translation belongs to the host plugin.

## 2025-05-26

- Added font-size unit selection to the Typography control.

## 2025-05-19

- `ItemsPanel` sets the active index when an item is opened.

## 2025-04-20

- Changed the tablet breakpoint value in `utils/data.js`.

## 2025-04-16

- Added `sanitizeHTML`.

## 2025-04-15

- Rearranged generated CSS output.

## 2025-04-08

- Changed the `isExist` directory handling.

## 2025-03-12

- Added the `BplBlockPreview` component.

## 2025-03-06

- Updated the media upload control.

## 2025-02-27

- Fixed button hover colour.

## 2025-02-22

- Added HTML escaping to rendered markup.

## 2025-02-20

- Added the first admin components.

## 2025-02-19

- Added `utils/common.js`.

## 2025-02-17

- Added `escapeHTML`.

## 2025-02-15

- Added `advTransform`.

## 2025-02-12

- Updated the animation function and the transform readme.

## 2025-02-10

- Updated `BoxControl`.
- Restored the transition default value.

## 2025-02-09

- Added the `tinyeditor` and `dynamictag` components.
- Completed the mask component.
- Added premium props.
- Fixed animation issues.

## 2025-02-08

- Added the transition component.
- Added the mask component.
- Transform panel now starts collapsed.

## 2025-02-02

- Added `maxFontSize` to the Typography control.

## 2025-01-15

- Added Google Font loading.

## 2024-12

- Added `getBoxCSS` and a value check to CSS generation.
- Added the parent element option.
- Added icons and the ads component.
- Added a `className` prop to `BButtonGroup`.
- Animation work.

## 2024-11

- Fixed animation.

## 2024-10

- Added the `Advanced/` controls, starting with Background.
- Added the icon library.
- Added responsive handling, `zIndex`, and colour options.
- Switched components to default exports.

## 2024-08

- Initial version of the shared library: the `Components/` Gutenberg editor controls and the shared SCSS and utility helpers.
