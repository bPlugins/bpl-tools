# Activation

License activation and deactivation page. Communicates with the Freemius license server via the bPlugins `LicenseActivation.php` AJAX bridge to activate, display, copy, and deactivate a license key.

## Import

```js
import Activation from 'bpl-tools/Admin/Activation';
```

## Usage

```js
// In App.js — gate route on hasPro (pro file installed, license may not be active yet)
{hasPro && <Route path='activation' element={<Activation {...props} />} />}
```

## Props

| Prop | Type | Required | Description |
|---|---|---|---|
| `name` | string | yes | Plugin name shown in the activation card heading |
| `slug` | string | yes | WordPress.org slug — used to build Freemius recover-license and EULA links |
| `version` | string | — | Plugin version shown in the card |
| `media` | object | — | `{logo?}` — plugin logo in the card header |
| `freemius` | object | yes | `{product_id, public_key}` — Freemius API identifiers |
| `licenseActiveNonce` | string | yes | WP nonce created with `wp_create_nonce('bPlLicenseActivation')` |

## PHP Requirement

Include `LicenseActivation.php` from `bpl-tools/includes/` **after** the Freemius SDK is initialized. It registers the `wp_ajax_bPlLicenseActivate` and `wp_ajax_bPlLicenseDeactivate` actions that this component calls.

```php
require_once BPL_TOOLS_DIR_PATH . 'includes/LicenseActivation.php';
```

## PHP Data

Pass the nonce and Freemius IDs from PHP:

```php
'licenseActiveNonce' => wp_create_nonce( 'bPlLicenseActivation' ),
// freemius config comes from dashboardInfo in data.js
```

## `hasPro` vs `isPremium`

| Value | Meaning | When to use |
|---|---|---|
| `hasPro` | Pro plugin file is installed (`fs()->is_premium()`) | Gate the Activation nav link and route |
| `isPremium` | License is active (`fs()->can_use_premium_code()`) | Unlock Pro UI features |

Show the Activation route to users who have the pro file installed but may not have activated a license yet (`hasPro && !isPremium`).

## States

The component manages three internal views:

1. **Input form** — license key input, activation button, permission disclosure
2. **Success view** — activated license display with show/hide/copy and deactivate actions
3. **Change license** — shown when user clicks "Change license" on the success view
