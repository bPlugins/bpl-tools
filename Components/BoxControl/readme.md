# BoxControl

A 4-way unit control component (top, right, bottom, left) typically used for padding or margin settings. Includes a link toggle to lock dimensions together and a reset button.

## Props

- `label` (String): The text label for the control.
- `values` (Object): The measurements object `{ top, right, bottom, left }`. Default: `{}`.
- `onChange` (Function): Callback fired when any value changes.
- `resetValues` (Object): The default values to revert to when the reset button is clicked.
- `units` (Array): Array of allowed units. Default: `px, %, em, rem, vw, vh`.
- `sides` (Array): Specific sides to display. Example: `['horizontal', 'vertical']`. Default displays all 4 sides.
- `style` (Object): Custom inline styles for the wrapper.
- `className` (String): Additional CSS classes.
- `disableUnits` (Boolean): Disable the unit selection dropdown. Default: `false`.

## Usage

```jsx
import { BoxControl } from '../Components';

<BoxControl
    label="Padding"
    values={ attributes.padding }
    onChange={ (val) => setAttributes({ padding: val }) }
    resetValues={ { top: '0px', right: '0px', bottom: '0px', left: '0px' } }
/>
```

## Attributes
"padding":{
    "top":"10px",
    "right":"10px",
    "bottom":"10px",
    "left":"10px"
}
