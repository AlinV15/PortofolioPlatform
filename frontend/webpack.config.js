const Dotenv = require('dotenv-webpack');
const webpack = require('webpack');

module.exports = {
    plugins: [
        // Plugin pentru .env
        new Dotenv({
            path: './.env',
            safe: false,
            allowEmptyValues: true,
            systemvars: true,
            silent: false,
            defaults: false
        }),

        // Plugin pentru process.env manual (backup)
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
            'process.env.GOOGLE_MAPS_API_KEY': JSON.stringify(process.env.GOOGLE_MAPS_API_KEY || ''),
            'process.env.GOOGLE_MAPS_MAP_ID': JSON.stringify(process.env.GOOGLE_MAPS_MAP_ID || ''),
            'process.env.GOOGLE_MAPS_VERSION': JSON.stringify(process.env.GOOGLE_MAPS_VERSION || 'weekly'),
            'process.env.GOOGLE_MAPS_LIBRARIES': JSON.stringify(process.env.GOOGLE_MAPS_LIBRARIES || 'places,marker'),
            'process.env.DEBUG_MODE': JSON.stringify(process.env.DEBUG_MODE || 'false'),
            'process.env.APP_NAME': JSON.stringify(process.env.APP_NAME || 'Contact Map App'),
            'process.env.APP_VERSION': JSON.stringify(process.env.APP_VERSION || '1.0.0'),
            'process.env.API_BASE_URL': JSON.stringify(process.env.API_BASE_URL || 'http://localhost:4200')
        })
    ]
};