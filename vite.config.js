import reactRefresh from '@vitejs/plugin-react-refresh'

/**
 * https://vitejs.dev/config/
 * @type { import('vite').UserConfig }
 */
export default {
  plugins: [reactRefresh()],
  server: {
    host: '0.0.0.0',
    hmr: {
      port: 443,
    }
  }
}

// const webpack = require('webpack');

//   module.exports = {
//     // ...

//     plugins: [
//         // Work around for Buffer is undefined:
//         // https://github.com/webpack/changelog-v5/issues/10
//         new webpack.ProvidePlugin({
//             Buffer: ['buffer', 'Buffer'],
//         }),
//         new webpack.ProvidePlugin({
//             process: 'process/browser',
//         }),
//     ],
//         resolve: {
//         extensions: [ '.ts', '.js' ],
//         fallback: {
//             "stream": require.resolve("stream-browserify"),
//             "buffer": require.resolve("buffer")
//         }
//     }}
