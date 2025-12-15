// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const { withUniwindConfig } = require("uniwind/metro");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add wasm asset support
config.resolver.assetExts.push('wasm');

// Selectively enable package exports for Uniwind and jotai
config.resolver.resolveRequest = (context, moduleName, platform) => {
  // uniwind and its dependency (jotai) require unstable_enablePackageExports to be true
  if (['uniwind', 'jotai'].some((prefix) => moduleName.startsWith(prefix))) {
    const newContext = {
      ...context,
      unstable_enablePackageExports: true,
    };

    return context.resolveRequest(newContext, moduleName, platform);
  }

  // default behavior for everything else
  return context.resolveRequest(context, moduleName, platform);
};

config.resolver.unstable_conditionNames = [
  'browser',
  'require',
  'react-native',
]
 
// Add COEP and COOP headers to support SharedArrayBuffer
config.server.enhanceMiddleware = (middleware) => {
  return (req, res, next) => {
    res.setHeader('Cross-Origin-Embedder-Policy', 'credentialless');
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    middleware(req, res, next);
  };
};

module.exports = withUniwindConfig(config, {
  cssEntryFile: "./app/global.css",
  dtsFile: "./uniwind-types.d.ts",
  debug: true,
});


// const { getDefaultConfig } = require("expo/metro-config");
// const { withUniwindConfig } = require("uniwind/metro");

// let config = getDefaultConfig(__dirname);

// // 1) Apply Uniwind FIRST (requires let)
// config = withUniwindConfig(config, {
//   cssEntryFile: "./app/global.css",
//   dtsFile: "./uniwind-types.d.ts",
//   debug: true,
// });

// // 2) wasm support
// config.resolver.assetExts = Array.from(
//   new Set([...(config.resolver.assetExts ?? []), "wasm"])
// );

// // 3) Wrap Uniwind resolver (DON’T bypass it)
// const uniwindResolveRequest = config.resolver.resolveRequest;

// config.resolver.resolveRequest = (context, moduleName, platform) => {
//   if (moduleName === "jotai") {
//     return uniwindResolveRequest(
//       { ...context, unstable_conditionNames: ["require", "default"] },
//       moduleName,
//       platform
//     );
//   }

//   return uniwindResolveRequest(context, moduleName, platform);
// };

// // 4) If you really need global condition names, include default
// config.resolver.unstable_conditionNames = [
//   "browser",
//   "react-native",
//   "require",
//   "default",
// ];

// // 5) COEP/COOP headers (preserve previous enhancer)
// const prevEnhance = config.server.enhanceMiddleware;
// config.server.enhanceMiddleware = (middleware) => {
//   const nextMiddleware = prevEnhance ? prevEnhance(middleware) : middleware;

//   return (req, res, next) => {
//     res.setHeader("Cross-Origin-Embedder-Policy", "credentialless");
//     res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
//     nextMiddleware(req, res, next);
//   };
// };

// module.exports = config;
