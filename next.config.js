const withAntdLess = require('next-plugin-antd-less');
const path = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = withAntdLess({
    cssModules: true,
    // // optional
    modifyVars: { '@primary-color': '#0000bd' },
    // // optional
    // lessVarsFilePath: './styles/antd-variables.less',
    // // optional https://github.com/webpack-contrib/css-loader#object
    // cssLoaderOptions: {},
    trailingSlash: true,

    exportPathMap: () => {
        return {
            '/': { page: '/' },
            // '/trade': { page: '/trade' },
            // '/trade/basic': { page: '/trade/[interface]' },
            // '/trade/advanced': { page: '/trade/[interface]' },
            '/insurance': { page: '/insurance' },
            '/portfolio': { page: '/portfolio' },
        };
    },
    less: {
        javascriptEnabled: true,
    },

    webpack(config, { isServer }, options) {
        // Fixes npm packages that depend on `fs` module
        if (!isServer) {
            config.node = {
                fs: 'empty',
                electron: 'empty',
            };
        }
        config.module.rules.push(
            {
                test: /\.(png|jpg|gif|eot|ttf|woff|woff2)$/,
                use: {
                    loader: 'url-loader',
                    options: {
                        limit: 100000,
                    },
                },
            },
            {
                test: /\.svg$/,
                use: ['@svgr/webpack'],
            },
        );
        return config;
    },
});
