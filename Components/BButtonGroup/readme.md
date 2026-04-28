# BButtonGroup

A customizable button group component that supports animated sliding active states, custom styling, and responsive values.

## Props

- `className` (String): Additional CSS classes.
- `options` (Array): Array of button options `{ label, value }`.
- `label` (String): The label for the button group. Default: `'Button Group'`.
- `value` (String|Number): The currently active value.
- `onChange` (Function): Callback fired when an option is selected.
- `borderRadius` (String): Border radius of the group and buttons. Default: `'30px'`.
- `height` (String): Height of the buttons.
- `paddingX` (String): Horizontal padding for the buttons. Default: `'8px'`.
- `paddingY` (String): Vertical padding for the buttons. Default: `'4px'`.
- `fontSize` (String): Font size of the buttons. Default: `'12px'`.
- `fontWeight` (Number): Font weight of the buttons. Default: `400`.
- `activeBg` (String): Background color of the active button. Default: Primary color.
- `activeColor` (String): Text color of the active button. Default: `'#fff'`.
- `inactiveColor` (String): Text color of inactive buttons. Default: `'#000'`.
- `hoverBg` (String): Background color on hover.
- `hoverColor` (String): Text color on hover.
- `style` (Object): Additional inline styles for the wrapper.

## Usage

```jsx
import { BButtonGroup } from '../Components';

<BButtonGroup
    label="Alignment"
    options={[
        { label: 'Left', value: 'left' },
        { label: 'Center', value: 'center' },
        { label: 'Right', value: 'right' }
    ]}
    value={ attributes.align }
    onChange={ (val) => setAttributes({ align: val }) }
/>
```

## Attributes
"align":"center"
