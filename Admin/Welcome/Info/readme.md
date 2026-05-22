# Welcome/Info

Help cards row shown at the bottom of the Welcome page. Provides links to support, community, feature requests, and a plugin review.

Rendered automatically by `<Welcome>` — for free users it appears below the ProAds panel; for premium users it replaces ProAds. Use directly only when you need to embed it elsewhere.

## Import

```js
import { Info } from 'bpl-tools/Admin/Welcome';
// or
import Info from 'bpl-tools/Admin/Welcome/Info';
```

## Usage

```js
// Default cards (support, community, feature request, review):
<Info slug='my-plugin' pages={{ docs: 'https://...' }} />

// Custom cards:
<Info helpItems={[
    {
        title: 'Need Assistance?',
        description: 'Our support team is here to help.',
        link: 'https://bplugins.com/support',
        linkText: 'Contact Support'
    }
]} />
```

## Props

| Prop | Type | Required | Description |
|---|---|---|---|
| `slug` | string | yes (default cards) | WordPress.org slug — builds the "Leave a Review" URL |
| `pages` | object | — | `{docs?}` — reserved for future default card links |
| `helpItems` | HelpItem[] | — | Overrides all four default cards with your own |

### HelpItem object

| Field | Type | Required | Description |
|---|---|---|---|
| `title` | string | yes | Card heading |
| `titleIcon` | JSX | — | Icon displayed next to the title |
| `description` | string | yes | Card body text |
| `image` | string | — | Optional image URL shown above the title |
| `link` | string | yes | Card button URL |
| `linkText` | string | yes | Card button label |

## Default Cards

When `helpItems` is not provided, four cards are rendered:

1. **Need any Assistance?** → `https://bplugins.com/support`
2. **Join Our Community** → Facebook group
3. **Request a Feature** → `https://bplugins.com/support/`
4. **Loving This Plugin? ⭐** → `https://wordpress.org/support/plugin/{slug}/reviews/#new-post`
