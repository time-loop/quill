const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  let entry;
  entry = {
    'demo/main.js': path.resolve(__dirname, '../demo/js/main.js'),
  };

  return {
    entry,

    output: {
      filename: '[name]',
      path: path.resolve(__dirname, '../dist/'),
    },

    resolve: {
      alias: {
        assets: path.resolve(__dirname, '../assets'),
        dist: path.resolve(__dirname, '../dist'),
        root: path.resolve(__dirname, '../'),
      },
      extensions: ['.js', '.styl', '.html'],
    },

    module: {
      rules: [
        {
          test: /\.(jpg|jpeg|png)$/,
          include: [path.resolve(__dirname, '../src/assets/imgs')],
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 8192,
              },
            },
          ],
        },

        {
          test: /\.(html|svg)$/,
          use: [
            {
              loader: 'html-loader',
              options: {
                minimize: true,
              },
            },
          ],
        },

        {
          test: /\.styl$/,
          use: [
            // fallback to style-loader in development
            'style-loader',
            'css-loader',
            'stylus-loader',
          ],
        },

        {
          test: /\.js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  '@babel/env',
                  {
                    targets: {
                      browsers: [
                        'last 2 Chrome major versions',
                        'last 2 Firefox major versions',
                        'last 2 Safari major versions',
                        'last 2 Edge major versions',
                        'last 2 iOS major versions',
                        'last 2 ChromeAndroid major versions',
                      ],
                    },
                  },
                ],
              ],
            },
          },
        },
      ],
    },

    plugins: [
      new HtmlWebpackPlugin({
        title: 'table demo',
        template: './demo/demo.html',
        filename: 'demo/demo.html',
      }),

      new webpack.HotModuleReplacementPlugin({}),
    ],

    devtool: 'eval-source-map',

    devServer: {
      host: 'localhost',
      contentBase: path.join(__dirname, '../dist'),
      port: 8080,
      hot: false,
    },
  };
};
