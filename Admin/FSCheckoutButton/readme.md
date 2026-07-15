# FSCheckoutButton

A `<Button>` that opens the Freemius checkout overlay on click. Wraps `FS.Checkout` from the Freemius JS SDK.

## Import

```js
import FSCheckoutButton from 'bpl-tools/Admin/FSCheckoutButton';
```

## Usage

```js
<FSCheckoutButton
	freemius={{ product_id: 14262, plan_id: 23856, public_key: 'pk_...' }}
	options={{ licenses: 1, billing_cycle: 'annual' }}
	buttonProps={{ className: 'myPurchaseBtn' }}
>
	Buy Now ➜
</FSCheckoutButton>
```

## Props

| Prop | Type | Required | Description |
|---|---|---|---|
| `freemius` | object | yes | `{product_id, plan_id, public_key}` — passed to `new FS.Checkout(freemius)` |
| `options` | object | yes | Options forwarded to `checkoutConfig.open(options)` |
| `buttonProps` | object | — | Additional props forwarded to the underlying `<Button>` component |
| `children` | ReactNode | — | Button label content |

## Notes

Requires the Freemius JS SDK to be loaded. The `../lib/fs` module is imported automatically to ensure the SDK script is enqueued.
