/**
 * Cleans the babel-makepot JS POT (written during `npm run build`) before the
 * plugin's i18n-pot script merges it into the main POT.
 *
 * Usage, from the plugin root:
 *   node ../bpl-tools/i18n/normalize-js-pot.js <text-domain> [bundle ...]
 *
 * 1. Keeps entries referenced from the plugin's src/ or from ../bpl-tools, whose
 *    strings get the plugin's text domain at build time (babel-plugin-text-domain).
 *    Anything else babel saw, such as node_modules, is dropped.
 * 2. Rewrites every reference to the given bundles, build/index.js by default, so
 *    `wp i18n make-json` files the strings under the editor script's handle.
 *    wp-cli cannot parse the editor bundle itself (the inlined Ace editor breaks
 *    its JS parser), so without this the editor strings would reach no JSON.
 *    Strings shared with other bundles keep the build/* references wp-cli finds
 *    on its own scan, so they land in every JSON that needs them.
 *
 * Runs in place on languages/<text-domain>-js.pot.
 */
const fs = require('fs');
const path = require('path');

const [domain, ...bundleArgs] = process.argv.slice(2);

if (!domain) {
	// eslint-disable-next-line no-console
	console.error('Usage: node ../bpl-tools/i18n/normalize-js-pot.js <text-domain> [bundle ...]');
	process.exit(1);
}

const bundles = bundleArgs.length ? bundleArgs : ['build/index.js'];
const potFile = `languages/${domain}-js.pot`;
const potPath = path.join(process.cwd(), potFile);

if (!fs.existsSync(potPath)) {
	// eslint-disable-next-line no-console
	console.error([
		`${potFile} not found.`,
		'',
		'The POT is a side effect of babel transpiling src/, so it is only written',
		'when babel-loader actually runs. A warm cache means every file is a cache',
		'hit, babel never runs, and no POT is produced - a partially warm cache is',
		'worse still, silently producing a POT with only the changed files\' strings.',
		'',
		'Run a cold build:  npm run clean:cache && npm run build'
	].join('\n'));
	process.exit(1);
}

const isKeptReference = ref => ref.startsWith('src/') || ref.startsWith('../bpl-tools/');

const chunks = fs.readFileSync(potPath, 'utf8').split('\n\n');
const header = chunks.shift();

const entries = chunks
	.map(entry => entry.trim())
	.filter(Boolean)
	.filter(entry => entry.split('\n').some(line => line.startsWith('#: ') && line.slice(3).split(' ').some(isKeptReference)))
	.map(entry => {
		const lines = entry.split('\n').filter(line => !line.startsWith('#: '));
		return [...bundles.map(bundle => `#: ${bundle}:1`), ...lines].join('\n');
	});

fs.writeFileSync(potPath, [header, ...entries].join('\n\n') + '\n');
// eslint-disable-next-line no-console
console.log(`Normalized JS POT: kept ${entries.length} strings, references point to ${bundles.join(', ')}.`);
