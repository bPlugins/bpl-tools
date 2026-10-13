# i18n

Build tooling that makes a plugin's JS strings translatable, bpl-tools' own strings included.

Two problems are solved here:

1. **`wp i18n make-pot` cannot read `build/index.js`.** The Ace editor inlined by `CustomCodeEditor` breaks wp-cli's JS parser, which then skips the file without an error. So editor strings never reached the POT. Instead, strings are extracted from source by `@wordpress/babel-plugin-makepot` while the plugin builds.
2. **bpl-tools strings had no text domain.** Its `__()` calls were looked up in WordPress core's domain, where the plugin's translations never apply. `babel-plugin-text-domain` gives them the plugin's domain as the plugin builds.

## Table of contents

1. [Setup](#setup)
2. [Files](#files)
3. [Gotchas](#gotchas)

<br />

## Setup

`babel.config.js` in the plugin root (the domain plugin must come before makepot):

```js
module.exports = {
	presets: ['@wordpress/babel-preset-default'],
	plugins: [
		['../bpl-tools/i18n/babel-plugin-text-domain', { domain: 'my-plugin' }],
		['@wordpress/babel-plugin-makepot', { output: 'languages/my-plugin-js.pot' }]
	]
};
```

`package.json` scripts:

```json
"clean:cache": "rm -rf node_modules/.cache/babel-loader languages/my-plugin-js.pot",
"i18n-pot": "node ../bpl-tools/i18n/normalize-js-pot.js my-plugin && wp i18n make-pot . languages/my-plugin.pot --exclude=\"src\" --merge=languages/my-plugin-js.pot && cp ./languages/my-plugin.pot ./languages/my-plugin-en_US.po",
"bundle": "gulp clean && npm run clean:cache && npm run lint && npm run build && npm run i18n && ..."
```

In the plugin's `init` callback, after `register_block_type()`:

```php
// Core registers block.json scripts without a path, so local JSONs need this explicitly
wp_set_script_translations( 'prefix-block-editor-script', 'my-plugin', MY_DIR_PATH . 'languages' );
wp_set_script_translations( 'prefix-block-view-script', 'my-plugin', MY_DIR_PATH . 'languages' );
```

Release order: `npm run clean:cache && npm run build && npm run i18n`.

<br />

## Files

| File | Purpose |
| --- | --- |
| `babel-plugin-text-domain.js` | Adds `{ domain }` to `__()`, `_x()`, `_n()` and `_nx()` calls in files under `bpl-tools/` that have no domain, and replaces the placeholders `text-domain`, `textdomain` and `my-plugin`. A plugin's own `src/` is left alone. |
| `normalize-js-pot.js` | `node ../bpl-tools/i18n/normalize-js-pot.js <domain> [bundle ...]`. Keeps the JS POT entries that come from `src/` or `../bpl-tools/`, then points every reference at the editor bundle (`build/index.js` by default) so `wp i18n make-json` files them under the editor script. |

<br />

## Gotchas

- **Always build cold before `npm run i18n`.** The JS POT is only written while babel actually runs. With a warm babel cache, some or all files are skipped, and the POT is missing their strings without any error. The `node_modules` folder, and with it the babel cache, is shared by every plugin through the `plugin-slug` symlink.
- **No template literals in `__()`.** makepot skips a string it can't read, so write `sprintf( __( 'Upload %s' ), type )` instead.
- **The text domain must match the language file names.** `languages/<domain>.pot`, `<domain>-<locale>.po/.mo` and the generated `<domain>-<locale>-<md5>.json` files are all looked up by domain, so a file named after anything else (an old slug, say) is never loaded.
