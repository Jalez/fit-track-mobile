const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  // Add configuration for React Native Reanimated
  resolver: {
    sourceExts: ['js', 'jsx', 'ts', 'tsx', 'json', 'cjs'],
    extraNodeModules: {
      'react-native-reanimated': require.resolve('react-native-reanimated'),
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
