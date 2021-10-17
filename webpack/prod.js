const {merge} = require('webpack-merge');
const base = require('./base');
const TerserPlugin = require('terser-webpack-plugin');
const path = require('path');

module.exports = merge(base, {
	mode: 'production',
	output: {
		filename: '[name].[contenthash].js',
		path: path.join(__dirname, '../dist'),
		publicPath: '/asteroid-flier/',
	},
	devtool: false,
	performance: {
		maxEntrypointSize: 900000,
		maxAssetSize: 900000,
	},
	optimization: {
		minimizer: [
			new TerserPlugin({
				terserOptions: {
					output: {
						comments: false,
					},
				},
			}),
		],
	},
});
