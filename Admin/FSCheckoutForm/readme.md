# FSCheckoutForm

Renders the Freemius checkout as an embedded `<iframe>` inside a dashboard card. An alternative to `FSCheckoutButton` when you want the checkout form inline rather than in a popup overlay.

## Import

```js
import FSCheckoutForm from 'bpl-tools/Admin/FSCheckoutForm';
```

## Usage

```js
<FSCheckoutForm
    freemius={{ product_id: 14262, plan_id: 23856 }}
    options={{ licenses: 1, billing_cycle: 'annual', hide_licenses: true }}
/>
```

## Props

| Prop | Type | Required | Description |
|---|---|---|---|
| `freemius` | object | yes | `{product_id, plan_id}` — used to construct the Freemius checkout URL |
| `options` | object | yes | Query parameters appended to the iframe URL as `key=value` pairs |

## Notes

- The iframe URL is `https://checkout.freemius.com/plugin/{product_id}/plan/{plan_id}?{options}`.
- A loading spinner is shown until the iframe fires `onLoad`.
- Prefer `FSCheckoutButton` for the standard popup checkout experience. Use `FSCheckoutForm` only when embedding the form directly in the page layout is specifically required.
