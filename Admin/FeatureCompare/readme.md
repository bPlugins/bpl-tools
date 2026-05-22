# FeatureCompare

Side-by-side Free vs Pro comparison table. Fetches live plan data from the bPlugins API, renders plan price cards, a searchable feature breakdown table, and a Pro CTA banner. Checkout is launched via the Freemius JS overlay.

## Import

```js
import FeatureCompare from 'bpl-tools/Admin/FeatureCompare';
```

## Usage

```js
import FeatureCompare from '../../../../bpl-tools/Admin/FeatureCompare';

// Hide route for premium users
{!isPremium && <Route path='feature-comparison' element={<FeatureCompare plans={['free', 'pro']} {...props} />} />}
```

## Props

| Prop | Type | Required | Description |
|---|---|---|---|
| `plans` | string[] | yes | Plan names to compare — must match the `name` field from the Freemius product (typically `['free', 'pro']`) |
| `freemius` | object | yes | `{product_id, public_key}` from `dashboardInfo` — spread via `{...props}` |
| `hero` | object | — | Override hero section: `{eyebrow?, title?, description?}` |
| `ctaBanner` | object | — | Override bottom CTA: `{title?, description?, ctaLabel?}` |
| `planDescriptions` | object | — | Override plan taglines: `{free?, pro?}` |

## Data Fetching

On mount, fetches `https://api.bplugins.com/wp-json/bpl/v1/products/{product_id}`. Features are merged across visible plans and sorted so free features appear before Pro-only ones. If the request fails the component renders nothing.

## Features

- **Billing cycle switcher** — Monthly / Yearly / Lifetime depending on plan configuration
- **Feature search** — filter the table by feature name
- **Pro-only badge** — rows exclusive to Pro are highlighted with a "Pro only" tag
- **Checkout** — clicking "Get Pro →" opens `FS.Checkout` with the pro plan and `licenses: 1`
