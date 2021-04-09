const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const withAntdLess = require('next-plugin-antd-less');
const path = require('path');

module.exports = {
	typescript: {
    check: false,
    checkOptions: {},
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
    },
  },
  "stories": [
    "../components/**/*.stories.mdx",
    "../components/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials"
  ],
  webpackFinal: async (config) => {
    config.resolve.plugins.push(new TsconfigPathsPlugin({
      configFile: path.resolve(__dirname, '../tsconfig.json'),
    }));
    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      exclude: [
        path.resolve(__dirname, '../libs/**/*'),
      ],
      use: [
        {
          loader: 'babel-loader',
          options: {
            presets: ['next/babel'],
            plugins: ['react-docgen'],
          },
        }
      ],
    }, 
    {
      test: /\.less$/i,
      use: [{
          loader: "style-loader"
      }, {
        loader: 'css-loader',
      }, {
        loader: "less-loader", // compiles Less to CSS
        options: { javascriptEnabled : true }
      }]
    }
    );
    return config;
  },
}