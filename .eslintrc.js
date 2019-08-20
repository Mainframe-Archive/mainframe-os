module.exports = {
  extends: ['mainframe', 'mainframe/flow', 'mainframe/react-native-web'],
  settings: {
    react: {
      version: '16.9',
      flowVersion: '0.104',
    },
  },
  rules: {
    'react-native/no-raw-text': 'warn',
    'react-native/sort-styles': 'off',
  },
}
