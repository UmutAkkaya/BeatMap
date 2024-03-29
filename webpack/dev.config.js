const path = require('path');
const webpack = require('webpack');

module.exports = {
    devtool: 'cheap-module-eval-source-map',
    entry: [
        'webpack-hot-middleware/client',
        'babel-polyfill',
        path.join(__dirname, '../client/index'),
    ],
    output: {
        path: path.join(__dirname, '../public/'),
        filename: 'bundle.js',
        publicPath: '/',
    },
    module: {
        loaders: [
            {
                test: /\.css$/,
                loader:'style!css!'
            },
            {
                test: /.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['es2015', 'react']
                }
            },
            {test: /\.svg$/, loaders: ['raw-loader']},
            // take all less files, compile them, and bundle them in with our js bundle
            {test: /\.less$/, loader: 'style!css!autoprefixer?browsers=last 2 version!less'},
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015', 'react'],
                    plugins: [['react-transform', {
                        transforms: [{
                            transform: 'react-transform-hmr',
                            imports: ['react'],
                            // this is important for Webpack HMR:
                            locals: ['module']
                        }],
                    }]],
                },
            },
        ],
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('development'),
            },
        }),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
    ],
};
