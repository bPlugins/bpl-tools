# TemplateLibrary

Shared, reusable template library modal component for WordPress block plugins.

## Quick Start

### 1. Create plugin wrapper (src/template-library/TemplateLibrary.js)

```jsx
import { __ } from '@wordpress/i18n';
import BPLTemplateLibrary from '../../../bpl-tools/TemplateLibrary';
import { pluginIcon } from '../utils/icons';

const TemplateLibrary = () => {
	const nonce = window.yourPluginConfig?.nonce;
	const isPremium = Boolean(window.yourPremiumCheck ?? false);

	return <BPLTemplateLibrary
		// Branding
		logo={pluginIcon}
		buttonLabel={__('Template Library', 'textdomain')}

		// Modal
		modalTitle={__('Templates Library', 'textdomain')}
		types={['patterns', 'pages']}
		perPage={9}

		// Pricing URL
		pricingUrl='https://bplugins.com/products/your-plugin/'

		// AJAX endpoints (customize if your plugin uses different action names)
		ajaxActionMain='your_templates_main'
		ajaxActionTemplates='your_templates'
		ajaxActionImport='your_template_import'
		ajaxActionCounts='your_template_counts'

		// Auth
		nonce={nonce}
		isPremium={isPremium}
	/>;
};

export default TemplateLibrary;
```

### 2. Mount in editor (src/template-library/index.js)

```jsx
import { subscribe } from '@wordpress/data';
import domReady from '@wordpress/dom-ready';
import { createRoot } from 'react-dom/client';
import TemplateLibrary from './TemplateLibrary';

const mountTemplateLibrary = () => {
	const templateLibraryWrap = document.createElement('div');
	templateLibraryWrap.classList.add('bPlTemplateLibraryWrap');
	createRoot(templateLibraryWrap).render(<TemplateLibrary />);

	subscribe(() => {
		setTimeout(() => {
			const toolbar = document.querySelector('.edit-post-header-toolbar');
			if (toolbar && !toolbar.querySelector('.bPlTemplateLibraryWrap')) {
				toolbar.appendChild(templateLibraryWrap);
			}
		}, 1);
	});
};

domReady(mountTemplateLibrary);
```

## Configuration Props

### Identity (Required)
- **prefix** (string): Plugin prefix (e.g. `'apb'`) — drives the Favorites feature: the option name (`{prefix}FavoritesTemplates`) and its AJAX action (`{prefix}_template_favorites`)

### Branding (Required)
- **logo** (ReactNode): Plugin logo to display in modal
- **buttonLabel** (string): Text for the template library button

### Modal
- **modalTitle** (string): Modal header text (default: 'Templates Library')
- **types** (array): Tab types to display - ['patterns'], ['pages'], or ['patterns', 'pages'] (default: ['patterns', 'pages'])
	- If only one type, tab header is hidden
	- Tab names are fixed: 'Patterns' and 'Pages'
- **perPage** (number): Templates per page for pagination (default: 9)

### URLs
- **pricingUrl** (string): Link for "Get Pro" button (required if supporting pro templates)

### AJAX Endpoints (Required)
- **ajaxActionMain** (string): Categories endpoint (default: 'prefix_templates_main')
- **ajaxActionTemplates** (string): Templates endpoint (default: 'prefix_templates')
- **ajaxActionImport** (string): Import endpoint (default: 'prefix_template_import')
- **ajaxActionCounts** (string): Counts endpoint (default: 'prefix_template_counts')

### Authentication (Required)
- **nonce** (string): WordPress AJAX nonce for security
- **isPremium** (boolean): Whether user has pro access (default: false)

## Theming

All colors are exposed as `--bpl-template-*` CSS variables with built-in defaults. Override them from any stylesheet loaded in the editor — e.g. your plugin's template-library entry (`src/template-library/style.scss`):

```scss
:root {
	--bpl-template-primary-color: #0B81EE;
	--bpl-template-primary-color-rgb: 11, 129, 238;
	--bpl-template-primary-dark-color: #0967be;
}
```

| Variable | Default | Used for |
|---|---|---|
| `--bpl-template-primary-color` | `#146ef5` | Brand accent — buttons, active states, focus rings |
| `--bpl-template-primary-color-rgb` | `20, 110, 245` | RGB triplet of primary, for `rgba()` tints |
| `--bpl-template-primary-dark-color` | `#0b53c7` | Darker primary — gradients, active text |

Notes:
- Every variable is optional — anything not overridden falls back to the defaults above.
- Always keep the `-rgb` triplets in sync with their hex counterparts (they drive the `rgba()` tints).
- The Free (green) and Pro (amber) status colors are intentionally fixed for consistency across plugins.

## Hardcoded Labels

The following are **not configurable** (standardized for consistency):

- Modal tabs: "Patterns", "Pages"
- Sidebar: "Categories", "All", "Free", "Pro"
- Search: "Search templates…"
- Actions: "Import", "Get Pro", "Load More", "No Templates Found!!"

## Features

- ✅ **Reusable** — Share one component across all plugins
- ✅ **Configurable** — Essential props passed by plugin wrapper
- ✅ **Standardized UI** — Consistent labels and styling across plugins
- ✅ **Smart Tab Display** — Hides tab header when only one type configured
- ✅ **Plugin-Specific Filtering** — Only shows templates for that plugin
- ✅ **Free/Pro Access** — Accurate count badges and access controls
- ✅ **Multi-Field Search** — Title, category, and keywords
- ✅ **Responsive Layout** — Flexbox grid with 350px minimum width
- ✅ **Modal Portal** — Appends to body, removes on close
- ✅ **Load More** — Infinite scroll pagination
- ✅ **Preview Support** — Supports custom preview_url meta field
- ✅ **Favorites** — Heart toggle on each card; saved per site in the `{prefix}FavoritesTemplates` option and shown in a dedicated Favorites tab (patterns and pages mixed, filtered client-side)

## Backend Requirements

Your plugin needs two backend files — copy both from the reference implementation and rename the prefix (`apb_`) to your plugin's:

**[advanced-post-block-pro/includes/Templates](https://github.com/bPlugins/advanced-post-block-pro/tree/main/includes/Templates)**

- **Templates.php** — Registers the `wp_ajax_*` endpoints the component calls:
	- `{prefix}_template_favorites` — Reads (and saves, when a `favorites` JSON payload is posted) the favorite template IDs in the `{prefix}FavoritesTemplates` option as `{ patterns: [...ids], pages: [...ids] }`
	- `{prefix}_templates_main` — Fetches categories for the sidebar (filtered to categories that have templates for this plugin)
	- `{prefix}_templates` — Fetches the paginated template list; accepts `type`, `category`, `pageNumber`, `perPage`, and `search`, and proxies them to the templates server (`https://templates.bplugins.com`) as `start={pageNumber-1}&end={pageNumber}&limit={perPage}` with the `plugin` taxonomy filter
	- `{prefix}_template_import` — Imports a template's content: downloads its images into the site's media library (via Image.php) and returns the rewritten block markup
	- `{prefix}_template_counts` — Returns All/Free/Pro counts overall and per category for the sidebar badges
- **Image.php** — Image importer used by the import endpoint; sideloads every remote image found in the template content into the local media library and swaps the URLs/IDs in the block markup, deduplicating already-imported images

All endpoints must verify the nonce (`{prefix}_template`) — the same nonce you pass to the component's `nonce` prop.

The remote API these endpoints call is served by [@bblocks-sites/includes/Rest/PatternsController.php](../../../bblocks-sites/includes/Rest/PatternsController.php), which handles the `plugin` taxonomy filter, `start`/`end`/`limit` pagination, and search across title, category, and keywords.

## File Structure

```
bpl-tools/TemplateLibrary/
├── index.js					(Main component - fully generic)
├── style.scss					(Shared styles)
├── Components/
│	├── Modal.js				(Modal header & tabs)
│	├── Portal.js				(React Portal wrapper)
│	├── Sidebar.js				(Filters & search)
│	└── Templates.js			(Template grid & import)
├── hooks/
│	├── useTemplates.js			(Fetch & paginate templates)
│	├── useTemplatesMain.js		(Fetch categories)
│	└── useAccessCounts.js		(Fetch Free/Pro counts)
└── utils/
	└── icons.js				(Generic UI icons)
```
