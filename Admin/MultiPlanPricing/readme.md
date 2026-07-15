# MultiPlanPricing Component

Displays multiple Freemius plans side-by-side with dynamic license selector and pricing based on billing cycle.

## Import

```js
import MultiPlanPricing from 'bpl-tools/Admin/MultiPlanPricing';
```

## Usage

```js
<MultiPlanPricing
	plans={[plan1, plan2, plan3]}
	licenses={[1, 3, null]}
	cycle="annual"
	selectedLicense={3}
	onLicenseChange={(license) => setSelectedLicense(license)}
	featured={{ planId: '14970', text: 'Most Popular' }}
	logo="https://..."
	product={product}
	button={{ label: 'Buy Now ➜' }}
	options={{}}
/>
```

## Props

| Prop | Type | Required | Description |
|---|---|---|---|
| `plans` | array | yes | Array of plan objects from Freemius product |
| `licenses` | array | yes | Site counts to display as options [1, 3, null] |
| `cycle` | string | yes | Current billing cycle ('monthly', 'annual', 'lifetime') |
| `selectedLicense` | number\|null | yes | Currently selected license count |
| `onLicenseChange` | function | yes | Callback when license is changed |
| `featured` | object | yes | { planId, text } - which plan to highlight |
| `logo` | string | no | Logo URL for checkout |
| `product` | object | yes | Freemius product object |
| `button` | object | yes | { label } - button text |
| `options` | object | yes | Extra options for FS.Checkout.open() |

## Plan Object Structure

```js
{
	id: '14970',
	name: 'pro',
	title: 'Pro',
	description: 'Included Some Awesome Premium Features.',
	pricing: [
		{ licenses: 1, monthly: 5.99, annual: 59.99, lifetime: 179.99 },
		{ licenses: 3, monthly: 10.99, annual: 107.99, lifetime: 329.99 },
		{ licenses: null, monthly: 39.99, annual: 383.99, lifetime: 699 }
	],
	features: [
		{ title: 'Feature 1' },
		{ title: 'Feature 2' }
	]
}
```

## Layout

Each plan is displayed as a single card with:
- Plan name and description
- Horizontal license selector (Single Site | 3 Sites | Unlimited Sites)
- Pricing that updates based on selected license and cycle
- Feature list (up to N features shown)
- Purchase button

## Featured Plan

The featured plan displays:
- "Most Popular" badge
- Blue gradient background
- White text for contrast
- Semi-transparent license selector
- All features visible

## Styling

Styles are located in `style.scss` and are scoped to prevent conflicts with other components.
