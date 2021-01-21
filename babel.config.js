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
    'react-native-reanimated/plugin'
  ],
  presets: ['module:metro-react-native-babel-preset']
}
