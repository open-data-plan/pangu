const path = require('path')
const fs = require('fs')
const webpack = require('webpack')
const MiniCSSExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin')
// const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')
const WebpackBar = require('webpackbar')
const ModuleNotFoundPlugin = require('react-dev-utils/ModuleNotFoundPlugin')
const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin')
// const typescriptFormatter = require('react-dev-utils/typescriptFormatter')
const WorkboxWebpackPlugin = require('workbox-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const { argv } = require('yargs')
const postcssConfig = require('../postcss.config')
const {
  srcDir,
  workDir,
  outputDir,
  publicDir,
  publicPath,
} = require('../../utils/paths')
const app = require('../../utils/app')
const theme = require('../../utils/theme')
const globalsConfig = require('../globals.config')

const PRODUCT = process.env.NODE_ENV === 'production'
const DEV = process.env.NODE_ENV === 'development'

// generate css loader for specific lang
function getCSSLoader(lang, modules) {
  let loaders = []
  if (DEV) {
    loaders = [
      {
        loader: 'style-loader',
      },
    ]
  } else {
    loaders = [MiniCSSExtractPlugin.loader]
  }
  loaders.push('@opd/css-modules-typings-loader')
  loaders = [
    ...loaders,
    {
      loader: 'css-loader',
      options: {
        importLoaders: lang === 'css' ? 1 : 2,
        sourceMap: true,
        modules: {
          localIdentName: DEV ? '[path][name]__[local]' : '[hash:base64]',
          exportLocalsConvention: 'camelCaseOnly',
          auto: true,
        },
      },
    },
    {
      loader: 'postcss-loader',
      options: postcssConfig,
    },
  ]
  if (lang === 'less') {
    loaders.push({
      loader: 'less-loader',
      options: {
        sourceMap: true,
        lessOptions: {
          javascriptEnabled: true,
          modifyVars: theme || {},
        },
      },
    })
  }
  return loaders
}

const config = {
  mode: PRODUCT ? 'production' : 'development',
  entry: {
    app: PRODUCT
      ? [path.resolve(srcDir, 'index.tsx')]
      : [
          require.resolve('react-dev-utils/webpackHotDevClient'), // for HMR
          path.resolve(srcDir, 'index.tsx'),
        ],
  },
  output: {
    publicPath,
    path: outputDir,
    filename: PRODUCT ? '[name].[contenthash].js' : '[name].js',
    chunkFilename: PRODUCT ? '[id].[contenthash].js' : '[id].js',
  },
  resolve: {
    modules: ['node_modules'],
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json', '.css', '.less'],
    mainFields: ['module', 'main'],
    alias: {
      '@': srcDir,
    },
  },
  devtool: DEV ? 'cheap-module-eval-source-map' : 'source-map',
  module: {
    rules: [
      {
        test: /\.(j|t)sx?$/,
        include: [srcDir],
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
            },
          },
        ],
      },
      {
        test: /.css$/,
        use: getCSSLoader('css'),
      },
      {
        test: /.less$/,
        use: getCSSLoader('less'),
      },
      {
        test: /\.(eot|ttf|woff|woff2)$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: '[name].[hash:8].[ext]',
        },
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: '[name].[hash:8].[ext]',
        },
      },
    ],
  },
  plugins: [
    new WebpackBar({
      name: 'Pangu',
      minimal: true,
      compiledIn: true,
    }),
    new webpack.WatchIgnorePlugin([/(css|less)\.d\.ts$/]),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new webpack.DefinePlugin(globalsConfig),
    new ModuleNotFoundPlugin(),
    new webpack.LoaderOptionsPlugin({
      debug: true,
      options: {
        context: __dirname,
      },
    }),
    // new FriendlyErrorsPlugin(),
  ],
  optimization: {
    minimize: PRODUCT,
    minimizer: [
      new TerserWebpackPlugin({
        cache: true,
        parallel: true,
        sourceMap: true, // set to true if you want JS source maps
      }),
      new OptimizeCSSAssetsPlugin({
        cssProcessorOptions: {
          map: {
            inline: false,
          },
        },
      }),
    ],
    splitChunks: {
      chunks: 'all',
    },
    runtimeChunk: true,
  },
}

if (argv.tsCheck) {
  config.plugins.push(
    new ForkTsCheckerWebpackPlugin({
      eslint: {
        enabled: true,
      },
      issue: {
        scope: 'all',
      },
    })
  )
}

if (app.logo && fs.existsSync(path.resolve(workDir, app.logo))) {
  config.plugins.push(
    new FaviconsWebpackPlugin({
      logo: path.resolve(workDir, app.logo),
      cache: true,
      prefix: 'icons',
      inject: true,
      favicons: {
        appName: app.appName,
        icons: {
          favicons: true,
          android: true,
          appleIcon: true,
          appleStartup: true,
          firefox: true,
          windows: true,
          coast: false,
          yandex: false,
        },
      },
    })
  )
}

if (DEV) {
  config.plugins.push(new webpack.HotModuleReplacementPlugin())
  config.plugins.push(
    new WatchMissingNodeModulesPlugin(path.resolve(workDir, 'node_modules'))
  )
  config.plugins.push(new ReactRefreshWebpackPlugin())
  config.plugins.push(
    new ESLintPlugin({
      extensions: ['js', 'ts', 'jsx', 'tsx', 'vue'],
      fix: true,
      lintDirtyModulesOnly: true,
    })
  )
}

if (PRODUCT) {
  config.plugins.push(
    new MiniCSSExtractPlugin({
      ignoreOrder: true,
      filename: '[name].[contenthash].css',
      chunkFilename: '[id].[contenthash].css',
    })
  )
  config.plugins.push(
    new WorkboxWebpackPlugin.GenerateSW({
      clientsClaim: true,
      exclude: [/\.map$/, /asset-manifest\.json$/],
      // navigateFallback: 'index.html',
      // navigateFallbackBlacklist: [
      //   // Exclude URLs starting with /_, as they're likely an API call
      //   new RegExp('^/_'),
      //   // Exclude URLs containing a dot, as they're likely a resource in
      //   // public/ and not a SPA route
      //   new RegExp('/[^/]+\\.[^/]+$'),
      // ],
    })
  )

  const hasPublicDir = fs.existsSync(publicDir)

  if (hasPublicDir) {
    config.plugins.push(
      new CopyWebpackPlugin({
        patterns: [
          {
            from: publicDir,
            to: outputDir,
            noErrorOnMissing: true,
            globOptions: {
              ignore: ['**/*.ejs', '**/*.md'],
            },
          },
        ],
      })
    )
  }

  if (argv.ana) {
    // bundle analyzer
    config.plugins.push(
      new BundleAnalyzerPlugin({
        // generateStatsFile: true
      })
    )
  }

  // config.optimization.splitChunks.cacheGroups = {
  //   styles: {
  //     name: 'styles',
  //     test: /\.css$/,
  //     chunks: 'all',
  //     enforce: true
  //   }
  // }
}

module.exports = config
