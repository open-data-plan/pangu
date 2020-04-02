module.exports = {
  sourceMap: true,
  plugins: [
    require('postcss-flexbugs-fixes'),
    // require('postcss-url')(),
    require('postcss-preset-env')({
      stage: 0,
    }),
    require('postcss-normalize')(),
  ],
}
