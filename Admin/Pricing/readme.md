# Pricing

Freemius-powered pricing page. Fetches live plan data from the bPlugins API, renders plan cards with billing-cycle switcher, a feature list, trust badges, and an FAQ accordion. Checkout is launched via the Freemius JS overlay.

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
export const pricingInfo = {
    logo:     'https://ps.w.org/my-plugin/assets/icon-128x128.png', // shown in checkout overlay
    pluginId: 14262,
    planId:   23856,
    licenses: [1, 3, null],   // site counts; null = Unlimited Sites
    button:   { label: 'Buy Now ➜' },
    featured: { selected: 3 } // license count to highlight as "Most Popular"
}
```

### `licenses` values

| Value | Label |
|---|---|
| `1` | Single Site |
| `3` (or any number) | 3 Sites |
| `null` | Unlimited Sites |

## Data Fetching

On mount, fetches `https://api.bplugins.com/wp-json/bpl/v1/products/{pluginId}`. The response provides plan features, pricing tiers, and billing cycles. If the request fails the component renders nothing.

## Customisation

Override the hero, features header, trust badges, or FAQs via `pricingInfo` optional fields:

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
