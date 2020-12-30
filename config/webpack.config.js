const webpack = require('webpack');
const path = require('path');
const WebpackBar = require('webpackbar');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { merge } = require('webpack-merge');

const devConfig = require('./webpack.dev');
const prodConfig = require('./webpack.prod');
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

// 通过npm运行命令判断是否为正式环境打包
const production = process.env.npm_lifecycle_event === 'build';

const pluginsArray = production ? [
  new MiniCssExtractPlugin({
    filename: 'index.min.css',
    chunkFilename: 'index.chunk.css',
  }),

  // new HardSourceWebpackPlugin(), // <- 直接加入这行代码就行
  // new HtmlWebpackPlugin({
  //   inject: 'body',
  //   title: '钱眼',
  //   template: path.resolve(__dirname, '../public/index.html'),
  //   scriptLoading: 'defer',
  // }),

] : [
    new HtmlWebpackPlugin({
      inject: 'body',
      title: '钱眼',
      template: path.resolve(__dirname, '../public/index.html'),
      scriptLoading: 'defer',
    }),
  ];

const commonConfig = {
  // 入口文件
  entry: production
    ? path.resolve(__dirname, '../src/dist.js')
    : path.resolve(__dirname, '../src/index.js'),

  resolve: {
    modules: ['node_modules'],
    extensions: [
      '.json', '.js', '.jsx',
    ],
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: path.resolve(__dirname, '../src'),
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: production ? MiniCssExtractPlugin.loader : 'style-loader', // 将 JS 字符串生成为 style 节点
          },
          {
            loader: "css-loader", // 将 CSS 转化成 CommonJS 模块
            options: {
              importLoaders: 2,
              modules: true,
            }
          },
          "sass-loader",
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                config: path.resolve(__dirname, 'postcss.config.js'),
              },
            }
          }
        ]
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: production ? MiniCssExtractPlugin.loader : 'style-loader', // 将 JS 字符串生成为 style 节点
          },
          {
            loader: "css-loader", // 将 CSS 转化成 CommonJS 模块
            options: {
              importLoaders: 1,
              // modules: true,
            }
          },
          {
            loader: 'less-loader', // compiles Less to CSS
            options: {
              lessOptions: { // 如果使用less-loader@5，请移除 lessOptions 这一级直接配置选项。
                // antd自定义主题样式
                modifyVars: {
                  'primary-color': '#1DA57A',
                  'link-color': '#313131',
                  'link-hover-color': 'rgb(189, 84, 84)',
                  'border-radius-base': '2px',
                },
                javascriptEnabled: true,
              },
            },
          },
        ]
      },
      {
        test: /\.css$/,
        use: [
          production ? {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: './',
            },
          } : 'style-loader', // 将 JS 字符串生成为 style 节点
          {
            loader: "css-loader", // 将 CSS 转化成 CommonJS 模块
            options: {
              importLoaders: 2,
            }
          },
          "sass-loader",
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                config: path.resolve(__dirname, 'postcss.config.js'),
              },
            }
          }
        ]
      },
      {
        test: /\.(png|jpe?g|gif|ico)$/i,
        include: path.resolve(__dirname, '../src'),
        use: [
          {
            loader: 'url-loader',
            options: {
              // 设置打包后相对与html的图片路径
              publicPath: './',
              limit: 8192,
              esModule: false,
              name: '[contenthash].[ext]',
              // 实现图片压缩
              // fallback: require.resolve('responsive-loader'),
              // quality: 65,
            }
          }, {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                // progressive: true,
                // quality:100,
                revert: true,
              },
              // optipng.enabled: false will disable optipng
              optipng: {
                enabled: false,
              },
              pngquant: {
                quality: [0.65, 0.90],
                speed: 4
              },
              gifsicle: {
                interlaced: false,
              },
              // the webp option will enable WEBP
              webp: {
                quality: 75,
                // lossless: true,
              }
            }
          },
        ]
      },
      {
        test: /\.svg$/i,
        use: [
          {
            loader: path.resolve(__dirname, '../src/loaders/dist/cjs.js'),
            options: {
              publicPath: './',
              name: '[contenthash].[ext]',
              limit: 8192,
              esModule: false,
              svgToPngLimit: 102400,
            }
          },
          path.resolve(__dirname, '../src/loaders/svgLoader.js'),
        ],
      },
      {
        test: /\.(ttf|eot|woff|woff2)/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[hash].[ext]'
            }
          },
        ],
      },
    ]
  },

  plugins: [
    new webpack.ProgressPlugin(),
    // 添加 进度条
    new WebpackBar(),
    // new BundleAnalyzerPlugin(),
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /zh-cn/), //减少moment打包体积
    ...pluginsArray,
    new CleanWebpackPlugin(),
  ],
}

module.exports = (env) => {
  if (env && env.production) {
    return merge(commonConfig, prodConfig);
  } else {
    return merge(commonConfig, devConfig);
  }
}
