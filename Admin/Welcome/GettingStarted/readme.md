# Welcome/GettingStarted

Tabbed getting-started guide. Each tab holds an ordered list of steps, optionally with links. A "Read the Full Documentation" link is shown at the bottom.

Rendered automatically by `<Welcome>` when `gettingStarted.tabs` has entries. Use directly only when you need the panel standalone.

## Import

```js
import { GettingStarted } from 'bpl-tools/Admin/Welcome';
// or
import GettingStarted from 'bpl-tools/Admin/Welcome/GettingStarted';
```

## Usage

```js
<GettingStarted
	tabs={[...]}
	pages={{ docs: 'https://bplugins.com/docs/my-plugin/' }}
/>
```

## Props

| Prop | Type | Required | Description |
|---|---|---|---|
| `tabs` | Tab[] | yes | Array of tab objects (see below) |
| `pages` | object | — | `{docs?}` — docs URL for the bottom link. Falls back to `https://bplugins.com/docs/` |

### Tab object

| Field | Type | Required | Description |
|---|---|---|---|
| `key` | string | yes | Unique identifier (e.g. `'gutenberg'`) |
| `label` | string | yes | Tab button label |
| `icon` | JSX / string | — | Icon shown next to the label. Use `stroke='currentColor'` SVGs |
| `steps` | Step[] | yes | Ordered list of steps |

### Step object

| Field | Type | Required | Description |
|---|---|---|---|
| `num` | number | yes | Step number badge |
| `title` | string | yes | Step heading |
| `body` | string | yes | Step description. HTML is rendered via `dangerouslySetInnerHTML` — use `<strong>`, `<code>`, `<a>`, etc. |
| `link` | object | — | `{url, label}` — optional action link below the body |

## Example

```js
export const welcomeInfo = (adminUrl) => ({
	gettingStarted: {
		tabs: [
			{
				key: 'gutenberg',
				label: 'Gutenberg',
				icon: gutenbergTabIcon,
				steps: [
					{
						num: 1,
						title: 'Insert the Block',
						body: 'Click the <strong>+</strong> icon and search for your block.',
						link: { url: `${adminUrl}/post-new.php`, label: 'Open Editor' }
					},
					{
						num: 2,
						title: 'Configure',
						body: 'Use the sidebar to set options.'
					},
					{
						num: 3,
						title: 'Publish',
						body: 'Click Publish when done.'
					}
				]
			}
		]
	}
})
```
