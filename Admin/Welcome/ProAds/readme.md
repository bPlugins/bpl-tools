# Welcome/ProAds

Upgrade prompt shown to free users on the Welcome page. Displays the pro plugin thumbnail, a bullet list of exclusive Pro features, and a "View Pricing Plan" CTA.

Rendered automatically by `<Welcome>` when `isPremium` is false. Use directly only if you need it outside the Welcome layout.

## Import

```js
import { ProAds } from 'bpl-tools/Admin/Welcome';
// or
import ProAds from 'bpl-tools/Admin/Welcome/ProAds';
```

## Usage

```js
<ProAds
	name='My Plugin'
	media={{ proThumbnail: 'https://...' }}
	proFeatures={[
		'Feature one available in Pro.',
		'Feature two available in Pro.',
	]}
/>
```

## Props

| Prop | Type | Required | Description |
|---|---|---|---|
| `name` | string | yes | Plugin name — used in the heading "Go {name} Pro & Unlock More!" |
| `media` | object | — | `{proThumbnail?}` — promotional image shown beside the feature list |
| `proFeatures` | string[] | — | Bullet list of Pro-exclusive feature descriptions |

## Notes

- The "View Pricing Plan" button always links to `#pricing` (the Pricing hash route).
- If `proThumbnail` is not set, the card renders as a full-width text panel.
- Pass `proFeatures` from `welcomeInfo`, not `dashboardInfo`.
