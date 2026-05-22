# OurPlugins

Displays a grid of other bPlugins products with install/activate functionality. Fetches plugin data from the WordPress.org API and checks locally installed plugins via the WP core data store.

## Import

```js
import OurPlugins from 'bpl-tools/Admin/OurPlugins';
```

## Usage

```js
import OurPlugins from '../../../../bpl-tools/Admin/OurPlugins';

<Route path='our-plugins' element={<OurPlugins {...props} />} />
```

Pass `displayOurPlugins: true` in `dashboardInfo` to show the "Our Plugins" button in the Header.

## Props

| Prop | Type | Required | Description |
|---|---|---|---|
| `slug` | string | yes | Current plugin's slug — excluded from the displayed list |
| `slugs` | string[] | — | Specific plugin slugs to display. Defaults to the full bPlugins catalog |
| `installedPlugins` | object[] | — | Injected by `withSelect` — the list of locally installed plugins. Do not pass manually. |

## Default plugin list

When `slugs` is not provided, the component shows (excluding the current plugin):

`3d-viewer`, `html5-video-player`, `html5-audio-player`, `pdf-poster`, `document-emberdder`, `advanced-post-block`, `advance-custom-html`, `b-carousel-block`, `b-blocks`, `embed-lottie-player`, `b-slider`

## Install/Activate states

Each plugin card tracks one of these statuses:

| Status | Button label |
|---|---|
| `notfound` | Install & Activate |
| `installing` | Installing... |
| `installed` | Activate |
| `activating` | Activating... |
| `activated` | Activated |
| `success` | Activated |
| `error` | Failed to Install |

## PHP Requirement

The install/activate actions use `wp/v2/plugins` REST endpoints, which require the `install_plugins` and `activate_plugins` capabilities. Admins have these by default.
