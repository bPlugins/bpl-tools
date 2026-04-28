# BplBlockPreview

A component that renders a list of buttons that, when hovered over, display a live preview popover of a Gutenberg block's output. When clicked, it replaces the current block with the previewed block content.

## Props

- `blocks` (Array, required): Array of block objects to preview. Each object should have `{ label, value, content }`, where `content` is serialized Gutenberg block HTML.
- `clientId` (String, required): The client ID of the current block to be replaced upon selection.
- `value` (String, required): The value of the currently active block to highlight its corresponding button.
- `minHeight` (String): Minimum height for the preview area. Default: `''`.
- `minWidth` (String): Minimum width for the preview area. Default: `'200px'`.
- `viewportWidth` (Number): The simulated viewport width for the BlockPreview. Default: `1600`.
- `replaceBlock` (Function): Function injected via `withDispatch` to replace the block.

## Usage

```jsx
import { BplBlockPreview } from '../Components';

// Usage inside InspectorControls
<BplBlockPreview
    clientId={ clientId }
    value={ currentLayout }
    blocks={ [
        { label: 'Layout 1', value: 'layout-1', content: '<!-- wp:paragraph --><p>Layout 1</p><!-- /wp:paragraph -->' },
        { label: 'Layout 2', value: 'layout-2', content: '<!-- wp:paragraph --><p>Layout 2</p><!-- /wp:paragraph -->' }
    ] }
/>
```
