const path = require('path');
const { paths } = require('react-app-rewired');

const CopyWebpackPlugin = require('copy-webpack-plugin');
const ManifestAssetPlugin = new CopyWebpackPlugin([{ from: 'src/assets/manifest.json', to: 'manifest.json' }]);
// const IconAssetPlugin = new CopyWebpackPlugin([{ from: 'src/images/icon-192x192.png', to: 'icon-192x192.png' }]);
const UglifyEsPlugin = require('uglify-es-webpack-plugin');
const UglifyEsPluginConfig = new UglifyEsPlugin({
  mangle: {
    reserved: [
      'Buffer',
      'BigInteger',
      'Point',
      'ECPubKey',
      'ECKey',
      'sha512_asm',
      'asm',
      'ECPair',
      'HDNode'
    ]
  }
})

const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: './src/index.html',
  filename: 'index.html',
  inject: 'body'
});

module.exports = {
  webpack: function (config, env) {
    if (env === 'production') {
      if (!config.plugins) {
        // It should already exist, but initialize it if it does not already exist.
        config.plugins = [
          HtmlWebpackPluginConfig,
          ManifestAssetPlugin,
          IconAssetPlugin,
          UglifyEsPluginConfig
        ];
      }
      
      config.module.rules[1].oneOf[1].include = [
        paths.appSrc,
        path.resolve(paths.appNodeModules, 'bitcoinjs-lib'),
        path.resolve(paths.appNodeModules, 'tiny-secp256k1'),
        path.resolve(paths.appNodeModules, 'jsontokens'),
        path.resolve(paths.appNodeModules, 'bip32'),
        path.resolve(paths.appNodeModules, 'base64url'),
        path.resolve(paths.appNodeModules, 'typeforce'),
        path.resolve(paths.appNodeModules, 'key-encoder'),
        path.resolve(paths.appNodeModules, 'base-x'),
        path.resolve(paths.appNodeModules, 'uri-js')
      ];
    }
    return config;
  },
  jest: function (config) {
    return config;
  },
  // configFunction is the original react-scripts function that creates the
  // Webpack Dev Server config based on the settings for proxy/allowedHost.
  // react-scripts injects this into your function (so you can use it to
  // create the standard config to start from), and needs to receive back a
  // function that takes the same arguments as the original react-scripts
  // function so that it can be used as a replacement for the original one.
  devServer: function (configFunction) {
    return function(proxy, allowedHost) {
      const config = configFunction(proxy, allowedHost);
      // Edit config here - example: set your own certificates.
      //
      // const fs = require('fs');
      // config.https = {
      //   key: fs.readFileSync(process.env.REACT_HTTPS_KEY, 'utf8'),
      //   cert: fs.readFileSync(process.env.REACT_HTTPS_CERT, 'utf8'),
      //   ca: fs.readFileSync(process.env.REACT_HTTPS_CA, 'utf8'),
      //   passphrase: process.env.REACT_HTTPS_PASS
      // };
      config.historyApiFallback = {
        disableDotRule: true
      },
			config.headers = {
				"Access-Control-Allow-Origin": "*",
				"Access-Control-Allow-Methods": "GET,PUT,POST,DELETE",
        "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
			}

      return config;
    };
  }
}
