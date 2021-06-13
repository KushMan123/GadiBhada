const path = require("path");
const webpack = require("webpack");

const { SourceMapDevToolPlugin } = require("webpack");

module.exports = {
	entry: "./src/index.js",
	output: {
		path: path.resolve(__dirname, "./static/frontend"),
		filename: "[name].js",
	},
	module: {
		rules: [
			{
				test: /\.js$|jsx/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
				},
			},
			{
				test: /\.js$/,
				enforce: "pre",
				use: ["source-map-loader"],
			},
			{
				test: /\.css$/i,
				use: ["style-loader", "css-loader"],
			},
			{
				test: /\.(jpe?g|png|gif|woff|woff2|eot|ttf|svg)(\?[a-z0-9=.]+)?$/,
				use: ["url-loader"],
			},
		],
	},
	optimization: {
		minimize: true,
	},
	plugins: [
		new SourceMapDevToolPlugin({
			filename: "[file].map",
		}),

		new webpack.DefinePlugin({
			"process.env": {
				// This has effect on the react lib size
				NODE_ENV: JSON.stringify("development"),
			},
		}),
	],
};
