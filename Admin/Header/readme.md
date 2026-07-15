# Header

Dashboard page header. Renders the plugin logo, name, version badge, a navigation slot (`children`), and action buttons (Our Plugins / Upgrade Pro).

Used in `Layout.js` — wrap the `<nav>` inside it via `children`.

## Import

```js
import Header from 'bpl-tools/Admin/Header';
```

## Usage

```js
import Header from '../../../../bpl-tools/Admin/Header';

<Header {...props}>
	<nav className='bPlDashboardNav'>
		{/* Link items */}
	</nav>
</Header>
```

## Props

| Prop | Type | Required | Description |
|---|---|---|---|
| `name` | string | yes | Plugin name displayed as `<h1>` |
| `version` | string | yes | Version string — displayed as `v{version}` |
| `isPremium` | boolean | yes | Hides "Upgrade Pro" button when true; switches "Our Plugins" from `<a>` to `<Button>` |
| `media` | object | — | `{logo?}` — plugin logo `<img>` |
| `displayOurPlugins` | boolean | — | Shows the "Our Plugins" button when true |
| `children` | ReactNode | — | Navigation links rendered between the plugin info and the action buttons |

## Layout

```
┌────────────────────────────────────────────────────────────┐
│ [logo] Plugin Name v1.0.0 │ [nav children] │ [Our Plugins] [Upgrade Pro] │
└────────────────────────────────────────────────────────────┘
```

- "Our Plugins" links to `#our-plugins` (the hash route).
- "Upgrade Pro" links to `#pricing` (the hash route).
- Both buttons are hidden for `isPremium` users, replaced by the "Our Plugins" `<Button>` only.
