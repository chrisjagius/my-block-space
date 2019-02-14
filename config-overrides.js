const path = require('path');
const { paths } = require('react-app-rewired');

module.exports = {
  webpack: function (config, env) {

    config.module.rules[1].oneOf[1].test= /\.(js|jsx|mjs)$/,
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

    config.module.rules[1].oneOf[1].loader= require.resolve('babel-loader')
    config.module.rules[1].oneOf[1].options= {
      compact: true
    }
    return config;
  },
  jest: function (config) {
    return config;
  },
  devServer: function (configFunction) {
    return function(proxy, allowedHost) {
      const config = configFunction(proxy, allowedHost);
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
