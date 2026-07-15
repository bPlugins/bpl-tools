# Welcome/Changelog

Renders the plugin release notes from an array of changelog entries. Supports a configurable display limit with a "Read more" link to the WordPress.org changelog.

Rendered automatically by `<Welcome>`. Use directly only if you need changelogs in isolation.

## Import

```js
import { Changelog } from 'bpl-tools/Admin/Welcome';
// or
import Changelog from 'bpl-tools/Admin/Welcome/Changelog';
```

## Usage

```js
<Changelog
	slug='my-plugin'
	changelogs={changelogs}
	limit={2}
	loadMoreLabel='View More Changelogs'
/>
```

## Props

| Prop | Type | Required | Description |
|---|---|---|---|
| `slug` | string | yes | WordPress.org plugin slug — used to build the `#developers` read-more link |
| `changelogs` | ChangelogEntry[] | yes | Array of changelog entries (see below) |
| `limit` | number | — | How many entries to display initially. Default `5`. Pass via `changelogsLimit` through `<Welcome>` |
| `loadMoreLabel` | string | — | Label for the "read more" button. Omit to hide the button. Pass via `changelogsReadMoreLabel` through `<Welcome>` |

### ChangelogEntry object

| Field | Type | Required | Description |
|---|---|---|---|
| `version` | string | yes | Version and date string, e.g. `'1.3.0 - 17 May 2026'` |
| `type` | `'new'` \| `'update'` \| `'fix'` | yes | Sets the colour-coded badge class on the entry |
| `list` | string[] | yes | Bullet list of changes |

## Example

```js
export const welcomeInfo = (adminUrl) => ({
	changelogs: [
		{
			version: '1.3.0 - 17 May 2026',
			type: 'update',
			list: [
				'Update: Freemius SDK to v2.13.1',
				'Fix: Minor bug fixes'
			]
		},
		{
			version: '1.2.0 - 01 Feb 2026',
			type: 'new',
			list: [
				'New: Added interactivity support'
			]
		}
	],
	changelogsLimit: 2,
	changelogsReadMoreLabel: 'View More Changelogs',
})
```
