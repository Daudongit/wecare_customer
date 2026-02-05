const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { wrapWithReanimatedMetroConfig } = require('react-native-reanimated/metro-config');

const baseConfig = getDefaultConfig(__dirname);

const customConfig = {
  transformer: {
    ...baseConfig.transformer,
    sourceMap: false, // disable source maps
  },
};

module.exports = mergeConfig(
  wrapWithReanimatedMetroConfig(baseConfig),
  customConfig
);
