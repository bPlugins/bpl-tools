# Device Component

The `Device` component allows users to switch between device viewports (`desktop`, `tablet`, and `mobile`) in the block editor inspector controls. It connects automatically to Gutenberg's preview device state via `@wordpress/data` while also supporting controlled usage via props.

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `position` | `string` | `'horizontal'` | Layout mode: `'horizontal'` (all device buttons in a row) or `'vertical'` (active device shown only; clicking reveals other devices in a popup list below). |
| `className` | `string` | `''` | Optional extra class name added to the root element. |
| `style` | `object` | `{}` | Optional inline styles for the root wrapper. |
| `device` | `string` | Gutenberg device | The active device (`'desktop'`, `'tablet'`, `'mobile'`). When omitted, reads from `core/editor`. |
| `setDevice` | `function` | Gutenberg dispatcher | Dispatcher function to update the device in editor state. |
| `onChange` | `function` | `() => {}` | Callback invoked with the selected device name (`'desktop'`, `'tablet'`, `'mobile'`). |

## Usage Examples

### 1. Default (Horizontal row)
Displays all 3 devices side-by-side:
```jsx
import { Device, Label } from 'bpl-tools/Components';
import { Flex } from '@wordpress/components';

<Flex justify="flex-start">
    <Label>Padding</Label>
    <Device />
</Flex>
```

### 2. Vertical Dropdown
Displays only the currently active device. Clicking it opens a dropdown below with the other devices:
```jsx
import { Device, Label } from 'bpl-tools/Components';

<Label>
    Layout
    <Device position="vertical" />
</Label>
```
