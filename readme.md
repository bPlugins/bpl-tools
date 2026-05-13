# bpl-tools

> Shared utility library powering the Gutenberg block plugins published by **bPlugins**.

`bpl-tools` is **not a standalone WordPress plugin**. It is a set of reusable React components, hooks, SCSS partials, and JavaScript utilities that are consumed (via relative imports) by the individual block plugins maintained by bPlugins. It exists so every block plugin we ship has the same admin dashboard, the same Gutenberg controls, the same responsive device switcher, and the same look-and-feel — without copy-pasting code across dozens of repositories.

If you are a user of any bPlugins block (Advanced Post Block, B Blocks, Content Slider, Countdown Time, Chart Block, 3D Viewer, etc.), this repository is the source of the admin dashboard and editor controls you see inside those plugins.

---

## Table of Contents

- [Why this repository is public](#why-this-repository-is-public)
- [License](#license)
- [Requirements](#requirements)
- [Repository Layout](#repository-layout)
- [Installation](#installation)
- [Usage](#usage)
  - [Building an Admin Dashboard](#building-an-admin-dashboard)
  - [Using Gutenberg Editor Controls](#using-gutenberg-editor-controls)
  - [Hooks and Utilities](#hooks-and-utilities)
- [External Requests & Why They Are Made](#external-requests--why-they-are-made)
- [Privacy](#privacy)
- [Third-Party Libraries](#third-party-libraries)
- [Contributing](#contributing)
- [Support](#support)

---

## Why this repository is public

The WordPress.org Plugin Review Team requires that **any minified or compiled JavaScript shipped inside a `.zip` on the plugin directory has its human-readable source available to reviewers and to the community**. Because the bundled `build/*.js` files inside our plugins are produced from this library, the source has been published here so that:

1. The plugin review team can audit what is actually being executed in the browser.
2. The WordPress community can inspect, modify, and learn from the code.
3. Downstream developers can re-use the components in compliance with the GPL.

This repository is the **canonical source** for the bundled admin/editor scripts shipped by our plugins.

---

## License

This project is licensed under the **GNU General Public License v2.0 (or later)** — see the [LICENSE.md](./LICENSE.md) file for the full notice and the URL to the complete license text. GPLv2-or-later is the same license used by WordPress core, which keeps this library fully compatible with every WordPress plugin and theme.

You are free to:

- Use this code in your own GPL-compatible WordPress plugins.
- Modify and redistribute it.
- Use it commercially.

Provided that:

- Any redistributed derivative work is also licensed under GPLv2 (or any later version).
- You preserve the copyright notice.

---

## Requirements

| Environment | Minimum |
|---|---|
| WordPress | 6.5 |
| PHP (host plugin) | 7.1 |
| Node.js (for building) | 18.x |
| `@wordpress/scripts` | 30.x |
| React (provided by WordPress) | 18.x |

This library does **not** ship a PHP file of its own — it is purely a frontend (admin + editor) toolkit. The host plugin owns the PHP entry point.

---

## Repository Layout

```
bpl-tools/
├── Admin/              # Dashboard React components (Header, Blocks, Demos,
│                         Pricing, Activation, FeatureCompare, OurPlugins, etc.)
├── Advanced/           # Advanced block controls (Background, Transform,
│                         BorderShadow, Animation, Mask, Visibility, ...)
├── Components/         # Gutenberg editor controls (Dimension, Device,
│                         ColorControl, Typography, BoxControl, Badge, ...)
├── ProControls/        # Premium-only controls (gated behind license checks)
├── LagacyAdmin/        # Backwards-compatible older dashboard (do not use
│                         for new plugins — kept for old releases)
├── hooks/              # Reusable React hooks
├── utils/              # Pure helpers (icons, formatters, data transforms)
├── includes/           # PHP helpers reserved for future shared logic
├── package.json
├── webpack.config.js
└── LICENSE.md
```

Each top-level folder contains its own `readme.md` with implementation
details for the components inside it.

---

## Installation

`bpl-tools` is consumed by **relative import** from a sibling plugin folder, not via npm. Clone it next to the plugin that consumes it:

```
wp-content/plugins/
├── bpl-tools/                  ← this repository
├── advanced-post-block/        ← consumer plugin
├── b-blocks/
├── countdown-time/
└── ...
```

Then install Node dependencies inside the *consumer* plugin (each plugin has its own `package.json`). Most consumer plugins symlink `bpl-tools/node_modules` to share a single install:

```bash
cd wp-content/plugins/bpl-tools
npm install
```

You can verify a clean build by running:

```bash
npm run lint
```

---

## Usage

### Building an Admin Dashboard

A consumer plugin renders an empty DOM node from PHP and mounts a React app into it. The React app composes pages from `bpl-tools/Admin/*`. A minimal example (full walkthrough lives in [Admin/readme.md](./Admin/readme.md)):

```jsx
// dashboard.js — entry point in the consumer plugin
import { createRoot } from 'react-dom/client';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';

import Header     from '../../../../bpl-tools/Admin/Header';
import Overview   from '../../../../bpl-tools/Admin/Overview';
import Blocks     from '../../../../bpl-tools/Admin/Blocks';
import Demos      from '../../../../bpl-tools/Admin/Demos';
import Pricing    from '../../../../bpl-tools/Admin/Pricing';
import Activation from '../../../../bpl-tools/Admin/Activation';

document.addEventListener('DOMContentLoaded', () => {
    const el   = document.getElementById('myPluginDashboard');
    const info = JSON.parse(el.dataset.info);

    createRoot(el).render(
        <Router>
            <Routes>
                <Route path="/"            element={<Overview   {...info} />} />
                <Route path="/blocks"      element={<Blocks     {...info} />} />
                <Route path="/demos"       element={<Demos      {...info} />} />
                <Route path="/pricing"     element={<Pricing    {...info} />} />
                <Route path="/activation"  element={<Activation {...info} />} />
            </Routes>
        </Router>
    );
});
```

The matching PHP side simply enqueues the compiled bundle and prints the host node — see [Admin/readme.md](./Admin/readme.md) for the full pattern.

### Using Gutenberg Editor Controls

Inside a block's `edit.js`, import controls just like any other module:

```jsx
import Dimension     from '../../../bpl-tools/Components/Dimension';
import ColorControl  from '../../../bpl-tools/Components/ColorControl';
import Device        from '../../../bpl-tools/Components/Device';
import BoxControl    from '../../../bpl-tools/Components/BoxControl';

export default function Edit({ attributes, setAttributes }) {
    const { padding, color } = attributes;

    return (
        <>
            <Device />

            <Dimension
                label="Padding"
                value={padding}
                onChange={value => setAttributes({ padding: value })}
            />

            <ColorControl
                label="Text Color"
                value={color}
                onChange={value => setAttributes({ color: value })}
            />
        </>
    );
}
```

Each control is a thin wrapper around `@wordpress/components` that adds responsive (desktop / tablet / mobile) handling and a consistent visual style across all bPlugins blocks.

### Hooks and Utilities

```js
import { useDeviceType }  from '../../../bpl-tools/hooks/useDeviceType';
import { getDeviceValue } from '../../../bpl-tools/utils/getDeviceValue';
```

Browse [hooks/](./hooks/) and [utils/](./utils/) for the full surface — each file is self-documenting with JSDoc.

---

## External Requests & Why They Are Made

Transparency about network activity is important — both for plugin reviewers and for end users. The components in this library may make the following outbound requests **only from inside the WordPress admin area**, never from the public-facing site, and only when the user actually opens the page that needs the data.

### 1. `GET https://api.bplugins.com/wp-json/bpl/v1/products/{pluginId}`

- **Used by:** [`Admin/Pricing/index.js`](./Admin/Pricing/index.js#L32), [`Admin/FeatureCompare/index.js`](./Admin/FeatureCompare/index.js#L27)
- **When:** Fired in a `useEffect` the first time the user opens the **Pricing** or **Feature Comparison** tab of the dashboard, and re-fired only if the `pluginId` prop changes.
- **What is sent:** Only the public `pluginId` in the URL path. No site URL, no admin email, no user identifier, no nonce, no request body.
- **What is received:** A JSON document describing the product's plans, license tiers, monthly / annual / lifetime pricing, and the feature list for each plan.
- **Why this exists:**
  1. Pricing and feature lists change frequently (promos, new tiers, regional discounts). Hard-coding them inside every plugin would require us to ship a new release of every plugin every time a price changes — and to leave users on outdated information until they update.
  2. Keeping the source of truth on `api.bplugins.com` lets the dashboard always show the **current** prices and feature list without the user having to update the plugin.
  3. The dashboard is admin-only, so this request never runs for site visitors and has no performance impact on the public site.
- **Endpoint type:** Public, read-only WordPress REST route. No authentication required. Returns JSON.
- **Failure behavior:** If the request fails the component renders nothing — the rest of the dashboard keeps working normally. The error is logged to the browser console for the site owner; nothing is sent back to our servers.

### 2. `GET https://api.wordpress.org/plugins/info/1.2/?action=query_plugins&request[author]=bplugins&...`

- **Used by:** [`Admin/OurPlugins/index.js`](./Admin/OurPlugins/index.js#L117)
- **When:** Fired when the user opens the **Our Plugins** tab of the dashboard.
- **What is sent:** A fixed query for plugins authored by `bplugins` on the official WordPress.org plugin directory. No site information is transmitted.
- **What is received:** The list of bPlugins products published on WordPress.org with their icons, names, short descriptions, ratings, and install counts.
- **Why this exists:** The "Our Plugins" tab cross-promotes the rest of our free plugins. Fetching the list live from WordPress.org ensures the displayed install counts, ratings, and version numbers are always up-to-date and that newly published plugins automatically appear without us having to ship an update of every other plugin.
- **Endpoint type:** Public, unauthenticated WordPress.org Plugin Directory API. Returns JSON.

### 3. Freemius Checkout iframe — `https://checkout.freemius.com`

- **Used by:** [`Admin/lib/fs.js`](./Admin/lib/fs.js) (the official Freemius Checkout SDK script), invoked from `Admin/Pricing`, `Admin/FeatureCompare`, and `Admin/FSCheckoutButton`.
- **When:** **Only when the user clicks a "Buy" / pricing button.** Until that click, no network request is made to Freemius.
- **What it does:** Opens the Freemius checkout flow inside an iframe so the user can complete a purchase without leaving the dashboard. The credit-card form, payment processing, and receipt all happen inside Freemius's own iframe — `bpl-tools` never sees or stores payment data.
- **Why this exists:** Freemius is the licensing and payment provider used by the premium versions of our plugins.
- **Removable:** Plugins that do not offer a premium upgrade simply do not render the `Pricing` / `Activation` components, and this script is never loaded.

### 4. License activation — `https://api.freemius.com/*`

- **Used by:** The `Activation` page, via the Freemius SDK that is loaded by the **host plugin** (not by `bpl-tools` itself).
- **When:** Only when the user clicks **Activate** / **Deactivate** for a license they already purchased.
- **What is sent:** The license key the user entered, plus the data Freemius needs to validate it (site URL, plugin version). This is governed entirely by the Freemius SDK in the host plugin.
- **Why this exists:** It validates the user's premium license against Freemius's servers and unlocks the pro features locally.

### 5. Static images and demo iframes

| Resource | Loaded by | Purpose |
|---|---|---|
| `https://bplugins.com/wp-content/themes/b-technologies/assets/images/products/*.png` | `Demos`, `OurPlugins`, `Pricing`, `Welcome` | Product thumbnails and screenshots shown on the dashboard. |
| `https://ps.w.org/<plugin-slug>/assets/*` | `Header`, `Overview` | The plugin's official WordPress.org icon and banner image (served from the WP.org CDN). |
| `https://*.bplugins.com/demo/*` | `Demos` tab | Live demo pages embedded inside an `<iframe>` so the user can preview the block before installing it. Loaded only after the user clicks a specific demo. |
| `https://www.youtube.com/embed/*` | `Welcome` / `Overview` | Embeds the plugin's intro video, **only** if the consumer plugin sets `media.video` in its `dashboardInfo`. Standard YouTube embed. |

### What this library does NOT do

- It does **not** make any unsolicited tracking, telemetry, or analytics requests.
- It does **not** phone home on plugin activation, deactivation, or page load on the public site.
- It does **not** transmit the site URL, admin email, posts, pages, comments, or any user content anywhere.
- It does **not** fetch or execute remote JavaScript at runtime. The Freemius SDK is bundled at build time from a published, versioned source.
- None of the API requests listed above run on the public-facing site — they fire only inside the WordPress admin dashboard, and only on the specific tab that needs the data.

Any usage tracking that exists in a consumer plugin (e.g. the Freemius opt-in dialog in Advanced Post Block) is implemented in **that plugin**, not here, and is always opt-in.

---

## Privacy

`bpl-tools` itself stores nothing in the database and sets no cookies. The only data it touches is the props passed into its components by the consumer plugin (plugin name, version, license status, etc.). When a control writes data it does so via the standard Gutenberg `setAttributes` API into the post the user is editing — exactly the same as any other Gutenberg block control.

---

## Third-Party Libraries

This project re-uses the following open-source packages (see [package.json](./package.json) for exact versions). All are MIT-licensed unless otherwise stated.

- `@wordpress/components`, `@wordpress/scripts` — GPLv2+
- `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/modifiers`, `@dnd-kit/utilities`
- `react-router-dom`
- `react-sortable-hoc`
- `react-ace`
- `dompurify`
- `immer`
- `select-pure`
- `slick-carousel`

Each library's own license file is preserved inside `node_modules/` after `npm install`.

---

## Contributing

Issues and pull requests are welcome. Because this library is consumed by many plugins simultaneously, please keep the following in mind:

1. **Backwards compatibility matters.** A breaking change here can break every bPlugins product at once. If you must change a component's API, add a new component or a new prop rather than modifying existing behavior.
2. **No new dependencies without discussion.** Every byte added here ships inside every consumer plugin.
3. **Keep components presentational.** Business logic belongs in the consumer plugin, not in `bpl-tools`.
4. **Run `npm run lint` before submitting.**

---

## Support

- Product pages: <https://bplugins.com>
- Documentation: <https://bplugins.com/docs/>
- Issue tracker for individual plugins: each plugin's own WordPress.org support forum
- Email: support@bplugins.com

---

Built with care by the **bPlugins** team.
