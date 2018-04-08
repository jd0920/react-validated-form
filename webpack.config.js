module.exports = {
  entry: './src/index.js',
  resolve: {
    extensions: ['.js', '.jsx']
  },
  output: {
    filename: 'react-validated-form.js',
    libraryTarget: 'umd',
    library: 'react-validated-form',
    umdNamedDefine: true
  },
  module: {
    rules: [
      { test: /(\.js[x]?$)/, use: {loader: 'babel-loader'} }
    ]
  }
}
