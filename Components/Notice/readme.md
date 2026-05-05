# Notice

A customizable notice component used to display alerts, warnings, and informational messages.

## Props

- `className` (String): Additional CSS classes. Default: `'mt10'`.
- `status` (String): The status/type of the notice (`'info'`, `'success'`, `'warning'`, `'danger'`). Default: `'info'`.
- `isIcon` (Boolean): Whether to display the corresponding status icon. Default: `false`.
- `children` (Node): The content to be displayed inside the notice.

## Usage

```jsx
import { Notice } from '../Components';

// Info Notice with icon
<Notice status="info" isIcon={true}>
	This is an informational message.
</Notice>

// Danger Notice
<Notice status="danger" isIcon={true}>
	An error occurred while saving.
</Notice>
```
