# Welcome/Overview

Hero card — the main identity card at the top of the Welcome page. Shows plugin status, version, description, thumbnail, video button, keyword chips, and action buttons.

Rendered automatically by `<Welcome>`. Use it directly only if you need the hero card in isolation.

## Import

```js
import { Overview } from 'bpl-tools/Admin/Welcome';
// or
import Overview from 'bpl-tools/Admin/Welcome/Overview';
```

## Props

| Prop | Type | Required | Description |
|---|---|---|---|
| `name` | string | yes | Plugin name |
| `version` | string | yes | Version string — displayed as `v{version}` |
| `description` | string | yes | Tagline paragraph. If `currentUser` is available, prefixed with "Hi {firstName}, …" |
| `isPremium` | boolean | yes | Switches badge between "Free Plan" / "Pro Plan" and shows/hides Upgrade CTA |
| `media` | object | — | `{thumbnail?, video?, isYoutube?}` |
| `pages` | object | — | `{landing?}` — enables "View Demos" button |
| `startButton` | object | — | `{label, url}` — primary action button |
| `keywords` | string[] | — | Chip labels (e.g. `['Grid', 'Masonry', 'Slider']`) |
| `keywordsLabel` | string | — | Label before keyword chips (e.g. `'Layouts'`) |
| `currentUser` | object | — | Injected by `withSelect` — `{name}` from WP core store. Do not pass manually. |

## Notes

- `currentUser` is injected via `withSelect(() => ({ currentUser: select('core').getCurrentUser?.() }))`. This fires a `wp/v2/users/me` request; on sites where the user lacks appropriate capabilities it may 403 — that is a WordPress REST permission issue, not a component bug.
- `thumbnail` renders as a banner image. If `video` is also set, a play button overlays the thumbnail and opens a modal.
- `isYoutube: true` wraps the video URL in an embed iframe with autoplay; otherwise renders a `<video>` element.
