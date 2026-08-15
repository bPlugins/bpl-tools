# Badge

A simple customizable badge component for displaying small labels.

## Props

- `className` (String): Additional CSS classes. Default: `''`.
- `label` (String): The text content of the badge. Default: `'NEW'`.
- `icon` (Element): Optional icon element to display before the label. Default: `null`.
- `size` (String): The size variant (`'small'`, `'regular'`, `'medium'`). Default: `'small'`.
- `color` (String): The text color. Default: `'#ff7a00'`.
- `background` (String): The background color. Default: `'#ff7a0020'`.
- `borderColor` (String): The border color. Default: `'#ff7a0030'`.

## Usage

```jsx
import { Badge } from '../Components';

// Basic usage with default values
<Badge />

// Custom Badge
<Badge 
	label="PRO" 
	color="#fff" 
	background="#000" 
	borderColor="#333" 
/>
```
