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
		perPage={12}

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

### Branding (Required)
- **logo** (ReactNode): Plugin logo to display in modal
- **buttonLabel** (string): Text for the template library button

### Modal
- **modalTitle** (string): Modal header text (default: 'Templates Library')
- **types** (array): Tab types to display - ['patterns'], ['pages'], or ['patterns', 'pages'] (default: ['patterns', 'pages'])
  - If only one type, tab header is hidden
  - Tab names are fixed: 'Patterns' and 'Pages'
- **perPage** (number): Templates per page for pagination (default: 12)

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

## Backend Requirements

Your plugin's backend AJAX endpoints must:

1. Accept `plugin` parameter to filter by plugin taxonomy
2. Accept `perPage` parameter for pagination limit
3. Support search across title, category, and keywords
4. Return proper data structure (patterns array, count, etc.)
5. Verify nonce and user permissions

See [@bblocks-sites/includes/Rest/PatternsController.php](../../../bblocks-sites/includes/Rest/PatternsController.php) for reference implementation.

## File Structure

```
bpl-tools/TemplateLibrary/
├── index.js					(Main component - fully generic)
├── style.scss				(Shared styles)
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
