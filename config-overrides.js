const { override, addBabelPlugin } = require('customize-cra')
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

const addMonacoPlugin = (config, env) => {
    config.plugins.push(new MonacoWebpackPlugin({
        languages: ['json']
    }));
    return config;
}
module.exports = override(
    addBabelPlugin(
        ['babel-plugin-styled-components', {
            displayName: true,
            // any extra config from babel-plugin-styled-components
        }]
    ),
    addMonacoPlugin
)