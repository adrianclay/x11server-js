const path = require('path');

module.exports = {
    entry: './client/Init.ts',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'public'),
    },
    resolve: {
      extensions: ['.ts']
    },
    module: {
        rules: [{
            test: /\.m?ts$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env']
                }
            }
        }]
    }
};
