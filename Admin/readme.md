# Admin Components & Dashboard Guide

Standardized components for building WordPress admin dashboards in the bPlugins ecosystem. Follow this guide to set up a full-featured dashboard from scratch.

---

## Architecture Overview

A dashboard is composed of:

| File | Purpose |
|---|---|
| `plugin.php` | PHP: renders the root `<div>` with JSON data, enqueues scripts |
| `src/admin/dashboard.js` | JS entry: reads data, mounts React app |
| `src/admin/dashboard.scss` | Global theme variables + bpl-tools style import |
| `src/admin/Components/App.js` | Router: maps URL hashes to page components |
| `src/admin/Components/Layout.js` | Shared header + nav wrapper |
| `src/admin/utils/data.js` | All plugin-specific configuration |
| `src/admin/utils/icons.js` | SVG icons for tab labels, demo cards, etc. |

---

## Step-by-Step Implementation

### 1. PHP — Render Root Element & Enqueue

In your plugin's main PHP file, output the root `<div>` and enqueue scripts only on the relevant admin page.

```php
static function renderDashboard() { ?>
	<div
		id='myPluginDashboard'
		data-info='<?php echo esc_attr( wp_json_encode( [
			'version'				=> MY_PLUGIN_VERSION,
			'isPremium'				=> myPluginIsPremium(),
			'hasPro'				=> my_plugin_fs()->is_premium(),
			'adminUrl'				=> admin_url(),
			'nonce'					=> wp_create_nonce( 'myPluginCreatePage' ),
			'licenseActiveNonce'	=> wp_create_nonce( 'bPlLicenseActivation' ),
		] ) ); ?>'
	></div>
<?php }

public function adminEnqueueScripts( $hook ) {
	if ( strpos( $hook, 'my-plugin-page' ) ) {
		wp_enqueue_style( 'my-plugin-dashboard', MY_PLUGIN_DIR_URL . 'build/admin/dashboard.css', [], MY_PLUGIN_VERSION );

		$asset_file = include MY_PLUGIN_DIR_PATH . 'build/admin/dashboard.asset.php';
		wp_enqueue_script( 'my-plugin-dashboard', MY_PLUGIN_DIR_URL . 'build/admin/dashboard.js', array_merge( $asset_file['dependencies'], [ 'wp-util' ] ), MY_PLUGIN_VERSION, true );
		wp_set_script_translations( 'my-plugin-dashboard', 'my-plugin', MY_PLUGIN_DIR_PATH . 'languages' );
	}
}
```

**Fields:**
- `isPremium` — `fs()->can_use_premium_code()` — license is active
- `hasPro` — `fs()->is_premium()` — pro plugin file is installed (use to gate the Activation tab)
- `adminUrl` — `admin_url()` — used for internal links inside the dashboard

---

### 2. Dashboard Entry Point (`dashboard.js`)

Reads the JSON from the DOM and mounts the React app.

```js
import { createRoot } from 'react-dom/client';

import './dashboard.scss';
import App from './Components/App';
import { dashboardInfo } from './utils/data';

document.addEventListener('DOMContentLoaded', () => {
	const el = document.getElementById('myPluginDashboard');
	const info = JSON.parse(el.dataset.info);

	createRoot(el).render(<App {...dashboardInfo(info)} />);

	el.removeAttribute('data-info');
});
```

---

### 3. Configuration (`utils/data.js`)

Split into four named exports. `dashboardInfo` holds plugin identity; `welcomeInfo` holds Welcome-page content so it can be lazily passed only to the Welcome route.

```js
import { gutenbergTabIcon, shortcodeTabIcon } from './icons';

const slug = 'my-plugin';

// ─── Identity & shared props ──────────────────────────────────────────────────
export const dashboardInfo = (info) => {
	const { version, isPremium, hasPro, adminUrl = '', nonce, licenseActiveNonce } = info;

	const proSuffix = isPremium ? ' Pro' : '';

	return {
		name: `My Plugin${proSuffix}`,
		displayName: `My Plugin${proSuffix} - Short marketing tagline here`,
		description: 'One-sentence plugin description shown in the hero card.',
		slug,
		version,
		isPremium,
		hasPro,
		adminUrl,
		displayOurPlugins: true,
		media: {
			logo: `https://ps.w.org/${slug}/assets/icon-128x128.png`,
			banner: `https://ps.w.org/${slug}/assets/banner-772x250.png`,
			thumbnail: `https://bplugins.com/wp-content/themes/b-technologies/assets/images/products/${slug}.png`,
			proThumbnail: `https://bplugins.com/wp-content/themes/b-technologies/assets/images/products/${slug}-pro.png`,
			video: 'https://www.youtube.com/watch?v=XXXXXXXX',
			isYoutube: true
		},
		pages: {
			org: `https://wordpress.org/plugins/${slug}/`,
			docs: `https://bplugins.com/docs/${slug}/`,
			pricing: `https://bplugins.com/products/${slug}/pricing/`,
		},
		freemius: {
			product_id: 00000,
			plan_id: 00000,
			public_key: 'pk_...'
		},
		licenseActiveNonce,
		startButton: {
			label: 'Start Now',
			url: `${adminUrl}/post-new.php?post_type=page&title=My Plugin&content=<!-- wp:my-plugin/block /-->&nonce=${nonce}`
		}
	}
}

// ─── Welcome page content ─────────────────────────────────────────────────────
export const welcomeInfo = (adminUrl) => ({
	keywords: ['Feature A', 'Feature B', 'Feature C'],
	keywordsLabel: 'Features',
	gettingStarted: {
		tabs: [
			{
				key: 'gutenberg',
				label: 'Gutenberg',
				icon: gutenbergTabIcon,
				steps: [
					{ num: 1, title: 'Insert the Block', body: 'Click <strong>+</strong> in the editor and search for your block name.', link: { url: `${adminUrl}/post-new.php`, label: 'Open Editor' } },
					{ num: 2, title: 'Configure', body: 'Use the sidebar panel to set options.' },
					{ num: 3, title: 'Publish', body: 'Hit Publish when ready.' }
				]
			},
			{
				key: 'shortcode',
				label: 'ShortCode',
				icon: shortcodeTabIcon,
				steps: [
					{ num: 1, title: 'Create via CPT', body: 'Go to <strong>My Plugin › Add New</strong>.', link: { url: `${adminUrl}/post-new.php?post_type=myplugin`, label: 'Add New' } },
					{ num: 2, title: 'Configure', body: 'Set options in the block editor sidebar.' },
					{ num: 3, title: 'Copy Shortcode', body: 'Publish and copy <code>[myplugin id=POST_ID]</code> from the list table.' },
					{ num: 4, title: 'Paste Anywhere', body: 'Paste into any post, page, or widget using the Shortcode block.' }
				]
			}
		]
	},
	changelogs: [
		{
			version: '1.0.0 - 01 Jan 2026',
			type: 'new', // 'new' | 'update' | 'fix'
			list: ['Initial release.']
		}
	],
	changelogsLimit: 2,
	changelogsReadMoreLabel: 'View More Changelogs',
	proFeatures: [
		'Pro-only feature one.',
		'Pro-only feature two.',
	]
})

// ─── Demos page ───────────────────────────────────────────────────────────────
export const demoInfo = {
	allInOneLabel: 'See All Demos',
	allInOneLink: 'https://my-plugin.com/all-demos/',
	demos: [
		// Flat card (single iframe)
		{
			icon: <svg>...</svg>, // JSX or string (raw SVG markup)
			title: 'Default',
			type: 'iframe',
			url: 'https://my-plugin.com/demo/default/',
			category: 'Player' // optional filter label
		},
		// Grouped card (children expand into multiple cards)
		{
			icon: <svg>...</svg>,
			title: 'Layout Group',
			children: [
				{ title: 'Variant A', type: 'iframe', url: 'https://my-plugin.com/demo/a/' },
				{ title: 'Variant B', type: 'iframe', url: 'https://my-plugin.com/demo/b/' },
			]
		}
	]
}

// ─── Pricing page ─────────────────────────────────────────────────────────────
export const pricingInfo = {
	logo: `https://ps.w.org/${slug}/assets/icon-128x128.png`,
	pluginId: 00000,
	planId: 00000,
	licenses: [1, 3, null], // null = Unlimited Sites
	button: { label: 'Buy Now ➜' },
	featured: { selected: 3 } // license count from `licenses` array
}

// ─── Settings page (only if plugin supports data-delete on uninstall) ─────────
export const settingsInfo = {
	ajaxAction: 'myPluginSaveUninstallOption',
	cleanupItems: [
		'All shortcode posts (myplugin post type)',
		'Plugin options and settings'
	]
}
```

> **Note:** `changelogs` and `proFeatures` live inside `welcomeInfo`, not `dashboardInfo`. They are only consumed by the Welcome page.

---

### 4. Root Component (`Components/App.js`)

Spreads `welcomeInfo(adminUrl)` directly onto the `<Welcome>` route. Gate the Activation route on `hasPro` (pro file is installed). Gate Settings on whether the plugin implements the uninstall handler.

```js
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Welcome from '../../../../bpl-tools/Admin/Welcome';
import Demos from '../../../../bpl-tools/Admin/Demos';
import Pricing from '../../../../bpl-tools/Admin/Pricing';
import FeatureCompare from '../../../../bpl-tools/Admin/FeatureCompare';
import Activation from '../../../../bpl-tools/Admin/Activation';
import { Settings } from '../../../../bpl-tools/Admin';
import OurPlugins from '../../../../bpl-tools/Admin/OurPlugins';

import Layout from './Layout';
import { demoInfo, pricingInfo, settingsInfo, welcomeInfo } from '../utils/data';

const App = (props) => {
	const { isPremium, hasPro, adminUrl } = props;

	return <Router>
		<Routes>
			<Route path='/' element={<Layout {...props} />}>
				<Route index element={<Welcome {...props} {...welcomeInfo(adminUrl)} />} />
				<Route path='welcome' element={<Welcome {...props} {...welcomeInfo(adminUrl)} />} />
				<Route path='demos' element={<Demos {...props} demoInfo={demoInfo} />} />

				{!isPremium && <Route path='pricing' element={<Pricing pricingInfo={pricingInfo} options={{}} {...props} />} />}
				{!isPremium && <Route path='feature-comparison' element={<FeatureCompare plans={['free', 'pro']} {...props} />} />}

				{hasPro && <Route path='activation' element={<Activation {...props} />} />}

				<Route path='settings' element={<Settings {...props} {...settingsInfo} />} />
				<Route path='our-plugins' element={<OurPlugins {...props} />} />

				<Route path='*' element={<Navigate to='/welcome' replace />} />
			</Route>
		</Routes>
	</Router>
}
export default App;
```

---

### 5. Layout Wrapper (`Components/Layout.js`)

Renders the `<Header>` and a `<nav>` of hash links. Filter items based on `isPremium` and `hasPro`.

```js
import { Outlet, Link, useLocation } from 'react-router-dom';
import Header from '../../../../bpl-tools/Admin/Header';

const navigation = [
	{ name: 'Welcome', href: '/welcome' },
	{ name: 'Demos', href: '/demos' },
	{ name: 'Pricing', href: '/pricing' },
	{ name: 'Feature Comparison', href: '/feature-comparison' },
	{ name: 'Activation', href: '/activation' },
	{ name: 'Settings', href: '/settings' },
];

const Layout = (props) => {
	const { isPremium, hasPro } = props;
	const location = useLocation();

	return <div className='bPlDashboard'>
		<Header {...props}>
			<nav className='bPlDashboardNav'>
				{navigation
					?.filter(item => item.href !== '/activation' || hasPro)
					?.filter(item => !isPremium || !['/pricing', '/feature-comparison'].includes(item.href))
					?.map((item, index) => <Link
						key={index}
						to={item.href}
						className={`navLink ${location.pathname === item.href ? 'active' : ''}`}
					>
						{item.name}
					</Link>)}
			</nav>
		</Header>

		<main className='bPlDashboardMain'>
			<Outlet />
		</main>
	</div>
}
export default Layout;
```

---

### 6. Dashboard Styles (`dashboard.scss`)

Define CSS custom properties for your brand colors, then import bpl-tools base styles.

```scss
:root {
	--bpl-dashboard-primary-color: #146ef5;
	--bpl-dashboard-primary-color-rgb: 20, 110, 245;
	--bpl-dashboard-secondary-color: #ff7a00;
	--bpl-dashboard-secondary-color-rgb: 255, 122, 0;
	--bpl-dashboard-title-color: #070127;
	--bpl-dashboard-title-color-rgb: 7, 1, 39;
	--bpl-dashboard-content-color: #1b2e4b;
	--bpl-dashboard-content-color-rgb: 27, 46, 75;
}

@import '../../../bpl-tools/Admin/style.scss';

// Plugin-specific overrides go here
```

---

### 7. Tab Icons (`utils/icons.js`)

Icons used in `gettingStarted.tabs[].icon`. Use `stroke='currentColor'` with `fill='none'` so CSS `color:` controls the tint.

```js
export const gutenbergTabIcon = <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={2} strokeLinecap='round' strokeLinejoin='round'>
	<rect x='3' y='3' width='7' height='7' rx='1' />
	<rect x='14' y='3' width='7' height='7' rx='1' />
	<rect x='3' y='14' width='7' height='7' rx='1' />
	<rect x='14' y='14' width='7' height='7' rx='1' />
</svg>;

export const shortcodeTabIcon = <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={2} strokeLinecap='round' strokeLinejoin='round'>
	<polyline points='16 18 22 12 16 6' />
	<polyline points='8 6 2 12 8 18' />
</svg>;
```

---

### 8. Start Button — PHP Filters

When `startButton.url` includes `title=` and `content=` query params, add these two PHP hooks to apply them as page defaults.

```php
add_filter( 'default_title', function( $title, $post ) {
	if ( 'page' === $post->post_type && isset( $_GET['title'] ) ) {
		$nonce = isset( $_GET['nonce'] ) ? sanitize_text_field( wp_unslash( $_GET['nonce'] ) ) : '';
		if ( wp_verify_nonce( $nonce, 'myPluginCreatePage' ) ) {
			return sanitize_text_field( wp_unslash( $_GET['title'] ) );
		}
	}
	return $title;
}, 10, 2 );

add_filter( 'default_content', function( $content, $post ) {
	if ( 'page' === $post->post_type && isset( $_GET['content'] ) ) {
		$nonce = isset( $_GET['nonce'] ) ? sanitize_text_field( wp_unslash( $_GET['nonce'] ) ) : '';
		if ( wp_verify_nonce( $nonce, 'myPluginCreatePage' ) ) {
			// phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized
			return wp_kses_post( wp_unslash( $_GET['content'] ) );
		}
	}
	return $content;
}, 10, 2 );
```

---

### 9. Settings — PHP AJAX Handler

Required when using the `<Settings>` route. The action name must match `settingsInfo.ajaxAction`.

```php
add_action( 'wp_ajax_myPluginSaveUninstallOption', [ $this, 'saveUninstallOption' ] );

public function saveUninstallOption() {
	$nonce = isset( $_POST['nonce'] ) ? sanitize_text_field( wp_unslash( $_POST['nonce'] ) ) : '';
	if ( ! wp_verify_nonce( $nonce, 'bPlLicenseActivation' ) ) {
		wp_send_json_error( 'Invalid nonce' );
	}

	$enabled = isset( $_POST['enabled'] ) && 'true' === sanitize_text_field( wp_unslash( $_POST['enabled'] ) );
	update_option( 'my_plugin_delete_data_on_uninstall', $enabled );

	wp_send_json_success( [
		'enabled' => $enabled,
		'message' => $enabled ? 'Data deletion enabled.' : 'Data will be preserved on uninstall.'
	] );
}
```

---

### 10. License Activation

Include [`LicenseActivation.php`](../includes/LicenseActivation.php) after the Freemius SDK is initialized. Pass `licenseActiveNonce` from PHP and `freemius` config from `dashboardInfo`.

---

## Component Reference

| Component | Import path | README |
|---|---|---|
| `Welcome` | `bpl-tools/Admin/Welcome` | [Welcome/readme.md](Welcome/readme.md) |
| `Header` | `bpl-tools/Admin/Header` | [Header/readme.md](Header/readme.md) |
| `Demos` | `bpl-tools/Admin/Demos` | [Demos/readme.md](Demos/readme.md) |
| `Pricing` | `bpl-tools/Admin/Pricing` | [Pricing/readme.md](Pricing/readme.md) |
| `FeatureCompare` | `bpl-tools/Admin/FeatureCompare` | [FeatureCompare/readme.md](FeatureCompare/readme.md) |
| `Activation` | `bpl-tools/Admin/Activation` | [Activation/readme.md](Activation/readme.md) |
| `Settings` | `bpl-tools/Admin` (named export) | [Settings/readme.md](Settings/readme.md) |
| `OurPlugins` | `bpl-tools/Admin/OurPlugins` | [OurPlugins/readme.md](OurPlugins/readme.md) |
| `Blocks` | `bpl-tools/Admin/Blocks` | [Blocks/readme.md](Blocks/readme.md) |

### Welcome sub-components (also named exports of `Welcome`)

| Component | Direct import | README |
|---|---|---|
| `Overview` | `bpl-tools/Admin/Welcome` (named) | [Welcome/Overview/readme.md](Welcome/Overview/readme.md) |
| `GettingStarted` | `bpl-tools/Admin/Welcome` (named) | [Welcome/GettingStarted/readme.md](Welcome/GettingStarted/readme.md) |
| `Changelog` | `bpl-tools/Admin/Welcome` (named) | [Welcome/Changelog/readme.md](Welcome/Changelog/readme.md) |
| `ProAds` | `bpl-tools/Admin/Welcome` (named) | [Welcome/ProAds/readme.md](Welcome/ProAds/readme.md) |
| `Info` | `bpl-tools/Admin/Welcome` (named) | [Welcome/Info/readme.md](Welcome/Info/readme.md) |

---

## Best Practices

- **Split config from identity**: `dashboardInfo` = plugin identity props (name, media, pages, freemius). `welcomeInfo` = welcome-page-only content (changelogs, gettingStarted, proFeatures). Never mix them.
- **Always pass `adminUrl`**: Store `adminUrl` in `dashboardInfo` and spread it to all routes so internal links work correctly.
- **Gate routes, not just nav links**: If a route should be hidden, render it conditionally in `App.js` *and* filter it from `Layout.js` navigation.
- **`hasPro` vs `isPremium`**: `hasPro` = pro plugin file installed. `isPremium` = license active. Use `hasPro` to show the Activation tab (user has the pro file but may not have activated the license yet). Use `isPremium` to hide pricing tabs and unlock Pro UI.
- **SVG icons**: Use `stroke='currentColor'` / `fill='none'` — color comes from CSS `color:` not hardcoded fill values.
