const path = require( 'path' )
const webpack = require( 'webpack' )
const UglifyJsPlugin = require( 'uglifyjs-webpack-plugin' )
const BundleAnalyzerPlugin = require( 'webpack-bundle-analyzer' ).BundleAnalyzerPlugin
const ChunkhashReplaceWebpackPlugin = require( 'chunkhash-replace-webpack-plugin' )

const pkg = require( './package.json' )

const isProduction = process.env.NODE_ENV === 'production'

module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve( __dirname, './dist' ),
    publicPath: '/',
    filename: isProduction ? '[name].[chunkhash].js' : '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpg|gif)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]',
        },
      },
      {
        test: /\.svg$/,
        loader: 'vue-svg-loader',
      },
      {
        test: /\.scss$/,
        use: [
          'vue-style-loader',
          {
            loader: 'css-loader',
            options: { importLoaders: 1 },
          },
          'sass-loader',
          'postcss-loader',
        ],
      },
      {
        test: /\.vue$/,
        loader: 'string-replace-loader',
        options: {
          search: '__MODULE_VERSIONS__',
          replace: `v${pkg.version}`,
          flags: 'g',
        },
      },
    ],
  },

  resolve: {
    alias: {
      vue$: 'vue/dist/vue.esm.js',
      'components': path.join( __dirname, 'src/components' ),
      'images': path.join( __dirname, 'src/images' ),
    },
    extensions: ['*', '.js', '.vue', '.json'],
  },

  devServer: {
    historyApiFallback: true,
    noInfo: true,
  },

  performance: {
    hints: false,
  },

  devtool: '#eval-source-map',
};

if ( isProduction ) {
  module.exports.devtool = '#source-map';
  // noinspection JSUnusedGlobalSymbols, JSUnresolvedFunction
  module.exports.plugins = (module.exports.plugins || []).concat( [

    new BundleAnalyzerPlugin( { analyzerMode: 'static' } ),

    new webpack.DefinePlugin( {
      'process.env': { NODE_ENV: '"production"' },
    } ),

    new webpack.optimize.CommonsChunkPlugin( {
      name: 'vendor',
      minChunks( m ) {
        return m.context && m.context.indexOf( 'node_modules' ) >= 0;
      },
    } ),

    new UglifyJsPlugin( { uglifyOptions: { ecma: 8 } } ),

    new webpack.LoaderOptionsPlugin( { minimize: true } ),

    new ChunkhashReplaceWebpackPlugin( {
      src: 'index.html',
      dest: 'dist/index.html',
    } ),

  ] );
}
