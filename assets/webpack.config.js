const path = require('path');
const glob = require('glob');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
var webpack = require("webpack");

var env = process.env.MIX_ENV || "dev"
const isDev = env === "dev"
const devtool = isDev ? "eval" : "source-map"
const mode = isDev ? 'development' : 'production'

module.exports = (env, options) => ({
  devtool: devtool,
  mode: mode,
  context: __dirname,

  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        uglifyOptions: {
          sourceMap: true,
          beautify: false,
          comments: false,
          extractComments: false,
          compress: {
            warnings: false,
            drop_console: true
          },
          ecma: 6,
          mangle: {
            except: ['$'],
            screw_ie8 : true,
            keep_fnames: true,
          }
        },
        sourceMap: true
      }),
      new OptimizeCSSAssetsPlugin({}),
    ]
  },
  entry: {
      './js/app.tsx': ['./js/app.tsx'].concat(glob.sync('./vendor/**/*.js'))
  },
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, '../priv/static/js')
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        test: /\.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
        // put fonts in assets/static/fonts/
        loader: 'file-loader?name=/fonts/[name].[ext]'
      }
    ]
  },
  plugins: isDev ?
  [
    new CopyWebpackPlugin([{
      from: "./static",
      to: path.resolve(__dirname, "../priv/static")
    }]),
    new MiniCssExtractPlugin({ filename: '../css/app.css' }),
  ] :
  [
    new MiniCssExtractPlugin({ filename: '../css/app.css' }),
    new CopyWebpackPlugin([{ from: 'static/', to: '../' }]),
  ],
  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
    modules: ["node_modules", __dirname]
  }
});