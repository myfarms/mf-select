/* eslint-disable */
const path = require('path');

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  entry: path.resolve(__dirname, 'index.ts'),
  output: {
    filename: 'bundle.js',
    path: __dirname,
  },
  resolve: {
    extensions: ['.ts', '.mjs', '.js'],
    // Prefer Angular's ES module bundles over UMD/CommonJS
    mainFields: ['esm2015', 'module', 'main'],
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        options: {
          transpileOnly: true,
          configFile: path.resolve(__dirname, 'tsconfig.json'),
        },
        exclude: /node_modules/,
      },
      // Angular 13 ships .mjs ESM files; allow importing them without strict fully-specified paths
      {
        test: /\.mjs$/,
        resolve: { fullySpecified: false },
      },
    ],
  },
};
