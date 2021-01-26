module.exports = {
  plugins: [
    [
      'module-resolver',
      {
        root: ['.'],
        alias: {
          src: './src'
        }
      }
    ],
    'react-native-reanimated/plugin',
    ['@babel/plugin-proposal-decorators', { legacy: true }]
  ],
  presets: ['module:metro-react-native-babel-preset']
}
