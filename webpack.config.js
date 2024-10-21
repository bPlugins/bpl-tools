const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = {
	...defaultConfig,
	entry: {},
	plugins: [
		...defaultConfig.plugins,
		new ESLintPlugin()
	],
	optimization: {}
};