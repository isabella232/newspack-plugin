/**
 **** WARNING: No ES6 modules here. Not transpiled! ****
 */
/* eslint-disable import/no-nodejs-modules */

/**
 * External dependencies
 */
const fs = require( 'fs' );
const getBaseWebpackConfig = require( '@automattic/calypso-build/webpack.config.js' );
const path = require( 'path' );
const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );

const wizardsDir = path.join( __dirname, 'assets', 'src', 'wizards' );

// Get files for wizards scripts.
const wizardsScripts = fs
  .readdirSync( wizardsDir )
  .filter( wizard => fs.existsSync( path.join( __dirname, 'assets', 'src', 'wizards', wizard, 'index.js' ) ) );
const wizardsScriptFiles = {}
wizardsScripts.forEach( function( wizard ) {
	wizardsScriptFiles[ wizard ] = path.join( __dirname, 'assets', 'src', 'wizards', wizard, 'index.js' );
} );

const webpackConfig = getBaseWebpackConfig(
	{ WP: true },
	{
		entry: wizardsScriptFiles,
		module: {
			rules: [
				{
					test: /.scss$/,
					use: [
						MiniCssExtractPlugin.loader,
						'css-loader'
					]
				}
			]
		},
		'output-path': path.join( __dirname, 'assets', 'dist' ),
	}
);

module.exports = webpackConfig;