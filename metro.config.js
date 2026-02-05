const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Add CSS support for web
config.resolver.sourceExts.push('css');

// ✅ NUEVO: Agregar soporte para workers y import.meta
config.transformer = {
  ...config.transformer,
  getTransformOptions: async () => ({
    transform: {
      experimentalImportSupport: true,
      inlineRequires: true,
    },
  }),
};

// ✅ NUEVO: Asegurar que los assets de fuentes se manejen correctamente
config.resolver.assetExts = [
  ...config.resolver.assetExts,
  'ttf',
  'otf',
  'woff',
  'woff2',
];

module.exports = withNativeWind(config, {
  input: "./global.css",
  // Force write CSS to file system instead of virtual modules
  // This fixes iOS styling issues in development mode
  forceWriteFileSystem: true,
});