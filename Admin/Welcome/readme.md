# Welcome

Full welcome page — composes Overview, GettingStarted, Changelog, ProAds/Info into a single layout.

## Import

```js
import Welcome from 'bpl-tools/Admin/Welcome';

// Named sub-component exports
import { Overview, GettingStarted, Changelog, ProAds, Info } from 'bpl-tools/Admin/Welcome';
```

## Usage

Spread both `dashboardInfo` and `welcomeInfo` onto the component. The simplest pattern is to spread both at the route level:

```js
import Welcome from '../../../../bpl-tools/Admin/Welcome';
import { welcomeInfo } from '../utils/data';

// In App.js route tree:
<Route path='welcome' element={<Welcome {...props} {...welcomeInfo(adminUrl)} />} />
```

## Props

| Prop | Type | Required | Description |
|---|---|---|---|
| `name` | string | yes | Plugin name shown in the hero heading |
| `version` | string | yes | Plugin version |
| `description` | string | yes | Tagline shown in the hero card |
| `isPremium` | boolean | yes | Controls ProAds vs Info panel and Upgrade button visibility |
| `slug` | string | yes | WordPress.org slug — used for review link and changelog "read more" |
| `media` | object | yes | `{logo, banner, thumbnail, proThumbnail?, video?, isYoutube?}` |
| `pages` | object | yes | `{org?, docs?, pricing?, landing?}` |
| `startButton` | object | — | `{label, url}` — primary CTA in the hero card |
| `keywords` | string[] | — | Chip labels shown below the tagline (e.g. `['Grid', 'Masonry']`) |
| `keywordsLabel` | string | — | Label before the chips (e.g. `'Layouts'`) |
| `gettingStarted` | object | — | `{tabs: [...]}` — omit to hide the GettingStarted panel. A tab may carry `video`/`isYoutube`/`videoLabel` for a per-tab walkthrough popup |
| `changelogs` | object[] | — | `[{version, type, list}]` — omit to hide the Changelog panel |
| `changelogsLimit` | number | — | How many changelog entries to show initially (default 5) |
| `changelogsReadMoreLabel` | string | — | "Read more" button label; omit to hide the button |
| `proFeatures` | string[] | — | Bullet list inside ProAds (shown to free users only) |
| `helpItems` | object[] | — | Override Info panel cards. Each: `{image?, titleIcon?, title, description, link, linkText}` |
| `freemius` | object | — | `{product_id, plan_id, public_key}` — passed through to sub-components |

## Layout

```
┌─────────────────────────────────────────────┐
│ heroRow                                     │
│  ┌──────────────────┐  ┌──────────────────┐ │
│  │ Overview         │  │ GettingStarted   │ │
│  │ (always shown)   │  │ (if gettingStart-│ │
│  │                  │  │  ed.tabs exists) │ │
│  └──────────────────┘  └──────────────────┘ │
├─────────────────────────────────────────────┤
│ contentRow                                  │
│  ┌──────────────────┐  ┌──────────────────┐ │
│  │ Changelog        │  │ ProAds (free)    │ │
│  │                  │  │ Info (premium)   │ │
│  └──────────────────┘  └──────────────────┘ │
├─────────────────────────────────────────────┤
│ Info (free users — also shown below grid)   │
└─────────────────────────────────────────────┘
```

When `gettingStarted.tabs` is absent or empty, `heroRow` becomes single-column.
