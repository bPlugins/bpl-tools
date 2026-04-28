# BControlPro

A higher-order wrapper component that adds "Pro" feature gating and UI indicators to any standard control component.

## Props

- `label` (String|Node, required): The label for the underlying control.
- `className` (String): Additional CSS classes.
- `onChange` (Function, required): The callback to fire when the control's value changes.
- `isPremium` (Boolean): Whether the user has unlocked the premium feature. Default: `false`.
- `Component` (Component, required): The underlying standard control component to render (e.g., `ToggleControl`, `TextControl`).
- `setIsProModalOpen` (Function): Callback to open the Pro upgrade modal when a locked feature is interacted with.
- `...restProps`: Any other props are passed directly to the underlying `Component`.

## Usage

```jsx
import { ToggleControl } from '@wordpress/components';
import { BControlPro } from '../ProControls';

// Usage inside block settings
<BControlPro
    label="Advanced Animation"
    isPremium={ isProActive }
    Component={ ToggleControl }
    checked={ attributes.advancedAnimation }
    onChange={ (val) => setAttributes({ advancedAnimation: val }) }
    setIsProModalOpen={ setIsProModalOpen }
/>
```
