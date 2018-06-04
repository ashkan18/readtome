var webpack = require("webpack");
var path = require("path");

// We'll be using the ExtractTextPlugin to extract any required CSS into a
// // single CSS file
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
// // We'll use CopyWebpackPlugin to copy over static assets like images and
// fonts
const CopyWebpackPlugin = require("copy-webpack-plugin")

var env = process.env.MIX_ENV || "dev"
const isDev = env === "dev"
const devtool = isDev ? "eval" : "source-map"

const config = {
  devtool: devtool,

  context: __dirname,

  entry: {
    app: [
      "./css/app.scss",
      "./js/app.js"
    ]
  },

  output: {
    path: path.resolve(__dirname, "../priv/static"),
    filename: "js/[name].js",
    publicPath: 'http://localhost:8080/'
  },

  devServer: {
    headers: {
      "Access-Control-Allow-Origin": "*",
    }
  },

  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
    modules: ["node_modules", __dirname]
  },


  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: ["babel-loader", "ts-loader"]
      }, 
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: "babel-loader"
      }, 
      {
        test: /\.s?[ac]ss$/,
        use: [
          isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
        ],
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
      }])
    ] :

    [
      new CopyWebpackPlugin([{
        from: "./static",
        to: path.resolve(__dirname, "../priv/static")
      }]),

      new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: "[name].css",
        chunkFilename: "[id].css"
      }),

      new webpack.optimize.UglifyJsPlugin({ 
        sourceMap: true,
        beautify: false,
        comments: false,
        extractComments: false,
        compress: {
          warnings: false,
          drop_console: true
        },
        mangle: {
          except: ['$'],
          screw_ie8 : true,
          keep_fnames: true,
        }
      })
    ]
};
module.exports = config;