
const path = require('path');
const webpack = require('webpack');
const devConfig = {
  target: 'web',
  mode: 'development',

  devtool: "eval-cheap-module-source-map",

  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].[contenthash].js',
    chunkFilename: '[name].[contenthash].js',
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin({}),
    new webpack.DefinePlugin({
      __PRODUCTION__: false,
      __DEV__: true,
    }),
  ],

  optimization: {
    runtimeChunk: {
      name: entrypoint => `runtime~${entrypoint.name}`
    }
  },
  devServer: {
    contentBase: path.join(__dirname, '../dist'),
    compress: true,
    port: 9000,
    hot: true,
    // 配置react-router-dom的BrowserRouter时，需要此配置项，否则找不到文件，使用HashRouter时不用
    historyApiFallback: true
    // watch:true,
    // hotOnly: true,
    // open: true,
  },

  // cache: false,

}

module.exports = devConfig;