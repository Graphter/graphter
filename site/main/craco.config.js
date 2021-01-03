// Official documentation available at: https://github.com/FormAPI/craco-antd

const path = require("path");

module.exports = {
  webpack: {
    alias: {
      'react': path.resolve('./node_modules/react'), // Required so that Webpack doesn't try and use react from linked package in development
      'recoil': path.resolve('./node_modules/@graphter/recoil-state-provider/node_modules/recoil'),
      '@graphter/renderer-react': path.resolve('./node_modules/@graphter/renderer-react/dist'),
      'safe-buffer': path.resolve('./node_modules/safe-buffer')
    }
  },
  plugins: [
    {
      plugin: require("craco-antd"),
      options: {
        customizeTheme: {
          "@primary-color": "#1DA57A"
        },
        lessLoaderOptions: {
          noIeCompat: true
        }
      }
    }
  ]
};