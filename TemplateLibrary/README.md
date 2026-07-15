# TemplateLibrary

Shared, fully dynamic template library modal component for WordPress block plugins.

## Quick Start

### 1. Create plugin wrapper (src/backend/TemplateLibrary.js)

```jsx
import { __ } from '@wordpress/i18n';
import { TemplateLibrary as TemplateLibraryModal } from '../../../bpl-tools/TemplateLibrary';
import { pluginIcon } from '../utils/icons';

const TemplateLibrary = () => {
	const nonce = window.yourPluginConfig?.nonce;
	const isPremium = Boolean(window.yourPremiumCheck ?? false);

	return <TemplateLibraryModal
		// Branding
		buttonIcon={pluginIcon}
		buttonLabel={__('Template Library', 'your-plugin')}
		buttonClassName='templateLibraryButton'

		// Modal labels
		modalTitle={__('Templates Library', 'your-plugin')}
		patternsTabLabel={__('Patterns', 'your-plugin')}
		pagesTabLabel={__('Pages', 'your-plugin')}

		// Sidebar labels
		allLabel={__('All', 'your-plugin')}
		freeLabel={__('Free', 'your-plugin')}
		proLabel={__('Pro', 'your-plugin')}
		categoriesHeadingLabel={__('Categories', 'your-plugin')}
		searchPlaceholder={__('Search templates…', 'your-plugin')}

		// Action buttons
		importButtonLabel={__('Import', 'your-plugin')}
		proButtonLabel={__('Get Pro', 'your-plugin')}
		loadMoreButtonLabel={__('Load More', 'your-plugin')}
		noTemplatesText={__('No Templates Found!!', 'your-plugin')}

		// URLs
		proProductUrl='https://bplugins.com/products/your-plugin/'

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

### 2. Mount in editor (src/backend/template-library.js)

```jsx
import { subscribe } from '@wordpress/data';
import domReady from '@wordpress/dom-ready';
import { createRoot } from 'react-dom/client';
import TemplateLibrary from './TemplateLibrary';

const mountTemplateLibrary = () => {
	const templateLibraryWrap = document.createElement('div');
	templateLibraryWrap.classList.add('templateLibraryWrap');
	createRoot(templateLibraryWrap).render(<TemplateLibrary />);

	subscribe(() => {
		setTimeout(() => {
			const toolbar = document.querySelector('.edit-post-header-toolbar');
			if (toolbar && !toolbar.querySelector('.templateLibraryWrap')) {
				toolbar.appendChild(templateLibraryWrap);
			}
		}, 1);
	});
};

domReady(mountTemplateLibrary);
```

## All Props

### Branding
- **buttonIcon** (ReactNode): Icon in button
- **buttonLabel** (string): Button text
- **buttonClassName** (string): CSS class for button (default: 'templateLibraryButton')

### Modal
- **modalTitle** (string): Modal header text (default: 'Templates Library')
- **patternsTabLabel** (string): First tab label (default: 'Patterns')
- **pagesTabLabel** (string): Second tab label (default: 'Pages')

### Sidebar (Filters)
- **allLabel** (string): "All" access filter (default: 'All')
- **freeLabel** (string): "Free" access filter (default: 'Free')
- **proLabel** (string): "Pro" access filter (default: 'Pro')
- **categoriesHeadingLabel** (string): Categories section title (default: 'Categories')
- **searchPlaceholder** (string): Search input placeholder (default: 'Search templates…')

### Template Actions
- **importButtonLabel** (string): Import button text (default: 'Import')
- **proButtonLabel** (string): "Get Pro" button text (default: 'Get Pro')
- **loadMoreButtonLabel** (string): Load more button text (default: 'Load More')
- **noTemplatesText** (string): Empty state message (default: 'No Templates Found!!')

### URLs
- **proProductUrl** (string): Link for "Get Pro" button (default: 'https://bplugins.com/products/advanced-post-block/')

### AJAX Endpoints
- **ajaxActionMain** (string): Categories endpoint (default: 'apb_templates_main')
- **ajaxActionTemplates** (string): Templates endpoint (default: 'apb_templates')
- **ajaxActionImport** (string): Import endpoint (default: 'apb_template_import')
- **ajaxActionCounts** (string): Counts endpoint (default: 'apb_template_counts')

### Authentication
- **nonce** (string): WordPress AJAX nonce (required)
- **isPremium** (boolean): User has pro access (default: false)

## Features

- ✅ **Fully Dynamic** — All text, URLs, and AJAX actions passed as props
- ✅ **No Hardcoded Values** — Works for any plugin with different branding
- ✅ **Plugin-Specific Filtering** — Only shows templates for that plugin
- ✅ **Free/Pro Access** — Accurate count badges and access controls
- ✅ **Multi-Field Search** — Title, category, and keywords
- ✅ **Responsive Layout** — Flexbox grid with 350px minimum width
- ✅ **Modal Portal** — Appends to body, removes on close
- ✅ **Load More** — Infinite scroll pagination
- ✅ **Preview URLs** — Supports custom preview_url meta field

## Backend Requirements

Your plugin's backend AJAX endpoints must:

1. Accept `plugin` parameter to filter by plugin taxonomy
2. Support search across title, category, and keywords
3. Return proper data structure (patterns array, count, etc.)
4. Verify nonce and user permissions

See [@bblocks-sites/includes/Rest/PatternsController.php](../../../bblocks-sites/includes/Rest/PatternsController.php) for reference implementation.

## File Structure

```
bpl-tools/TemplateLibrary/
├── TemplateLibrary.js		(Main component - fully generic)
├── TemplateLibrary.scss	(Shared styles)
├── Modal/
│	├── Modal.js			(Modal header & tabs)
│	├── Portal.js			(React Portal wrapper)
│	├── Sidebar.js			(Filters & search)
│	└── Templates.js		(Template grid & import)
├── hooks/
│	├── useTemplates.js		(Fetch & paginate templates)
│	├── useTemplatesMain.js	(Fetch categories)
│	└── useAccessCounts.js	(Fetch Free/Pro counts)
└── utils/
	└── icons.js			(Generic UI icons)
```
