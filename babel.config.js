module.exports = (api) => {
  api && api.cache(true);
  const presets = [
    '@babel/react',
  ];
  const plugins = [
    ["import", {
      "libraryName": "antd-mobile",
      "libraryDirectory": "es",
      "style": true
    }],
    [
      "@babel/plugin-transform-runtime",
      {
        "corejs": 3,
        "absoluteRuntime": false,
        "helpers": true,
        "regenerator": true,
        "useESModules": false,
      }
    ],
    ["@babel/plugin-proposal-class-properties", { "loose": true }],
    "react-hot-loader/babel",
    "@babel/plugin-syntax-dynamic-import",
  ];

  return {
    presets,
    plugins,
  };
}
