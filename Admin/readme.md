# Admin Components & Dashboard Guide

Standardized components for building WordPress admin dashboards within the bPlugins ecosystem. This guide provides a step-by-step walkthrough for creating a full-featured dashboard using these components.

## Step-by-Step Implementation

Follow these steps to set up your admin dashboard. Use the file names and structures below as a template.


### Admin Menu & Enqueue Scripts (PHP)

Create an admin menu in your plugin's main PHP file and return a DOM element with a unique ID and your plugin's data.

```php
<div
	id='apbDashboard'
	data-info='<?php echo esc_attr( wp_json_encode( [
		'version' => APB_VERSION,
		'isPremium' => apbIsPremium(),
		'hasPro' => APB_HAS_PRO,
		'nonce' => wp_create_nonce( 'apbCreatePage' ),
		'licenseActiveNonce' => wp_create_nonce( 'bPlLicenseActivation' )
	] ) ); ?>'
></div>
```

Only enqueue your scripts and styles on the specific admin page path.

```php
function adminEnqueueScripts( $hook ) {
	if( strpos( $hook, 'advanced-post-block' ) ){
		wp_enqueue_style( 'apb-admin-dashboard', APB_DIR_URL . 'build/admin/dashboard.css', [], APB_VERSION );

		$asset_file = include APB_DIR_PATH . 'build/admin/dashboard.asset.php';
		wp_enqueue_script( 'apb-admin-dashboard', APB_DIR_URL . 'build/admin/dashboard.js', array_merge( $asset_file['dependencies'], [ 'wp-util' ] ), APB_VERSION, true );
		wp_set_script_translations( 'apb-admin-dashboard', 'advanced-post-block', APB_DIR_PATH . 'languages' );
	}
}
```


### Dashboard Entry Point (`dashboard.js`)

This file initializes the React application and passes the localized data from the DOM to your App component.

```js
import { createRoot } from 'react-dom/client';

import './dashboard.scss';
import App from './Components/App';
import { dashboardInfo } from './utils/data';

document.addEventListener('DOMContentLoaded', () => {
	const dashboardEl = document.getElementById('apbDashboard');
	const info = JSON.parse(dashboardEl.dataset.info);

	createRoot(dashboardEl).render(<App {...dashboardInfo(info)} />);

	dashboardEl.removeAttribute('data-info');
});
```


### Configuration (`utils/data.js`)

Define your plugin's configuration, including license info, changelogs, and demo items.

```js
import { gridIcon, masonryIcon, sliderIcon, tickerIcon } from '../../utils/icons';

const slug = 'advanced-post-block';

export const dashboardInfo = (info) => {
	const { version, isPremium, hasPro, nonce, licenseActiveNonce } = info;

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
			// landing: `https://bplugins.com/products/${slug}/`,
			docs: `https://bplugins.com/docs/${slug}/`,
			pricing: `https://bplugins.com/products/${slug}/pricing`,
		},
		freemius: {
			product_id: 14262,
			plan_id: 23856,
			public_key: 'pk_87f141adce326dfb96ba4e12d8a36'
		},
		licenseActiveNonce,
		changelogs: [
			{
				version: '2.0.5 - 19 Feb 2026',
				type: 'update',
				list: [
					'Update Admin Dashboard',
					'Fix Issues'
				]
			},
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
				version: '2.0.3 - 11 Dec 2025',
				type: 'update',
				list: [
					'Remove unwanted data from posts query'
				]
			},
			{
				version: '2.0.2 - 03 Dec 2025',
				type: 'new',
				list: [
					'Fix offset query issue',
					'Add more options in Order by Query.'
				]
			},
			{
				version: '2.0.1 - 01 Sep 2025',
				type: 'update',
				list: [
					'Update Custom Post type label',
					'Add additional class for pagination page numbers'
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
			},
			{
				version: '1.16.1 - 3 Jul 2025',
				type: 'fix',
				list: [
					'Fix Pagination issue'
				]
			},
			{
				version: '1.16.0 - 18 Jun 2025',
				type: 'fix',
				list: [
					'Update Upgrade Page',
					'Fix other users premium unlock issue',
					'Update SDK'
				]
			}
		],
		proFeatures: [
			'More Layouts and Sub Layouts with customization.',
			'Advanced queries for tags and taxonomies.',
			'Flexible pagination and infinity loading.',
			'Display reading time and custom metadata.',
			'Shortcode support to display posts anywhere.'
		],
		startButton: {
			label: 'Start Now',
			url: `wp-admin/post-new.php?post_type=page&title=Advanced Post Block&content=<!-- wp:ap-block/posts /-->&nonce=${nonce}`
		}
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
				},
				{
					title: 'Title Meta',
					type: 'iframe',
					url: 'https://apb.bplugins.com/demo/grid-title-meta-layout/'
				},
				{
					title: 'Side Image',
					type: 'iframe',
					url: 'https://apb.bplugins.com/demo/grid-side-image-layout/'
				},
				{
					title: 'Overlay',
					type: 'iframe',
					url: 'https://apb.bplugins.com/demo/grid-overlay-layout/'
				}
			]
		},
		{
			icon: masonryIcon,
			title: 'Masonry Layout',
			children: [
				{
					title: 'Default',
					type: 'iframe',
					url: 'https://apb.bplugins.com/demo/masonry-default-layout/'
				},
				{
					title: 'Title Meta',
					type: 'iframe',
					url: 'https://apb.bplugins.com/demo/masonry-title-meta-layout/'
				},
				{
					title: 'Side Image',
					type: 'iframe',
					url: 'https://apb.bplugins.com/demo/masonry-side-image-layout/'
				},
				{
					title: 'Overlay',
					type: 'iframe',
					url: 'https://apb.bplugins.com/demo/masonry-overlay-layout/'
				}
			]
		},
		{
			icon: sliderIcon,
			title: 'Slider Layout',
			children: [{
				title: 'Side Image',
				type: 'iframe',
				url: 'https://apb.bplugins.com/demo/slider-side-image-layout/'
			},
			{
				title: 'Overlay',
				type: 'iframe',
				url: 'https://apb.bplugins.com/demo/slider-overlay-layout/'
			}
			]
		},
		{
			icon: tickerIcon,
			title: 'Ticker Layout',
			children: [
				{
					title: 'Side Image',
					type: 'iframe',
					url: 'https://apb.bplugins.com/demo/ticker-side-image-layout/'
				},
				{
					title: 'Overlay',
					type: 'iframe',
					url: 'https://apb.bplugins.com/demo/ticker-overlay-layout/'
				}
			]
		},
		{
			icon: '',
			title: 'Post Section',
			children: [
				{
					title: 'Post Section (Design 1)',
					type: 'iframe',
					url: 'https://apb.bplugins.com/demo/design-1/'
				},
				{
					title: 'Post Section (Design 2)',
					type: 'iframe',
					url: 'https://apb.bplugins.com/demo/post-section-design-2/'
				},
				{
					title: 'Post Section (Design 3)',
					type: 'iframe',
					url: 'https://apb.bplugins.com/demo/post-section-design-3/'
				},
				{
					title: 'Post Section (Design 4)',
					type: 'iframe',
					url: 'https://apb.bplugins.com/demo/post-section-design-4/'
				},
				{
					title: 'Post Section (Design 5)',
					type: 'iframe',
					url: 'https://apb.bplugins.com/demo/post-section-design-5/'
				}
			]
		},
		{
			icon: '',
			title: 'All Posts',
			type: 'iframe',
			url: 'https://apb.bplugins.com/demo/all-posts/'
		}
	]
}

export const pricingInfo = {
	logo: `https://ps.w.org/${slug}/assets/icon-128x128.png`, // Optional
	pluginId: 14262,
	planId: 23856,
	licenses: [
		1,
		3,
		null
	],
	button: {
		label: 'Buy Now ➜'
	},
	featured: {
		selected: 3, // choose from licenses item
	}
}
```


### Root Component (`Components/App.js`)

Manage routing using `react-router-dom`. Import standard components from `bpl-tools`.

```js
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Blocks from '../../../../bpl-tools/Admin/Blocks';
import Demos from '../../../../bpl-tools/Admin/Demos';
import Pricing from '../../../../bpl-tools/Admin/Pricing';
import FeatureCompare from '../../../../bpl-tools/Admin/FeatureCompare';
import Activation from '../../../../bpl-tools/Admin/Activation';
import OurPlugins from '../../../../bpl-tools/Admin/OurPlugins';

import Layout from './Layout';
import Welcome from './Welcome';
import blocks from '../utils/blocks';
import { demoInfo, pricingInfo } from '../utils/data';

const App = (props) => {
	const { isPremium, hasPro } = props;

	return <Router>
		<Routes>
			<Route path='/' element={<Layout {...props} />}>
				<Route index element={<Welcome {...props} />} />

				<Route path='welcome' element={<Welcome {...props} />} />

				<Route path='blocks' element={<Blocks {...props} allBlocks={blocks} />} />

				<Route path='demos' element={<Demos demoInfo={demoInfo} {...props} />} />

				{!isPremium && <Route path='pricing' element={<Pricing pricingInfo={pricingInfo} options={{}} {...props} />} />}

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

### Layout Wrapper (`Components/Layout.js`)

Standardizes the dashboard header and side navigation.

```js
import { Outlet, Link, useLocation } from 'react-router-dom';

import Header from '../../../../bpl-tools/Admin/Header';

const navigation = [
	{ name: 'Welcome', href: '/welcome' },
	{ name: 'Blocks', href: '/blocks' },
	{ name: 'Demos', href: '/demos' },
	{ name: 'Pricing', href: '/pricing' },
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
					?.filter(item => item.href !== '/activation' || hasPro) // Hide activation link for non-pro users
					?.filter(item => !isPremium || !['/purchase', '/pricing', '/feature-comparison'].includes(item.href)) // Hide link for premium users
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

### Home Page (`Components/Welcome.js`)

Build your default landing page with banners, blocks management, and changelogs.

```js
import Overview from '../../../../bpl-tools/Admin/Overview';
import Changelog from '../../../../bpl-tools/Admin/Changelog';
import ProAds from '../../../../bpl-tools/Admin/ProAds';
import Card from '../../../../bpl-tools/Admin/Blocks/Card';
import blocks from '../utils/blocks';

const Welcome = (props) => {
	const { isPremium } = props;

	return <Overview {...props}>
		<Card {...props} allBlocks={blocks} />

		<div style={{
			display: 'grid',
			gridTemplateColumns: isPremium ? '1fr' : 'repeat(auto-fill, minmax(min(480px, 100%), 1fr))',
			gap: '32px'
		}}>
			<Changelog {...props} />

			{!isPremium && <ProAds {...props} />}
		</div>
	</Overview>
}
export default Welcome;
```


### Dashboard Styles (`dashboard.scss`)

Import core dashboard styles and customize your theme. And change your color variables to set your own brand colors. You can get the colors from the ***Abu Hayat*** Vai.

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

// Your custom dashboard styles here
```


### All Blocks props (`blocks.js`)

Import core allBlocks.

```js
import { alertIcon, animationIcon, buttonGroupIcon, buttonIcon, cardIcon, chartIcon, containerIcon, contentTickerIcon, countdownIcon, countersIcon, dataTableIcon, dualColorHeadingIcon, emojiStack, facebookEmbedIcon, facebookPageIcon, featureBoxIcon, flipBoxIcon, formBuilderIcon, galleryIcon, gifIcon, htmlIcon, iconBoxIcon, imageCompareIcon, imageHotspotIcon, imageIcon, imageScrollerIcon, infoBoxIcon, listIcon, logoSliderIcon, lottieIcon, mailIcon, navigationIcon, newsTicker, postsIcon, priceListIcon, pricingTableIcon, qrCodeIcon, rowIcon, scrollToTopIcon, sectionHeadingIcon, servicesIcon, shapeDividerIcon, skillBarIcon, sliderIcon, socialShareIcon, starRatingIcon, svgDrawIcon, tableOfContentIcon, tDViewerIcon, teamMembersIcon, telexAccordionIcon, testimonialsIcon, textPathIcon, toggleContentIcon, videoIcon } from './blocksIcon';

const pluginSlug = 'b-blocks';

const siteURL = 'https://bblockswp.com';
const demoLink = `${siteURL}/demo`;
const docsURL = `${siteURL}/docs`;

export default [
    {
        title: 'Grid',
        children: [
            {
                name: `${pluginSlug}/container`,
                title: 'Container',
                icon: containerIcon,
                demo: ``,
                docs: ``,
                status: 'published',
                required: true
            },
            {
                name: `${pluginSlug}/row`,
                title: 'Row',
                icon: rowIcon,
                demo: `${demoLink}/row/`,
                docs: `${docsURL}/row-block/`,
                status: 'published',
                required: true
            },
            {
                name: `${pluginSlug}/team-members`,
                title: 'Team Members',
                icon: teamMembersIcon,
                demo: `${demoLink}/team-members/`,
                docs: `${docsURL}/team-block/`,
                status: 'published'
            }
        ]
    },
    {
        name: `${pluginSlug}/td-viewer`,
        title: '3D Viewer',
        icon: tDViewerIcon,
        demo: `${demoLink}/3d-viewer/`,
        docs: `${docsURL}/3d-viewer-block/`,
        status: 'published'
    },
    {
        name: `${pluginSlug}/advanced-image`,
        title: 'Advanced Image',
        icon: imageIcon,
        demo: ``,
        docs: ``,
        status: 'published'
    },
    {
        name: `${pluginSlug}/alert`,
        title: 'Alert',
        icon: alertIcon,
        demo: `${demoLink}/alert/`,
        docs: `${docsURL}/alert-block/`,
        status: 'published'
    },
    {
        name: `${pluginSlug}/animated-text`,
        title: 'Animated Text',
        icon: animationIcon,
        demo: `${demoLink}/animated-text/`,
        docs: `${docsURL}/animated-text-block/`,
        status: 'published'
    },
    {
        name: `${pluginSlug}/accordion-block`,
        title: 'Accordion Block',
        icon: telexAccordionIcon,
        // demo: `${demoLink}/animated-text/`,
        // docs: `${docsURL}/animated-text-block/`,
        status: 'published'
    },
    {
        name: `${pluginSlug}/button`,
        title: 'Button',
        icon: buttonIcon,
        demo: `${demoLink}/button/`,
        docs: ``,
        status: 'published'
    },
    {
        name: `${pluginSlug}/button-group`,
        title: 'Button Group',
        icon: buttonGroupIcon,
        demo: `${demoLink}/button-group/`,
        docs: ``,
        status: 'published'
    },
    {
        name: `${pluginSlug}/cards`,
        title: 'Cards',
        icon: cardIcon,
        demo: `${demoLink}/cards/`,
        docs: ``,
        status: 'published',
		badge: 'New'
    },
    {
        name: `${pluginSlug}/chart`,
        title: 'Chart',
        icon: chartIcon,
        demo: `${demoLink}/chart/`,
        docs: `${docsURL}/chart-block/`,
        status: 'published'
    },
    {
        title: 'Sections',
        children: [
            {
                name: `${pluginSlug}/feature-boxes`,
                title: 'Feature Boxes',
                icon: featureBoxIcon,
                demo: `${demoLink}/feature-boxes/`,
                docs: ``,
                status: 'published'
            },
            {
                name: `${pluginSlug}/flip-boxes`,
                title: 'Flip Boxes',
                icon: flipBoxIcon,
                demo: `${demoLink}/flip-boxes/`,
                docs: ``,
                status: 'published'
            },
            {
                name: `${pluginSlug}/testimonials`,
                title: 'Testimonials',
                icon: testimonialsIcon,
                // demo: `${demoLink}/testimonials/`,
                // docs: `${docsURL}/testimonials-block/`,
                status: 'published'
            }
        ]
    },
    {
        name: `${pluginSlug}/content-ticker`,
        title: 'Content Ticker',
        icon: contentTickerIcon,
        demo: ``,
        docs: ``,
        status: 'published',
        isPremium: true
    },
    {
        name: `${pluginSlug}/countdown`,
        title: 'Countdown Timer',
        icon: countdownIcon,
        demo: `${demoLink}/countdown/`,
        docs: `${docsURL}/countdown-block/`,
        status: 'published'
    },
    {
        name: `${pluginSlug}/counters`,
        title: 'Counters',
        icon: countersIcon,
        demo: `${demoLink}/counters/`,
        docs: `${docsURL}/counters-block/`,
        status: 'published'
    },
    {
        name: `${pluginSlug}/data-table`,
        title: 'Data Table',
        icon: dataTableIcon,
        demo: ``,
        docs: ``,
        status: 'inDev'
    }
];
```


### Start Button
To create start button you have to give a `startButton` property in your data.js
```js
return {
	...otherprops,
	startButton: {
		label: 'Start Now',
		url: `wp-admin/post-new.php?post_type=page&title=Advanced Post Block&content=<!-- wp:ap-block/posts /-->&nonce=${nonce}`
	}
}
```
Here in the url you will see a **title** and **content** given in the url of page creation to receive and apply that title and content you have to add 2 filter hook for that

```php
add_filter( 'default_title', function defaultTitle( $title, $post ) {
	if ( 'page' === $post->post_type && isset( $_GET['title'] ) ) {
		$nonce = isset( $_GET['nonce'] ) ? sanitize_text_field( wp_unslash( $_GET['nonce'] ) ) : '';

		if ( wp_verify_nonce( $nonce, 'apbCreatePage' ) ) {
			return sanitize_text_field( wp_unslash( $_GET['title'] ) );
		}
	}
	return $title;
}, 10, 2 );

add_filter( 'default_content', function defaultContent( $content, $post ) {
	if ( 'page' === $post->post_type && isset( $_GET['content'] ) ) {
		$nonce = isset( $_GET['nonce'] ) ? sanitize_text_field( wp_unslash( $_GET['nonce'] ) ) : '';

		if ( wp_verify_nonce( $nonce, 'apbCreatePage' ) ) {
			// phpcs:ignore WordPress.Security.ValidatedSanitizedInput.InputNotSanitized -- Content is secured by nonce verification and unslashed to preserve Gutenberg block markup.
			return wp_unslash( $_GET['content'] );
		}
	}
	return $content;
}, 10, 2 );
```
This hook will apply default title and content on create page


### License Activation
For the license activation you have to require [`LicenseActivation.php`](https://github.com/bPlugins/advanced-post-block-pro/blob/main/includes/LicenseActivation.php) file. Make sure the `freemius` sdk is present while requiring this file


## Best Practices

1. **Centralized Data**: Pass all configurations through a single object from your `data.js` utility.
2. **JSDoc Headers**: All components include JSDoc for prop discovery in your IDE.
3. **Responsive**: Every component is mobile-first and fully responsive.
4. **License Guards**: Use the `isPremium` prop to conditionally toggle "Pro" features.
