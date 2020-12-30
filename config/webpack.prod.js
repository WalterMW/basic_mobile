const webpack = require('webpack');
const path = require('path');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");
// const deploy = process.env.npm_lifecycle_event === 'build';
// console.log('process.env.npm_lifecycle_event', process.env.npm_lifecycle_event === 'build');

const prodConfig = {
  mode: 'production',
  output: {
    path: path.resolve(__dirname, '../lib'),
    filename: 'index.js',
    library: 'money_eye',
    libraryTarget: 'umd',
    libraryExport: 'default'
  },

  optimization: {
    // runtimeChunk: {
    //   name: entrypoint => `runtime~${entrypoint.name}`
    // },
    usedExports: true,
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        // include: /\.min\.js$/
        // sourceMap: true, // 如果在生产环境中使用 source-maps，必须设置为 true
        // terserOptions: {
        //   // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
        // }
      }),
      // css
      new CssMinimizerPlugin({
        parallel: true,
      }),
    ],
    // splitChunks: {
    //   chunks: 'all',
    //   minSize: 30000,
    //   minRemainingSize: 0,
    //   maxSize: 240000,
    //   minChunks: 2,
    //   maxAsyncRequests: 5, // 异步加载时同时发送的请求数量最大不能超过5，超过5的部分不拆分
    //   maxInitialRequests: 3, // 页面初始化时，同时发送的请求数量最大不能超过3，超过3的不跟不拆分
    //   automaticNameDelimiter: '~',
    //   // enforceSizeThreshold: 50000,
    //   name: false, // 拆分的chunk名，设置为true表示根据模块名和CacheGroup的key来自动生成，使用上面的连接符连接
    //   cacheGroups: {
    //     vendor: {
    //       test: /[\\/]node_modules[\\/]/,
    //       priority: -10,
    //       minChunks: 1,
    //     },
    //     common: {
    //       test: /\/(.*)\.js/,
    //       minChunks: 4,
    //       priority: -20,
    //       reuseExistingChunk: true
    //     },
    //     // antd 样式
    //     styles: {
    //       name: 'styles',
    //       test: /\.less$/,
    //       chunks: 'all',
    //       enforce: true,
    //     },
    //   }
    // }
  },

  plugins: [
    // new webpack.PrefetchPlugin([context], request),
    new webpack.DefinePlugin({
      __PRODUCTION__: true,
      __DEV__: false,
    }),
  ],
}


module.exports = prodConfig;