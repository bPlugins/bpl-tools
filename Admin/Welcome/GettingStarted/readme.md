# Welcome/GettingStarted

Tabbed getting-started guide. Each tab holds an ordered list of steps, optionally with links. A "Read the Full Documentation" link is shown at the bottom.

A tab can also carry its own walkthrough video. When the active tab has `video`, a **Watch Video** button slides in next to the docs link; switching tabs replays the slide-in for the next video tab and hides the button on tabs without one. Clicking it opens the video in the shared `.bPlVideoModal` popup, rendered with the shared [`VideoPlayer`](../Overview/VideoPlayer.js) component — the same modal + player Overview uses.

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
| `video` | string | — | Walkthrough video URL for this tab. Adds the "Watch Video" button + modal |
| `isYoutube` | boolean | — | Set when `video` is a YouTube URL — renders an embed iframe instead of a `<video>` |
| `videoLabel` | string | — | Overrides the button label / modal title (default `Watch Video`) |
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
				video: 'https://youtu.be/xxxxxxxxxxx',
				isYoutube: true,
				videoLabel: 'Watch Gutenberg Guide',
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
