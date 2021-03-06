import path from 'path'
import webpack from 'webpack'

export default {
  entry: {
    react: [
      'apollo-client',
      'es6-promise',
      'graphql-tag',
      'immutability-helper',
      'isomorphic-fetch',
      'jwt-decode',
      'react',
      'react-apollo',
      'react-cookie',
      'react-dom',
      'react-helmet',
      'react-redux',
      'react-router',
      'react-router-scroll/lib/useScroll',
      'react-router-redux',
      'redux',
    ],
  },

  output: {
    filename: 'vendor-[name].js',
    path: path.join(__dirname, 'static', 'build'),
    library: '[name]_lib',
  },

  plugins: [
    new webpack.DllPlugin({
      path: path.join(__dirname, 'static', 'build', '[name]-manifest.json'),
      name: '[name]_lib',
    }),
  ],
}
