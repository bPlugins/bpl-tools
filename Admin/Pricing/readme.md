# Pricing

Freemius-powered pricing page. Fetches live plan data from the bPlugins API, renders plan cards with billing-cycle switcher, a feature list, trust badges, and an FAQ accordion. Checkout is launched via the Freemius JS overlay.

Supports both **single plan** and **multiple plans** display modes.

## Import

```js
import Pricing from 'bpl-tools/Admin/Pricing';
```

## Usage

```js
import Pricing from '../../../../bpl-tools/Admin/Pricing';
import { pricingInfo } from '../utils/data';

// Hide route for premium users
{!isPremium && <Route path='pricing' element={<Pricing pricingInfo={pricingInfo} options={{}} {...props} />} />}
```

## Props

| Prop | Type | Required | Description |
|---|---|---|---|
| `pricingInfo` | object | yes | Pricing configuration (see below) |
| `options` | object | yes | Extra options forwarded to `FS.Checkout.open()` (pass `{}` for none) |

## `pricingInfo` shape

```js
// Single plan mode
export const pricingInfo = {
    logo:     'https://ps.w.org/my-plugin/assets/icon-128x128.png', // shown in checkout overlay
    pluginId: 14262,
    planId:   '23856',  // string = single plan
    licenses: [1, 3, null],   // site counts; null = Unlimited Sites
    button:   { label: 'Buy Now ➜' },
    featured: { selected: 3 } // license count to highlight as "Most Popular"
}

// Multi-plan mode
export const pricingInfo = {
    logo:     'https://ps.w.org/my-plugin/assets/icon-128x128.png',
    pluginId: 14262,
    planId:   ['23856', '23857', '23858'],  // array = multiple plans
    licenses: [1, 3, null],
    button:   { label: 'Buy Now ➜' },
    featured: { selected: 3 }
}
```

### `planId` modes

**Single plan mode** (string): Displays pricing tiers for a single plan
```
┌─────────────┬──────────────┬────────────────┐
│ Single Site │   3 Sites    │ Unlimited Sites│
├─────────────┼──────────────┼────────────────┤
│    $5.99    │    $10.99    │    $39.99      │
│   (per mo)  │   (per mo)   │   (per mo)     │
└─────────────┴──────────────┴────────────────┘
+ Shared features section below
+ FAQs and trust badges
```

**Multi-plan mode** (array): Displays multiple plans side-by-side with dynamic license switcher
```
┌──────────────────┬──────────────────┐
│      Pro         │       Max        │
├──────────────────┼──────────────────┤
│ [○ Single Site]  │ [○ Single Site]  │
│ [○ 3 Sites]      │ [○ 3 Sites]      │
│ [○ Unlimited]    │ [○ Unlimited]    │
├──────────────────┼──────────────────┤
│    Price         │    Price         │
│  (updates on     │  (updates on     │
│   selection)     │   selection)     │
└──────────────────┴──────────────────┘
- All plans share the same license selection
- Hides shared features, FAQs, and trust badges
```

### `licenses` values

| Value | Label |
|---|---|
| `1` | Single Site |
| `3` (or any number) | 3 Sites |
| `null` | Unlimited Sites |

## Data Fetching

On mount, fetches `https://api.bplugins.com/wp-json/bpl/v1/products/{pluginId}`. The response provides plan features, pricing tiers, and billing cycles. If the request fails the component renders nothing.

## Examples

### Single Plan (3D Viewer)
```js
import Pricing from 'bpl-tools/Admin/Pricing';

export const pricingInfo = {
    logo: 'https://s3-us-west-2.amazonaws.com/freemius/plugins/8795/icons/8b48bbb7a8453157c40438b56e77a408.png',
    pluginId: '8795',
    planId: '14970',  // Pro plan ID
    licenses: [1, 3, null],
    button: { label: 'Buy Now ➜' },
    featured: { selected: 3, text: 'Most Popular' }
}

<Pricing pricingInfo={pricingInfo} options={{}} />
```

### Multiple Plans (Pro, Max)
```js
export const pricingInfo = {
    logo: 'https://s3-us-west-2.amazonaws.com/freemius/plugins/8795/icons/8b48bbb7a8453157c40438b56e77a408.png',
    pluginId: '8795',
    planId: ['14970', '52950'],  // [Pro, Max]
    licenses: [1, 3, null],
    button: { label: 'Buy Now ➜' },
    featured: { 
        planId: '14970',  // Which plan to feature (Pro). Omit to default to 'pro'
        text: 'Most Popular' 
    }
}

<Pricing pricingInfo={pricingInfo} options={{}} />
```

**Note:** In multi-plan mode, `featured.planId` specifies which plan gets the "Most Popular" badge. If omitted, the plan named 'pro' is automatically featured.

## Customisation

Override the hero, features header, trust badges, or FAQs via `pricingInfo` optional fields (single plan mode only):

```js
export const pricingInfo = {
    // ...required fields...
    hero: {
        eyebrow:     'Plans',
        title:       'Simple, transparent pricing',
        description: 'All features on every plan. Choose your site count.'
    },
    included: {
        tag:         'What\'s included',
        title:       'Everything in every license',
        description: 'No feature is locked per tier.'
    },
    trustBadges: [
        { title: '30-day refund',    body: 'No questions asked', icon: moneyBackIcon },
        { title: 'Lifetime updates', body: 'On every plan',      icon: refreshIcon   },
    ],
    faqs: [
        { q: 'Can I upgrade later?', a: 'Yes, from your dashboard.' }
    ]
}
```
