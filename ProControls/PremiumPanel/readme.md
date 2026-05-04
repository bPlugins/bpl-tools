# PremiumPanel Components

This directory contains components used to display "Premium" or "Pro" upgrade prompts and badges within the block editor sidebar (Inspector Controls).

## Components

### 1. `PremiumPanel`
A centered panel typically placed inside a `PanelBody` to encourage users to upgrade to the Pro version. It includes an icon, a title (optional with demo link), a description, and a call-to-action button.

**Usage:**
```javascript
import { PremiumPanel } from '../../bpl-tools/ProControls';

// Inside your component
<PremiumPanel 
    title={__('Premium Feature', 'text-domain')} 
    description={__('This feature is only available in the Pro version.', 'text-domain')} 
    pricingUrl="https://bplugins.com/products/..."
    demoUrl="https://demo.bplugins.com/..." // Optional
/>
```

**Props:**
- `title` (String): The main heading for the upgrade prompt.
- `description` (String): Detailed text explaining the premium benefits.
- `pricingUrl` (String): URL to the product pricing/purchase page.
- `demoUrl` (String): Optional URL to a live demo of the premium feature.
- `buttonLabel` (String): Optional label for the CTA button (Default: "Get Pro").

---

### 2. `PremiumBadge`
A small badge component used to label Pro features in the sidebar titles or settings.

**Usage:**
```javascript
import { PremiumBadge } from '../../bpl-tools/ProControls';

// Inside a PanelBody title
<PanelBody title={<>
    {__('Advanced Settings', 'text-domain')}
    <PremiumBadge />
</>}>
    ...
</PanelBody>
```

**Props:**
- `label` (String): The text inside the badge (Default: "Pro").
- `className` (String): Additional CSS classes for styling.

## Styling
The components use `style.scss` for layout and aesthetics, following the bPlugins design system (using `$primaryColor`, `$secondaryColor`, etc.).
