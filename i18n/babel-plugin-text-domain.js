/**
 * Gives bpl-tools' translatable strings the text domain of the plugin being built.
 *
 * bpl-tools is compiled into every plugin's bundles, so its __() calls carry no
 * text domain of their own. Without one they are looked up in WordPress core's
 * domain at runtime, where the plugin's translations never apply. This adds the
 * plugin's domain, or swaps a placeholder one, in files under bpl-tools only.
 * A plugin's own src/ is left alone, it names its domain explicitly.
 *
 * Usage, in the plugin's babel.config.js (listed before makepot):
 *   ['../bpl-tools/i18n/babel-plugin-text-domain', { domain: 'my-plugin' }]
 */
const { sep } = require('path');

// Argument position of the domain for each gettext function
const DOMAIN_POSITION = { __: 1, _x: 2, _n: 3, _nx: 4 };

// Domains used in bpl-tools examples, never meant to ship
const PLACEHOLDERS = ['text-domain', 'textdomain', 'my-plugin'];

module.exports = ({ types: t }) => ({
	name: 'bpl-text-domain',
	visitor: {
		CallExpression(path, state) {
			const { domain } = state.opts;
			const filename = (state.filename || '').split(sep).join('/');

			if (!domain || !filename.includes('/bpl-tools/') || filename.includes('/node_modules/')) {
				return;
			}

			const { callee, arguments: args } = path.node;
			const name = 'MemberExpression' === callee.type ? callee.property.name : callee.name;
			const position = DOMAIN_POSITION[name];

			if (undefined === position) {
				return;
			}

			if (args.length === position) {
				args.push(t.stringLiteral(domain));
			} else if (t.isStringLiteral(args[position]) && PLACEHOLDERS.includes(args[position].value)) {
				args[position] = t.stringLiteral(domain);
			}
		}
	}
});
