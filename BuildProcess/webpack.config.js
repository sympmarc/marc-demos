var path = require('path');

var settings = require("./settings.json");
var settingsSecurity = require("./settings_security.json");

module.exports = {
	entry: settings.webpackParams.entries,
	output: {
		path: settingsSecurity.rootFolder + "/build",
		filename: "[name].js",
		publicPath: '/'
	},
	devtool: 'source-map',
	module: {
		rules: [
			{
				test: /\.ts$/,
				loader: 'ts-loader',
				exclude: /node_modules/
			},
			{
				test: /\.css$/,
				exclude: /node_modules/,
				loader: ["style-loader", "css-loader"]
			},
			{
				test: /\.scss$/,
				exclude: /node_modules/,
				loader: ["style-loader", "css-loader", "sass-loader"]
			},
			{
				test: /\.html$/,
				exclude: /node_modules/,
				loader: "html-loader"
			}
		]
	},
	externals: settings.webpackParams.externals,
	resolve: {
		extensions: ['.js'],
		alias: {}
	},
	watch: true
};