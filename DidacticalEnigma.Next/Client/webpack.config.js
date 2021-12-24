const path = require('path');

console.log(__dirname);
let common_config = {
  node: {
    __dirname: true
  },
  mode: process.env.ENV || 'development',
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|ttf)$/i,
        loader: 'file-loader'
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.html$/i,
        loader: 'html-loader'
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: [
          /node_modules/
        ]
      }
    ]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  },
};

module.exports = [
  Object.assign({}, common_config, {
    target: 'web',
    entry: {
      main: './src/main/index.ts',
    },
    devtool: 'inline-source-map',
    output: {
      filename: '[name]-bundle.js',
      path: path.resolve(__dirname, '../wwwroot')
    },
  })
]
