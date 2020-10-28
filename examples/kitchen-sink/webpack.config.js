const path = require('path');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const DuplicatePackageCheckerPlugin = require('duplicate-package-checker-webpack-plugin');


module.exports = (_env, argv) => {
  const isProduction = argv.mode === "production";
  const isDevelopment = !isProduction;

  return {
    devtool: isDevelopment && 'cheap-module-source-map',
    entry: './src/index.js',
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          use: ["source-map-loader"],
          enforce: "pre"
        },
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              cacheCompression: false,
              envName: isProduction ? 'production' : 'development'
            }
          }
        },
        {
          test: /\.pcss$/,
          exclude: /node_modules/,
          use: [
            { loader: 'style-loader' },
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
                sourceMap: false,
                modules: {
                  localIdentName: '[path]__[name]__[local]--[hash:base64:5]'
                }
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: 'inline',
                config: {
                  path: path.resolve(__dirname, './config/postcss.config.js')
                }
              }
            }
          ]
        },
        {
          test: /\.(gif|png|jpe?g|svg)$/i,
          use: [{ loader: 'file-loader', options: { publicPath: '/' }}]
        },
        {
          test: /\.html$/,
          use: [
            {
              loader: 'html-loader'
            }
          ]
        },
        {
          test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                name: '[name].[ext]',
              }
            }
          ]
        }
      ]
    },
    resolve: {
      extensions: [ '*', '.js', '.jsx' ],
      alias: {
        'react': path.resolve('./node_modules/react'), // Required so that Webpack doesn't try and use react from linked package in development
        'recoil': path.resolve('./node_modules/@graphter/renderer-react/node_modules/recoil'),
        '@graphter/renderer-react': path.resolve('./node_modules/@graphter/renderer-react/dist'),
        'safe-buffer': path.resolve('./node_modules/safe-buffer')
      }
    },
    plugins: [
      new DuplicatePackageCheckerPlugin(),
      new HtmlWebPackPlugin({
        template: './src/index.html',
        filename: './index.html'
      })
    ],
    output: {
      path: path.resolve(__dirname, 'dist'),
      publicPath: '/',
      filename: 'bundle.js'
    },
    devServer: {
      contentBase: path.join(__dirname, 'dist'),
      compress: true,
      port: 9000,
      historyApiFallback: true
    }
  }
};