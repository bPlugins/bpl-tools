# Demos

Live-demo browser with category filter chips, search, and an iframe/image preview modal with keyboard navigation.

## Import

```js
import Demos from 'bpl-tools/Admin/Demos';
```

## Usage

```js
import Demos from '../../../../bpl-tools/Admin/Demos';
import { demoInfo } from '../utils/data';

<Route path='demos' element={<Demos {...props} demoInfo={demoInfo} />} />
```

## Props

| Prop | Type | Required | Description |
|---|---|---|---|
| `name` | string | yes | Plugin name — shown in the page heading "See the {name} in action" |
| `isPremium` | boolean | — | Passed through, currently unused internally |
| `demoInfo` | object | yes | Demo configuration (see below) |

## `demoInfo` shape

```js
export const demoInfo = {
    allInOneLabel: 'See All Demos',    // optional: button label in the header
    allInOneLink:  'https://...',       // optional: link for the "all in one" button
    demos: [ /* Demo items */ ]
}
```

### Flat demo item (single card)

```js
{
    icon:     <svg>...</svg>,  // JSX element or raw SVG string
    title:    'Default Player',
    type:     'iframe',        // 'iframe' | 'image'
    url:      'https://my-plugin.com/demo/default/',
    category: 'Player'         // optional filter label (auto-generated from title if absent)
}
```

### Grouped demo item (expands into multiple cards)

```js
{
    icon:  <svg>...</svg>,
    title: 'Grid',
    children: [
        { title: 'Default',    type: 'iframe', url: 'https://...' },
        { title: 'Overlay',    type: 'iframe', url: 'https://...' },
    ]
}
```

## Features

- **Category filter chips** — auto-derived from `demo.title` of top-level items
- **Search** — filters by card title and parent category
- **Modal** — opens an iframe or scrollable image; prev/next navigation; keyboard `Escape` / `ArrowLeft` / `ArrowRight`
- **Accent colors** — each category gets a distinct accent color from a built-in palette
- **SVG icons** — `string` icons are rendered via `dangerouslySetInnerHTML`; JSX icons are rendered directly
