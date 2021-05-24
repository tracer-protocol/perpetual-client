// .babelrc.js
module.exports = {
    presets: [['next/babel']],
    plugins: [
        ['import', { libraryName: 'antd', style: true }],
        [
            'styled-components',
            {
                ssr: true,
                displayName: true,
                preprocess: false,
            },
        ],
    ],
};
