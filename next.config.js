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
    async redirects() {
        return [
            {
                source: '/trade',
                destination: '/trade/basic.html',
                permanent: true,
            },
            {
                source: '/account',
                destination: '/account/positions.html',
                permanent: true,
            },
            {
                source: '/insurance',
                destination: '/insurance/pools.html',
                permanent: true,
            },
        ];
    },

    exportPathMap: () => {
        return {
            '/': { page: '/' },
            '/trade': { page: '/trade' },
            // '/trade/basic': { page: '/trade/[interface]' },
            // '/trade/advanced': { page: '/trade/[interface]' },
            '/insurance': { page: '/insurance' },
            // '/insurance/pools': { page: '/insurance/[interface]' },
            // '/insurance/portfolio': { page: '/insurance/[interface]' },
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
        config.module.rules.push({
            test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
            use: {
                loader: 'url-loader',
                options: {
                    limit: 100000,
                },
            },
        });
        return config;
    },
});
