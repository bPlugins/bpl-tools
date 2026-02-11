# Admin Components & Dashboard Guide

Standardized components for building WordPress admin dashboards within the bPlugins ecosystem. This guide provides a step-by-step walkthrough for creating a full-featured dashboard using these components.

## Step-by-Step Implementation

Follow these steps to set up your admin dashboard. Use the file names and structures below as a template.

### 1. Admin Menu & Enqueue Scripts (PHP)

Create an admin menu in your plugin's main PHP file and return a DOM element with a unique ID and your plugin's data.

```php
<div
	id='bplDashboard'
	data-info='<?php echo esc_attr( wp_json_encode( [
		'version' => YOUR_PLUGIN_VERSION,
		'isPremium' => your_plugin_is_premium(),
		'hasPro' => YOUR_PLUGIN_HAS_PRO
	] ) ); ?>'
></div>
```

Only enqueue your scripts and styles on the specific admin page path.

### 2. Dashboard Entry Point (`dashboard.js`)

This file initializes the React application and passes the localized data from the DOM to your App component.

```js
import { createRoot } from 'react-dom/client';

import './dashboard.scss';
import App from './Components/App';
import { dashboardInfo } from './utils/data';

document.addEventListener('DOMContentLoaded', () => {
    const dashboardEl = document.getElementById('bplDashboard');
    if (dashboardEl) {
        const info = JSON.parse(dashboardEl.dataset.info);
        createRoot(dashboardEl).render(<App {...dashboardInfo(info)} />);
    }
});
```

### 3. Configuration (`utils/data.js`)

Define your plugin's configuration, including license info, changelogs, and demo items.

```js
import { gridIcon, masonryIcon, sliderIcon, tickerIcon } from '../../utils/icons';

const slug = 'advanced-post-block';

export const dashboardInfo = (info) => {
	const { version, isPremium, hasPro } = info;

	const proSuffix = isPremium ? ' Pro' : '';

	return {
		name: `Advanced Post Block${proSuffix}`,
		displayName: `Advanced Post Block${proSuffix} - Showcase Posts with Grid, List, Card Layouts and Filters`,
		description: 'Advanced Post Block is a powerful and flexible block plugin that allows you to display posts, display blog posts, and embed custom posts in a fully customizable and responsive layout.',
		slug,
		version,
		isPremium,
		hasPro,
		displayOurPlugins: true,
		media: {
			logo: `https://ps.w.org/${slug}/assets/icon-128x128.png`,
			banner: `https://ps.w.org/${slug}/assets/banner-772x250.png`,
			thumbnail: `https://bplugins.com/wp-content/themes/b-technologies/assets/images/products/${slug}.png`,
			proThumbnail: `https://bplugins.com/wp-content/themes/b-technologies/assets/images/products/${slug}-pro.png`,
			video: 'https://www.youtube.com/watch?v=milYZrqLJsE',
			isYoutube: true
		},
		pages: {
			org: `https://wordpress.org/plugins/${slug}/`,
			landing: `https://bplugins.com/products/${slug}/`,
			docs: `https://bplugins.com/docs/${slug}/`,
			pricing: `https://bplugins.com/products/${slug}/pricing`,
		},
		freemius: {
			product_id: 14262,
			plan_id: 23856,
			public_key: 'pk_87f141adce326dfb96ba4e12d8a36'
		},
		changelogs: [ 
			{
				version: '2.0.4 - 22 Jan 2026',
				type: 'new',
				list: [
					'Add Infinite Scroll (alternative of Pagination)',
					'Add Navigation (alternative of Pagination)',
					'Add Load More Button (alternative of Pagination)'
				]
			},
			{
				version: '2.0.0 - 20 Aug 2025',
				type: 'fix',
				list: [
					'Fix Post Type Issues',
					'Update SDK',
					'Change UI',
					'Admin Dashboard'
				]
			}
		],
		proFeatures: [
			'More Layouts and Sub Layouts with customization.',
			'Advanced queries for tags and taxonomies.',
			'Flexible pagination and infinity loading.',
			'Display reading time and custom metadata.',
			'Shortcode support to display posts anywhere.'
		]
	}
}

export const demoInfo = {
	allInOneLabel: 'See All Demos',
	allInOneLink: 'https://apb.bplugins.com/all-demos-in-one-place/',
	demos: [
		{
			icon: gridIcon,
			title: 'Grid Layout',
			children: [
				{
					title: 'Default',
					type: 'iframe',
					url: 'https://apb.bplugins.com/demo/grid-default-layout/',
				}, {
					title: 'Overlay',
					type: 'iframe',
					url: 'https://apb.bplugins.com/demo/grid-overlay-layout/'
				}
			]
		}
	]
}
```

### 4. Root Component (`Components/App.js`)

Manage routing using `react-router-dom`. Import standard components from `bpl-tools`.

```js
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Activation, Blocks, Demos, FeatureCompare, OurPlugins } from 'bpl-tools/Admin';

import Layout from './Layout';
import Welcome from './Welcome';
import { demoInfo } from '../utils/data';

const App = (props) => {
    const { isPremium, hasPro } = props;

    return <Router>
        <Routes>
            <Route path='/' element={<Layout {...props} />}>
                <Route index element={<Welcome {...props} />} />
                <Route path='welcome' element={<Welcome {...props} />} />
                <Route path='demos' element={<Demos demoInfo={demoInfo} {...props} />} />
                {!isPremium && <Route path='feature-comparison' element={<FeatureCompare plans={['free', 'pro']} {...props} />} />}
                {hasPro && <Route path='activation' element={<Activation {...props} />} />}
                <Route path='our-plugins' element={<OurPlugins {...props} />} />
                <Route path='*' element={<Navigate to='/welcome' replace />} />
            </Route>
        </Routes>
    </Router>
}
export default App;
```

### 5. Layout Wrapper (`Components/Layout.js`)

Standardizes the dashboard header and side navigation.

```js
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Header } from 'bpl-tools/Admin';

const navigation = [
    { name: 'Welcome', href: '/welcome' },
    { name: 'Demos', href: '/demos' },
    { name: 'Feature Comparison', href: '/feature-comparison' },
    { name: 'Activation', href: '/activation' }
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

### 6. Home Page (`Components/Welcome.js`)

Build your default landing page with banners, blocks management, and changelogs.

```js
import { Overview, Changelog, ProAds } from 'bpl-tools/Admin';
import { BlocksCard } from 'bpl-tools/Admin/Blocks';

const Welcome = (props) => {
    const { isPremium } = props;

    return <Overview {...props}>
        <BlocksCard {...props} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(480px, 1fr))', gap: '32px' }}>
            <Changelog {...props} />
            {!isPremium && <ProAds {...props} />}
        </div>
    </Overview>
}
export default Welcome;
```

### 7. Dashboard Styles (`dashboard.scss`)

Import core dashboard styles and customize your theme.

```scss
@import "bpl-tools/Admin/style.scss";

// Your custom dashboard styles here
```

## Component Library Overview

| Component | Description | Key Props |
| :--- | :--- | :--- |
| `Activation` | Freemius license management | `product_id`, `public_key`, `slug` |
| `Blocks` | Toggle plugin features/blocks | `allBlocks`, `disabledBlocks`, `onChange` |
| `Overview` | Main banner and quick links | `name`, `media`, `pages` |
| `Changelog` | Formatted release notes | `changelogs` |
| `Demos` | Live feature previews | `demoInfo` |
| `OurPlugins` | Cross-promotion section | `slug`, `slugs` |

## Best Practices

1. **Centralized Data**: Pass all configurations through a single object from your `data.js` utility.
2. **JSDoc Headers**: All components include JSDoc for prop discovery in your IDE.
3. **Responsive**: Every component is mobile-first and fully responsive.
4. **License Guards**: Use the `isPremium` prop to conditionally toggle "Pro" features.
